import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'event-management',
    childRoutes: [{
        path: 'list',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Finance/Eventmanage/eventlist')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "事件列表",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
    }]
};