'use client';
// app/providers.tsx

import { useRouter } from 'next/navigation';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();
  return (
    <NextUIProvider locale="es-MX" navigate={push}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
