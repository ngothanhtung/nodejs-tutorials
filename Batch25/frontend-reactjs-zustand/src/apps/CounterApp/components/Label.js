import React from 'react';
import { useCountStore } from '../hooks/useCountStore';

export default function Label() {
  const { count } = useCountStore((state) => state);

  return (
    <div>
      <h4>{count}</h4>
    </div>
  );
}
