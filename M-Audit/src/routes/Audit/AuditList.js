import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'list',
    childRoutes: [
        {
            path: 'idCard',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditList/idCard')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "身份证审核列表",
                    route: nextState.location.pathname 
                }, 'create');
                callback();
            }
        },
        {
            path: 'bankCard',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditList/bankCard')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "银行卡审核列表",
                    route: nextState.location.pathname 
                }, 'create');
                callback();
            }
        },
        {
            path: 'workerCard',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditList/workerCard')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "工牌审核列表",
                    route: nextState.location.pathname 
                }, 'create');
                callback();
            }
        },
        {
            path: 'attendance',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditList/attendance')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "考勤审核列表",
                    route: nextState.location.pathname 
                }, 'create');
                callback();
            }
        },
        {
            path: 'example',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/AuditList/exampleList')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "样例设置",
                    route: nextState.location.pathname 
                }, 'create');
                callback();
            }
        }
    ]
};