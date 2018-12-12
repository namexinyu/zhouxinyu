import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'daily',
    indexRoute: {},
    childRoutes: [
        {
            path: 'business',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Broker/business/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "企业情况",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};