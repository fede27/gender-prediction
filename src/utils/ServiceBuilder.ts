import { IGenderClassifier } from "../interfaces/Services";
import GenderCachedService from "../services/genderCachedService";
import { SynchronizableCache } from "../services/synchronizableCacheService";
import { UserGenderRepository } from '../respositories/userGenderRepository';

export default abstract class GenderServiceBuilder {
    public abstract getService(): Promise<IGenderClassifier>;
}


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