import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'BusSchedule',
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/ExpCenter/ShuttleBus/BusSchedule/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "班次管理",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
    },
    childRoutes: []
};