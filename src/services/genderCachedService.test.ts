import Nock from 'nock';
import { UserCache } from './userCacheService';

import GenderCachedService from './genderCachedService';
import { IGenderizeKey, IGenderizePrediction, IUser } from '../interfaces/Entities';
import { ISimpleRespository, ISynchronizableCacheService } from '../interfaces/Services';

const mockRequest = [
    {
        userName: 'peter',
        country: 'FR',
    },
    {
        userName: 'lois',
        country: 'FR',
    },
    {
        userName: 'andrea',
        country: 'FR',
    }
];

const mockResponse = [
    {
        name: "peter",
        gender: "male",
        probability: 0.98,
        count: 3714,
        country_id: "FR"
    },
    {
        name: "lois",
        gender: "male",
        probability: 0.65,
        count: 488,
        country_id:"FR"
    },
    {
        name: "andrea",
        gender: "female",
        probability: 0.85,
        count:5818,
        country_id:"FR"
    }
];

const mockServiceResponse = {
    males: [
        {
            name: "peter",
            probability: 0.98,
            count: 3714,
            country: "FR"
        },
        {
            name: "lois",
            probability: 0.65,
            count: 488,
            country:"FR"
        },
    ],
    females: [
        {
            name: "andrea",
            probability: 0.85,
            count:5818,
            country:"FR"
        } 
    ],
}

class MockCache extends UserCache implements ISynchronizableCacheService<IGenderizePrediction, IGenderizeKey> {
    
    setRepository(repository: ISimpleRespository<IGenderizePrediction, IGenderizeKey>): void {
        throw new Error('Method not implemented.');
    }
    
    load(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public setCount: number = 0;
    public getCount: number = 0;

    public get(user: IUser): IGenderizePrediction {
        this.getCount++;
        return super.get(user);
    }

    public set(user: IUser, prediction: IGenderizePrediction): void {
        this.setCount++;
        super.set(user, prediction);
    }

    public async save(): Promise<void> {
        return;
    }
}

let scope: Nock.Scope = null;

beforeAll(() => {
    scope = Nock('https://api.genderize.io')
        .get('/?country_id=FR&name[]=peter&name[]=lois&name[]=andrea')
        .reply(200, mockResponse)
        .persist();
});

test('classify', async () => {
    const mockCache = new MockCache();
    const genderService = new GenderCachedService(mockCache);
    await genderService.classify(mockRequest);
    await genderService.classify(mockRequest);
    expect(mockCache.setCount).toBe(3);
    expect(mockCache.getCount).toBeGreaterThanOrEqual(mockCache.setCount);
});



afterAll(() => {
    scope.persist(false);
});