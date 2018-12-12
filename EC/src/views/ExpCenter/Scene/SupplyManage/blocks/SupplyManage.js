import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, DatePicker, Icon} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
// 物品发放
import Mapping_Scene from "CONFIG/EnumerateLib/Mapping_Scene";
import SupplyDepositReturnModal from "./SupplyDepositReturnModal";
import SupplyReleaseModal from "./SupplyReleaseModal";
import getSupplyReleaseList from "ACTION/ExpCenter/Supply/getSupplyReleaseList";
import getRecruitNameList from "ACTION/ExpCenter/Recruit/getRecruitNameList";
import SupplyService from "SERVICE/ExpCenter/SupplyService";
import AutoCompleteSelect from "COMPONENT/AutoCompleteSelect/index";
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import MAMSCommonAction from 'ACTION/Common/MAMSCommonAction';

const FormItem = Form.Item;
const Option = Select.Option;


class SupplyManage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eGetType = Mapping_Scene.eSupplyGetType;
        this.eGetTypeList = Object.keys(this.eGetType);
        this.state = {
            todayTotal: ''
        };
        this.columns = [
            {
                title: '发放时间', key: 'ReceiveTime',
                render: (text, record) => {
                    return (
                        <div>{record.ReceiveTime ? moment(record.ReceiveTime).format('YYYY/MM/DD HH:mm') : ''}</div>);
                }
            },
            {title: '体验中心', dataIndex: 'HubName'},
            {title: '物品', dataIndex: 'GiftName'},
            {title: '姓名', dataIndex: 'UserName'},
            {title: '身份证号', dataIndex: 'IDCardNum'},
            {title: '企业', dataIndex: 'RecruitName'},
            // {(item.Amount / 100).FormatMoney({fixed: 2})}
            {
                title: '押金', key: 'Deposit',
                render: (text, record) => {
                    if (!(record.Amount > 0)) return '';
                    let refundText = (record.WorkCardPath || '').length > 0 ? '(已退)' : '(未退)';
                    return (<div>{(record.Amount / 100).FormatMoney({fixed: 2}) + '元' + refundText}</div>);
                }
            },
            {
                title: '工牌', key: 'WorkCardPath',
                render: (text, record) => (<div>{record.WorkCardPath ? (<Icon type="check"/>) : ''}</div>)
            },
            {
                title: '操作', key: 'Operate',
                render: (text, record) => {
                    if (this.hubID != undefined && this.hubID != null && record.Amount > 0 && !record.WorkCardPath) {
                        return (<div><a onClick={() => this.handleClickReturn(record)}>退押金</a></div>);
                    }
                    // else if (record.Amount > 0 && record.WorkCardPath) {
                    //     return <div className="color-grey">已退</div>;
                    // }
                    return;
                }
            },
            {title: '发放操作人', dataIndex: 'ReceiveOperator'},
            {title: '退押金操作人', dataIndex: 'RefundOperator'},
            {
                title: '退押金时间', key: 'RefundTime',
                render: (text, record) => (
                    <div>{record.RefundTime ? moment(record.RefundTime).format('YYYY/MM/DD HH:mm') : ''}</div>)
            }
        ];
        let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        if (HubIDList && HubIDList.length == 1) {
            this.hubID = HubIDList[0];
        }
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.init();
        }
        MAMSCommonAction.GetHubList();
        // this.queryTodayTotal();
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        // 翻页
        if (nextProps.supplyList.currentPage !== this.props.supplyList.currentPage) {
            this.doQuery(nextProps.supplyList);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    // queryTodayTotal() {
    //     let data = this.props.supplyList;
    //     let queryParams = data.queryParams;
    //     let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
    //     if (data.authHubID != -9999) HubIDList = [data.authHubID];
    //     let param = {
    //         HubIDList: HubIDList
    //     };
    //     if (queryParams.StartDate) param.StartDate = queryParams.StartDate.format('YYYY-MM-DD');
    //     if (queryParams.StopDate) param.StopDate = queryParams.StopDate.format('YYYY-MM-DD');
    //     SupplyService.getSupplyReleaseTotal(param).then((res) => {
    //         let text = '';
    //         if (res && res.Data) {
    //             let amount = res.Data.TotalAmount ? (res.Data.TotalAmount / 100).FormatMoney({fixed: 2}) + '元' : '0元';
    //             text = `共计${res.Data.TotalNum || '0'}条物品发放信息，押金总计：${amount}`;
    //         }
    //         this.setState({todayTotal: text});
    //     }, (err) => console.log(err));
    // }

    handleRefresh() {
        this.init(true);
        // this.queryTodayTotal();
    }

    init(reload = false) {
        if (reload || this.props.recruitNameList.length == 0) {
            getRecruitNameList();
        }
        ActionMAMSRecruitment.GetMAMSRecruitFilterList();
        this.doQuery(this.props.supplyList);
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
        // queryData.RecruitName=data.otherParams.RecruitName;
        if (queryData.GetType == -9999) delete queryData.GetType;
        if (queryData.StartDate) queryData.StartDate = queryData.StartDate.format('YYYY-MM-DD');
        if (queryData.StopDate) queryData.StopDate = queryData.StopDate.format('YYYY-MM-DD');
        // 企业
        if (queryData.Recruit && queryData.Recruit.value) {
            queryData.RecruitID = queryData.Recruit.value - 0;
        }
        delete queryData.Recruit;
        // let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        // if (data.authHubID != -9999) HubIDList = [data.authHubID];
        let HubIDList = queryData.HubID == -9999 ? [] : [queryData.HubID];
        getSupplyReleaseList({
            EmployeeID: AppSessionStorage.getEmployeeID(),
            HubIDList: HubIDList,
            QueryParams: queryData,
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        });
        // this.queryTodayTotal();
    }

    resetQuery(data) {
        resetQueryParams(data.state_name);
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.supplyList;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    handleClickReturn(item) {
        item = Object.assign({}, item);
        let detail = this.props.supplyDetail;
        setParams(detail.state_name, {SupplyReleaseID: item.GiftFeeID, SupplyReleaseData: item});
        this.handleShowModal('detail');
    }

    handleShowModal(type, refresh = false) {
        let data = this.props.supplyList;
        setParams(data.state_name, {showModal: type});
        if (refresh) {
            this.doQuery(this.props.supplyList);
        }
    }

    render() {
        let data = this.props.supplyList;
        let queryParams = data.queryParams;
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        const {getFieldDecorator} = this.props.form;
        let recruitNameList = this.props.recruitNameList;
        let HubSimpleList = this.props.HubSimpleList;
        return (
            <div className='sign-list-view'>
                <div className='ivy-page-title'>
                    <div className="ivy-title">物品发放</div>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-20">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => this.doQuery(data, true, e)}>
                                {/* <AuthorityHubSelect authHubID={data.authHubID}*/}
                                {/* onChange={(value) => setParams(data.state_name, {authHubID: value})}/>*/}
                                <Row gutter={15}>
                                    <Col className="gutter-tow" span={6}>
                                        <FormItem {...fLayout} label="发放体验中心">
                                            <Select value={queryParams.HubID + ''}
                                                    onChange={(value) => this.handleSetParam('HubID', value - 0)}>
                                                <Option key="-9999">全部</Option>
                                                {HubSimpleList.map((key, index) => {
                                                    return (
                                                        <Option key={index}
                                                                value={key.HubID + ''}>{key.HubName}</Option>);
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="开始日期">
                                            <DatePicker format="YYYY-MM-DD"
                                                        value={queryParams.StartDate}
                                                        onChange={(date) => this.handleSetParam('StartDate', date)}></DatePicker>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="截止日期">
                                            <DatePicker format="YYYY-MM-DD"
                                                        value={queryParams.StopDate}
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
                                </Row>
                                <Row gutter={15}>
                                    <Col className="gutter-row" span={6}>
                                        <FormItem {...fLayout} label="身份证">
                                            <Input value={queryParams.IDCardNum}
                                                   onChange={(e) => this.handleSetParam('IDCardNum', e.target.value)}
                                                   placeholder="输入身份证号"/>
                                        </FormItem>
                                    </Col>
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
                                        <FormItem {...fLayout} label="押金/工牌">
                                            <Select value={queryParams.GetType + ''}
                                                    onChange={(value) => this.handleSetParam('GetType', value - 0)}>
                                                <Option key="-9999">全部</Option>
                                                {this.eGetTypeList.map((key, index) => {
                                                    return (
                                                        <Option key={index}
                                                                value={key + ''}>{this.eGetType[key]}</Option>);
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" span={6}>
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
                                <Col className="gutter-row" span={24}>
                                    {this.hubID != undefined && this.hubID != null ?
                                        <Button className="ant-btn mr-8" type="primary"
                                                onClick={() => this.handleShowModal('new')}>
                                            新增发放
                                        </Button> : ''}
                                    <span>{`共计${data.totalSize || '0'}条物品发放信息，
                                    押金总计：${!data.totalAmount ? '0元' : (data.totalAmount / 100).FormatMoney({fixed: 2}) + '元'},
                                    退回押金总计：${!data.TotalRefundAmount ? '0元' : (data.TotalRefundAmount / 100).FormatMoney({fixed: 2}) + '元'}`}</span>
                                </Col>
                            </Row>
                            <Table rowKey="rowKey" columns={this.columns}
                                   pagination={{
                                       current: data.currentPage,
                                       onChange: (page) => setParams(data.state_name, {currentPage: page}),
                                       total: data.totalSize
                                   }}
                                   loading={data.RecordListLoading}
                                   dataSource={data.supplyReleaseList}></Table>
                        </div>
                    </div>
                </Row>
                {data.showModal == 'new' ?
                    <SupplyReleaseModal closeModal={(refresh) => this.handleShowModal(false, refresh)}
                                        supplyNew={this.props.supplyNew}/> : ''}
                {data.showModal == 'detail' ?
                    <SupplyDepositReturnModal closeModal={(refresh) => this.handleShowModal(false, refresh)}
                                              supplyDetail={this.props.supplyDetail}/> : ''}
            </div>
        );
    }
}

export default Form.create()(SupplyManage);