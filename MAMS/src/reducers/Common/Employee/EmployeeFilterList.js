import merge from 'REDUCER/merge';
import GetMAMSEmployeeFilterList from 'ACTION/Common/Employee/GetMAMSEmployeeFilterList';

const STATE_NAME = 'state_mams_employeeFilterList';

function InitialState() {
    return {
        employeeFilterList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [GetMAMSEmployeeFilterList]: (payload, state) => {
            return {employeeFilterList: []};
        },
        [GetMAMSEmployeeFilterList.success]: merge((payload, state) => {
            let list = payload.Data ? (payload.Data.EmployeeList || []) : [];
            return {employeeFilterList: list};
        }),
        [GetMAMSEmployeeFilterList.error]: (payload, state) => {
            return {employeeFilterList: []};
        }
    }
};
export default Reducer;