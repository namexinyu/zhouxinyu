import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'recruitment',
    childRoutes: [
        {
            path: 'info',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/RecruitmentInfo/index')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "招工资讯",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'assign',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/Recruitment/assign')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "劳务分配",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'test',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/Recruitment/test')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "招聘审核",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'ent',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/Recruitment/ent')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "企业管理",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'ent-audit',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/Recruitment/entAudit')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "审核企业",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'ent-edit',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/Recruitment/editEntAll')));
            }),
            onEnter: (nextState, replace, callback) => {
                let id = nextState.location.pathname + nextState.location.search;
                doTabPage({
                    id: id,
                    name: nextState.location.query.entName ? nextState.location.query.entName : '完善企业信息',
                    route: nextState.location.pathname,
                    query: nextState.location.query,
                    close: {
                        STATE_NAME: 'state_business_recruitment_ent_edit',
                        field: id,
                        delay: 500
                    }
                }, 'create');
                callback();
            }
        },
        {
            path: 'ent-new',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/Recruitment/editEntAll')));
            }),
            onEnter: (nextState, replace, callback) => {
                let id = nextState.location.pathname + nextState.location.search;
                // doTabPage({
                //     id: id,
                //     name: nextState.location.query.entName ? nextState.location.query.entName : '新建企业',
                //     route: nextState.location.pathname,
                //     query: nextState.location.query,
                //     close: {
                //         STATE_NAME: 'state_business_recruitment_ent_edit',
                //         field: id,
                //         delay: 500
                //     }
                // }, 'create');
                // callback();
                doTabPage({
                    id: nextState.location.pathname,
                    name: "新建企业",
                    route: nextState.location.pathname, // this route should same to the history push
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'daily',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/Recruitment/daily')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "每日招聘",
                    route: nextState.location.pathname, // this route should same to the history push
                    needRefresh: true
                }, 'create');
                callback();
            }
        },
        {
            path: 'audit',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Business/Recruitment/recruitment')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "招聘报价审核",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};