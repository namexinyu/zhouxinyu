import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'callback',
    childRoutes: [
        {
            path: 'entry',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/Callback/callbackEntry')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "入职回访",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'feedback',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Audit/Feedback/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "400投诉列表",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        }
    ]
};