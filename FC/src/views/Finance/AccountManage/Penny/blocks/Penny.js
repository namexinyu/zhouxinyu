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
    Select,
    message
} from 'antd';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import OneCentTestAction from 'ACTION/Finance/AccountManage/OneCentTestAction';
import {adiutTestRecords, testResultInput} from 'SERVICE/Finance/AccountManage/OneCentTestService';
import {InvoiceStatus} from 'CONFIG/EnumerateLib/Mapping_Order';

const {TextArea} = Input;
const {queryTestDetails} = OneCentTestAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_penny';

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
                <Col span={6}>
                    <FormItem {...formItemLayout} label="提交日期">
                        {getFieldDecorator('Date')(
                            <RangePicker style={{width: '100%'}}/>
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
                    <FormItem {...formItemLayout} label="姓名">
                        {getFieldDecorator('Name')(
                            <Input placeholder="请输入姓名"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="审核状态">
                        {getFieldDecorator('AuditStatus')(
                            <Select>
                                <Select.Option value="0">全部</Select.Option>
                                <Select.Option value="1">未审核</Select.Option>
                                <Select.Option value="2">通过</Select.Option>
                                <Select.Option value="3">不通过</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="到账状态">
                        {getFieldDecorator('MoneyReceiveStatus')(
                            <Select>
                                <Select.Option value="0">全部</Select.Option>
                                <Select.Option value="1">未处理</Select.Option>
                                <Select.Option value="2">成功</Select.Option>
                                <Select.Option value="3">失败</Select.Option>
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

class Penny extends React.PureComponent {
    state = {auditSuccessModal: {}, auditRejectModal: {}, resultInputModal: {}};

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
        let selectedRowSum = {
            AuditEnable: true,
            ResultInputEnable: true
        };
        for (let item of selectedRows) {
            selectedRowSum.AuditEnable = selectedRowSum.AuditEnable && item.AuditStatus === 1 && item.MoneyReceiveStatus === 1;
            selectedRowSum.ResultInputEnable = selectedRowSum.ResultInputEnable && item.AuditStatus === 2;
        }
        setParams(STATE_NAME, {selectedRowKeys, selectedRowSum});
    };

    handleTableOperate = (e) => {
        e.persist();
        switch (e.target.name) {
            case 'auditSuccess':
            case 'auditReject':
            case 'resultInput':
                this.setState(preState => ({
                    [e.target.name + 'Modal']: {...preState[e.target.name + 'Modal'], Visible: true}
                }));
                break;
        }
    };

    handleAuditSuccessModalCancel = () => {
        this.setState({auditSuccessModal: {}});
    };
    handleAuditSuccessModalConfirm = () => {
        this.setState(preState => ({
            auditSuccessModal: {...preState.auditSuccessModal, ConfirmLoading: true}
        }));
        adiutTestRecords({
            AuditStatus: 2, AuditRemarks: '', OneCentTestIDs: this.props.selectedRowKeys
        }, (response) => {
            this.handleAuditConfirm(response);
        });
    };

    handleAuditConfirm = ({res, err}) => {
        if (res) {
            let {SuccessRecords, FailedRecords} = res;
            message.info(`审核成功${SuccessRecords.length || 0}条，失败${FailedRecords.length || 0}条`);
            if (FailedRecords.length) {
                let error = FailedRecords.reduce((pre, cur) => {
                    for (let i of this.props.RecordList) {
                        if (i.OneCentTestID === cur.TestOneCentId) {
                            pre += `${i.Name}，失败原因：${cur.Reason}\n`;
                            break;
                        }
                    }
                    return pre;
                }, '');
                Modal.error({title: '提示', content: <pre>{error}</pre>});
            }
            this.queryTableList();
            this.handleAuditSuccessModalCancel();
            this.handleAuditRejectModalCancel();
        } else {
            message.error(err ? err : '审核失败');
            this.setState(preState => ({
                auditSuccessModal: {...preState.auditSuccessModal, ConfirmLoading: false}
            }));
        }
    };

    handleAuditRejectModalCancel = () => {
        this.setState({auditRejectModal: {}});
    };
    handleAuditRejectModalConfirm = () => {
        this.setState(preState => ({
            auditRejectModal: {...preState.auditRejectModal, ConfirmLoading: true}
        }));
        adiutTestRecords({
            AuditStatus: 3,
            AuditRemarks: this.state.auditRejectModal.AuditRemarks || '',
            OneCentTestIDs: this.props.selectedRowKeys
        }, (response) => {
            this.handleAuditConfirm(response);
        });
    };

    handleResultInputModalCancel = () => {
        this.setState({resultInputModal: {}});
    };
    handleResultInputModalConfirm = () => {
        let MoneyReceiveStatus = Number(this.state.resultInputModal.MoneyReceiveStatus);
        if (MoneyReceiveStatus !== 2 && MoneyReceiveStatus !== 3) {
            message.error("请选择到账结果");
            return;
        }
        this.setState(preState => ({
            resultInputModal: {...preState.resultInputModal, ConfirmLoading: true}
        }));
        testResultInput({
            MoneyReceiveStatus,
            MoneyReceiveRemarks: this.state.resultInputModal.MoneyReceiveRemarks || '',
            OneCentTestIDs: this.props.selectedRowKeys
        }, ({res, err}) => {
            if (res) {
                message.success("录入成功");
                this.queryTableList();
                this.handleResultInputModalCancel();
            } else {
                message.error(err ? err : '录入失败');
                this.setState(preState => ({
                    resultInputModal: {...preState.resultInputModal, ConfirmLoading: false}
                }));
            }
        });
    };

    handleModalInput = (e) => {
        if (typeof e === 'string') {
            this.setState(preState => ({
                resultInputModal: {...preState.resultInputModal, MoneyReceiveStatus: e}
            }));
        } else {
            e.persist();
            switch (e.target.name) {
                case 'AuditRemarks':
                    this.setState(preState => ({
                        auditRejectModal: {...preState.auditRejectModal, [e.target.name]: e.target.value}
                    }));
                    break;
                case 'MoneyReceiveRemarks':
                    this.setState(preState => ({
                        resultInputModal: {...preState.resultInputModal, [e.target.name]: e.target.value}
                    }));
                    break;
            }
        }
    };

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['AuditStatus', 'MoneyReceiveStatus'];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v || '';
            }
            return pre;
        }, {});
        if (query.Date && query.Date instanceof Array) {
            query.SubmitTimeStart = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.SubmitTimeEnd = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
            delete query.Date;
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
        queryTestDetails({
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
        const {auditSuccessModal, auditRejectModal, resultInputModal} = this.state;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>一分钱测试</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <Modal title="审核通过" visible={auditSuccessModal.Visible}
                               maskClosable={false}
                               onCancel={this.handleAuditSuccessModalCancel}
                               onOk={this.handleAuditSuccessModalConfirm}
                               confirmLoading={auditSuccessModal.ConfirmLoading}>
                            <div>审核通过后，费用会转到会员的银行卡，确认通过？</div>
                            <div>0.01元的测试款项将转到会员卡内</div>
                        </Modal>
                        <Modal title="审核不通过" visible={auditRejectModal.Visible}
                               maskClosable={false}
                               onCancel={this.handleAuditRejectModalCancel}
                               onOk={this.handleAuditRejectModalConfirm}
                               confirmLoading={auditRejectModal.ConfirmLoading}>
                            <div style={{display: 'inline-flex'}}>
                                <label className='mr-16'>备注：</label>
                                <TextArea name='AuditRemarks' placeholder="输入备注"
                                          value={auditRejectModal.AuditRemarks}
                                          onChange={this.handleModalInput} style={{width: 300}}/>
                            </div>
                        </Modal>
                        <Modal title="到账结果录入" visible={resultInputModal.Visible}
                               maskClosable={false}
                               onCancel={this.handleResultInputModalCancel}
                               onOk={this.handleResultInputModalConfirm}
                               confirmLoading={resultInputModal.ConfirmLoading}>
                            <div>
                                <label className='mr-16'>到账状态：</label>
                                <Select name='MoneyReceiveStatus' value={resultInputModal.MoneyReceiveStatus || '0'}
                                        onChange={this.handleModalInput}>
                                    <Select.Option value='0'>请选择</Select.Option>
                                    <Select.Option value='2'>到账成功</Select.Option>
                                    <Select.Option value='3'>到账失败</Select.Option>
                                </Select>
                            </div>
                            <div style={{display: 'inline-flex', marginTop: 8}}>
                                <label className='mr-16'>到账说明：</label>
                                <TextArea name='MoneyReceiveRemarks' placeholder="输入说明"
                                          value={resultInputModal.MoneyReceiveRemarks}
                                          onChange={this.handleModalInput} style={{width: 300}}/>
                            </div>
                        </Modal>
                        <SearchForm
                            queryParams={queryParams}
                            setParams={setParams}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Row type="flex" justify="space-between" className="mb-16">
                            <Col>
                                <Button className="mr-16" type="primary" name='auditSuccess'
                                        disabled={!selectedRowSum.AuditEnable || !selectedRowKeys.length}
                                        onClick={this.handleTableOperate}>审核通过</Button>
                                <Button className="mr-16" type="primary" name='auditReject'
                                        disabled={!selectedRowSum.AuditEnable || !selectedRowKeys.length}
                                        onClick={this.handleTableOperate}>审核不通过</Button>
                                <Button className="mr-16" type="primary" name='resultInput'
                                        disabled={!selectedRowSum.ResultInputEnable || !selectedRowKeys.length}
                                        onClick={this.handleTableOperate}>到账结果录入</Button>
                            </Col>
                        </Row>
                        <Table
                            bordered={true} size='small' scroll={{x: 2500}} rowKey='OneCentTestID'
                            rowSelection={{
                                onChange: this.handleTableRowSelection,
                                selectedRowKeys: this.props.selectedRowKeys,
                                getCheckboxProps: record => ({
                                    disabled: !record.OneCentTestID || (record.AuditStatus !== 1 && record.AuditStatus !== 2)
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
                                {title: '姓名', dataIndex: 'Name', width: 110, fixed: 'left'},
                                {title: '身份证号码', dataIndex: 'IDCardNum'},
                                {title: '银行名称', dataIndex: 'BankName'},
                                {title: '银行卡号', dataIndex: 'BankCardNum'},
                                {title: '提交时间', dataIndex: 'SubmitTime'},
                                {title: '提现金额', dataIndex: 'AmountStr'},
                                {title: '款项说明', dataIndex: 'AmountRemarks'},
                                {
                                    title: '审核状态', dataIndex: 'AuditStatusStr',
                                    render: (text, record) => <span
                                        className={record.AuditStatusClass}>{text}</span>
                                },
                                {title: '审核人', dataIndex: 'AuditEmployeeName'},
                                {title: '审核时间', dataIndex: 'AuditTime'},
                                {title: '审核备注', dataIndex: 'AuditRemarks'},
                                {title: '测试结果', dataIndex: 'TestResultStr'},
                                {
                                    title: '到账状态', dataIndex: 'MoneyReceiveStatusStr',
                                    render: (text, record) => <span
                                        className={record.MoneyReceiveStatusClass}>{text}</span>
                                },
                                {title: '到账说明', dataIndex: 'MoneyReceiveRemarks'},
                                {title: '银行流水号', dataIndex: 'BankFlowNum'},
                                {title: '到账时间', dataIndex: 'MoneyReceiveTime'}
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

export default Penny;