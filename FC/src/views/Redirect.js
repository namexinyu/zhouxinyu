import React, {Component} from 'react';
import {withRouter, browserHistory} from 'react-router';
import QueryParam from 'mams-com/lib/utils/base/QueryParam';

import {CONFIG} from 'mams-com';

const {AppSessionStorage} = CONFIG;
import mams from 'CONFIG/mamsConfig';

class Redirect extends Component {
    componentWillMount() {
        let token = QueryParam.getQueryParam(window.location.href, 'token') || '';
        let employeeId = parseInt(QueryParam.getQueryParam(window.location.href, 'employeeId') || 0, 10) || '';
        let serverTimeStamp = parseInt(QueryParam.getQueryParam(window.location.href, 'serverTimeStamp') || 0, 10) || '';
        let tokenExpireTimeStamp = parseInt(QueryParam.getQueryParam(window.location.href, 'tokenExpireTimeStamp') || 0, 10) || '';
        let accountList = JSON.parse(QueryParam.getQueryParam(window.location.href, 'accountList') || '""') || '';
        let r = QueryParam.getQueryParam(window.location.href, 'r') || '';
        let accountName = decodeURIComponent(QueryParam.getQueryParam(window.location.href, 'accountName')) || '';
        let loginTime = parseInt(QueryParam.getQueryParam(window.location.href, 'loginTime'), 10) || '';
        let platformCode = QueryParam.getQueryParam(window.location.href, 'platformCode') || '';
        if (token && accountList && accountList.length && employeeId) {
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('token', token);
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('accountList', JSON.stringify(accountList));
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('employeeId', employeeId);
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('accountName', accountName);
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('loginTime', new Date(loginTime).toLocaleString() || '');
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('departmentName', mams[platformCode].name || '');
            if (r) {
                window.location.href = r;
            } else {
                browserHistory.push({
                    pathname: '/fc/overview'
                });
            }
        } else {
            // should tips error. no role.
        }
    }

    render() {
        // 非实体组件需显式返回 null
        return null;
    }
}

export default withRouter(Redirect);
