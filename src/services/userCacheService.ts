import hash from 'object-hash';

import { IGenderPrediction, IUser } from '../interfaces/Entities';
import { IServiceCache } from '../interfaces/Services';


export class UserCache implements IServiceCache {

    private cache: {[hash: string]: IGenderPrediction} = { };

    public constructor() {};

    public has(user: IUser): boolean {
        return !!this.cache[this.getHash(user)];
    }

    public get(user: IUser): IGenderPrediction {
        return this.cache[this.getHash(user)];
    }

    public set(user: IUser, prediction: IGenderPrediction): void {
        this.cache[this.getHash(user)] = { ...prediction };
    }

    private getHash(user: IUser): string {
        return hash(user);
    }
}