import React from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useCartStore } from '../../hooks/useCartStore';

export default function Carts() {
  const { items, remove, increase, decrease } = useCartStore((state) => state);
  const { loggedInUser } = useAuthStore((state) => state);
  return (
    <div>
      <h1 style={{ color: 'red' }}>{loggedInUser?.name}</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th className='text-end'>Price</th>
            <th className='text-end'>Qty</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, index) => {
            return (
              <tr key={i.product.id}>
                <td>{index + 1}</td>
                <td>{i.product.name}</td>
                <td className='text-end'>{i.product.price}</td>
                <td className='text-end'>{i.quantity}</td>
                <td>
                  <button
                    onClick={() => {
                      increase(i.product.id);
                    }}
                  >
                    +
                  </button>

                  <button
                    onClick={() => {
                      decrease(i.product.id);
                    }}
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      remove(i.product.id);
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
