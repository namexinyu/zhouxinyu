import merge from 'REDUCER/merge';
import getRecruitNameList from 'ACTION/ExpCenter/Recruit/getRecruitNameList';

const STATE_NAME = 'state_ec_recruitNameList';

function InitialState() {
    return {
        state_name: STATE_NAME,
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
            return {recruitNameList: (payload.Data ? (payload.Data.RecruitList || []) : []).map((item, index) => {
                item.rowKey = index;
                return item;
            })};
        }),
        [getRecruitNameList.error]: (payload, state) => {
            return {recruitNameList: []};
        }
    }
};
export default Reducer;