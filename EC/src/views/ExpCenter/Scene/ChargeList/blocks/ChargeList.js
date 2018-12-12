import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, DatePicker, message} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
// 业务相关
import Mapping_Interview from "CONFIG/EnumerateLib/Mapping_Interview";
import Mapping_Scene from "CONFIG/EnumerateLib/Mapping_Scene";
import getChargeList from "ACTION/ExpCenter/ChargeList/getChargeList";
import getRecruitNameList from "ACTION/ExpCenter/Recruit/getRecruitNameList";
import getLaborFilterList from "ACTION/ExpCenter/Labor/getLaborFilterList";
import exportChargeList from "ACTION/ExpCenter/ChargeList/exportChargeList";
import getClient from "COMPONENT/AliyunUpload/getClient";
import AliSignature from "COMPONENT/AliyunUpload/AliSignature";
import AutoCompleteSelect from "COMPONENT/AutoCompleteSelect/index";
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';


const FormItem = Form.Item;
const Option = Select.Option;

class ChargeList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eResultComplex = Mapping_Interview.eResultComplex;
        this.eResultComplexList = Object.keys(this.eResultComplex);
        this.eWhetherLabor = Mapping_Scene.eWhetherLabor;
        this.eWhether = Mapping_Scene.eWhetherInterviewRefund;
        this.eWhetherList = Object.keys(this.eWhether);
        this.eChargePayType = Mapping_Scene.eChargePayType;
        this.eRefundPayType = Mapping_Scene.eRefundPayType;
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
        if (nextProps.charge.currentPage !== this.props.charge.currentPage
            || nextProps.charge.orderParams !== this.props.charge.orderParams) {
            this.doQuery(nextProps.charge);
        }
        // 导出
        let exportFetch = nextProps.charge.exportChargeListFetch;
        if (exportFetch.status == 'success') {
            console.log("exportFetch", exportFetch);
            let res = exportFetch.response;
            // && res.Data.Urls.split(".").length >= 3
            if (res && res.Data && res.Data.Urls) {
                message.info("导出成功");
                let url = res.Data.Urls;
                window.open(url, '_blank');
                // if (url.indexOf("http://") == 0) url = url.replace("http://", '');
                // let bucket = url.split('.')[0];
                // let region = url.split('.')[1];
                // let path = url.substr(url.indexOf('/') + 1);
                // getClient({bucket, region}).then((client) => {
                //     window.open(client.signatureUrl(path), '_blank');
                // });
            } else {
                message.info("导出失败，未返回导出结果");
            }
            setParams(nextProps.charge.state_name, {exportChargeListFetch: {status: "close"}});
        } else if (exportFetch.status == 'error') {
            message.info("导出失败");
            setParams(nextProps.charge.state_name, {exportChargeListFetch: {status: "close"}});
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    mapInterviewStatusText(item) {
        let targetKey = Object.keys(this.eResultComplex).find((key) => {
            let resItem = this.eResultComplex[key];
            return resItem.LaborListStatus == item.LaborListStatus && resItem.InterviewStatus == item.InterviewStatus;
        });
        if (targetKey) return this.eResultComplex[targetKey].value;
        return '';
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.charge;
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
        ActionMAMSRecruitment.GetMAMSRecruitFilterList();
        this.doQuery(this.props.charge);
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
        if (queryData.Whether != -9999) {
            queryData.RefundStatus = queryData.Whether - 0;
        }
        delete queryData.Whether;
        if (queryData.InterviewStatus == -9999) {
            delete queryData.InterviewStatus;
            delete queryData.LaborListStatus;
        } else {
            let r = this.eResultComplex[queryData.InterviewStatus] || {};
            queryData.InterviewStatus = r.InterviewStatus;
            queryData.LaborListStatus = r.LaborListStatus;
        }
        // 非主管权限只能查看三天的数据
        if (!this.isManager) {
            if (!queryData.StartDate || moment().diff(queryData.StartDate, 'days') > 2) {
                queryData.StartDate = moment().add(-2, 'days');
            }
        }
        if (queryData.StartDate) queryData.StartDate = queryData.StartDate.format('YYYY-MM-DD');
        if (queryData.StopDate) queryData.StopDate = queryData.StopDate.format('YYYY-MM-DD');
        if (data.otherParams.CheckinRecruitName) queryData.CheckinRecruitName = data.otherParams.CheckinRecruitName;
        // 企业
        if (queryData.Recruit && queryData.Recruit.value) {
            queryData.CheckinRecruitID = queryData.Recruit.value - 0;
        }
        delete queryData.Recruit;
        // 劳务
        if (queryData.Labor && queryData.Labor.value) {
            queryData.LaborID = queryData.Labor.value - 0;
        }
        delete queryData.Labor;
        let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        if (data.authHubID != -9999) HubIDList = [data.authHubID];
        let paramObj = {
            EmployeeID: AppSessionStorage.getEmployeeID(),
            HubIDList: HubIDList,
            QueryParams: queryData,
            OrderParams: data.orderParams,
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        };
        this.lastParamObj = paramObj;
        getChargeList(paramObj);
    }

    handleExport() {
        exportChargeList(this.lastParamObj);
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
        let data = this.props.charge;
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
        let data = this.props.charge;
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
                    <div className="ivy-title">收退费列表</div>
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
                                        <FormItem {...fLayout} label="身份证">
                                            <Input value={queryParams.IDCardNum}
                                                   onChange={(e) => this.handleSetParam('IDCardNum', e.target.value)}
                                                   placeholder="输入身份证号"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={15}>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="企业">
                                            <AutoCompleteSelect allowClear={true}
                                                                value={queryParams.Recruit}
                                                                placeholder='选择企业'
                                                                onChange={(value) => this.handleSetParam('Recruit', value)}
                                                                optionsData={{
                                                                    valueKey: 'RecruitTmpID',
                                                                    textKey: 'RecruitName',
                                                                    dataArray: this.props.recruitFilterList
                                                                }}>
                                            </AutoCompleteSelect>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="劳务">
                                            <AutoCompleteSelect allowClear={true}
                                                                value={queryParams.Labor}
                                                                placeholder='选择劳务'
                                                                onChange={(value) => this.handleSetParam('Labor', value)}
                                                                optionsData={{
                                                                    valueKey: 'LaborID',
                                                                    textKey: 'ShortName',
                                                                    dataArray: laborFilterList
                                                                }}>
                                            </AutoCompleteSelect>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="面试结果">
                                            <Select value={queryParams.InterviewStatus + ''}
                                                    onChange={(value) => this.handleSetParam('InterviewStatus', value - 0)}>
                                                <Option value="-9999">全部</Option>
                                                {this.eResultComplexList.map((key, index) => {
                                                    return <Option key={index}
                                                                   value={key + ''}>{this.eResultComplex[key].value}</Option>;
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="是否退费">
                                            <Select value={queryParams.Whether + ''}
                                                    onChange={(value) => this.handleSetParam('Whether', value - 0)}>
                                                <Option value="-9999">全部</Option>
                                                {this.eWhetherList.map((key, index) => {
                                                    return <Option key={index}
                                                                   value={key + ''}>{this.eWhether[key]}</Option>;
                                                })}
                                            </Select></FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="gutter-row" span={6} offset={18}>
                                        <FormItem className="text-right">
                                            <Button className="ant-btn ml-8"
                                                    onClick={() => this.resetQuery(data)}>重置</Button>
                                            <Button className="ant-btn ml-8" type="primary"
                                                    htmlType="submit">搜索</Button>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <Row gutter={15} className="mb-8">
                                <Col span={24}>
                                    <Button type="primary" onClick={() => this.handleExport()}
                                            disabled={data.exportChargeListFetch.status == "pending"}
                                            loading={data.exportChargeListFetch.status == "pending"}
                                            htmlType="button"
                                            className="ml-8">{data.exportChargeListFetch.status == "pending" ? '导出中' : '导出'}</Button>
                                </Col>
                            </Row>
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
                                   dataSource={data.chargeList}></Table>
                        </div>
                    </div>
                </Row>
            </div>
        );
    }

    tableColumns(orderParams = []) {
        let CheckinTimeSorter = orderParams.find((item) => item.Key == 'CheckinTime');
        return [
            {
                title: '签到时间', key: 'CheckinTime',
                sorter: true,
                sortOrder: CheckinTimeSorter ? (CheckinTimeSorter.Order == 1 ? 'descend' : 'ascend') : 'descend',
                render: (text, record) => {
                    return (
                        <div>{record.CheckinTime ? moment(record.CheckinTime).format('YYYY/MM/DD HH:mm') : ''}</div>);
                }
            },
            {title: '真实姓名', dataIndex: 'UserName'},
            {title: '劳务', dataIndex: 'ShortName'},
            {title: '企业', dataIndex: 'RecruitName'},
            {title: '体验中心', dataIndex: 'HubName', render: (text, record) => {
                const { RefundStatus, RefundHubName, ChargeHubName } = record;
                if (RefundStatus === 2) {
                    return RefundHubName;
                } else if (RefundStatus === 1) {
                    return ChargeHubName;
                } else {
                    return '';
                }
            }},
            {title: '身份证号', dataIndex: 'IDCardNum'},
            {
                title: '收费金额', key: 'ChargeAmount',
                render: (text, record) => {
                    if (record.ChargeAmount > 0) {
                        let chargeTypeText = this.eChargePayType[record.ChargePayType];
                        chargeTypeText = chargeTypeText ? '(' + chargeTypeText + ')' : '';
                        return (<div>{(record.ChargeAmount / 100).FormatMoney({fixed: 2}) + chargeTypeText}</div>);
                    }
                    return (<div>0</div>);
                }
            },
            {
                title: '退费金额', key: 'RefundAmount',
                render: (text, record) => {
                    if (record.RefundAmount > 0) {
                        let chargeTypeText = this.eRefundPayType[record.RefundPayType];
                        chargeTypeText = chargeTypeText ? '(' + chargeTypeText + ')' : '';
                        return (<div>{(record.RefundAmount / 100).FormatMoney({fixed: 2}) + chargeTypeText}</div>);
                    }
                    return (<div>0</div>);
                }
            },
            {
                title: '是否退费', key: 'Operate',
                render: (text, record) => {
                    return this.eWhether[record.RefundStatus];
                }
            },
            {
                title: '面试结果', key: 'InterviewStatus',
                render: (text, record) => {
                    return (
                        <div> {this.mapInterviewStatusText(record)}</div>);
                }
            }
        ];
    }
}

export default Form.create()(ChargeList);