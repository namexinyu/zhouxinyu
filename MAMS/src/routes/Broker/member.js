import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'member',
    indexRoute: {},
    childRoutes: [
        {
            path: 'my',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Member/MyMember')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "我的会员",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'loss',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Member/MemberLoss')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "转走概况",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'detail/:memberId',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Member/MemberDetail')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "会员详情" + (nextState.location.query.memberName ? '-' + nextState.location.query.memberName : ''),
                    route: nextState.location.pathname,
                    needRefresh: true,
                    singleTag: 'memberDetail',
                    isMemberDetailPage: true
                }, 'create');
                callback();
            }
        }
    ]
};
