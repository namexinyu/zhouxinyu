import merge from '../../merge';
import getBagListData from 'ACTION/Broker/BagList';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import {Constant} from 'UTIL/constant/index';

const STATE_NAME = 'state_broker_bag_list';

function addKey(arr) {
    let upArr = [];
    for (let i = 0; i < arr.length; i++) {
        arr[i].key = i.toString();
        upArr.push(arr[i]);
    }
    return upArr;
}

function InitialState() {
    return {
        getBagListFetch: {
            status: 'pending',
            response: ''
        },
        QueryRecruitBasicList: [],
        RecordListLoading: false,
        RecordTotalCount: 0,
        QueryParams: {
            CaseStatus: {value: '-1'},
            DayDealStatus: {value: '-1'},
            Time: {value: [null, null]},
            Mobile: {value: ''},
            RecruitTmpID: {value: {value: -1, text: ''}},
            RecordCount: Constant.pageSize,
            RecordStartIndex: 0,
            SequenceWay: 6,
            UserName: {value: ''}
        },
        showWindow: false,
        setPick: {},
        chooseTypes: [
            {
                name: "等待处理",
                chooseType: false
            },
            {
                name: "已处理",
                chooseType: false
            },
            {
                name: "已接到",
                chooseType: false
            },
            {
                name: "未接到",
                chooseType: false
            },
            {
                name: "已送达",
                chooseType: false
            }
        ],
        chooseAll: true,
        record: {},
        clickActive: null
    };
}

const getBagList = {
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
        [getBagListData]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                getBagListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getBagListData.success]: merge((payload, state) => {
            return {
                getBagListFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLoading: false,
                QueryRecruitBasicList: payload.Data ? (payload.Data.RecordList ? addKey(payload.Data.RecordList) : []) : [],
                RecordTotalCount: payload.Data ? payload.Data.PageInfo.TotalCount : 0
            };
        }),
        [getBagListData.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getBagListFetch: {
                    status: 'error',
                    response: payload
                },
                QueryRecruitBasicList: []
            };
        })
    }
};
export default getBagList;
