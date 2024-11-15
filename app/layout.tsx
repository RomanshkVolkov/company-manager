import type { Metadata } from 'next';
import { inter, quicksand } from './fonts';
import { Providers } from './providers';
import ThemeSwitcher from './ui/theme-switcher';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Waste Wise',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} ${quicksand.variable} bg-background antialiased`}
      >
        <Toaster />
        <Providers>
          {children}
          <div className="absolute bottom-2 right-2 md:bottom-6 md:right-6">
            <ThemeSwitcher />
          </div>
        </Providers>
      </body>
    </html>
  );
}
