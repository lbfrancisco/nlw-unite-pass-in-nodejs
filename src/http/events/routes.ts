import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { create } from './create'
import { register } from './register'
import { get } from './get'

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

const RequestEventIdOnParamsSchema = z.object({
  eventId: z.string().uuid(),
})

export type RequestEventIdOnParams = z.infer<
  typeof RequestEventIdOnParamsSchema
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
      params: RequestEventIdOnParamsSchema,
      response: {
        201: z.object({
          attendeeId: z.number().int().positive(),
        }),
      },
    },
    handler: register,
  })

  app.withTypeProvider<ZodTypeProvider>().get('/:eventId', {
    schema: {
      params: RequestEventIdOnParamsSchema,
      response: {
        200: z.object({
          event: z.object({
            id: z.string().uuid(),
            title: z.string(),
            slug: z.string(),
            details: z.string().nullable(),
            maximumAttendees: z.number().nullable(),
            attendeesAmount: z.number().nullable(),
          }),
        }),
      },
    },
    handler: get,
  })
}
