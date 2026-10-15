import { hashPassword } from '@/lib/auth/password';
import { nanoid } from 'nanoid';
import { publicProcedure, router } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import bcrypt from 'bcryptjs';

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

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
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

  signIn: publicProcedure.input(signInSchema).mutation(async ({ input }) => {
    const { email, password } = input;

    // Query accounts table for the user
    const { data: user, error } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Email ou senha inválidos',
      });
    }

    // Verify password using bcrypt
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Email ou senha inválidos',
      });
    }

    // Set Next.js session cookie
    const cookieStore = cookies();
    cookieStore.set('next-auth.session', JSON.stringify({
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
    }), {
      httpOnly: true,

      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return { success: true, user: { id: user.id, email: user.email, name: `${user.first_name} ${user.last_name}` } };
  }),
});