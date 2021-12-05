import Fastify, { FastifyInstance } from 'fastify';

import GenderCachedService from './services/genderCachedService';
import { UserCache } from './services/userCacheService';

import { GenderAPISchema } from './interfaces/API';
import { IUser } from './interfaces/Entities';

const server: FastifyInstance = Fastify({ logger: true });

const cache = new UserCache();

server.get('/', async (request, reply) => {
    server.log.error(`it works!`);
    reply.send({hello: "world"});
});

server.post<{ Body: { userPredictions: IUser[] } }>('/user/genderprediction', {schema: GenderAPISchema }, async (request, reply) => {
    server.log.info(`gender-prediction request: ${ JSON.stringify(request.body) }`);
    const genderService = new GenderCachedService(cache);
    const { userPredictions } = request.body;

    const response = await genderService.classify(userPredictions);
    reply.send(response);
});


const start = async () => {
    try {
        await server.listen(3001);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
start();

