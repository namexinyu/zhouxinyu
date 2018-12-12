import React, {Component} from 'react';
import {withRouter, browserHistory} from 'react-router'; // v2.4 新增的 HoC
import QueryParam from 'UTIL/base/QueryParam';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import setParams from 'ACTION/setParams';
import mams from 'CONFIG/mamsConfig';
import moment from 'moment';
import {goToLogin} from "UTIL/HttpRequest/index";

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
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('loginTime', loginTime || '');
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('departmentName', mams[platformCode].name || '');
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('loginId', accountList[0]);
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('role', roleCode);
            const loginTimeTimeTmp = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginTimeTmp');
            if (!loginTimeTimeTmp) AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('loginTimeTmp', new Date().getTime());
            setParams('state_header_accountInfo', {
                accountName: accountName || '',
                loginTime: new Date(loginTime).toLocaleString() || '',
                departmentName: mams[platformCode].name || ''
            });
            if (r) {
                window.location.href = r;
            } else {
                browserHistory.push({
                    pathname: '/broker/board'
                });
            }
        } else {
            // should tips error. no role.
        }

        // 每小时轮询一次登录是否过期
        window.loginTimeOutTask = setInterval(() => {
            let _loginTimeTmp = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginTimeTmp');
            let _nowTimeTmp = new Date().getTime();
            let _reLogoinCheckPoint = moment(moment().format('YYYY-MM-DD 04:00:00')).valueOf();
            // 当前时间已超过今日四点，登录时间在今日四点之前
            if ((_nowTimeTmp > _reLogoinCheckPoint) && (_loginTimeTmp < _reLogoinCheckPoint)) {
                alert('登录时间已过期，请重新登录');
                goToLogin();
            }
            // console.log('当前时间大于每日重登基准时间（已触发校验）：', _nowTimeTmp > _reLogoinCheckPoint);
            // console.log('登录时间再每日重登基准时间之前（已过期）：', _loginTimeTmp < _reLogoinCheckPoint);
        }, 3600000);
    }

    render() {
        // 非实体组件需显式返回 null
        return null;
    }
}

export default withRouter(Redirect);
