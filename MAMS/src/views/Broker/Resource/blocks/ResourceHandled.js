import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Radio,
    Table,
    Select,
    Button,
    DatePicker,
    message
} from 'antd';
import ResourceAction from 'ACTION/Broker/Header/Resource';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import Mapping_User from "CONFIG/EnumerateLib/Mapping_User";
import {browserHistory} from "react-router";
import {RegexRule, Constant} from 'UTIL/constant/index';

const FormItem = Form.Item;

const {
    getHandledList
} = ResourceAction;
const {RangePicker} = DatePicker;
const {Option} = Select;

const STATE_NAME = 'state_broker_header_resource';

class ResourceHandled extends React.PureComponent {

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
            Name: props.q_UserName.value || '',
            Phone: props.q_Phone.value || '',
            GetSource: Number(props.q_GetSource.value)
        };
        if (query.Date && query.Date instanceof Array) {
            query.GetStartDate = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : '';
            query.GetEndDate = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : '';
        } else {
            query.GetStartDate = moment(0).format('YYYY-MM-DD');
            query.GetEndDate = moment().add(1, 'd').format('YYYY-MM-DD');
        }
        delete query.Date;
        return query;
    }

    // 查询劳务订单列表
    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        getHandledList({
                GetRequire: {...this.obtainQueryParam(props)},
                QueryParam: {
                    RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
                    RecordSize: pageParam.pageSize
                }
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
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="获取日期">
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
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员姓名">
                            {getFieldDecorator('q_UserName')(
                                <Input placeholder="会员的昵称或真实姓名"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="会员电话">
                            {getFieldDecorator('q_Phone')(
                                <Input placeholder="搜索推荐人电话"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 5}} wrapperCol={{span: 16}} label="来源">
                            {getFieldDecorator('q_GetSource')(
                                <Select>
                                    <Option value="-9999">全部</Option>
                                    {Object.entries(Mapping_User.eRegSource).map((i) => {
                                        return <Option value={i[0].toString()} key={i[0]}>{i[1]}</Option>;
                                    })}
                                </Select>
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

    handleTableRowKey(record, index, event) {
        record.UserID && browserHistory.push({
            pathname: '/broker/member/detail/' + record.UserID,
            query: {memberName: record.Name || ''}
        });
    }

    render() {
        return (
            <Card bordered={false}>
                {this.renderForm()}
                <Table
                    rowKey={(record, index) => index} bordered={true}
                    onRowClick={this.handleTableRowKey}
                    pagination={{
                        total: this.props.RecordCount,
                        pageSize: this.props.pageParam.pageSize,
                        current: this.props.pageParam.currentPage,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: Constant.pageSizeOptions,
                        showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                    }}
                    columns={[
                        {
                            title: '序号', key: 'seqNo', width: 42,
                            render: (text, record, index) => index + 1
                        },
                        {
                            title: '会员姓名', dataIndex: 'Name', width: '100px',
                            render: (text, record) =>
                                <span>{this.props.getDisplayName(record)}
                                    {record.CertStatus === 1 ?
                                        <i className="iconfont icon-iconheji color-warning"/> : ''}</span>
                        },
                        {title: '最近联系记录', dataIndex: 'ContactRecord'},
                        {
                            title: '资源来源', dataIndex: 'GetSource', width: '100px',
                            render: text => Mapping_User.eRegSource[text]
                        },
                        {
                            title: '注册时间', dataIndex: 'RegTime', width: '150px',
                            render: text => text ? moment(text).format('YYYY-MM-DD HH:mm') : ''
                        },
                        {
                            title: '获取时间', dataIndex: 'GetTime', width: '150px',
                            render: text => text ? moment(text).format('YYYY-MM-DD HH:mm') : ''
                        }
                    ]}
                    dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                    onChange={(pagination, filters, sorter) => {
                        let currentPage = pagination.current < 1 ? 1 : pagination.current;
                        let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                        setParams(STATE_NAME, change);
                    }}/>
            </Card>
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
})(ResourceHandled);