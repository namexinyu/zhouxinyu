import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'account',
    childRoutes: [
        {
            path: 'labor-account',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/AccountManage/LaborAccount')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "劳务账户",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'withdraw',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/AccountManage/Withdraw')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "会员提现",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'bank-back',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/AccountManage/BankBack')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "退回列表",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'balance-details',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/AccountManage/LaborAccount/Balance')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "收支明细",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'penny',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/AccountManage/Penny')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "一分钱测试",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        }
    ]
};