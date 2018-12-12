import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'career',
    indexRoute: {},
    childRoutes: [
        {
            path: 'performance',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Career/Performance/performanceList')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "绩效查询",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};