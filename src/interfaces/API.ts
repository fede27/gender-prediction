import { FastifySchema } from 'fastify';

const predictionSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        probability: { type: 'number'},
        count: { type: 'integer' },
        country: { type: 'string' }
    },
    required: ['name', 'probability', 'count']
}

const genderRequestSchema = {
    type: 'object',
    properties: {
        userPredictions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    userName: { type: 'string' },
                    country: {type: 'string' }
                },
                required: ['userName']
            }
        }
    },
    required: ['userPredictions']
}

const genderResponseSchema = {
    200: {
        type: 'object',
        properties: {
            males: {
                type: 'array',
                items: predictionSchema,
            },
            females: {
                type: 'array',
                items: predictionSchema,
            }
        }
    }
}

/**
 * Fastify schema used by the service
 */
export const GenderAPISchema: FastifySchema = {
    body: genderRequestSchema,
    response: genderResponseSchema,
}

