import { IUser, IGenderizePrediction, IPredictionResponse } from "./Entities";

export interface ICacheService {
    has(user: IUser): boolean;
    get(user: IUser): IGenderizePrediction;
    set(user: IUser, prediction: IGenderizePrediction): void;
}


export interface IGenderClassifier {
    classify(usersToPredict: IUser[]): Promise<IGenderizePrediction[]>;
    getServiceResponse(usersToPredict: IUser[]): Promise<IPredictionResponse>;
}

export interface ISimpleRespository<T, IdType> {
    insert(item: T): Promise<boolean>;
    getAll(): Promise<T[]>;
    getOne(key: IdType): Promise<T>;
}

export interface ISynchronizableCacheService<T, IdType> extends ICacheService {
    setRepository(repository: ISimpleRespository<T, IdType>): void;
    load(): Promise<void>
    save(): Promise<void>;
}