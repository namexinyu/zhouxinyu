import React from 'react';
import {Input, Button, Form, Icon, message} from 'antd';
import {authStore} from 'ADMIN/store';
import {observer, inject} from "mobx-react";
import {Redirect} from 'react-router-dom';
import 'ADMIN_ASSETS/less/pages/login.less';
import createFormField from 'ADMIN_UTILS/createFormField';
import Copyright from './copyright';

@Form.create({
    mapPropsToFields: (props, fields) => createFormField(props.formInfo, true),
    onFieldsChange: (props, changedFields) => props.onFieldsChange(changedFields)
    // onValuesChange: (props, changedValues, allValues) => props.onValuesChange(changedValues, allValues)
})
class LoginForm extends React.Component {
    state = {codeTimeDown: -1};

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    handleSendCode = () => {
        if (this.interval) clearInterval(this.interval);
        this.props.getVCode().then(res => {
            this.codeTimeDown = 59;
            this.setState({codeTimeDown: this.codeTimeDown});
            this.interval = setInterval(() => {
                if (this.codeTimeDown > 0) {
                    --this.codeTimeDown;
                    this.setState({codeTimeDown: this.codeTimeDown});
                } else {
                    clearInterval(this.interval);
                }
            }, 1000);
        }).catch(err => {
            message.error(err.message);
            console.log(err);
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.props.handleLogin(fieldsValue);
        });
    };

    render() {
        const {form, loginEnable, sendCodeEnable, loginLoading, getVCodeLoading} = this.props;
        const {codeTimeDown} = this.state;
        const getFieldDecorator = form.getFieldDecorator;

        return (
            <Form onSubmit={this.handleSubmit} className='login-center'>
                <div className="login-bgl">
                    <div className="login-bgl-logo"></div>
                    <div className="login-bgl-bottom">权限管理</div>
                </div>
                <div className="login-bgr">
                    <Form.Item>
                        {getFieldDecorator('userName', {
                            rules: [
                                {required: true, message: '请输入用户名'},
                                {pattern: /^[.a-zA-Z]+$/, message: '请输入正确用户名'}
                            ]
                        })(<Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.75)'}}/>}
                                placeholder="用户名" autoComplete="off" maxLength={11}/>
                        )}
                    </Form.Item>
                    <div className='login-form-item'>
                        <Form.Item>
                            {getFieldDecorator('pwd', {
                                rules: [
                                    {required: true, message: '请输入密码'}
                                ]
                            })(<Input type="password" prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.75)'}}/>} placeholder="密码"
                                    autoComplete="off"/>
                            )}
                        </Form.Item>
                        {/*
                        <Button className='ml-8 handleSendCode'
                                onClick={this.handleSendCode}
                                loading={getVCodeLoading}
                                disabled={!sendCodeEnable || codeTimeDown > 0}
                        >
                            获取验证码{codeTimeDown > 0 ? `(${codeTimeDown})` : ''}
                        </Button>
                        */}
                    </div>
                    <div className='login-wrap'>
                        <Button type="primary" htmlType="submit"
                                className='login'
                                loading={loginLoading}>登录</Button>
                    </div>
                </div>
            </Form>
        );
    }
}

@inject('authStore')
@observer
export default class extends React.Component {

    render() {
        const {isLogin, loginFormInfo, handleLogin, getVCode, handleFormFieldsChange, loginEnable, sendCodeEnable, loginLoading, getVCodeLoading} = this.props.authStore;
        const location = this.props.location;
        if (isLogin) {
            let pathname = location.state && location.state.from && location.state.from.pathname;
            if (!pathname || pathname.match('.aspx')) pathname = '/';
            return <Redirect to={{pathname, state: {from: location}}}/>;

        } else {
            return <div className='login-container'>
            {/*
                <div className='login-title'>
                    <div>
                         <img className='logo' src={logo}/> 
                    </div>
                    <h1>权限管理平台</h1>
                </div>
            */}
                <LoginForm onFieldsChange={handleFormFieldsChange} loginEnable={loginEnable}
                           sendCodeEnable={sendCodeEnable}
                           getVCode={getVCode} getVCodeLoading={getVCodeLoading}
                           loginLoading={loginLoading} handleLogin={handleLogin} formInfo={loginFormInfo}/>
                <Copyright/>
            </div>;
        }
    }
}
