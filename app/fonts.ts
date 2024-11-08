import { Inter, Quicksand } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], display: 'swap' });
export const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
});
