import React from 'react';
import { Navbar, Button, Text, Card, Radio, useTheme } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
  children: JSX.Element;
};

export default function DefaultLayout({ children }: Props) {
  const { isDark } = useTheme();
  const router = useRouter();
  const { pathname } = router;

  return (
    <div style={{ boxSizing: 'border-box', maxWidth: '100%' }}>
      <Navbar shouldHideOnScroll isBordered={isDark} variant='sticky'>
        <Navbar.Brand>
          <Text b color='inherit' hideIn='xs'>
            SHOPIFY FAKE
          </Text>
        </Navbar.Brand>
        <Navbar.Content hideIn='xs'>
          <Navbar.Link as={Link} href='/products' isActive={pathname === '/products'}>
            Products
          </Navbar.Link>
          <Navbar.Link as={Link} href='/customers' isActive={pathname === '/customers'}>
            Customers
          </Navbar.Link>
          <Navbar.Link href='#'>Pricing</Navbar.Link>
          <Navbar.Link href='#'>Company</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Link color='inherit' href='#'>
            Login
          </Navbar.Link>
          <Navbar.Item>
            <Button auto flat as={Link} href='#'>
              Sign Up
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      <div style={{ padding: 12 }}>{children}</div>
    </div>
  );
}
