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
import MemberWithdrawAction from 'ACTION/Finance/AccountManage/MemberWithdrawAction';
import {
    exportWithdrawRecords,
    verifyWithdrawApplication,
    bankBack,
    bankBackDeal
} from 'SERVICE/Finance/AccountManage/MemberWithdrawService';
import {InvoiceStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import TagSelect from 'COMPONENT/TagSelect';
import overviewAction from 'ACTION/Finance/overviewAction';

const {TextArea} = Input;
const {queryWithdrawRecords} = MemberWithdrawAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_member_withdraw';

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
            <Row type="flex" justify="start">
                <Col span={6}>
                    <FormItem {...formItemLayout} label="提现日期">
                        {getFieldDecorator('CreateTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="审核日期">
                        {getFieldDecorator('AuditTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="到账日期">
                        {getFieldDecorator('PaymentTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="退回日期">
                        {getFieldDecorator('BankBackTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="会员姓名">
                        {getFieldDecorator('UserName')(
                            <Input placeholder="请输入姓名"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="身份证号">
                        {getFieldDecorator('IDCardNum')(
                            <Input placeholder="请输入身份证号"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="操作人员">
                        {getFieldDecorator('Operator')(
                            <Input placeholder="请输入操作人员"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="手机号">
                        {getFieldDecorator('Mobile')(
                            <Input placeholder="请输入手机号"/>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={4} offset={20} style={{display: 'inline-flex', justifyContent: 'space-around'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
});

export default class Withdraw extends React.PureComponent {
    state = {auditSuccessModal: {}, auditRejectModal: {}, bankBackModal: {}, bankBackDealModal: {}};

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
            if (this.props.location.query && this.props.location.query.auditStatus) {
                let auditStatus = this.props.location.query.auditStatus;
                overviewAction(STATE_NAME, auditStatus);
            } else {
                this.queryTableList();
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam
            || this.props.AuditStatusTagParam !== nextProps.AuditStatusTagParam
            || this.props.DrawingStatusTagParam !== nextProps.DrawingStatusTagParam) {
            this.queryTableList(nextProps);
        }
    }

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        let selectedRowSum = {
            count: 0,
            AmountTotal: 0,
            Audit2: 0,
            Audit3: 0,
            Audit4: 0,
            AuditEnable: true,
            BackEnable: true,
            BackDealEnable: true,
            ExceptionList: []
        };
        let oUuid = [];
        for (let item of selectedRows) {
            selectedRowSum.count++;
            selectedRowSum.AmountTotal += item.Amount;
            selectedRowSum['Audit' + item.AuditStatus] += item.Amount;
            selectedRowSum.AuditEnable = selectedRowSum.AuditEnable && item.AuditStatus === 2;
            selectedRowSum.BackEnable = selectedRowSum.BackEnable && item.WithDrawStatus === 2;
            selectedRowSum.BackDealEnable = selectedRowSum.BackDealEnable && item.WithDrawStatus === 4;

            if (item.BalanceStatus && !oUuid[item.Uuid]) {
                selectedRowSum.ExceptionList.push(item.UserName);
                oUuid[item.Uuid] = 1;
            }
        }
        setParams(STATE_NAME, {selectedRowKeys, selectedRowSum});
    };

    handleTableOperate = (e) => {
        e.persist();
        switch (e.target.name) {
            case 'auditSuccess':
            case 'auditReject':
            case 'bankBack':
            case 'bankBackDeal':
                this.setState(preState => ({
                    [e.target.name + 'Modal']: {...preState[e.target.name + 'Modal'], Visible: true}
                }));
                break;
            case 'export':
                exportWithdrawRecords(this.obtainQueryParam(this.props), ({res, err}) => {
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


    handleBankBackDealModalCancel = () => {
        this.setState({bankBackDealModal: {}});
    };

    handleBankBackDealModalConfirm = () => {
        this.setState(preState => ({
            bankBackDealModal: {...preState.bankBackDealModal, ConfirmLoading: true}
        }));
        bankBackDeal({
            BankBackIdList: this.props.selectedRowKeys
        }, ({res, err}) => {
            if (res) {
                message.success("退回已处理成功");
                this.queryTableList();
                this.handleBankBackDealModalCancel();
            } else {
                message.error(err ? err : '退回已处理失败');
                this.setState(preState => ({
                    bankBackDealModal: {...preState.bankBackDealModal, ConfirmLoading: false}
                }));
            }
        });
    };

    handleAuditSuccessModalCancel = () => {
        this.setState({auditSuccessModal: {}});
    };
    handleAuditSuccessModalConfirm = () => {
        this.setState(preState => ({
            auditSuccessModal: {...preState.auditSuccessModal, ConfirmLoading: true}
        }));
        verifyWithdrawApplication({
            AuditStatus: 3,
            DrawingApplyList: this.props.selectedRowKeys.map(item => ({DrawingApplyID: item}))
        }, ({res, err}) => {
            if (res) {
                message.success("审核成功");
                this.queryTableList();
                this.handleAuditSuccessModalCancel();
            } else {
                message.error(err ? err : '审核失败');
                this.setState(preState => ({
                    auditSuccessModal: {...preState.auditSuccessModal, ConfirmLoading: false}
                }));
            }
        });
    };

    handleAuditRejectModalCancel = () => {
        this.setState({auditRejectModal: {}});
    };
    handleAuditRejectModalConfirm = () => {
        this.setState(preState => ({
            auditRejectModal: {...preState.auditRejectModal, ConfirmLoading: true}
        }));
        verifyWithdrawApplication({
            AuditStatus: 4,
            DrawingApplyList: this.props.selectedRowKeys.map(item => ({DrawingApplyID: item})),
            Remark: this.state.auditRejectModal.Remark || ''
        }, ({res, err}) => {
            if (res) {
                message.success("审核拒绝成功");
                this.queryTableList();
                this.handleAuditRejectModalCancel();
            } else {
                message.error(err ? err : '审核拒绝失败');
                this.setState(preState => ({
                    auditRejectModal: {...preState.auditRejectModal, ConfirmLoading: false}
                }));
            }
        });
    };

    handleBankBackModalCancel = () => {
        this.setState({bankBackModal: {}});
    };
    handleBankBackModalConfirm = () => {
        if (!this.state.bankBackModal.BankBackTime || !this.state.bankBackModal.BankBackTime._isAMomentObject) {
            message.error('请选择退回日期');
            return;
        }
        this.setState(preState => ({
            bankBackModal: {...preState.bankBackModal, ConfirmLoading: true}
        }));
        bankBack({
            BankBackIdList: this.props.selectedRowKeys,
            BankBackReason: this.state.bankBackModal.BankBackReason,
            BankBackTime: this.state.bankBackModal.BankBackTime.format('YYYY-MM-DD')
        }, ({res, err}) => {
            if (res) {
                message.success("银行退回成功");
                this.queryTableList();
                this.handleBankBackModalCancel();
            } else {
                message.error(err ? err : '银行退回失败');
                this.setState(preState => ({
                    bankBackModal: {...preState.bankBackModal, ConfirmLoading: false}
                }));
            }
        });
    };

    handleModalInput = (e) => {
        if (!e._isAMomentObject) {
            e.persist();
            switch (e.target.name) {
                case 'Remark':
                    this.setState(preState => ({
                        auditRejectModal: {...preState.auditRejectModal, [e.target.name]: e.target.value}
                    }));
                    break;
                case 'BankBackReason':
                    this.setState(preState => ({
                        bankBackModal: {...preState.bankBackModal, [e.target.name]: e.target.value}
                    }));
                    break;
            }
        } else {
            this.setState(preState => ({
                bankBackModal: {...preState.bankBackModal, BankBackTime: e}
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
        let rangeTime = ['CreateTime', 'AuditTime', 'PaymentTime', 'BankBackTime'];
        rangeTime.forEach(item => {
            query[item + 'Start'] = query[item] && query[item][0] ? query[item][0].format('YYYY-MM-DD') : '';
            query[item + 'End'] = query[item] && query[item][1] ? query[item][1].format('YYYY-MM-DD') : '';
            delete query[item];
        });
        query.AuditStatus = props.AuditStatusTagParam.map(item => Number(item));
        query.DrawingStatus = props.DrawingStatusTagParam.map(item => Number(item));

        return query;
    }

    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        let orderParam = {};
        if (props.orderParam && Object.keys(props.orderParam).length) {
            let orderKey = Object.keys(props.orderParam)[0];
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 1 : 0;
        }

        queryWithdrawRecords({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    render() {
        const setParams = this.setParams;

        const {RecordCount, RecordList, selectedRowSum, selectedRowKeys, RecordListLoading, queryParams, pageParam, orderParam} = this.props;
        const {TotalAmount, TotalPassAuditAmount, TotalRejectAuditAmount, TotalWaitAuditAmount} = this.props;
        const {auditSuccessModal, auditRejectModal, bankBackModal, bankBackDealModal} = this.state;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>会员提现</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <Modal title="审核通过" visible={auditSuccessModal.Visible}
                               maskClosable={false}
                               onCancel={this.handleAuditSuccessModalCancel}
                               footer={[
                                   <Button key="back" size='large'
                                           onClick={this.handleAuditSuccessModalCancel}>取消</Button>,
                                   <Button key="submit" size='large' type="primary"
                                           disabled={selectedRowSum.ExceptionList && selectedRowSum.ExceptionList.length}
                                           loading={auditSuccessModal.ConfirmLoading}
                                           onClick={this.handleAuditSuccessModalConfirm}>确定</Button>
                               ]}>
                            {selectedRowSum.ExceptionList && !!selectedRowSum.ExceptionList.length &&
                            <div className='color-red'>{
                                selectedRowSum.ExceptionList.reduce((pre, cur, index) => `${pre}${index > 0 ? '、' : ''}${cur}`, '')
                            }会员资金账户异常，请联系技术人员</div>}
                        </Modal>
                        <Modal title="审核不通过" visible={auditRejectModal.Visible}
                               maskClosable={false}
                               onCancel={this.handleAuditRejectModalCancel}
                               onOk={this.handleAuditRejectModalConfirm}
                               confirmLoading={auditRejectModal.ConfirmLoading}>
                            <div style={{display: 'inline-flex'}}>
                                <label className='mr-16'>备注： </label>
                                <TextArea name='Remark' placeholder="输入备注" value={auditRejectModal.Remark}
                                          style={{width: 300}} onChange={this.handleModalInput}/>
                            </div>
                        </Modal>
                        <Modal title="银行退回" visible={bankBackModal.Visible}
                               maskClosable={false}
                               onCancel={this.handleBankBackModalCancel}
                               onOk={this.handleBankBackModalConfirm}
                               confirmLoading={bankBackModal.ConfirmLoading}>
                            <div>
                                <label className='mr-16'>退回日期：</label>
                                <DatePicker value={bankBackModal.BankBackTime}
                                            onChange={this.handleModalInput}/>
                            </div>
                            <div style={{display: 'inline-flex', marginTop: 8}}>
                                <label className='mr-16'>退回原因：</label>
                                <TextArea name='BankBackReason' placeholder="输入备注" value={bankBackModal.BankBackReason}
                                          style={{width: 300}} onChange={this.handleModalInput}/>
                            </div>
                        </Modal>
                        <Modal title="银行退回已处理" visible={bankBackDealModal.Visible}
                               maskClosable={false}
                               onCancel={this.handleBankBackDealModalCancel}
                               onOk={this.handleBankBackDealModalConfirm}
                               confirmLoading={bankBackDealModal.ConfirmLoading}>
                        </Modal>
                        <SearchForm
                            queryParams={queryParams}
                            setParams={setParams}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>

                        <Row>
                            <Col span={2} className="mb-24">
                                <label>审核状态：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={this.props.AuditStatusTagParam}
                                    onChange={(value) => {
                                        setParams({AuditStatusTagParam: [...value]});
                                    }}>
                                    <TagSelect.Option value="2">待审核</TagSelect.Option>
                                    <TagSelect.Option value="3">已通过</TagSelect.Option>
                                    <TagSelect.Option value="4">已拒绝</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} className="mb-24">
                                <label>到账状态：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={this.props.DrawingStatusTagParam}
                                    onChange={(value) => {
                                        setParams({DrawingStatusTagParam: [...value]});
                                    }}>
                                    <TagSelect.Option value="0">未到账</TagSelect.Option>
                                    <TagSelect.Option value="1">打款中</TagSelect.Option>
                                    <TagSelect.Option value="2">已到账</TagSelect.Option>
                                    <TagSelect.Option value="3">打款失败</TagSelect.Option>
                                    <TagSelect.Option value="4">银行退回</TagSelect.Option>
                                    <TagSelect.Option value="5">银行退回已处理</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>

                        <Row type="flex" justify="space-between" className="mb-16">
                            <Col>
                                <Button className="mr-16" type="primary" name='auditSuccess'
                                        disabled={!selectedRowSum.AuditEnable || !selectedRowKeys.length}
                                        onClick={this.handleTableOperate}>批量通过</Button>
                                <Button className="mr-16" type="primary" name='auditReject'
                                        disabled={!selectedRowSum.AuditEnable || !selectedRowKeys.length}
                                        onClick={this.handleTableOperate}>批量拒绝</Button>
                                <Button className="mr-16" type="primary" name='bankBack'
                                        disabled={!selectedRowSum.BackEnable || !selectedRowKeys.length}
                                        onClick={this.handleTableOperate}>银行退回</Button>
                                <Button className="mr-16" type="primary" name='bankBackDeal'
                                        disabled={!selectedRowSum.BackDealEnable || !selectedRowKeys.length}
                                        onClick={this.handleTableOperate}>银行退回已处理</Button>
                                <Button className="mr-16" type="primary" name='export'
                                        onClick={this.handleTableOperate}>导出订单</Button>
                            </Col>
                        </Row>
                        <Row gutter={16} className="mb-16">
                            <Col span={12}>
                                <Alert
                                    type="info" showIcon
                                    message={(
                                        <p>已选择&nbsp;&nbsp;<a
                                            style={{fontWeight: 600}}>{selectedRowSum.count || 0}</a> 项&nbsp;&nbsp;
                                            金额总计 <span
                                                style={{fontWeight: 600}}>{(selectedRowSum.AmountTotal || 0) / 100}</span> 元&nbsp;&nbsp;
                                            待审核 <span
                                                style={{fontWeight: 600}}>{(selectedRowSum.Audit2 || 0) / 100}</span> 元&nbsp;&nbsp;
                                            已通过 <span
                                                style={{fontWeight: 600}}>{(selectedRowSum.Audit3 || 0) / 100}</span> 元&nbsp;&nbsp;
                                            已拒绝 <span
                                                style={{fontWeight: 600}}>{(selectedRowSum.Audit4 || 0) / 100}</span> 元&nbsp;&nbsp;
                                            <a onClick={() => setParams({
                                                selectedRowKeys: [], selectedRowSum: {}
                                            })}
                                               style={{marginLeft: 24}}>清空</a>
                                        </p>
                                    )}/>
                            </Col>
                            <Col span={12}>
                                {/* TotalAmount, TotalPassAuditAmount, TotalRejectAuditAmout, TotalWaitAuditAmount*/}
                                <Alert type="info" showIcon
                                       message={(<p>
                                           总计：<span style={{fontWeight: 600}}>{RecordCount}</span> 项&nbsp;&nbsp;
                                           金额总计 <span
                                           style={{fontWeight: 600}}>{(TotalAmount || 0) / 100}</span> 元&nbsp;&nbsp;
                                           待审核 <span
                                           style={{fontWeight: 600}}>{(TotalWaitAuditAmount || 0) / 100}</span> 元&nbsp;&nbsp;
                                           已通过 <span
                                           style={{fontWeight: 600}}>{(TotalPassAuditAmount || 0) / 100}</span> 元&nbsp;&nbsp;
                                           已拒绝 <span
                                           style={{fontWeight: 600}}>{(TotalRejectAuditAmount || 0) / 100}</span> 元&nbsp;&nbsp;
                                       </p>)}/>
                            </Col>
                        </Row>

                        <Table
                            rowKey='iDrawingApplyID'
                            bordered={true} size='small' scroll={{x: 2000}}
                            rowSelection={{
                                onChange: this.handleTableRowSelection,
                                selectedRowKeys: this.props.selectedRowKeys,
                                getCheckboxProps: record => ({
                                    disabled: !record.iDrawingApplyID || (record.AuditStatus !== 2 &&
                                        (record.WithDrawStatus !== 2 && record.WithDrawStatus !== 4))
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
                                {title: '提现时间', dataIndex: 'CreateTime', width: 140, fixed: 'left'},
                                {
                                    title: '会员姓名', dataIndex: 'UserName', width: 100, fixed: 'left',
                                    render: (text, record) => <span style={record.BalanceStatus ?
                                        {color: 'red', fontWeight: 'bold'} : {}}>{text}</span>
                                },
                                {title: '手机号', dataIndex: 'Mobile'},
                                {title: '身份证号码', dataIndex: 'IDCardNum'},
                                {title: '提现金额', dataIndex: 'AmountStr'},
                                {
                                    title: '审核状态', dataIndex: 'AuditStatusStr',
                                    render: (text, record) => <span className={record.AuditStatusClass}>{text}</span>
                                },
                                {title: '操作人员', dataIndex: 'Operator'},
                                {title: '审核时间', dataIndex: 'AuditTime'},
                                {
                                    title: '到账状态', dataIndex: 'WithDrawStatusStr',
                                    render: (text, record) => <span className={record.WithDrawStatusClass}>{text}</span>
                                },
                                {title: '到账时间', dataIndex: 'FinishedTime'},
                                {title: '银行卡名称', dataIndex: 'BankName'},
                                {title: '收款账号', dataIndex: 'CardNumber'},
                                {title: '备注', dataIndex: 'Remark'},
                                {title: '退回日期', dataIndex: 'BankBackTimeStr'},
                                {title: '退回原因', dataIndex: 'BankBackReason'}
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