import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import tabClose from 'ACTION/tabClose';

const STATE_NAME = 'state_business_recruitment_ent_edit';

function InitialState() {
    return {};
}

export default {
    initialState: new InitialState(),
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let initState = new InitialState();
                if (payload.fieldName) {
                    return {[payload.fieldName]: initState[payload.fieldName]};
                }
                return initState;
            }
            return {};
        }),
        [setParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return payload.params;
            }
            return {};
        }),
        [tabClose]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let initState = new InitialState();
                let extra = payload.extra;
                if (extra) {
                    if (extra.params) { // 组件Unmount时将state回写props
                        return Object.keys(extra.params).reduce((result, fieldName) => {
                            result[fieldName] = state[fieldName] && state[fieldName].maskClean === true ? initState[fieldName] : extra.params[fieldName];
                            return result;
                        }, {});
                    } else if (extra.fieldName) { // 组件tabClose并重置state的某field
                        return {
                            [extra.fieldName]:
                                extra.selfClose ? {maskClean: true} : initState[extra.fieldName]
                        };
                    } else { // 组件tabClose并重置state
                        return extra.selfClose ? {maskClean: true} : initState;
                    }
                }
            }
            return {};
        })
    }
};