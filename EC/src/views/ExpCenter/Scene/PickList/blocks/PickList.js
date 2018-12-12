import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, DatePicker, message} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
import SelectableInput from "COMPONENT/SelectableInput/index";
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
// 业务相关
import Mapping_Interview from "CONFIG/EnumerateLib/Mapping_Interview";
import Mapping_Scene from "CONFIG/EnumerateLib/Mapping_Scene";
import Mapping_User from "CONFIG/EnumerateLib/Mapping_User";
import getPickUpList from "ACTION/ExpCenter/Labor/getPickUpList";
import getRecruitNameList from "ACTION/ExpCenter/Recruit/getRecruitNameList";
import getLaborFilterList from "ACTION/ExpCenter/Labor/getLaborFilterList";

const FormItem = Form.Item;
const Option = Select.Option;

class PickList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eResultComplex = Mapping_Interview.eResultComplex;
        this.eWhetherLabor = Mapping_Scene.eWhetherLabor;
        this.eChargePayType = Mapping_Scene.eChargePayType;
        this.eRefundPayType = Mapping_Scene.eRefundPayType;
        this.eGender = Mapping_User.eGender;
        this.isManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.init();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        // 翻页
        if (nextProps.pick.currentPage !== this.props.pick.currentPage
            || nextProps.pick.orderParams !== this.props.pick.orderParams) {
            this.doQuery(nextProps.pick);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.pick;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleRefresh() {
        this.init(true);
    }

    init(reload = false) {
        if (reload || this.props.recruitNameList.length == 0) {
            getRecruitNameList();
        }
        if (reload || this.props.laborFilterList.length == 0) {
            getLaborFilterList();
        }
        this.doQuery(this.props.pick);
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
        let queryData = Object.assign({}, param);
        // 非主管权限只能查看三天的数据
        if (!this.isManager) {
            if (!queryData.StartDate || moment().diff(queryData.StartDate, 'days') > 2) {
                queryData.StartDate = moment().add(-2, 'days');
            }
        }
        if (queryData.StartDate) queryData.StartDate = queryData.StartDate.format('YYYY-MM-DD');
        if (queryData.StopDate) queryData.StopDate = queryData.StopDate.format('YYYY-MM-DD');
        let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        if (data.authHubID != -9999) HubIDList = [data.authHubID];
        getPickUpList({
            EmployeeID: AppSessionStorage.getEmployeeID(),
            HubIDList: HubIDList,
            QueryParams: queryData,
            OrderParams: data.orderParams,
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        });
    }

    resetQuery(data) {
        resetQueryParams(data.state_name);
    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    handleDoSorter(sorter) {
        if (!sorter || !sorter.columnKey) return;
        let key = sorter.columnKey;
        let order = sorter.order == 'descend' ? 1 : 0;
        let data = this.props.pick;
        let index = data.orderParams.findIndex((item) => item.Key == key);
        if (index == -1) {
            setParams(data.state_name, {orderParams: data.orderParams.concat([{Key: key, Order: order}])});
        } else {
            let orderParams = [].concat(data.orderParams);
            orderParams.splice(index, 1, {Key: key, Order: order});
            setParams(data.state_name, {orderParams: orderParams});
        }
    }

    render() {
        let data = this.props.pick;
        let queryParams = data.queryParams;
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        const {getFieldDecorator} = this.props.form;
        let recruitNameList = this.props.recruitNameList;
        let laborFilterList = this.props.laborFilterList;
        return (
            <div className='sign-list-view'>
                <div className='ivy-page-title'>
                    <div className="ivy-title">劳务接人</div>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-20">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => this.doQuery(data, true, e)}>
                                <AuthorityHubSelect authHubID={data.authHubID}
                                                    onChange={(value) => setParams(data.state_name, {authHubID: value})}/>
                                <Row gutter={15}>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="开始日期">
                                            <DatePicker format="YYYY-MM-DD" value={queryParams.StartDate}
                                                        allowClear={this.isManager}
                                                        disabledDate={(d) => this.isManager ? false : moment().diff(d, 'days') > 2}
                                                        onChange={(date) => this.handleSetParam('StartDate', date)}></DatePicker>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="截止日期">
                                            <DatePicker format="YYYY-MM-DD" value={queryParams.StopDate}
                                                        onChange={(date) => this.handleSetParam('StopDate', date)}></DatePicker>
                                        </FormItem>
                                    </Col>

                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="会员姓名">
                                            <Input value={queryParams.UserName}
                                                   onChange={(e) => this.handleSetParam('UserName', e.target.value)}
                                                   placeholder="输入姓名"/>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="劳务">
                                            {laborFilterList.length > 0 ? (
                                                <AutoCompleteInput
                                                    // defaultValue={this.state.brokerTmpDefault}
                                                    value={data.otherParams.LaborName}
                                                    allowClear={true}
                                                    filterOption={true} // 是否对DataSource匹配
                                                    dataKey="ShortName" // dataSource中每个data显示的字段名称，不设置则默认取数组里的每个data自身
                                                    defaultDataSource={laborFilterList}
                                                    handleChange={value => {
                                                        this.handleSetParam('LaborName', value, 'otherParams');
                                                        if (queryParams.LaborID) {
                                                            let target = laborFilterList.find((item) => item.LaborID == queryParams.LaborID);
                                                            if (target && target.ShortName != value) {
                                                                this.handleSetParam('LaborID', undefined);
                                                            }
                                                        }
                                                    }}
                                                    // handleSearch={value => console.log(value)}
                                                    handleSelect={(data, index) => {
                                                        this.handleSetParam('LaborID', data.LaborID - 0);
                                                    }}
                                                />) : ''}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={15}>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="企业">
                                            {recruitNameList.length > 0 ? (
                                                <AutoCompleteInput
                                                    value={data.otherParams.RecruitName}
                                                    allowClear={true}
                                                    filterOption={true} // 是否对DataSource匹配
                                                    dataKey="RecruitName" // dataSource中每个data显示的字段名称，不设置则默认取数组里的每个data自身
                                                    defaultDataSource={recruitNameList}
                                                    handleChange={value => {
                                                        this.handleSetParam('RecruitName', value, 'otherParams');
                                                    }}
                                                    // handleSearch={value => console.log(value)}
                                                    handleSelect={(data, index) => {
                                                        this.handleSetParam('RecruitID', data.RecruitID);
                                                    }}
                                                />) : ''}
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={6} offset={12}>
                                        <FormItem className="text-right">
                                            <Button className="ant-btn ml-8"
                                                    onClick={() => this.resetQuery(data)}>重置</Button>
                                            <Button className="ant-btn ml-8" type="primary"
                                                    htmlType="submit">搜索</Button>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <Table rowKey="rowKey" columns={this.tableColumns(data.orderParams)}
                                   pagination={{
                                       current: data.currentPage,
                                       onChange: (page) => setParams(data.state_name, {currentPage: page}),
                                       total: data.totalSize
                                   }}
                                   onChange={(pagination, filters, sorter) => {
                                       this.handleDoSorter(sorter);
                                   }}
                                   loading={data.RecordListLoading}
                                   dataSource={data.pickUpList}></Table>
                        </div>
                    </div>
                </Row>
            </div>
        );
    }

    tableColumns(orderParams = []) {
        let CheckinTimeSorter = orderParams.find((item) => item.Key == 'LaborCheckinTime');
        return [
            {
                title: '出发时间', key: 'LaborCheckinTime',
                sorter: true,
                sortOrder: CheckinTimeSorter ? (CheckinTimeSorter.Order == 1 ? 'descend' : 'ascend') : 'descend',
                render: (text, record) => {
                    if (record.LaborCheckinTime == '0000-00-00 00:00:00') return '';
                    return (
                        <div>{record.LaborCheckinTime ? moment(record.LaborCheckinTime).format('YYYY/MM/DD HH:mm') : ''}</div>);
                }
            },
            {title: '真实姓名', dataIndex: 'UserName'},
            {
                title: '性别', key: 'Gender',
                render: (text, record) => {
                    return (
                        <div>{this.eGender[record.Gender]}</div>);
                }
            },
            {title: '劳务', dataIndex: 'ShortName'},
            {title: '企业', dataIndex: 'PositionName'},
            {title: '身份证号', dataIndex: 'IDCardNum'}

        ];
    }
}

export default Form.create()(PickList);