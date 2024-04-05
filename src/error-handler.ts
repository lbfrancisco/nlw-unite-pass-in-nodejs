import { FastifyInstance } from 'fastify'
import { BadRequest } from './http/_errors/bad-request'
import { ZodError } from 'zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof BadRequest) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validating request failed',
      error: error.flatten().fieldErrors,
    })
  }

  return reply.status(500).send({
    message: 'Ocorreu um erro',
  })
}
