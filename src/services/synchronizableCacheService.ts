import { IGenderizeKey, IGenderizePrediction, IUser } from "../interfaces/Entities";
import { ISimpleRespository, ISynchronizableCacheService } from "../interfaces/Services";
import { UserCache } from "./userCacheService";

/**
 * A cache service that can use a repository for persist the items
 */
export class SynchronizableCache extends UserCache implements ISynchronizableCacheService<IGenderizePrediction, IGenderizeKey> {

    private unsavedItems: {[key: string]: IGenderizePrediction} = {};
    private repository: ISimpleRespository<IGenderizePrediction, IGenderizeKey> | null = null;

    public setRepository(repository: ISimpleRespository<IGenderizePrediction, IGenderizeKey>): void {
        this.repository = repository;
    }

    /**
     * Load the data from the repository
     */
    public async load(): Promise<void> {
        if (!this.repository) {
            throw 'No repository set';
        }

        this.clear();
        const predictions = await this.repository.getAll();
        predictions.forEach((prediction) => {
            const user = this.buildUserFromGenderizePrediction(prediction);
            this.set(user, prediction);
        });
        this.clearUnsavedItems();
    }

    /**
     * Save the new values to the repository
     */
    public async save(): Promise<void> {
        if (!this.repository) {
            throw 'No repository set';
        }

        for (const hash in this.unsavedItems) {
            this.repository.insert(this.unsavedItems[hash]);
        }
        this.clearUnsavedItems();
    }

    public set(user: IUser, prediction: IGenderizePrediction): void {
        super.set(user, prediction);
        const hash = this.getHash(user);
        this.unsavedItems[hash] = { ...prediction };
    }

    private buildUserFromGenderizePrediction(prediction: IGenderizePrediction): IUser {
        const user: IUser = {
            userName: prediction.name,
        };
        if (prediction.country_id) {
            user.country = prediction.country_id;
        }
        return user;
    }

    private clearUnsavedItems() {
        this.unsavedItems = { };
    }
}