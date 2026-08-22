'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { CartButton } from '@/components/CartButton';
import { CartDrawer } from '@/components/CartDrawer';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CartButton />
        <CartDrawer />
      </CartProvider>
    </SessionProvider>
  );
}
