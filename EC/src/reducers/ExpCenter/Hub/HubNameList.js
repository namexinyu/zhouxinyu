import merge from 'REDUCER/merge';
import getHubNameList from 'ACTION/ExpCenter/Hub/getHubNameList';

const STATE_NAME = 'state_ec_hubNameList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        hubNameList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [getHubNameList]: (payload, state) => {
            return {hubNameList: []};
        },
        [getHubNameList.success]: merge((payload, state) => {
            return {hubNameList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                item.rowKey = index;
                return item;
            })};
        }),
        [getHubNameList.error]: (payload, state) => {
            return {hubNameList: []};
        }
    }
};
export default Reducer;