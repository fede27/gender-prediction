import Got from 'got';
import * as QueryString from 'query-string';

import { IGenderPrediction, IUser } from '../interfaces/Entities';
import { IGenderClassifier } from '../interfaces/Services';

import ArrayUtils from '../utils/ArrayUtils';



export default class GenderService implements IGenderClassifier {

    private static readonly unknownCountryId = 'unknown';
    private static readonly genderizeUrl = 'https://api.genderize.io/';

    public constructor(private readonly maxRequestChunkSize: number = 10) {
    }

    public async classify(usersToPredict: IUser[]): Promise<IGenderPrediction[]> {
        const usersClassified: IGenderPrediction[] = [];
        const usersGroupedByCountry = ArrayUtils.groupBy(ArrayUtils.filterDuplicates(usersToPredict), 'country', GenderService.unknownCountryId);

        for (const country in usersGroupedByCountry) {
            const chunks = ArrayUtils.splitIntoChunks(usersGroupedByCountry[country], this.maxRequestChunkSize);
            for (const chunk of chunks) {
                const countryId = (country === GenderService.unknownCountryId) ? undefined : country;
                const names = chunk.map((item) => item.userName);
                const predictions = await this.serviceRequest(names, countryId);
                usersClassified.push(...predictions);
            }
        }

        return usersClassified;
    }


    private async serviceRequest(names: string[], countryId?: string): Promise<IGenderPrediction[]> {
        const queryString = QueryString.stringify({
            name: names,
            country_id: countryId,
        }, {
            arrayFormat: 'bracket',
        });

        const response = await Got.get(`${ GenderService.genderizeUrl }?${ queryString }`).json() as IGenderPrediction[];

        return response;
    }

}