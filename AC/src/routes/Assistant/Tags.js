import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'tags',
    indexRoute: {},
    childRoutes: [
        {
            path: 'list',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Tags/TagList/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "标签库",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'match',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Assistant/Tags/TagMatch/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "标签匹配",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};