import createLazyViewLoader from './createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';
import TradeManage from './Finance/TradeManage';
import AccountManage from './Finance/AccountManage';
import ReconciliationManage from './Finance/ReconciliationManage';
import Assistance from "./Finance/Assistance";
import RecruitmentInfo from "./Finance/RecruitmentInfo";
import RecruitmentInfoDetail from "./Finance/RecruitmentInfoDetail";
import Evententry from './Finance/evententry';
import Settlement from "./Finance/Settlement";
export default {
    path: '/fc',
    component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/App')));
    }),
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/404')));
        })
    },

    childRoutes: [
        TradeManage,
        AccountManage,
        ReconciliationManage,
        Assistance,
        RecruitmentInfo,
        RecruitmentInfoDetail,
        Evententry,
        Settlement,
        {
            path: 'overview',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Finance/Overview')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "概况",
                    route: nextState.location.pathname
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
