import React from 'react';
import { Provider } from 'react-redux';
import DecreaseButton from './CounterApp/components/DecreaseButton';
import IncreaseButton from './CounterApp/components/IncreaseButton';
import Label from './CounterApp/components/Label';

// REDUX STORE
import store from './store';

export default function ReduxApp() {
  return (
    <Provider store={store}>
      <DecreaseButton />
      <Label />
      <IncreaseButton />
    </Provider>
  );
}
