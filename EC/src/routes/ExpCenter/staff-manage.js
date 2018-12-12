import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'staff-manage',
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/ExpCenter/Resource/StaffManage/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "员工管理",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
    },
    childRoutes: []
};