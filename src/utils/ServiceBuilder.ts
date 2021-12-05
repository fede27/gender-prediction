import { IGenderClassifier } from "../interfaces/Services";
import GenderCachedService from "../services/genderCachedService";
import { UserCache } from "../services/userCacheService";

export default abstract class GenderServiceBuilder {
    public abstract getService(): IGenderClassifier;

    
}


export class CachedGenderServiceBuilder extends GenderServiceBuilder {

    public getService(): IGenderClassifier {
        const cache = new UserCache();

        return new GenderCachedService(cache);
    }
}