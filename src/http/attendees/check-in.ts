import { FastifyReply, FastifyRequest } from 'fastify'
import { RequestAttendeeIdOnParams } from './routes'
import { prisma } from '../../lib/prisma'

export async function checkIn(
  request: FastifyRequest<{ Params: RequestAttendeeIdOnParams }>,
  reply: FastifyReply,
) {
  const { attendeeId } = request.params

  const [attendee, attendeeCheckIn] = await Promise.all([
    prisma.attendee.findUnique({
      where: {
        id: attendeeId,
      },
    }),

    prisma.checkIn.findUnique({
      where: {
        attendeeId,
      },
    }),
  ])

  if (!attendee) {
    return reply.status(400).send({
      message: 'Attendee not found.',
    })
  }

  if (attendeeCheckIn) {
    return reply.status(406).send({
      message: 'Attendee already checked in.',
    })
  }

  await prisma.checkIn.create({
    data: {
      attendeeId,
    },
  })

  return reply.status(201).send()
}
