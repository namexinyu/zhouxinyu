import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'finance',
    indexRoute: {},
    childRoutes: [
        {
            path: 'subsidy',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Finance/subsidy')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "会员补贴",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'recommendation',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Finance/recommendation')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "推荐费",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        }
    ]
};