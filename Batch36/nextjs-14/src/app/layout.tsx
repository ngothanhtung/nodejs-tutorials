import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

import { CartStoreProvider } from '@/providers/cart-store-provider';
import CartLink from '@/components/cart/CartLink';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <CartStoreProvider>
          <div className='flex min-h-screen flex-col p-8'>
            <nav className='flex gap-8'>
              <Link href='/categories'>Categories</Link>
              <Link href='/products'>Products</Link>
              <Link href='/company'>Company</Link>
              <Link href='/sales'>Sales</Link>
              {/* <Link href='/cart'>Cart</Link> */}
              <CartLink />
            </nav>

            <main className='mt-8'>{children}</main>
          </div>
        </CartStoreProvider>
      </body>
    </html>
  );
}
