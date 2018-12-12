import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'callback',
    indexRoute: {},
    childRoutes: [
        {
            path: 'interview',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Callback/CallbackInterview')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "面试回访",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'badge',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Callback/CallbackBadge')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "工牌回访",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'week',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Callback/CallbackWorking')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "一周回访",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        }
    ]
};