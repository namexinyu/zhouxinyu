import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Table,
    Button,
    DatePicker,
    Alert,
    Select,
    message
} from 'antd';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import FeeAction from 'ACTION/Finance/TradeManage/FeeAction';
import {exportInterviewFee} from 'SERVICE/Finance/TradeManage/FeeService';
import {InvoiceStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import CommonAction from 'ACTION/Finance/Common';

const {TextArea} = Input;
const {interviewFeeList} = FeeAction;
const {getHubList} = CommonAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_fee_detail';

const SearchForm = Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => props.setParams('queryParams', fields)
})(({handleFormSubmit, handleFormReset, form, common}) => {
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 16}};

    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            form.validateFields((err, fieldsValue) => {
                console.log(err, fieldsValue);
                if (err) return;
                handleFormSubmit(fieldsValue);
            });
        }}>
            <Row type="flex" justify="space-between">
                <Col span={6}>
                    <FormItem {...formItemLayout} label="签到日期">
                        {getFieldDecorator('CheckInTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="会员姓名">
                        {getFieldDecorator('RealName')(
                            <Input placeholder="请输入姓名"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="手机号码">
                        {getFieldDecorator('Mobile')(
                            <Input placeholder="请输入手机号码"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="收费体验中心">
                        {getFieldDecorator('ChargeHub')(
                            <AutoCompleteInput
                                textKey="HubName" valueKey="HubID"
                                dataSource={common.HubList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="退费体验中心">
                        {getFieldDecorator('RefundHub')(
                            <AutoCompleteInput
                                textKey="HubName" valueKey="HubID"
                                dataSource={common.HubList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="退费日期">
                        {getFieldDecorator('RefundTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>

                <Col span={4} offset={8} style={{display: 'inline-flex', justifyContent: 'space-around'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
});

export default class FeeDetail extends React.PureComponent {
    setParams = (field, state) => {
        if (typeof field === 'object') {
            setParams(STATE_NAME, field);
        } else {
            let s = state;
            if (typeof state === 'object') s = {...this.props[field], ...state};
            setParams(STATE_NAME, {[field]: s});
        }
    };

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.queryTableList();
            getHubList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = [];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v || '';
            }
            return pre;
        }, {});
        if (query.CheckInTime && query.CheckInTime instanceof Array) {
            query.CheckInTimeBegin = query.CheckInTime[0] ? query.CheckInTime[0].format('YYYY-MM-DD') : null;
            query.CheckInTimeEnd = query.CheckInTime[1] ? query.CheckInTime[1].format('YYYY-MM-DD') : null;
            delete query.CheckInTime;
        }
        if (query.RefundTime && query.RefundTime instanceof Array) {
            query.RefundTimeBegin = query.RefundTime[0] ? query.RefundTime[0].format('YYYY-MM-DD') : null;
            query.RefundTimeEnd = query.RefundTime[1] ? query.RefundTime[1].format('YYYY-MM-DD') : null;
            delete query.RefundTime;
        }

        if (query.ChargeHub) {
            query.ChargeHubName = query.ChargeHub.text;
            query.ChargeHubID = query.ChargeHub.data ? query.ChargeHub.data.HubID : null;
            if (query.ChargeHubID) delete query.ChargeHubName;
            delete query.ChargeHub;
        }

        if (query.RefundHub) {
            query.RefundHubName = query.RefundHub.text;
            query.RefundHubID = query.RefundHub.data ? query.RefundHub.data.HubID : null;
            if (query.RefundHubID) delete query.RefundHubName;
            delete query.RefundHub;
        }

        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1]) || Number.isNaN(data[1])) delete query[data[0]];
        });
        return query;
    }

    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        let orderParam = {};
        if (props.orderParam && Object.keys(props.orderParam).length) {
            let orderKey = Object.keys(props.orderParam)[0];
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 1 : 2;
        }
        interviewFeeList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleTableOperate = (e) => {
        e.persist();
        switch (e.target.name) {
            case 'export':
                exportInterviewFee(this.obtainQueryParam(this.props), ({res, err}) => {
                    if (res && res.FileUrl) {
                        window.open(res.FileUrl);
                        message.success('导出成功');
                    } else {
                        message.error(err ? err : '导出失败');
                    }
                });
                break;
        }
    };

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    render() {
        const setParams = this.setParams;

        const {RecordCount, RecordList, RecordSum, common, RecordListLoading, queryParams, pageParam, orderParam} = this.props;
        return (
            <div className="container-fluid pt-24 pb-24">
                <Card bordered={false}>
                    <SearchForm
                        queryParams={queryParams} setParams={setParams}
                        common={common}
                        handleFormSubmit={this.handleFormSubmit}
                        handleFormReset={this.handleFormReset}/>
                    <Row className="mb-16">
                        <Col>
                            <Button size="large" className="mr-16" name='export'
                                    onClick={this.handleTableOperate}>导出数据</Button>
                        </Col>
                    </Row>

                    <Row>
                        <Alert
                            type="info" showIcon className="mb-16"
                            message={(
                                <p style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                                    <span> {`收费金额总计：${(RecordSum.ChargeAmount || 0) / 100} 元，退费金额总计：${(RecordSum.RefundAmount || 0) / 100} 元`}</span>
                                </p>
                            )}/>
                    </Row>
                    <Table
                        bordered={true} size='small' scroll={{x: 2000}} rowKey='InterviewFeeID'
                        /*    rowSelection={{
                                onChange: this.handleTableRowSelection,
                                selectedRowKeys: this.props.selectedRowKeys,
                                getCheckboxProps: record => ({
                                    disabled: !record.OneCentTestID || (record.AuditStatus !== 1 && record.AuditStatus !== 2)
                                })
                            }}*/
                        pagination={{
                            total: RecordCount,
                            pageSize: pageParam.pageSize,
                            current: pageParam.currentPage,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSizeOptions: ['10', '50', '100', '200'],
                            showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                        }}
                        columns={[
                            {
                                title: '签到时间', dataIndex: 'CreateTime', width: 140, fixed: 'left',
                                sorter: true, key: 'OrderByCheckInTime',
                                sortOrder: orderParam.OrderByCheckInTime
                            },
                            {title: '会员姓名', dataIndex: 'RealName', width: 110, fixed: 'left'},
                            {title: '手机号码', dataIndex: 'Mobile'},
                            {title: '企业', dataIndex: 'PositionName'},
                            {title: '收费体验中心', dataIndex: 'ChargeHubName'},
                            {title: '收费人', dataIndex: 'ChargeLoginName'},
                            {title: '收费金额', dataIndex: 'ChargeAmountStr'},
                            {title: '收费方式', dataIndex: 'PayUserTypeStr'},
                            {title: '退费体验中心', dataIndex: 'RefundHubName'},
                            {title: '退费人', dataIndex: 'RefundLoginName'},
                            {title: '退费金额', dataIndex: 'RefundAmountStr'},
                            {title: '退费方式', dataIndex: 'PayTypeRefundStr'},
                            {
                                title: '退费时间', dataIndex: 'RefundTime',
                                sorter: true, key: 'OrderByRefundTime',
                                sortOrder: orderParam.OrderByRefundTime
                            }
                        ]}
                        dataSource={RecordList} loading={RecordListLoading}
                        onChange={(pagination, filters, sorter) => {
                            let currentPage = pagination.current < 1 ? 1 : pagination.current;
                            let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                            if (sorter.columnKey) {
                                change.orderParam = {[sorter.columnKey]: sorter.order};
                            }
                            setParams(change);
                        }}/>
                </Card>
            </div>
        );
    }
}