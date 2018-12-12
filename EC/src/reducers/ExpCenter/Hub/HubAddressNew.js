import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import addHubInfo from 'ACTION/ExpCenter/Hub/addHubInfo';

const STATE_NAME = 'state_ec_hubAddressNew';

function InitialState() {
    return {
        state_name: STATE_NAME,
        HubID: undefined, // 拓展字段，用于日后新增及修改同页面
        HubData: {
            HubID: 0, // 后台接口要求，新建时传0
            Address: {value: undefined},
            AdminID: undefined,
            AreaCode: {value: []},
            EnableStatus: 1,
            HubName: {value: undefined},
            HubType: 1,
            Longlat: {
                Longitude: undefined,
                Latitude: undefined
            },
            // PicPath: "ExpCenter/20171128/f482c9d2-6823-45dc-b5c0-d42a7b229e6f.jpg",
            PicPath: undefined,
            WorkTime: [{StartWeek: "周一", StopWeek: "周五", StartTime: "09:30", StopTime: "19:00"}]
        },
        AdminTmp: undefined,
        addHubInfoFetch: {
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
        [addHubInfo]: merge((payload, state) => {
            return {
                addHubInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [addHubInfo.success]: merge((payload, state) => {
            return {
                addHubInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [addHubInfo.error]: merge((payload, state) => {
            return {
                addHubInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;