import React from 'react';
import {Row, Form, Col, Input, Button, Icon, Select, Cascader, DatePicker, Table, Modal, message} from 'antd';
import ActionLog from 'ACTION/Business/AllLog';
import translateParamPost from 'ACTION/translateParamPost';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import CommonAction from 'ACTION/Business/Common';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

const {
    getOperateLog,
    exportOperateLog
} = ActionLog;
const {
    getEmployeeList
} = CommonAction;

const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;
const {Column, ColumnGroup} = Table;
const platform = {
    1: '劳务报价',
    2: '招聘信息',
    3: '企业',
    4: '大老板',
    5: '劳务公司',
    6: '企业'
};

const STATE_NAME = 'state_business_log';

class LogContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTableSpin: false
        };
    }

    componentWillMount() {
        getEmployeeList();
        this.getOperateLog(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.page !== this.props.page || nextProps.pageSize !== this.props.pageSize || nextProps.o_createTimeOrder !== this.props.o_createTimeOrder || nextProps.o_modifyTimeOrder !== this.props.o_modifyTimeOrder) {
            this.getOperateLog(nextProps);
        }
        if (nextProps.getOperateLogFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'getOperateLogFetch', 'close');
            message.error(nextProps.getOperateLogFetch.response.Desc);
        }
        if (nextProps.exportOperateLogFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'exportOperateLogFetch', 'close');
            message.error(nextProps.exportOperateLogFetch.response.Desc);
        }
        if (nextProps.exportOperateLogFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'exportOperateLogFetch', 'close');
            message.success('导出成功');
            window.open(nextProps.exportOperateLogFetch.response.Data.FileUrl, "_blank");
        }
    }

    getOperateLog(props) {
        getOperateLog(Object.assign(
            {
                RecordIndex: (props.page - 1) * props.pageSize,
                RecordSize: props.pageSize,
                ModuleID: parseInt(props.routeParams.platformId, 10)
            },
            translateParamPost.query({
                Content: props.q_operateContent.value || '',
                EmployeeID: props.q_operatePeople && props.q_operatePeople.value && props.q_operatePeople.value.value ? parseInt(props.q_operatePeople.value.value, 10) : '',
                EndTime: props.q_operateTime && props.q_operateTime.value && props.q_operateTime.value[0] ? props.q_operateTime.value[0].format('YYYY-MM-DD') : '',
                StartTime: props.q_operateTime && props.q_operateTime.value && props.q_operateTime.value[1] ? props.q_operateTime.value[1].format('YYYY-MM-DD') : '',
                OpType: props.q_operateType && props.q_operateType.value ? parseInt(props.q_operateType.value, 10) : ''
            }),
            translateParamPost.order({
                OrderByCreateTime: props.o_createTimeOrder
            }, {antd: true})
        ));
    }

    handleTableChange = (pagination, filters, sorter) => {
        if (sorter) {
            if (sorter.columnKey) {
                setParams(STATE_NAME, {
                    page: 1,
                    [sorter.columnKey]: (sorter.columnKey ? sorter.order : false)
                });
            } else {
                setParams(STATE_NAME, {
                    page: 1,
                    o_createTimeOrder: false,
                    o_modifyTimeOrder: false
                });

            }

        }
        let page = pagination.current;
        let pageSize = pagination.pageSize;
        setParams(STATE_NAME, {
            page: page,
            pageSize: pageSize
        });
    };

    handleSearch = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                if (this.props.page === 1) {
                    this.getOperateLog(this.props);
                } else {
                    setParams(STATE_NAME, {
                        page: 1
                    });
                }
            }
        });
    };

    handleReset() {
        resetQueryParams(STATE_NAME);
    }

    exportOperateLog(props) {
        exportOperateLog(Object.assign(
            {
                RecordIndex: (props.page - 1) * props.pageSize,
                RecordSize: props.pageSize
            },
            translateParamPost.query({
                ModuleID: parseInt(props.routeParams.platformId, 10),
                Content: props.q_operateContent.value || '',
                EmployeeID: props.q_operatePeople && props.q_operatePeople.value && props.q_operatePeople.value.value ? parseInt(props.q_operatePeople.value.value, 10) : '',
                EndTime: props.q_operateTime && props.q_operateTime.value && props.q_operateTime.value[0] ? props.q_operateTime.value[0].format('YYYY-MM-DD') : '',
                StartTime: props.q_operateTime && props.q_operateTime.value && props.q_operateTime.value[1] ? props.q_operateTime.value[1].format('YYYY-MM-DD') : '',
                OpType: props.q_operateType && props.q_operateType.value ? parseInt(props.q_operateType.value, 10) : ''
            }),
            translateParamPost.order({
                OrderByCreateTime: props.o_createTimeOrder
            }, {antd: true})
        ));
    }

    handleExportLog = () => {
        this.exportOperateLog(this.props);
    };

    render() {
        const {recordList, recordCount, pageSize, page, businessCommon, o_createTimeOrder} = this.props;
        const {showTableSpin} = this.state;
        const {getFieldDecorator} = this.props.form;
        let employeeList = businessCommon.EmployeeList;
        let platformCode = parseInt(this.props.routeParams.platformId, 10);
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>{platform[platformCode]}日志</h1>
                </div>
                <Row>
                    <div className="container-fluid mt-24">
                        <div className="container bg-white">
                            <Form
                                className="ant-advanced-search-form"
                            >
                                <Row gutter={40}>
                                    <Col span={8} key={1}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="操作日期">
                                            {getFieldDecorator('q_operateTime', {
                                                rules: []
                                            })(<RangePicker/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={2}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="操作类型">
                                            {getFieldDecorator('q_operateType', {
                                                rules: []
                                            })(<Select>
                                                <Option value="" key={1}>全部</Option>
                                                <Option value="1" key={2}>新建</Option>
                                                <Option value="2" key={3}>修改</Option>
                                                <Option value="3" key={4}>审核</Option>
                                                <Option value="4" key={5}>导出</Option>
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={3}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="操作用户">
                                            {getFieldDecorator('q_operatePeople', {
                                                rules: []
                                            })(<AutoCompleteSelect allowClear={true} optionsData={{
                                                valueKey: 'SalesEmployeeID',
                                                textKey: 'Name',
                                                dataArray: employeeList
                                            }}/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={4}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="日志内容">
                                            {getFieldDecorator('q_operateContent', {
                                                rules: []
                                            })(<Input placeholder="请输入日志内容" type="text"/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{textAlign: 'right'}}>
                                        <Button type="primary" htmlType="button"
                                                onClick={this.handleSearch}>查询</Button>
                                        <Button htmlType="button" style={{marginLeft: 8}}
                                                onClick={this.handleReset}>重置</Button>
                                    </Col>
                                </Row>
                            </Form>
                            <Row className="mt-24">
                                <div className="text-right">
                                    <Button type="" htmlType="button" className="ml-8"
                                            onClick={this.handleExportLog}>导出日志</Button>
                                </div>
                            </Row>
                            <Row className="mt-16">
                                <Table rowKey={record => record.OpLogID}
                                       dataSource={recordList}
                                       pagination={{
                                           total: recordCount,
                                           defaultPageSize: pageSize,
                                           defaultCurrent: page,
                                           current: page,
                                           pageSize: pageSize,
                                           showTotal: (total, range) => {
                                               return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                           },
                                           showSizeChanger: true,
                                           showQuickJumper: true
                                       }}
                                       loading={showTableSpin}
                                       onChange={this.handleTableChange}>
                                    <Column
                                        title="操作日期"
                                        dataIndex="CreateTime"
                                        sorter={true}
                                        sortOrder={o_createTimeOrder}
                                        key='o_createTimeOrder'
                                    />
                                    <Column
                                        title="登录名"
                                        dataIndex="LoginName"
                                    />
                                    <Column
                                        title="操作类型"
                                        dataIndex="OpTypeName"
                                    />
                                    <Column
                                        title="日志"
                                        dataIndex="Content"
                                    />
                                </Table>
                            </Row>
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields: (props) => {
        return {
            q_operateTime: props.q_operateTime,
            q_operateType: props.q_operateType,
            q_operatePeople: props.q_operatePeople,
            q_operateContent: props.q_operateContent
        };
    },
    onFieldsChange: (props, fields) => {
        setParams(STATE_NAME, fields);
    }
})(LogContainer);