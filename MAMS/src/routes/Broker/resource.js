import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'resource',
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Broker/Resource/resource')));
        })
    },
    onEnter: (nextState, replace, callback) => {
        doTabPage({
            id: nextState.location.pathname,
            name: "资源申请",
            route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
    },
    childRoutes: []
};