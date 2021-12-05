
export interface IUser {
    userName: string;
    country?: string;
}

export interface IUserPredictions {
    userPredictions: IUser[];
}

export interface IGenderPrediction {
    name: string;
    gender: string;
    probability: number;
    count: number;
    country_id?: string;
}

export interface IPredictionResponse {
    males?: IGenderPrediction[];
    females?: IGenderPrediction[];
}