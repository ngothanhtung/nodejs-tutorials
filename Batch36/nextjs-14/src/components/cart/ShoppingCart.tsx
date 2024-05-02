'use client';
import React from 'react';
import numeral from 'numeral';
import { useCartStore } from '@/providers/cart-store-provider';
import ClearCart from './ClearCart';
import TotalLabel from './TotalLabel';

type Props = {};

export default function ShoppingCart({}: Props) {
  const { items, addToCart, decreaseQuantity, removeFromCart } = useCartStore((state) => state);

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-900'>
          <tr>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider'>
              #
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider'>
              Name
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider'>
              Price
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider'>
              Discount
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider'>
              Quantity
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider'>
              Sum
            </th>
            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider'></th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {items.map((item, index) => {
            return (
              <tr key={item.product.id}>
                <td className='px-6 py-4 whitespace-nowrap text-right w-0'>
                  <div className='text-sm text-gray-100'>{index + 1}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-100'>{item.product.name}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap w-0'>
                  <div className='text-sm text-gray-100'>{numeral(item.product.price).format('$0,0')}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap w-0'>
                  <div className='text-sm text-gray-100 text-right'>{numeral(item.product.discount).format('0.0')}%</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap w-0'>
                  <div className='flex space-x-8'>
                    <button
                      onClick={() =>
                        decreaseQuantity({
                          productId: item.product.id,
                        })
                      }
                      className='text-green-500 hover:text-green-900'
                    >
                      -
                    </button>
                    <div className='text-sm text-gray-100 text-right'>{item.quantity}</div>
                    <button
                      onClick={() =>
                        addToCart({
                          product: item.product,
                          quantity: 1,
                        })
                      }
                      className='text-green-500 hover:text-green-900'
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap w-0'>
                  <div className='text-sm font-medium text-gray-100 text-right'>{numeral(((item.product.price * (100 - item.product.discount)) / 100) * item.quantity).format('$0,0')}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap w-0'>
                  <div className='space-x-4'>
                    <button
                      onClick={() =>
                        removeFromCart({
                          productId: item.product.id,
                        })
                      }
                      className='text-red-500 hover:text-red-900'
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='my-8'>
        <hr />
      </div>

      <TotalLabel />
    </div>
  );
}
