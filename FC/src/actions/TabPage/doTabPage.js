import createAction from 'ACTION/createAction';

function checkTab(tabItem, type) {
    return {
        payload: {
            tabItem: tabItem,
            type: type
        }
    };
};

if (!__PROD__) {
    checkTab.actionType = __filename;
};

export default createAction(checkTab);