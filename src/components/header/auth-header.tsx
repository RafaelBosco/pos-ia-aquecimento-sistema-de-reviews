import { Button } from '@/components/ui/button';
import { Dicebear } from '@/components/header/dicebear';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface AuthHeaderProps {
  className?: string;
}

export async function AuthHeader({ className }: AuthHeaderProps = {}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('next-auth.session');

  if (!sessionCookie) {
    return (
      <div>
        {/* Show sign-up link alongside login for new users */}
        <div className='flex items-center gap-2 mb-4'>
          <Link href="/auth/sign-up">
            <Button variant='outline' size='default' className='text-sm'>
              Cadastre-se
            </Button>
          </Link>
          <Link href="/auth/sign-in">
            <Button size='default' className='text-sm'>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const { email, name } = session;

    // Fetch user details from Supabase to get first_name and last_name
    const { data: user, error } = await supabaseAdmin
      .from('accounts')
      .select('first_name, last_name')
      .eq('email', email)
      .single();

    if (error || !user) {
      return (
        <div>
          <Button className={className}>Login</Button>
        </div>
      );
    }

    const fullName = `${user.first_name} ${user.last_name}`;

    return (
      <div className='flex items-center gap-2'>
        <Dicebear name={fullName} />
        <span className='text-sm font-medium'>{fullName}</span>
      </div>
    );
  } catch {
    return (
      <div>
        <Button className={className}>Login</Button>
      </div>
    );
  }
}