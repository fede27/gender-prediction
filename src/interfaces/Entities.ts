
export interface IUser {
    userName: string;
    country?: string;
}

export interface IUserPredictions {
    userPredictions: IUser[];
}

export interface IGenderizeKey {
    name: string;
    country_id?: string;
}

/**
 * Genderize prediction is the iterface provided by genderize.io on its outputs
 */
export interface IGenderizePrediction extends IGenderizeKey {
    gender: string;
    probability: number;
    count: number;
}

export interface IGenderServicePrediction {
    name: string;
    probability: number;
    count: number;
    country?: string;
}

/**
 * Interface for the service output
 */
export interface IPredictionResponse {
    males?: IGenderServicePrediction[];
    females?: IGenderServicePrediction[];
}