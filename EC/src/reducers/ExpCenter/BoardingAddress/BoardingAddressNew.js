import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import addBoardingAddress from 'ACTION/ExpCenter/BoardingAddress/addBoardingAddress';

const STATE_NAME = 'state_ec_boardingAddressNew';

function InitialState() {
    return {
        state_name: STATE_NAME,
        bdAddrID: undefined, // 拓展字段，用于日后新增及修改同页面
        bdAddrData: {
            Address: undefined,
            AreaCode: [],
            EnableStatus: 1,
            LocationID: 0,
            LocationName: undefined,
            Longlat: {
                Latitude: undefined,
                Longitude: undefined
            }
        },
        bdAddrDataList: [], // 拓展字段，用于日后允许打开多个详情页
        addBoardingAddressFetch: {
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
        [addBoardingAddress]: merge((payload, state) => {
            return {
                addBoardingAddressFetch: {
                    status: 'pending'
                }
            };
        }),
        [addBoardingAddress.success]: merge((payload, state) => {
            return {
                addBoardingAddressFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [addBoardingAddress.error]: merge((payload, state) => {
            return {
                addBoardingAddressFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;