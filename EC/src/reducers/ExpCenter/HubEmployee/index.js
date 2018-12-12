import merge from 'REDUCER/merge';
import getHubEmployeeList from 'ACTION/ExpCenter/HubEmployee/getHubEmployeeList';

const STATE_NAME = 'state_ec_hubEmployeeList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        hubEmployeeList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [getHubEmployeeList]: (payload, state) => {
            return {hubEmployeeList: []};
        },
        [getHubEmployeeList.success]: merge((payload, state) => {
            return {hubEmployeeList: (payload.Data ? (payload.Data.EmployeeList || []) : []).map((item, index) => {
                item.rowKey = index;
                return item;
            })};
        }),
        [getHubEmployeeList.error]: (payload, state) => {
            return {hubEmployeeList: []};
        }
    }
};
export default Reducer;