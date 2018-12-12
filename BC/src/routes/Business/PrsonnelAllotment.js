import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'PrsonnelAllotment',
    childRoutes: [
      {
        path: 'BusinessAffairs',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/BusinessAffairs/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "运维分配",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
      },
      {
        path: 'Distribution',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/Distribution/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "分配报表",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
      }

    ]
};