import * as ActionTypes from '../constants/actionTypes';

// COUNTER
// Action Creator
export const increaseCountAction = (number) => {
  return {
    type: ActionTypes.COUNTER_INCREASE_COUNT, // ACTION TYPE
    number: number, // PARAMETER
  };
};

// Action Creator
export const decreaseCountAction = (number) => {
  return {
    type: ActionTypes.COUNTER_DECREASE_COUNT, // ACTION TYPE
    number: number, // PARAMETER
  };
};
// ------------------------------------------------------------
