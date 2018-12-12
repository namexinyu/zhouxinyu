import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import doTabPage from 'ACTION/TabPage/doTabPage';
import NavConfig from 'CONFIG/NavConfig';

const STATE_NAME = 'state_tabPage';
const INIT_PAGE = NavConfig.INIT_NAV ? {
    id: 'sideNav_' + NavConfig.INIT_NAV.id,
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

          let { tabList, sortList, currentTab } = state;
          const { tabItem, type } = payload;
          const { isMemberDetailPage } = tabItem;
          let newState = {};

          switch (type) {
            case 'create':
              const isTabExist = tabList.filter((item) => {
                return isMemberDetailPage ? (item.isMemberDetailPage === isMemberDetailPage)
                  : item.id === tabItem.id;
              }).length > 0;

              newState = {
                currentTab: tabItem,
                tabList: (isMemberDetailPage && isTabExist) ? tabList.map((item) => item.isMemberDetailPage ? (item.id === tabItem.id ? item : tabItem) : item)
                  : (isTabExist ? tabList : tabList.concat(tabItem)),
                sortList: sortList.filter((item) => {
                  return isMemberDetailPage ? item.indexOf('/broker/member/detail') === -1
                    : item !== tabItem.id;
                }).concat(tabItem.id)
              };
              break;
            case 'click':
              newState = {
                currentTab: tabItem,
                tabList,
                sortList: sortList.filter(item => item !== tabItem.id).concat(tabItem.id)
              };
              break;
            case 'close':
              const newTabList = tabList.filter(item => item.id !== tabItem.id);
              const newSortList = sortList.filter(item => item !== tabItem.id);

              if (newTabList.length < 1) {
                newState = new InitialState();
              } else {
                newState = {
                  currentTab: newTabList.filter(item => item.id === newSortList[newSortList.length - 1])[0],
                  tabList: newTabList,
                  sortList: newSortList
                };
              }
              break;

            case 'closeAll':
              newState = new InitialState();
              break;

            case 'closeOther':
              newState = {
                currentTab: tabItem,
                tabList: [tabItem],
                sortList: [tabItem.id]
              };
              break;
          }

          return newState;
        })
    }
};
export default Reducer;
