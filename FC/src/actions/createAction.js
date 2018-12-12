let defaultStore = null;
let actionId = 0;

const createAction = function (actionCreator) {
  if (!__PROD__) {
    if (typeof actionCreator !== 'function') 
      console.log('Action creator should be a function');
      // if (typeof actionCreator !== 'function') throw 'Action creator should be a
      // function';
    }
  function dispatchAction(...args) {
    // only singleton store is supported right now.
    if (!defaultStore) 
      console.log('Store is not initialized.');
    let action = actionCreator(...args);
    action.dispatcher = dispatchAction;
    action.type = dispatchAction.ACTION_TYPE;
    defaultStore.dispatch(action);
  }
  let actionType = __PROD__
    ? String(actionId++)
    : `${actionId++}:${actionCreator.actionType || actionCreator.name}`;
  // for now action type "progress" is not utilized.
  ['success', 'error', 'progress'].forEach((key) => {
    dispatchAction[key] = `${actionType}:${key}`;
  });
  dispatchAction.ACTION_TYPE = actionType;
  dispatchAction.toString = () => actionType;
  return Object.freeze(dispatchAction);
};

// lazy injection to avoid cyclic import.
createAction.init = (store) => {
  defaultStore = store;
};

export default createAction;
