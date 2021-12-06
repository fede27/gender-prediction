import * as MongoDb from 'mongodb';

import { IGenderizeKey, IGenderizePrediction } from "../interfaces/Entities";
import { ISimpleRespository } from '../interfaces/Services';



export class UserGenderRepository implements ISimpleRespository<IGenderizePrediction, IGenderizeKey>  {

    private readonly client: MongoDb.MongoClient;
    private readonly db: MongoDb.Db;
    private readonly collection: MongoDb.Collection;

    private readonly collectionName: string;
    private readonly dbName: string;

    private isConnected: boolean = false;

    constructor(uri: string) {
        this.collectionName = (process.env.MONGO_COLLECTION) ? process.env.MONGO_COLLECTION : 'UserGenders';
        this.dbName = (process.env.MONGO_DB) ? process.env.MONGO_DB: 'Core';
        this.client = new MongoDb.MongoClient(uri);
        this.db = this.client.db(this.dbName);
        this.collection = this.db.collection(this.collectionName);
    }

    async insert(item: IGenderizePrediction): Promise<boolean> {
        await this.ensureConnection();

        const result = await this.collection.insertOne(item);

        return !!result;
    }

    async getAll(): Promise<IGenderizePrediction[]> {
        await this.ensureConnection();

        const predictions = (await this.collection.find<IGenderizePrediction>({}, {projection: {_id: 0} }).toArray()) as IGenderizePrediction[];
        
        return predictions;
    }

    async getOne(key: IGenderizeKey): Promise<IGenderizePrediction> {
        await this.ensureConnection();

        const prediction = (await this.collection.findOne<IGenderizePrediction>(key, {projection: {_id: 0} })) as IGenderizePrediction;

        return prediction;
    }

    private async ensureConnection(): Promise<void> {
        if (this.isConnected) {
            return Promise.resolve();
        }

        await this.client.connect();
        this.isConnected = true;
    }

}