import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'report',
    indexRoute: {},
    childRoutes: [
        {
            path: 'interview',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Report/InterviewReport/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "每日面试统计",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'employed',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Report/DailyEmployedReport/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "每日入职统计",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'recommend',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Report/DailyRecommendReport/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "每日推荐统计",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'pick-up',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Report/PickUpReport/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "明日预接站统计",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'schedule',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Report/BrokerScheduleReport/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "经纪人排班",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'removeMobile',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Report/removeMobile/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "空号移除统计",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'presign-trace',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Report/PresignTraceReport/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "预签到走向",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};
