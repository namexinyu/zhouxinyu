import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'servicer',
    childRoutes: [
        {
            path: 'owner',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/ServicerManage/owner')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "大老板",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'owner/edit/:ownerId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/ServicerManage/ownerEdit')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname + nextState.location.search,
                    name: "大老板信息",
                    route: nextState.location.pathname + nextState.location.search,
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'owner/create/:ownerId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/ServicerManage/ownerCreate')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname + nextState.location.search,
                    name: "新建大老板",
                    route: nextState.location.pathname + nextState.location.search
                }, 'create');
                callback();
            }
        },
        {
            path: 'owner/check',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/ServicerManage/ownerCheck')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "大老板审核",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'company',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/ServicerManage/company')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "劳务公司",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'company/edit/:companyId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/ServicerManage/companyEdit')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname + nextState.location.search,
                    name: "公司信息",
                    route: nextState.location.pathname + nextState.location.search,
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'company/create/:companyId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/ServicerManage/companyCreate')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname + nextState.location.search,
                    name: "新建公司",
                    route: nextState.location.pathname + nextState.location.search
                }, 'create');
                callback();
            }
        },
        {
            path: 'company/check',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/ServicerManage/companyCheck')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "公司审核",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        },
        {
            path: 'staff',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/ServicerManage/staffList')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "服务人员管理",
                    route: nextState.location.pathname
                }, 'create');
                callback();
            }
        }
    ]
};