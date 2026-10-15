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

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signInMutation = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast({
        title: 'Login bem-sucedido!',
      });
      router.push('/');
    },
    onError: (error) => {
      setServerError(error.message || 'Erro ao fazer login. Tente novamente.');
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setServerError(null);
    setIsLoading(true);
    signInMutation.mutate(data);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--muted)] flex items-center justify-center px-4 py-12'>
      <section className='w-full max-w-md space-y-8 bg-card/80 backdrop-blur-lg border border-border/30 rounded-2xl shadow-xl'>
        {/* Header moment - distinctive headline as the memorable element */}
        <header className='text-center animate-in'>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-3'>
            Bem-vindo de volta
          </h1>
          <p className='text-lg sm:text-xl text-muted-foreground max-w-xs mx-auto'>
            Entre na sua conta para continuar exploring opiniões sobre produtos e serviços.
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

          {/* CTA button - one bold element, restrained elsewhere */}
          <Button
            type='submit'
            disabled={isLoading}
            className='width-full rounded-lg px-6 py-3 text-lg font-medium'
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Entrando na conta...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </section>
    </div>
  );
}