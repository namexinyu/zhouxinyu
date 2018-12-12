import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';

const {
    getExamplePictureRecords,
    editExamplePicture
} = AuditOperateAction;

const STATE_NAME = 'state_audit_example_list';

function InitialState() {
    return {
        recordCount: 0,
        recordIndex: 0,
        page: 1,
        pageSize: 10,
        recordList: [],
        searchEntId: {},
        editEntId: {},
        editWorkerCardPic: [],
        editAttendancePic: [],
        currentExampleInfo: '',
        getExamplePictureRecordsFetch: {
            status: 'close',
            response: ''
        },
        editExamplePictureFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetQueryParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let init = new InitialState();
                for (let key in init) {
                    if (!(/^q\_\S+/.test(key))) {
                        delete init[key];
                    }
                }
                return init;
            }
            return {};
        }),
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let temp = Object.assign(new InitialState(), { resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0) });
                return temp;
            }
            return {};
        }),
        [setParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return payload.params;
            }
            return {};
        }),
        [setFetchStatus]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME && state.hasOwnProperty(payload.fetchName)) {
                state[payload.fetchName].status = payload.status;
                return state;
            }
            return {};
        }),
        [getExamplePictureRecords]: merge((payload, state) => {
            return {
                getExamplePictureRecordsFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getExamplePictureRecords.success]: merge((payload, state) => {
            return {
                getExamplePictureRecordsFetch: {
                    status: 'success',
                    response: payload
                },
                recordList: payload.Data && payload.Data.RecordList || [],
                recordCount: payload.Data && payload.Data.RecordCount || 0
            };
        }),
        [getExamplePictureRecords.error]: merge((payload, state) => {
            return {
                getExamplePictureRecordsFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [editExamplePicture]: merge((payload, state) => {
            return {
                editExamplePictureFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [editExamplePicture.success]: merge((payload, state) => {
            return {
                editExamplePictureFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [editExamplePicture.error]: merge((payload, state) => {
            return {
                editExamplePictureFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;

