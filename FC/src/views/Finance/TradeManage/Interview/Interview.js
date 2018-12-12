import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Alert,
    Table,
    Icon,
    Button,
    DatePicker,
    InputNumber,
    message,
    Radio,
    Select,
    Modal,
    Tabs
} from 'antd';
import TagSelect from 'COMPONENT/TagSelect';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import moment from 'moment';
import CommonAction from 'ACTION/Finance/Common';
import InterviewSubsidyAction from 'ACTION/Finance/TradeManage/InterviewSubsidyAction';
import createPureComponent from 'UTIL/createPureComponent';
import resetState from 'ACTION/resetState';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import {browserHistory} from 'react-router';
import {
    OrderStep, AuditStatusNew, JFFInterviewStatus, ServiceInterviewStatus, InterviewSettleStatus
} from 'CONFIG/EnumerateLib/Mapping_Order';
import {Gender} from "CONFIG/EnumerateLib/Mapping_Recruit";
import 'LESS/Finance/TradeManage/trade-manage.less';
import {exportInterviewList} from 'SERVICE/Finance/TradeManage/InterviewSubsidyService';
import Interviews from 'SERVICE/Finance/Common/index';
import 'LESS/Finance/InviteOrder/index.less';
import RecordModal from "./RecordModal";
const JFFInterviewStatusEnum = [...JFFInterviewStatus];
const ServiceInterviewStatusEnum = [...ServiceInterviewStatus];
const InterviewSettleStatusEnum = [...InterviewSettleStatus];
const {
    getRecruitSimpleList,
    getLaborSimpleList
} = CommonAction;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const {
    getInterviewOrderList, setOrderSettle, setOrderStep
} = InterviewSubsidyAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_interview';

/* 弹窗 */
const IsSettleOrderModal = Form.create({
    mapPropsToFields: props => ({...props.IsSettleOrderModalItem}),
    onFieldsChange: (props, fields) => props.setParams('IsSettleOrderModalItem', fields)
})(({form, IsSettleOrderModalItem, handleModalCancel, handleModalSubmit}) => {
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 18}};
    return (
        <Modal
            title="手工结算" visible={IsSettleOrderModalItem.Visible}
            onCancel={handleModalCancel} confirmLoading={IsSettleOrderModalItem.confirmLoading}
            onOk={() => {
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    handleModalSubmit(fieldsValue);
                });
            }}>
            <Form>
                <FormItem label={
                    <div>
                        <Icon type="info-circle-o" className='color-warning mr-8 font-18'/>
                    </div>
                } {...formItemLayout} colon={false}>
                    <div>
                        <div className="font-14">请注意!</div>
                        <div style={{lineHeight: '18px'}}>
                            <div>正常订单：{IsSettleOrderModalItem.Count.a || 0}</div>
                            <div>少返订单：{IsSettleOrderModalItem.Count.b || 0}</div>
                            <div>未结完订单：{IsSettleOrderModalItem.Count.c || 0}</div>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="是否结算" {...formItemLayout}>
                    {getFieldDecorator('SettleStatus', {
                        rules: [{required: true}, {
                            validator: (rule, value, cb) => (value == -9999 ? cb(true) : cb()),
                            message: '请选择是否结算'
                        }],
                        initialValue: '-9999'
                    })(<Select>
                            <Select.Option value="-9999">请选择</Select.Option>
                            <Select.Option value="1">待结算</Select.Option>
                            <Select.Option value="2">已结算</Select.Option>
                            <Select.Option value="3">结算中</Select.Option>
                        </Select>
                    )}
                </FormItem>
            </Form>
        </Modal>
    );
});
const SetOrderStatusModal = Form.create({
    mapPropsToFields: props => ({...props.SetOrderStatusModalItem}),
    onFieldsChange: (props, fields) => props.setParams('SetOrderStatusModalItem', fields)
})(({form, SetOrderStatusModalItem, handleModalCancel, handleModalSubmit}) => {
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 18}};
    return (
        <Modal
            title="订单状态" visible={SetOrderStatusModalItem.Visible}
            onCancel={handleModalCancel} confirmLoading={SetOrderStatusModalItem.confirmLoading}
            onOk={() => {
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    handleModalSubmit(fieldsValue);
                });
            }}>
            <Form>
                <FormItem label="订单状态" {...formItemLayout}>
                    {getFieldDecorator('OrderStep', {
                        rules: [{required: true}, {
                            validator: (rule, value, cb) => (value == -9999 ? cb(true) : cb()),
                            message: '请选择是否结算'
                        }],
                        initialValue: '-9999'
                    })(
                        <RadioGroup>
                            <Radio value='26'>正常</Radio>
                            <Radio value='31'>呆账</Radio>
                            <Radio value='32'>作废</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {getFieldDecorator('Reason')(
                        <TextArea style={{minHeight: 32}} placeholder="请填写备注" rows={4}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    );
});

const SearchForm = Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => props.setParams('queryParams', fields)
})(createPureComponent(({handleFormSubmit, handleFormReset, form, common}) => {
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
                    <FormItem {...formItemLayout} label="签到日期">
                        {getFieldDecorator('Date')(
                            <RangePicker style={{width: '100%'}} allowClear={false}
                                         disabledDate={(value) => {
                                             if (!value) return false;
                                             return value.valueOf() > moment().valueOf() || value.valueOf() < moment().subtract(1, 'year').valueOf();
                                         }}
                            />
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="会员姓名">
                        {getFieldDecorator('RealName')(
                            <Input placeholder="请输入会员姓名"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="手机号码">
                        {getFieldDecorator('Mobile')(
                            <Input placeholder="请输入手机号码"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="面试企业">
                        {getFieldDecorator('Recruit')(
                            <AutoCompleteInput
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={common.RecruitSimpleList}/>
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
                    <FormItem {...formItemLayout} label="导入名单">
                        {getFieldDecorator('LaborSettleStatus')(
                            <Select>
                                <Option value="-9999">全部</Option>
                                <Option value="1">已导入</Option>
                                <Option value="2">未导入</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="超时天数">
                        {getFieldDecorator('OutPromiseSettleDay')(
                            <InputNumber placeholder="请输入超时天数" min={0} step={1} className='w-100'/>
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

export default class Interview extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            add: true,
            visible: false,
            data: []
        };
      }
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
        getRecruitSimpleList();
        getLaborSimpleList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }

        if (nextProps.setOrderSettleFetch.status === 'success') { // 结算
            setFetchStatus(STATE_NAME, 'setOrderSettleFetch', 'close');
            let RecordList = nextProps.setOrderSettleFetch.response.Data.RecordList;
            let info = '结算成功';
            if (RecordList && RecordList instanceof Array) {
                let successCount = 0;
                let failureCount = 0;
                for (let data of RecordList) {
                    if (data.Result === 1) {
                        successCount++;
                    } else {
                        failureCount++;
                    }
                }
                info = `${successCount}个订单结算成功，${failureCount}个订单结算失败`;
            }
            message.info(info);
            setParams(STATE_NAME, {
                selectedRowKeys: [], selectedRows: [], selectedRowTotal: 0
            });
            this.handleModalVisible('IsSettleOrderModal');
            this.queryTableList();
        } else if (nextProps.setOrderSettleFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setOrderSettleFetch', 'close');
            message.error(nextProps.setOrderSettleFetch.response && nextProps.setOrderSettleFetch.response.Desc ? nextProps.setOrderSettleFetch.response.Desc : '设置失败');
        }

        if (nextProps.setOrderStepFetch.status === 'success') { // 结算
            setFetchStatus(STATE_NAME, 'setOrderStepFetch', 'close');
            let RecordList = nextProps.setOrderStepFetch.response.Data.RecordList;
            let info = '修改成功';
            if (RecordList && RecordList instanceof Array) {
                let successCount = 0;
                let failureCount = 0;
                for (let data of RecordList) {
                    if (data.Result === 1) {
                        successCount++;
                    } else {
                        failureCount++;
                    }
                }
                info = `${successCount}个订单修改成功，${failureCount}个订单修改失败`;
            }
            message.info(info);
            setParams(STATE_NAME, {selectedRowKeys: [], selectedRows: [], selectedRowTotal: 0});
            this.handleModalVisible('SetOrderStatusModal');
            this.queryTableList();
        } else if (nextProps.setOrderStepFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setOrderStepFetch', 'close');
            message.error(nextProps.setOrderStepFetch.response && nextProps.setOrderStepFetch.response.Desc ? nextProps.setOrderStepFetch.response.Desc : '设置失败');
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
        setOrderSettle({
            InterviewIDs: this.props.selectedRowKeys,
            SettleStatus: Number(fieldsValue.SettleStatus)
        });
    };

    handleSetOrderStatusModalSubmit = (fieldsValue) => {
        console.log(fieldsValue);
        setOrderStep({
            InterviewIDs: this.props.selectedRowKeys,
            OrderStep: Number(fieldsValue.OrderStep),
            Reason: fieldsValue.Reason || ''
        });
    };

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        setParams(STATE_NAME, {
            selectedRowKeys, selectedRows,
            selectedRowSum: selectedRows.reduce((pre, cur) => {
                pre.selectedRowTotal += cur.LaborSubsidyAmount;
                pre.LaborSubsidyAmountRealTotal += cur.LaborSubsidyAmountReal;
                pre.UserSubsidyAmountTotal += cur.UserSubsidyAmount;
                return pre;
            }, {selectedRowTotal: 0, LaborSubsidyAmountRealTotal: 0, UserSubsidyAmountTotal: 0})
        });
    };

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['LaborSettleStatus'];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v;
            }
            return pre;
        }, {});
        if (query.Date && query.Date instanceof Array) {
            query.CheckInTimeBegin = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.CheckInTimeEnd = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
            delete query.Date;
        }
        if (query.Recruit) {
            query.PositionName = query.Recruit.text;
            query.RecruitTmpID = query.Recruit.data ? query.Recruit.data.RecruitTmpID : null;
            if (query.RecruitTmpID) delete query.PositionName;
            delete query.Recruit;
        }

        if (query.Labor) {
            query.ShortName = query.Labor.text;
            query.LaborID = query.Labor.data ? query.Labor.data.LaborID : null;
            if (query.LaborID) delete query.ShortName;
            delete query.Labor;
        }

        if (props.OrderStepTagParam && props.OrderStepTagParam.length === 1) query.OrderStep = Number(props.OrderStepTagParam[0]);
        if (props.SettleStatusTagParam && props.SettleStatusTagParam.length === 1) query.SettleStatus = Number(props.SettleStatusTagParam[0]);

        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1]) || Number.isNaN(data[1])) delete query[data[0]];
        });
        if (props.JFFInterviewStatusTagParam && props.JFFInterviewStatusTagParam.length === 1) {
            query.JFFInterviewStatus = Number(props.JFFInterviewStatusTagParam[0]);
        } else {
            query.JFFInterviewStatus = -9999;
        }
        if (props.ServiceInterviewStatusTagParam && props.ServiceInterviewStatusTagParam.length === 1) {
            query.ServiceInterviewStatus = Number(props.ServiceInterviewStatusTagParam[0]);
        } else {
            query.ServiceInterviewStatus = -9999;
        }

        query.PayType = Number(props.tabKey);
        if (query.OutPromiseSettleDay === 0) delete query.OutPromiseSettleDay;
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
        getInterviewOrderList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    handleTabChange = (tabKey) => {
        setParams(STATE_NAME, {tabKey, pageParam: {...this.props.pageParam, currentPage: 1}});
    };
    TakeUp =() => {
        let type = !this.state.add;
        this.setState({
            add: type
        });
    }
    visible = (type, reduce) => {
        if (type == true) {
            Interviews.getOneLaborPayList({InterviewID: reduce.InterviewID}).then((data) => {
                if (data.Code == 0) {
                    this.setState({
                        data: data.Data.RecordList
                    });
                }
            });
        }
        this.setState({
            visible: type
        });
        
    } 
    render() {
        const setParams = this.setParams;
        const {tabKey, selectedRowSum, selectedRows, selectedRowKeys, OrderStepTagParam, SettleStatusTagParam, JFFInterviewStatusTagParam, ServiceInterviewStatusTagParam} = this.props;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>面试名单</h1>
                </div>

                <Tabs activeKey={tabKey} className="page-view-tabs" onChange={this.handleTabChange}>
                    <Tabs.TabPane tab={<div className="page-view-tabs-pane">我打</div>} key="0"/>
                    <Tabs.TabPane tab={<div className="page-view-tabs-pane">周薪薪</div>} key="1"/>
                </Tabs>

                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <IsSettleOrderModal
                            IsSettleOrderModalItem={this.props.IsSettleOrderModalItem}
                            setParams={setParams}
                            handleModalSubmit={this.handleIsSettleOrderModalSubmit}
                            handleModalCancel={() => this.handleModalVisible('IsSettleOrderModal')}/>
                        <SetOrderStatusModal
                            SetOrderStatusModalItem={this.props.SetOrderStatusModalItem}
                            setParams={setParams}
                            handleModalSubmit={this.handleSetOrderStatusModalSubmit}
                            handleModalCancel={() => this.handleModalVisible('SetOrderStatusModal')}/>
                        <SearchForm
                            queryParams={this.props.queryParams}
                            setParams={setParams}
                            common={this.props.common}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <RecordModal
                            RecordList={this.state.data}
                            RecordModal={this.visible}
                            visible={this.state.visible} 
                            />
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <a onClick={this.TakeUp}>收起筛选<Icon className="ml-8" type={this.state.add ? 'up' : 'down'}/></a>
                        </div>
                        {this.state.add && <span><Row>
                            <Col span={2} className="mb-24">
                                <label>订单状态：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={OrderStepTagParam}
                                    onChange={(value) => {
                                        let tagParam = value;
                                        if (value && value.length && value.length < 6) tagParam = [value[value.length - 1]];
                                        setParams({OrderStepTagParam: [...tagParam]});
                                    }}>
                                    <TagSelect.Option value="26">正常</TagSelect.Option>
                                    <TagSelect.Option value="27">延期</TagSelect.Option>
                                    <TagSelect.Option value="28">漏返</TagSelect.Option>
                                    <TagSelect.Option value="30">少返</TagSelect.Option>
                                    <TagSelect.Option value="31">呆账</TagSelect.Option>
                                    <TagSelect.Option value="32">作废</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} className="mb-24">
                                <label>结算状态：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={SettleStatusTagParam}
                                    onChange={(value) => {
                                        let tagParam = value;
                                        if (value && value.length && value.length < InterviewSettleStatusEnum.length) tagParam = [value[value.length - 1]];
                                        setParams({SettleStatusTagParam: [...tagParam]});
                                    }}>
                                    {InterviewSettleStatusEnum.map(item =>
                                        <TagSelect.Option value={item[0].toString()} key={item[0]}>{item[1]}
                                        </TagSelect.Option>)}
                                </TagSelect>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} className="mb-24">
                                <label>业务处理：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={JFFInterviewStatusTagParam}
                                    onChange={(value) => {
                                        let tagParam = value;
                                        if (value && value.length && value.length < JFFInterviewStatusEnum.length) tagParam = [value[value.length - 1]];
                                        setParams({JFFInterviewStatusTagParam: [...tagParam]});
                                    }}>
                                    {JFFInterviewStatusEnum.map(item =>
                                        <TagSelect.Option value={item[0].toString()} key={item[0]}>{item[1]}
                                        </TagSelect.Option>)}
                                </TagSelect>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} className="mb-24">
                                <label>客服回访：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={ServiceInterviewStatusTagParam}
                                    onChange={(value) => {
                                        let tagParam = value;
                                        if (value && value.length && value.length < ServiceInterviewStatusEnum.length) tagParam = [value[value.length - 1]];
                                        setParams({ServiceInterviewStatusTagParam: [...tagParam]});
                                    }}>
                                    {ServiceInterviewStatusEnum.map(item =>
                                        <TagSelect.Option value={item[0].toString()} key={item[0]}>{item[1]}
                                        </TagSelect.Option>)}
                                </TagSelect>
                            </Col>
                        </Row></span>}
                        <Row type="flex" className="mb-16">
                            <Button size="large" className="mr-16"
                                    onClick={() => {
                                        browserHistory.push({
                                            pathname: `/fc/trade-manage/interview/import-interview/2`
                                        });
                                    }}>导入结算名单</Button>
                            <Button size="large" className="mr-16"
                                    onClick={() => {
                                        browserHistory.push({
                                            pathname: `/fc/trade-manage/interview/import-interview/1`
                                        });
                                    }}>导入红冲名单</Button>

                            <Button
                                type="primary" size="large" className="mr-16"
                                onClick={() => setParams('IsSettleOrderModalItem', {
                                    Visible: true,
                                    Count: this.props.selectedRows.reduce((pre, cur) => {
                                        if (cur.OrderStep === 26) pre.a++;
                                        if (cur.OrderStep === 30) pre.b++;
                                        if (cur.OrderStep === 29) pre.c++;
                                        return pre;
                                    }, {a: 0, b: 0, c: 0})
                                })}
                                disabled={!(this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0)}>
                                手工结算</Button>
                            <Button
                                type="primary" size="large" className="mr-16"
                                onClick={() => this.handleModalVisible('SetOrderStatusModal', true)}
                                disabled={!(this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0)}>
                                订单状态</Button>
                            <Button size="large" className="mr-16" onClick={() => {
                                exportInterviewList(this.obtainQueryParam(this.props), ({res, err}) => {
                                    if (res && res.FileUrl) {
                                        window.open(res.FileUrl);
                                        message.success('导出成功');
                                    } else {
                                        message.error(err ? err : '导出失败');
                                    }
                                });
                            }}>导出名单</Button>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Alert
                                    type="info" showIcon className="mb-16"
                                    message={(
                                        <p>已选择&nbsp;&nbsp;
                                            <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                            订单价总计 <span
                                                style={{fontWeight: 600}}>{(selectedRowSum.selectedRowTotal || 0) / 100}</span>元
                                            已收总计 <span
                                                style={{fontWeight: 600}}>{(selectedRowSum.LaborSubsidyAmountRealTotal || 0) / 100}</span>元
                                            会员已收总计 <span
                                                style={{fontWeight: 600}}>{(selectedRowSum.UserSubsidyAmountTotal || 0) / 100}</span>元
                                            <a onClick={() => setParams({
                                                selectedRowKeys: [],
                                                selectedRows: [],
                                                selectedRowSum: {}
                                            })} style={{marginLeft: 24}}>清空</a>
                                        </p>
                                    )}/>
                            </Col>
                            <Col span={12}>
                                <Alert
                                    type="info" showIcon className="mb-16"
                                    message={(
                                        <p>
                                            总计： <a style={{fontWeight: 600}}>{this.props.RecordCount}</a>项&nbsp;&nbsp;
                                            订单价总计：<a
                                            style={{fontWeight: 600}}>{this.props.TotalLaborSubsidyAmount / 100}</a>元&nbsp;&nbsp;
                                            已收总计：<a
                                            style={{fontWeight: 600}}>{this.props.TotalLaborSubsidyAmountReal / 100}</a>元&nbsp;&nbsp;
                                            会员已收总计：<a
                                            style={{fontWeight: 600}}>{this.props.TotalUserSubsidyAmount / 100}</a>元&nbsp;&nbsp;
                                        </p>
                                    )}/>
                            </Col>
                        </Row>
                        <Table
                            className='max-width-table'
                            rowKey={'InterviewID'} bordered={true} size='small' scroll={{x: 2000}}
                            rowSelection={{
                                onChange: this.handleTableRowSelection, selectedRowKeys
                            }}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.pageParam.pageSize,
                                current: this.props.pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                pageSizeOptions: ['10', '20', '50', '100', '200'],
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            columns={[
                                {
                                    title: '签到时间', dataIndex: 'CheckInTimeStr',
                                    sorter: true, width: 120, fixed: 'left',
                                    key: 'OrderByCheckInTime',
                                    sortOrder: this.props.orderParam.OrderByCheckInTime
                                },
                                {title: '会员姓名', dataIndex: 'RealName', width: 100, fixed: 'left'},
                                {title: '性别', dataIndex: 'Gender', width: 50, fixed: 'left', render: (text) => <span>{text == 0 ? "" : text == 1 ? "男" : "女"}</span>},
                                {title: '年龄', dataIndex: 'Age', width: 50, fixed: 'left', render: (text) => <span>{text == 0 ? "" : text}</span>},
                                {title: '经纪人', dataIndex: 'BrokerAccount', width: 50, fixed: 'left', render: (text) => <span>{text == 0 ? "" : text}</span>},
                                {title: '手机号码', dataIndex: 'Mobile'},
                                {title: '身份证', dataIndex: 'IDCardNum'},
                                {title: '面试企业', dataIndex: 'PositionName'},
                                {title: '劳务公司', dataIndex: 'ShortName'},
                                {title: '企业类型', dataIndex: 'PayTypeStr'},
                                {
                                    title: '订单价说明', dataIndex: 'LaborOrderSubsidy',
                                    render: text => text && text.map((item, index) =>
                                        <div key={index}>
                                            {Gender[item.Gender]}:{item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                        </div>
                                    )
                                },
                                {title: '订单价', dataIndex: 'LaborSubsidyAmountStr'},
                                {title: '已收', dataIndex: 'LaborSubsidyAmountRealStr'},
                                {title: '会员已收', dataIndex: 'UserSubsidyAmountStr'},
                                {
                                    title: '业务处理', dataIndex: 'JFFInterviewStatus',
                                    render: text => <span className={
                                        text === 0 || text === 2 ? 'color-green' :
                                            text === 3 || text === 4 ? 'color-red'
                                                : 'color-orange'
                                    }>{JFFInterviewStatus.get(text)}</span>
                                },
                                {
                                    title: '客服回访', dataIndex: 'ServiceInterviewStatus',
                                    render: text => <span className={text === 2 ? 'color-green' : 'color-red'}>
                                        {ServiceInterviewStatus.get(text)}
                                    </span>
                                },
                                {
                                    title: '结算状态', dataIndex: 'SettleStatus',
                                    render: text => <span className={text === 2 ? 'color-green' : ''}>
                                        {InterviewSettleStatus.get(text)}
                                    </span>
                                },
                                {
                                    title: '订单状态', dataIndex: 'OrderStep',
                                    render: text => <span className={
                                        text === 28 || text === 29 || text === 30 ? 'color-red' : ''}
                                    >{OrderStep[text]}</span>
                                },
                                {title: '订单状态备注', dataIndex: 'OrderStepReason', render: text => <pre>{text}</pre>},
                                {title: '超时天数', dataIndex: 'OutPromiseSettleDay'},
                                {title: '备注', dataIndex: 'Reason'},
                                {title: '操作记录', dataIndex: 'operation', render: (text, reduce) => {
                                    return <a onClick={() => this.visible(true, reduce)}>导入记录</a>;
                                }}
                            ]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {
                                    pageParam: {currentPage, pageSize: pagination.pageSize},
                                    selectedRowKeys: [], selectedRowTotal: 0,
                                    selectedRows: []
                                };
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