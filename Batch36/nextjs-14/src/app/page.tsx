import Counter from '@/components/counter';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

// Metadata
export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page',
};

export default function Home() {
  return (
    <div>
      <Counter />
    </div>
  );
}
