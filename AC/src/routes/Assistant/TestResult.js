import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
  path: 'result',
  indexRoute: {},
  childRoutes: [
    {
      path: 'member',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Assistant/TestResult/MemberTestResult/index')));
      }),
      onEnter: (nextState, replace, callback) => {
        doTabPage({
          id: nextState.location.pathname,
          name: "会员考试结果统计",
          route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
      }
    },
    {
      path: 'member/detail/:brokerId/:querydate',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Assistant/TestResult/MemberTestDetail/index')));
      }),
      onEnter: (nextState, replace, callback) => {
        doTabPage({
          id: nextState.location.pathname,
          name: "会员考试结果详情",
          route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
      }
    },
    {
      path: 'factory',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Assistant/TestResult/FactoryTestResult/index')));
      }),
      onEnter: (nextState, replace, callback) => {
        doTabPage({
          id: nextState.location.pathname,
          name: "企业考试结果统计",
          route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
      }
    },
    {
      path: 'factory/detail/:brokerId',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Assistant/TestResult/FactoryTestDetail/index')));
      }),
      onEnter: (nextState, replace, callback) => {
        doTabPage({
          id: nextState.location.pathname,
          name: "企业考试结果详情",
          route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
      }
    },
    {
      path: 'exam',
      component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/Assistant/TestResult/Examunfamilarlist/index')));
      }),
      onEnter: (nextState, replace, callback) => {
        doTabPage({
          id: nextState.location.pathname,
          name: "不熟悉会员统计",
          route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
      }
    }

  ]
};
