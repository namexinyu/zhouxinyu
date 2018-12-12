import React, {Component} from 'react';
import {withRouter, browserHistory} from 'react-router';
import QueryParam from 'UTIL/base/QueryParam';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import LoginService from 'SERVICE/LoginService/index';
import setParams from "../actions/setParams";

class Redirect extends Component {
    constructor(props) {
        super(props);
        console.log('Redirect', props);
    }

    componentWillMount() {
        let location = this.props.location;
        let query = location.query || {};
        // 临时的阿里云图片路径处理
        AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItems({IMG_PATH: 'http://woda-app-public-test.oss-cn-shanghai.aliyuncs.com/'});
        let accountName = decodeURIComponent(QueryParam.getQueryParam(window.location.href, 'accountName')) || '';
        let loginTime = parseInt(QueryParam.getQueryParam(window.location.href, 'loginTime'), 10) || '';
        // login页跳转逻辑 start
        try {
            if (query.accountList) query.accountList = JSON.parse(query.accountList);
            if (query.roleCodeList) query.roleCodeList = JSON.parse(query.roleCodeList);
            if (query.employeeId && query.token && query.accountList && query.accountList.length > 0) {
                AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItems({
                    employeeId: query.employeeId - 0,
                    token: query.token,
                    HubList: query.accountList,
                    HubIDList: query.accountList.map((item) => item.HubID),
                    tokenExpireTimeStamp: query.tokenExpireTimeStamp,
                    serverTimeStamp: query.serverTimeStamp,
                    // 临时的权限处理，判断多个体验中心权限为经理，单个体验中心权限为店长
                    role: query.roleCodeList
                });
                AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('accountName', accountName);
                AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('loginTime', loginTime || '');
                let pathname = query.r ? query.r : '/ec/main/work-bench';
                browserHistory.push({
                    pathname: pathname
                });
            }
        } catch (e) {
            console.log('accountList not json');
        }
        // login页跳转逻辑 end

    }


    render() {
        // 非实体组件需显式返回 null
        return null;
    }
}

export default withRouter(Redirect);
