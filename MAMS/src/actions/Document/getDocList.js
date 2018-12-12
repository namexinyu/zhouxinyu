import createAction from 'ACTION/createAction';
// aybe you could import the get doclist services.
function getDocList() {
  return {
    payload: {
      list: [1, 2, 3, 4, 5]
    }
  };
}

export default createAction(getDocList);