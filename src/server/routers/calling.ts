import { z } from 'zod';

import { callingSchema, editCallingSchema } from '../../utils/auth';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const callingRouter = createTRPCRouter({
  createCalling: protectedProcedure
    .input(callingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.calling.create({
          data: {
            applicantNumber: input.applicantNumber,
            deadlineAt: input.deadlineAt,
            instrumentLiked: input.instrumentLiked,
            hasInstrument: input.hasInstrument,
            studentAge: input.studentAge,
            repertoireLiked: input.repertoireLiked,
            atHome: input.atHome,
            contractTime: input.contractTime,
            availableSchedule: input.availableSchedule,
            details: input.details,
            callingTaken: input.callingTaken,
            userId: ctx.session.user.id,
            eventType: input.eventType,
            eventDate: input.eventDate,
            eventAddress: input.eventAddress,
            serviceLength: input.serviceLength,
            hasSoundEquipment: input.hasSoundEquipment,
            musicianRequired: input.musicianRequired,
            callingType: input.callingType,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getCallings: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.calling.findMany({
        select: {
          id: true,
          applicantNumber: true,
          deadlineAt: true,
          instrumentLiked: true,
          hasInstrument: true,
          studentAge: true,
          repertoireLiked: true,
          atHome: true,
          contractTime: true,
          availableSchedule: true,
          details: true,
          callingTaken: true,
          eventType: true,
          eventDate: true,
          eventAddress: true,
          serviceLength: true,
          hasSoundEquipment: true,
          musicianRequired: true,
          callingType: true,
          User: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.log('error', error);
    }
  }),

  getUserCallings: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.calling.findMany({
        select: {
          id: true,
          applicantNumber: true,
          deadlineAt: true,
          instrumentLiked: true,
          hasInstrument: true,
          studentAge: true,
          repertoireLiked: true,
          atHome: true,
          contractTime: true,
          availableSchedule: true,
          details: true,
          callingTaken: true,
          eventType: true,
          eventDate: true,
          eventAddress: true,
          serviceLength: true,
          hasSoundEquipment: true,
          musicianRequired: true,
          callingType: true,
          User: true,
        },
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.log('error', error);
    }
  }),
  editCalling: protectedProcedure
    .input(editCallingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.calling.update({
          where: { id: input.id },
          data: {
            applicantNumber: input.applicantNumber,
            deadlineAt: input.deadlineAt,
            instrumentLiked: input.instrumentLiked,
            hasInstrument: input.hasInstrument,
            studentAge: input.studentAge,
            repertoireLiked: input.repertoireLiked,
            atHome: input.atHome,
            contractTime: input.contractTime,
            availableSchedule: input.availableSchedule,
            details: input.details,
            callingTaken: input.callingTaken,
            userId: ctx.session.user.id,
            eventType: input.eventType,
            eventDate: input.eventDate,
            eventAddress: input.eventAddress,
            serviceLength: input.serviceLength,
            hasSoundEquipment: input.hasSoundEquipment,
            musicianRequired: input.musicianRequired,
            callingType: input.callingType,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  deleteCalling: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.calling.delete({
          where: { id: input.id },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  findOne: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const singleCalling = await ctx.prisma.calling.findUnique({
        where: { id: input },
      });
      return singleCalling;
    }),
});
