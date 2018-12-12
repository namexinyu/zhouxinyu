import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'broker',
    indexRoute: {},
    childRoutes: [
        {
            path: 'everysign',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Broker/Everysign/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "经纪人每日面试统计数",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};