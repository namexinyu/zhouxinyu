import merge from 'REDUCER/merge';

import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import PocketAction from 'ACTION/Broker/Pocket';
import getLatestEnrollRecord from 'ACTION/Broker/MemberDetail/getLatestEnrollRecord';

const {
  getLatestPocketCase,
  updatePocketCase,
  setEstimatePick,
  setPocketCase,
  insertMemberEnrollRecord,
  updateMemberEnrollRecord
} = PocketAction;

const STATE_NAME = 'state_broker_detail_pocket';

function InitialState () {
  return {
    lastestPocketCase: '',
    lastestEnrollRecord: {},
    editDate: {},
    editRecruit: {},
    editStatus: {},
    editRemark: {},
    editPocketRemark: {},
    editPocketDate: {},
    blockId: {},
    HouseholdRegister: "",
    DisposeStatus: null,
    getLatestPocketCaseFetch: {
      status: 'close',
      response: ''
    },
    getLatestEnrollRecordFetch: {
      status: 'close',
      response: ''
    },
    updatePocketCaseFetch: {
      status: 'close',
      response: ''
    },
    setEstimatePickFetch: {
      status: 'close',
      response: ''
    },
    setPocketCaseFetch: {
      status: 'close',
      response: ''
    },
    insertMemberEnrollRecordFetch: {
      status: 'close',
      response: ''
    },
    updateMemberEnrollRecordFetch: {
      status: 'close',
      response: ''
    },
    type: 0,
    RecruitTmpID: 0
  };
}

const Reducer = {
  initialState: new InitialState(),
  reducers: {
    [resetState]: merge((payload, state) => {
      if (payload.stateName === STATE_NAME) {
        let temp = Object.assign(new InitialState(), { resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0) });
        return temp;
      }
      return {};
    }),
    [setParams]: merge((payload, state) => {
      if (payload.stateName === STATE_NAME) {
        return payload.params;
      }
      return {};
    }),
    [setFetchStatus]: merge((payload, state) => {
      if (payload.stateName === STATE_NAME && state.hasOwnProperty(payload.fetchName)) {
        state[payload.fetchName].status = payload.status;
        return state;
      }
      return {};
    }),
    [getLatestPocketCase]: merge((payload, state) => {
      return {
        getLatestPocketCaseFetch: {
          status: 'pending',
          response: ''
        },
        lastestPocketCase: ''
      };
    }),
    [getLatestPocketCase.success]: merge((payload, state) => {
      return {
        getLatestPocketCaseFetch: {
          status: 'success',
          response: payload
        },
        lastestPocketCase: payload.Data || ''
      };
    }),
    [getLatestPocketCase.error]: merge((payload, state) => {
      return {
        getLatestPocketCaseFetch: {
          status: 'error',
          response: payload
        }
      };
    }),
    [getLatestEnrollRecord]: merge((payload, state) => {
      return {
        getLatestEnrollRecordFetch: {
          status: 'pending',
          response: ''
        }
      };
    }),
    [getLatestEnrollRecord.success]: merge((payload, state) => {
      return {
        getLatestEnrollRecordFetch: {
          status: 'success',
          response: payload
        },
        lastestEnrollRecord: (payload.Data && payload.Data.RecordList[0]) || {}

      };
    }),
    [getLatestEnrollRecord.error]: merge((payload, state) => {
      return {
        getLatestEnrollRecordFetch: {
          status: 'error',
          response: payload
        }
      };
    }),
    [updatePocketCase]: merge((payload, state) => {
      return {
        updatePocketCaseFetch: {
          status: 'pending',
          response: ''
        }
      };
    }),
    [updatePocketCase.success]: merge((payload, state) => {
      return {
        updatePocketCaseFetch: {
          status: 'success',
          response: payload
        }
      };
    }),
    [updatePocketCase.error]: merge((payload, state) => {
      return {
        updatePocketCaseFetch: {
          status: 'error',
          response: payload
        }
      };
    }),
    [setPocketCase]: merge((payload, state) => {
      return {
        setPocketCaseFetch: {
          status: 'pending',
          response: ''
        }
      };
    }),
    [setPocketCase.success]: merge((payload, state) => {
      return {
        setPocketCaseFetch: {
          status: 'success',
          response: payload
        },
        DisposeStatus: payload.Data.DisposeStatus

      };
    }),
    [setPocketCase.error]: merge((payload, state) => {
      return {
        setPocketCaseFetch: {
          status: 'error',
          response: payload
        }
      };
    }),
    [insertMemberEnrollRecord]: merge((payload, state) => {
      return {
        insertMemberEnrollRecordFetch: {
          status: 'pending',
          response: ''
        }
      };
    }),
    [insertMemberEnrollRecord.success]: merge((payload, state) => {
      return {
        insertMemberEnrollRecordFetch: {
          status: 'success',
          response: payload
        }
      };
    }),
    [insertMemberEnrollRecord.error]: merge((payload, state) => {
      return {
        insertMemberEnrollRecordFetch: {
          status: 'error',
          response: payload
        }
      };
    }),
    [updateMemberEnrollRecord]: merge((payload, state) => {
      return {
        updateMemberEnrollRecordFetch: {
          status: 'pending',
          response: ''
        }
      };
    }),
    [updateMemberEnrollRecord.success]: merge((payload, state) => {
      return {
        updateMemberEnrollRecordFetch: {
          status: 'success',
          response: payload
        },
        DisposeStatus: payload.Data.DisposeStatus
      };
    }),
    [updateMemberEnrollRecord.error]: merge((payload, state) => {
      return {
        updateMemberEnrollRecordFetch: {
          status: 'error',
          response: payload
        }
      };
    }),
    [setEstimatePick]: merge((payload, state) => {
      return {
        setEstimatePickFetch: {
          status: 'pending',
          response: ''
        }
      };
    }),
    [setEstimatePick.success]: merge((payload, state) => {
      return {
        setEstimatePickFetch: {
          status: 'success',
          response: payload
        }
      };
    }),
    [setEstimatePick.error]: merge((payload, state) => {
      return {
        setEstimatePickFetch: {
          status: 'error',
          response: payload
        }
      };
    })
  }
};
export default Reducer;
