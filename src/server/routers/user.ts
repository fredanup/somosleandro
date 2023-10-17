import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "server/prisma";
import { z } from "zod";
import { userSchema } from "utils/auth";
import { Events, ee } from "./room";

export const userRouter = createTRPCRouter({
  //Listar a todos los usuarios
  findMany: publicProcedure.query(async () => {
    const users = await prisma.user.findMany();
    return users;
  }),
  findOne: publicProcedure.input(z.string()).query(async ({ input }) => {
    const user = await prisma.user.findUnique({ where: { id: input } });
    return user;
  }),
    updateUser: protectedProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name:input.name,
          lastName:input.lastName,  
          address:input.address,          
          phone:input.phone,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),
  updateRoom: protectedProcedure
  .input(z.object({ roomId: z.string() }))
  .mutation(async ({ input,ctx }) => {
    const user = await prisma.user.updateMany({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        roomId: input.roomId,
      },
    });
    ee.emit(Events.ENTER_ROOM, {
      roomId: input.roomId,
      userId: ctx.session.user.id,
    });
    return user;
  }),
});
