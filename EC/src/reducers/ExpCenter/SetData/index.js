import merge from '../../merge';
import setAddDriver from 'ACTION/ExpCenter/SetCommonData/setAddDriver';
import setAddNewAccount from 'ACTION/ExpCenter/SetCommonData/setAddNewAccount';
import setDriverOrderChange from 'ACTION/ExpCenter/SetCommonData/setDriverOrderChange';
import setModAccountName from 'ACTION/ExpCenter/SetCommonData/setModAccountName';
import setModAccountRelation from 'ACTION/ExpCenter/SetCommonData/setModAccountRelation';
import setSetDriverPick from 'ACTION/ExpCenter/SetCommonData/setSetDriverPick';
import setModHubCarInfo from 'ACTION/ExpCenter/SetCommonData/setModHubCarInfo';
import setModActivityInfo from 'ACTION/ExpCenter/PriceAllocation/getModActivityInfo';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_setData';

function InitialState() {
    return {
        setAddDriverFetch: {
            status: 'pending',
            response: ''
        },
        setAddNewAccountFetch: {
            status: 'pending',
            response: ''
        },
        setDriverOrderChangeFetch: {
            status: 'pending',
            response: ''
        },
        setModAccountNameFetch: {
            status: 'pending',
            response: ''
        },
        setModAccountRelationFetch: {
            status: 'pending',
            response: ''
        },
        setSetDriverPickFetch: {
            status: 'pending',
            response: ''
        },
        setModHubCarInfoFetch: {
            status: 'pending',
            response: ''
        },
        setModActivityInfoFetch: {
            status: 'pending',
            response: ''
        }
    };
}

const setDataList = {
    initialState: new InitialState(),
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return new InitialState();
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
        [setAddDriver]: merge((payload, state) => {
            return {
                setAddDriverFetch: {
                    status: 'pending'
                }
            };
        }),
        [setAddDriver.success]: merge((payload, state) => {
            return {
                setAddDriverFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setAddDriver.error]: merge((payload, state) => {
            return {
                setAddDriverFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setAddNewAccount]: merge((payload, state) => {
            return {
                setAddNewAccountFetch: {
                    status: 'pending'
                }
            };
        }),
        [setAddNewAccount.success]: merge((payload, state) => {
            return {
                setAddNewAccountFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setAddNewAccount.error]: merge((payload, state) => {
            return {
                setAddNewAccountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setDriverOrderChange]: merge((payload, state) => {
            return {
                setDriverOrderChangeFetch: {
                    status: 'pending'
                }
            };
        }),
        [setDriverOrderChange.success]: merge((payload, state) => {
            return {
                setDriverOrderChangeFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setDriverOrderChange.error]: merge((payload, state) => {
            return {
                setDriverOrderChangeFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setModAccountName]: merge((payload, state) => {
            return {
                setModAccountNameFetch: {
                    status: 'pending'
                }
            };
        }),
        [setModAccountName.success]: merge((payload, state) => {
            return {
                setModAccountNameFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setModAccountName.error]: merge((payload, state) => {
            return {
                setModAccountNameFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setModAccountRelation]: merge((payload, state) => {
            return {
                setModAccountRelationFetch: {
                    status: 'pending'
                }
            };
        }),
        [setModAccountRelation.success]: merge((payload, state) => {
            return {
                setModAccountRelationFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setModAccountRelation.error]: merge((payload, state) => {
            return {
                setModAccountRelationFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setSetDriverPick]: merge((payload, state) => {
            return {
                setSetDriverPickFetch: {
                    status: 'pending'
                }
            };
        }),
        [setSetDriverPick.success]: merge((payload, state) => {
            return {
                setSetDriverPickFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setSetDriverPick.error]: merge((payload, state) => {
            return {
                setSetDriverPickFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setModHubCarInfo]: merge((payload, state) => {
            return {
                setModHubCarInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [setModHubCarInfo.success]: merge((payload, state) => {
            return {
                setModHubCarInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setModHubCarInfo.error]: merge((payload, state) => {
            return {
                setModHubCarInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [setModActivityInfo]: merge((payload, state) => {
            return {
                setModActivityInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [setModActivityInfo.success]: merge((payload, state) => {
            return {
                setModActivityInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setModActivityInfo.error]: merge((payload, state) => {
            return {
                setModActivityInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default setDataList;