/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, createTRPCRouter } from '../trpc';
import { applicantRoomRouter } from './applicantroom';
import { callingRouter } from './calling';
import { userRouter } from './user';


export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => 'yay!'),
  calling: callingRouter,
  user: userRouter,
  applicantRoom: applicantRoomRouter
});

export type AppRouter = typeof appRouter;
