import createLazyViewLoader from './createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';
import boardRoute from './Assistant/WorkBoard';
import brokerRoute from './Assistant/Broker';
import memberRoute from './Assistant/Member';
import dailyRoute from './Assistant/Daily';
import reportRoute from './Assistant/Report';
import business from './Assistant/Business';
import MemberNeed from './Assistant/MemberNeed';
import Everysign from './Assistant/Everysign';
import Tags from './Assistant/Tags';
import TestResult from './Assistant/TestResult';
import Message from './Assistant/Message';
import AccountManage from './Assistant/AccountManage';
import DepartgroupManage from './Assistant/DepartgroupManage';
import EventEntry from './Assistant/event-entry';

export default {
    path: '/ac',
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
        brokerRoute,
        memberRoute,
        dailyRoute,
        reportRoute,
        business,
        MemberNeed,
        Everysign,
        Tags,
        TestResult,
        Message,
        AccountManage,
        DepartgroupManage,
        EventEntry,
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
