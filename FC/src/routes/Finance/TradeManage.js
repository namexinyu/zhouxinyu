import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'trade-manage',
    childRoutes: [
        {
            path: 'user',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/user')));
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
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/labor')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "劳务订单",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'labor/order-info/:laborId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/laborOrderInfo')));
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
            path: 'fees',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/fees')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "收退费订单",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'fees/import',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/laborChargeImport')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "导入结底价名单",
                    route: nextState.location.pathname,
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'invite',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/invite')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "推荐费订单",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'dispatch',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/dispatch')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "报销订单",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'giftfee',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/giftfee')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "赠品押金",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'complain',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/complain')));
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
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/interview')));
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
            path: 'interview/import-interview/:red',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/interviewImport')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "导入面试名单",
                    route: nextState.location.pathname,
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'subsidy',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/subsidy')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "补贴管理",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'abnormal-subsidy',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/TradeManage/abnormal-subsidy')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "异常补贴管理",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        }
    ]
};