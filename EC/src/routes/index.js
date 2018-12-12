import createLazyViewLoader from './createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';
import expCenterRoutes from './ExpCenter/index';

export default {
    path: '/ec',
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Redirect')));
        })
    },
    childRoutes: [
        expCenterRoutes,
        // {
        //     path: 'login',
        //     components: createLazyViewLoader(cb => {
        //         require.ensure([], require => cb(require('VIEW/Login')));
        //     })
        // },
        {
            path: 'test',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Test')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "测试页面",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'test2',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Test/index2')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "测试页面2",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        // 重定向
        {
            path: 'redirect',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Redirect')));
            })
        },
        // 无路由匹配的情况一定要放到最后，否则会拦截所有路由
        {
            path: '*',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/404')));
            })
        }
    ]
};
