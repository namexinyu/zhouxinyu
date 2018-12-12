import createLazyViewLoader from './createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';
import boardRoute from './Audit/WorkBoard';
import AuditOperate from './Audit/AuditOperate';
import AuditList from './Audit/AuditList';
import Assistance from './Audit/Assistance';
import Callback from './Audit/Callback';
import Evententry from './Audit/evententry';
export default {
    path: '/audit',
    component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/App')));
    }),
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/404')));
        })
    },

    childRoutes: [
        boardRoute,
        AuditOperate,
        AuditList,
        Assistance,
        Callback,
        Evententry,
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
