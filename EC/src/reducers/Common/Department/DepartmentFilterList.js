import merge from 'REDUCER/merge';
import GetDepartmentFilterList from 'ACTION/Common/Department/GetDepartmentFilterList';

const STATE_NAME = 'state_mams_departmentFilterList';

function InitialState() {
    return {
        departmentFilterList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [GetDepartmentFilterList]: (payload, state) => {
            return {departmentFilterList: []};
        },
        [GetDepartmentFilterList.success]: merge((payload, state) => {
            let list = payload.Data ? (payload.Data.DepartList || []) : [];
            return {departmentFilterList: list};
        }),
        [GetDepartmentFilterList.error]: (payload, state) => {
            return {departmentFilterList: []};
        }
    }
};
export default Reducer;