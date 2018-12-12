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
    message,
    Select,
    Modal
} from 'antd';
import TagSelect from 'COMPONENT/TagSelect';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import moment from 'moment';
import InviteOrderAction from 'ACTION/Finance/TradeManage/InviteOrderAction';
import createPureComponent from 'UTIL/createPureComponent';
import {
    inviteFeeOrderExport,
    inviteFeeBatchPay,
    inviteFeeAbandon
} from 'SERVICE/Finance/TradeManage/InviteOrderService';
import overviewAction from 'ACTION/Finance/overviewAction';

const {TextArea} = Input;
const {getInviteFeeOrderList} = InviteOrderAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_invite';

const SearchForm = Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => props.setParams('queryParams', fields)
})(createPureComponent(({handleFormSubmit, handleFormReset, form}) => {
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
                    <FormItem {...formItemLayout} label="申请日期">
                        {getFieldDecorator('Date')(
                            <RangePicker style={{width: '100%'}}
                                         disabledDate={(value) => {
                                             if (!value) return false;
                                             return value.valueOf() > moment().valueOf() || value.valueOf() < moment().subtract(1, 'year').valueOf();
                                         }}
                            />
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="审核日期">
                        {getFieldDecorator('AuditDate')(
                            <RangePicker style={{width: '100%'}}
                                         disabledDate={(value) => {
                                             if (!value) return false;
                                             return value.valueOf() > moment().valueOf() || value.valueOf() < moment().subtract(1, 'year').valueOf();
                                         }}
                            />
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="推荐人">
                        {getFieldDecorator('UserInviter')(
                            <Input placeholder="请输入推荐人"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="推荐人手机">
                        {getFieldDecorator('UserInviterPhone')(
                            <Input placeholder="请输入推荐人手机"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="被推荐人">
                        {getFieldDecorator('UserInvited')(
                            <Input placeholder="请输入被推荐人"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="被推荐手机">
                        {getFieldDecorator('UserInvitedPhone')(
                            <Input placeholder="请输入被推荐手机"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="是否入职">
                        {getFieldDecorator('InviteStatus')(
                            <Select>
                                <Select.Option value="-9999">全部</Select.Option>
                                <Select.Option value="2">已入职</Select.Option>
                                <Select.Option value="1">未入职</Select.Option>
                            </Select>
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
}));

class InviteOrder extends React.PureComponent {

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
            if (this.props.location.query && this.props.location.query.settleStatus) {
                let settleStatus = this.props.location.query.settleStatus;
                overviewAction(STATE_NAME, settleStatus);
            } else {
                this.queryTableList();
            }
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
            selectedRowSum: selectedRows.reduce((pre, cur) => {
                pre.Amount += cur.Amount;
                return pre;
            }, {Amount: 0})
        });
    };

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['InviteStatus'];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v;
            }
            return pre;
        }, {});
        if (query.Date && query.Date instanceof Array) {
            query.DateBegin = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.DateEnd = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
        }
        delete query.Date;

        if (query.AuditDate && query.AuditDate instanceof Array) {
            query.AuditDateBegin = query.AuditDate[0] ? query.AuditDate[0].format('YYYY-MM-DD') : null;
            query.AuditDateEnd = query.AuditDate[1] ? query.AuditDate[1].format('YYYY-MM-DD') : null;
        }
        delete query.AuditDate;

        if (props.tagParam && props.tagParam.length) {
            let param = {};
            for (let i of props.tagParam) {
                let parr = i.split('__');
                if (!param[parr[0]]) param[parr[0]] = [];
                param[parr[0]].push(Number(parr[1]));
            }
            query = {...query, ...param};
        }

        // 废弃状态
        if (query.AbandonState && query.AbandonState.length) query.AbandonState = query.AbandonState[0];

        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1]) || Number.isNaN(data[1])) delete query[data[0]];
        });
        if (!query.DateBegin) query.DateBegin = '';
        if (!query.DateEnd) query.DateEnd = '';
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
        getInviteFeeOrderList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    handleModalOperate = (modalName, operate, event) => {
        if (operate === 'Ok') {
            switch (modalName) {
                case 'inviteFeeBatchPayModal':
                    this.setState(preState => ({
                        [modalName]: {...preState[modalName], ConfirmLoading: true}
                    }));
                    inviteFeeBatchPay({
                        InviteFeeIdList: this.props.selectedRowKeys
                    }, ({res, err}) => {
                        if (res) {
                            let info = '发放成功';
                            if (res.PayResultList && res.PayResultList instanceof Array) {
                                let successCount = 0;
                                let failureCount = 0;
                                let unCount = 0;
                                for (let data of res.PayResultList) {
                                    if (data.DisposeStatus === 0) {
                                        successCount++;
                                    } else if (data.DisposeStatus === 3) {
                                        unCount++;
                                    } else {
                                        failureCount++;
                                    }
                                }
                                info = `${successCount}个订单发放成功，${failureCount}个订单发放失败，${unCount}个未入职`;
                            }
                            message.info(info);
                            this.queryTableList();
                            this.handleModalOperate(modalName, 'Cancel');
                        } else {
                            message.error(err ? err : '发放失败');
                            this.setState(preState => ({
                                [modalName]: {...preState[modalName], ConfirmLoading: false}
                            }));
                        }
                    });
                    break;
                case 'inviteFeeAbandonModal':
                    this.setState(preState => ({
                        [modalName]: {...preState[modalName], ConfirmLoading: true}
                    }));
                    inviteFeeAbandon({
                        InviteFeeIdList: this.props.selectedRowKeys, Remark: this.state[modalName].Remark || ''
                    }, ({res, err}) => {
                        if (res) {
                            message.success('作废成功');
                            this.queryTableList();
                            this.handleModalOperate(modalName, 'Cancel');
                        } else {
                            message.error(err ? err : '作废失败');
                            this.setState(preState => ({
                                [modalName]: {...preState[modalName], ConfirmLoading: false}
                            }));
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
    };

    handleTableOperate = (e) => {
        e.persist();
        switch (e.target.name) {
            case 'inviteFeeBatchPay':
            case 'inviteFeeAbandon':
                this.setState(preState => ({
                    [e.target.name + 'Modal']: {...preState[e.target.name + 'Modal'], Visible: true}
                }));
                break;
        }
    };

    state = {inviteFeeBatchPayModal: {}, inviteFeeAbandonModal: {}};

    render() {
        const setParams = this.setParams;
        const {selectedRowKeys, tagParam, pageParam} = this.props;
        const {inviteFeeBatchPayModal, inviteFeeAbandonModal} = this.state;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>推荐费管理</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <Modal title="批量处理" visible={inviteFeeBatchPayModal.Visible}
                               maskClosable={false}
                               onCancel={() => this.handleModalOperate('inviteFeeBatchPayModal', 'Cancel')}
                               onOk={() => this.handleModalOperate('inviteFeeBatchPayModal', 'Ok')}
                               confirmLoading={inviteFeeBatchPayModal.ConfirmLoading}>
                            您确定审核通过该申请吗？
                        </Modal>

                        <Modal title="作废订单" visible={inviteFeeAbandonModal.Visible}
                               maskClosable={false}
                               onCancel={() => this.handleModalOperate('inviteFeeAbandonModal', 'Cancel')}
                               onOk={() => this.handleModalOperate('inviteFeeAbandonModal', 'Ok')}
                               confirmLoading={inviteFeeAbandonModal.ConfirmLoading}>
                            确定作废申请？
                            <div style={{display: 'flex', marginTop: '8px'}}>
                                <label>备注：</label>
                                <TextArea style={{width: '50%'}} placeholder="输入备注"
                                          value={inviteFeeAbandonModal.Remark} name='Remark'
                                          onChange={(v) => this.handleModalOperate('inviteFeeAbandonModal', 'Input', v)}/>
                            </div>
                        </Modal>

                        <SearchForm
                            queryParams={this.props.queryParams}
                            setParams={setParams}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Row>
                            <Col span={2} className="mb-24">
                                <label>快速筛选：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={tagParam}
                                    onChange={(value) => {
                                        setParams({tagParam: [...value], pageParam: {...pageParam, currentPage: 1}});
                                    }}>
                                    <TagSelect.Option value="SettleStatus__1">未处理</TagSelect.Option>
                                    <TagSelect.Option value="SettleStatus__2">已处理</TagSelect.Option>
                                    <TagSelect.Option value="AbandonState__1">已作废</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>
                        <Row type="flex" className="mb-16">
                            <Button size="large" className="mr-16" name='inviteFeeBatchPay' type='primary'
                                    onClick={this.handleTableOperate}
                                    disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}>
                                批量处理</Button>

                            <Button size="large" className="mr-16" name='inviteFeeAbandon' type='primary'
                                    onClick={this.handleTableOperate}
                                    disabled={!(selectedRowKeys && selectedRowKeys.length > 0)}>
                                作废订单</Button>
                            <Button size="large" className="mr-16"
                                    onClick={() => {
                                        inviteFeeOrderExport(this.obtainQueryParam(this.props), ({res, err}) => {
                                            if (res && res.FileUrl) {
                                                window.open(res.FileUrl);
                                                message.success('导出成功');
                                            } else {
                                                message.error(err ? err : '导出失败');
                                            }
                                        });
                                    }}>导出订单</Button>
                        </Row>
                        <Row>
                            <Alert
                                type="info" showIcon className="mb-16"
                                message={(
                                    <p>已选择&nbsp;&nbsp;
                                        <a style={{fontWeight: 600}}>{this.props.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                        金额总计 <span
                                            style={{fontWeight: 600}}>{(this.props.selectedRowSum.Amount || 0) / 100}</span> 元
                                        <a onClick={() => setParams({
                                            selectedRowKeys: [],
                                            selectedRowSum: {}
                                        })}
                                           style={{marginLeft: 24}}>清空</a>
                                    </p>
                                )}/>
                        </Row>
                        <Table
                            rowKey={'InviteId'} bordered={true} size='small' scroll={{x: 2000}}
                            rowSelection={{
                                onChange: this.handleTableRowSelection,
                                selectedRowKeys: this.props.selectedRowKeys,
                                getCheckboxProps: record => ({
                                    disabled: record.SettleStatus !== 1 || !record.InviteId
                                })
                            }}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.pageParam.pageSize,
                                current: this.props.pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            columns={[
                                {title: '推荐人姓名', dataIndex: 'InviteUserName', width: 100, fixed: 'left'},
                                {title: '推荐人身份证号', dataIndex: 'InviteIDCardNum'},
                                {title: '推荐人手机号', dataIndex: 'InviteUserMobile'},
                                {title: '被推荐人姓名', dataIndex: 'Name'},
                                {title: '被推荐人身份证号', dataIndex: 'IDCardNum'},
                                {title: '被推荐人手机号', dataIndex: 'Mobile'},
                                {
                                    title: '是否入职', dataIndex: 'InviteStatus',
                                    render: (text) =>
                                        text === 1 ? <span className='color-red'>未入职</span> :
                                            text === 2 ? <span className='color-green'>已入职</span> : '-'
                                },
                                {
                                    title: '财务处理', dataIndex: 'SettleStatus',
                                    render: (text) =>
                                        text === 1 ? <span className='color-red'>未处理</span> :
                                            text === 2 ? <span className='color-green'>已处理</span> :
                                                text === 3 ? <span className='color-red'>作废</span> : '-'
                                },
                                {title: '作废原因', dataIndex: 'Remark'},
                                {title: '审核人', dataIndex: 'AuditEmployeeName'},
                                {title: '审核时间', dataIndex: 'AuditTime'},
                                {title: '申请时间', dataIndex: 'EntryTime'}
                            ]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
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

export default InviteOrder;