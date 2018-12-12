import React from 'react';
import 'LESS/Business/WorkBoard/work-board.less';
import {
    Row,
    Col,
    Card,
    Form,
    Select,
    Button,
    DatePicker,
    Table
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import {LaborStatus} from "CONFIG/EnumerateLib/Mapping_Labor";
import {RecruitGender} from "CONFIG/EnumerateLib/Mapping_Recruit";
import TodaySignAction from 'ACTION/Business/TodaySign';
import CommonAction from 'ACTION/Business/Common';

const {
    getReportList,
    getStatisticInfo
} = TodaySignAction;

const {
    getRecruitSimpleList
} = CommonAction;

const FormItem = Form.Item;
const {Option} = Select;

const STATE_NAME = 'state_business_todaySign';

class TodaySign extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getRecruitSimpleList(); // 获取企业列表
            this.queryStatisticInfo();
            this.queryReportList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryReportList(nextProps);
        }
    }

    // 获取今日签到信息
    queryStatisticInfo() {
        getStatisticInfo({Date: this.props.q_Date.value.format('YYYY-MM-DD')});
    }

    // 获取今日签到各企业信息
    queryReportList(props) {
        if (!props) props = this.props;
        let query = {
            Date: props.q_Date.value.format('YYYY-MM-DD'),
            RecruitID: props.q_Recruit.value && props.q_Recruit.value.value ? Number(props.q_Recruit.value.value) : null,
            RecruitName: props.q_Recruit.value && props.q_Recruit.value.text ? props.q_Recruit.value.text : null,

            RecruitType: props.q_RecruitType.value ? Number(props.q_RecruitType.value) : null
        };
        if (query.RecruitID) {
            delete query.RecruitName;
            delete query.RecruitType;
        }
        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1])) delete query[data[0]];
            // if (!data[1] || data[1] === '-9999') delete query[data[0]];
        });

        let pageParam = props.pageParam;
        getReportList({
            ...query,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => {
        // this.props.form.resetFields();
        this.setState({Recruit: null});
        resetQueryParams(STATE_NAME);
    };

    handleFormConfirm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            // console.log(err, fieldsValue);
            if (err) return;
            this.queryStatisticInfo();
            setParams(STATE_NAME, {
                pageParam: {...this.props.pageParam, currentPage: 1},
                RecordList: []
            });
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>今日签到</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Form onSubmit={this.handleFormConfirm} className="bg-white pt-24">
                        <Row type="flex" justify="start" gutter={32}>
                            <Col span={6}>
                                <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="日期">
                                    {getFieldDecorator('q_Date')(
                                        <DatePicker allowClear={false} style={{width: '100%'}}
                                                    disabledDate={(value) => {
                                                        if (!value) return false;
                                                        return value.valueOf() > moment().valueOf();
                                                    }}/>)}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="企业名称">
                                    {getFieldDecorator('q_Recruit', {initialValue: null})(
                                        <AutoCompleteInput
                                            onChange={value => {
                                                if (value.data && value.data.RecruitType) {
                                                    this.props.form.setFieldsValue({
                                                        q_RecruitType: value.data.RecruitType.toString()
                                                    });
                                                }
                                            }}
                                            textKey="RecruitName" valueKey="RecruitTmpID"
                                            dataSource={this.props.RecruitSimpleList}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="企业类别">
                                    {getFieldDecorator('q_RecruitType')(
                                        <Select style={{width: '100%'}}>
                                            <Option value="-9999">全部</Option>
                                            <Option value="1">A类</Option>
                                            <Option value="2">B类</Option>
                                            <Option value="3">C类</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={6}>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button className="ml-8" onClick={this.handleFormReset}>重置</Button>
                            </Col>
                        </Row>
                    </Form>

                    <Card bordered={false} className="mb-24 mt-24">
                        <Row type="flex" justify="space-between" style={{fontSize: 20}}>
                            <Col span={8} style={{textAlign: 'center'}}>
                                <div>签到总人数</div>
                                <div>{this.props.SignInCount}</div>
                            </Col>
                            <Col span={8} style={{textAlign: 'center'}}>
                                <div>报名企业</div>
                                <div>{this.props.RecruitCount}</div>
                            </Col>
                            <Col span={8} style={{textAlign: 'center'}}>
                                <div>劳务数据</div>
                                <div>{this.props.LaborCount}</div>
                            </Col>
                        </Row>
                    </Card>

                    <Table
                        rowKey={'rowKey'} bordered={false}
                        pagination={{
                            total: this.props.RecordCount,
                            pageSize: this.props.pageParam.pageSize,
                            current: this.props.pageParam.currentPage,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSizeOptions: ['2', '3', '5'],
                            showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                        }}
                        columns={[{
                            title: '企业列表',
                            dataIndex: 'rowKey',
                            render: (item, record) => {
                                return (
                                    <Card bordered={false} style={{lineHeight: 3}}>
                                        <Row type="flex" justify="start" style={{
                                            borderBottom: '1px #e0e0e0 solid'
                                        }} className='pb-8'>
                                            <Col span={8}>
                                                <div style={{fontSize: 20}}>企业名称</div>
                                                <div>{record.RecruitName}</div>
                                                <div>签到人数：{record.SignInCount}人</div>
                                                <div>已接走人数：{record.AcceptCount}人</div>
                                            </Col>
                                            <Col span={8} style={{textAlign: 'right'}}>
                                                <div>集散中心（已接/未接）：</div>
                                            </Col>
                                            <Col span={8}>{
                                                record.HubRecordList && record.HubRecordList.map((data, index) => (
                                                    <div key={index}>
                                                        {data.HubName} {data.HubAcceptCount}/{data.HubUnAcceptCount}人
                                                    </div>))
                                            }</Col>
                                        </Row>
                                        <div style={{fontSize: 20}}>劳务信息</div>
                                        <Table
                                            bordered={false}
                                            rowKey={'rowKey'}
                                            columns={[{
                                                title: '劳务公司',
                                                dataIndex: 'LaborShortName'
                                            }, {
                                                title: '公司状况（信用／账户状态）',
                                                dataIndex: 'LaborCredit',
                                                render: (text, record) => text + '/' + LaborStatus[record.LaborStatus]
                                            }, {
                                                title: '劳务报价（需求）',
                                                dataIndex: 'LaborOrderList',
                                                render: text => text && text.map((item, index) =>
                                                    (<div key={index}>
                                                        {RecruitGender[item.Gender] + ':' + item.SubsidyDay + '天返费' + item.SubsidyAmount / 100 + '元'}
                                                    </div>))
                                            }, {
                                                title: '实接人数',
                                                dataIndex: 'rowKey',
                                                render: (text, record) => (
                                                    [<div key={1}>男：{record.AcceptMaleCount}</div>,
                                                        <div key={2}>女：{record.AcceptFemaleCount}</div>]
                                                )
                                            }]}
                                            pagination={false}
                                            dataSource={(record.LaborRecordList || []).map((item, i) => {
                                                item['rowKey'] = i;
                                                return item;
                                            })}/>
                                    </Card>
                                );
                            }
                        }]}
                        showHeader={false}
                        dataSource={this.props.RecordList.map((item, i) => {
                            item['rowKey'] = i;
                            return item;
                        })}
                        onChange={(pagination, filters, sorter) => {
                            let currentPage = pagination.current < 1 ? 1 : pagination.current;
                            setParams(STATE_NAME, {
                                pageParam: {currentPage, pageSize: pagination.pageSize},
                                RecordList: []
                            });
                        }}/>
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
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(TodaySign);