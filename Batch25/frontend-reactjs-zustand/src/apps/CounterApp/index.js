import React from 'react';
import DecreaseButton from './components/DecreaseButton';
import IncreaseButton from './components/IncreaseButton';
import Label from './components/Label';

export default function CounterApp() {
  return (
    <div>
      <DecreaseButton />
      <Label />
      <IncreaseButton />
    </div>
  );
}
