import React from 'react';
import { useDispatch } from 'react-redux';

import { decreaseCountAction } from '../actions';

export default function DecreaseButton() {
  const dispatch = useDispatch();

  return (
    <div>
      <button
        onClick={() => {
          dispatch(decreaseCountAction(3));
        }}
      >
        Decrease
      </button>
    </div>
  );
}
