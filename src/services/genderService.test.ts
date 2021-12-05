import Nock from 'nock';

import GenderService from './genderService';

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

let scope: Nock.Scope = null;

beforeAll(() => {
    scope = Nock('https://api.genderize.io')
        .get('/?country_id=FR&name[]=peter&name[]=lois&name[]=andrea')
        .reply(200, mockResponse)
        .persist();
});

test('classify', async () => {
    const genderService = new GenderService();
    const response = await genderService.classify(mockRequest);
    expect(response).toStrictEqual(mockResponse);
});

test('getServiceResponse', async () => {
    const genderService = new GenderService();
    const response = await genderService.getServiceResponse(mockRequest);
    expect(response).toStrictEqual(mockServiceResponse);
});

afterAll(() => {
    scope.persist(false);
});