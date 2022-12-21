import React from 'react';
import { useDispatch } from 'react-redux';

import { increaseCountAction } from '../actions';

export default function IncreaseButton() {
  const dispatch = useDispatch();

  return (
    <div>
      <button
        onClick={() => {
          dispatch(increaseCountAction(5));
        }}
      >
        Increase
      </button>
    </div>
  );
}
