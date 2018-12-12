import createLazyViewLoader from './createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';
import boardRoute from './Business/WorkBoard';
import servicerRoute from './Business/Servicer';
import OrderManageRoute from './Business/OrderManage';
import Recruitment from './Business/Recruitment';
import Assistance from './Business/Assistance';
import Evententry from './Business/evententry';
import Message from './Business/Message';
import Cooperation from './Business/Cooperation';
import PrsonnelAllotment from './Business/PrsonnelAllotment';
export default {
    path: '/bc',
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
        servicerRoute,
        OrderManageRoute,
        Recruitment,
        Assistance,
        Evententry,
        Message,
        Cooperation,
        PrsonnelAllotment,
        {
            path: 'ugc',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/UGC')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "UGC审核",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            },
            childRoutes: []
        },
        {
            path: 'log/:platformId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/AllLog/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: '查看日志',
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
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
