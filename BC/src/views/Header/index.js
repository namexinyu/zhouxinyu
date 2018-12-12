import React from 'react';
import {browserHistory} from 'react-router';
import {Layout, Row, Col, Popover, notification, Button } from 'antd';
import AccountInformation from 'ACTION/Business/Header/AccountInformation';
import BusinessCommon from 'ACTION/Business/Common/index';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import {UTIL, CONFIG, goToLogin} from 'mams-com';
import ossConfig from 'CONFIG/ossConfig';

const {AppSessionStorage} = CONFIG;
const {getAccountInformation} = AccountInformation;
const { getEventMessage } = BusinessCommon;
const {Header} = Layout;
const IMG_PATH = ossConfig.getImgPath();

const STATE_NAME = 'state_business_header_accountInfo'; // store貌似没什么用，预留

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
                    setParams(STATE_NAME, {loginAddress: cityName});
                }

                var myCity = new window.BMap.LocalCity();
                myCity.get(myFun);
            }, () => {

            });
        }        

        if (!window.TimingTask) {
            getEventMessage({
                EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                EmployeeType: 'AA'
            });

            window.TimingTask = setInterval(() => {
                getEventMessage({
                    EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                    EmployeeType: 'AA'
                });
            }, 20000);
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.getEventMessageFetch.status === 'success') {
            setFetchStatus('state_business_header_accountInfo', 'getEventMessageFetch', 'close');

            const NotifyInfo = (nextProps.getEventMessageFetch.response.Data || {}).NotifyInfo || [];
            const computedNofifyInfo = NotifyInfo.filter(item => item.NotifyType === 5).reverse();

            if (NotifyInfo.length) {
                for (let index = 0; index < computedNofifyInfo.length; index++) {
                    const currentMessage = computedNofifyInfo[index] || {};
                    const key = `open${Date.now()}`;

                    const viewBtn = (
                        <a onClick={() => {
                            browserHistory.push({
                                pathname: '/bc/event-management/list',
                                state: {
                                    EventID: (JSON.parse(currentMessage.NewContext) || {}).EventID || 0
                                }
                            });
                            notification.close(key);
                        }}>查看详情</a>
                    );

                    notification.open({
                        message: '事件回复',
                        description: <div className="message-notify__desc">{computedNofifyInfo.length ? this.renderMessage(currentMessage) : ''}</div>,
                        duration: 0,
                        btn: viewBtn,
                        placement: 'bottomRight',
                        className: 'message-notify',
                        style: {
                            zIndex: this.incrementZIndex()
                        },
                        key,
                        onClose: () => {
                            console.log('close');  
                        }
                    });
                }
            }
        }
    }

    incrementZIndex = (function() {
        var n = 0;
        return function() {
            return n++;
        };
    })()

    renderMessage = (currentMessage) => {
        const {
            NewContext,
            PicsPath
        } = currentMessage;

        const eventMsg = JSON.parse(NewContext);
        return (
            <div>
                {eventMsg.Remark !== '' ? (
                    <p style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3
                    }}>{eventMsg.Remark}</p>
                ) : (
                    <img width="75" height="75" src={IMG_PATH + PicsPath[0]} />
                )}
            </div>
        );
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
                        <h4 className="lh-inherit color-white" style={{fontWeight: 'bold', fontSize: '18px'}}>业务工作台</h4>
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
                                        className="ml-8">{accountInfo.loginAddress || ''}</span></div>
                                </div>)}
                                onVisibleChange={(visible) => {
                                    // visible && getAccountInformation();
                                }}>
                                <div className="user-info" style={{color: 'white'}}>
                                    <i className="iconfont icon-wo"/>
                                    <span
                                        className="user-name ml-8">{accountInfo.Name ? accountInfo.Name : '账户信息'}</span>
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