import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';

import getBusTypeList from 'ACTION/ExpCenter/ShuttleBus/getBusTypeList';
import getRecruitRequireInfo from 'ACTION/ExpCenter/Recruit/getRecruitRequireInfo';


const STATE_NAME = 'reducersBusType';

function InitialState() {
    return {
        state_name: STATE_NAME,
        RecordList: [],
        formSpread: true,
        MemberPhone: undefined, // 用于会员匹配工作标签
        queryParams: {
            ModalSeatNum: "",
            SeatNum: {value: ""}
        },
        displayModal: false,
        ModalType: "",
        RecordCount: 0,
        selectedRowKeys: [],
        currentRecruit: {},
        pageParam: {
            RecordIndex: 1,
            RecordSize: 10
        },
        getRecruitListFetch: {
            status: 'close',
            response: ''
        },
        getRecruitRequireInfoFetch: {
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
        [getBusTypeList]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'pending'
                },
                RecordListLoading: true
            };
        }),
        [getBusTypeList.success]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordList: payload.Data.RecordList || [],
                RecordCount: payload.Data.RecordCount
            };
        }),
        [getBusTypeList.error]: merge((payload, state) => {
            return {
                getAuRoleListFetch: {
                    status: 'error',
                    response: payload
                },
                RecordListLoading: false,
                RecordList: [],
                RecordCount: 0
            };
        }),
        // 请求Action三连发分割线
        [getRecruitRequireInfo]: merge((payload, state) => {
            return {
                getRecruitRequireInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRecruitRequireInfo.success]: merge((payload, state) => {
            return {
                getRecruitRequireInfoFetch: {
                    status: 'success',
                    response: payload
                },
                currentRecruitRequire: payload.Data || {}
            };
        }),
        [getRecruitRequireInfo.error]: merge((payload, state) => {
            return {
                getRecruitRequireInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;