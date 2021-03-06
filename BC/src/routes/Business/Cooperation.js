import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'cooperation',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/Cooperation/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "商务合作",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        },
    childRoutes: []
};