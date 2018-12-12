import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Alert,
    Input,
    Radio,
    Modal,
    Table,
    Button,
    DatePicker,
    message
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import TagSelect from 'COMPONENT/TagSelect';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import CommonAction from 'ACTION/Finance/Common';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import moment from 'moment';
import ComplainOrderAction from 'ACTION/Finance/TradeManage/ComplainOrderAction';
import {
    OrderStep, AuditStatus
} from 'CONFIG/EnumerateLib/Mapping_Order';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import oss from 'CONFIG/ossConfig';

const {
    getComplainOrderList, exportComplainOrderList,
    getComplainCheck, appealComplainOrder
} = ComplainOrderAction;

const {getLaborSimpleList} = CommonAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {TextArea} = Input;

const STATE_NAME = 'state_finance_trade_complain';

class InviteOrder extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getLaborSimpleList(); // 劳务公司模糊下拉数据
            this.queryTableList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam || this.props.tagParam !== nextProps.tagParam) {
            this.queryTableList(nextProps);
        }

        if (nextProps.exportComplainOrderListFetch.status === 'success') { // 导出订单
            setFetchStatus(STATE_NAME, 'exportComplainOrderListFetch', 'close');
            let url = nextProps.exportComplainOrderListFetch.response.Data && nextProps.exportComplainOrderListFetch.response.Data.FileUrl;
            window.open(url);
        } else if (nextProps.exportComplainOrderListFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'exportComplainOrderListFetch', 'close');
            message.error(nextProps.exportComplainOrderListFetch.response && nextProps.exportComplainOrderListFetch.response.Desc ? nextProps.exportComplainOrderListFetch.response.Desc : '导出失败');
        }

        if (nextProps.appealComplainOrderFetch.status === 'success') { // 审核处理
            setFetchStatus(STATE_NAME, 'appealComplainOrderFetch', 'close');
            message.success('处理成功');
            setParams(STATE_NAME, {appealModal: {Visible: false, ComplainID: null, auditStatus: 2}});
            this.queryTableList(nextProps);
        } else if (nextProps.appealComplainOrderFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'appealComplainOrderFetch', 'close');
            message.error(nextProps.appealComplainOrderFetch.response && nextProps.appealComplainOrderFetch.response.Desc ? nextProps.appealComplainOrderFetch.response.Desc : '处理失败');
        }

        if (nextProps.getComplainCheckFetch.status === 'success') { // 获取会员考勤
            setFetchStatus(STATE_NAME, 'getComplainCheckFetch', 'close');
            getClient({bucket: oss.bucket_private}).then((client) => {
                setParams(STATE_NAME, {
                    checkinModal: {
                        ...nextProps.checkinModal, Visible: true,
                        CheckinDate: nextProps.getComplainCheckFetch.response.Data.CheckinDate,
                        EntName: nextProps.getComplainCheckFetch.response.Data.EntName,
                        JobNum: nextProps.getComplainCheckFetch.response.Data.JobNum,
                        PictureUrl: client.signatureUrl(nextProps.getComplainCheckFetch.response.Data.PictureUrl)
                    }
                });
            });
        } else if (nextProps.getComplainCheckFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'getComplainCheckFetch', 'close');
            message.error(nextProps.getComplainCheckFetch.response && nextProps.getComplainCheckFetch.response.Desc ? nextProps.getComplainCheckFetch.response.Desc : '获取失败');
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let query = {
            LaborID: props.q_Labor.value && props.q_Labor.value.value ? Number(props.q_Labor.value.value) : null,
            LaborName: props.q_Labor.value && props.q_Labor.value.text ? props.q_Labor.value.text : null,

            Date: props.q_Date.value,
            UserName: props.q_UserName.value
        };
        if (query.Date && query.Date instanceof Array) {
            query.StarTime = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.EndTime = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
        }
        delete query.Date;

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

        getComplainOrderList({
            ...this.obtainQueryParam(props), ...orderParam,
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
            setParams(STATE_NAME, {pageParam: {...this.props.pageParam, currentPage: 1}});
        });
    };

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row type="flex" justify="start">
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="申诉日期">
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
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员姓名">
                            {getFieldDecorator('q_UserName')(
                                <Input placeholder="请输入会员姓名"/>
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

    renderCheckinModal() {
        return (
            <Modal
                width={700} title="会员考勤" className="checkin-modal"
                visible={this.props.checkinModal.Visible}
                onOk={() => setParams(STATE_NAME, {checkinModal: {Visible: false}})}
                onCancel={() => setParams(STATE_NAME, {checkinModal: {Visible: false}})}>
                <div className="checkin-content">
                    {this.props.checkinModal.PictureUrl && <img alt="会员考勤" className="custom-image"
                                                                src={this.props.checkinModal.PictureUrl}/>}
                    <div>工厂：{this.props.checkinModal.EntName}</div>
                    <div>姓名：{this.props.checkinModal.RealName}</div>
                    <div>工号：{this.props.checkinModal.JobNum}</div>
                    <div>考勤日期：{this.props.checkinModal.CheckinDate}</div>
                </div>
            </Modal>
        );
    }

    renderAppealModal() {
        return (
            <Modal
                title="申诉审核"
                visible={this.props.appealModal.Visible}
                onOk={(e) => {
                    e.preventDefault();
                    if (this.props.appealModal.auditStatus === 2 || this.props.appealModal.Remark) {
                        let param = {
                            ComplainID: this.props.appealModal.ComplainID,
                            FinanceSettleStatus: this.props.appealModal.auditStatus,
                            FinanceReason: this.props.appealModal.Remark
                        };
                        if (this.props.appealModal.auditStatus === 2) delete param.FinanceReason;
                        appealComplainOrder(param);
                    }
                }}
                onCancel={() => {
                    setParams(STATE_NAME, {appealModal: {Visible: false, ComplainID: null, auditStatus: 2}});
                }}>
                <Form>
                    <FormItem label="申诉审核" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        <RadioGroup
                            options={[{label: '审核通过', value: 2}, {label: '审核拒绝', value: 3}]}
                            onChange={(e) => {
                                setParams(STATE_NAME, {
                                    appealModal: {...this.props.appealModal, auditStatus: e.target.value}
                                });
                            }}
                            value={this.props.appealModal.auditStatus}/>
                    </FormItem>
                    {this.props.appealModal.auditStatus === 3 &&
                    <FormItem label="审核备注" labelCol={{span: 5}} wrapperCol={{span: 18}}
                              validateStatus={this.props.appealModal.Remark && this.props.appealModal.Remark.length > 0 ? '' : 'error'}
                              help={this.props.appealModal.Remark && this.props.appealModal.Remark.length > 0 ? '' : '请填写备注'}>
                        <TextArea style={{minHeight: 32}} placeholder="请填写审核备注" rows={4}
                                  onChange={(e) => {
                                      setParams(STATE_NAME, {
                                          appealModal: {...this.props.appealModal, Remark: e.target.value}
                                      });
                                  }}/>
                    </FormItem>}
                </Form>
            </Modal>);
    }

    render() {
        return (
            <div className="container-fluid pt-24 pb-24">
                <Card bordered={false}>
                    {this.renderForm()}
                    {this.renderCheckinModal()}
                    {this.renderAppealModal()}
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
                                {Object.entries(AuditStatus).map(item => (
                                    <TagSelect.Option key={item[0]}
                                                      value={'AuditStatus__' + item[0]}>{item[1]}</TagSelect.Option>
                                ))}
                            </TagSelect>
                        </Col>
                    </Row>
                    <div className="mb-16 text-right">
                        <Button size="large" className="ml-16"
                                onClick={() => {
                                    exportComplainOrderList(this.obtainQueryParam(this.props));
                                }}>导出订单</Button>
                    </div>
                    <Table
                        rowKey={'ComplainID'} bordered={true}
                        pagination={{
                            total: this.props.RecordCount,
                            pageSize: this.props.pageParam.pageSize,
                            current: this.props.pageParam.currentPage,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                        }}
                        columns={[{
                            title: '申诉时间',
                            dataIndex: 'ComplainTime',
                            sorter: true,
                            key: 'ComplainTimeOrder',
                            sortOrder: this.props.orderParam.ComplainTimeOrder
                        }, {
                            title: '会员姓名',
                            dataIndex: 'UserName'
                        }, {
                            title: '劳务公司',
                            dataIndex: 'LaborName'
                        }, {
                            title: '企业',
                            dataIndex: 'PositionName'
                        }, {
                            title: '会员状态',
                            dataIndex: 'OrderStep',
                            render: text => OrderStep[text]
                        }, {
                            title: '会员考勤',
                            dataIndex: 'other',
                            render: (text, record) => (
                                <a onClick={() => {
                                    getComplainCheck({ComplainID: record.ComplainID});
                                    setParams(STATE_NAME, {
                                        checkinModal: {...this.props.checkinModal, RealName: record.UserName}
                                    });
                                }}>查看</a>
                            )
                        }, {
                            title: '处理结果',
                            dataIndex: 'HandleDay',
                            render: (text, record) => {
                                let money = Number.isInteger(record.HandleMoney) ? record.HandleMoney / 100 : 0;
                                return `${text}天${money}元`;
                            }
                        }, {
                            title: '审核状态',
                            dataIndex: 'AuditStatus',
                            render: text => AuditStatus[text]
                        }, {
                            title: '操作',
                            render: (text, record) => (
                                record.AuditStatus === 1 ?
                                    <a onClick={() => {
                                        setParams(STATE_NAME, {
                                            appealModal: {Visible: true, ComplainID: record.ComplainID, auditStatus: 2}
                                        });
                                    }}>审核</a>
                                    : <span>-</span>
                            )
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
})(InviteOrder);