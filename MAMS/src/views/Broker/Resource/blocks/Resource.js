import React from 'react';
import classnames from 'classnames';
import 'LESS/Broker/header-resource-view.less';
import {
    Tabs,
    Badge,
    Button,
    message
} from 'antd';
import ResourceHandled from './ResourceHandled';
import ResourceNoHandle from './ResourceNoHandle';
import setParams from 'ACTION/setParams';
import ResourceAction from 'ACTION/Broker/Header/Resource';
import setFetchStatus from "ACTION/setFetchStatus";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";

const {
    GetNoHandleList,
    getAvaCount,
    resourceApply
} = ResourceAction;
const TabPane = Tabs.TabPane;
const STATE_NAME = 'state_broker_header_resource';

class Resource extends React.PureComponent {
    state = {
        CutDown: 0,
        isApplying: false
    };

    componentWillMount() {
        // 判断是否返回、tab页切换，如果不是则执行下面代码
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getAvaCount();
        }
        let lastApplyTmp = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('sourceApplyTmp');
        let currentTmp = new Date().getTime();
        if (currentTmp - lastApplyTmp < 10000) {
            let cutdownTime = Math.ceil(10 - ((currentTmp - lastApplyTmp) / 1000));
            this.setCutDown(cutdownTime);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { resourceApplyFetch, getAvaCountFetch, GetNoHandleListFetch } = nextProps;
        const { status: applyFetchStatus, response: applyFetchResponse } = resourceApplyFetch;

        if (applyFetchStatus === 'success') { // 审核处理
            this.setState({
              isApplying: true
            });
            setFetchStatus(STATE_NAME, 'resourceApplyFetch', 'close');
            message.success('资源申请中，请耐心等待，资源立马到来!');
            this.setCutDown();
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('sourceApplyTmp', new Date().getTime());
        } else if (applyFetchStatus === 'error') {
            this.setState({ isApplying: false });
            setFetchStatus(STATE_NAME, 'resourceApplyFetch', 'close');
            message.error(applyFetchResponse && applyFetchResponse.Desc ? (applyFetchResponse.Code === -3 ? '当前小时内不可申请' : applyFetchResponse.Desc) : '申请资源失败');
        }
    }

    handleCallRefresh = () => {
        getAvaCount();
        GetNoHandleList();
        setParams(STATE_NAME, {pageParam: {...this.props.pageParam, currentPage: 1}});
    };

    callback = (tabKey) => {
        setParams(STATE_NAME, {tabKey});
    };

    getDisplayName = (data) => {
        let result = "";
        if (data) {
            if (data.RealName) {
                result = data.RealName;
            } else if (data.CallName) {
                result = data.CallName;
            } else if (data.Name) {
                result = data.Name;
            }
        }
        return result;
    };

    handleApply() {
        if (this.state.isApplying) return;
        resourceApply();
    }

    setCutDown(time) {
        this.setState({
          CutDown: time || 10
        });
        this.applyInterval = setInterval(() => {
            if (this.state.CutDown) {
                this.setState({CutDown: this.state.CutDown - 1});
            } else {
                clearInterval(this.applyInterval);
                this.handleCallRefresh();
                setTimeout(() => {
                  this.setState({
                    isApplying: false
                  });
                  if (this.props.getAvaCountFetch.status === 'success' && this.props.GetNoHandleListFetch.status === 'success') {
                    message.success('资源申请成功！');
                  }
                }, 0);
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.applyInterval);
    }

    render() {
        let { ApplyStatus, DayRest } = this.props;
        const { CutDown, isApplying } = this.state;

        const applyTextMap = {
          '-3': `今日可申请资源数还有${DayRest}个`,
          '-2': '今日可申请资源数为0',
          '-1': '没有申请权限',
          '0': `今日可申请资源数还有${DayRest}个`
        };

        return (
            <div>
                <div className="ivy-page-title">
                    <h1 className="title-text">
                        {/* 可申请{this.props.avaCount}个资源*/}
                        资源管理
                    </h1>
                    <span className="float-right">
                        <Button type="primary"
                                style={{minWidth: '88px'}}
                                onClick={() => this.handleApply()}
                                disabled={(DayRest === 0) || CutDown || ApplyStatus === 2 || isApplying}>
                            {CutDown || '申请资源'}
                            </Button>
                        <span className="ml-16 text-ellipsis mr-16">{applyTextMap[ApplyStatus]}</span>
                        <span className={classnames('refresh-icon', {
                          'refresh-active': CutDown !== 0 || isApplying
                        })} onClick={this.handleCallRefresh}>
                                <i className="iconfont icon-shuaxin"/>
                        </span>
                    </span>

                    {/*    <button type="button" className="title-btn btn btn-sm btn-primary"
                                onClick={() => resourceApply()}
                                disabled={this.props.resourceApplyFetch.status === 'pending'}>
                            {this.props.resourceApplyFetch.status === 'pending' ? '申请中...' : '申请资源'}
                        </button>*/}
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Tabs activeKey={this.props.tabKey} onChange={this.callback} className="page-view-tabs w-100">
                        <TabPane key="tab1"
                                 tab={
                                     <div className="page-view-tabs-pane">
                                         <span>未处理资源</span>
                                         <Badge count={this.props.xxx || 0} style={{marginTop: -24}}/>
                                     </div>}>
                            <ResourceNoHandle {...this.props} location={this.props.location}
                                              getDisplayName={this.getDisplayName}
                            />
                        </TabPane>
                        <TabPane key="tab2"
                                 tab={
                                     <div>
                                         <span>已处理资源</span>
                                         <Badge count={this.props.xx || 0} style={{marginTop: -24}}/>
                                     </div>}>
                            <ResourceHandled {...this.props} location={this.props.location}
                                             getDisplayName={this.getDisplayName}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default Resource;
