import { IUser, IGenderPrediction } from "../interfaces/Entities";
import { UserCache } from "./userCacheService";

let userCache: UserCache;

const mockData: Array<{user: IUser, prediction: IGenderPrediction}> = [
    {
        user: {
            userName: 'topolino',
            country: 'topolinia',
        },
        prediction: {
            name: 'topolino',
            gender: 'male',
            probability: 0.99,
            count: 10,
            country_id: 'topolinia'
        },
    },
    {
        user: {
            userName: 'minnie',
        },
        prediction: {
            name: 'minnie',
            gender: 'female',
            probability: 0.99,
            count: 10,
        },
    },
];

beforeEach(() => {
    userCache = new UserCache();
    for (const entry of mockData) {
        userCache.set(entry.user, entry.prediction);
    }
});

test('has', () => {
    expect(userCache.has(mockData[0].user)).toBeTruthy();
    expect(userCache.has(mockData[1].user)).toBeTruthy();
    expect(userCache.has({
        userName: 'not-present'
    })).toBeFalsy();
});

test('get', () => {
    expect(userCache.get(mockData[0].user)).toStrictEqual(mockData[0].prediction);
    expect(userCache.get(mockData[1].user)).toStrictEqual(mockData[1].prediction);
    expect(userCache.get({
        userName: 'not-present'
    })).toBeFalsy();
});
