import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import CommonAction from 'ACTION/Assistant/CommonAction';

const STATE_NAME = 'state_ac_common';

const {
    GetHubList,
    GetBrokerSimpleList
} = CommonAction;

function InitialState() {
    return {
        state_name: STATE_NAME,
        HubSimpleList: [],
        BrokerSimpleList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [GetHubList]: merge((payload, state) => {
            return {};
        }),
        [GetHubList.success]: merge((payload, state) => {
            let list = payload.Data ? payload.Data.RecordList || [] : [];
            return {
                HubSimpleList: list.map((v) => ({HubID: v.HubID, HubName: v.HubName}))
            };
        }),
        [GetHubList.error]: merge((payload, state) => {
            return {};
        }),
        [GetBrokerSimpleList]: merge((payload, state) => {
            return {};
        }),
        [GetBrokerSimpleList.success]: merge((payload, state) => {
            let list = payload.Data ? payload.Data.RecordList || [] : [];
            return {
                BrokerSimpleList: list.map((v) => {
                    v.BrokerTmpName = v.NickName + '(' + v.BrokerAccount + ')';
                    return v;
                })
            };
        }),
        [GetBrokerSimpleList.error]: merge((payload, state) => {
            return {};
        })
    }
};
export default Reducer;