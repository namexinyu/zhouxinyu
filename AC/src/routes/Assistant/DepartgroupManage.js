import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
  path: 'departgroup',
  indexRoute: {},
  childRoutes: [
    {
      path: 'department-manage',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Assistant/DepartgroupManage/DepartmentManage/index')));
      }),
      onEnter: (nextState, replace, callback) => {
        doTabPage({
          id: nextState.location.pathname,
          name: "经纪中心部门管理",
          route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
      }
    },
    {
      path: 'group-manage',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Assistant/DepartgroupManage/GroupManage/index')));
      }),
      onEnter: (nextState, replace, callback) => {
        doTabPage({
          id: nextState.location.pathname,
          name: "经纪中心战队管理",
          route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
      }
    }
  ]
};
