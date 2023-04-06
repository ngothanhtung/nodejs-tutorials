import React from 'react';
import { useCountStore } from '../hooks/useCountStore';

export default function DecreaseButton() {
  const { decrease } = useCountStore((state) => state);
  return (
    <div>
      <button
        onClick={() => {
          decrease(1);
        }}
      >
        Decrease
      </button>
    </div>
  );
}
