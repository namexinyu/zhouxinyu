import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Select,
    Table,
    Button,
    Input,
    message,
    Icon
} from 'antd';
import SetInterviewModal from './SetInterviewModal';
import HireSetModal from './HireSetModal';
import 'LESS/Business/OrderManage/user-call.less';
import {
    PromiseSettleDelay, PromiseSettleDelayEnum,
    LaborOrderSettleStatus, LaborOrderSettleStatusEnum
} from 'CONFIG/EnumerateLib/Mapping_Order';
import LaborOrderInfoAction from 'ACTION/Business/OrderManage/LaborOrderInfoAction';
import LaborAction from 'ACTION/Business/Labor/LaborAction';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import UserOrderAction from 'ACTION/Business/OrderManage/UserOrderAction';
import CommonAction from 'ACTION/Business/Common';
import setParams from 'ACTION/setParams';
import {
    JFFInterviewStatus
} from 'CONFIG/EnumerateLib/Mapping_Order';
import QueryParam from 'mams-com/lib/utils/base/QueryParam';
import {Modal} from "antd/lib/index";
import {Gender} from "CONFIG/EnumerateLib/Mapping_Recruit";

const {setInterview} = UserOrderAction;
const {getLaborPriceList} = LaborAction; // 劳务报价列表
const {
    getLaborOrderInfoList,
    laborOrderHireSet
} = LaborOrderInfoAction;
const {
    getUserMobileNumber
} = CommonAction;
const FormItem = Form.Item;
const {Option} = Select;
const STATE_NAME = 'state_business_labororder_info';


class LaborOrderInfo extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            modalItem: {},
            selectedRowKeys: [], // 设置面试选中
            setInterviewModalVisible: false,
            hireSetModalVisible: false
        };
    }

    componentWillMount() {
        this.RecruitID = QueryParam.getQueryParam(window.location.href, 'RecruitID');
        this.LaborID = QueryParam.getQueryParam(window.location.href, 'LaborID');
        this.CheckInTime = QueryParam.getQueryParam(window.location.href, 'CheckInTime');
        this.LaborUserOrderTotalID = QueryParam.getQueryParam(window.location.href, 'LaborUserOrderTotalID');

        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.queryLaborOrderInfoList();
            getLaborPriceList({
                QueryParams: [{
                    Key: 'LaborID',
                    Value: Number(this.LaborID)
                }, {
                    Key: 'RecruitID',
                    Value: Number(this.RecruitID)
                }, {
                    Key: 'StartDate',
                    Value: this.CheckInTime
                }, {
                    Key: 'EndDate',
                    Value: this.CheckInTime
                }],
                RecordIndex: 0,
                RecordSize: 999
            }); // 查询劳务报价
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.setInterviewFetch.status === 'success') { // 设置面试
            setFetchStatus(STATE_NAME, 'setInterviewFetch', 'close');
            let RecordList = nextProps.setInterviewFetch.response.Data.RecordList; // 设置结果
            let info = '设置成功';
            if (RecordList && RecordList instanceof Array) {
                let successCount = 0;
                let failureCount = 0;
                for (let data of RecordList) {
                    if (data.Result && data.Result === 1) successCount++;
                    if (data.Result && data.Result === 2) failureCount++;
                }
                info = `${successCount}个订单设置成功，${failureCount}个订单设置失败`;
            }
            message.success(info);
            this.setState({
                setInterviewModalVisible: false,
                selectedRowKeys: []
            });
            this.queryLaborOrderInfoList();
        } else if (nextProps.setInterviewFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setInterviewFetch', 'close');
            message.error(nextProps.setInterviewFetch.response && nextProps.setInterviewFetch.response.Desc ? nextProps.setInterviewFetch.response.Desc : '设置失败');
        }

        if (nextProps.laborOrderHireSetFetch.status === 'success') { // 手工结算
            setFetchStatus(STATE_NAME, 'laborOrderHireSetFetch', 'close');
            message.success('处理成功');
            this.queryLaborOrderInfoList(nextProps);
            this.setState({hireSetModalVisible: false});
        } else if (nextProps.laborOrderHireSetFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'laborOrderHireSetFetch', 'close');
            message.error(nextProps.laborOrderHireSetFetch.response && nextProps.laborOrderHireSetFetch.response.Desc ? nextProps.laborOrderHireSetFetch.response.Desc : '处理失败');
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
            Gender: props.q_Gender.value ? Number(props.q_Gender.value) : null,
            JFFInterviewStatus: props.q_JFFInterviewStatus.value ? Number(props.q_JFFInterviewStatus.value) : null,
            RealName: props.q_RealName.value,
            SettleStatus: props.q_SettleStatus.value ? Number(props.q_SettleStatus.value) : null
        };
        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1])) delete query[data[0]];
        });
        return query;
    }

    // 查询劳务会员订单列表
    queryLaborOrderInfoList(props) {
        if (!props) props = this.props;
        getLaborOrderInfoList({
            LaborUserOrderTotalID: Number(this.LaborUserOrderTotalID),
            ...this.obtainQueryParam(props)
        });
    }

    handleLaborOrderInfoFormReset = () => {
        resetQueryParams(STATE_NAME);
    };

    handleLaborOrderInfoFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.setState({selectedRowKeys: []});
            this.queryLaborOrderInfoList();
        });
    };

    renderLaborOrderInfoForm() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleLaborOrderInfoFormSubmit}>
                <Row type="flex" justify="start">
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员姓名">
                            {getFieldDecorator('q_RealName')(
                                <Input placeholder="请输入会员姓名"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="性别">
                            {getFieldDecorator('q_Gender', {initialValue: '-9999'})(
                                <Select>
                                    <Option value="-9999">全部</Option>
                                    <Option value="1">男</Option>
                                    <Option value="2">女</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员状态">
                            {getFieldDecorator('q_JFFInterviewStatus')(
                                <Select>
                                    <Option value='-9999'>全部</Option>
                                    {Object.entries(JFFInterviewStatus).map((i) => {
                                        return <Option value={i[0].toString()} key={i[0]}>{i[1]}</Option>;
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="结算状态">
                            {getFieldDecorator('q_SettleStatus')(
                                <Select>
                                    <Option value="-9999">全部</Option>
                                    <Option value="1">待结算</Option>
                                    <Option value="2">已结算</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col className="mb-24" span={23} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button className="ml-8" onClick={this.handleLaborOrderInfoFormReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>劳务订单详情</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        {this.renderLaborOrderInfoForm()}
                        {/*          <div className="mb-16">
                            <Button
                                type="primary" size="large"
                                onClick={() => this.setState({setInterviewModalVisible: true})}
                                disabled={!(this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0)}>
                                设置面试
                            </Button>
                        </div>*/}
                        <Table
                            rowKey={'UserOrderID'} bordered={true} pagination={false}
                            columns={this.columns} dataSource={this.props.RecordList}
                            loading={this.props.RecordListLoading}
                            rowSelection={{
                                onChange: (selectedRowKeys, selectedRows) => {
                                    this.setState({selectedRowKeys: selectedRowKeys});
                                },
                                selectedRowKeys: this.state.selectedRowKeys
                            }}
                            onChange={(pagination, filters, sorter) => {
                            }}/>
                    </Card>

                    <Card bordered={false} title="劳务报价" className="mt-24">
                        <Table
                            rowKey={'UserOrderID'} showHeader={true} bordered={true} pagination={false}
                            columns={[{
                                title: '时间',
                                dataIndex: 'CreateDate'
                            }, {
                                title: '企业名称',
                                dataIndex: 'RecruitName'
                            }, {
                                title: '返费',
                                dataIndex: 'SubsidyList',
                                render: (text, record) => text && text.map(item =>
                                    <div key={item.LaborOrderSubsidyID}>
                                        {Gender[item.Gender]}:
                                        {item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                    </div>
                                )
                            }, {
                                title: '业务员',
                                dataIndex: 'Sale'
                            }]}
                            dataSource={this.props.LaborOrderList} loading={this.props.LaborOrderListLoading}/>
                    </Card>

                    <SetInterviewModal
                        setInterviewModalVisible={this.state.setInterviewModalVisible}
                        onCancel={() => this.setState({setInterviewModalVisible: false})}
                        handleSetInterviewModalSubmit={(fieldsValue) => {
                            if (!(this.state.selectedRowKeys && fieldsValue.OrderStep)) return;
                            setInterview({
                                UserOrderIDs: this.state.selectedRowKeys,
                                OrderStep: Number(fieldsValue.OrderStep),
                                Reason: fieldsValue.Reason
                            });
                        }}
                    />
                    <HireSetModal
                        {...this.state.modalItem}
                        hireSetModalVisible={this.state.hireSetModalVisible}
                        onCancel={() => this.setState({hireSetModalVisible: false})}
                        afterClose={() => this.setState({
                            modalItem: {}
                        })}
                        handleHireSetModalSubmit={(fieldsValue) => {
                            if (!(this.state.modalItem && this.state.modalItem.InterviewID)) return;
                            let query = {
                                InterviewID: this.state.modalItem.InterviewID,
                                LaborSubsidyAmountReal: Number(fieldsValue.LaborSubsidyAmountReal * 100),
                                LeaveDate: fieldsValue.LeaveDate ? fieldsValue.LeaveDate.format('YYYY-MM-DD') : null,
                                HireDate: fieldsValue.HireDate ? fieldsValue.HireDate.format('YYYY-MM-DD') : null,
                                OrderStep: Number(fieldsValue.OrderStep)
                            };
                            if (!query.LeaveDate) delete query.LeaveDate;
                            laborOrderHireSet(query);
                        }}
                    />

                </div>
            </div>
        );
    }

    columns = [{
        title: '会员姓名',
        dataIndex: 'RealName',
        width: 120,
        render: (text, record) => (
            <div className="user-call">
                {text}
                <Icon type="phone" style={{
                    display: record.UserID ? 'inline-block' : 'none'
                }} onClick={() => this.handleUserPhone(record.UserID)}/>
            </div>
        )
    }, {
        title: '性别',
        dataIndex: 'Gender',
        render: text => text === 1 ? '男' : text === 2 ? '女' : '未指定'
    }, {
        title: '身份证号',
        dataIndex: 'IDCardNum'
    }, {
        title: '入职时间',
        dataIndex: 'HireDate'
    }, {
        title: '离职时间',
        dataIndex: 'LeaveDate'
    }, {
        title: '入职天数',
        dataIndex: 'HireDay'
    }, {
        title: '返费金额',
        dataIndex: 'Pay',
        render: text => text && Number.isInteger(text) ? text / 100 : ''
    }, {
        title: '会员状态',
        dataIndex: 'JFFInterviewStatus',
        render: text => JFFInterviewStatus[text]
    }, {
        title: '结算日期',
        dataIndex: 'ModifyTime'
    }, {
        title: '结算状态',
        dataIndex: 'SettleStatus',
        render: text => text === 1 ? '待结算' : text === 2 ? '已结算' : ''
    }, {
        title: '劳务参考',
        dataIndex: 'LaborSubsidyAmountReal',
        render: text => text && Number.isInteger(text) ? text / 100 : ''
    }, {
        title: '财务审核',
        dataIndex: 'FinanceSettleStatus',
        render: text => text === 1 ? '待结算' : text === 2 ? '已结算' : text === 3 ? '拒绝' : ''
    }, {
        title: '财务备注',
        dataIndex: 'FinanceReason'
    } /* , {
        title: '操作',
        render: (text, record) => (
            <a onClick={() => this.setState({hireSetModalVisible: true, modalItem: record})}>手工结算</a>
        )
    }*/];
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
})(LaborOrderInfo);