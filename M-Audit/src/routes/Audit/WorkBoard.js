import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'board',
    component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Audit/WorkBoard/index')));
    }),
    onEnter: (nextState, replace, callback) => {
        doTabPage({
            id: nextState.location.pathname,
            name: "今日审核",
            route: nextState.location.pathname 
        }, 'create');
        callback();
    },
    childRoutes: []
};