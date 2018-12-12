import merge from 'REDUCER/merge';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';

const STATE_NAME = 'state_broker_recruitNameList';

function InitialState() {
    return {
        recruitNameList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [getRecruitNameList]: (payload, state) => {
            return {recruitNameList: []};
        },
        [getRecruitNameList.success]: merge((payload, state) => {
            return {recruitNameList: payload.Data.RecruitList};
        }),
        [getRecruitNameList.error]: (payload, state) => {
            return {recruitNameList: []};
        }
    }
};
export default Reducer;