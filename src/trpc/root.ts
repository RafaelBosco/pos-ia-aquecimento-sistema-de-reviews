import { router } from '@/trpc/init';
import { authRouter } from '@/trpc/routers/auth';
import { productsRouter } from '@/trpc/routers/products';
import { feedbackRouter } from '@/trpc/routers/feedback';

export const appRouter = router({
  auth: authRouter,
  products: productsRouter,
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
