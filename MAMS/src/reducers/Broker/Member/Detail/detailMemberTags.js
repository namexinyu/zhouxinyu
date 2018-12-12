import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberTags from 'ACTION/Broker/MemberDetail/getMemberTags';
import setMemberTags from 'ACTION/Broker/MemberDetail/setMemberTags';

const STATE_NAME = 'state_broker_member_detail_tags';

function InitialState() {
    return {
        IDCardType: {},
        Education: {},
        Characters: {},
        Math: {},
        ForeignBodies: {},
        Criminal: {},
        Clothes: {},
        Tattoo: {},
        SmokeScar: {},
        memberTags: {
            OtherStatus: {}
        },
        getMemberTagsFetch: {
            status: 'close',
            response: ''
        },
        setMemberTagsFetch: {
            status: 'close',
            response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
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
        [setMemberTags]: merge((payload, state) => {
            return {
                setMemberTagsFetch: {
                    status: 'pending'
                }
            };
        }),
        [setMemberTags.success]: merge((payload, state) => {
            return {
                setMemberTagsFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [setMemberTags.error]: merge((payload, state) => {
            return {
                setMemberTagsFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getMemberTags]: merge((payload, state) => {
            return {
                getMemberTagsFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberTags.success]: merge((payload, state) => {
            return {
                getMemberTagsFetch: {
                    status: 'success',
                    response: payload
                },
                memberTags: Object.assign({ OtherStatus: {} }, state.memberTags, payload.Data.UserTags ? JSON.parse(payload.Data.UserTags) : {})
            };
        }),
        [getMemberTags.error]: merge((payload, state) => {
            return {
                getMemberTagsFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;