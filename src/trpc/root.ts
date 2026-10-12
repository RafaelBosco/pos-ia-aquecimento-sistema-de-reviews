import { router } from '@/trpc/init';
import { authRouter } from '@/trpc/routers/auth';

export const appRouter = router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
