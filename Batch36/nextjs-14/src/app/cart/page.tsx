import ShoppingCart from '@/components/cart/ShoppingCart';

export default async function Categories() {
  return (
    <div className='space-y-4'>
      <h1>Shopping Cart</h1>
      <hr />
      <ShoppingCart />
    </div>
  );
}
