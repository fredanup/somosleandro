/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, createTRPCRouter } from '../trpc';
import { callingRouter } from './calling';


export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => 'yay!'),
  calling: callingRouter,

});

export type AppRouter = typeof appRouter;
