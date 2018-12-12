import React from 'react';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import { Layout, Row, Col, Popover } from 'antd';
import { browserHistory, Link} from 'react-router';
import getUserInfo from 'ACTION/Header/getUserInfo';
import { goToLogin } from 'UTIL/HttpRequest/index';
import setParams from 'ACTION/setParams';
import LazyLoadMap from 'UTIL/BaiduMap/LazyLoadMap';

const { Header } = Layout;

let EmployeeID = null;

class PageHeader extends React.PureComponent {

    constructor(props) {
        super(props);
        this.handleTabRoot = this.handleTabRoot.bind(this);
        this.HubManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;
        this.state = {
            loginAddress: ''
        };
    }

    componentWillMount() {
        EmployeeID = AppSessionStorage.getEmployeeID();
        getUserInfo({ EmployeeID: EmployeeID });

        if (!this.state.loginAddress) {
            LazyLoadMap({ needDraw: false }).then(() => {
                var a = document.createElement('div');
                a.style.display = 'none';
                a.id = 'allmap';
                document.body.appendChild(a);
                var map = new window.BMap.Map("allmap");
                let that = this;
                function myFun(result) {
                    var cityName = result.name;
                    that.setState({
                        loginAddress: cityName
                    });
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

    handleTabRoot() {
        browserHistory.push({
            pathname: "/ec/main/system-message"
        });
    }

    handleLogout() {
        AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.build();
        goToLogin({}, true);
    }

    render() {
        const accountName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountName');
        const loginTime = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginTime');
        const departmentName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('departmentName');
        return (
            <Header className="bg-primary">
                <Row className="h-100">
                    <Col span={4} className="h-100">
                        <h4 className="lh-inherit color-white">
                            体验中心工作台
                            <Link to="/ec/main/salary-calculator" className="ml-10" style={{
                                verticalAlign: 'middle'
                            }}>
                                <img src="http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/icon_calculator.png" style={{
                                    width: '18px',
                                    verticalAlign: '-4px'
                                }} />
                            </Link>
                        </h4>
                    </Col>
                    <Col span={12}></Col>
                    <Col span={8} className="operate text-right">
                        <div style={{ display: 'inline-block' }}>
                            <Popover
                                mouseEnterDelay={0.5}
                                title="账户信息" trigger="hover" placement="bottomRight"
                                content={(<div style={{ lineHeight: '30px', width: 300 }}>
                                    <div><span>登录人 :</span><span className="ml-8">{this.props.LoginEnglishName}</span></div>
                                    <div><span>职位 :</span><span className="ml-8">{this.HubManager ? "经理" : "主管"}</span></div>
                                    <div><span>本次登录 :</span><span className="ml-8">{loginTime ? new Date(loginTime).toLocaleString() : '-'}</span></div>
                                    <div><span>登录地区 :</span><span className="ml-8">{this.state.loginAddress || '-'}</span></div>
                                </div>)}
                                onVisibleChange={(visible) => {
                                    // visible && getAccountInformation();
                                }}>
                                <div className="user-info" style={{ color: 'white' }}>
                                    <i className="iconfont icon-wo" />
                                    <span className="user-name ml-8">{accountName ? accountName : '账户信息'}</span>
                                </div>
                            </Popover>
                        </div>
                        <span className="iconfont icon-naoling news ml-24" onClick={this.handleTabRoot}></span>
                        <i className="iconfont icon-guanji ml-24 color-white" onClick={this.handleLogout.bind(this)} />
                    </Col>
                </Row>
            </Header>
        );
    }
}

export default PageHeader;
