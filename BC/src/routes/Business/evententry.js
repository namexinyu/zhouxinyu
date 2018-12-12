import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'event-management',
    childRoutes: [
      {
        path: 'list',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/Eventmanage/eventlist')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "事件列表",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
      },
      {
        path: 'baike',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/EventBaike/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "事件百科",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
      },
      {
        path: 'baike/detail',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/EventBaike/detail')));
        }),
        onEnter: (nextState, replace, callback) => {
            const id = nextState.location.pathname + nextState.location.search;
            doTabPage({
                id: id,
                name: "事件百科-详情",
                route: nextState.location.pathname, // this route should same to the history push
                query: nextState.location.query
            }, 'create');
            callback();
        }
      },
      {
        path: 'baike/edit',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/EventBaike/edit')));
        }),
        onEnter: (nextState, replace, callback) => {
            const id = nextState.location.pathname + nextState.location.search;
            doTabPage({
                id: id,
                name: `事件百科-编辑`,
                query: nextState.location.query,
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
      },
      {
        path: 'baike/new',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/EventBaike/new')));
        }),
        onEnter: (nextState, replace, callback) => {
            const id = nextState.location.pathname + nextState.location.search;
            doTabPage({
                id: id,
                name: `事件百科-添加`,
                query: nextState.location.query,
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
      },
    //   {
    //     path: 'apeallist',
    //     component: createLazyViewLoader(cb => {
    //         require.ensure([], require => cb(require('VIEW/Business/Eventmanage/eventlistappeal')));
    //     }),
    //     onEnter: (nextState, replace, callback) => {
    //         doTabPage({
    //             id: nextState.location.pathname,
    //             name: "待处理申诉列表",
    //             route: nextState.location.pathname // this route should same to the history push
    //         }, 'create');
    //         callback();
    //     }
    //   },
    //   {
    //     path: 'query',
    //     component: createLazyViewLoader(cb => {
    //         require.ensure([], require => cb(require('VIEW/Business/Eventmanage/eventquery')));
    //     }),
    //     onEnter: (nextState, replace, callback) => {
    //         doTabPage({
    //             id: nextState.location.pathname,
    //             name: "事件查询",
    //             route: nextState.location.pathname // this route should same to the history push
    //         }, 'create');
    //         callback();
    //     }
    //   },
      {
        path: 'arrange',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/Eventmanage/eventarrange')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "排班设置",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
      },
      {
        path: 'eventstype',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/Eventmanage/eventstype')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "事件类型统计",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
      },
      {
        path: 'dayservice',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Business/Eventmanage/eventserve')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "每日服务统计",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
      }
    //   {
    //     path: 'detail',
    //     component: createLazyViewLoader(cb => {
    //         require.ensure([], require => cb(require('VIEW/Business/Eventmanage/eventdetail')));
    //     }),
    //     onEnter: (nextState, replace, callback) => {
    //         doTabPage({
    //             id: nextState.location.pathname,
    //             name: "待处理详情",
    //             route: nextState.location.pathname // this route should same to the history push
    //         }, 'create');
    //         callback();
    //     }
    //   },
    //   {
    //     path: 'listdetail',
    //     component: createLazyViewLoader(cb => {
    //         require.ensure([], require => cb(require('VIEW/Business/Eventmanage/eventlistdetail')));
    //     }),
    //     onEnter: (nextState, replace, callback) => {
    //         doTabPage({
    //             id: nextState.location.pathname,
    //             name: "待处理申诉详情",
    //             route: nextState.location.pathname // this route should same to the history push
    //         }, 'create');
    //         callback();
    //     }
    //   },
    //   {
    //     path: 'querydetail',
    //     component: createLazyViewLoader(cb => {
    //         require.ensure([], require => cb(require('VIEW/Business/Eventmanage/eventquerydetail')));
    //     }),
    //     onEnter: (nextState, replace, callback) => {
    //         doTabPage({
    //             id: nextState.location.pathname,
    //             name: "查询详情",
    //             route: nextState.location.pathname // this route should same to the history push
    //         }, 'create');
    //         callback();
    //     }
    //   }
    ]
};