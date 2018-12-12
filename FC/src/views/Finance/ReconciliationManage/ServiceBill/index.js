import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Alert,
    Table,
    Button,
    DatePicker,
    Radio,
    Modal,
    InputNumber,
    Select,
    message
} from 'antd';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import ReconciliationManageAction from 'ACTION/Finance/ReconciliationManage';
import {invoiceHandle, exportMonthBill} from 'SERVICE/Finance/ReconciliationManage';
import CommonAction from 'ACTION/Finance/Common';
import resetState from 'ACTION/resetState';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import {InvoiceStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import IsSettleOrderModal from './IsSettleOrderModal';
import SetOrderStatusModal from './SetOrderStatusModal';
import {browserHistory} from "react-router";
import moment from 'moment';

const {getLaborSimpleList} = CommonAction;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const {getServiceBillList} = ReconciliationManageAction;
const FormItem = Form.Item;
const {MonthPicker} = DatePicker;
const STATE_NAME = 'state_finance_serviceBill';

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
                    <FormItem {...formItemLayout} label="结算月份">
                        {getFieldDecorator('Date')(
                            <MonthPicker style={{width: '100%'}} allowClear={false}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="劳务公司">
                        {getFieldDecorator('Labor')(
                            <AutoCompleteInput
                                textKey="ShortName" valueKey="LaborID"
                                dataSource={common.LaborSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="开票状态">
                        {getFieldDecorator('InvoiceStatus')(
                            <Select>
                                <Select.Option value="-9999">全部</Select.Option>
                                <Select.Option value="1">未开票</Select.Option>
                                <Select.Option value="3">部分开票</Select.Option>
                                <Select.Option value="2">已开票</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>

                <Col span={4} style={{display: 'inline-flex', justifyContent: 'space-around'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
});

class ServiceBill extends React.PureComponent {
    state = {};

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
            if (this.props.location.query && this.props.location.query.current) {
                let queryParams = {...this.props.queryParams, Date: {value: moment()}};
                setParams(STATE_NAME, {queryParams});
                this.queryTableList({...this.props, queryParams});
            } else {
                this.queryTableList();
            }
        }
        getLaborSimpleList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
    }

    handleModalVisible(modalName, Visible) {
        if (modalName === 'IsSettleOrderModal' || modalName === 'SetOrderStatusModal') {
            if (Visible === true) {
                this.setParams(modalName + 'Item', {Visible});
            } else {
                resetState(STATE_NAME, modalName + 'Item');
            }
        }
    }

    handleIsSettleOrderModalSubmit = (fieldsValue) => {
        console.log(fieldsValue); // 手工结算
    };

    handleSetOrderStatusModalSubmit = (fieldsValue) => {
        console.log(fieldsValue);
    };

    handleInvoice = (LaborMonthBillID) => {
        if (LaborMonthBillID) {
            this.setState({
                InvoiceSetModalVisible: true, LaborMonthBillID
            });
        }
    };

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['InvoiceStatus'];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v;
            }
            return pre;
        }, {});
        if (query.Date) {
            query.Month = query.Date.format('YYYY-MM');
            delete query.Date;
        }
        if (query.Labor) {
            query.ShortName = query.Labor.text;
            query.LaborID = query.Labor.data ? query.Labor.data.LaborID : null;
            if (query.LaborID) delete query.ShortName;
            delete query.Labor;
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
        getServiceBillList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleTableOperate = (e) => {
        e.persist();
        switch (e.target.name) {
            case 'export':
                exportMonthBill(this.obtainQueryParam(this.props), ({res, err}) => {
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

    resetInvoiceSetModal = () => {
        this.setState({
            InvoiceSetModalVisible: false,
            confirmLoading: false,
            InvoiceSetModalValue: 0,
            LaborMonthBillID: 0,
            InvoiceSetModalConfirmLoading: false
        });
    };

    // todo fixed 没走redux
    handleInvoiceModalConfirm = () => {
        invoiceHandle({
            InvoiceAmount: this.state.InvoiceSetModalValue * 100,
            LaborMonthBillID: this.state.LaborMonthBillID
        }, ({res, err}) => {
            if (res) {
                message.success("填写成功");
                this.queryTableList();
                this.resetInvoiceSetModal();
            } else {
                message.error(err ? err : '填写失败');
            }
        });
    };

    render() {
        const setParams = this.setParams;
        const {RecordCount, RecordList, RecordSum, RecordListLoading, IsSettleOrderModalItem, SetOrderStatusModalItem, queryParams, common, pageParam, orderParam} = this.props;

        return (
            <div>
                <div className="ivy-page-title">
                    <h1>服务费账单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <Modal title="填写开票金额" visible={this.state.InvoiceSetModalVisible}
                               onCancel={this.resetInvoiceSetModal}
                               onOk={this.handleInvoiceModalConfirm}
                               confirmLoading={this.state.InvoiceSetModalConfirmLoading}>
                            <label className='mr-16'>本次开票金额</label>
                            <InputNumber placeholder="输入金额" min={0} value={this.state.InvoiceSetModalValue || 0}
                                         onChange={(InvoiceSetModalValue) => this.setState({InvoiceSetModalValue})}
                            />
                        </Modal>
                        <IsSettleOrderModal
                            IsSettleOrderModalItem={IsSettleOrderModalItem}
                            setParams={setParams}
                            handleModalSubmit={this.handleIsSettleOrderModalSubmit}
                            handleModalCancel={() => this.handleModalVisible('IsSettleOrderModal')}/>
                        <SetOrderStatusModal
                            SetOrderStatusModalItem={SetOrderStatusModalItem}
                            setParams={setParams}
                            handleModalSubmit={this.handleSetOrderStatusModalSubmit}
                            handleModalCancel={() => this.handleModalVisible('SetOrderStatusModal')}/>
                        <SearchForm
                            queryParams={queryParams}
                            setParams={setParams}
                            common={common}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Row type="flex" justify="space-between" className="mb-16">
                            <Col>
                                <Button size="large" className="mr-16"
                                        onClick={() => {
                                            browserHistory.push({pathname: `/fc/reconcile/service-bill/import-bill`});
                                        }}>导入开票金额</Button>

                                <Button size="large" className="mr-16" style={{display: 'none'}}>查看导入日志</Button>
                                <Button size="large" className="mr-16" name='export'
                                        onClick={this.handleTableOperate}>导出数据</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Alert
                                type="info" showIcon className="mb-16"
                                message={(
                                    <p style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                                        <span> {`应收 ${RecordSum.LaborSubsidyAmountReal || 0} 元，应付 ${RecordSum.UserSubsidyAmount || 0} 元，
                                        实付 ${RecordSum.UserSubsidyAmountReal || 0} 元；应开票 ${RecordSum.ExpectInvoiceAmount || 0} 元，
                                        已开票 ${RecordSum.InvoiceAmount || 0} 元，剩余可开金额 ${RecordSum.RemainInvoiceAmount || 0} 元`}</span>
                                        <span> {`最近计算时间：${RecordSum.UpdateTime || '-'}`}</span>
                                    </p>
                                )}/>
                        </Row>
                        <Table
                            rowKey={'LaborMonthBillID'} bordered={true} size='small' scroll={{x: 1500}}
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
                                {title: '劳务公司', dataIndex: 'ShortName', width: 100, fixed: 'left'},
                                {title: '劳务公司全称', dataIndex: 'LaborFullName'},
                                {title: '应收', dataIndex: 'LaborSubsidyAmountReal'},
                                {title: '应付', dataIndex: 'UserSubsidyAmount'},
                                {title: '实付', dataIndex: 'UserSubsidyAmountReal'},
                                {title: '应开票金额', dataIndex: 'ExpectInvoiceAmount'},
                                {title: '已开票金额', dataIndex: 'InvoiceAmount'},
                                {title: '剩余可开金额', dataIndex: 'RemainInvoiceAmount'},
                                {
                                    title: '开票状态', dataIndex: 'InvoiceStatusStr',
                                    render: (text, record) => <span className={record.InvoiceStatusClass}>{text}</span>
                                },
                                {
                                    title: '操作',
                                    dataIndex: 'xx',
                                    render: (text, record) =>
                                        <a onClick={() => this.handleInvoice(record.LaborMonthBillID)}>填写开票金额</a>
                                },
                                {title: '操作人', dataIndex: 'LoginName'},
                                {
                                    title: '操作时间', dataIndex: 'InvoiceTime',
                                    sorter: true,
                                    key: 'OrderByInvoiceTime',
                                    sortOrder: orderParam.OrderByInvoiceTime
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
            </div>
        );
    }
}

export default ServiceBill;