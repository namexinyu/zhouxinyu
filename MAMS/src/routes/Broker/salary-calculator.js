import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import doTabPage from 'ACTION/TabPage/doTabPage';

export default {
    path: 'salary-calculator',
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/Broker/SalaryCalculator/index')));
        })
    },
    onEnter: (nextState, replace, callback) => {
        doTabPage({
            id: nextState.location.pathname,
            name: "薪资计算",
            route: nextState.location.pathname // this route should same to the history push
        }, 'create');
        callback();
    },
    childRoutes: []
};