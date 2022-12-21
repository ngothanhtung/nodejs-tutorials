import React from 'react';
import { useCountStore } from '../hooks/useCountStore';

export default function IncreaseButton() {
  const { increase } = useCountStore((state) => state);
  return (
    <div>
      <button
        onClick={() => {
          increase(5);
        }}
      >
        Increase
      </button>
    </div>
  );
}
