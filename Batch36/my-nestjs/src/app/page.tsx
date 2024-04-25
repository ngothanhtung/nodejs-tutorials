import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col p-24'>
      <h1>Hello NEXTJS 14</h1>

      <Link href='/about'>Go to about</Link>
    </main>
  );
}
