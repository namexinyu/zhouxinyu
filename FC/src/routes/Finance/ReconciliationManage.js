import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'reconcile',
    childRoutes: [
        {
            path: 'service-bill',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/ReconciliationManage/bill')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "服务费账单",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'service-bill/import-bill',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/ReconciliationManage/billImport')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "导入开票金额",
                    route: nextState.location.pathname,
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'bill-detail',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/ReconciliationManage/billDetail')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "服务费明细",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'settle-abnormal',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/ReconciliationManage/abnormal')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "结算异常明细",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        }
    ]
};