import { FastifyReply, FastifyRequest } from 'fastify'
import { RegisterToEventRequestBody, RequestEventIdOnParams } from './routes'
import { prisma } from '../../lib/prisma'
import { BadRequest } from '../_errors/bad-request'

export async function register(
  request: FastifyRequest<{
    Body: RegisterToEventRequestBody
    Params: RequestEventIdOnParams
  }>,
  reply: FastifyReply,
) {
  const { name, email } = request.body
  const { eventId } = request.params

  const attendeeAlreadyRegisteredToEvent = await prisma.attendee.findUnique({
    where: {
      eventId_email: {
        email,
        eventId,
      },
    },
  })

  if (attendeeAlreadyRegisteredToEvent) {
    throw new BadRequest('This e-mail is already registered to this event.')
  }

  const [event, amountOfAttendeesForEvent] = await Promise.all([
    prisma.event.findUnique({
      where: {
        id: eventId,
      },
    }),

    prisma.attendee.count({
      where: {
        eventId,
      },
    }),
  ])

  if (!event) {
    throw new BadRequest('Event not found.')
  }

  if (
    event?.maximumAttendees &&
    amountOfAttendeesForEvent >= event?.maximumAttendees
  ) {
    return reply.status(406).send({
      message: 'The maximum number of attendees for this event exceeds.',
    })
  }

  const attendee = await prisma.attendee.create({
    data: {
      name,
      email,
      eventId,
    },
  })

  return reply.status(201).send({
    attendeeId: attendee.id,
  })
}
