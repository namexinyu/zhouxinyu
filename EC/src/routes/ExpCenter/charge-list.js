import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'charge-list',
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/ExpCenter/Scene/ChargeList/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "收退费列表",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
    },
    childRoutes: []
};