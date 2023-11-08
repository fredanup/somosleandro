/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, createTRPCRouter } from '../trpc';
import { applicantRoomRouter } from './applicantroom';
import { callingRouter } from './calling';
import { documentRouter } from './document';
import { messageRouter } from './message';
import { roomRouter } from './room';
import { userRouter } from './user';
import { videoRouter } from './video';

export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => 'yay!'),
  calling: callingRouter,
  user: userRouter,
  applicantRoom: applicantRoomRouter,
  document: documentRouter,
  message: messageRouter,
  video: videoRouter,
  room: roomRouter,
});

export type AppRouter = typeof appRouter;
