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

/**
 * Simple generic repository with basic methods for getting and inserting new items
 */
export interface ISimpleRespository<T, IdType> {
    insert(item: T): Promise<boolean>;
    getAll(): Promise<T[]>;
    getOne(key: IdType): Promise<T>;
}

/**
 * A cache service that can synchronize with a repository
 */
export interface ISynchronizableCacheService<T, IdType> extends ICacheService {
    setRepository(repository: ISimpleRespository<T, IdType>): void;
    load(): Promise<void>
    save(): Promise<void>;
}