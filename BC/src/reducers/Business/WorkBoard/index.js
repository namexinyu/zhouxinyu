import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import WorkBoardAction from 'ACTION/Business/WorkBoard';

const {
    getPendingCount,
    getLabourScale,
    getTomorrowOffer,
    getTransport,
    getTypeCount
} = WorkBoardAction;

const STATE_NAME = 'state_business_workBoard';
const initialState = {
    PendingCount: {
        AppealAmount: 0,
        DelayAmount: 0,
        EntrustAmount: 0,
        InterviewAmount: 0,
        OfferAmount: 0,
        UrgeAmount: 0
    },
    getPendingCountFetch: {
        status: 'close',
        response: ''
    },
    LabourScale: [],
    getLabourScaleFetch: {
        status: 'close',
        response: ''
    },
    TomorrowOffer: {
        Arecruit: 0,
        Atype: 0,
        Brecruit: 0,
        Btype: 0,
        Crecruit: 0,
        Ctype: 0
    },
    getTomorrowOfferFetch: {
        status: 'close',
        response: ''
    },
    Transport: [],
    getTransportFetch: {
        status: 'close',
        response: ''
    },
    TypeCount: {
        AmountListA: [],
        AmountListB: [],
        AmountListC: []
    },
    getTypeCountFetch: {
        status: 'close',
        response: ''
    }
};
const Reducer = {
    initialState: initialState,
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return initialState;
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
        [getPendingCount]: merge((payload, state) => {
            return {
                getPendingCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getPendingCount.success]: merge((payload, state) => {
            return {
                getPendingCountFetch: {
                    status: 'success',
                    response: payload
                },
                PendingCount: payload.Data
            };
        }),
        [getPendingCount.error]: merge((payload, state) => {
            return {
                getPendingCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getLabourScale]: merge((payload, state) => {
            return {
                getLabourScaleFetch: {
                    status: 'pending'
                }
            };
        }),
        [getLabourScale.success]: merge((payload, state) => {
            return {
                getLabourScaleFetch: {
                    status: 'success',
                    response: payload
                },
                LabourScale: payload.Data.LabourList || []
            };
        }),
        [getLabourScale.error]: merge((payload, state) => {
            return {
                getLabourScaleFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getTomorrowOffer]: merge((payload, state) => {
            return {
                getTomorrowOfferFetch: {
                    status: 'pending'
                }
            };
        }),
        [getTomorrowOffer.success]: merge((payload, state) => {
            return {
                getTomorrowOfferFetch: {
                    status: 'success',
                    response: payload
                },
                TomorrowOffer: payload.Data
            };
        }),
        [getTomorrowOffer.error]: merge((payload, state) => {
            return {
                getTomorrowOfferFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getTransport]: merge((payload, state) => {
            return {
                getTransportFetch: {
                    status: 'pending'
                }
            };
        }),
        [getTransport.success]: merge((payload, state) => {
            return {
                getTransportFetch: {
                    status: 'success',
                    response: payload
                },
                Transport: payload.Data.AmountList || []
            };
        }),
        [getTransport.error]: merge((payload, state) => {
            return {
                getTransportFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getTypeCount]: merge((payload, state) => {
            return {
                getTypeCountFetch: {
                    status: 'pending'
                }
            };
        }),
        [getTypeCount.success]: merge((payload, state) => {
            return {
                getTypeCountFetch: {
                    status: 'success',
                    response: payload
                },
                TypeCount: payload.Data || {}
            };
        }),
        [getTypeCount.error]: merge((payload, state) => {
            return {
                getTypeCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;