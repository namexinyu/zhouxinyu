import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'broker',
    indexRoute: {},
    childRoutes: [
        {
            path: 'need-do-list',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Broker/NeedDoList/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "待办列表",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'need-do-detail',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Broker/NeedDoDetail/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "待办事项",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'attendance',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Broker/AttendanceManage/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "门店排班",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'performance',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Broker/Performance/performanceList')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "绩效查询",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'daily-count',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Broker/SignInterviewCount/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "实时数据",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }, {
            path: 'performance-pk',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Broker/PerformancePK/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "红绿榜PK",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};