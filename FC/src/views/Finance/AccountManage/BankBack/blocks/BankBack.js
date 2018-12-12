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
    Modal,
    Alert,
    message
} from 'antd';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import BankbackAction from 'ACTION/Finance/AccountManage/BankbackAction';
import {bankBackAgainPay} from 'SERVICE/Finance/AccountManage/BankbackService';
import {InvoiceStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const {TextArea} = Input;
const {queryBankBackList} = BankbackAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_bank_back';

const SearchForm = Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => props.setParams('queryParams', fields)
})(({handleFormSubmit, handleFormReset, form}) => {
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
                <Col span={5}>
                    <FormItem {...formItemLayout} label="退回日期">
                        {getFieldDecorator('BankBackTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="审核日期">
                        {getFieldDecorator('AuditTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="会员姓名">
                        {getFieldDecorator('UserName')(
                            <Input placeholder="请输入姓名"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="身份证号">
                        {getFieldDecorator('IDCardNum')(
                            <Input placeholder="请输入身份证号"/>
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

export default class Withdraw extends React.PureComponent {

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

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        setParams(STATE_NAME, {
            selectedRowKeys,
            selectedRowSum: {
                total: selectedRows.reduce((pre, cur) => {
                    pre += cur.Amount;
                    return pre;
                }, 0)
            }
        });
    };

    handleTableOperate = (e) => {
        e.persist();
        switch (e.target.name) {
            case 'againPay':
                this.setState(preState => ({
                    [e.target.name + 'Modal']: {...preState[e.target.name + 'Modal'], Visible: true}
                }));
                break;
        }
    };

    handleModalOperate = (modalName, operate, event) => {
        if (operate === 'Ok') {
            switch (modalName) {
                case 'againPayModal':
                    let AgainPayTime = this.state[modalName].AgainPayTime;
                    if (!(AgainPayTime && AgainPayTime._isAMomentObject)) {
                        message.error('请选择日期');
                        return;
                    }
                    this.setState(preState => ({
                        [modalName]: {...preState[modalName], ConfirmLoading: true}
                    }));
                    bankBackAgainPay({
                        BankBackIdList: this.props.selectedRowKeys,
                        AgainPayRemark: this.state[modalName].AgainPayRemark || '',
                        AgainPayTime: AgainPayTime.format('YYYY-MM-DD')
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
        let rangeTime = ['AuditTime', 'BankBackTime'];
        rangeTime.forEach(item => {
            query[item + 'Start'] = query[item] && query[item][0] ? query[item][0].format('YYYY-MM-DD') : '';
            query[item + 'End'] = query[item] && query[item][1] ? query[item][1].format('YYYY-MM-DD') : '';
            delete query[item];
        });
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
        queryBankBackList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});
    state = {againPayModal: {}};

    render() {
        const setParams = this.setParams;

        const {RecordCount, RecordList, selectedRowSum, RecordListLoading, queryParams, pageParam, orderParam} = this.props;
        const {againPayModal} = this.state;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>退回列表</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <Modal title="记录重新付款" visible={againPayModal.Visible}
                               maskClosable={false}
                               onCancel={() => this.handleModalOperate('againPayModal', 'Cancel')}
                               onOk={() => this.handleModalOperate('againPayModal', 'Ok')}
                               confirmLoading={againPayModal.ConfirmLoading}>
                            <div>
                                <div style={{display: 'flex'}}>
                                    <label style={{
                                        flex: '0 1 80px',
                                        textAlign: 'right',
                                        alignSelf: 'center'
                                    }}>重付日期：</label>
                                    <DatePicker style={{width: '50%'}} value={againPayModal.AgainPayTime}
                                                onChange={(e) => this.handleModalOperate('againPayModal', 'Change', {
                                                    target: {name: 'AgainPayTime', value: e}
                                                })}/>
                                </div>
                                <div style={{display: 'flex', marginTop: '8px'}}>
                                    <label style={{flex: '0 1 80px', textAlign: 'right'}}>备注：</label>
                                    <TextArea style={{width: '50%'}} placeholder="输入备注"
                                              value={againPayModal.AgainPayRemark} name='AgainPayRemark'
                                              onChange={(e) => this.handleModalOperate('againPayModal', 'Input', e)}/>
                                </div>
                            </div>
                        </Modal>
                        <SearchForm
                            queryParams={queryParams}
                            setParams={setParams}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Row type="flex" justify="space-between" className="mb-16">
                            <Col>
                                <Button className="mr-16" type="primary" name='againPay'
                                        disabled={!(this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0)}
                                        onClick={this.handleTableOperate}>记录重新付款</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Alert
                                type="info" showIcon className="mb-16"
                                message={(
                                    <p>{`退回提现金额共计${(selectedRowSum.total || 0) / 100}元`}
                                    </p>
                                )}/>
                        </Row>
                        <Table
                            bordered={true} size='small' scroll={{x: 2500}} rowKey='DrawingApplyID'
                            rowSelection={{
                                onChange: this.handleTableRowSelection,
                                selectedRowKeys: this.props.selectedRowKeys,
                                getCheckboxProps: record => ({
                                    disabled: !record.DrawingApplyID
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
                                {title: '会员姓名', dataIndex: 'UserName', width: 110, fixed: 'left'},
                                {title: '身份证号码', dataIndex: 'IDCardNum'},
                                {title: '银行卡名称', dataIndex: 'BankName'},
                                {title: '收款账号', dataIndex: 'CardNumber'},
                                {title: '提现金额', dataIndex: 'AmountStr'},
                                {title: '审核日期', dataIndex: 'AuditTimeStr'},
                                {title: '退回日期', dataIndex: 'BankBackTimeStr'},
                                {title: '退回原因', dataIndex: 'BankBackReason'},
                                {title: '退回操作人员', dataIndex: 'BankBackOperator'},
                                {title: '退回操作时间', dataIndex: 'BankBackOperateTime'},
                                {title: '重付操作人员', dataIndex: 'AgainPayOperator'},
                                {title: '重付备注', dataIndex: 'AgainPayRemark'},
                                {title: '重付日期', dataIndex: 'AgainPayTimeStr'}
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