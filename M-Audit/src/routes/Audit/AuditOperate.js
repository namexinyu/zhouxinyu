import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'operate',
    childRoutes: [
        {
            path: 'idCard',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditOperate/idCard')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "身份证审核",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'bankCard',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditOperate/bankCard')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "银行卡审核",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'workerCard',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditOperate/workerCard')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "工牌审核",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'attendance',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditOperate/attendance')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "考勤审核",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'review',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditOperate/review')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "错误重审",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'review/edit/:userId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditOperate/reviewEdit')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname + nextState.location.search,
                    name: "重新审核",
                    route: nextState.location.pathname + nextState.location.search
                }, 'create');
                callback();
            }
        }
    ]
};