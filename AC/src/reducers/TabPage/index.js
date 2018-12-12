import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import doTabPage from 'ACTION/TabPage/doTabPage';
import NavConfig from 'CONFIG/NavConfig';

const STATE_NAME = 'state_tabPage';
const INIT_PAGE = NavConfig.INIT_NAV ? {
    id: NavConfig.INIT_NAV.route,
    name: NavConfig.INIT_NAV.name,
    route: NavConfig.INIT_NAV.route
} : '';

function InitialState() {
    return {
        tabList: INIT_PAGE ? [INIT_PAGE] : [],
        sortList: INIT_PAGE ? [INIT_PAGE.id] : [],
        currentTab: INIT_PAGE ? INIT_PAGE : ''
    };
}
const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return new InitialState();
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
        [doTabPage]: merge((payload, state) => {
            let tabItem = payload.tabItem;
            let old = state.tabList;
            let osort = state.sortList;
            let currentTab = state.currentTab;
            if (payload.type === 'create') {
                for (let i = 0; i < old.length; i++) {
                    if (old[i].id === tabItem.id) {
                        for (let j = 0; j < osort.length; j++) {
                            if (osort[j] === tabItem.id) {
                                osort.splice(j, 1);
                                osort.push(tabItem.id);
                                currentTab = tabItem;
                            }
                        }
                        return {
                            currentTab: currentTab,
                            tabList: old,
                            sortList: osort
                        };
                    }
                }
                osort.push(tabItem.id);
                old.push(tabItem);
                currentTab = tabItem;
                return {
                    currentTab: currentTab,
                    tabList: old,
                    sortList: osort
                };
            }
            if (payload.type === 'click') {
                for (let i = 0; i < osort.length; i++) {
                    if (osort[i] === tabItem.id) {
                        osort.splice(i, 1);
                        osort.push(tabItem.id);
                        currentTab = tabItem;
                    }
                }
                return {
                    currentTab: currentTab,
                    tabList: old,
                    sortList: osort
                };
            }
            if (payload.type === 'close') {
                for (let i = 0; i < old.length; i++) {
                    if (old[i].id === tabItem.id) {
                        old.splice(i, 1);
                        break;
                    }

                }
                for (let k = 0; k < osort.length; k++) {
                    if (osort[k] === tabItem.id) {
                        osort.splice(k, 1);
                        break;
                    }
                }
                let currentTabId = osort[osort.length - 1];
                for (let j = 0; j < old.length; j++) {
                    if (old[j].id === currentTabId) {
                        currentTab = old[j];
                        break;
                    }
                }
                if (old.length < 1) {
                    return new InitialState();
                } else {
                    return {
                        currentTab: currentTab,
                        tabList: old,
                        sortList: osort
                    };
                }

            }
            if (payload.type === 'closeAll') {
                return new InitialState();
            }
            if (payload.type === 'closeOther') {
                return {
                    currentTab: tabItem,
                    tabList: [tabItem],
                    sortList: [tabItem.id]
                };
            }
            return {};
        })
    }
};
export default Reducer;