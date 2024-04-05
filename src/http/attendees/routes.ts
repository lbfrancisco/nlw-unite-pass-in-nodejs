import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { getBadge } from './get-badge'

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
      response: {},
    },
    handler: getBadge,
  })
}
