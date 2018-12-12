import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Alert,
    Input,
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
    OrderStep
} from 'CONFIG/EnumerateLib/Mapping_Order';

const {
    getComplainRecordList, exportComplainRecordList
} = ComplainOrderAction;
const {getLaborSimpleList} = CommonAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const STATE_NAME = 'state_finance_trade_complain_labor';

class InviteOrder extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getLaborSimpleList(); // 劳务公司模糊下拉数据
            this.queryTableList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }

        if (nextProps.exportComplainRecordListFetch.status === 'success') { // 导出订单
            setFetchStatus(STATE_NAME, 'exportComplainRecordListFetch', 'close');
            let url = nextProps.exportComplainRecordListFetch.response.Data && nextProps.exportComplainRecordListFetch.response.Data.FileUrl;
            window.open(url);
        } else if (nextProps.exportComplainRecordListFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'exportComplainRecordListFetch', 'close');
            message.error(nextProps.exportComplainRecordListFetch.response && nextProps.exportComplainRecordListFetch.response.Desc ? nextProps.exportComplainRecordListFetch.response.Desc : '导出失败');
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
        if (query.LaborID) delete query.LaborName;
        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1])) delete query[data[0]];
        });
        return query;
    }

    // 查询劳务订单列表
    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        let orderKey = Object.keys(props.orderParam)[0];
        getComplainRecordList({
            ...this.obtainQueryParam(props),
            [orderKey]: props.orderParam[orderKey] === 'ascend' ? 1 : 2,
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

    render() {
        return (
            <div className="container-fluid pt-24 pb-24">
                <Card bordered={false}>
                    {this.renderForm()}
                    <div className="mb-16 text-right">
                        <Button size="large" className="ml-16"
                                onClick={() => {
                                    exportComplainRecordList(this.obtainQueryParam(this.props));
                                }}>导出订单</Button>
                    </div>
                    <Table
                        rowKey={'UserOrderSettleID'} bordered={true}
                        pagination={{
                            total: this.props.RecordCount,
                            pageSize: this.props.pageParam.pageSize,
                            current: this.props.pageParam.currentPage,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                        }}
                        columns={[{
                            title: '创建日期',
                            dataIndex: 'CreateTime',
                            sorter: true,
                            key: 'CreateTimeOrder',
                            sortOrder: this.props.orderParam.CreateTimeOrder
                        }, {
                            title: '会员姓名',
                            dataIndex: 'UserName'
                        }, {
                            title: '劳务公司',
                            dataIndex: 'LaborName'
                        }, {
                            title: '企业',
                            dataIndex: 'PositionName',
                            render: (text, record) => `${record.CheckInTime}-${text}`
                        }, {
                            title: '劳务已返',
                            dataIndex: 'LaborSubsidyAmount',
                            render: text => Number.isInteger(text) ? text / 100 : ''
                        }, {
                            title: '劳务补返',
                            dataIndex: 'AddLaborSubsidyAmount',
                            render: text => Number.isInteger(text) ? text / 100 : ''
                        }, {
                            title: '会员已补',
                            dataIndex: 'UserSubsidyAmount',
                            render: text => Number.isInteger(text) ? text / 100 : ''
                        }, {
                            title: '会员需贴',
                            dataIndex: 'AddUserSubsidyAmount',
                            render: text => Number.isInteger(text) ? text / 100 : ''
                        }, {
                            title: '服务费需补',
                            dataIndex: 'AddServiceSubsidyAmount',
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