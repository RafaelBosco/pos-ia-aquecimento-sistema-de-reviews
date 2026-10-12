'use client';

import { Toaster } from '@/components/ui/toaster';
import { TRPCProvider } from '@/trpc/provider';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCProvider>
      {children}
      <Toaster />
    </TRPCProvider>
  );
}
