import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';

import getRecruitList from 'ACTION/Broker/Recruit/getRecruitList';
import getRecruitRequireInfo from 'ACTION/Broker/Recruit/getRecruitRequireInfo';


const STATE_NAME = 'state_broker_recruitList';

function InitialState() {
    return {
        recruitList: [],
        MemberPhone: undefined, // 用于会员匹配工作标签
        queryParams: {
            RecruitDate: moment(),
            Recommend: -1,
            PositionName: '',
            MinSalary: undefined,
            MaxSalary: undefined,
            Subsidy: -1,
            Charge: -1,
            Gender: -1,
            Age: undefined,
            NationInfo: undefined,
            IDCardType: -1,
            Tattoo: -1,
            SmokeR: -1,
            Clothes: -1,
            WorkPosture: -1,
            English: -1,
            Math: -1,
            Eye: -1,
            Metal: -1,
            CheckCriminal: -1
        },
        currentRecruitID: undefined,
        currentRecruitRequire: {},
        currentRecruit: {},
        orderParams: {Key: 'RecruitID', Order: 1},
        currentPage: 1,
        pageSize: 20,
        totalSize: 0,
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
        [getRecruitList]: merge((payload, state) => {
            return {
                getRecruitListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getRecruitList.success]: merge((payload, state) => {
            let list = payload.Data.RecruitList || [];
            if (state.currentPage != 1) {
                list = state.recruitList.concat(list);
            }
            return {
                getRecruitListFetch: {
                    status: 'success',
                    response: payload
                },
                recruitList: list,
                totalSize: payload.Data.RecordCount || 0
            };
        }),
        [getRecruitList.error]: merge((payload, state) => {
            return {
                getRecruitListFetch: {
                    status: 'error',
                    response: payload
                }
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
                currentRecruitRequire: payload.Data
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