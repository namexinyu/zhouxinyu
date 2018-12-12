import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Modal,
    Input,
    Table,
    Button,
    DatePicker,
    message
} from 'antd';
import {PickupMode} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import moment from 'moment';
import DispatchOrderAction from 'ACTION/Finance/TradeManage/DispatchOrderAction';
import 'LESS/Finance/TradeManage/trade-manage.less';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import oss from 'CONFIG/ossConfig';

const {getDispatchOrderList, exportDispatchOrderList} = DispatchOrderAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_dispatch';

class DispatchOrder extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.queryTableList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam || this.props.tagParam !== nextProps.tagParam) {
            this.queryTableList(nextProps);
        }

        if (nextProps.exportDispatchOrderListFetch.status === 'success') { // 导出订单
            setFetchStatus(STATE_NAME, 'exportDispatchOrderListFetch', 'close');
            let url = nextProps.exportDispatchOrderListFetch.response.Data && nextProps.exportDispatchOrderListFetch.response.Data.URL;
            window.open(url);
        } else if (nextProps.exportDispatchOrderListFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'exportDispatchOrderListFetch', 'close');
            message.error(nextProps.exportDispatchOrderListFetch.response && nextProps.exportDispatchOrderListFetch.response.Desc ? nextProps.exportDispatchOrderListFetch.response.Desc : '导出失败');
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let query = {
            Date: props.q_Date.value,

            HubInfo: props.q_Merchant.value,
            UserInfo: props.q_Customer.value
        };
        if (query.Date && query.Date instanceof Array) {
            query.DateBegin = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.DateEnd = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
        }
        delete query.Date;

        if (props.tagParam && props.tagParam.length) {
            let param = {};
            for (let i of props.tagParam) {
                let parr = i.split('__');
                if (!param[parr[0]]) param[parr[0]] = [];
                param[parr[0]].push(Number(parr[1]));
            }
            query = {...query, QuickPick: param};
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
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 1 : 0;
        }
        getDispatchOrderList({
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
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="日期">
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
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="企业信息">
                            {getFieldDecorator('q_Merchant')(
                                <Input placeholder="请输入企业信息"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员信息">
                            {getFieldDecorator('q_Customer')(
                                <Input placeholder="请输入会员信息"/>
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

    renderDispatchModal() {
        return (
            <Modal
                width={700} title="查看凭证" className="checkin-modal"
                visible={this.props.dispatchModal.Visible}
                onOk={() => setParams(STATE_NAME, {dispatchModal: {Visible: false, URL: null}})}
                onCancel={() => setParams(STATE_NAME, {dispatchModal: {Visible: false, URL: null}})}>
                <div className="checkin-content">
                    {this.props.dispatchModal.URL &&
                    <img alt="凭证" className="custom-image" src={this.props.dispatchModal.URL}/>}
                </div>
            </Modal>
        );
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>报销订单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        {this.renderForm()}
                        {this.renderDispatchModal()}
                        <div className="mb-16 text-right">
                            <Button size="large" className="ml-16"
                                    onClick={() => {
                                        exportDispatchOrderList(this.obtainQueryParam(this.props));
                                    }}>导出订单</Button>
                        </div>
                        <Table
                            rowKey={'DispClaimID'} bordered={true}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.pageParam.pageSize,
                                current: this.props.pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            columns={[{
                                title: '创建时间',
                                dataIndex: 'CreateTime',
                                sorter: true,
                                key: 'SequenceCreateTime',
                                sortOrder: this.props.orderParam.SequenceCreateTime
                            }, {
                                title: '企业信息',
                                dataIndex: 'HubInfo'
                            }, {
                                title: '会员信息',
                                dataIndex: 'UserInfo'
                            }, {
                                title: '报销金额',
                                dataIndex: 'Money',
                                render: text => Number.isInteger(text) ? text / 100 + '元' : ''
                            }, {
                                title: '报销凭证',
                                dataIndex: 'URL',
                                render: (text, record) => (<a onClick={() => {
                                    getClient({isPublic: true}).then((client) => {
                                        setParams(STATE_NAME, {
                                            dispatchModal: {
                                                Visible: true,
                                                URL: client.getPublicUrl(record.URL)
                                            }
                                        });
                                    });
                                }}>查看</a>)
                            }, {
                                title: '报销方式',
                                dataIndex: 'PayType',
                                render: text => text === 1 ? '虚拟账户扣款' : text === 2 ? '现金' : ''
                            }, {
                                title: '操作时间',
                                dataIndex: 'ModifyTime'
                            }]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                if (sorter.columnKey) {
                                    change.orderParam = {
                                        [sorter.columnKey]: sorter.order
                                    };
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
})(DispatchOrder);