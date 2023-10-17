/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, createTRPCRouter } from '../trpc';
import { callingRouter } from './calling';
import { observable } from '@trpc/server/observable';
import { clearInterval } from 'timers';
import { videoRouter } from './video';
import { documentRouter } from './document';
import { userRouter } from './user';
import { roomRouter } from './room';

export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => 'yay!'),
  calling: callingRouter,
  video: videoRouter,
  document: documentRouter,
  user: userRouter,
  room: roomRouter,
  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 500);
      return () => {
        clearInterval(int);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;
