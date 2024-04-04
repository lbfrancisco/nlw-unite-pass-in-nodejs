import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'
import z from 'zod'
import { generateSlug } from '../../utils/generate-slug'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createEventBodySchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.coerce.number().int().positive().nullable(),
  })

  const { title, details, maximumAttendees } = createEventBodySchema.parse(
    request.body,
  )

  const slug = generateSlug(title)

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug,
    },
  })

  return reply.status(201).send({
    event,
  })
}
