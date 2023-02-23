import '@/styles/globals.css';
import type { AppProps } from 'next/app';

// 1. import `NextUIProvider` component
import { NextUIProvider } from '@nextui-org/react';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    // 2. Use at the root of your app
    <NextUIProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NextUIProvider>
  );
}
