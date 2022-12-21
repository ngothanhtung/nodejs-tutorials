import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './rootReducer';

// MIDDLEWARE
const middewares = [];

// REDUX STORE
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middewares),
    // REDUX TOOLS (DEBUG)
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);

export default store;
