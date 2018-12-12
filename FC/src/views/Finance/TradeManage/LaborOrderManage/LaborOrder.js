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
    message
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import TagSelect from 'COMPONENT/TagSelect';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import {browserHistory} from 'react-router';
import LaborOrderAction from 'ACTION/Finance/TradeManage/LaborOrderAction';
import CommonAction from 'ACTION/Finance/Common';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import moment from 'moment';

const {
    getLaborOrderList,
    laborOrderListExport
} = LaborOrderAction;
const {
    getLaborBossSimpleList,
    getLaborSimpleList,
    getRecruitSimpleList
} = CommonAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_labor';

class LaborOrder extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getRecruitSimpleList(); // 企业模糊下拉数据
            getLaborSimpleList(); // 劳务公司模糊下拉数据
            getLaborBossSimpleList(); // 大老板模糊下拉数据
            this.queryLaborOrderList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam || this.props.tagParam !== nextProps.tagParam) {
            this.queryLaborOrderList(nextProps);
        }

        if (nextProps.laborOrderListExportFetch.status === 'success') { // 导出订单
            setFetchStatus(STATE_NAME, 'laborOrderListExportFetch', 'close');
            let url = nextProps.laborOrderListExportFetch.response.Data && nextProps.laborOrderListExportFetch.response.Data.FileUrl;
            window.open(url);
        } else if (nextProps.laborOrderListExportFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'laborOrderListExportFetch', 'close');
            message.error(nextProps.laborOrderListExportFetch.response && nextProps.laborOrderListExportFetch.response.Desc ? nextProps.laborOrderListExportFetch.response.Desc : '导出失败');
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let query = {
            BossID: props.q_LaborBoss.value && props.q_LaborBoss.value.value ? Number(props.q_LaborBoss.value.value) : null,
            BossName: props.q_LaborBoss.value && props.q_LaborBoss.value.text ? props.q_LaborBoss.value.text : null,

            LaborID: props.q_Labor.value && props.q_Labor.value.value ? Number(props.q_Labor.value.value) : null,
            LaborName: props.q_Labor.value && props.q_Labor.value.text ? props.q_Labor.value.text : null,

            RecruitID: props.q_Recruit.value && props.q_Recruit.value.value ? Number(props.q_Recruit.value.value) : null,
            PositionName: props.q_Recruit.value && props.q_Recruit.value.text ? props.q_Recruit.value.text : null,

            q_Date: props.q_Date.value,
            UserName: props.q_UserName.value
        };
        if (query.q_Date && query.q_Date instanceof Array) {
            query.StarTime = query.q_Date[0] ? query.q_Date[0].format('YYYY-MM-DD') : null;
            query.EndTime = query.q_Date[1] ? query.q_Date[1].format('YYYY-MM-DD') : null;
        }
        delete query.q_Date;
        if (query.LaborID) delete query.LaborName;
        if (query.BossID) delete query.BossName;
        if (query.RecruitID) delete query.PositionName;

        if (props.tagParam && props.tagParam.length) {
            let param = {};
            for (let i of props.tagParam) {
                let parr = i.split('__');
                if (!param[parr[0]]) param[parr[0]] = [];
                param[parr[0]].push(Number(parr[1]));
            }
            query = {...query, ...param};
        }
        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1])) delete query[data[0]];
        });
        if (query.AuditStatus && query.AuditStatus.length) query.AuditStatus = query.AuditStatus[0];
        return query;
    }

    // 查询劳务订单列表
    queryLaborOrderList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        getLaborOrderList({
            ...this.obtainQueryParam(props),
            OrderByCheckInTime: props.orderParam.OrderByCheckInTime === 'ascend' ? 1 : 2,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => {
        resetQueryParams(STATE_NAME);
    };

    handleFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            console.log(err, fieldsValue);
            if (err) return;
            setParams(STATE_NAME, {
                pageParam: {...this.props.pageParam, currentPage: 1}
            });
        });
    };

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row type="flex" justify="start">
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="签到日期">
                            {getFieldDecorator('q_Date')(
                                <RangePicker style={{width: '100%'}} allowClear={false}
                                             disabledDate={(value) => {
                                                 if (!value) return false;
                                                 return value.valueOf() > moment().valueOf() || value.valueOf() < moment().subtract(1, 'year').valueOf();
                                             }}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="劳务公司">
                            {getFieldDecorator('q_Labor')(
                                <AutoCompleteInput
                                    textKey="ShortName" valueKey="LaborID"
                                    dataSource={this.props.common.LaborSimpleList}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="大老板">
                            {getFieldDecorator('q_LaborBoss')(
                                <AutoCompleteInput
                                    textKey="BossName" valueKey="LaborBossID"
                                    dataSource={this.props.common.LaborBossSimpleList}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="企业">
                            {getFieldDecorator('q_Recruit', {initialValue: null})(
                                <AutoCompleteInput
                                    textKey="RecruitName" valueKey="RecruitTmpID"
                                    dataSource={this.props.common.RecruitSimpleList}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员姓名">
                            {getFieldDecorator('q_UserName')(<Input placeholder="输入会员姓名"/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col className="mb-24" span={23} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button className="ml-8" onClick={this.handleFormReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>劳务订单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        {this.renderForm()}
                        <Row>
                            <Col span={2} className="mb-24">
                                <label>快速筛选：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    initialValue={this.props.tagParam}
                                    onChange={(value) => {
                                        setParams(STATE_NAME, {tagParam: [...value]});
                                    }}>
                                    <TagSelect.Option value="LaborOrderSettleStatus__1">待结算</TagSelect.Option>
                                    <TagSelect.Option value="LaborOrderSettleStatus__2">已结算</TagSelect.Option>
                                    <TagSelect.Option value="LaborOrderSettleStatus__3">结算中</TagSelect.Option>
                                    <TagSelect.Option value="LaborOrderStatus__1">正常</TagSelect.Option>
                                    <TagSelect.Option value="LaborOrderStatus__2">延期</TagSelect.Option>
                                    <TagSelect.Option value="AuditStatus__1">待审核</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>
                        <div className="mb-16 text-right">
                            <Button size="large" className="ml-16"
                                    onClick={() => {
                                        laborOrderListExport(this.obtainQueryParam(this.props));
                                    }}>导出订单</Button>
                        </div>
                        <Table
                            rowKey={'LaborUserOrderTotalID'} bordered={true}
                            onRowClick={(record, index, event) => {
                                record.LaborUserOrderTotalID && browserHistory.push({
                                    pathname: '/fc/trade-manage/labor/order-info/' + record.LaborUserOrderTotalID,
                                    query: {
                                        Pledge: record.Pledge,
                                        // RecruitID: record.RecruitID,
                                        LaborUserOrderTotalID: record.LaborUserOrderTotalID
                                    }
                                });
                            }}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.pageParam.pageSize,
                                current: this.props.pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            columns={[{
                                title: '签到日期',
                                dataIndex: 'CheckInTime',
                                sorter: true,
                                key: 'OrderByCheckInTime',
                                sortOrder: this.props.orderParam.OrderByCheckInTime
                            }, {
                                title: '劳务公司',
                                dataIndex: 'LaborName'
                            }, {
                                title: '大老板',
                                dataIndex: 'BossName'
                            }, {
                                title: '企业',
                                dataIndex: 'PositionName'
                            }, {
                                title: '输送人数',
                                dataIndex: 'OrderCount'
                            }, {
                                title: '已结算',
                                dataIndex: 'OrderCloseCount'
                            }, {
                                title: '未结算',
                                dataIndex: 'OrderUncloseCount'
                            }, {
                                title: '交易状态',
                                dataIndex: 'LaborOrderSettleStatus',
                                render: (text) => OrderSettleStatus[text]
                            }, {
                                title: '待审核',
                                dataIndex: 'AuditCount'
                            }, {
                                title: '押金',
                                dataIndex: 'Pledge',
                                render: text => Number.isInteger(text) ? text / 100 : ''
                            }, {
                                title: '结算金额',
                                dataIndex: 'CloseMoney',
                                render: text => Number.isInteger(text) ? text / 100 : ''
                            }, {
                                title: '预计日期',
                                dataIndex: 'PromiseSettleDate'
                            }, {
                                title: '订单状态',
                                dataIndex: 'LaborOrderStatus',
                                render: (text) => <span
                                    style={text === 2 ? {color: 'red'} : {color: ''}}>{PromiseSettleDelay[text]}
                                        </span>
                            }]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                if (sorter.columnKey) {
                                    change.orderParam = {[sorter.columnKey]: sorter.order};
                                }
                                setParams(STATE_NAME, change);
                            }}/>
                    </Card>
                </div>
            </div>
        );
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
})(LaborOrder);