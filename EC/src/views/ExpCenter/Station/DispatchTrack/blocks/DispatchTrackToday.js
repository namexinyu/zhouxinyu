import React from 'react';
import {Form, Row, Col, Button, Modal, Input, Select, Table, message} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
import DispatchClaimModal from './DispatchClaimModal';
import resetState from 'ACTION/resetState';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
// 业务相关
import Mapping_Dispatch from "CONFIG/EnumerateLib/Mapping_Dispatch";
import getDispatchTrackList from "ACTION/ExpCenter/DispatchTrack/getDispatchTrackList";
import getBrokerFilterList from "ACTION/ExpCenter/Broker/getBrokerFilterList";
import getDriverFilterList from "ACTION/ExpCenter/HubEmployee/getDriverFilterList";
import DispatchService from "SERVICE/ExpCenter/DispatchService";

const FormItem = Form.Item;
const Option = Select.Option;

class DispatchTrackToday extends React.PureComponent {
    constructor(props) {
        super(props);
        console.log('DispatchTrackToday props', props);
        this.eStatus = Object.assign({}, Mapping_Dispatch.eBoardingStatus);
        this.eStatusList = Object.keys(this.eStatus);
        this.eType = Object.assign({}, Mapping_Dispatch.eBoardingType);
        this.eTypeAll = Object.assign({}, Mapping_Dispatch.eBoardingTypeAll);
        this.eTypeComplex = Object.assign({}, Mapping_Dispatch.eBoardingTypeComplex);
        // this.eTypeOther = Mapping_Dispatch.eBoardingTypeOther;
        this.eTypeList = Object.keys(this.eType);
        this.eTypeOtherList = Object.keys(this.eTypeAll).filter((key) => key != 1);
        this.eDriverAcceptStatus = Object.assign({}, Mapping_Dispatch.eDriverAcceptStatus);
        this.eContactType = {...Mapping_Dispatch.eContactType};

    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.init();
        }
        // let broker = this.props.broker;
        // if (!broker.brokerFilterList || broker.brokerFilterList.length == 0) {
        //     getBrokerFilterList();
        // }
        // let driver = this.props.driver;
        // if (!driver.driverFilterList || driver.driverFilterList.length == 0) {
        //     getDriverFilterList();
        // }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.stPage.currentTab == 'today' && nextProps.stPage.needRefresh && !this.props.stPage.needRefresh) {
            this.doQuery(nextProps.today);
            setParams(nextProps.stPage.state_name, {needRefresh: false});
        }
        // 翻页
        if (nextProps.today.currentPage !== this.props.today.currentPage
            || nextProps.today.Ordered !== this.props.today.Ordered) {
            this.doQuery(nextProps.today);
        }
        // 报销弹窗
        if (nextProps.claim.addDispatchClaimFetch.status == 'success' && this.props.claim.addDispatchClaimFetch.status != 'success') {
            let res = nextProps.claim.addDispatchClaimFetch.response;

            if (res && res.Data) {
                if (res.Data.CanYouSubmit == 1) {
                    message.info('报销成功');
                    this.doQuery(nextProps.today);
                    resetState(nextProps.claim.state_name);
                } else {
                    message.info('报销失败，数据异常');
                    console.log("返回结果：", res.Data);
                    console.log("1，金额无效或超出报销范围；2，派单类型不在报销范围；3，该派单已经申请过报销，" +
                        "不能再申请报销了 4，无效的UserID，这种情况正常是不会出现的，万一出现了，是DB中相应的数据出问题了");
                    setParams(nextProps.claim.state_name, {addDispatchClaimFetch: {status: 'close'}});
                }
            }
            else {
                message.info('报销失败，数据异常');
                setParams(nextProps.claim.state_name, {addDispatchClaimFetch: {status: 'close'}});
            }

        } else if (nextProps.claim.addDispatchClaimFetch.status == 'error' && this.props.claim.addDispatchClaimFetch.status != 'error') {
            message.info('报销失败');
            setParams(nextProps.claim.state_name, {addDispatchClaimFetch: {status: 'close'}});
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleDoClaim(item) {
        setParams(this.props.claim.state_name, {DispatchID: item.ID, DispatchData: item});
    }

    handleChangeTrackData(record, key, value) {
        console.log('handleChangeTrackData', record, key, value);
        let param = {
            ID: record.ID,
            Contact: record.Contact
        };
        if (key == 'Type') {
            if (value == 2 || value == 3) {
                param.Type = value;
                param.Status = Object.keys(this.eTypeComplex[value].eBoardingStatus)[0] - 0;
            } else {
                return;
            }
        }
        if (key == 'Status') {
            param.Type = record.Type;
            param.Status = value;
        }
        Modal.confirm({
            title: '确定要修改派单信息吗？',
            visible: true,
            onOk: () => {
                DispatchService.editDispatchData(param).then((res) => {
                    message.info('修改成功');
                    this.doQuery(this.props.today);
                    console.log(res);
                }, () => {
                    message.info('修改失败');
                    console.log('error');
                });
            }
        });
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.today;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    init() {
        this.doQuery(this.props.today, true);
    }


    doQuery(data, reload = false, e) {
        if (e) e.preventDefault();
        // 分页逻辑
        let RecordIndex = data.pageSize * (data.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {currentPage: 1});
            if (data.currentPage !== 1) return;
        }
        let param = data.queryParams;
        let queryData = {
            Ordered: data.Ordered,
            Start: param.Start,
            UserName: param.UserName,
            PhoneNumber: param.PhoneNumber,
            DriverID: param.DriverID,
            BrokerID: param.BrokerID,
            HubIDList: param.HubIDList,
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        };
        Object.keys(queryData).map((key) => {
            if (queryData[key] == null || queryData[key] == undefined || queryData[key] === '') {
                if (['BrokerID', 'DriverID'].indexOf(key) > -1) {
                    queryData[key] = null;
                } else if (['Start', 'UserName', 'PhoneNumber'].indexOf(key) > -1) {
                    queryData[key] = "";
                    // delete queryData[key];
                }
            }
        });
        queryData.HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        if (data.authHubID != -9999) queryData.HubIDList = [data.authHubID];
        getDispatchTrackList(queryData);
        let countParam = {
            BrokerID: queryData.BrokerID,
            DriverID: queryData.DriverID,
            HubIDList: queryData.HubIDList,
            PhoneNumber: queryData.PhoneNumber,
            Start: queryData.Start,
            UserName: queryData.UserName
        };
        DispatchService.getDispatchClaimCount(countParam).then((res) => {
            if (res && res.Data) {
                setParams(this.props.today.state_name, {
                    ClaimSum: res.Data.ClaimSum || 0,
                    ClaimCount: res.Data.ClaimCount || 0
                });
            }
        });
    }

    resetQuery() {
        resetQueryParams(this.props.today.state_name);
    }


    render() {
        if (this.props.stPage.currentTab != 'today') {
            return (<div style={{display: 'none'}}></div>);
        }
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        let data = this.props.today;
        let claimData = this.props.claim;
        let queryParams = data.queryParams;
        let otherParams = data.otherParams;
        let brokerFilterList = this.props.broker.brokerFilterList || [];
        let driverFilterList = this.props.driver.driverFilterList || [];
        const {getFieldDecorator} = this.props.form;
        return (
            <Row>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <Form className="ant-advanced-search-form" onSubmit={(e) => this.doQuery(data, true, e)}>
                            <AuthorityHubSelect authHubID={data.authHubID}
                                                onChange={(value) => setParams(data.state_name, {authHubID: value})}/>
                            <Row gutter={15}>
                                <Col className="gutter-row" span={6}>
                                    <FormItem {...fLayout} label="会员名称">
                                        <Input placeholder="输入名称" value={queryParams.UserName}
                                               onChange={(e) => this.handleSetParam('UserName', e.target.value)}/>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <FormItem {...fLayout} label="派单来源">
                                        {brokerFilterList.length > 0 ? (<AutoCompleteInput
                                            // defaultValue={this.state.brokerTmpDefault}
                                            value={otherParams.BrokerTmp}
                                            allowClear={true}
                                            filterOption={true} // 是否对DataSource匹配
                                            dataKey="NickName" // dataSource中每个data显示的字段名称，不设置则默认取数组里的每个data自身
                                            defaultDataSource={brokerFilterList}
                                            handleChange={value => {
                                                this.handleSetParam('BrokerTmp', value, 'otherParams');
                                                if (queryParams.BrokerID) {
                                                    let target = brokerFilterList.find((item) => item.BrokerID == queryParams.BrokerID);
                                                    if (target && target.NickName != value) {
                                                        this.handleSetParam('BrokerID', undefined);
                                                    }
                                                }
                                            }}
                                            // handleSearch={value => console.log(value)}
                                            handleSelect={(data, index) => {
                                                this.handleSetParam('BrokerID', data.BrokerID);
                                            }}
                                        />) : ''}
                                    </FormItem>
                                </Col>

                                <Col className="gutter-row" span={6}>
                                    <FormItem {...fLayout} label="手机号">
                                        <Input placeholder="输入手机号" value={queryParams.PhoneNumber}
                                               onChange={(e) => this.handleSetParam('PhoneNumber', e.target.value)}/>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <FormItem {...fLayout} label="接送专员">
                                        {driverFilterList.length > 0 ? (<AutoCompleteInput
                                            // defaultValue={this.state.brokerTmpDefault}
                                            value={otherParams.DriverTmp}
                                            allowClear={true}
                                            filterOption={true} // 是否对DataSource匹配
                                            dataKey="DriverName" // dataSource中每个data显示的字段名称，不设置则默认取数组里的每个data自身
                                            defaultDataSource={driverFilterList}
                                            handleChange={value => {
                                                this.handleSetParam('DriverTmp', value, 'otherParams');
                                                if (queryParams.DriverID) {
                                                    let target = driverFilterList.find((item) => item.DriverID == queryParams.DriverID);
                                                    if (target && target.DriverName != value) {
                                                        this.handleSetParam('DriverID', undefined);
                                                    }
                                                }
                                            }}
                                            // handleSearch={value => console.log(value)}
                                            handleSelect={(data, index) => {
                                                this.handleSetParam('DriverID', data.DriverID);
                                            }}
                                        />) : ''}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col className="gutter-row" span={6}>
                                    <FormItem {...fLayout} label="去哪儿接">
                                        <Input placeholder="去哪儿接" value={queryParams.Start}
                                               onChange={(e) => this.handleSetParam('Start', e.target.value)}/>
                                    </FormItem>

                                </Col>
                                <Col className="gutter-row" span={6} offset={12}>
                                    <FormItem style={{textAlign: 'right'}}>
                                        <Button className="ant-btn ml-8" onClick={() => this.resetQuery()}>重置</Button>
                                        <Button className="ant-btn ml-8" type="primary" htmlType="submit">搜索</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <Row gutter={16} className="mb-8">
                            <Col span={24}>
                                <span>{`共计${data.ClaimCount || 0}条报销信息，报销金额${((data.ClaimSum || 0) / 100).FormatMoney({fixed: 2})}元`}</span>
                            </Col>
                        </Row>
                        <Table rowKey="rowKey" columns={this.tableColumns(data.Ordered)}
                               pagination={{
                                   current: data.currentPage,
                                   onChange: (page) => setParams(data.state_name, {currentPage: page}),
                                   total: data.totalSize
                               }}
                               onChange={(pagination, filters, sorter) => {
                                   let sort = sorter.order == "descend" ? 0 : 1;
                                   if (sort != data.Ordered) {
                                       setParams(data.state_name, {Ordered: sort});
                                   }
                               }}
                               loading={data.RecordListLoading}
                               dataSource={data.dispatchList}></Table>
                    </div>
                </div>
                <DispatchClaimModal claim={this.props.claim}></DispatchClaimModal>
            </Row>
        );
    }

    tableColumns(Ordered) {
        return [
            {
                title: '派单时间', key: 'Time', sorter: true, sortOrder: Ordered == 1 ? "ascend" : "descend",
                render: (text, record) => {
                    return (<div>{record.Time ? moment(record.Time).format('MM/DD HH:mm') : ''}</div>);
                }
            },
            {title: '派单来源', dataIndex: 'Broker'},
            {title: '会员姓名', dataIndex: 'UserName'},
            {title: '手机号', dataIndex: 'PhoneNumber'},
            // {title: '随行人数', dataIndex: 'People'},
            {
                title: '总人数', key: 'PeopleSum',
                render: (text, record) => {
                    return (<div>{record.People != undefined ? record.People + 1 : ''}</div>);
                }
            },
            {title: '接送专员', dataIndex: 'Driver'},
            {title: '去哪儿接', dataIndex: 'Start'},
            {title: '往哪儿送', dataIndex: 'Destination'},
            {
                title: '派单状态', key: 'DriverAcceptStatus',
                render: (text, record) => {
                    return this.eDriverAcceptStatus[record.DriverAcceptStatus];
                }
            },
            {
                title: '派单类型', key: 'Type',
                render: (text, record) => {
                    // 0待定，1我打，2滴滴，3出租车
                    // 此处逻辑为0=》2，3 ||  2《==》3
                    // 待定
                    if (record.Money > 0) {
                        return this.eTypeAll[record.Type];
                    }
                    // 若派单状态不是派单失败，而派单类型为0时，不显示待定
                    if (record.DriverAcceptStatus != 2 && record.Type === 0) {
                        return '';
                    }
                    if (record.DriverAcceptStatus == 2 && record.Type === 0) {
                        return (<Select value={record.Type + ''} style={{width: '90px'}}
                                        onChange={(value) => this.handleChangeTrackData(record, 'Type', value - 0)}>
                            {this.eTypeOtherList.map((key, index) => {
                                return (<Option key={index} value={key + ''}>{this.eTypeAll[key]}</Option>);
                            })}
                        </Select>);
                    }
                    // 企业滴滴/出租车
                    // 原产品设计逻辑为 滴滴和出租车可灵活切换，便于体验中心主管操作。
                    // 2018-01-09,更改为两者的已送达和未接到都不可编辑
                    else if ((record.Type === 2 || record.Type === 3) && record.Status != 4 && record.Status != 5) {
                        return (<Select value={record.Type + ''} style={{width: '90px'}}
                                        onChange={(value) => this.handleChangeTrackData(record, 'Type', value - 0)}>
                            {this.eTypeOtherList.filter((key) => key != 0 && key != -9999).map((key, index) => {
                                return (<Option key={index} value={key + ''}>{this.eTypeAll[key]}</Option>);
                            })}
                        </Select>);
                    }
                    return this.eTypeAll[record.Type];
                }
            },
            {
                title: '接送状态', dataIndex: 'Status',
                render: (text, record) => {
                    if (record.Money > 0) {
                        return this.eStatus[record.Status];
                    }
                    let ContactContent = '';
                    // 类型为我打，且状态为未接到，显示未接到的四个联系类型
                    if (record.Type == 1 && record.Status == 4 && [3, 4, 5, 6].indexOf(record.Contact) > -1) {
                        ContactContent = `(${this.eContactType[record.Contact]})`;
                    } else if (record.Type == 1 && record.Status == 2 && [1, 2].indexOf(record.Contact) > -1) {
                        ContactContent = `(${this.eContactType[record.Contact]})`;
                    }
                    return (
                        <div>{(record.Type != 2 && record.Type != 3) || record.Status === 5 || record.Status === 4 ?
                            this.eStatus[record.Status] + ContactContent : (
                                <Select defaultValue={record.Status + ''} style={{width: '90px'}}
                                        onChange={(value) => this.handleChangeTrackData(record, 'Status', value - 0)}>
                                    {Object.keys(this.eTypeComplex[record.Type].eBoardingStatus).map((key, index) => {
                                        return (<Option key={index} value={key + ''}>{this.eStatus[key]}</Option>);
                                    })}
                                </Select>)}</div>);
                }
            },
            {
                title: '报销车费',
                key: 'Operate',
                render: (text, record) => {
                    if (record.Money > 0) {
                        return (<div>{`已报销${(record.Money / 100).FormatMoney({fixed: 2})}元`}</div>);
                    }
                    if ((record.Type == 1 || record.Type == 3)) {
                        return (
                            <a className={((record.Type == 1 && (record.Status == 3 || record.Status == 5))) ? 'display-none' : ''}
                               onClick={() => this.handleDoClaim(record)}>报销</a>);
                    }
                    else return '';
                }
            }
        ];
    }

}


export default Form.create()(DispatchTrackToday);