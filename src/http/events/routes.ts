import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { create } from './create'
import { register } from './register'
import { get } from './get'
import { fetchAttendees } from './fetch-attendees'

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

const RequestPageIndexStringSchema = z.object({
  pageIndex: z.string().nullish().default('0').transform(Number),
  query: z.string().nullish(),
})

export type RequestPageIndexQueryString = z.infer<
  typeof RequestPageIndexStringSchema
>

export async function eventsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: {
      summary: 'Create an event',
      tags: ['events'],
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
      summary: 'Register an attendee',
      tags: ['attendees'],
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
      summary: 'Get an event',
      tags: ['events'],
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

  app.withTypeProvider<ZodTypeProvider>().get('/:eventId/attendees', {
    schema: {
      summary: 'Get event attendees',
      tags: ['events'],
      params: RequestEventIdOnParamsSchema,
      querystring: RequestPageIndexStringSchema,
      response: {
        // 200: z.any(),
        200: z.object({
          attendees: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().email(),
              createdAt: z.date(),
              checkedInAt: z.date().nullable(),
            }),
          ),
        }),
      },
    },
    handler: fetchAttendees,
  })
}
