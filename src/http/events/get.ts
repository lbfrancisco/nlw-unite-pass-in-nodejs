import { FastifyReply, FastifyRequest } from 'fastify'
import { RequestEventIdOnParams } from './routes'
import { prisma } from '../../lib/prisma'
import { BadRequest } from '../_errors/bad-request'

export async function get(
  request: FastifyRequest<{
    Params: RequestEventIdOnParams
  }>,
  reply: FastifyReply,
) {
  const { eventId } = request.params

  const event = await prisma.event.findUnique({
    select: {
      id: true,
      title: true,
      slug: true,
      details: true,
      maximumAttendees: true,
      _count: {
        select: {
          Attendee: true,
        },
      },
    },
    where: {
      id: eventId,
    },
  })

  if (!event) {
    throw new BadRequest('Event not found.')
  }

  return reply.send({
    event: {
      id: event.id,
      title: event.title,
      slug: event.slug,
      details: event.details,
      maximumAttendees: event.maximumAttendees,
      attendeesAmount: event._count.Attendee,
    },
  })
}
