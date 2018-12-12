/* 入口启动文件 */
import React from 'react';
import ReactDOM from 'react-dom';
// import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { Router, browserHistory, history } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from 'STORE'; // , {history}
import routes from 'ROUTE';
// import { initWechatShare } from 'UTIL/wechatShare';

/**
 * 下面这货用于检测不必要的重新渲染，详情请看其项目地址：
 * https://github.com/garbles/why-did-you-update
 *
 * 有关性能提升方面的问题
 * 诸如 PureComponent / shouldComponentUpdate / Immutable.js 等
 * 请自行查阅相关资料
 */
if (__DEV__ && __WHY_DID_YOU_UPDATE__) {
    const { whyDidYouUpdate } = require('why-did-you-update');
    whyDidYouUpdate(React);
}
if (__DEV__) {
    window.Perf = require('react-addons-perf');
    // if (module.hot) {     module.hot.accept('./containers/App', () => {
    // render(App) }) }
    console.info('[当前环境] 开发环境');
}
if (__TEST__) {
    console.info('[当前环境] 测试环境');
}
if (__ALPHA__) {
    console.info('[当前环境] 预发布环境');
}
if (__PROD__) {
    console.info('[当前环境] 生产环境');
}

const boot = (dom) => {
    // when browser refresh. The route should redirect to '/board'.
    let currentLocation = browserHistory.getCurrentLocation();
    currentLocation.state = {};
    if (currentLocation.pathname === '/') {
        browserHistory.push({
            pathname: '/audit'
        });
    } else {
        browserHistory.push({
            pathname: currentLocation.pathname,
            query: currentLocation.query,
            state: Object.assign({}, currentLocation.state, { clickTab: false })
        });
    }

    browserHistory.listenBefore((location) => {
        // TODO add route change before event.
    });
    window.sessionStorage.setItem('locationStorage', JSON.stringify({}));
    browserHistory.listen((location) => {
        // lastKey & key support for different entry.
        let locationStorage = JSON.parse(window.sessionStorage.getItem('locationStorage'));
        let currentPath = location.pathname;
        if (locationStorage.hasOwnProperty(currentPath)) {
            location.lastKey = locationStorage[currentPath].key;
            location.lastAction = locationStorage[currentPath].action;
        } else {
            location.lastKey = '';
            location.lastAction = '';
        }
        locationStorage[currentPath] = {
            key: location.key,
            action: location.action
        };
        window.sessionStorage.setItem('locationStorage', JSON.stringify(locationStorage));
        if (location.pathname === '/') {
            browserHistory.push({
                pathname: '/audit'
            });
        }
    });
    ReactDOM.render(
        <Provider store={store}>
            <Router
                history={syncHistoryWithStore(browserHistory, store)}
                children={routes} />
        </Provider>, dom);
};
export default boot;
