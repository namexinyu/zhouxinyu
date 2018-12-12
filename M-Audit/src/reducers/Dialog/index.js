import merge from 'REDUCER/merge';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

const DialogStore = {
  initialState: {
    dialogs: [],
    spinnerCount: 0
  },
  reducers: {
    [openDialog]: merge((payload, state) => {
      let temp = state.dialogs;
      payload.id = payload.options && payload.options.type === 'spinner' ? 'spinner' : payload.id;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].id === payload.id) {
          temp.splice(i, 1);
          payload.reOpen = true;
          break;
        }
      }
      temp.push(payload);
      return {
        dialogs: temp,
        spinnerCount: payload.options && payload.options.type === 'spinner' ? state.spinnerCount + 1 : state.spinnerCount
      };
    }),
    [closeDialog]: merge((payload, state) => {
      if (payload.id === 'A' || payload.id === 'ALL' || payload.id === 'all') {
        return {
          dialogs: [],
          spinnerCount: 0
        };
      }
      let temp = state.dialogs;
      if (payload.id === 'spinner' && state.spinnerCount > 1) {

      } else {
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === payload.id) {
            temp.splice(i, 1);
            break;
          }
        }
      }
      return {
        dialogs: temp,
        spinnerCount: payload.id === 'spinner' ? state.spinnerCount - 1 : state.spinnerCount
      };
    })
  }
};
export default DialogStore;