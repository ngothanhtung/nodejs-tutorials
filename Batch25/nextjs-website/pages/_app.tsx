import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import DefaultLayout from '../layouts/DefaultLayout';

const lightTheme = createTheme({
  type: 'light',
  theme: {
    // colors: {...}, // optional
  },
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    // colors: {...}, // optional
  },
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextThemesProvider
      defaultTheme='system'
      attribute='class'
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider theme={darkTheme}>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
