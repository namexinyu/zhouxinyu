import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'track',
    indexRoute: {},
    childRoutes: [
        {
            path: 'estimate-sign',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Track/EstimateSign')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "预签到名单",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'sign',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Track/SignList')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "签到名单",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'interview',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Track/Interview')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "面试名单",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'bag-list',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Track/BagList')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "口袋名单",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'send-car',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Track/SendCar')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "派车单跟踪",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        },
        {
            path: 'factory',
            component: createLazyViewLoader(cb => {
                require.ensure([], require => cb(require('VIEW/Broker/Track/factoryCheckin')));
            }),
            onEnter: (nextState, replace, callback) => {
                doTabPage({
                    id: nextState.location.pathname,
                    name: "厂门口接站",
                    route: nextState.location.pathname // this route should same to the history push
                }, 'create');
                callback();
            }
        }
    ]
};