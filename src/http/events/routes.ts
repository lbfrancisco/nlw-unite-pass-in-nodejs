import { FastifyInstance } from 'fastify'
import { create } from './create'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

// Defina um tipo para o corpo da solicitação
export interface CreateEventRequestBody {
  title: string
  details?: string | null
  maximumAttendees?: number | null
}

export async function eventsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/', {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.coerce.number().int().positive().nullable(),
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
    handler: create,
  })
}
