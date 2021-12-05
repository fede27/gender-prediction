

import { IGenderPrediction, IUser } from '../interfaces/Entities';
import { IServiceCache, IGenderClassifier } from '../interfaces/Services';

import ArrayUtils from '../utils/ArrayUtils';
import GenderService from './genderService';


export default class GenderCachedService extends GenderService implements IGenderClassifier {

    public constructor(private readonly cache: IServiceCache, maxRequestChunkSize: number = 10) {
        super(maxRequestChunkSize);
    }

    public async classify(usersToPredict: IUser[]): Promise<IGenderPrediction[]> {
        const userWithoutDuplicates = ArrayUtils.filterDuplicates(usersToPredict);
        const cachedResponses = userWithoutDuplicates.filter((user) => this.cache.has(user)).map((user) => this.cache.get(user));
        const uncachedUsers = userWithoutDuplicates.filter((user) => !this.cache.has(user));
        const uncachedResponses = await super.classify(uncachedUsers);

        this.updateCache(uncachedUsers, uncachedResponses);
        return cachedResponses.concat(uncachedResponses);
    }

    private updateCache(users: IUser[], predictions: IGenderPrediction[]) {
        const userAndCountryComparer = <T>(userProp: keyof T, countryProp: keyof T): (a: T, b: T) => number => {
            return (a, b) => {
                if (String(a[userProp]).toLowerCase() === String(b[userProp]).toLowerCase()) {
                    if (a[countryProp] !== undefined && b[countryProp] !== undefined) {
                        if (a[countryProp] < b[countryProp]) {
                            return -1;
                        } else if (a[countryProp] > b[countryProp]) {
                            return 1;
                        }
                    } else if (a[countryProp] === undefined && b[countryProp] !== undefined) {
                        return -1;
                    } else if (a[countryProp] !== undefined && b[countryProp] === undefined) {
                        return 1;
                    }
                    return 0;
                }
                return String(a[userProp]).toLowerCase() < String(b[userProp]).toLowerCase() ? -1 : 1;
            };
        };

        const sortedUsers = users.sort(userAndCountryComparer('userName', 'country'));
        const sortedPredictions = predictions.sort(userAndCountryComparer('name', 'country_id'));
        for (let i = 0; i < sortedUsers.length; i++) {
            this.cache.set(sortedUsers[i], sortedPredictions[i]);
        }
    }
}