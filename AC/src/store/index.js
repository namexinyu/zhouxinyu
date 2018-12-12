import {createStore, applyMiddleware, compose} from "redux";
import {routerReducer} from "react-router-redux";
import reducers from "REDUCER";
import promiseMiddleware from './promise_middleware';
import ActionFactory from 'ACTION/createAction';
// import syncHistoryWithStore from './syncHistoryWithStore';

const rootReducer = (state, action) => {
  let newState = reducers(state, action);
  newState.routing = routerReducer(state.routing, action);
  return newState;
};

function configureStore() {
  let middlewares = [promiseMiddleware];

  if (__DEV__) {
    const createLogger = require('redux-logger');
    middlewares.push(createLogger.createLogger());
  }

  return createStore(rootReducer, {
    routing: {}
  }, compose(applyMiddleware(...middlewares)));
}

const store = configureStore();
ActionFactory.init(store);

if (!__PROD__) {
  window.__store__ = store;
};

export default store;
