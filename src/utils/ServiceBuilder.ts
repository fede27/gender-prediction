import { IGenderClassifier } from "../interfaces/Services";
import GenderCachedService from "../services/genderCachedService";
import { SynchronizableCache } from "../services/synchronizableCacheService";
import { UserGenderRepository } from '../respositories/userGenderRepository';

/**
 * Base abstract class for building a gender classifier service
 * @returns {IGenderClassifier} A gender classifier service configured and ready to use
 */
export default abstract class GenderServiceBuilder {
    public abstract getService(): Promise<IGenderClassifier>;
}




/**
 * Class used for getting a cached gender classifier
 * @returns {IGenderClassifier} A gender classifier service configured and ready to use
 */
export class CachedGenderServiceBuilder extends GenderServiceBuilder {

    public async getService(): Promise<IGenderClassifier> {
        const repository = new UserGenderRepository(String(process.env.MONGO_URI));
        const cache = new SynchronizableCache();
        cache.setRepository(repository);
        cache.load();
        const batchSize = process.env.GENDERIZE_BATCH_SIZE ? Number.parseInt(process.env.GENDERIZE_BATCH_SIZE) : 10;
        return new GenderCachedService(cache, batchSize);
    }
}