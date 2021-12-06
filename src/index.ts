import Fastify, { FastifyInstance } from 'fastify';
import * as Dotenv from 'dotenv';

Dotenv.config();

import { GenderAPISchema } from './interfaces/API';
import { IUser } from './interfaces/Entities';
import { CachedGenderServiceBuilder } from './utils/ServiceBuilder';
import { IGenderClassifier } from './interfaces/Services';


const server: FastifyInstance = Fastify({ logger: { level: "debug" } });

let genderService: IGenderClassifier;

server.post<{ Body: { userPredictions: IUser[] } }>('/user/genderprediction', {schema: GenderAPISchema }, async (request, reply) => {
    server.log.info(`gender-prediction request: ${ JSON.stringify(request.body) }`);
    try {
        const { userPredictions } = request.body;

        const response = await genderService.getServiceResponse(userPredictions);
        reply.send(response);
    } catch (error) {
        server.log.error(`gender-prediction got error: ${ error }`);
        reply.code(500).send({
            code: 500,
            error: 'internal server error', 
        });
    }
});


const start = async () => {
    try {
        genderService = await (new CachedGenderServiceBuilder()).getService();
        const port = process.env.PORT ?  process.env.PORT : 3001;
        await server.listen(port);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
start();

