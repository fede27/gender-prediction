import hash from 'object-hash';

import { IGenderizePrediction, IUser } from '../interfaces/Entities';
import { ICacheService } from '../interfaces/Services';


export class UserCache implements ICacheService {

    protected cache: {[hash: string]: IGenderizePrediction} = { };

    public constructor() {};

    public has(user: IUser): boolean {
        return !!this.cache[this.getHash(user)];
    }

    public get(user: IUser): IGenderizePrediction {
        return this.cache[this.getHash(user)];
    }

    public set(user: IUser, prediction: IGenderizePrediction): void {
        this.cache[this.getHash(user)] = { ...prediction };
    }

    protected getHash(user: IUser): string {
        return hash(user);
    }

    protected clear() {
        this.cache = {};
    }
}