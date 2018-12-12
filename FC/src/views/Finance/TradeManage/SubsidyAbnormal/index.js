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
    Radio,
    Select,
    Modal
} from 'antd';
import TagSelect from 'COMPONENT/TagSelect';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import moment from 'moment';
import CommonAction from 'ACTION/Finance/Common';
import InterviewSubsidyAction from 'ACTION/Finance/TradeManage/InterviewSubsidyAction';
import resetState from 'ACTION/resetState';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import oss from 'CONFIG/ossConfig';
import {exportSpecialPermitList} from 'SERVICE/Finance/TradeManage/InterviewSubsidyService';
import SubsidyAuditRecord from "SERVICE/Finance/TradeManage/InterviewSubsidyService";
import {Gender} from "CONFIG/EnumerateLib/Mapping_Recruit";
import SubsidyAuditRecordModal from "../SubsidyAuditRecord/index";
const {getRecruitSimpleList} = CommonAction;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const {getSpecialPermitList, setSpecialPermit} = InterviewSubsidyAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_subsidy_order_abnormal';

const SetSpecialPermitModal = Form.create({
    mapPropsToFields: props => ({...props.SetSpecialPermitModalItem}),
    onFieldsChange: (props, fields) => props.setParams('SetSpecialPermitModalItem', fields)
})(({form, SetSpecialPermitModalItem, handleModalCancel, handleModalSubmit}) => {
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 18}};
    return (
        <Modal
            title="审核" visible={SetSpecialPermitModalItem.Visible}
            onCancel={handleModalCancel} confirmLoading={SetSpecialPermitModalItem.confirmLoading}
            onOk={() => {
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    handleModalSubmit(fieldsValue);
                });
            }}>
            <Form>
                <FormItem label="是否通过" {...formItemLayout}>
                    {getFieldDecorator('SpecialPermit', {
                        rules: [{required: true}, {message: '请选择审核状态'}],
                        initialValue: '1'
                    })(
                        <RadioGroup>
                            <Radio value='2'>是</Radio>
                            <Radio value='3'>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                {form.getFieldValue('SpecialPermit') == 3 && <FormItem label="备注" {...formItemLayout}>
                    {getFieldDecorator('SpecialPermitReason')(
                        <TextArea style={{minHeight: 32}} placeholder="请填写原因" rows={4}/>
                    )}
                </FormItem>}
            </Form>
        </Modal>
    );
});
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
                    <FormItem {...formItemLayout} label="审核日期">
                        {getFieldDecorator('AuditDate')(
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
                        {getFieldDecorator('Recruit', {initialValue: null})(
                            <AutoCompleteInput
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={common.RecruitSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="企业类型">
                        {getFieldDecorator('PayType')(
                            <Select>
                                <Option value="-9999">全部</Option>
                                <Option value="0">我打</Option>
                                <Option value="1">周薪薪</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={11} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
});

export default class SubsidyOrderAbnormal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            RecordList: [],
            imgs: [],
            Uploadvalue: true,
            previewVisible: false,
            previewUrl: "",
            visible: false,
            UnissuedType: false,
            SpecialPermit: 0
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
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }

        if (nextProps.setSpecialPermitFetch.status === 'success') { // 推荐费发放
            setFetchStatus(STATE_NAME, 'setSpecialPermitFetch', 'close');
            let RecordList = nextProps.setSpecialPermitFetch.response.Data.RecordList;
            let info = '特批成功';
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
                info = `${successCount}个订单特批成功，${failureCount}个订单特批失败`;
            }
            message.info(info);
            this.handleModalVisible('SetSpecialPermitModal');
            this.queryTableList();
        } else if (nextProps.setSpecialPermitFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setSpecialPermitFetch', 'close');
            message.error(nextProps.setSpecialPermitFetch.response && nextProps.setSpecialPermitFetch.response.Desc ? nextProps.setSpecialPermitFetch.response.Desc : '设置失败');
        }
    }


    handleModalVisible(modalName, Visible) {
        
        if (modalName === 'SetSpecialPermitModal') {
            if (Visible === true) {
                this.setParams(modalName + 'Item', {Visible});
            } else {
                resetState(STATE_NAME, modalName + 'Item');
            }
        }
    }

    handleSetSpecialPermitModalSubmit = (fieldsValue) => {
        console.log(fieldsValue);
        this.setState({
            SpecialPermit: fieldsValue.SpecialPermit * 1
        });
        setSpecialPermit({
            SpecialPermit: Number(fieldsValue.SpecialPermit),
            SubsidyApplyIDs: this.props.selectedRowKeys,
            SpecialPermitReason: fieldsValue.SpecialPermitReason || ''
        });
    };


    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        let AuditEnable = true;
        let UnissuedEnable = true;
        for (let item of selectedRows) {
            AuditEnable = AuditEnable && item.SpecialPermit === 1;
            UnissuedEnable = UnissuedEnable && item.SpecialPermit === 2;
        }
        setParams(STATE_NAME, {
            AuditEnable,
            UnissuedEnable,
            selectedRowKeys, selectedRowSum: selectedRows.reduce((pre, cur) => {
                pre.Amount += cur.Amount;
                if (cur.PayStatus === 1) pre.UnPayAmount += cur.Amount;
                if (cur.PayStatus === 3) pre.PaidAmount += cur.Amount;
                return pre;
            }, {Amount: 0, PaidAmount: 0, UnPayAmount: 0})
        });
    };

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['PayType'];
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
        if (query.AuditDate && query.AuditDate instanceof Array) {
            query.SpecialPermitBegin = query.AuditDate[0] ? query.AuditDate[0].format('YYYY-MM-DD') : null;
            query.SpecialPermitEnd = query.AuditDate[1] ? query.AuditDate[1].format('YYYY-MM-DD') : null;
            delete query.AuditDate;
        }

        if (query.Recruit) {
            query.PositionName = query.Recruit.text;
            query.RecruitTmpID = query.Recruit.data ? query.Recruit.data.RecruitTmpID : null;
            if (query.RecruitTmpID) delete query.PositionName;
            delete query.Recruit;
        }

        if (props.SubsidyStatusTagParam && props.SubsidyStatusTagParam.length === 1) query.SubsidyStatus = Number(props.SubsidyStatusTagParam[0]);
        if (props.SpecialPermitTagParam && props.SpecialPermitTagParam.length > 0) query.SpecialPermit = props.SpecialPermitTagParam.map((item) => {
            return Number(item);
        });
        if (props.PayStatusTagParam && props.PayStatusTagParam.length > 0) query.PayStatus = props.PayStatusTagParam.map((item) => {
            return Number(item);
        });
        console.log(props.PayStatusTagParam);
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
        getSpecialPermitList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});
    visible = (type, record) => {
        this.setState({
            visible: type
        });
        if (type == true) {
            SubsidyAuditRecord.getOneVerifyDetail({InterviewID: record.InterviewID}).then((data) => {
                if (data.Code == 0) {
                    this.setState({
                        RecordList: data.Data.RecordList
                    });
                }
            });
        }
    }
    UserSubsidyToBank = (selectedRowKeys) => {
        this.setState({
            UnissuedType: true
        });
        let that = this;
        Modal.confirm({
            title: '提示',
            content: '请确认是否要付款',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk() {
                SubsidyAuditRecord.UserSubsidyToBank({SubsidyApplyIDs: selectedRowKeys}).then((Data) => {
                    let info = '付款成功';
                    if (Data.Data.RecordList && Data.Data.RecordList instanceof Array) {
                        let successCount = 0;
                        let failureCount = 0;
                        for (let data of Data.Data.RecordList) {
                            if (data.Result === 1) {
                                successCount++;
                            } else {
                                failureCount++;
                            }
                        }
                        info = `${successCount}个订单付款成功，${failureCount}个订单付款失败`;
                    }
                    that.setState({
                        UnissuedType: false
                    });
                    message.info(info);
                    that.queryTableList();
                }).catch((err) => {
                    console.log(err);
                    message.error(err.Desc);
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }
    render() {
        const setParams = this.setParams;
        const {selectedRowKeys, selectedRowSum} = this.props;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>异常补贴管理</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <SetSpecialPermitModal
                            SetSpecialPermitModalItem={this.props.SetSpecialPermitModalItem}
                            setParams={setParams}
                            handleModalSubmit={this.handleSetSpecialPermitModalSubmit}
                            handleModalCancel={() => this.handleModalVisible('SetSpecialPermitModal')}/>
                        <SearchForm
                            queryParams={this.props.queryParams}
                            setParams={setParams}
                            common={this.props.common}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Row>
                            <Col span={2} className="mb-24">
                                <label>能否补贴：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={this.props.SubsidyStatusTagParam}
                                    onChange={(value) => {
                                        let tagParam = value;
                                        if (value && value.length && value.length < 3) tagParam = [value[value.length - 1]];
                                        setParams({SubsidyStatusTagParam: [...tagParam]});
                                    }}>
                                    <TagSelect.Option value="1">未结算</TagSelect.Option>
                                    <TagSelect.Option value="3">不可补</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} className="mb-24">
                                <label>付款状态：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={this.props.PayStatusTagParam}
                                    onChange={(value) => {
                                        setParams({PayStatusTagParam: [...value]});
                                    }}>
                                    <TagSelect.Option value="1">未付款</TagSelect.Option>
                                    <TagSelect.Option value="3">已付款</TagSelect.Option>
                                    <TagSelect.Option value="4">付款失败</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} className="mb-24">
                                <label>审核状态：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={this.props.SpecialPermitTagParam}
                                    onChange={(value) => {
                                        setParams({SpecialPermitTagParam: [...value]});
                                    }}>
                                    <TagSelect.Option value="1">待审核</TagSelect.Option>
                                    <TagSelect.Option value="2">已通过</TagSelect.Option>
                                    <TagSelect.Option value="3">已拒绝</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>

                        <Row className="mb-16">
                        <Button size="large" className="mr-16" type='primary'
                                    onClick={() => this.handleModalVisible('SetSpecialPermitModal', true)}
                                    disabled={!(this.props.selectedRowKeys || []).length > 0 || !this.props.AuditEnable || this.state.UnissuedType}>
                                补贴审核</Button>
                            <Button size="large" className="mr-16" type='primary'
                                onClick={() => this.UserSubsidyToBank(selectedRowKeys)}
                                disabled={!(this.props.selectedRowKeys || []).length > 0 || !this.props.UnissuedEnable || this.state.UnissuedType}
                                >
                                付款</Button>
                            <Button size="large" className="mr-16" onClick={() => {
                                exportSpecialPermitList(this.obtainQueryParam(this.props), ({res, err}) => {
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
                                        <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                        实付金额总计 <span
                                            style={{fontWeight: 600}}>{(selectedRowSum.Amount || 0) / 100}</span> 元
                                        已发放金额总计 <span
                                            style={{fontWeight: 600}}>{(selectedRowSum.PaidAmount || 0) / 100}</span> 元
                                        未发放金额总计 <span
                                            style={{fontWeight: 600}}>{(selectedRowSum.UnPayAmount || 0) / 100}</span> 元
                                        <a onClick={() => setParams({
                                            selectedRowKeys: [],
                                            selectedRowSum: {}
                                        })}
                                           style={{marginLeft: 24}}>清空</a>
                                    </p>
                                )}/>
                        </Row>
                        <Table
                            rowKey={'SubsidyApplyID'} bordered={true} size='small' scroll={{x: 2500}}
                            rowSelection={{
                                onChange: this.handleTableRowSelection,
                                selectedRowKeys,
                                getCheckboxProps: record => ({
                                    disabled: record.SpecialPermit === 3 || record.SpecialPermit !== 3 && (record.PayStatus === 2 || record.PayStatus === 3) || !record.SubsidyApplyID
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
                                {
                                    title: '签到日期', dataIndex: 'CheckInTimeStr',
                                    sorter: true, width: 120, fixed: 'left',
                                    key: 'OrderByCheckInTime',
                                    sortOrder: this.props.orderParam.OrderByCheckInTime
                                },
                                {title: '会员姓名', dataIndex: 'RealName', width: 100, fixed: 'left'},
                                {title: '手机号码', dataIndex: 'Mobile'},
                                {title: '面试企业', dataIndex: 'PositionName'},
                                {
                                    title: '企业类型', dataIndex: 'PayType',
                                    render: text => text === 0 ? '我打' : text === 1 ? "周薪薪" : text
                                },
                                {title: '劳务公司', dataIndex: 'ShortName'},
                                {
                                    title: '考勤', dataIndex: 'UserCountdownCheckinFlow',
                                    render: text => text && text.CheckinPicPath ? <a onClick={
                                        () => getClient({bucket: oss.bucket_private}).then((client) => {
                                            let url = client.signatureUrl(text.CheckinPicPath);
                                            Modal.info({
                                                title: '查看考勤',
                                                content: <img alt="会员考勤" className="custom-image"
                                                              src={url}/>
                                            });
                                        })
                                    }>查看</a> : <span className="color-red">未上传</span>
                                },
                                {title: '结束日期', dataIndex: 'endDateStr'},
                                {
                                    title: '性别', dataIndex: 'Gender',
                                    render: text => Gender[text]
                                },
                                {
                                    title: '男补', dataIndex: 'MaleSubsidyAmount',
                                    render: text => Number.isInteger(text) ? text / 100 : text
                                },
                                {
                                    title: '女补', dataIndex: 'FeMaleSubsidyAmount',
                                    render: text => Number.isInteger(text) ? text / 100 : text
                                },
                                {
                                    title: '实付金额', dataIndex: 'Amount',
                                    render: text => Number.isInteger(text) ? text / 100 : text
                                },
                                {
                                    title: '能否补贴', dataIndex: 'SubsidyStatus',
                                    render: text => text === 1 ? <span className="color-orange">未结算</span> :
                                        text === 2 ? <span className="color-green">可补</span> :
                                            text === 3 ? <span className="color-red">不可补</span> : text
                                }, {
                                    title: '付款状态', dataIndex: 'PayStatus',
                                    render: text => text === 1 ? <span className="color-orange">未付款</span> :
                                        text === 2 ? <span className="color-green">付款中</span> :
                                            text === 3 ? <span className="color-green">已付款</span> : 
                                                text === 4 ? <span className="color-orange">付款失败</span> : text
                                },
                                {
                                    title: '审核状态', dataIndex: 'SpecialPermit',
                                    render: text => text === 1 ? <span className='color-orange'>待审核</span> :
                                        text === 2 ? <span className='color-green'>已通过</span> :
                                            text === 3 ? <span className='color-red'>已拒绝</span> : text
                                },
                                {title: '发放备注', dataIndex: 'SpecialPermitReason'},
                                {title: "操作", dataIndex: "", render: (text, record) => <a onClick={() => this.visible(true, record)}>补贴审核记录</a>},
                                {title: '发放审核人', dataIndex: 'SpecialPermitLoginName'},
                                {title: '发放审核时间', dataIndex: 'SpecialPermitTimeStr'},
                                {title: '申请时间', dataIndex: 'CreateTimeStr'}
                            ]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {
                                    pageParam: {currentPage, pageSize: pagination.pageSize}
                                };
                                if (sorter.columnKey) {
                                    change.orderParam = {[sorter.columnKey]: sorter.order};
                                }
                                setParams(change);
                            }}/>
                    </Card>
                    <SubsidyAuditRecordModal 
                        RecordList={this.state.RecordList}
                        handleModalConfirm={this.visible}
                        visible={this.state.visible}
                        />
                </div>
            </div>
        );
    }
}