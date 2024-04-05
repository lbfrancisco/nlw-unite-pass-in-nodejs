import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { getBadge } from './get-badge'
import { checkIn } from './check-in'

const RequestAttendeeIdOnParamsSchema = z.object({
  attendeeId: z.coerce.number().int().positive(),
})

export type RequestAttendeeIdOnParams = z.infer<
  typeof RequestAttendeeIdOnParamsSchema
>

export async function attendeesRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/:attendeeId/badge', {
    schema: {
      params: RequestAttendeeIdOnParamsSchema,
      response: {
        200: z.object({
          badge: z.object({
            name: z.string(),
            email: z.string().email(),
            eventTitle: z.string(),
            checkInURL: z.string().url(),
          }),
        }),
      },
    },
    handler: getBadge,
  })

  app.withTypeProvider<ZodTypeProvider>().get('/:attendeeId/check-in', {
    schema: {
      params: RequestAttendeeIdOnParamsSchema,
      response: {
        201: z.null(),
      },
    },
    handler: checkIn,
  })
}
