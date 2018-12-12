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
    message,
    DatePicker,
    Radio
} from 'antd';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import ReconciliationManageAction from 'ACTION/Finance/ReconciliationManage';
import {exportBillDetail} from 'SERVICE/Finance/ReconciliationManage';
import CommonAction from 'ACTION/Finance/Common';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';

const {getLaborSimpleList, getRecruitSimpleList} = CommonAction;
const RadioGroup = Radio.Group;
const {getBillDetailList} = ReconciliationManageAction;
const FormItem = Form.Item;
const {MonthPicker} = DatePicker;
const STATE_NAME = 'state_finance_serviceBillDetail';

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
                    <FormItem {...formItemLayout} label="企业">
                        {getFieldDecorator('Recruit')(
                            <AutoCompleteInput
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={common.RecruitSimpleList}/>
                        )}
                    </FormItem>
                </Col>

                <Col span={6}>
                    <FormItem {...formItemLayout} label="会员姓名">
                        {getFieldDecorator('RealName', {initialValue: null})(
                            <Input placeholder="请输入会员姓名"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="手机号码">
                        {getFieldDecorator('Mobile', {initialValue: null})(
                            <Input placeholder="请输入手机号码"/>
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

export default class ServiceBillDetail extends React.PureComponent {
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
            this.queryTableList();
        }
        getLaborSimpleList();
        getRecruitSimpleList();
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
        if (query.Recruit) {
            query.RecruitName = query.Recruit.text;
            query.RecruitID = query.Recruit.data ? query.Recruit.data.RecruitTmpID : null;
            if (query.RecruitID) delete query.RecruitName;
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
        getBillDetailList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    handleTableOperate = (e) => {
        if (e) e.persist();
        switch (e.target.name) {
            case 'export':
                exportBillDetail(this.obtainQueryParam(this.props), ({res, err}) => {
                    if (res && res.FileUrl) {
                        window.open(res.FileUrl);
                        message.destroy();
                        message.success('导出成功');
                    } else {
                        message.destroy();
                        message.error(err ? err : '导出失败');
                    }
                });
                break;
        }
    };

    render() {
        const setParams = this.setParams;
        const {RecordCount, RecordList, RecordSum, RecordListLoading, queryParams, common, pageParam, orderParam} = this.props;

        return (
            <div>
                <div className="ivy-page-title">
                    <h1>服务费明细</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <SearchForm
                            queryParams={queryParams}
                            setParams={setParams}
                            common={common}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Row className="mb-16">
                            <Button size="large" className="mr-16" name='export'
                                    onClick={this.handleTableOperate}>导出数据</Button>
                        </Row>
                        <Row>
                            <Alert
                                type="info" showIcon className="mb-16"
                                message={(
                                    <p style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                                        <span> {`应收 ${RecordSum.LaborSubsidyAmountReal || 0} 元，应付 ${RecordSum.UserSubsidyAmount || 0} 元，
                                        实付 ${RecordSum.UserSubsidyAmountReal || 0} 元；余额 ${RecordSum.RemainAmount || 0} 元`}</span>
                                        <span> {`最近计算时间：${RecordSum.UpdateTime || '-'}`}</span>
                                    </p>
                                )}/>
                        </Row>
                        <Table
                            rowKey={'InterviewID'} bordered={true} size='small' scroll={{x: 1500}}
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
                                    title: '签到日期', dataIndex: 'CheckInTimeStr', width: 140, fixed: 'left',
                                    sorter: true, key: 'OrderByCheckInTime',
                                    sortOrder: orderParam.OrderByCheckInTime
                                },
                                {title: '会员姓名', dataIndex: 'RealName', width: 120, fixed: 'left'},
                                {title: '手机号码', dataIndex: 'Mobile'},
                                {title: '面试企业', dataIndex: 'PositionName'},
                                {title: '劳务公司', dataIndex: 'ShortName'},

                                {title: '应收', dataIndex: 'LaborSubsidyAmountReal'},
                                {title: '应付', dataIndex: 'UserSubsidyAmount'},
                                {title: '实付', dataIndex: 'UserSubsidyAmountReal'},
                                {title: '余额', dataIndex: 'RemainAmount'},

                                {title: '结算日期', dataIndex: 'FinanceTimeStr'},
                                {title: '实付日期', dataIndex: 'UserSubsidyAmountPayStr'},
                                {title: '备注', dataIndex: 'Reason'}
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