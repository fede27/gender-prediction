import { IUser, IGenderPrediction } from "./Entities";


export interface IServiceCache {
    has(user: IUser): boolean;
    get(user: IUser): IGenderPrediction;
    set(user: IUser, prediction: IGenderPrediction): void;
}

export interface IGenderClassifier {
    classify(usersToPredict: IUser[]): Promise<IGenderPrediction[]>
}