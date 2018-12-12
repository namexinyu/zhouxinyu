const promiseMiddleware = () => next => action => {
    // 临时代码 用于请求500ms不重复触发逻辑
    if (action.promise && action.promise.error === 'badRequest') {
        return;
    }
  if (!action.promise || !(action.promise instanceof Promise)) {
    next(action);
    return;
  }
  next(action);
  action.promise.then(payload => {
    next({
      type: action.dispatcher.success,
      payload,
      meta: { request: action.payload }
    });
  }).catch(e => next({
    type: action.dispatcher.error,
    payload: e,
    meta: { request: action.payload }
  }));
};

export default promiseMiddleware;
