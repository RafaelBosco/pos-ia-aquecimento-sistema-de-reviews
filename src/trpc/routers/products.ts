import { publicProcedure, router } from '@/trpc/init';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  score: z.boolean().default(false),
  external_link: z.string().url('URL inválida').optional(),
});

const insertProductSchema = productSchema.omit({ id: true, created_at: true, updated_at: true });

export const productsRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(10), cursor: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;

      let query = ctx.supabase.from('products').select('*', { count: 'exact' });

      if (cursor) {
        query = query.limit(limit).eq('id', cursor);
      } else {
        query = query.limit(limit);
      }

      const { data, error, count } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error('Erro ao listar produtos');
      }

      let nextCursor: string | undefined;
      if (data && data.length === limit) {
        nextCursor = data[data.length - 1].id;
      }

      return {
        products: data || [],
        total: count || 0,
        nextCursor,
      };
    }),

  create: publicProcedure
    .input(insertProductSchema.extend({ id: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const id = input.id || nanoid();
      const { name, description, external_link } = input;

      const { data, error } = await ctx.supabase.from('products').insert({
        id,
        name,
        description,
        external_link,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select();

      if (error) {
        throw new Error('Erro ao criar produto');
      }

      return { success: true, product: data[0] };
    }),
});

export type Product = z.infer<typeof productSchema>;