'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className='min-h-screen flex items-center justify-center bg-muted/50 px-4 py-12'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>Criar conta</CardTitle>
          <CardDescription>Preencha os dados abaixo para começar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' noValidate>
            {serverError && (
              <Alert variant='destructive' className='mb-4'>
                <AlertDescription className='text-sm'>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>Primeiro nome</Label>
                <Input
                  id='firstName'
                  placeholder='João'
                  {...form.register('firstName')}
                  disabled={isLoading}
                  aria-invalid={form.formState.errors.firstName ? 'true' : 'false'}
                />
                {form.formState.errors.firstName && (
                  <p className='text-sm text-destructive' role='alert'>
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Sobrenome</Label>
                <Input
                  id='lastName'
                  placeholder='Silva'
                  {...form.register('lastName')}
                  disabled={isLoading}
                  aria-invalid={form.formState.errors.lastName ? 'true' : 'false'}
                />
                {form.formState.errors.lastName && (
                  <p className='text-sm text-destructive' role='alert'>
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='joao@email.com'
                {...form.register('email')}
                disabled={isLoading}
                aria-invalid={form.formState.errors.email ? 'true' : 'false'}
              />
              {form.formState.errors.email && (
                <p className='text-sm text-destructive' role='alert'>
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Senha</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                {...form.register('password')}
                disabled={isLoading}
                aria-invalid={form.formState.errors.password ? 'true' : 'false'}
              />
              {form.formState.errors.password && (
                <p className='text-sm text-destructive' role='alert'>
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirmar senha</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='••••••••'
                {...form.register('confirmPassword')}
                disabled={isLoading}
                aria-invalid={form.formState.errors.confirmPassword ? 'true' : 'false'}
              />
              {form.formState.errors.confirmPassword && (
                <p className='text-sm text-destructive' role='alert'>
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type='submit' className='w-full' size='lg' disabled={isLoading}>
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
        </CardContent>
      </Card>
    </div>
  );
}
