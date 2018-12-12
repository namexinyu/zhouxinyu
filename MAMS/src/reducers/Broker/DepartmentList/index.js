import merge from 'REDUCER/merge';
import getDepartmentList from 'ACTION/Broker/Department/getDepartmentList';

const STATE_NAME = 'state_broker_departmentNameList';

function InitialState() {
    return {
        departmentNameList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [getDepartmentList]: (payload, state) => {
            return {departmentNameList: []};
        },
        [getDepartmentList.success]: merge((payload, state) => {
            return {departmentNameList: payload.Data.DepartList || []};
        }),
        [getDepartmentList.error]: (payload, state) => {
            return {departmentNameList: []};
        }
    }
};
export default Reducer;