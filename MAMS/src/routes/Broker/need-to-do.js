import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'need-do',
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Broker/NeedToDo/NeedDo')));
        })
    },
    onEnter: (nextState, replace, callback) => {
        doTabPage({
            id: nextState.location.pathname,
            name: "需求",
            route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
    },
    childRoutes: []
};