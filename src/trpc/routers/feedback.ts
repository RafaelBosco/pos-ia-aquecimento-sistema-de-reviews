import { publicProcedure, router } from '@/trpc/init';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { TRPCError } from '@trpc/server';

export const feedbackRouter = router({
  addFeedback: publicProcedure
    .input(
      z.object({
        score: z.number().int().min(1).max(5, 'Nota deve estar entre 1 e 5'),
        comment: z.string().optional(),
        product_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { score, comment, product_id } = input;

      // Verify user is authenticated
      const { data: { user }, error: userError } = await ctx.supabase.auth.getUser();

      if (userError || !user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
      }

      // Create feedback
      const feedbackId = nanoid();

      const { error: insertError } = await ctx.supabase.from('products_feedbacks').insert({
        id: feedbackId,
        score,
        comment,
        created_by: user.id,
        product_id,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro ao salvar feedback',
        });
      }

      return { success: true, feedbackId };
    }),
});