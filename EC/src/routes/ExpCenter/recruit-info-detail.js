import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'recruit/detail/:recruitId',
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/ExpCenter/RecruitmentInfo/detail')));
        }),
        onEnter: (nextState, replace, callback) => {
            doTabPage({
                id: nextState.location.pathname,
                name: nextState.location.query.entName ? nextState.location.query.entName + '招工资讯' : '招工资讯详情',
                query: nextState.location.query,
                route: nextState.location.pathname // this route should same to the history push
            }, 'create');
            callback();
        }
    },
    childRoutes: []
};