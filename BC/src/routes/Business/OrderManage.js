import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'order-manage',
    childRoutes: [
        {
            path: 'user',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/OrderManage/user')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "会员订单",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'labor',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/OrderManage/labor')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "催结算名单",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'labor/order-info/:laborId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/OrderManage/laborOrderInfo')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname + nextState.location.search,
                    name: "劳务订单详情",
                    route: nextState.location.pathname + nextState.location.search,
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'labor/import-interview/:laborId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/OrderManage/laborInterviewImport')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname + nextState.location.search,
                    name: "导入面试名单",
                    route: nextState.location.pathname + nextState.location.search,
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'labor/import-settle/:laborId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/OrderManage/laborSettleImport')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname + nextState.location.search,
                    name: "导入结算名单",
                    route: nextState.location.pathname + nextState.location.search,
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'complain',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/OrderManage/complain')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "申诉订单",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'interview',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/OrderManage/interview')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "面试名单",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'factory',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/OrderManage/factory')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "厂门口接站",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        }
    ]
};