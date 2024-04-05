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

  return reply.send({
    attendee,
  })
}
