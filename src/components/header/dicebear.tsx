import { ReactNode } from 'react';

export function Dicebear({ name }: { name: string }): ReactNode {
  const seed = name || 'user';
  const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    seed
  )}`;

  return <img src={url} alt={name} className='h-8 w-8 rounded-full' />;
}