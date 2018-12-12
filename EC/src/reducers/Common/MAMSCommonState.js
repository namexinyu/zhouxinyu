import merge from 'REDUCER/merge';
import moment from 'moment';
import MAMSCommonAction from 'ACTION/Common/MAMSCommonAction';

const STATE_NAME = 'state_mams_common';

const {
    GetHubList
} = MAMSCommonAction;

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
        })
    }
};
export default Reducer;