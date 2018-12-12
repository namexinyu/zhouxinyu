import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'hub',
    indexRoute: {},
    childRoutes: [
        {
            path: 'new',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/ExpCenter/Station/HubAddressNew/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "新建体验中心",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'detail/:HubID',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/ExpCenter/Station/HubAddressDetail/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "体验中心详情", // + (nextState.params.HubID > 0 ? '-' + nextState.params.HubID : ''),
                    uniqueKey: '/ec/main/hub/detail',
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};