import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
  path: 'account',
  indexRoute: {},
  childRoutes: [
    {
      path: 'list',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Assistant/AccountManage/AccountList/index')));
      }),
      onEnter: (nextState, replace, callback) => {
        doTabPage({
          id: nextState.location.pathname,
          name: "经纪人账号查询",
          route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
      }
    },
    {
      path: 'log',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Assistant/AccountManage/OperationLog/index')));
      }),
      onEnter: (nextState, replace, callback) => {
        doTabPage({
          id: nextState.location.pathname,
          name: "操作日志",
          route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
      }
    }
  ]
};
