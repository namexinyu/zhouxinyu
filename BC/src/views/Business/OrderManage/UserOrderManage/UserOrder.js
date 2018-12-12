import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Table,
    Button,
    DatePicker,
    Modal,
    Icon,
    message,
    Popconfirm
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import setParams from 'ACTION/setParams';
import {
    JFFInterviewStatus
} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import UserOrderAction from 'ACTION/Business/OrderManage/UserOrderAction';
import SetLaborModal from './SetLaborModal';
import CommonAction from 'ACTION/Business/Common';
import setFetchStatus from 'ACTION/setFetchStatus';
import 'LESS/Business/OrderManage/user-call.less';
import createPureComponent from 'UTIL/createPureComponent';
import resetState from 'ACTION/resetState';

const {
    getOrderList,
    exportOrderList,
    setInterview
} = UserOrderAction;
const {
    getRecruitSimpleList,
    getLaborBossSimpleList,
    getLaborSimpleList,
    getUserMobileNumber
} = CommonAction;
const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_business_userorder';
const STATE_NAME_SET_LABOR = 'state_business_userorder_setlabor_modal';


const SearchForm = Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => setParams(STATE_NAME, {queryParams: {...props.queryParams, ...fields}})
})(createPureComponent(({handleFormSubmit, handleFormReset, form, common}) => {
    const {getFieldDecorator} = form;

    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            form.validateFields((err, fieldsValue) => {
                console.log(err, fieldsValue);
                if (err) return;
                handleFormSubmit(fieldsValue);
            });
        }}>
            <Row gutter={32} type="flex" justify="start">
                <Col span={8}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="签到日期">
                        {getFieldDecorator('InterviewTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="劳务公司">
                        {getFieldDecorator('Labor')(
                            <AutoCompleteInput
                                textKey="ShortName" valueKey="LaborID"
                                dataSource={common.LaborSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="企业">
                        {getFieldDecorator('Recruit')(
                            <AutoCompleteInput
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={common.RecruitSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员姓名">
                        {getFieldDecorator('RealName')(<Input placeholder="输入会员姓名"/>)}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员状态">
                        {getFieldDecorator('JFFInterviewStatus')(
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
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="周薪薪">
                        {getFieldDecorator('PayType')(
                            <Select>
                                <Option value="-9999">全部</Option>
                                <Option value="1">是</Option>
                                <Option value="0">否</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="结算状态">
                        {getFieldDecorator('SettleStatus', {initialValue: '-9999'})(
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
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
}));

/**
 * 会员订单页面
 */
class UserOrder extends React.PureComponent {
    componentWillMount() {
        if (this.props.location.query && this.props.location.query.JFFInterviewStatus) {
            setParams(STATE_NAME, {
                queryParams: {
                    ...this.props.queryParams,
                    JFFInterviewStatus: {
                        value: this.props.location.query.JFFInterviewStatus
                    }
                }
            });
        }
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getRecruitSimpleList(); // 企业模糊下拉数据
            getLaborBossSimpleList(); // 大老板模糊下拉数据
            getLaborSimpleList(); // 劳务公司模糊下拉数据
            this.queryUserOrderList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryUserOrderList(nextProps);
        }
        if (nextProps.setLaborModal.setOrderLaborFetch.status === 'success') { // 设置大佬
            setFetchStatus(STATE_NAME_SET_LABOR, 'setOrderLaborFetch', 'close');
            message.success('设置成功');
            resetState(STATE_NAME_SET_LABOR);
            this.queryUserOrderList(nextProps);
        } else if (nextProps.setLaborModal.setOrderLaborFetch.status === 'error') {
            setFetchStatus(STATE_NAME_SET_LABOR, 'setOrderLaborFetch', 'close');
            message.error(nextProps.setLaborModal.setOrderLaborFetch.response && nextProps.setLaborModal.setOrderLaborFetch.response.Desc ?
                nextProps.setLaborModal.setOrderLaborFetch.response.Desc : '设置失败');
        }

        if (nextProps.setInterviewFetch.status === 'success') { // 设置未面试
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
            message.info(info);
            setParams(STATE_NAME, {popConfirmVisible: false, selectedRowKeys: []});
            this.queryUserOrderList();
        } else if (nextProps.setInterviewFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setInterviewFetch', 'close');
            message.error(nextProps.setInterviewFetch.response && nextProps.setInterviewFetch.response.Desc ? nextProps.setInterviewFetch.response.Desc : '设置失败');
            setParams(STATE_NAME, {popConfirmVisible: false});
        }

        if (nextProps.exportOrderListFetch.status === 'success') { // 导出订单
            setFetchStatus(STATE_NAME, 'exportOrderListFetch', 'close');
            let url = nextProps.exportOrderListFetch.response.Data && nextProps.exportOrderListFetch.response.Data.FileUrl;
            window.open(url);
        } else if (nextProps.exportOrderListFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'exportOrderListFetch', 'close');
            message.error(nextProps.exportOrderListFetch.response && nextProps.exportOrderListFetch.response.Desc ? nextProps.exportOrderListFetch.response.Desc : '设置失败');
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

    handleTableRowSelection(selectedRowKeys, selectedRows) {
        setParams(STATE_NAME, {selectedRowKeys});
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let query = {
            RecruitID: props.queryParams.Recruit.value && props.queryParams.Recruit.value.value ? Number(props.queryParams.Recruit.value.value) : null,
            PositionName: props.queryParams.Recruit.value && props.queryParams.Recruit.value.text ? props.queryParams.Recruit.value.text : null,

            LaborID: props.queryParams.Labor.value && props.queryParams.Labor.value.value ? Number(props.queryParams.Labor.value.value) : null,
            ShortName: props.queryParams.Labor.value && props.queryParams.Labor.value.text ? props.queryParams.Labor.value.text : null,


            InterviewTime: props.queryParams.InterviewTime.value,
            JFFInterviewStatus: props.queryParams.JFFInterviewStatus.value ? Number(props.queryParams.JFFInterviewStatus.value) : null,
            PayType: props.queryParams.PayType.value ? Number(props.queryParams.PayType.value) : null,
            RealName: props.queryParams.RealName.value,
            SettleStatus: props.queryParams.SettleStatus.value ? Number(props.queryParams.SettleStatus.value) : null
        };
        if (query.InterviewTime && query.InterviewTime instanceof Array) {
            query.InterviewTimeBegin = query.InterviewTime[0] ? query.InterviewTime[0].format('YYYY-MM-DD') : null;
            query.InterviewTimeEnd = query.InterviewTime[1] ? query.InterviewTime[1].format('YYYY-MM-DD') : null;
        }
        delete query.InterviewTime;
        if (query.RecruitID) delete query.PositionName;
        if (query.LaborID) delete query.ShortName;

        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1])) delete query[data[0]];
        });
        return query;
    }

    // 获取会员订单
    queryUserOrderList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;

        let orderParam = {};
        if (props.orderParam && Object.keys(props.orderParam).length) {
            let orderKey = Object.keys(props.orderParam)[0];
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 1 : 2;
        }

        getOrderList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => {
        resetQueryParams(STATE_NAME);
    };

    handleFormSubmit(fieldsValue) {
        setParams(STATE_NAME, {
            selectedRowKeys: [],
            pageParam: {...this.props.pageParam, currentPage: 1}
        });
    }

    handleSetLabor(record) {
        record.UserOrderID &&
        setParams(STATE_NAME_SET_LABOR, {Visible: true, recordUserOrderID: record.UserOrderID});
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>会员订单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <SetLaborModal {...this.props.setLaborModal} common={this.props.common}/>
                    <Card bordered={false}>
                        <SearchForm
                            common={this.props.common}
                            queryParams={this.props.queryParams}
                            handleFormSubmit={this.handleFormSubmit.bind(this)}
                            handleFormReset={this.handleFormReset}/>
                        <div className="mb-16" style={{display: 'flex', justifyContent: 'space-between'}}>
                            {/*                    <Popconfirm
                                title="确定设置未面试?"
                                visible={this.props.popConfirmVisible}
                                onConfirm={() => {
                                    setInterview({UserOrderIDs: this.props.selectedRowKeys, OrderStep: 12}); // todo 批量设置未面试
                                }}
                                onCancel={() => setParams(STATE_NAME, {popConfirmVisible: false})}
                                okText="确定"
                                cancelText="取消">
                                <Button
                                    type="primary" size="large"
                                    onClick={() => setParams(STATE_NAME, {popConfirmVisible: true})}
                                    disabled={!(this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0)}>
                                    设置未面试</Button>
                            </Popconfirm>
*/}
                            <span>
                            </span>

                            <span>
                                <Button size="large" onClick={() => {
                                    exportOrderList(this.obtainQueryParam(this.props));
                                }}>导出订单</Button>
                                </span>
                        </div>
                        <Table
                            rowKey={'UserOrderID'} bordered={true}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.pageParam.pageSize,
                                current: this.props.pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            rowSelection={{
                                onChange: this.handleTableRowSelection,
                                selectedRowKeys: this.props.selectedRowKeys
                            }}
                            columns={[
                                {
                                    title: '序号', dataIndex: 'SequenceNumber'
                                }, {
                                    title: '签到时间', dataIndex: 'CheckInTime',
                                    sorter: true, key: 'OrderByCheckInTime',
                                    sortOrder: this.props.orderParam.OrderByCheckInTime
                                },
                                {
                                    title: '会员姓名',
                                    dataIndex: 'RealName',
                                    width: 120,
                                    render: (text, record) => (
                                        <div className="user-call">
                                            {text}
                                            <Icon type="phone"
                                                  style={{display: record.UserID ? 'inline-block' : 'none'}}
                                                  onClick={() => this.handleUserPhone(record.UserID)}/>
                                        </div>
                                    )
                                },
                                {title: '身份证号', dataIndex: 'IDCardNum'},
                                {title: '劳务公司', dataIndex: 'ShortName'},
                                {title: '企业', dataIndex: 'PositionName'},
                                {
                                    title: '周薪薪', dataIndex: 'PayType',
                                    render: text => (text === 1 ? '是' : '否')
                                },
                                {title: '经纪人', dataIndex: 'BrokerAccount'},
                                {
                                    title: '会员状态', dataIndex: 'JFFInterviewStatus',
                                    render: text => JFFInterviewStatus[text]
                                },
                                {
                                    title: '交易状态', dataIndex: 'SettleStatus',
                                    render: text => text === 1 ? '待结算' : text === 2 ? '已结算' : ''
                                }
         /*                       ,
                                /!* {
                                     title: '集散回访', dataIndex: 'BizInterviewStatus',
                                     render: text => text === 2 ? '未去面试' : '-'
                                 },*!/
                                {title: '备注', dataIndex: 'Reason'},
                                {
                                    title: '操作',
                                    render: (text, record) => (
                                        <a onClick={() => this.handleSetLabor(record)}>设置劳务</a>
                                    )
                                }*/
                                ]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                if (sorter.columnKey) change.orderParam = {[sorter.columnKey]: sorter.order};
                                setParams(STATE_NAME, change);
                            }}/>
                    </Card>
                </div>
            </div>
        );
    }
}

export default UserOrder;