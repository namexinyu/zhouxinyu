import merge from '../../merge';
import getPromotionDetail from 'ACTION/ExpCenter/PromotionDetail';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
const STATE_NAME = 'state_ec_promotionDetail';
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
        getPromotionDetailFetch: {
            status: 'pending',
            response: ''
        },
        RecordListLoading: false,
        RecommendList: [],
        TotalCount: 0,
        parms: {
            RecordIndex: 0,
            RecordSize: 2000,
            HubIDList: [],
            Date: '',
            strIDCardNum: '',
            ReceAccount: ''
        }
    };
}

const getPromotionDetailList = {
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
        [getPromotionDetail]: merge((payload, state) => {
            return {
                RecordListLoading: true,
                getPromotionDetailFetch: {
                    status: 'pending'
                }
            };
        }),
        [getPromotionDetail.success]: merge((payload, state) => {
            return {
                getPromotionDetailFetch: {
                    status: 'success',
                    response: payload
                },
                RecordListLoading: false,
                RecommendList: payload.Data.RecommendList ? addKey(payload.Data.RecommendList) : [],
                TotalCount: payload.Data.TotalCount
            };
        }),
        [getPromotionDetail.error]: merge((payload, state) => {
            return {
                RecordListLoading: false,
                getPromotionDetailFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default getPromotionDetailList;