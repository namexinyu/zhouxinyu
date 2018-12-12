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
    Modal,
    message,
    Popconfirm
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import setParams from 'ACTION/setParams';
import {
    OrderStep
} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import UserOrderAction from 'ACTION/Finance/TradeManage/UserOrderAction';
import CommonAction from 'ACTION/Finance/Common';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
    getOrderList
} = UserOrderAction;
const {
    getRecruitSimpleList,
    getLaborSimpleList
} = CommonAction;

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_user';

/**
 * 会员订单页面
 */
class UserOrder extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.queryTableList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let query = {
            Date: props.q_Date.value,
            TradeLaborInfo: props.q_Merchant.value,
            TradeUserInfo: props.q_Customer.value
        };
        if (query.Date && query.Date instanceof Array) {
            query.StarTime = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.EndTime = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
        }
        delete query.Date;
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
        getOrderList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => {
        // this.props.form.resetFields();
        this.setState({Recruit: null, SimpleLabor: null});
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
                <Row gutter={32} type="flex" justify="start">
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="选择日期">
                            {getFieldDecorator('q_Date')(
                                <RangePicker style={{width: '100%'}} allowClear={false}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="企业信息">
                            {getFieldDecorator('q_Merchant')(<Input placeholder="输入企业信息"/>)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员信息">
                            {getFieldDecorator('q_Customer')(<Input placeholder="输入会员信息"/>)}
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
                    <h1>会员订单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        {this.renderForm()}
                        <Table
                            rowKey={(record, index) => index} bordered={true}
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
                                key: 'Order',
                                sortOrder: this.props.orderParam.Order
                            }, {
                                title: '企业信息',
                                dataIndex: 'TradeLaborInfo'
                            }, {
                                title: '会员信息',
                                dataIndex: 'TradeUserInfo'
                            }, {
                                title: '应收金额',
                                dataIndex: 'LaborSubsidyAmount',
                                render: text => Number.isInteger(text) ? text / 100 : ''
                            }, {
                                title: '应付金额',
                                dataIndex: 'UserSubsidyAmount',
                                render: text => Number.isInteger(text) ? text / 100 : ''
                            }, {
                                title: '实付金额',
                                dataIndex: 'PayAmount',
                                render: text => Number.isInteger(text) ? text / 100 : ''
                            }, {
                                title: '余额',
                                dataIndex: 'Balance',
                                render: text => Number.isInteger(text) ? text / 100 : ''
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
})(UserOrder);