import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import ActionEnterprise from 'ACTION/Business/Enterprise/ActionEnterprise';

const {
    editEntDetailInfo,
    getEntDetailInfo
} = ActionEnterprise;

const STATE_NAME = 'state_servicer_enterprise_edit';

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
        editEntDetailInfoFetch: {
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
        [editEntDetailInfo]: merge((payload, state) => {
            return {
                editEntDetailInfoFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [editEntDetailInfo.success]: merge((payload, state) => {
            return {
                editEntDetailInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [editEntDetailInfo.error]: merge((payload, state) => {
            return {
                editEntDetailInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getEntDetailInfo]: merge((payload, state) => {
            return {
                getEntDetailInfoFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getEntDetailInfo.success]: merge((payload, state) => {
            return {
                getEntDetailInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [getEntDetailInfo.error]: merge((payload, state) => {
            return {
                getEntDetailInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;

