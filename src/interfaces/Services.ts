import { IUser, IGenderizePrediction, IPredictionResponse } from "./Entities";


export interface IServiceCache {
    has(user: IUser): boolean;
    get(user: IUser): IGenderizePrediction;
    set(user: IUser, prediction: IGenderizePrediction): void;
}

export interface IGenderClassifier {
    classify(usersToPredict: IUser[]): Promise<IGenderizePrediction[]>;
    getServiceResponse(usersToPredict: IUser[]): Promise<IPredictionResponse>;
}