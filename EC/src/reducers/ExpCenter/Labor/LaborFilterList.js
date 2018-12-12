import merge from 'REDUCER/merge';
import getLaborFilterList from 'ACTION/ExpCenter/Labor/getLaborFilterList';

const STATE_NAME = 'state_ec_laborFilterList';

function InitialState() {
    return {
        state_name: STATE_NAME,
        laborFilterList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [getLaborFilterList]: (payload, state) => {
            return {laborFilterList: []};
        },
        [getLaborFilterList.success]: merge((payload, state) => {
            return {laborFilterList: (payload.Data ? (payload.Data.LaborList || []) : []).map((item, index) => {
                item.rowKey = index;
                return item;
            })};
        }),
        [getLaborFilterList.error]: (payload, state) => {
            return {laborFilterList: []};
        }
    }
};
export default Reducer;