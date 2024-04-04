import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function eventsRoutes(app: FastifyInstance) {
  app.post('/', create)
}
