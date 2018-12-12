import React from 'react';
import { Row, Form, Col, Input, Button, Icon, Select, Cascader, DatePicker, Table, Switch, message } from 'antd';
import { browserHistory } from 'react-router';
import LaborAction from 'ACTION/Business/Labor/LaborAction';
import translateParamPost from 'ACTION/translateParamPost';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
    getLaborBossPassList,
    modifyLaborBossTeamworkStatus,
    exportLaborBossWorkList
} = LaborAction;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { Column, ColumnGroup } = Table;
class EnterpriseLog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTableSpin: false
        };
    }
    componentWillMount() {
        this.getLaborBossPassList(this.props);
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.page !== this.props.page || nextProps.pageSize !== this.props.pageSize || nextProps.o_createTimeOrder !== this.props.o_createTimeOrder || nextProps.o_modifyTimeOrder !== this.props.o_modifyTimeOrder) {
            this.getLaborBossPassList(nextProps);
        }
        if (nextProps.getLaborBossPassListFetch.status === 'pending') {
            this.setState({
                showTableSpin: true
            });
        }
        if (nextProps.getLaborBossPassListFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_boss_list', 'getLaborBossPassListFetch', 'close');
            this.setState({
                showTableSpin: false
            });
        }
        if (nextProps.getLaborBossPassListFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_boss_list', 'getLaborBossPassListFetch', 'close');
            this.setState({
                showTableSpin: false
            });
            message.error(nextProps.getLaborBossPassListFetch.response.Desc);
        }
        if (nextProps.modifyLaborBossTeamworkStatusFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_boss_list', 'modifyLaborBossTeamworkStatusFetch', 'close');
            message.success('设置合作状态成功');
            this.getLaborBossPassList(nextProps);
        }
        if (nextProps.modifyLaborBossTeamworkStatusFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_boss_list', 'modifyLaborBossTeamworkStatusFetch', 'close');
            message.error(nextProps.getEntSummaryListFetch.response.Desc);
        }
        if (nextProps.exportLaborBossWorkListFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_boss_list', 'exportLaborBossWorkListFetch', 'close');
            message.success('导出成功');
            window.open(nextProps.exportLaborBossWorkListFetch.response.Data.FileUrl, "_blank");
        }
        if (nextProps.exportLaborBossWorkListFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_boss_list', 'exportLaborBossWorkListFetch', 'close');
            message.error(nextProps.exportLaborBossWorkListFetch.response.Desc);
        }
    }
    getLaborBossPassList(props) {
        getLaborBossPassList(Object.assign(
            {
                RecordIndex: (props.page - 1) * props.pageSize,
                RecordSize: props.pageSize
            },
            translateParamPost.query({
                StartTime: props.q_laborBossCreateTime.value && props.q_laborBossCreateTime.value[0] ? props.q_laborBossCreateTime.value[0].format('YYYY-MM-DD') : '',
                EndTime: props.q_laborBossCreateTime.value && props.q_laborBossCreateTime.value[1] ? props.q_laborBossCreateTime.value[1].format('YYYY-MM-DD') : '',
                LBossName: props.q_laborBossName.value || '',
                MobileNum: props.q_laborBossMobile.value || '',
                CooperStatus: props.q_laborBossTeamwork.value ? parseInt(props.q_laborBossTeamwork.value, 10) : ''
            }),
            translateParamPost.order({
                CreateTimeOrder: props.o_createTimeOrder,
                ModifyTimeOrder: props.o_modifyTimeOrder
            }, { antd: true })
        ));
    }
    handleExport() {
        exportLaborBossWorkList(translateParamPost.query({
            StartTime: this.props.q_laborBossCreateTime.value && this.props.q_laborBossCreateTime.value[0] ? this.props.q_laborBossCreateTime.value[0].format('YYYY-MM-DD') : '',
            EndTime: this.props.q_laborBossCreateTime.value && this.props.q_laborBossCreateTime.value[1] ? this.props.q_laborBossCreateTime.value[1].format('YYYY-MM-DD') : '',
            LBossName: this.props.q_laborBossName.value || '',
            MobileNum: this.props.q_laborBossMobile.value || '',
            CooperStatus: this.props.q_laborBossTeamwork.value ? parseInt(this.props.q_laborBossTeamwork.value, 10) : ''
        }));
    }
    handleSearch() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                if (this.props.page === 1) {
                    this.getLaborBossPassList(this.props);
                } else {
                    setParams('state_servicer_labor_boss_list', {
                        page: 1
                    });
                }
            }
        });
    }
    handleReset() {
        resetQueryParams('state_servicer_labor_boss_list');
    }
    handleTableChange(pagination, filters, sorter) {
        if (sorter) {
            if (sorter.columnKey) {
                setParams('state_servicer_labor_boss_list', {
                    page: 1,
                    [sorter.columnKey]: (sorter.columnKey ? sorter.order : false)
                });
            } else {
                setParams('state_servicer_labor_boss_list', {
                    page: 1,
                    o_createTimeOrder: false,
                    o_modifyTimeOrder: false
                });

            }

        }
        let page = pagination.current;
        let pageSize = pagination.pageSize;
        setParams('state_servicer_labor_boss_list', {
            page: page,
            pageSize: pageSize
        });
    }
    handleChangeCooperStatus(checked, record) {
        modifyLaborBossTeamworkStatus({
            CooperStatus: checked ? 1 : 2,
            LBossID: record.LBossID
        });
    }
    handleCreateLaborBoss() {
        browserHistory.push({
            pathname: '/bc/servicer/owner/create/0'
        });
    }
    handleEdit(record) {
        browserHistory.push({
            pathname: '/bc/servicer/owner/edit/' + record.LBossID,
            query: {
                cooperStatus: record.CooperStatus,
                laborBossIdCard: record.IDCardNum,
                laborBossIdCardPositive: encodeURIComponent(record.IDCardPhoto1Url),
                laborBossIdCardOpposite: encodeURIComponent(record.IDCardPhoto2Url),
                laborBossName: encodeURIComponent(record.LBossName),
                laborBossMobile: record.MobileNum
            }
        });
    }
    handleSeeLog() {
        browserHistory.push({
            pathname: '/bc/log/4'
        });
    }
    handleSeeCheck() {
        browserHistory.push({
            pathname: '/bc/servicer/owner/check'
        });
    }
    render() {
        const { recordList, recordCount, pageSize, page } = this.props;
        const { showTableSpin } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>大老板列表</h1>
                </div>
                <Row>
                    <div className="container-fluid mt-24">
                        <div className="container bg-white">
                            <Form
                                className="ant-advanced-search-form"
                                onSubmit={this.handleSearch}
                            >
                                <Row gutter={40}>
                                    <Col span={8} key={1}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="大老板姓名">
                                            {getFieldDecorator('q_laborBossName', {
                                                rules: [
                                                    {
                                                        pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                                        message: '姓名为中文或英文'
                                                    }
                                                ]
                                            })(<Input placeholder="请输入大老板姓名" type="text" />)}
                                        </FormItem>

                                    </Col>
                                    <Col span={8} key={2}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="联系电话">
                                            {getFieldDecorator('q_laborBossMobile', {
                                                rules: [
                                                    {
                                                        pattern: /^1[3-9][0-9]\d{8}$/,
                                                        message: '请输入11位手机号'
                                                    }
                                                ]
                                            })(<Input placeholder="请输入大老板联系电话" type="tel" />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={3}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="合作状态">
                                            {getFieldDecorator('q_laborBossTeamwork', {
                                                rules: []
                                            })(<Select>
                                                <Option value="">全部</Option>
                                                <Option value="1">合作中</Option>
                                                <Option value="2">暂停合作</Option>
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={40}>
                                    <Col span={8} key={4}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="创建日期">
                                            {getFieldDecorator('q_laborBossCreateTime', {
                                                rules: []
                                            })(<RangePicker />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'right' }}>
                                        <Button type="primary" htmlType="button" onClick={this.handleSearch.bind(this)}>查询</Button>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset.bind(this)}>重置</Button>
                                    </Col>
                                </Row>
                            </Form>
                            <Row className="mt-24">
                                <div className="text-right">
                                    <Button htmlType="button" className="ml-8" onClick={this.handleCreateLaborBoss}>新建大老板</Button>
                                    <Button htmlType="button" className="ml-8" onClick={this.handleSeeCheck}>大老板审核</Button>
                                    <Button htmlType="button" className="ml-8" onClick={this.handleSeeLog}>查看日志</Button>
                                    <Button htmlType="button" className="ml-8" onClick={this.handleExport.bind(this)}>导出列表</Button>
                                </div>
                            </Row>
                            <Row className="mt-16">
                                <Table rowKey={record => record.LBossID.toString()}
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
                                    onChange={this.handleTableChange.bind(this)}>
                                    <Column
                                        title="姓名"
                                        dataIndex="LBossName"
                                    />
                                    <Column
                                        title="联系电话"
                                        dataIndex="MobileNum"
                                    />
                                    <Column
                                        title="旗下劳务公司"
                                        dataIndex="LCompanyCount"
                                    />
                                    <Column
                                        title="合作状态"
                                        dataIndex="CooperStatus"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    <Switch checked={record.CooperStatus === 1 ? true : false} onChange={(checked) => this.handleChangeCooperStatus(checked, record)} />
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="创建日期"
                                        dataIndex="CreateTime"
                                    />
                                    <Column
                                        title="最近更新"
                                        dataIndex="ModifyTime"
                                    />
                                    <Column
                                        title="操作"
                                        dataIndex="operate"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    <a href="javascript:void(0)" onClick={() => this.handleEdit(record)}>编辑</a>
                                                </div>
                                            );
                                        }}
                                    />
                                </Table>
                            </Row>
                        </div>
                    </div>
                </Row>
            </div >
        );
    }
}
export default Form.create({
    mapPropsToFields: (props) => {
        return {
            q_laborBossName: props.q_laborBossName,
            q_laborBossMobile: props.q_laborBossMobile,
            q_laborBossTeamwork: props.q_laborBossTeamwork,
            q_laborBossCreateTime: props.q_laborBossCreateTime
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_servicer_labor_boss_list', fields);
    }
})(EnterpriseLog);