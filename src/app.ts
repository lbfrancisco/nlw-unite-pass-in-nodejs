import fastify from 'fastify'
import { eventsRoutes } from './http/events/routes'

export const app = fastify()

app.register(eventsRoutes, {
  prefix: 'events',
})
