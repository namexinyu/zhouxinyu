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
    Modal,
    Icon,
    Upload
} from 'antd';
import TagSelect from 'COMPONENT/TagSelect';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import moment from 'moment';
import CommonAction from 'ACTION/Finance/Common';
import overviewAction from 'ACTION/Finance/overviewAction';
import InterviewSubsidyAction from 'ACTION/Finance/TradeManage/InterviewSubsidyAction';
import resetState from 'ACTION/resetState';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import {
    OrderStep, AuditStatusNew, JFFInterviewStatus, ServiceInterviewStatus, InterviewSettleStatus
} from 'CONFIG/EnumerateLib/Mapping_Order';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import oss from 'CONFIG/ossConfig';
import {exportUserSubsidyApplyList} from 'SERVICE/Finance/TradeManage/InterviewSubsidyService';
import SubsidyAuditRecord from "SERVICE/Finance/TradeManage/InterviewSubsidyService";
import {Gender} from "CONFIG/EnumerateLib/Mapping_Recruit";
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import SubsidyAuditRecordModal from "../SubsidyAuditRecord/index";
const {getRecruitSimpleList, getLaborSimpleList} = CommonAction;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const {getUserSubsidyApplyList, auditSubsidyApply} = InterviewSubsidyAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_subsidy_order';
const ModalInfo = Modal.info;
const IMG_PATH = oss.getImgPath();
const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传</div>
    </div>
  );
const CheckInFlowModal = ({CheckInFlowModalItem, handleModalCancel, handleModalSubmit}) => {
    return (
        <Modal width={1200}
               title="查看" visible={CheckInFlowModalItem.Visible}
               onCancel={handleModalCancel} onOk={handleModalSubmit}>
            <Table
                rowKey={'SubsidyApplyID'} bordered={true} size='small' pagination={false}
                columns={[
                    {title: '签到日期', dataIndex: 'CheckInTime'},
                    {title: '会员姓名', dataIndex: 'RealName'},
                    {title: '手机号码', dataIndex: 'Mobile'},
                    {title: '身份证', dataIndex: 'IDCardNum'},
                    {title: '面试企业', dataIndex: 'PositionName'},
                    {title: '劳务公司', dataIndex: 'ShortName'},
                    {
                        title: '企业类型', dataIndex: 'PayType',
                        render: text => text === 0 ? '我打' : text === 1 ? "周薪薪" : ''
                    },

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
                        title: '订单价', dataIndex: 'LaborSubsidyAmount',
                        render: text => Number.isInteger(text) ? text / 100 : ''
                    },
                    {
                        title: '已收', dataIndex: 'LaborSubsidyAmountReal',
                        render: text => Number.isInteger(text) ? text / 100 : ''
                    },
                    {
                        title: '会员补贴', dataIndex: 'UserSubsidyAmount',
                        render: text => Number.isInteger(text) ? text / 100 : ''
                    },
                    {
                        title: '结算状态', dataIndex: 'SettleStatus',
                        render: text => <span className={text === 2 ? 'color-green' : ''}>
                                        {InterviewSettleStatus.get(text)}
                                    </span>
                    },
                    {title: '备注', dataIndex: 'Reason'}
                ]}
                dataSource={[CheckInFlowModalItem]}/>
        </Modal>
    );
};

const AuditUserSubsidyModal = Form.create({
    mapPropsToFields: props => ({...props.AuditUserSubsidyModalItem}),
    onFieldsChange: (props, fields) => props.setParams('AuditUserSubsidyModalItem', fields)
})(({form, AuditUserSubsidyModalItem, handleModalCancel, handlePictureUpload, handleModalSubmit, preview, Dle, imgs}) => {
    
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 18}};
    return (
        <Modal
            title={(AuditUserSubsidyModalItem || {}).ModalType === 'audit' ? "补贴审核" : "取消作废"}
            visible={AuditUserSubsidyModalItem.Visible}
            onCancel={handleModalCancel} confirmLoading={AuditUserSubsidyModalItem.confirmLoading}
            onOk={() => {
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    handleModalSubmit(fieldsValue);
                });
            }}>
            <Form>
                {(AuditUserSubsidyModalItem || {}).ModalType === 'audit' ? <FormItem label="审核状态" {...formItemLayout}>
                    {getFieldDecorator('AuditStatus', {
                        rules: [{required: true}, {message: '请选择审核状态'}],
                        initialValue: '1'
                    })(
                        <RadioGroup>
                            <Radio value='3'>通过</Radio>
                            <Radio value='4'>作废</Radio>
                        </RadioGroup>
                    )}
                </FormItem> : ''}
                {form.getFieldValue('AuditStatus') == 4 && <FormItem label="备注" {...formItemLayout}>
                    {getFieldDecorator('AuditReason')(
                        <TextArea style={{minHeight: 32}} placeholder="请填写原因" rows={4}/>
                    )}
                
                </FormItem>}
                <div style={{display: 'flex', flexDirection: 'column', margin: "0 0 0 3%"}}>
                    <Upload id="imgs" accept="image/jpeg,image/png"
                                listType="picture-card"
                                fileList={imgs}
                                beforeUpload={(file) => handlePictureUpload(file)}
                                onPreview = {(file) => preview(file.url)}
                                onRemove={(file) => Dle(file)}
                                name="avatar">
                            {imgs.length >= 3 ? "" : uploadButton}
                        </Upload>
                    <span>支持上传3个截图，每个大小不得超过2M</span>
                </div>
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
                <Col span={6}>
                    <FormItem {...formItemLayout} label="周薪薪类型">
                        {getFieldDecorator('ZXXType')(
                            <Select>
                                <Option value={"-9999"}>全部</Option>
                                <Option value={"1"}>1.0</Option>
                                <Option value={"2"}>2.0</Option>
                            </Select>
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
                <Col span={22} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
});

export default class SubsidyOrder extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            RecordList: [],
            imgs: [],
            Uploadvalue: true,
            previewVisible: false,
            previewUrl: "",
            visible: false,
            UnissuedType: false
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
            if (this.props.location.query && (this.props.location.query.auditStatus || this.props.location.query.payStatus)) {
                let queryObj = {
                    auditStatus: this.props.location.query.auditStatus + '',
                    payStatus: this.props.location.query.payStatus + ''
                };
                overviewAction(STATE_NAME, queryObj);
            } else {
                this.queryTableList();
            }
        }
        getLaborSimpleList(); // 劳务公司模糊下拉数据
        getRecruitSimpleList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }

        if (nextProps.auditSubsidyApplyFetch.status === 'success') { // 推荐费发放
            setFetchStatus(STATE_NAME, 'auditSubsidyApplyFetch', 'close');
            let RecordList = nextProps.auditSubsidyApplyFetch.response.Data.RecordList;
            let info = '审核成功';
            if (RecordList && RecordList instanceof Array) {
                let successCount = 0;
                let failureCount = 0;
                let AbnormalCount = 0;
                for (let data of RecordList) {
                    if (data.Result === 1) {
                        successCount++;
                    } else if (data.Result === 3) {
                        AbnormalCount++;
                    } else {
                        failureCount++;
                    }
                }
                info = `${successCount}个订单审核成功，${failureCount}个订单审核失败, ${AbnormalCount}个进入特批`;
            }
            message.info(info);
            this.handleModalVisible('AuditUserSubsidyModal');
            if (!__PROD__)
                Modal.info({
                    title: '结果', width: 600,
                    content: <div>
                        {RecordList.map((item, index) => <pre key={index}>
                            {`id: ${item.SubsidyApplyID}，${item.ErrorInfo}`}
                        </pre>)}
                    </div>
                });
                this.setState({
                    imgs: []
                });
            this.queryTableList();
        } else if (nextProps.auditSubsidyApplyFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'auditSubsidyApplyFetch', 'close');
            message.error(nextProps.auditSubsidyApplyFetch.response && nextProps.auditSubsidyApplyFetch.response.Desc ? nextProps.auditSubsidyApplyFetch.response.Desc : '设置失败');
        }
    }


    handleModalVisible(modalName, Visible, ModalType = '') {
        if (modalName === 'AuditUserSubsidyModal' || modalName === 'CheckInFlowModal') {
            if (Visible === true) {
                this.setParams(modalName + 'Item', {Visible, ModalType});
            } else {
                resetState(STATE_NAME, modalName + 'Item');
            }
        }
    }

    handleAuditUserSubsidyModalSubmit = (fieldsValue) => {
        console.log(fieldsValue);
        let AuditStatus = Number(fieldsValue.AuditStatus);
        if ((this.props.AuditUserSubsidyModalItem || {}).ModalType === 'cancel') AuditStatus = 2;
        let PicPathList = [];
        if (this.state.imgs.length > 0) {
            console.log(this.state.imgs, "444444444444444444444444");
            this.state.imgs.map((item) => {
                PicPathList.push(item.rawUrl);
            });
        }
        auditSubsidyApply({
            AuditStatus: AuditStatus,
            SubsidyApplyIDs: this.props.selectedRowKeys,
            AuditReason: fieldsValue.AuditReason || '',
            PicPathList: PicPathList
        });
    };

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        const selectedRowSum = selectedRows.reduce((pre, cur) => {
            pre.Amount += cur.Amount;
            if (cur.PayStatus === 1) pre.UnPayAmount += cur.Amount;
            if (cur.PayStatus === 3) pre.PaidAmount += cur.Amount;
            return pre;
        }, {Amount: 0, PaidAmount: 0, UnPayAmount: 0});
        let AuditEnable = true;
        let CancelEnable = true;
        let UnissuedEnable = true;
        for (let item of selectedRows) {
            AuditEnable = AuditEnable && (item.AuditStatus === 2 || item.AuditStatus === 1);
            CancelEnable = CancelEnable && item.AuditStatus === 4;
            UnissuedEnable = UnissuedEnable && (item.AuditStatus === 3);
        }
        setParams(STATE_NAME, {
            selectedRowKeys,
            selectedRowSum: selectedRowSum,
            AuditEnable,
            CancelEnable,
            UnissuedEnable
        });
    };

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['PayType', "ZXXType"];
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
            query.AuditTimeBegin = query.AuditDate[0] ? query.AuditDate[0].format('YYYY-MM-DD') : null;
            query.AuditTimeEnd = query.AuditDate[1] ? query.AuditDate[1].format('YYYY-MM-DD') : null;
            delete query.AuditDate;
        }

        if (query.Recruit) {
            query.PositionName = query.Recruit.text;
            query.RecruitTmpID = query.Recruit.data ? query.Recruit.data.RecruitTmpID : null;
            if (query.RecruitTmpID) delete query.PositionName;
            delete query.Recruit;
        }

        if (query.Labor) {
            query.ShortName = query.Labor.text || '';
            query.LaborID = query.Labor.data ? query.Labor.data.LaborID : null;
            if (query.LaborID) delete query.ShortName;
            delete query.Labor;
        }

        if (props.SubsidyStatusTagParam && props.SubsidyStatusTagParam.length === 1) query.SubsidyStatus = Number(props.SubsidyStatusTagParam[0]);
        if (props.AuditStatusTagParam && props.AuditStatusTagParam.length > 0) query.AuditStatus = props.AuditStatusTagParam.map((item) => {
            return Number(item);
        });
        if (props.PayStatusTagParam && props.PayStatusTagParam.length > 0) query.PayStatus = props.PayStatusTagParam.map((item) => {
            return Number(item);
        });

        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1]) || Number.isNaN(data[1])) delete query[data[0]];
        });
        return query;
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
                    message.info(info);
                    that.setState({
                        UnissuedType: false
                    });
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
    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        let orderParam = {};
        if (props.orderParam && Object.keys(props.orderParam).length) {
            let orderKey = Object.keys(props.orderParam)[0];
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 1 : 2;
        }
        getUserSubsidyApplyList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});
    handlePictureUpload=(file, index)=> {
        if (!oss.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
              this.setState({
                imgs: this.state.imgs.concat({
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    customPath: IMG_PATH,
                    rawUrl: res.name,
                    url: IMG_PATH + res.name
                })
              });
            } else {
                message.info('图片上传失败');
                console.log('fail', message);
            }
            
        }, "/web/eventlist/imgs");
        
        return false;
    }
    Dle = (data) => {
        let imgs = [];
        this.state.imgs.map((Item) => {
            if (data.uid !== Item.uid) {
                imgs.push(Item);
            }
        });
        this.setState({
            imgs: imgs
        });
    }
    preview=(a)=> {
        this.setState({
            previewVisible: true,
            previewUrl: a
        });
    }
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
    render() {
        const setParams = this.setParams;
        const {selectedRowKeys, selectedRowSum} = this.props;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>补贴管理</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <CheckInFlowModal
                            CheckInFlowModalItem={this.props.CheckInFlowModalItem}
                            setParams={setParams}
                            handleModalSubmit={() => this.handleModalVisible('CheckInFlowModal')}
                            handleModalCancel={() => this.handleModalVisible('CheckInFlowModal')}/>
                        <AuditUserSubsidyModal
                            handlePictureUpload={this.handlePictureUpload}
                            Dle={this.Dle}
                            imgs={this.state.imgs}
                            preview={this.preview}
                            AuditUserSubsidyModalItem={this.props.AuditUserSubsidyModalItem}
                            setParams={setParams}
                            handleModalSubmit={this.handleAuditUserSubsidyModalSubmit}
                            handleModalCancel={() => this.handleModalVisible('AuditUserSubsidyModal')}/>
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
                                    <TagSelect.Option value="2">可补</TagSelect.Option>
                                    <TagSelect.Option value="3">不可补</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>
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
                                    <TagSelect.Option value="4">已作废</TagSelect.Option>
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
                                    <TagSelect.Option value="2">付款中</TagSelect.Option>
                                    <TagSelect.Option value="3">已付款</TagSelect.Option>
                                    <TagSelect.Option value="4">付款失败</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>
                        <Row className="mb-16">
                            <Button size="large" className="mr-16" type='primary'
                                    onClick={() => this.handleModalVisible('AuditUserSubsidyModal', true, 'audit')}
                                    disabled={!(this.props.selectedRowKeys || []).length > 0 || !this.props.AuditEnable || this.state.UnissuedType}
                                   >
                                补贴审核</Button>
                            <Button size="large" className="mr-16" type='primary'
                                    onClick={() => this.handleModalVisible('AuditUserSubsidyModal', true, 'cancel')}
                                    disabled={!(this.props.selectedRowKeys || []).length > 0 || !this.props.CancelEnable || this.state.UnissuedType}>
                                取消作废</Button>
                            <Button size="large" className="mr-16" onClick={() => {
                                exportUserSubsidyApplyList(this.obtainQueryParam(this.props), ({res, err}) => {
                                    if (res && res.FileUrl) {
                                        window.open(res.FileUrl);
                                        message.success('导出成功');
                                    } else {
                                        message.error(err ? err : '导出失败');
                                    }
                                });
                            }}>导出订单</Button>
                            <Button size="large" className="mr-16" type='primary'
                                    onClick={() => this.UserSubsidyToBank(selectedRowKeys)}
                                    disabled={!(this.props.selectedRowKeys || []).length > 0 || !this.props.UnissuedEnable || this.state.UnissuedType}>
                                付款</Button>
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
                                    disabled: (record.AuditStatus !== 1 && record.AuditStatus !== 2 && record.AuditStatus !== 4 && (record.AuditStatus == 3 && record.PayStatus === 2 || record.AuditStatus == 3 && record.PayStatus === 3)) || !record.SubsidyApplyID || record.SpecialPermit > 0
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
                                {
                                    title: '身份证',
                                    key: 'IDCardNum',
                                    render: (text, record) => (record.UserOrderSettle || {}).IDCardNum || ''
                                },
                                {title: '面试企业', dataIndex: 'PositionName'},
                                {title: '劳务公司', dataIndex: 'ShortName'},
                                {
                                    title: '企业类型', dataIndex: 'PayType',
                                    render: text => text === 0 ? '我打' : text === 1 ? "周薪薪" : text
                                },
                                {
                                    title: '考勤', dataIndex: 'UserCountdownCheckinFlow',
                                    render: text => text && text.CheckinPicPath ? <a onClick={
                                        () => getClient({bucket: oss.bucket_private}).then(client => {
                                            let url = client.signatureUrl(text.CheckinPicPath);
                                            ModalInfo({
                                                title: '查看考勤', width: 640,
                                                content: <img alt="会员考勤" className="custom-image"
                                                              style={{maxWidth: '100%', height: 'auto'}}
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
                                    title: '申请补贴',
                                    dataIndex: 'xx',
                                    render: (text, record) => Number.isInteger(record.Amount) ? record.Amount / 100 : ''
                                },
                                {
                                    title: '实付金额', dataIndex: 'Amount',
                                    render: text => Number.isInteger(text) ? text / 100 : text
                                },
                                {
                                    title: '能否补贴', dataIndex: 'SubsidyStatus',
                                    render: text => text === 1 ? <span className="color-orange">未结算</span> :
                                        text === 2 ? <span className="color-green">可补</span> :
                                            text === 3 ? <span className="color-red">不可补</span> : '-'
                                },
                                {
                                    title: '审核状态', dataIndex: 'AuditStatus',
                                    render: text => text === 1 || text === 2 ?
                                        <span className='color-orange'>待审核</span> :
                                        text === 3 ? <span className='color-green'>已通过</span> :
                                            text === 4 ? <span className='color-orange'>已作废</span> : '-'
                                },
                                {title: '作废原因', dataIndex: 'AuditReason'},
                                {
                                    title: '付款状态', dataIndex: 'PayStatus',
                                    render: text => text === 1 ? <span className="color-orange">未付款</span> :
                                        text === 2 ? <span className="color-green">付款中</span> :
                                            text === 3 ? <span className="color-green">已付款</span> : 
                                                text === 4 ? <span className="color-red">付款失败</span> : '-'
                                },
                                {
                                    title: '是否特批', dataIndex: 'SpecialPermit',
                                    render: text => text > 0 ? '特批' : ''
                                },
                                {
                                    title: '操作', dataIndex: 'UserOrderSettle',
                                    render: (text, record) => <span><a onClick={() => {
                                        setParams('CheckInFlowModalItem', {...record, ...text, Visible: true});
                                    }
                                    }>查看面试名单</a><a style={{margin: "0 3px"}}>|</a><a onClick={() => this.visible(true, record)}>补贴审核记录</a>
                                    </span>
                                },
                                {title: '审核人', dataIndex: 'AuditLoginName'},
                                {title: '审核时间', dataIndex: 'AuditTimeStr'},
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
                </div>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>this.setState({previewVisible: false})}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewUrl} />
                </Modal>
                <SubsidyAuditRecordModal 
                    RecordList={this.state.RecordList}
                    handleModalConfirm={this.visible}
                    visible={this.state.visible}
                    />
            </div>
        );
    }
}