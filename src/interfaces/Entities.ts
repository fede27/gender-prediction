
export interface IUser {
    userName: string;
    country?: string;
}

export interface IUserPredictions {
    userPredictions: IUser[];
}

export interface IGenderizePrediction {
    name: string;
    gender: string;
    probability: number;
    count: number;
    country_id?: string;
}


export interface IGenderServicePrediction {
    name: string;
    probability: number;
    count: number;
    country?: string;
}
export interface IPredictionResponse {
    males?: IGenderServicePrediction[];
    females?: IGenderServicePrediction[];
}