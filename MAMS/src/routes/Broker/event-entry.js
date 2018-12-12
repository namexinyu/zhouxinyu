import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'event-management',
    indexRoute: {},
    childRoutes: [{
        path: 'entry',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Broker/EventEntry/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "事件录入",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
    },
    {
        path: 'list',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Broker/EventEntry/eventlist')));
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
        path: 'Wiki',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Broker/EventWiki/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "事件百科",
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
    }, {
        path: 'Wiki/:DocID',
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Broker/EventWiki/EventWikiDetails/index')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: "事件详情",
                route: nextState.location.pathname,
                needRefresh: true,
                singleTag: 'memberDetail',
                isMemberDetailPage: true
            }, 'create');
            callback();
        }
    }]
};