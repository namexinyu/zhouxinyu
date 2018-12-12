import merge from 'REDUCER/merge';
import setParams from 'ACTION/setParams';

const STATE_NAME = 'state_ec_addressManage';

function InitialState() {
    return {
        state_name: STATE_NAME,
        currentTab: 'hub'
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [setParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return payload.params;
            }
            return {};
        })
    }
};
export default Reducer;