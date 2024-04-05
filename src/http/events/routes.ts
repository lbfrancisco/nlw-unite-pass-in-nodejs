import { FastifyInstance } from 'fastify'
import { create } from './create'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { register } from './register'

const CreateEventRequestBodySchema = z.object({
  title: z.string().min(4),
  details: z.string().nullable(),
  maximumAttendees: z.coerce.number().int().positive().nullable(),
})

export type CreateEventRequestBody = z.infer<
  typeof CreateEventRequestBodySchema
>

const RegisterToEventRequestBodySchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
})

export type RegisterToEventRequestBody = z.infer<
  typeof RegisterToEventRequestBodySchema
>

const RegisterToEventRequestParamsSchema = z.object({
  eventId: z.string().uuid(),
})

export type RegisterToEventRequestParams = z.infer<
  typeof RegisterToEventRequestParamsSchema
>

export async function eventsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: {
      body: CreateEventRequestBodySchema,
      response: {
        201: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
    handler: create,
  })

  app.withTypeProvider<ZodTypeProvider>().post('/:eventId/attendee', {
    schema: {
      body: RegisterToEventRequestBodySchema,
      params: RegisterToEventRequestParamsSchema,
      response: {
        201: z.object({
          attendeeId: z.number().int().positive(),
        }),
      },
    },
    handler: register,
  })
}
