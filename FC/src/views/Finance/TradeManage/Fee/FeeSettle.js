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
import {batchSettleLaborCharge} from 'SERVICE/Finance/TradeManage/FeeService';
import {InvoiceStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import {browserHistory} from "react-router";

const {TextArea} = Input;
const {userOrderSettleList} = FeeAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_fee_settle';

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
                    <FormItem {...formItemLayout} label="劳务公司">
                        {getFieldDecorator('Labor')(
                            <AutoCompleteInput
                                textKey="ShortName" valueKey="LaborID"
                                dataSource={common.LaborSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="企业">
                        {getFieldDecorator('Recruit')(
                            <AutoCompleteInput
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={common.RecruitSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="是否已结">
                        {getFieldDecorator('SettleStatus')(
                            <Select>
                                <Select.Option value='-9999'>全部</Select.Option>
                                <Select.Option value='1'>未结</Select.Option>
                                <Select.Option value='2'>已结</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="操作日期">
                        {getFieldDecorator('SettleTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="支付方式">
                        {getFieldDecorator('Payment')(
                            <Select>
                                <Select.Option value='-9999'>全部</Select.Option>
                                <Select.Option value='1'>打款</Select.Option>
                                <Select.Option value='2'>转充值</Select.Option>
                            </Select>
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

export default class FeeSettle extends React.PureComponent {
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
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['SettleStatus', 'Payment'];
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
        if (query.SettleTime && query.SettleTime instanceof Array) {
            query.SettleTimeBegin = query.SettleTime[0] ? query.SettleTime[0].format('YYYY-MM-DD') : null;
            query.SettleTimeEnd = query.SettleTime[1] ? query.SettleTime[1].format('YYYY-MM-DD') : null;
            delete query.SettleTime;
        }

        if (query.Labor) {
            query.ShortName = query.Labor.text;
            query.LaborID = query.Labor.data ? query.Labor.data.LaborID : null;
            if (query.LaborID) delete query.ShortName;
            delete query.Labor;
        }
        if (query.Recruit) {
            query.PositionName = query.Recruit.text;
            query.RecruitTmpID = query.Recruit.data ? query.Recruit.data.RecruitTmpID : null;
            if (query.RecruitTmpID) delete query.PositionName;
            delete query.Recruit;
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
        userOrderSettleList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        setParams(STATE_NAME, {
            selectedRows,
            selectedRowKeys, selectedRowSum: selectedRows.reduce((pre, cur) => {
                pre.WodaChargeAmount += cur.WodaChargeAmount;
                pre.LaborChargeAmount += cur.LaborChargeAmount;
                return pre;
            }, {WodaChargeAmount: 0, LaborChargeAmount: 0})
        });
    };

    handleTableOperate = (e) => {
        e.persist();
        switch (e.target.name) {
            case 'settleLaborCharge':
                this.setState(preState => ({
                    [e.target.name + 'Modal']: {...preState[e.target.name + 'Modal'], Visible: true}
                }));
                break;
        }
    };

    handleModalOperate = (modalName, operate, event) => {
        if (operate === 'Ok') {
            switch (modalName) {
                case 'settleLaborChargeModal':
                    let LaborChargePayment = Number(this.state[modalName].LaborChargePayment);
                    if (LaborChargePayment !== 1 && LaborChargePayment !== 2) {
                        message.error('请选择支付方式');
                        return;
                    }
                    this.setState(preState => ({
                        [modalName]: {...preState[modalName], ConfirmLoading: true}
                    }));
                    batchSettleLaborCharge({
                        TaskList: this.props.selectedRows.map(item => ({
                            UserOrderSettleID: item.UserOrderSettleID,
                            LaborChargeAmount: item.LaborChargeAmount
                        })),
                        LaborChargeRemark: this.state[modalName].LaborChargeRemark || '',
                        LaborChargePayment
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
    state = {settleLaborChargeModal: {}};

    render() {
        const setParams = this.setParams;
        const {settleLaborChargeModal} = this.state;
        const {RecordCount, RecordList, selectedRowSum, selectedRowKeys, RecordListLoading, queryParams, pageParam, orderParam} = this.props;
        return (
            <div className="container-fluid pt-24 pb-24">
                <Card bordered={false}>

                    <Modal title="结底价" visible={settleLaborChargeModal.Visible}
                           maskClosable={false}
                           onCancel={() => this.handleModalOperate('settleLaborChargeModal', 'Cancel')}
                           onOk={() => this.handleModalOperate('settleLaborChargeModal', 'Ok')}
                           confirmLoading={settleLaborChargeModal.ConfirmLoading}>

                        <div style={{display: 'flex'}}>
                            <label style={{flex: '0 1 80px', textAlign: 'right', alignSelf: 'center'}}>支付方式：</label>
                            <Radio.Group name='LaborChargePayment'
                                         value={settleLaborChargeModal.LaborChargePayment || '0'}
                                         onChange={(e) => this.handleModalOperate('settleLaborChargeModal', 'Change', e)}>
                                <Radio value='1'>打款</Radio>
                                <Radio value='2'>转充值</Radio>
                            </Radio.Group>
                        </div>
                        <div style={{display: 'flex', marginTop: 8}}>
                            <label style={{flex: '0 1 80px', textAlign: 'right'}}>备注：</label>
                            <TextArea style={{width: '50%'}} placeholder="输入备注"
                                      value={settleLaborChargeModal.LaborChargeRemark} name='LaborChargeRemark'
                                      onChange={(e) => this.handleModalOperate('settleLaborChargeModal', 'Input', e)}/>
                        </div>
                    </Modal>

                    <SearchForm
                        queryParams={queryParams} setParams={setParams}
                        common={this.props.common}
                        handleFormSubmit={this.handleFormSubmit}
                        handleFormReset={this.handleFormReset}/>
                    <Row className="mb-16">
                        <Col>
                            <Button size="large" className="mr-16" name='settleLaborCharge' type="primary"
                                    disabled={!(this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0)}
                                    onClick={this.handleTableOperate}>结底价</Button>

                            <Button size="large" className="mr-16"
                                    onClick={() => {
                                        browserHistory.push({pathname: `/fc/trade-manage/fees/import`});
                                    }}>导入名单</Button>
                        </Col>
                    </Row>

                    <Row>
                        <Alert
                            type="info" showIcon className="mb-16"
                            message={(
                                <p>已选择&nbsp;&nbsp;<a
                                    style={{fontWeight: 600}}>{selectedRowSum.count || 0}</a> 项&nbsp;&nbsp;
                                    应收 <span
                                        style={{fontWeight: 600}}>{(selectedRowSum.WodaChargeAmount || 0) / 100}</span> 元&nbsp;&nbsp;
                                    结底价 <span
                                        style={{fontWeight: 600}}>{(selectedRowSum.LaborChargeAmount || 0) / 100}</span> 元
                                    <a onClick={() => setParams({
                                        selectedRowKeys: [], selectedRowSum: {}
                                    })}
                                       style={{marginLeft: 24}}>清空</a>
                                </p>
                            )}/>
                    </Row>
                    <Table
                        bordered={true} size='small' scroll={{x: 2000}} rowKey='UserOrderSettleID'
                        rowSelection={{
                            onChange: this.handleTableRowSelection,
                            selectedRowKeys: this.props.selectedRowKeys,
                            getCheckboxProps: record => ({
                                disabled: !record.UserOrderSettleID || record.LaborChargeSettleStatus !== 1
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
                                title: '签到日期', dataIndex: 'CheckInTimeStr', width: 120, fixed: 'left',
                                sorter: true, key: 'OrderByCheckInTime',
                                sortOrder: orderParam.OrderByCheckInTime
                            },
                            {title: '面试企业', dataIndex: 'PositionName'},
                            {title: '劳务公司', dataIndex: 'ShortName'},
                            {title: '会员姓名', dataIndex: 'RealName'},
                            {title: '身份证号码', dataIndex: 'IDCardNum'},
                            {title: '应收', dataIndex: 'WodaChargeAmountStr'},
                            {title: '结底价', dataIndex: 'LaborChargeAmountStr'},
                            {title: '是否已结', dataIndex: 'LaborChargeSettleStatusStr'},
                            {title: '支付方式', dataIndex: 'LaborChargePaymentStr'},
                            {title: '备注', dataIndex: 'LaborChargeRemark'},
                            {title: '操作人', dataIndex: 'LaborChargeEmployeeName'},
                            {
                                title: '操作时间', dataIndex: 'LaborChargeSettleTime',
                                sorter: true, key: 'OrderBySettleTime',
                                sortOrder: orderParam.OrderBySettleTime
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