import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import editBoardingAddress from 'ACTION/ExpCenter/BoardingAddress/editBoardingAddress';

const STATE_NAME = 'state_ec_boardingAddressDetail';

function InitialState() {
    return {
        state_name: STATE_NAME,
        bdAddrID: undefined, // 拓展字段，用于日后新增及修改同页面
        bdAddrData: undefined,
        bdAddrDataOri: undefined,
        bdAddrDataList: [], // 拓展字段，用于日后允许打开多个详情页
        editBoardingAddressFetch: {
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
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return {
                    queryParams: new InitialState().queryParams
                };
            }
            return {};

        }),
        [editBoardingAddress]: merge((payload, state) => {
            return {
                editBoardingAddressFetch: {
                    status: 'pending'
                }
            };
        }),
        [editBoardingAddress.success]: merge((payload, state) => {
            return {
                editBoardingAddressFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [editBoardingAddress.error]: merge((payload, state) => {
            return {
                editBoardingAddressFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;