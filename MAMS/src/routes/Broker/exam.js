import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';
export default {
    path: 'exam',
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Broker/Exam/index')));
        })
    },
    onEnter: (nextState, replace, callback) => {
        doTabPage({
            id: nextState.location.pathname,
            name: "考试测验",
            route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
    },
    childRoutes: [
    ]
};