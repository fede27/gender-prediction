import Fastify, { FastifyInstance } from 'fastify';

import { GenderAPISchema } from './interfaces/API';
import { IUser } from './interfaces/Entities';
import { CachedGenderServiceBuilder } from './utils/ServiceBuilder';

const server: FastifyInstance = Fastify({ logger: true });

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

