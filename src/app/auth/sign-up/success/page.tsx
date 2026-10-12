import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignUpSuccessPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-muted/50 px-4 py-12'>
      <Card className='w-full max-w-md text-center'>
        <CardHeader>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'>
            <CheckCircle2 className='h-8 w-8' />
          </div>
          <CardTitle className='text-2xl'>Conta criada com sucesso!</CardTitle>
          <CardDescription>
            Sua conta foi criada. Agora você pode fazer login e começar a usar a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button asChild size='lg' className='w-full'>
            <Link href='/auth/sign-in'>Ir para login</Link>
          </Button>
          <p className='text-sm text-muted-foreground'>
            Ou{' '}
            <Link href='/auth/sign-up' className='text-primary hover:underline'>
              criar outra conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
