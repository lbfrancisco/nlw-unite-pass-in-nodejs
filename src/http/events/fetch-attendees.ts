import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../lib/prisma'
import { RequestEventIdOnParams, RequestPageIndexQueryString } from './routes'
import { BadRequest } from '../_errors/bad-request'

export async function fetchAttendees(
  request: FastifyRequest<{
    Params: RequestEventIdOnParams
    Querystring: RequestPageIndexQueryString
  }>,
  reply: FastifyReply,
) {
  const { eventId } = request.params
  const { pageIndex, query } = request.query

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  })

  if (!event) {
    throw new BadRequest('Event not found.')
  }

  const attendees = await prisma.attendee.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      checkIn: {
        select: {
          createdAt: true,
        },
      },
    },
    where: query
      ? {
          eventId,
          name: {
            contains: query,
          },
        }
      : {
          eventId,
        },
    take: 10,
    skip: pageIndex * 10,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return reply.send({
    attendees: attendees.map((attendee) => {
      return {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        createdAt: attendee.createdAt,
        checkInAt: attendee.checkIn?.createdAt ?? null,
      }
    }),
  })
}
