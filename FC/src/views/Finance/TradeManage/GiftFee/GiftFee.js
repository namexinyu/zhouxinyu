import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Table,
    Button,
    Modal,
    DatePicker,
    message
} from 'antd';
import {PromiseSettleDelay, OrderSettleStatus} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import moment from 'moment';
import GiftfeeAction from 'ACTION/Finance/TradeManage/GiftfeeAction';
import 'LESS/Finance/TradeManage/trade-manage.less';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import oss from 'CONFIG/ossConfig';

const {getGiftFeeList, exportGiftFeeList} = GiftfeeAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_giftfee';

class GiftFee extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.queryTableList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }

        if (nextProps.exportGiftFeeListFetch.status === 'success') { // 导出订单
            setFetchStatus(STATE_NAME, 'exportGiftFeeListFetch', 'close');
            let url = nextProps.exportGiftFeeListFetch.response.Data && nextProps.exportGiftFeeListFetch.response.Data.URL;
            window.open(url);
        } else if (nextProps.exportGiftFeeListFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'exportGiftFeeListFetch', 'close');
            message.error(nextProps.exportGiftFeeListFetch.response && nextProps.exportGiftFeeListFetch.response.Desc ? nextProps.exportGiftFeeListFetch.response.Desc : '导出失败');
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
        let orderParam = {}; // 排序
        if (props.orderParam && Object.keys(props.orderParam).length) {
            let orderKey = Object.keys(props.orderParam)[0];
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 1 : 0;
        }
        let filterParam = {}; // table列筛选
        if (props.filterParam) {
            for (let f in props.filterParam) {
                let ff = props.filterParam[f];
                // if (ff instanceof Array && ff.length)
                filterParam[f] = ff.map(item => Number(item));
            }
        }
        getGiftFeeList({
            ...this.obtainQueryParam(props), ...orderParam, ...filterParam,
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

    renderModal() {
        return (
            <Modal
                width={700} title="查看工牌" className="checkin-modal"
                visible={this.props.modalVisible}
                onOk={() => setParams(STATE_NAME, {modalVisible: false, URL: null})}
                onCancel={() => setParams(STATE_NAME, {modalVisible: false, URL: null})}>
                <div className="checkin-content">
                    {this.props.URL && <img alt="工牌" className="custom-image"
                                            src={this.props.URL}/>}
                </div>
            </Modal>
        );
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>赠品押金</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        {this.renderForm()}
                        {this.renderModal()}
                        <div className="mb-16 text-right">
                            <Button size="large" className="ml-16"
                                    onClick={() => {
                                        exportGiftFeeList(this.obtainQueryParam(this.props));
                                    }}>导出订单</Button>
                        </div>
                        <Table
                            rowKey={'GiftFeeID'} bordered={true}
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
                                title: '领取方式',
                                dataIndex: 'GetType',
                                filteredValue: this.props.filterParam.GetType,
                                filters: [{text: '押金', value: 1}, {text: '工牌', value: 2}],
                                render: (text, record) => text === 1 ? record.Money && Number.isInteger(record.Money) ? record.Money / 100 + '元' : ''
                                    : <a onClick={() => {
                                        getClient({isPublic: true}).then((client) => {
                                            setParams(STATE_NAME, {
                                                URL: client.getPublicUrl(record.URL),
                                                modalVisible: true
                                            });
                                        });
                                    }}>工牌</a>
                            }, {
                                title: '操作时间',
                                dataIndex: 'ModifyTime'
                            }]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {
                                    pageParam: {currentPage, pageSize: pagination.pageSize},
                                    filterParam: filters
                                };
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
})(GiftFee);