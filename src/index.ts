import Fastify, { FastifyInstance } from 'fastify';

import { GenderAPISchema } from './interfaces/API';
import { IUser } from './interfaces/Entities';
import { CachedGenderServiceBuilder } from './utils/ServiceBuilder';
import ArrayUtils from './utils/ArrayUtils';

const server: FastifyInstance = Fastify({ logger: true });

server.get('/', async (request, reply) => {
    server.log.error(`it works!`);
    reply.send({hello: "world"});
});

const genderService = (new CachedGenderServiceBuilder()).getService();

server.post<{ Body: { userPredictions: IUser[] } }>('/user/genderprediction', {schema: GenderAPISchema }, async (request, reply) => {
    server.log.info(`gender-prediction request: ${ JSON.stringify(request.body) }`);
    const { userPredictions } = request.body;

    const response = await genderService.getServiceResponse(userPredictions);
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

