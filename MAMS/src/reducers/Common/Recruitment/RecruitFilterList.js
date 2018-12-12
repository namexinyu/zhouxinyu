import merge from 'REDUCER/merge';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

const STATE_NAME = 'state_mams_recruitFilterList';

const {
    GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;


function InitialState() {
    return {
        recruitFilterList: []
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [GetMAMSRecruitFilterList]: (payload, state) => {
            return {recruitFilterList: []};
        },
        [GetMAMSRecruitFilterList.success]: merge((payload, state) => {
            let list = payload.Data ? (payload.Data.RecordList || []) : [];
            return {recruitFilterList: list};
        }),
        [GetMAMSRecruitFilterList.error]: (payload, state) => {
            return {recruitFilterList: []};
        }
    }
};
export default Reducer;