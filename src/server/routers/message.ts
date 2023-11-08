import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { prisma } from '../prisma';
import { z } from 'zod';

export const messageRouter = createTRPCRouter({
  //Lista todos los mensajes de una sala especificada y además permite mostrar los datos del usuario y room no solo en base a su id sino usando al objeto
  findMany: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.message?.findMany({
        include: { User: true, ApplicantRoom: true },
        where: { applicantRoomId: input.roomId },
      });
    }),
  findOne: publicProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.message?.findUnique({ where: { id: input } });
  }),
  //Crea un mensaje en base de datos
  addMessage: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        roomId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await prisma.message.create({
        data: {
          id: Math.random().toString(),
          userId: ctx.session.user.id,
          userName: ctx.session.user.name,
          applicantRoomId: input.roomId,
          createdAt: new Date(),
          updatedAt: new Date(),
          text: input.text,
        },
      });
    }),
});
