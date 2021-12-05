import Got from 'got';
import * as QueryString from 'query-string';

import { IGenderizePrediction, IGenderServicePrediction, IPredictionResponse, IUser } from '../interfaces/Entities';
import { IGenderClassifier } from '../interfaces/Services';

import ArrayUtils from '../utils/ArrayUtils';



export default class GenderService implements IGenderClassifier {

    private static readonly unknownCountryId = 'unknown';
    private static readonly genderizeUrl = 'https://api.genderize.io/';

    public constructor(private readonly maxRequestChunkSize: number = 10) {
    }

    public async classify(usersToPredict: IUser[]): Promise<IGenderizePrediction[]> {
        const usersClassified: IGenderizePrediction[] = [];
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

    public async getServiceResponse(usersToPredict: IUser[]): Promise<IPredictionResponse> {
        const convertToServiceResponse = (genderizePrediction: IGenderizePrediction): IGenderServicePrediction => {
            const { gender, country_id, ...remainder } = genderizePrediction;
            return {country: country_id, ...remainder};
        }

        const rawResponses = await this.classify(usersToPredict);
        const groupedBy = ArrayUtils.groupBy(rawResponses, 'gender');

        const response: IPredictionResponse = {
            males: [],
            females: [],
        }

        if (groupedBy['male']) {
            response.males = groupedBy['male'].map((item) => convertToServiceResponse(item)); 
        }

        if (groupedBy['female']) {
            response.females = groupedBy['female'].map((item) => convertToServiceResponse(item));
        }

        return response;
    }


    private async serviceRequest(names: string[], countryId?: string): Promise<IGenderizePrediction[]> {
        const queryString = QueryString.stringify({
            name: names,
            country_id: countryId,
        }, {
            arrayFormat: 'bracket',
        });

        const response = await Got.get(`${ GenderService.genderizeUrl }?${ queryString }`).json() as IGenderizePrediction[];

        return response;
    }

}