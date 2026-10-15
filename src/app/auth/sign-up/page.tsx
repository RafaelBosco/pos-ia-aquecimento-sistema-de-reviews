'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess: () => {
      toast({
        title: 'Conta criada com sucesso!',
      });
      router.push('/auth/sign-up/success');
    },
    onError: (error) => {
      setServerError(error.message || 'Erro ao criar conta. Tente novamente.');
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setServerError(null);
    setIsLoading(true);
    signUpMutation.mutate(data);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--muted)] flex items-center justify-center px-4 py-12'>
      <section className='w-full max-w-md space-y-8 bg-card/80 backdrop-blur-lg border border-border/30 rounded-2xl shadow-xl'>
        {/* Hero moment - distinctive headline as the memorable element */}
        <header className='text-center animate-in'>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-3'>
            Seja bem-vindo(a)
          </h1>
          <p className='text-lg sm:text-xl text-muted-foreground max-w-xs mx-auto'>
            Compartilhe suas experiências e descubra opiniões reais de outros usuários sobre
            produtos e serviços que importam.
          </p>
        </header>

        {/* Form - intentional structure, not default template */}
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' noValidate>
          {/* Server error state - treated as direction, not decoration */}
          {serverError && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription className='text-sm'>{serverError}</AlertDescription>
            </Alert>
          )}

          {/* First name field - with subtle visual hierarchy */}
          <div className='grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2'>
            <div>
              <Label htmlFor='firstName'>Seu primeiro nome</Label>
              <Input
                id='firstName'
                placeholder='Ex: Marco'
                {...form.register('firstName')}
                disabled={isLoading}
                aria-invalid={form.formState.errors.firstName ? 'true' : 'false'}
                className='bg-input border-border/50 rounded-lg transition-colors focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground'
              />
              {form.formState.errors.firstName && (
                <p className='text-sm mt-1 text-destructive font-medium' role='alert'>
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor='lastName'>Sobrenome</Label>
              <Input
                id='lastName'
                placeholder='Ex: Silva'
                {...form.register('lastName')}
                disabled={isLoading}
                aria-invalid={form.formState.errors.lastName ? 'true' : 'false'}
                className='bg-input border-border/50 rounded-lg transition-colors focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground'
              />
              {form.formState.errors.lastName && (
                <p className='text-sm mt-1 text-destructive font-medium' role='alert'>
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email field - focused, single column experience */}
          <div>
            <Label htmlFor='email'>Endereço de email</Label>
            <Input
              id='email'
              type='email'
              placeholder='exemplo@email.com'
              {...form.register('email')}
              disabled={isLoading}
              aria-invalid={form.formState.errors.email ? 'true' : 'false'}
              className='bg-input border-border/50 rounded-lg transition-colors focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground'
            />
            {form.formState.errors.email && (
              <p className='text-sm mt-1 text-destructive font-medium' role='alert'>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password field - with clear, active-vision labeling */}
          <div>
            <Label htmlFor='password'>Sua senha</Label>
            <Input
              id='password'
              type='password'
              placeholder='••••••••••••••••'
              {...form.register('password')}
              disabled={isLoading}
              aria-invalid={form.formState.errors.password ? 'true' : 'false'}
              className='bg-input border-border/50 rounded-lg transition-colors focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground'
            />
            {form.formState.errors.password && (
              <p className='text-sm mt-1 text-destructive font-medium' role='alert'>
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password - cohesive pair, same visual treatment */}
          <div>
            <Label htmlFor='confirmPassword'>Confirmar senha</Label>
            <Input
              id='confirmPassword'
              type='password'
              placeholder='••••••••••••••••'
              {...form.register('confirmPassword')}
              disabled={isLoading}
              aria-invalid={form.formState.errors.confirmPassword ? 'true' : 'false'}
              className='bg-input border-border/50 rounded-lg transition-colors focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground'
            />
            {form.formState.errors.confirmPassword && (
              <p className='text-sm mt-1 text-destructive font-medium' role='alert'>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* CTA button - one bold element, restrained elsewhere */}
          <Button
            type='submit'
            disabled={isLoading}
            className='width-full rounded-lg px-6 py-3 text-lg font-medium'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>
      </section>
    </div>
  );
}
