import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'boarding-address',
    indexRoute: {},
    childRoutes: [
        {
            path: 'new',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/ExpCenter/Station/BoardingAddressNew/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "新建上车地址",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'detail/:bdAddrID',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/ExpCenter/Station/BoardingAddressDetail/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "上车地址详情", // + (nextState.params.bdAddrID > 0 ? '-' + nextState.params.bdAddrID : ''),
                    uniqueKey: '/ec/main/boarding-address/detail',
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};