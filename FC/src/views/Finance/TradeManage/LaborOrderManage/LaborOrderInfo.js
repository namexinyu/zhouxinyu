import React from 'react';
import {
    Row,
    Col,
    Input,
    Radio,
    Modal,
    Card,
    Form,
    Table,
    Button,
    message
} from 'antd';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import {
    OrderStep
} from 'CONFIG/EnumerateLib/Mapping_Order';
import LaborOrderAction from 'ACTION/Finance/TradeManage/LaborOrderAction';
import 'LESS/Finance/TradeManage/trade-manage.less';
import QueryParam from 'mams-com/lib/utils/base/QueryParam';
import {Gender} from "CONFIG/EnumerateLib/Mapping_Recruit";

const RadioGroup = Radio.Group;
const {TextArea} = Input;
const FormItem = Form.Item;
const {
    getLaborUserOrderDetail,
    auditLaborOrder
} = LaborOrderAction;
const STATE_NAME = 'state_finance_trade_labor_info';


class LaborOrderInfo extends React.PureComponent {

    componentWillMount() {
        this.LaborUserOrderTotalID = QueryParam.getQueryParam(window.location.href, 'LaborUserOrderTotalID');
        this.Pledge = Number(QueryParam.getQueryParam(window.location.href, 'Pledge') || 0);
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.queryLaborOrderInfoList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryLaborOrderInfoList(nextProps);
        }
        if (nextProps.auditLaborOrderFetch.status === 'success') { // 批量审核
            setFetchStatus(STATE_NAME, 'auditLaborOrderFetch', 'close');
            let RecordList = nextProps.auditLaborOrderFetch.response.Data.RecordList; // 结果
            let info = '审核成功';
            if (RecordList && RecordList instanceof Array) {
                let successCount = 0;
                let failureCount = 0;
                for (let data of RecordList) {
                    if (data.Result && data.Result === 1) successCount++;
                    if (data.Result && data.Result === 2) failureCount++;
                }
                info = `${successCount}个订单审核成功，${failureCount}个订单审核失败`;
            }
            message.success(info);
            setParams(STATE_NAME, {auditModal: {Visible: false, FinanceSettleStatus: 2}});
            this.queryLaborOrderInfoList();
        } else if (nextProps.auditLaborOrderFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'auditLaborOrderFetch', 'close');
            message.error(nextProps.auditLaborOrderFetch.response && nextProps.auditLaborOrderFetch.response.Desc ? nextProps.auditLaborOrderFetch.response.Desc : '审核失败');
        }
    }

    // 查询劳务订单列表
    queryLaborOrderInfoList(props) {
        if (!props) props = this.props;
        let query = {OrderSteps: props.filterParam.OrderStep}; // 筛选
        if (query.OrderSteps && query.OrderSteps.length > 0) {
            query.OrderSteps = query.OrderSteps.map((item) => Number(item));
        } else {
            delete query.OrderSteps;
        }
        let pageParam = props.pageParam;
        getLaborUserOrderDetail({
            ...query,
            LaborUserOrderTotalID: Number(this.LaborUserOrderTotalID),
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    renderModel() {
        return <Modal
            title="审核结算"
            visible={this.props.auditModal.Visible}
            onOk={(e) => {
                e.preventDefault();
                if (this.props.auditModal.FinanceSettleStatus === 2 || this.props.auditModal.Remark) {
                    let param = {
                        UserOrderIDs: this.props.selectedRowKeys,
                        FinanceSettleStatus: this.props.auditModal.FinanceSettleStatus,
                        FinanceReason: this.props.FinanceReason
                    };
                    if (this.props.auditModal.FinanceSettleStatus === 2) delete param.FinanceReason;
                    auditLaborOrder(param);
                }
            }}
            onCancel={() => {
                setParams(STATE_NAME, {auditModal: {Visible: false, FinanceSettleStatus: 2}});
            }}>
            <Form>
                <FormItem label="审核结算" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                    <RadioGroup
                        options={[{label: '审核通过', value: 2}, {label: '审核拒绝', value: 3}]}
                        onChange={(e) => {
                            setParams(STATE_NAME, {
                                auditModal: {...this.props.auditModal, FinanceSettleStatus: e.target.value}
                            });
                        }}
                        value={this.props.auditModal.FinanceSettleStatus}/>
                </FormItem>
                {this.props.auditModal.FinanceSettleStatus === 3 &&
                <FormItem label="审核备注" labelCol={{span: 5}} wrapperCol={{span: 18}}
                          validateStatus={this.props.auditModal.FinanceReason && this.props.auditModal.FinanceReason.length > 0 ? '' : 'error'}
                          help={this.props.auditModal.FinanceReason && this.props.auditModal.FinanceReason.length > 0 ? '' : '请填写备注'}>
                        <TextArea style={{minHeight: 32}} placeholder="请填写审核备注" rows={4}
                                  onChange={(e) => {
                                      setParams(STATE_NAME, {
                                          auditModal: {...this.props.auditModal, FinanceReason: e.target.value}
                                      });
                                  }}/>
                </FormItem>}
            </Form>
        </Modal>;
    }

    render() {
        const Info = ({title, value = 0, bordered}) => (
            <div className='order-info-header'>
                <span>{title}</span>
                <p>{value}</p>
                {bordered && <em/>}
            </div>
        );

        return (
            <div>
                <div className="ivy-page-title">
                    <h1>劳务订单详情</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    {this.renderModel()}
                    <Card bordered={false} className="mb-24">
                        <Row>
                            <Col sm={6} xs={24}>
                                <Info title={`会员押金（${this.props.RecordCount}人）`}
                                      value={this.Pledge / 100} bordered/>
                            </Col>
                            <Col sm={6} xs={24}>
                                <Info title={`劳务返费（${this.props.RecordCount}人）`}
                                      value={this.props.LaborSubsidyCount / 100} bordered/>
                            </Col>
                            <Col sm={6} xs={24}>
                                <Info title={`会员补贴（${this.props.RecordCount}人）`}
                                      value={this.props.UserSubsidyCount / 100} bordered/>
                            </Col> <Col sm={6} xs={24}>
                            <Info title={'服务费'} value={this.props.ServiceSubsidyCount / 100}/>
                        </Col>
                        </Row>
                    </Card>

                    <Card bordered={false}>
                        <div className="mb-16">
                            <Button
                                type="primary" size="large"
                                onClick={() => setParams(STATE_NAME, {
                                    auditModal: {Visible: true, FinanceSettleStatus: 2}
                                })}
                                disabled={!(this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0)}>
                                批量审核
                            </Button>
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
                            columns={[
                                {title: '会员姓名', dataIndex: 'RealName'},
                                {
                                    title: '性别', dataIndex: 'Gender',
                                    render: text => Gender[text]
                                },
                                {
                                    title: '会员状态', dataIndex: 'OrderStep',
                                    filteredValue: this.props.filterParam.OrderStep,
                                    filters: Object.entries(OrderStep).map(item => ({text: item[1], value: item[0]})),
                                    render: text => OrderStep[text]
                                },
                                {title: '入职时间', dataIndex: 'HireDate'},
                                {title: '离职时间', dataIndex: 'LeaveDate'},
                                {title: '在职天数', dataIndex: 'WorkTime'},
                                {
                                    title: '押金', dataIndex: 'LaborDeposit',
                                    render: text => Number.isInteger(text) ? text / 100 : ''
                                },
                                {
                                    title: '劳务返费', dataIndex: 'LaborSubsidyAmount',
                                    render: (text, record) => Number.isInteger(text) ?
                                        <div className={
                                            Number.isInteger(record.LaborSubsidyAmountReal) && text < record.LaborSubsidyAmountReal ?
                                                'color-red' : ''}>{text / 100}</div> : ''
                                },
                                {
                                    title: '会员补贴', dataIndex: 'UserSubsidyAmount',
                                    render: text => Number.isInteger(text) ? text / 100 : ''
                                },
                                {
                                    title: '服务金额', dataIndex: 'ServiceSubsidyAmount',
                                    render: text => Number.isInteger(text) ? text / 100 : ''
                                },
                                {
                                    title: '劳务参考', dataIndex: 'LaborSubsidyAmountReal',
                                    render: (text, record) => text && Number.isInteger(text) ?
                                        <div className={
                                            Number.isInteger(record.LaborSubsidyAmount) && record.LaborSubsidyAmount < text ?
                                                'color-red' : ''}>{text / 100}</div> : ''
                                },
                                {
                                    title: '审核状态', dataIndex: 'FinanceSettleStatus', // 财务结算状态1、待结算 2、已结算 3、拒绝
                                    render: text => text === 2 ? '审核通过' : text === 3 ? '审核拒绝' : text === 1 ? '待审核' : ''
                                },
                                {
                                    title: '结算状态', dataIndex: 'SettleStatus',
                                    render: text => text === 1 ? '待结算' : text === 2 ? '已结算' : ''
                                }]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            rowSelection={{
                                onChange: (selectedRowKeys, selectedRows) => {
                                    let sel = [];
                                    for (let i = 0; i < selectedRows.length; i++) {
                                        let record = selectedRows[i];
                                        if (record.FinanceSettleStatus !== 1) {
                                            message.info('请勾选待审核状态记录');
                                        } else if (!record.UserOrderID) {
                                            message.info('UserOrderID无效');
                                        } else {
                                            sel.push(record.UserOrderID);
                                        }
                                    }
                                    setParams(STATE_NAME, {selectedRowKeys: sel});
                                },
                                selectedRowKeys: this.props.selectedRowKeys
                            }}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {
                                    pageParam: {currentPage, pageSize: pagination.pageSize},
                                    filterParam: filters, selectedRowKeys: []
                                };
                                if (sorter.columnKey) {
                                    change.orderParam = {[sorter.columnKey]: sorter.order};
                                }
                                setParams(STATE_NAME, change);
                            }}/>
                    </Card>
                </div>
            </div>
        )
            ;
    }
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