import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, DatePicker, message, Popconfirm} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";
import resetState from 'ACTION/resetState';
import resetQueryParams from "ACTION/resetQueryParams";
import SelectableInput from "COMPONENT/SelectableInput/index";
import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
// 业务相关
import Mapping_Interview from "CONFIG/EnumerateLib/Mapping_Interview";
import Mapping_Scene from "CONFIG/EnumerateLib/Mapping_Scene";
import getSignList from "ACTION/ExpCenter/SignList/getSignList";
import RefundModal from "./RefundModal";
import getRecruitNameList from "ACTION/ExpCenter/Recruit/getRecruitNameList";
import getLaborFilterList from "ACTION/ExpCenter/Labor/getLaborFilterList";
import SceneService from "SERVICE/ExpCenter/SceneService";
import AutoCompleteSelect from "COMPONENT/AutoCompleteSelect/index";
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import SignRecordModal from './SignRecordModal';

const FormItem = Form.Item;
const Option = Select.Option;

class SignList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eResultComplex = Mapping_Interview.eResultComplex;
        this.eWhetherLabor = Mapping_Scene.eWhetherLabor;
        this.eChargePayType = Mapping_Scene.eChargePayType;
        this.eRefundPayType = Mapping_Scene.eRefundPayType;
        this.isManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;
        this.state = {
            curDataRecord: undefined
        };
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
        if (nextProps.sign.currentPage !== this.props.sign.currentPage
            || nextProps.sign.orderParams !== this.props.sign.orderParams) {
            this.doQuery(nextProps.sign);
        }
        // 退押金弹窗
        if (nextProps.refund.addRefundDataFetch.status == 'success') {
            // let res = nextProps.refund.addRefundDataFetch.response;
            message.info('退费成功');
            this.doQuery(nextProps.sign);
            resetState(nextProps.refund.state_name);
        }
        if (nextProps.refund.addRefundDataFetch.status == 'error') {
            let res = nextProps.refund.addRefundDataFetch.response;
            message.info(res.Desc);
            setParams(nextProps.refund.state_name, {addRefundDataFetch: {status: 'close'}});
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleShowRefundModal(item) {
        if (item && item.InterviewID) {
            let refund = this.props.refund;
            setParams(refund.state_name, {InterviewID: item.InterviewID, InterviewData: Object.assign({}, item)});
        } else {
            console.log('数据异常,检查InterviewID字段');
        }
    }

    mapInterviewStatusText(item) {
        let targetKey = Object.keys(this.eResultComplex).find((key) => {
            let resItem = this.eResultComplex[key];
            return resItem.LaborListStatus == item.LaborListStatus && resItem.InterviewStatus == item.InterviewStatus;
        });
        if (targetKey) return this.eResultComplex[targetKey].value;
        return '';
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
        this.doQuery(this.props.sign);
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
        getSignList({
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

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.sign;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
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
        let data = this.props.sign;
        let index = data.orderParams.findIndex((item) => item.Key == key);
        if (index == -1) {
            setParams(data.state_name, {orderParams: data.orderParams.concat([{Key: key, Order: order}])});
        } else {
            let orderParams = [].concat(data.orderParams);
            orderParams.splice(index, 1, {Key: key, Order: order});
            setParams(data.state_name, {orderParams: orderParams});
        }
    }

    handleTagUnInterview(record) {
        let param = {
            InterviewID: record.InterviewID,
            EmployeeID: AppSessionStorage.getEmployeeID()
        };
        SceneService.setUserUnInterview(param).then(
            (res) => {
                if (res.Code === 0) {
                    message.info('标记未面试成功');
                    this.doQuery(this.props.sign);
                } else {
                    message.info('标记未面试失败');
                }
            }, (err) => {
                message.info('标记未面试失败');
                console.log(err);
            });
    }

    handleShowRecord = (record) => {
        if (!moment(record.CheckinTime).isValid()) {
            message.destroy();
            message.error('签到日期异常');
            return;
        }
        const param = {
            Uuid: record.Uuid,
            CheckinDate: moment(record.CheckinTime).format('YYYY-MM-DD')
        };
        SceneService.getSignRecordByUUID(param)
            .then((res) => {
                if (!res || res.error) return;
                if (res.Data && res.Data.RecordList && res.Data.RecordList.length > 0) {
                    this.setState({curDataRecord: res.Data.RecordList});
                } else {
                    message.destroy();
                    message.info('获取签到流水失败，接口未返回记录');
                }
            }, (err) => {
                message.destroy();
                message.info('获取签到流水失败' + (err && err.Desc ? ':' + err.Desc : ''));
            });
    };

    render() {
        let data = this.props.sign;
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
                    <div className="ivy-title">会员签到</div>
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
                                    <Col className="gutter-row" span={6} offset={6}>
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
                                <Col className="gutter-row" span={12}>
                                    <Button className="ant-btn mr-8" type="primary"
                                            onClick={() => this.handleGoPage('/ec/main/charge-list')}>
                                        收退费列表
                                    </Button>
                                    <span>{`共计${data.totalSize}条会员签到信息，
                                    收费金额${(data.TotalChargeAmount / 100).FormatMoney({fixed: 2})}元，
                                    退费金额${(data.TotalRefundAmount / 100).FormatMoney({fixed: 2})}元`}</span>
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
                                   dataSource={data.signList}></Table>
                        </div>
                    </div>
                </Row>
                <RefundModal refund={this.props.refund}></RefundModal>
                {this.state.curDataRecord ? <SignRecordModal record={this.state.curDataRecord}
                                                             onModalClose={() => this.setState({curDataRecord: undefined})}/> : ''}
            </div>
        );
    }

    tableColumns(orderParams) {
        let CheckinTimeSorter = orderParams.find((item) => item.Key == 'CheckinTime');
        return [
            {
                title: '签到时间',
                key: 'CheckinTime',
                sorter: true,
                sortOrder: CheckinTimeSorter ? (CheckinTimeSorter.Order == 1 ? 'descend' : 'ascend') : 'descend',
                render: (text, record) => {
                    return (
                        <div>{record.CheckinTime && moment(record.CheckinTime).isValid() ?
                            moment(record.CheckinTime).format('YYYY/MM/DD HH:mm') : ''}</div>);
                }
            },
            {
                title: '真实姓名', key: 'UserName',
                onCellClick: this.handleShowRecord,
                render: (text, record) => (<div className="cursor-pointer color-primary">{record.UserName}</div>)
            },
            {title: '劳务', dataIndex: 'ShortName'},
            {title: '企业', dataIndex: 'RecruitName'},
            {title: '体验中心', dataIndex: 'HubName'},
            {title: '身份证号', dataIndex: 'IDCardNum'},
            {
                title: '收费金额', key: 'ChargeAmount',
                render: (text, record) => {
                    if (record.ChargeAmount > 0) {
                        let chargeTypeText = this.eChargePayType[record.ChargePayType];
                        chargeTypeText = chargeTypeText ? '(' + chargeTypeText + ')' : '';
                        return (
                            <div>{(record.ChargeAmount / 100).FormatMoney({fixed: 2}) + '元' + chargeTypeText}</div>);
                    }
                    return (<div>0</div>);
                }
            },
            {
                title: '退费金额', key: 'RefundAmount',
                render: (text, record) => {
                    if (record.RefundAmount > 0) {
                        let chargeTypeText = this.eRefundPayType[record.RefundPayType];
                        chargeTypeText = chargeTypeText ? '(退' + chargeTypeText + ')' : '';
                        return (<div>{(record.RefundAmount / 100).FormatMoney({fixed: 2}) + chargeTypeText}</div>);
                    }
                    return (<div>0</div>);
                }
            },
            {
                title: '操作', key: 'Operate',
                render: (text, record) => {
                    // 无收费，不显示；已退费，显示金额；有收费未退费，显示退费操作；
                    let chargeElm = '';
                    if (record.ChargeAmount) {
                        if (record.RefundAmount > 0) {
                            chargeElm = <span className="color-grey">已退</span>;
                        } else {
                            chargeElm = <span className="color-grey">未退</span>;
                        }
                    }
                    let setUnInterviewElm = '';
                    let isToday = record.CheckinTime && moment(record.CheckinTime).isValid() ?
                        moment(record.CheckinTime).format('YYYY/MM/DD') == moment().format('YYYY/MM/DD') : false;
                    // 当天，无劳务，无面试状态时显示
                    if (isToday && !record.ShortName && record.LaborListStatus < 1 && record.InterviewStatus < 1) {
                        if (record.BizInterviewStatus == 2) {
                            setUnInterviewElm = <span className="color-grey mr-16">已标记未面试</span>;
                        } else {
                            setUnInterviewElm =
                                <Popconfirm title="确定要执行该操作吗" onConfirm={() => this.handleTagUnInterview(record)}>
                                    <a className="mr-16">标记未面试</a>
                                </Popconfirm>
                            ;
                        }
                    }
                    return (
                        <div className="no-wrap">
                            {/* {setUnInterviewElm}*/}
                            {chargeElm}
                        </div>
                    );
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

export default Form.create()(SignList);