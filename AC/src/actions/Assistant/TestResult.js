import createAction from 'ACTION/createAction';
import TestResult from 'SERVICE/Assistant/TestResult';

let action = Object.keys(TestResult).reduce((result, data) => {
  let action = (param) => ({
    promise: TestResult[data](param)
  });
  if (!__PROD__) action.actionType = data;
  let actionName = data;
  result[actionName] = createAction(action);
  return result;
}, {});

export default action;