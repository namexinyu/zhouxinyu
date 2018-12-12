import React from 'react';
import {Layout, Row, Col, Popover} from 'antd';
import {UTIL, CONFIG, goToLogin} from 'mams-com';
import setParams from 'ACTION/setParams';

const {Header} = Layout;
const {AppSessionStorage} = CONFIG;

class PageHeader extends React.PureComponent {
    componentWillMount() {
        if (!this.props.loginAddress) {
            UTIL.LazyLoadMap({needDraw: false}).then(() => {
                var a = document.createElement('div');
                a.style.display = 'none';
                a.id = 'allmap';
                document.body.appendChild(a);
                var map = new window.BMap.Map("allmap");

                function myFun(result) {
                    var cityName = result.name;
                    setParams('state_finance_header_accountInfo', {
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
        AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.build();
        goToLogin({}, true);
    }

    render() {
        const accountInfo = this.props;
        const accountName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountName');
        const loginTime = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginTime');
        const departmentName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('departmentName');
        return (
            <Header className="bg-primary">
                <Row className="h-100">
                    <Col span={4} className="h-100">
                        <h4 className="lh-inherit color-white" style={{fontSize: '18px', fontWeight: 'bold'}}>财务工作台</h4>
                    </Col>
                    <Col span={12}/>
                    <Col span={8} className="operate text-right">
                        <div style={{display: 'inline-block'}}>
                            <Popover
                                mouseEnterDelay={0.5}
                                title="账户信息" trigger="hover" placement="bottomRight"
                                content={(<div style={{lineHeight: '30px', width: 300}}>
                                    <div><span>所在部门 :</span><span className="ml-8">{departmentName || '-'}</span></div>
                                    <div><span>本次登录 :</span><span className="ml-8">{loginTime || '-'}</span></div>
                                    <div><span>登录地区 :</span><span
                                        className="ml-8">{accountInfo.loginAddress || ''}</span></div>
                                </div>)}
                                onVisibleChange={(visible) => {
                                    // visible && getAccountInformation();
                                }}>
                                <div className="user-info" style={{color: 'white'}}>
                                    <i className="iconfont icon-wo"/>
                                    <span className="user-name ml-8">{accountName ? accountName : '账户信息'}</span>
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