import createAction from 'ACTION/createAction';
import GetUnFamiliar from 'SERVICE/Broker/exam';

let action = Object.keys(GetUnFamiliar).reduce((result, data) => {
  let action = (param) => ({
    promise: GetUnFamiliar[data](param)
  });
  if (!__PROD__) action.actionType = data;
  let actionName = data;
  result[actionName] = createAction(action);
  return result;
}, {});

export default action;