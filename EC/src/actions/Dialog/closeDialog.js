import createAction from 'ACTION/createAction';
function closeDialog(id, timeout) {
  return {
    payload: {
      id: id,
      timeout: timeout
    }
  };
}

export default createAction(closeDialog);