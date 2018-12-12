import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Select,
    Table,
    Button,
    DatePicker,
    message,
    Alert
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import {
    PromiseSettleDelay, PromiseSettleDelayEnum,
     LaborOrderSettleStatusEnum
} from 'CONFIG/EnumerateLib/Mapping_Order';
import {browserHistory} from 'react-router';
import LaborOrderAction from 'ACTION/Business/OrderManage/LaborOrderAction';
import CommonAction from 'ACTION/Business/Common';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import LaborOrderModal from './LaborOrderModal';
import moment from 'moment';

const {RangePicker} = DatePicker;
const {
    getLaborOrderList,
    getLaborOrderTotal,
    laborOrderListExport
} = LaborOrderAction;
const {
    getLaborBossSimpleList,
    getLaborSimpleList,
    getRecruitSimpleList
} = CommonAction;
const FormItem = Form.Item;
const {Option} = Select;
const STATE_NAME = 'state_business_labororder';

class LaborOrder extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getLaborSimpleList(); // 劳务公司模糊下拉数据
            getRecruitSimpleList(); // 企业下拉数据
            this.queryLaborOrderList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryLaborOrderList(nextProps);
        }

    }

    // 合成查询参数
    obtainQueryParam(props) {
        let query = {
            LaborSettleStatus: Number(props.LaborSettleStatus),

            RecruitTmpID: props.q_LaborBoss.value && props.q_LaborBoss.value.value ? Number(props.q_LaborBoss.value.value) : null,
            PositionName: props.q_LaborBoss.value && props.q_LaborBoss.value.text ? props.q_LaborBoss.value.text : null,

            LaborID: props.q_Labor.value && props.q_Labor.value.value ? Number(props.q_Labor.value.value) : null,
            ShortName: props.q_Labor.value && props.q_Labor.value.text ? props.q_Labor.value.text : null,
            q_CheckInTime: props.q_CheckInTime.value,
            q_PromiseSettleDate: props.q_PromiseSettleDate.value
            
        };

        if (query.q_CheckInTime && query.q_CheckInTime instanceof Array) {
            query.CheckInTimeStart = query.q_CheckInTime[0] ? query.q_CheckInTime[0].format('YYYY-MM-DD') : null;
            query.CheckInTimeEnd = query.q_CheckInTime[1] ? query.q_CheckInTime[1].format('YYYY-MM-DD') : null;
            delete query.q_CheckInTime;
        }

        if (query.q_PromiseSettleDate && query.q_PromiseSettleDate instanceof Array) {
            query.PromiseSettleDateStart = query.q_PromiseSettleDate[0] ? query.q_PromiseSettleDate[0].format('YYYY-MM-DD') : null;
            query.PromiseSettleDateEnd = query.q_PromiseSettleDate[1] ? query.q_PromiseSettleDate[1].format('YYYY-MM-DD') : null;
            delete query.q_PromiseSettleDate;
        }

        if (query.LaborID) delete query.ShortName;
        if (query.RecruitTmpID) delete query.PositionName;

        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1])) delete query[data[0]];
        });
        return query;
    }

    // 查询劳务订单列表
    queryLaborOrderList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;

        let orderParam = {};
        if (props.orderParam && Object.keys(props.orderParam).length) {
            let orderKey = Object.keys(props.orderParam)[0];
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 1 : 2;
        }

        getLaborOrderList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }


    handleLaborOrderFormReset = () => {
        // this.props.form.resetFields();
        resetQueryParams(STATE_NAME);
    };

    handleLaborOrderFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            setParams(STATE_NAME, {
                pageParam: {...this.props.pageParam, currentPage: 1}
            });
        });
    };

    handleLaborOrderSettleStatusClick = (e) => {
        e.preventDefault();
        setParams(STATE_NAME, {
            LaborSettleStatus: Number(e.target.value),
            pageParam: {...this.props.pageParam, currentPage: 1}
        });
    };

    hideLaborOrderModal() {
        setParams(STATE_NAME, {
            LaborId: '',
            LaborOrderID: '',
            ModalVisible: false
        });
    }

    showLaborOrderModal(LaborId, LaborOrderID) {

        setParams(STATE_NAME, {
            LaborId: LaborId,
            LaborOrderID: LaborOrderID,
            ModalVisible: true
        });
    }

    
    renderLaborOrderForm() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleLaborOrderFormSubmit}>
                <Row type="flex" justify="start">
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="签到日期">
                        {getFieldDecorator('q_CheckInTime')(
                            <RangePicker style={{width: '100%'}}/>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="劳务公司" labelCol={{span: 5}} wrapperCol={{span: 16}}>
                            {getFieldDecorator('q_Labor')(
                                <AutoCompleteInput maxLength="50"
                                    textKey="ShortName" valueKey="LaborID"
                                    dataSource={this.props.LaborSimpleList}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="企业">
                            {getFieldDecorator('q_LaborBoss')(
                                <AutoCompleteInput maxLength="50"
                                    textKey="RecruitName" valueKey="RecruitTmpID"
                                    dataSource={this.props.RecruitSimpleList}/>
                            )}
                        </FormItem>
                    </Col>
 
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="结算日期">
                            {getFieldDecorator('q_PromiseSettleDate')(
                                <RangePicker style={{width: '100%'}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col className="mb-24" span={16}>
                    <span className='ant-form-item-label mr-16'>结算情况: </span>
                            <Button className="mr-16" type="primary" size="large"
                                    value={0}
                                    ghost={this.props.LaborSettleStatus !== 0}
                                    onClick={this.handleLaborOrderSettleStatusClick}>全部</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value={1}
                                    ghost={this.props.LaborSettleStatus !== 1}
                                    onClick={this.handleLaborOrderSettleStatusClick}>即将到期</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value={2}
                                    ghost={this.props.LaborSettleStatus !== 2}
                                    onClick={this.handleLaborOrderSettleStatusClick}>名单延期</Button>
                     
                    </Col>
                    <Col className="mb-24" span={8} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button className="ml-8" onClick={this.handleLaborOrderFormReset}>重置</Button>
                    </Col>
                </Row>
                <Row className="mt-24">
                            <Alert type="warning"
                                   message={
                                   <Row> <Col className="mb-12" span={12}>共计{this.props.RecordCount} 个劳务需催结算名单</Col>
                                   <Col style={{textAlign: 'right'}} className="mb-12" span={12}>最新计算时间：{this.props.LatestCalculationTime}</Col></Row>}/>
                            <br/>
                </Row>
            </Form>
        );
    }

    render() {
        const {LaborOrderModalItem} = this.props;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>催结算名单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        {this.renderLaborOrderForm()}
                        <Table
                            rowKey={(record, index) => index}
                            bordered={true}
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
                                sortOrder: this.props.orderParam.OrderByCheckInTime,
                                render: (text, record) => moment(text).format("YYYY-MM-DD")
                            }, {
                                title: '劳务公司',
                                dataIndex: 'ShortName'
                            }, {
                                title: '大老板',
                                dataIndex: 'BossName'
                            }, {
                                title: '企业',
                                dataIndex: 'PositionName'
                            }, {
                                title: '劳务报价',
                                dataIndex: 'LaborSubsidys',
                                render: (text, record) => text && text.map((item, index) =>
                                    <div key={"LaborSubsidys" + index}>
                                        {item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}:
                                        {item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                    </div>
                                )
                            }, {
                                title: '名单提供日期',
                                dataIndex: 'GivenListDate'
                            }, {
                                title: '结算日期',
                                dataIndex: 'PromiseSettleDate',
                                sorter: true,
                                key: 'OrderByPromiseSettleDate',
                                sortOrder: this.props.orderParam.OrderByPromiseSettleDate
                            }, {
                                title: '结算情况(人数)',
                                dataIndex: 'DelayCount',
                                render: (text, record) => <span>{text ? <div className='color-red'>名单延期({record.DelayCount})</div> : ''}{record.DueCount ? <div className='color-orange' >即将到期({record.DueCount})</div> : ''}</span>
                                                                    
                            }, {
                                title: '订单明细',
                                dataIndex: 'LaborUserOrderTotalID',
                                render: (text, record) => <a href='javascrpt:;' onClick={() => this.showLaborOrderModal(text, record.LaborOrderID)} >
                                            查看订单明细
                                        </a>
                            }
                            
                            ]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                if (sorter.columnKey) change.orderParam = {[sorter.columnKey]: sorter.order};
                                setParams(STATE_NAME, change);
                            }}/>
                    </Card>
                </div>
                <LaborOrderModal  
                    recordUserOrderID={this.props.LaborId}
                    LaborOrderID={this.props.LaborOrderID}
                    ModalVisible={this.props.ModalVisible}
                    onCancel={this.hideLaborOrderModal.bind(this)}/>
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