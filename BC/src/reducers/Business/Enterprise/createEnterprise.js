import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionEnterprise from 'ACTION/Business/Enterprise/ActionEnterprise';

const {
    createEntDetailInfo
} = ActionEnterprise;

const STATE_NAME = 'state_servicer_enterprise_create';

function InitialState() {
    return {
        categoryList: [],
        entShortName: '',
        entName: '',
        categoryId: {},
        scale: '',
        givenListDate: '',
        contactName: '',
        contactMobile: '',
        areaCode: undefined,
        address: '',
        longlat: '',
        clockRadius: '',
        clockLonglat: '',
        entDesc: '',
        entLogo: [],
        entBL: [],
        entOCC: [],
        entEnvironment: [],
        entWage: [],
        entStay: [],
        entEating: [],
        entBanner: [],
        showMap: false,
        createEntDetailInfoFetch: {
            status: 'close',
            response: ''
        },
        getEntDetailInfoFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                for (let key in init) {
                    if (!(/^q\_\S+/.test(key))) {
                        delete init[key];
                    }
                }
                return init;
                // return init.queryParams;
            }
            return {};
        }),
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
        [createEntDetailInfo]: merge((payload, state) => {
            return {
                createEntDetailInfoFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [createEntDetailInfo.success]: merge((payload, state) => {
            return {
                createEntDetailInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [createEntDetailInfo.error]: merge((payload, state) => {
            return {
                createEntDetailInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;

