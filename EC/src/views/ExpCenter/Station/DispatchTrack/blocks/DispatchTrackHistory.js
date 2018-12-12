import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, DatePicker} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
import SelectableInput from "COMPONENT/SelectableInput/index";
import moment from 'moment';
import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
// 业务相关
import Mapping_Dispatch from "CONFIG/EnumerateLib/Mapping_Dispatch";
import getDispatchHistoryList from "ACTION/ExpCenter/DispatchTrack/getDispatchHistoryList";
import getBrokerFilterList from "ACTION/ExpCenter/Broker/getBrokerFilterList";
import getDriverFilterList from "ACTION/ExpCenter/HubEmployee/getDriverFilterList";
import DispatchService from "SERVICE/ExpCenter/DispatchService";


const FormItem = Form.Item;
const Option = Select.Option;

class DispatchTrackHistory extends React.PureComponent {
    constructor(props) {
        super(props);
        console.log('DispatchTrackToday props', props);
        this.state = {filterList: []};
        this.eStatus = Mapping_Dispatch.eBoardingType;
        this.eStatusList = Object.keys(this.eStatus);
        this.eCheckIn = Mapping_Dispatch.eSignStatus;
        this.eCheckInList = Object.keys(this.eCheckIn);
        this.eType = Mapping_Dispatch.eBoardingType;
        this.eTypeAll = Mapping_Dispatch.eBoardingTypeAll;
        this.eTypeList = Object.keys(this.eType);

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
        if (nextProps.stPage.currentTab == 'history' && nextProps.stPage.needRefresh && !this.props.stPage.needRefresh) {
            this.doQuery(nextProps.history);
            setParams(nextProps.stPage.state_name, {needRefresh: false});
        }
        // 翻页
        if (nextProps.history.currentPage !== this.props.history.currentPage
            || nextProps.history.Ordered !== this.props.history.Ordered) {
            this.doQuery(nextProps.history);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    init() {
        this.doQuery(this.props.history, true);
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.history;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
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
            StartDateTime: '',
            EndDateTime: '',
            Start: param.Start,
            UserName: param.UserName,
            PhoneNumber: param.PhoneNumber,
            DriverID: param.DriverID,
            BrokerID: param.BrokerID,
            HubIDList: param.HubIDList,
            Type: param.Type == -9999 ? 0 : param.Type,
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        };
        console.log('DispatchTrackHistory queryParams', param);
        if (param.StartDateTime) queryData.StartDateTime = moment(param.StartDateTime).format('YYYY-MM-DD 00:00:00');
        if (param.EndDateTime) queryData.EndDateTime = moment(param.EndDateTime).format('YYYY-MM-DD 23:59:59');
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
        getDispatchHistoryList(queryData);
        let countParam = {
            BrokerID: queryData.BrokerID,
            DriverID: queryData.DriverID,
            HubIDList: queryData.HubIDList,
            EndDateTime: queryData.EndDateTime,
            StartDateTime: queryData.StartDateTime,
            Type: queryData.Type,
            PhoneNumber: queryData.PhoneNumber,
            // Status: queryData.Status,
            Start: queryData.Start,
            UserName: queryData.UserName
        };
        DispatchService.getDispatchHistoryClaimCount(countParam).then((res) => {
            if (res && res.Data) {
                setParams(this.props.history.state_name, {
                    ClaimSum: res.Data.ClaimSum || 0,
                    ClaimCount: res.Data.ClaimCount || 0
                });
            }
        });
    }

    resetQuery() {
        resetQueryParams(this.props.history.state_name);
    }

    render() {
        if (this.props.stPage.currentTab != 'history') {
            return (<div style={{display: 'none'}}></div>);
        }
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        let data = this.props.history;
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
                                    <FormItem {...fLayout} label="开始日期">
                                        <DatePicker format="YYYY-MM-DD" value={queryParams.StartDateTime}
                                                    onChange={(date) => this.handleSetParam('StartDateTime', date)}></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <FormItem {...fLayout} label="截止日期">
                                        <DatePicker format="YYYY-MM-DD" value={queryParams.EndDateTime}
                                                    onChange={(date) => this.handleSetParam('EndDateTime', date)}></DatePicker>
                                    </FormItem>
                                </Col>
                                {/* <Col className="gutter-row" span={6}>*/}
                                {/* <FormItem {...fLayout} label="是否签到">*/}
                                {/* {getFieldDecorator('CheckIn', {*/}
                                {/* initialValue: queryParams.CheckIn + ''*/}
                                {/* })(*/}
                                {/* <Select onchange={(value) => this.handleSetParam('CheckIn', value - 0)}>*/}
                                {/* <Option key={'-999'}>全部</Option>*/}
                                {/* {this.eCheckInList.map((key, index) => {*/}
                                {/* return (*/}
                                {/* <Option key={index}>{this.eCheckIn[key]}</Option>);*/}
                                {/* })}*/}
                                {/* </Select>*/}
                                {/* )}*/}
                                {/* </FormItem>*/}
                                {/* </Col>*/}
                                <Col className="gutter-row" span={6}>
                                    <FormItem {...fLayout} label="接送类型">
                                        <Select value={queryParams.Type + ''}
                                                onChange={(value) => this.handleSetParam('Type', value - 0)}>
                                            <Option key="-9999">全部</Option>
                                            {this.eTypeList.map((key, index) => {
                                                return (
                                                    <Option key={index}
                                                            value={key + ''}>{this.eType[key]}</Option>);
                                            })}
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
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
            </Row>
        );
    }

    tableColumns(Ordered) {
        return [
            {
                title: '派单时间', key: 'OrderTime', sorter: true, sortOrder: Ordered == 1 ? "ascend" : "descend",
                render: (text, record) => {
                    return (<div>{record.OrderTime ? moment(record.OrderTime).format('MM/DD HH:mm') : ''}</div>);
                }
            },
            {title: '派单来源', dataIndex: 'Broker'},
            {title: '会员姓名', dataIndex: 'UserName'},
            {title: '手机号', dataIndex: 'PhoneNumber'},
            // {title: '性别', dataIndex: 'Gender'},
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
                title: '接送类型', key: 'Type',
                render: (text, record) => {
                    return (<div>{this.eTypeAll[record.Type]}</div>);
                }
            },
            {
                title: '报销车费', key: 'Money',
                render: (text, record) => {
                    return (<div>{record.Money > 0 ? (record.Money / 100).FormatMoney({fixed: 2}) + '元' : ''}</div>);
                }
            }
        ];
    }
}

export default Form.create()(DispatchTrackHistory);