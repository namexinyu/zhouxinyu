import merge from 'REDUCER/merge';
import getDriverFilterList from 'ACTION/ExpCenter/HubEmployee/getDriverFilterList';

const STATE_NAME = 'state_ec_driverFilterList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        driverFilterList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [getDriverFilterList]: (payload, state) => {
            return {driverFilterList: []};
        },
        [getDriverFilterList.success]: merge((payload, state) => {
            return {driverFilterList: (payload.Data ? (payload.Data.RecordList || []) : []).map((item, index) => {
                item.rowKey = index;
                return item;
            })};
        }),
        [getDriverFilterList.error]: (payload, state) => {
            return {driverFilterList: []};
        }
    }
};
export default Reducer;