import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'board',
    component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Business/WorkBoard/index')));
    }),
    onEnter: (nextState, replace, callback) => {
        doTabPage({
            id: nextState.location.pathname,
            name: "工作面板",
            route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
    },
    childRoutes: []
};