import React from 'react';
import {Layout, Row, Col, Popover} from 'antd';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import {goToLogin} from 'UTIL/HttpRequest/index';
import setParams from 'ACTION/setParams';
import LazyLoadMap from 'UTIL/BaiduMap/LazyLoadMap';

const {Header} = Layout;

class PageHeader extends React.PureComponent {
    componentWillMount() {
        if (!this.props.loginAddress) {
            LazyLoadMap({needDraw: false}).then(() => {
                var a = document.createElement('div');
                a.style.display = 'none';
                a.id = 'allmap';
                document.body.appendChild(a);
                var map = new window.BMap.Map("allmap");

                function myFun(result) {
                    var cityName = result.name;
                    setParams('state_business_header_accountInfo', {
                        loginAddress: cityName
                    });
                }

                var myCity = new window.BMap.LocalCity();
                myCity.get(myFun);
            }, () => {

            });
        }
    }

    handleLogout() {
        goToLogin({}, true);
    }

    render() {
        const {accountInfo} = this.props;
        const accountName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountName');
        const loginTime = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginTime');
        const departmentName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('departmentName');
        return (
            <Header className="bg-primary">
                <Row className="h-100">
                    <Col span={4} className="h-100">
                        <h4 className="lh-inherit color-white" style={{fontWeight: 'bold', fontSize: '18px'}}>经纪人管理工作台</h4>
                    </Col>
                    <Col span={12}/>
                    <Col span={8} className="operate text-right">
                        <div style={{display: 'inline-block'}}>
                            <Popover
                                mouseEnterDelay={0.5}
                                title="账户信息" trigger="hover" placement="bottomRight"
                                content={(<div style={{lineHeight: '30px', width: 300}}>
                                    <div><span>所在部门 :</span><span className="ml-8">{departmentName}</span></div>
                                    <div><span>本次登录 :</span><span
                                        className="ml-8">{loginTime ? new Date(loginTime).toLocaleString() : '-'}</span>
                                    </div>
                                    <div><span>登录地区 :</span><span
                                        className="ml-8">{accountInfo ? accountInfo.loginAddress || '' : ''}</span>
                                    </div>
                                </div>)}
                                onVisibleChange={(visible) => {
                                    // visible && getAccountInformation();
                                }}>
                                <div className="user-info" style={{color: 'white'}}>
                                    <i className="iconfont icon-wo"/>
                                    <span
                                        className="user-name ml-8">{accountInfo && accountInfo.accountName ? accountInfo.accountName : '账户信息'}</span>
                                </div>
                            </Popover>
                        </div>

                        <i className="iconfont icon-guanji ml-24 color-white" onClick={this.handleLogout.bind(this)}/>
                    </Col>
                </Row>
            </Header>
        );
    }
}

export default PageHeader;