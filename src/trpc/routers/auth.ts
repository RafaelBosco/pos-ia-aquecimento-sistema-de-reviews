import { hashPassword } from '@/lib/auth/password';
import { publicProcedure, router } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const signUpSchema = z
  .object({
    firstName: z.string().min(1, 'Primeiro nome é obrigatório').max(50),
    lastName: z.string().min(1, 'Sobrenome é obrigatório').max(50),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const authRouter = router({
  signUp: publicProcedure.input(signUpSchema).mutation(async ({ input, ctx }) => {
    const { firstName, lastName, email, password } = input;

    const { data: existingUser, error: checkError } = await ctx.supabase
      .from('accounts')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao verificar email existente',
      });
    }

    if (existingUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Este email já está cadastrado',
      });
    }

    const { hash, salt } = await hashPassword(password);
    const id = nanoid();

    const { error: insertError } = await ctx.supabase.from('accounts').insert({
      id,
      first_name: firstName,
      last_name: lastName,
      email,
      password: hash,
      salt,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao criar conta',
      });
    }

    return { success: true, userId: id };
  }),
});
