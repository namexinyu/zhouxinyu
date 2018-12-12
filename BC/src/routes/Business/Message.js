import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'Message',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/Message/message')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "消息列表",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        },
    childRoutes: []
};