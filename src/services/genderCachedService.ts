

import { IGenderizeKey, IGenderizePrediction, IUser } from '../interfaces/Entities';
import { IGenderClassifier, ISynchronizableCacheService } from '../interfaces/Services';

import ArrayUtils from '../utils/ArrayUtils';
import GenderService from './genderService';


/**
 * A Gender Service that supports cache mechanisms. Requests are sent to the genderize.io service only when needed
 */
export default class GenderCachedService extends GenderService implements IGenderClassifier {

    public constructor(private readonly cache: ISynchronizableCacheService<IGenderizePrediction, IGenderizeKey>, maxRequestChunkSize: number = 10) {
        super(maxRequestChunkSize);
    }

    public async classify(usersToPredict: IUser[]): Promise<IGenderizePrediction[]> {
        const userWithoutDuplicates = ArrayUtils.filterDuplicates(usersToPredict);
        const cachedResponses = userWithoutDuplicates.filter((user) => this.cache.has(user)).map((user) => this.cache.get(user));
        const uncachedUsers = userWithoutDuplicates.filter((user) => !this.cache.has(user));
        const uncachedResponses = await super.classify(uncachedUsers);

        await this.updateCache(uncachedUsers, uncachedResponses);
        return cachedResponses.concat(uncachedResponses);
    }

    /**
     * Update the internal cache with the new results from genderize.io and flush the changes
     * @param users user to add to the cache
     * @param predictions genderize.io responses for these users
     */
    protected async updateCache(users: IUser[], predictions: IGenderizePrediction[]): Promise<void> {
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
        await this.cache.save();
    }
}