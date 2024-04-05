import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { eventsRoutes } from './http/events/routes'
import { attendeesRoutes } from './http/attendees/routes'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(eventsRoutes, {
  prefix: 'events',
})

app.register(attendeesRoutes, {
  prefix: 'attendees',
})
