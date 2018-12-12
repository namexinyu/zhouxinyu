import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Table,
    Icon,
    Button,
    DatePicker,
    Modal,
    message
} from 'antd';
import ComplainModal from './ComplainModal';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import 'LESS/Business/OrderManage/complain-page.less';
import 'LESS/Business/OrderManage/user-call.less';
import ComplainOrderAction from 'ACTION/Business/OrderManage/ComplainOrderAction';
import {
    OrderStep, ComplainType,
    ComplainStatus, ComplainStatusEnum
} from 'CONFIG/EnumerateLib/Mapping_Order';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import CommonAction from 'ACTION/Business/Common';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import oss from 'CONFIG/ossConfig';

const {
    getRecruitSimpleList,
    getLaborSimpleList,
    getUserMobileNumber
} = CommonAction;
const FormItem = Form.Item;
const {Option} = Select;
const {
    complainHandle,
    getComplainList,
    getComplainTotal,
    complainListExport
} = ComplainOrderAction;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_business_complainorder';

class ComplainOrder extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            checkinModalVisible: false, // 查看会员考勤dialog
            checkinModalItem: {},

            complainModalVisible: false, // 申诉处理dialog
            complainModalComplainStatus: ComplainStatus.AUDIT_STATUS_PASS.value, // 申诉处理dialog 申诉状态 2、审核通过 3、审核失败
            complainModalItem: {}
        };
    }

    componentWillMount() {
        if (this.props.location.query && this.props.location.query.AuditStatus) {
            setParams(STATE_NAME, {
                AuditStatus: this.props.location.query.AuditStatus
            });
        }
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getRecruitSimpleList(); // 企业模糊下拉数据
            getLaborSimpleList(); // 劳务公司模糊下拉数据
            this.queryComplainOrderList();
            this.queryComplainTotal();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryComplainOrderList(nextProps);
        }
        if (nextProps.complainHandleFetch.status === 'success') { // 申诉处理
            setFetchStatus(STATE_NAME, 'complainHandleFetch', 'close');
            message.success('处理成功');
            this.queryComplainOrderList(nextProps);
            this.queryComplainTotal(nextProps);
            this.setState({complainModalVisible: false});
        } else if (nextProps.complainHandleFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'complainHandleFetch', 'close');
            message.error(nextProps.complainHandleFetch.response && nextProps.complainHandleFetch.response.Desc ? nextProps.complainHandleFetch.response.Desc : '处理失败');
        }


        if (nextProps.complainListExportFetch.status === 'success') { // 导出订单
            setFetchStatus(STATE_NAME, 'complainListExportFetch', 'close');
            let url = nextProps.complainListExportFetch.response.Data && nextProps.complainListExportFetch.response.Data.FileUrl;
            window.open(url);
        } else if (nextProps.complainListExportFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'complainListExportFetch', 'close');
            message.error(nextProps.complainListExportFetch.response && nextProps.complainListExportFetch.response.Desc ? nextProps.complainListExportFetch.response.Desc : '设置失败');
        }

        if (nextProps.common.getUserMobileNumberFetch.status === 'success') {
            setFetchStatus('state_business_common', 'getUserMobileNumberFetch', 'close');
            this.handleShowUserMobile(nextProps.common.UserMobile);
        } else if (nextProps.common.getUserMobileNumberFetch.status === 'error') {
            setFetchStatus('state_business_common', 'getUserMobileNumberFetch', 'close');
            this.handleShowUserMobile('获取手机号失败');
        }
    }

    handleShowUserMobile(UserMobile) {
        Modal.info({
            title: '会员手机号',
            content: UserMobile,
            onOk() {
                setParams('state_business_common', {UserMobile: undefined});
            }
        });
    }

    handleUserPhone(UserID) {
        getUserMobileNumber({UserIDs: [UserID]});
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let query = {
            AuditStatus: Number(props.AuditStatus),
            RecruitID: props.q_Recruit.value && props.q_Recruit.value.value ? Number(props.q_Recruit.value.value) : null,
            PositionName: props.q_Recruit.value && props.q_Recruit.value.text ? props.q_Recruit.value.text : null,

            LaborID: props.q_Labor.value && props.q_Labor.value.value ? Number(props.q_Labor.value.value) : null,
            ShortName: props.q_Labor.value && props.q_Labor.value.text ? props.q_Labor.value.text : null,

            CreateTime: props.q_CreateTime.value,
            OrderStep: props.q_OrderStep.value ? Number(props.q_OrderStep.value) : null,
            RealName: props.q_RealName.value
        };
        if (query.CreateTime && query.CreateTime instanceof Array) {
            query.CreateTimeBegin = query.CreateTime[0].format('YYYY-MM-DD');
            query.CreateTimeEnd = query.CreateTime[1].format('YYYY-MM-DD');
        }
        delete query.CreateTime;
        if (query.RecruitID) delete query.PositionName;
        if (query.LaborID) delete query.ShortName;

        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1])) delete query[data[0]];
        });
        return query;
    }

    // 查询申诉订单列表
    queryComplainOrderList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;

        let orderParam = {};
        if (props.orderParam && Object.keys(props.orderParam).length) {
            let orderKey = Object.keys(props.orderParam)[0];
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 1 : 2;
        }

        getComplainList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    // 查询申诉订单数量
    queryComplainTotal(props) {
        if (!props) props = this.props;
        let query = this.obtainQueryParam(props);
        delete query.AuditStatus;
        getComplainTotal(query);
    }

    handleComplainOrderFormReset = () => {
        // this.props.form.resetFields();
        resetQueryParams(STATE_NAME);
    };

    handleComplainOrderFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            setParams(STATE_NAME, {
                pageParam: {...this.props.pageParam, currentPage: 1}
            });
            this.queryComplainTotal();
        });
    };

    handleComplainOrderStatusClick = (e) => {
        e.preventDefault();
        setParams(STATE_NAME, {
            AuditStatus: Number(e.target.value),
            pageParam: {...this.props.pageParam, currentPage: 1}
        });
    };

    renderComplainOrderForm() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleComplainOrderFormSubmit}>
                <Row gutter={32} type="flex" justify="start">
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="申诉时间">
                            {getFieldDecorator('q_CreateTime')(<RangePicker/>)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员姓名">
                            {getFieldDecorator('q_RealName')(<Input placeholder="输入会员姓名"/>)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="企业">
                            {getFieldDecorator('q_Recruit', {initialValue: null})(
                                <AutoCompleteInput
                                    textKey="RecruitName" valueKey="RecruitTmpID"
                                    dataSource={this.props.common.RecruitSimpleList}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="劳务公司">
                            {getFieldDecorator('q_Labor')(
                                <AutoCompleteInput
                                    textKey="ShortName" valueKey="LaborID"
                                    dataSource={this.props.common.LaborSimpleList}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员状态">
                            {getFieldDecorator('q_OrderStep', {initialValue: '0'})(
                                <Select>
                                    <Option value="-9999">全部</Option>
                                    {Object.entries(OrderStep).filter(item => [23, 16, 24, 8, 9, 20].includes(Number(item[0]))).map((i) => {
                                        return <Option value={i[0].toString()} key={i[0]}>{i[1]}</Option>;
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col className="mb-24" span={23} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button className="ml-8" onClick={this.handleComplainOrderFormReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderAttendanceModal() {
        const checkinModalItem = this.state.checkinModalItem;
        return (
            <Modal
                width={700} title="会员考勤" className="checkin-modal"
                visible={this.state.checkinModalVisible}
                onOk={() => this.setState({checkinModalVisible: false})}
                onCancel={() => this.setState({checkinModalVisible: false})}
                afterClose={() => this.setState({checkinModalItem: {}})}>
                <div className="checkin-content">
                    <img alt="会员考勤" className="custom-image" src={checkinModalItem.CheckinPicPath}/>
                    <div>工厂：{checkinModalItem.EntShortName}</div>
                    <div>姓名：{checkinModalItem.RealName}</div>
                    <div>工号：{checkinModalItem.JobNum}</div>
                    <div>{`考勤日期：${checkinModalItem.CheckinStartDate}~${checkinModalItem.CheckinStopDate}`}</div>
                </div>
            </Modal>
        );
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>申诉订单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        {this.renderComplainOrderForm()}
                        <div className="mt-16">
                            <Button className="mr-16" type="primary" size="large"
                                    value={ComplainStatus.AUDIT_STATUS_ALL.value}
                                    ghost={this.props.AuditStatus !== ComplainStatus.AUDIT_STATUS_ALL.value}
                                    onClick={this.handleComplainOrderStatusClick}>全部({this.props.NoHandleCount + this.props.PassCount + this.props.RefuceCount})</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value={ComplainStatus.AUDIT_STATUS_WAIT.value}
                                    ghost={this.props.AuditStatus !== ComplainStatus.AUDIT_STATUS_WAIT.value}
                                    onClick={this.handleComplainOrderStatusClick}>待处理({this.props.NoHandleCount})</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value={ComplainStatus.AUDIT_STATUS_PASS.value}
                                    ghost={this.props.AuditStatus !== ComplainStatus.AUDIT_STATUS_PASS.value}
                                    onClick={this.handleComplainOrderStatusClick}>已通过({this.props.PassCount})</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value={ComplainStatus.AUDIT_STATUS_REFUSE.value}
                                    ghost={this.props.AuditStatus !== ComplainStatus.AUDIT_STATUS_REFUSE.value}
                                    onClick={this.handleComplainOrderStatusClick}>已驳回({this.props.RefuceCount})</Button>
                        </div>
                        <div style={{textAlign: 'right'}} className="mb-16">
                            <Button size="large" onClick={() => {
                                complainListExport(this.obtainQueryParam(this.props));
                            }}>导出订单</Button>
                        </div>
                        <Table
                            rowKey={'ComplainID'} bordered={true}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.pageParam.pageSize,
                                current: this.props.pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            columns={[{
                                title: '申诉时间',
                                dataIndex: 'CreateTime',
                                sorter: true,
                                key: 'OrderByCreateTime',
                                sortOrder: this.props.orderParam.OrderByCreateTime
                            }, {
                                title: '签到时间',
                                dataIndex: 'CheckInTime'
                            }, {
                                title: '会员姓名',
                                dataIndex: 'User',
                                width: 120,
                                render: text => (
                                    <div className="user-call">
                                        {text.RealName}
                                        <Icon type="phone" style={{
                                            display: text.UserID ? 'inline-block' : 'none'
                                        }} onClick={() => this.handleUserPhone(text.UserID)}/>
                                    </div>
                                )
                            }, {
                                title: '劳务公司',
                                dataIndex: 'ShortName'
                            }, {
                                title: '企业',
                                dataIndex: 'PositionName'
                            }, {
                                title: '会员状态',
                                dataIndex: 'OrderStep',
                                render: (text) => (OrderStep[text])
                            }, {
                                title: '会员考勤',
                                render: (text, record) => (
                                    record.OrderStep !== 8 || // 面试通过
                                    record.OrderStep !== 9 || // 面试失败
                                    record.OrderStep !== 20 ? // 面试放弃
                                        record.CountdownCheckinFlow && record.CountdownCheckinFlow.CheckinPicPath ?
                                            <a onClick={() => {
                                                this.setState({
                                                    checkinModalVisible: true,
                                                    checkinModalItem: {
                                                        ...record.WorkCardFlow,
                                                        ...record.User,
                                                        ...record.CountdownCheckinFlow,
                                                        EntShortName: record.EntShortName
                                                    }
                                                });
                                                getClient({bucket: oss.bucket_private}).then((client) => {
                                                    this.setState({
                                                        checkinModalItem: {
                                                            ...this.state.checkinModalItem,
                                                            CheckinPicPath: client.signatureUrl(record.CountdownCheckinFlow.CheckinPicPath)
                                                        }
                                                    });
                                                });
                                            }}>查看</a> : <span>无</span>
                                        : <span>-</span>)
                            }, {
                                title: '申诉状态',
                                dataIndex: 'AuditStatus',
                                render: (text) => ComplainStatusEnum[text]
                            }, {
                                title: '申诉理由',
                                dataIndex: 'ComplainType',
                                render: text => ComplainType[text]
                            }, {
                                title: '备注',
                                dataIndex: 'other7',
                                render: (text, record) => (record.AuditStatus === 2 || record.AuditStatus === 3) && (record.ComplainType === 1 || record.ComplainType === 4) ?
                                    `${record.SubsidyDays} 天，${record.SubsidyAmount / 100}元` : record.RefuseReason
                            }, {
                                title: '操作',
                                render: (text, record) => (
                                    record.AuditStatus === 1 ?
                                        <a onClick={() => {
                                            if (record.ComplainID && record.InterviewID) {
                                                this.setState({
                                                    complainModalVisible: true,
                                                    complainModalItem: {
                                                        ComplainID: record.ComplainID,
                                                        InterviewID: record.InterviewID,
                                                        ...record.User,
                                                        CheckInTime: record.CheckInTime,
                                                        ComplainType: record.ComplainType
                                                    }
                                                });
                                            } else {
                                                message.error('参数错误');
                                            }
                                        }}>申诉处理</a>
                                        : <span>-</span>
                                )
                            }]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                if (sorter.columnKey) change.orderParam = {[sorter.columnKey]: sorter.order};
                                setParams(STATE_NAME, change);
                            }}/>
                    </Card>
                    {this.renderAttendanceModal()}
                    <ComplainModal
                        {...this.state.complainModalItem}
                        complainModalComplainStatus={this.state.complainModalComplainStatus}
                        complainModalVisible={this.state.complainModalVisible}
                        onOk={() => this.setState({complainModalVisible: false})}
                        onCancel={() => this.setState({complainModalVisible: false})}
                        afterClose={() => this.setState({
                            complainModalItem: {},
                            complainModalComplainStatus: ComplainStatus.AUDIT_STATUS_PASS.value // 申诉处理dialog 申诉状态 2、审核通过 3、审核失败
                        })}
                        onRadioGroupChange={(e) => {
                            this.setState({complainModalComplainStatus: e.target.value});
                        }}
                        handleComplainModalSubmit={(fieldsValue) => {
                            let query = {
                                AuditStatus: this.state.complainModalComplainStatus,
                                ComplainID: this.state.complainModalItem.ComplainID,
                                InterviewID: this.state.complainModalItem.InterviewID
                            };
                            if (this.state.complainModalComplainStatus === ComplainStatus.AUDIT_STATUS_PASS.value) {
                                query['OrderStep'] = Number(fieldsValue.OrderStep);
                                if (fieldsValue.HireDate) query['HireDate'] = fieldsValue.HireDate.format('YYYY-MM-DD');
                                if (fieldsValue.LeaveDate) query['LeaveDate'] = fieldsValue.LeaveDate.format('YYYY-MM-DD');
                                complainHandle(query);
                            } else if (this.state.complainModalComplainStatus === ComplainStatus.AUDIT_STATUS_REFUSE.value) {
                                query['RefuseReason'] = fieldsValue.RefuseReason;
                                complainHandle(query);
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
}

const getFormProps = (props) => {
    let result = {};
    for (let key in props) {
        if (/^q\_\S+/.test(key)) {
            result[key] = props[key];
        }
    }
    return result;
};

export default Form.create({
    mapPropsToFields(props) {
        return getFormProps(props);
    },
    // onValuesChange(props, values) {
    //     setParams(STATE_NAME, values);
    // },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(ComplainOrder);