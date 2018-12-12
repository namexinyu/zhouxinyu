import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import addRefundData from 'ACTION/ExpCenter/InterviewRefund/addRefundData';

const STATE_NAME = 'state_ec_interviewRefund';

function InitialState() {
    return {
        state_name: STATE_NAME,
        InterviewID: undefined,
        InterviewData: undefined,
        RefundData: {
            // IDCardPicPath: "ExpCenter/20171128/f482c9d2-6823-45dc-b5c0-d42a7b229e6f.jpg",
            IDCardPicPath: undefined,
            RefundAmount: undefined,
            RefundPayType: 2,
            RefundReason: 1
        },
        addRefundDataFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                console.log('resetState', STATE_NAME);
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
        [addRefundData]: merge((payload, state) => {
            return {
                addRefundDataFetch: {
                    status: 'pending'
                }
            };
        }),
        [addRefundData.success]: merge((payload, state) => {
            return {
                addRefundDataFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [addRefundData.error]: merge((payload, state) => {
            return {
                addRefundDataFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;