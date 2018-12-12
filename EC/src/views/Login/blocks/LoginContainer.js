import "LESS/framework.less";
import React from 'react';
import {browserHistory} from 'react-router';
import logo from 'IMAGE/logo.png';
import openDialog from 'ACTION/Dialog/openDialog';
import setParams from 'ACTION/setParams';
import doLogin from 'ACTION/Login/doLogin';
import sendLoginVerifyCode from 'ACTION/Login/sendLoginVerifyCode';
import setFetchStatus from 'ACTION/setFetchStatus';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import QueryParam from 'UTIL/base/QueryParam';

class LoginContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDelay: false,
            delayTime: 30
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sendLoginVerifyCodeFetch.status === 'error') {
            setFetchStatus('state_login', 'sendLoginVerifyCodeFetch', 'close');
            openDialog({
                id: 'sendVerifyCodeError',
                type: 'toast',
                message: nextProps.sendLoginVerifyCodeFetch.response.Desc
            });
        }
        if (nextProps.sendLoginVerifyCodeFetch.status === 'success') {
            setFetchStatus('state_login', 'sendLoginVerifyCodeFetch', 'close');
            openDialog({
                id: 'sendVerifyCodeSuccess',
                type: 'toast',
                message: '验证码已发送'
            });
            this.setState({
                showDelay: true,
                delayTime: 30
            });
            let delayInterval = setInterval(() => {
                if (this.state.delayTime <= 0) {
                    clearInterval(delayInterval);
                    this.setState({
                        showDelay: false,
                        delayTime: 30
                    });
                } else {
                    this.setState({
                        delayTime: this.state.delayTime - 1
                    });
                }

            }, 1000);
        }
        if (nextProps.doLoginFetch.status === 'error') {
            setFetchStatus('state_login', 'doLoginFetch', 'close');
            openDialog({
                id: 'loginError',
                type: 'alert',
                theme: 'danger',
                message: nextProps.doLoginFetch.response.Desc
            });
        }
        if (nextProps.doLoginFetch.status === 'success') {
            setFetchStatus('state_login', 'doLoginFetch', 'close');
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItems({
                loginId: nextProps.LoginId,
                role: nextProps.Role,
                mobile: nextProps.Mobile,
                accountName: nextProps.AccountName
            });
            // TODO jump
            browserHistory.push({
                pathname: '/broker/board'
            });
        }
    }

    handleDoLogin() {
        if (!this.props.AccountName) {
            openDialog({
                id: 'accountEmpty',
                type: 'toast',
                message: '请输入登录账号'
            });
            return false;
        }
        if (!this.props.VerifyCode) {
            openDialog({
                id: 'verifyCodeEmpty',
                type: 'toast',
                message: '请输入6位短信验证码'
            });
            return false;
        }
        doLogin({
            CertCode: this.props.VerifyCode,
            Mobile: this.props.Mobile
        });
    }

    handleSendVerifyCode() {
        if (!this.props.AccountName) {
            openDialog({
                id: 'accountEmpty',
                type: 'toast',
                message: '请输入登录账号'
            });
            return false;
        }
        sendLoginVerifyCode({
            LoginName: this.props.AccountName
        });
    }

    handleInputChange(e, key) {
        let temp = {};
        temp[key] = e.target.value;
        setParams('state_login', temp);
    }

    render() {
        return (
            <div className="ivy-login">
                <div className="container-fluid login-box pt-3 pb-3">
                    <div className="row">
                        <div className="container-fluid">
                            <h2 className="text-center">我的打工网后台管理系统</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-md-2 text-center">
                            <img src={logo} className="logo-icon" alt=""/>
                        </div>
                        <div className="col-sm-12 col-md-10">
                            <form>
                                <div className="form-group row mt-3">
                                    <label htmlFor="account" className="col-sm-2 col-form-label text-right">账号</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="account"
                                               placeholder="请输入工号/账号/英文名" autoComplete="off"
                                               value={this.props.AccountName}
                                               onChange={(e) => this.handleInputChange(e, 'AccountName')}/>
                                    </div>
                                </div>
                                <div className="form-group row mt-3">
                                    <label htmlFor="verifyCode"
                                           className="col-sm-2 col-form-label text-right">验证码</label>
                                    <div className="col-sm-10">
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <input type="tel" className="form-control" autoComplete="off"
                                                       id="verifyCode"
                                                       placeholder="请输入短信验证码" maxLength={6} minLength={6}
                                                       value={this.props.VerifyCode}
                                                       onChange={(e) => this.handleInputChange(e, 'VerifyCode')}/>
                                            </div>
                                            <div className="col-sm-5">
                                                <button type="button" className="btn btn-info btn-block"
                                                        disabled={this.state.showDelay}
                                                        onClick={() => this.handleSendVerifyCode()}>{this.state.showDelay ? this.state.delayTime + '秒' : '发送验证码'}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="form-group row mt-3">
                                    <label className="col-sm-2 col-form-label text-right"></label>
                                    <div className="col-sm-10">
                                        <button type="button" className="btn btn-info btn-block"
                                                onClick={() => this.handleDoLogin()}>登录
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default LoginContainer;