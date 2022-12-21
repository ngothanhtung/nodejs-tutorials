import React from 'react';
import { useSelector } from 'react-redux';

export default function Label() {
  const count = useSelector((state) => state.counterReducer.count);

  return (
    <div>
      <h3>{count}</h3>
    </div>
  );
}
