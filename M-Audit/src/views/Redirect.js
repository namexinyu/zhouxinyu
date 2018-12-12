import React, {Component} from 'react';
import {withRouter, browserHistory} from 'react-router';
import QueryParam from 'UTIL/base/QueryParam';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import setParams from 'ACTION/setParams';
import mams from 'CONFIG/mamsConfig';
import env from 'CONFIG/envs';

/**
 * 设计初衷：
 *   replaceState 的 API 被废弃
 *   且要恢复原状很麻烦的情况下
 *   宁可重新进入该组件
 *   但 this.context.router.replace(当前路径) 是无效的
 *   因为 React 能判断出当前组件可复用
 *   因此只能跳转到别的路径之后再跳回来
 *
 * 使用方法：（当前路径为 /foo）
 * 在 JSX 中：<Link to="/redirect?dest=/foo">重载本页</Link>
 * 在 JS 中：this.context.router.replace('/redirect?dest=/foo')
 */
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
        let roleCode = JSON.parse(QueryParam.getQueryParam(window.location.href, 'roleCodeList')) || [];
        if (token && accountList && accountList.length && employeeId) {
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('token', token);
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('accountList', JSON.stringify(accountList));
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('employeeId', employeeId);
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('accountName', accountName);
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('loginTime', new Date(loginTime).toLocaleString() || '');
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('departmentName', mams[platformCode].name || '');
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('role', roleCode);
            setParams('state_header_accountInfo', {
                accountName: accountName || '',
                loginTime: new Date(loginTime).toLocaleString() || '',
                departmentName: mams[platformCode].name || ''
            });
            if (r) {
                window.location.href = r;
            } else {
                if (roleCode && roleCode.length == 1 && roleCode[0] == 'AduitService') {
                    browserHistory.push({
                        pathname: '/audit/callback/entry'
                    });
                } else {
                    browserHistory.push({
                        pathname: '/audit/board'
                    });
                }
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
