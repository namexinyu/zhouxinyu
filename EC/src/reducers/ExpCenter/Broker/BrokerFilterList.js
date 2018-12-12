import merge from 'REDUCER/merge';
import getBrokerFilterList from 'ACTION/ExpCenter/Broker/getBrokerFilterList';

const STATE_NAME = 'state_ec_brokerFilterList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        brokerFilterList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [getBrokerFilterList]: (payload, state) => {
            return {brokerFilterList: []};
        },
        [getBrokerFilterList.success]: merge((payload, state) => {
            return {brokerFilterList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                item.rowKey = index;
                return item;
            })};
        }),
        [getBrokerFilterList.error]: (payload, state) => {
            return {brokerFilterList: []};
        }
    }
};
export default Reducer;