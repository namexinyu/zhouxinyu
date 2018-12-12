import React from 'react';
import classnames from 'classnames';

import { Row, Col, Button, Card, message } from 'antd';
import NeedDo from "./NeedDo";
import HaveDone from "./HaveDone";
import PouredResource from "./PouredResource";
import getNeedToDoData from 'ACTION/Broker/NeedToDo/NeedToDoData';
import getHaveDoneData from 'ACTION/Broker/HaveDone/HaveDoneData';

import setParams from 'ACTION/setParams';
import ResourceAction from 'ACTION/Broker/Header/Resource';
import setFetchStatus from "ACTION/setFetchStatus";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";

import "LESS/pages/need-do.less";


const {
    getAvaCount,
    resourceApply
} = ResourceAction;

let initParams1 = {};
let initParams2 = {};
let chooseTypeArr = [];
function filterObject(obj) {
    let wrapObj = {};
    if (isArray(obj) == "Object") {
        for (let i in obj) {
            if (isArray(obj[i]) == "Array" && obj[i].length == 0 && i == "WaitTypelist") {
                let typeArr = [];
                for (let j = 0; j < chooseTypeArr.length; j++) {
                    typeArr.push(j + 1);
                }
                wrapObj[i] = typeArr;
            } else {
                wrapObj[i] = obj[i];
            }
        }
        return wrapObj;
    }
    return obj;
}
function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}

class NeedDoDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tabName: 'need-do',
            CutDown: 0,
            isApplying: false
        };
    }

    componentWillMount() {
        // 判断是否返回、tab页切换，如果不是则执行下面代码
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getAvaCount();
        }

        const lastApplyTmp = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('sourceApplyTmp');
        const currentTmp = new Date().getTime();

        if (currentTmp - lastApplyTmp < 10000) {
            const cutdownTime = Math.ceil(10 - ((currentTmp - lastApplyTmp) / 1000));
            this.setCutDown(cutdownTime);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { resourceApplyFetch, getAvaCountFetch } = nextProps.resource;
        const { status: applyFetchStatus, response: applyFetchResponse } = resourceApplyFetch;

        if (applyFetchStatus === 'success') { // 审核处理
            this.setState({
              isApplying: true
            });
            setFetchStatus('state_broker_header_resource', 'resourceApplyFetch', 'close');
            message.success('资源申请中，请耐心等待，资源立马到来!');
            this.setCutDown();
            AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItem('sourceApplyTmp', new Date().getTime());
        } else if (applyFetchStatus === 'error') {
            this.setState({ isApplying: false });
            setFetchStatus('state_broker_header_resource', 'resourceApplyFetch', 'close');
            message.error(applyFetchResponse && applyFetchResponse.Desc ? (applyFetchResponse.Code === -3 ? '当前小时内不可申请' : applyFetchResponse.Desc) : '申请资源失败');
        }
    }

    componentWillUnmount() {
        clearInterval(this.applyInterval);
    }

    handleCallRefresh = () => {
        const { pageSize, currentPage } = this.props.needDo;

        getAvaCount();
        getNeedToDoData({
          RecordSize: pageSize,
          RecordIndex: (currentPage - 1) * pageSize
        });
    }

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

                  if (this.props.resource.getAvaCountFetch.status === 'success' && this.props.needDo.getNeedListFetch.status === 'success') {
                    message.success('资源申请成功！');
                  }
                }, 0);
            }
        }, 1000);
    }

    render() {

        let { ApplyStatus, DayRest } = this.props.resource;
        const { CutDown, isApplying } = this.state;

        const applyTextMap = {
          '-3': `今日可申请资源数还有${DayRest}个`,
          '-2': '今日可申请资源数为0',
          '-1': '没有申请权限',
          '0': `今日可申请资源数还有${DayRest}个`
        };

        return (
            <div>
                <div className="ivy-page-title flex flex--between">
                    <div className="ivy-tab-line">
                        <div className={this.state.tabName === 'need-do' ? 'active' : ''} onClick={()=>{this.setState({tabName: 'need-do'});}}>会员需求</div>
                        <div className={this.state.tabName === 'have-done' ? 'active' : ''} onClick={()=>{this.setState({tabName: 'have-done'});}}>已处理需求</div>
                        <div className={this.state.tabName === 'poure-resource' ? 'active' : ''} onClick={()=>{this.setState({tabName: 'poure-resource'});}}>灌入资源</div>
                    </div>
                    <div>
                    <div>
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
                    </div>
                  </div>

                </div>
                <div className="container-fluid pt-24 pb-24">
                    {this.state.tabName === 'need-do' ? (
                        <NeedDo {...this.props.needDo}/>
                    ) : ''}

                    {this.state.tabName === 'have-done' ? (
                        <HaveDone {...this.props.needDo}/>
                    ) : ''}

                    {this.state.tabName === 'poure-resource' ? (
                        <PouredResource {...this.props.needDo} />
                    ) : ''}
                </div>
            </div>
        );
    }
}


export default NeedDoDetails;
