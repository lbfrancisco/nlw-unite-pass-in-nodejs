import { FastifyReply, FastifyRequest } from 'fastify'
import { RequestAttendeeIdOnParams } from './routes'
import { prisma } from '../../lib/prisma'

export async function getBadge(
  request: FastifyRequest<{ Params: RequestAttendeeIdOnParams }>,
  reply: FastifyReply,
) {
  const { attendeeId } = request.params

  const attendee = await prisma.attendee.findUnique({
    select: {
      name: true,
      email: true,
      event: {
        select: {
          title: true,
        },
      },
    },
    where: {
      id: attendeeId,
    },
  })

  if (!attendee) {
    return reply.status(400).send({
      message: 'Attendee not found.',
    })
  }

  const baseURL = `${request.protocol}://${request.hostname}`

  const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

  return reply.send({
    badge: {
      name: attendee.name,
      email: attendee.email,
      eventTitle: attendee.event.title,
      checkInURL: checkInURL.toString(),
    },
  })
}
