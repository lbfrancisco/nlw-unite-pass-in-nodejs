import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'
import { generateSlug } from '../../utils/generate-slug'
import { CreateEventRequestBody } from './routes'

export async function create(
  request: FastifyRequest<{ Body: CreateEventRequestBody }>,
  reply: FastifyReply,
) {
  const { title, details, maximumAttendees } = request.body

  const slug = generateSlug(title)

  const eventSlugAlreadyExists = await prisma.event.findUnique({
    where: {
      slug,
    },
  })

  if (eventSlugAlreadyExists) {
    return reply.status(400).send({
      message: 'Another event with same title already exist',
    })
  }

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug,
    },
  })

  return reply.status(201).send({
    eventId: event.id,
  })
}
