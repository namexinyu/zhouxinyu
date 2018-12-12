import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Table,
    Select,
    Button,
    DatePicker,
    message,
    Badge,
    Popconfirm
} from 'antd';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import AlarmAction from 'ACTION/Broker/Header/Alarm';
import setFetchStatus from "ACTION/setFetchStatus";
import getPersonalRemindCount from 'ACTION/Broker/TimingTask/getPersonalRemindCount';

const {
    reminderGet,
    deleteAlarm
} = AlarmAction;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const {Option} = Select;

const STATE_NAME = 'state_broker_header_alarm_feature';

class AlarmFeature extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.queryTableList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }

        if (nextProps.deleteAlarmFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'deleteAlarmFetch', 'close');
            // message.success('删除成功');
            setParams(STATE_NAME, {deletePopConfirmVisible: false, selectedRowKeys: []});
            this.queryTableList();
            getPersonalRemindCount();
        } else if (nextProps.deleteAlarmFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'deleteAlarmFetch', 'close');
            setParams(STATE_NAME, {deletePopConfirmVisible: false});
            message.error(nextProps.deleteAlarmFetch.response && nextProps.deleteAlarmFetch.response.Desc ? nextProps.deleteAlarmFetch.response.Desc : '设置失败');
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let query = {
            Date: props.q_Date.value,
            Who: props.q_UserName.value || '',
            Content: props.q_Content.value || '',
            DateUpperBound: '',
            DateLowerBound: ''
        };
        if (query.Date && query.Date instanceof Array) {
            query.DateLowerBound = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.DateUpperBound = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
        }
        delete query.Date;
        return query;
    }

    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        reminderGet({
                ...this.obtainQueryParam(props),
                RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
                RecordSize: pageParam.pageSize
            }
        );
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
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员姓名">
                            {getFieldDecorator('q_UserName')(
                                <Input placeholder="会员的昵称或真实姓名"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="提醒日期">
                            {getFieldDecorator('q_Date')(
                                <RangePicker style={{width: '100%'}} allowClear={false}
                                             disabledDate={(value) => {
                                                 if (!value) return false;
                                                 return value.valueOf() > moment().valueOf() || value.valueOf() < moment().subtract(1, 'year').valueOf();
                                             }}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="提醒内容">
                            {getFieldDecorator('q_Content')(
                                <Input placeholder="模糊查询"/>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col className="mb-24" span={23} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button className="ml-16" onClick={this.handleFormReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        return (
            <div className="pl-24 pr-24 pt-24 pb-24">
                <Card bordered={false}>
                    {this.renderForm()}

                    <div className="mb-16">
                        <Popconfirm
                            title="确定要删除闹钟?"
                            visible={this.props.deletePopConfirmVisible}
                            onConfirm={() => {
                                deleteAlarm({ReminderIDList: this.props.selectedRowKeys});
                            }}
                            onCancel={() => setParams(STATE_NAME, {deletePopConfirmVisible: false})}
                            okText="确定"
                            cancelText="取消">
                            <Button
                                type="primary" className="mr-16"
                                onClick={() => {
                                    setParams(STATE_NAME, {deletePopConfirmVisible: true});
                                }}
                                disabled={!(this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0)}>
                                删除
                            </Button>
                        </Popconfirm>
                    </div>

                    <Table
                        rowKey={'ID'} bordered={false}
                        pagination={{
                            total: this.props.RecordCount,
                            pageSize: this.props.pageParam.pageSize,
                            current: this.props.pageParam.currentPage,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                        }}
                        rowSelection={{
                            onChange: (selectedRowKeys, selectedRows) => {
                                setParams(STATE_NAME, {selectedRowKeys});
                            },
                            selectedRowKeys: this.props.selectedRowKeys
                        }}
                        columns={[{
                            title: '会员姓名',
                            dataIndex: 'Who'
                        }, {
                            title: '提醒内容',
                            dataIndex: 'Content'
                        }, {
                            title: '提醒时间',
                            dataIndex: 'DateTime'
                        }]}
                        dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                        onChange={(pagination, filters, sorter) => {
                            let currentPage = pagination.current < 1 ? 1 : pagination.current;
                            let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
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
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(AlarmFeature);