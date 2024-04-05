import { FastifyReply, FastifyRequest } from 'fastify'
import {
  RegisterToEventRequestBody,
  RegisterToEventRequestParams,
} from './routes'
import { prisma } from '../../lib/prisma'

export async function register(
  request: FastifyRequest<{
    Body: RegisterToEventRequestBody
    Params: RegisterToEventRequestParams
  }>,
  reply: FastifyReply,
) {
  const { name, email } = request.body
  const { eventId } = request.params

  const attendeeAlreadyRegisteredToEvent = await prisma.attendee.findFirst({
    where: {
      eventId_email: {
        email,
        eventId,
      },
    },
  })

  if (attendeeAlreadyRegisteredToEvent) {
    return reply.status(200).send({
      message: 'You are already registered to this event',
    })
  }

  const eventExists = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  })

  if (!eventExists) {
    return reply.status(400).send({
      message: 'Event not found',
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
