// import {   injectReducer } from 'REDUCER'; import createContainer from
// 'UTIL/createContainer'
import createLazyViewLoader from './createLazyViewLoader';
import brokerRoute from './Broker/index';

export default {
    path: '/broker',
    // component: createLazyViewLoader(cb => {
    //     require.ensure([], require => cb(require('VIEW/App')));
    // }),
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/404')));
        })
    },

    childRoutes: [
        brokerRoute,
        // 重定向
        {
            path: 'login',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/404')));
            })
        },
        {
            path: 'test-request',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/TestRequest')));
            })
        },
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
