import { createStore, combineReducers } from 'redux';

import userReducer from '../reducers/user.reducer';

const saveToLocalStorage = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('numeri-state', serializedState);
  } catch (e) {
    console.log(e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('numeri-state');
    if (serializedState === null) {
      return console.log('Unable to restore state from localStorage');
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.log(e);
  }
};

const persistedState = loadFromLocalStorage();

const store = createStore(
  combineReducers({
    user: userReducer,
  }),
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// store all changes in local storage
store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
