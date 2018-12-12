import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Table,
    Button,
    Radio,
    DatePicker,
    Alert,
    Select,
    Modal,
    message
} from 'antd';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import FeeAction from 'ACTION/Finance/TradeManage/FeeAction';
import {interviewFeeAudit} from 'SERVICE/Finance/TradeManage/FeeService';
import {InvoiceStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import CommonAction from 'ACTION/Finance/Common';

const {getHubList} = CommonAction;
const {TextArea} = Input;
const {feeTotalBillList} = FeeAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_fee_bill';

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
                    <FormItem {...formItemLayout} label="交账日期">
                        {getFieldDecorator('BillDay')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="体验中心">
                        {getFieldDecorator('Hub')(
                            <AutoCompleteInput
                                textKey="HubName" valueKey="HubID"
                                dataSource={common.HubList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="审核日期">
                        {getFieldDecorator('FinanceAudit')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={4} offset={2} style={{display: 'inline-flex', justifyContent: 'space-around'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
});

export default class FeeBill extends React.PureComponent {
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
        if (query.BillDay && query.BillDay instanceof Array) {
            query.BillDayBegin = query.BillDay[0] ? query.BillDay[0].format('YYYY-MM-DD') : null;
            query.BillDayEnd = query.BillDay[1] ? query.BillDay[1].format('YYYY-MM-DD') : null;
            delete query.BillDay;
        }
        if (query.FinanceAudit && query.FinanceAudit instanceof Array) {
            query.FinanceAuditBegin = query.FinanceAudit[0] ? query.FinanceAudit[0].format('YYYY-MM-DD') : null;
            query.FinanceAuditEnd = query.FinanceAudit[1] ? query.FinanceAudit[1].format('YYYY-MM-DD') : null;
            delete query.FinanceAudit;
        }

        if (query.Hub) {
            query.HubName = query.Hub.text;
            query.HubID = query.Hub.data ? query.Hub.data.HubID : null;
            if (query.HubID) delete query.HubName;
            delete query.Hub;
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
        feeTotalBillList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        setParams(STATE_NAME, {
            selectedRowKeys, selectedRowSum: selectedRows.reduce((pre, cur) => {
                pre.Amount += cur.Amount;
                pre.AmountReal += cur.AmountReal;
                pre.RefundAmount += cur.RefundAmount;
                pre.RefundAmountReal += cur.RefundAmountReal;
                return pre;
            }, {Amount: 0, AmountReal: 0, RefundAmount: 0, RefundAmountReal: 0})
        });
    };

    handleTableOperate = (e) => {
        e.persist();
        switch (e.target.name) {
            case 'FeeAudit':
                this.setState(preState => ({
                    [e.target.name + 'Modal']: {...preState[e.target.name + 'Modal'], Visible: true}
                }));
                break;
        }
    };

    handleModalOperate = (modalName, operate, event) => {
        if (operate === 'Ok') {
            switch (modalName) {
                case 'FeeAuditModal':
                    let FinanceAuditStatus = Number(this.state[modalName].FinanceAuditStatus);
                    if (FinanceAuditStatus !== 2 && FinanceAuditStatus !== 3) {
                        message.error('请选择审核结果');
                        return;
                    }
                    this.setState(preState => ({
                        [modalName]: {...preState[modalName], ConfirmLoading: true}
                    }));
                    interviewFeeAudit({
                        TaskList: this.props.selectedRowKeys.map(item => ({InterviewFeeTotalBillID: item})),
                        FinanceAuditReason: this.state[modalName].FinanceAuditReason || '',
                        FinanceAuditStatus
                    }, ({res, err}) => {
                        if (err) {
                            message.error(err ? err : '操作失败');
                            this.setState(preState => ({
                                [modalName]: {...preState[modalName], ConfirmLoading: false}
                            }));
                        } else {
                            message.success('操作成功');
                            this.queryTableList();
                            this.handleModalOperate(modalName, 'Cancel');
                        }
                    });
                    break;
            }
        }

        if (operate === 'Cancel') {
            this.setState({[modalName]: {}});
        }

        if (operate === 'Input') {
            event.persist();
            this.setState(preState => ({
                [modalName]: {...preState[modalName], [event.target.name]: event.target.value}
            }));
        }
        if (operate === 'Change') {
            this.setState(preState => ({
                [modalName]: {...preState[modalName], [event.target.name]: event.target.value}
            }));
        }
    };

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});
    state = {FeeAuditModal: {}};

    render() {
        const setParams = this.setParams;
        const {FeeAuditModal} = this.state;
        const {RecordCount, RecordList, selectedRowSum, selectedRowKeys, RecordListLoading, queryParams, pageParam, orderParam} = this.props;
        return (
            <div className="container-fluid pt-24 pb-24">
                <Card bordered={false}>

                    <Modal title="补贴审核" visible={FeeAuditModal.Visible}
                           maskClosable={false}
                           onCancel={() => this.handleModalOperate('FeeAuditModal', 'Cancel')}
                           onOk={() => this.handleModalOperate('FeeAuditModal', 'Ok')}
                           confirmLoading={FeeAuditModal.ConfirmLoading}>

                        <div style={{display: 'flex'}}>
                            <label style={{flex: '0 1 80px', textAlign: 'right', alignSelf: 'center'}}>审核结果：</label>
                            <Radio.Group name='FinanceAuditStatus'
                                         value={FeeAuditModal.FinanceAuditStatus || '0'}
                                         onChange={(e) => this.handleModalOperate('FeeAuditModal', 'Change', e)}>
                                <Radio value='2'>通过</Radio>
                                <Radio value='3'>拒绝</Radio>
                            </Radio.Group>
                        </div>
                        <div style={{display: FeeAuditModal.FinanceAuditStatus == 3 ? 'flex' : 'none', marginTop: 8}}>
                            <label style={{flex: '0 1 80px', textAlign: 'right'}}>备注：</label>
                            <TextArea style={{width: '50%'}} placeholder="输入备注"
                                      value={FeeAuditModal.FinanceAuditReason} name='FinanceAuditReason'
                                      onChange={(e) => this.handleModalOperate('FeeAuditModal', 'Input', e)}/>
                        </div>
                    </Modal>

                    <SearchForm
                        queryParams={queryParams} setParams={setParams}
                        common={this.props.common}
                        handleFormSubmit={this.handleFormSubmit}
                        handleFormReset={this.handleFormReset}/>
                    <Row className="mb-16">
                        <Col>
                            <Button size="large" className="mr-16" name='FeeAudit' type="primary"
                                    disabled={!(this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0)}
                                    onClick={this.handleTableOperate}>交账审核</Button>
                        </Col>
                    </Row>

                    <Row>
                        <Alert
                            type="info" showIcon className="mb-16"
                            message={(
                                <p>已选择&nbsp;&nbsp;<a
                                    style={{fontWeight: 600}}>{selectedRowSum.count || 0}</a> 项&nbsp;&nbsp;
                                    应收 <span
                                        style={{fontWeight: 600}}>{(selectedRowSum.Amount || 0) / 100}</span> 元&nbsp;&nbsp;
                                    实收 <span
                                        style={{fontWeight: 600}}>{(selectedRowSum.AmountReal || 0) / 100}</span> 元&nbsp;&nbsp;
                                    应付 <span
                                        style={{fontWeight: 600}}>{(selectedRowSum.RefundAmount || 0) / 100}</span> 元&nbsp;&nbsp;
                                    实付 <span
                                        style={{fontWeight: 600}}>{(selectedRowSum.RefundAmountReal || 0) / 100}</span> 元
                                    <a onClick={() => setParams({
                                        selectedRowKeys: [], selectedRowSum: {}
                                    })}
                                       style={{marginLeft: 24}}>清空</a>
                                </p>
                            )}/>
                    </Row>
                    <Table
                        bordered={true} size='small' scroll={{x: 2500}} rowKey='InterviewFeeTotalBillID'
                        rowSelection={{
                            onChange: this.handleTableRowSelection,
                            selectedRowKeys: selectedRowKeys,
                            getCheckboxProps: record => ({
                                disabled: !record.InterviewFeeTotalBillID || record.FinanceAuditStatus !== 1
                            })
                        }}
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
                            {title: '序号', dataIndex: 'rowKey', width: 60, fixed: 'left'},
                            {
                                title: '交账日期', dataIndex: 'BillDay',
                                sorter: true, key: 'OrderByBillDay',
                                sortOrder: orderParam.OrderByBillDay
                            },
                            {title: '体验中心/商务部', dataIndex: 'HubName'},

                            {title: '应收', dataIndex: 'AmountStr'},
                            {title: '实收', dataIndex: 'AmountRealStr'},
                            {title: '应退', dataIndex: 'RefundAmountStr'},
                            {title: '实退', dataIndex: 'RefundAmountRealStr'},
                            {
                                title: '收款存入公司方式', children: [
                                    {title: '微信', dataIndex: 'PayWeiXinStr'},
                                    {title: '支付宝', dataIndex: 'PayZhiFuBaoStr'},
                                    {title: '现金', dataIndex: 'PayCashStr'},
                                    {title: '银行转账', dataIndex: 'PayBankStr'},
                                    {title: '差额', dataIndex: 'GapStr'}
                                ]
                            },

                            {title: '审核状态', dataIndex: 'FinanceAuditStatusStr'},
                            {title: '拒绝原因', dataIndex: 'FinanceAuditReason'},
                            {title: '审核人', dataIndex: 'AuditEmployeeName'},
                            {
                                title: '审核时间', dataIndex: 'FinanceAuditDate',
                                sorter: true, key: 'OrderByFinanceAudit',
                                sortOrder: orderParam.OrderByFinanceAudit
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