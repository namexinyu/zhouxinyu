import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'manager',
    indexRoute: {},
    childRoutes: [
        {
            path: 'transfer',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/BrokerManager/ManagerTransfer/managerTransfer')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "划转会员",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'transfer-log',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/BrokerManager/ManagerTransfer/managerTransferLog')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "划转日志",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        }
    ]
};