import React from 'react';
import { Row, Form, Col, Input, Button, Icon, Select, Cascader, DatePicker, Table, Switch, Modal, Radio, AutoComplete, message } from 'antd';
import { browserHistory } from 'react-router';
import translateParamPost from 'ACTION/translateParamPost';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ActionCompany from 'ACTION/Business/Company/ActionCompany';
import CommonAction from 'ACTION/Business/Common';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import {CONFIG} from 'mams-com';

const {
    getCompanyList,
    modifyCompanyTeamworkStatus,
    exportCompanyList
} = ActionCompany;
const {
    getRecruitSimpleList,
    getLaborBossSimpleList,
    getLaborSimpleList,
    getEmployeeList
} = CommonAction;
const FormItem = Form.Item;
const Option = Select.Option;
const AutoOption = AutoComplete.Option;
const { RangePicker } = DatePicker;
const { Column, ColumnGroup } = Table;
const RadioGroup = Radio.Group;

class Company extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = CONFIG.antAreaOptions;
        this.state = {
            showTableSpin: false
        };
    }
    componentWillMount() {
        if (this.props.location.query && this.props.location.query.accountStatus) {
            this.props.form.setFields({
                q_accountStatus: {
                    value: this.props.location.query.accountStatus
                }
            });
        }
        this.getCompanyList(this.props);
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {

            getLaborBossSimpleList();
            getEmployeeList();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.page !== this.props.page || nextProps.pageSize !== this.props.pageSize || nextProps.o_createTimeOrder !== this.props.o_createTimeOrder || nextProps.o_modifyTimeOrder !== this.props.o_modifyTimeOrder) {
            this.getCompanyList(nextProps);
        }
        if (nextProps.getCompanyListFetch.status === 'pending') {
            this.setState({
                showTableSpin: true
            });
        }
        if (nextProps.getCompanyListFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_company_list', 'getCompanyListFetch', 'close');
            this.setState({
                showTableSpin: false
            });
        }
        if (nextProps.getCompanyListFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_company_list', 'getCompanyListFetch', 'close');
            this.setState({
                showTableSpin: false
            });
            message.error(nextProps.getCompanyListFetch.response.Desc);
        }
        if (nextProps.modifyCompanyTeamworkStatusFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_company_list', 'modifyCompanyTeamworkStatusFetch', 'close');
            message.success('设置合作状态成功');
            this.getCompanyList(nextProps);
        }
        if (nextProps.modifyCompanyTeamworkStatusFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_company_list', 'modifyCompanyTeamworkStatusFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.modifyCompanyTeamworkStatusFetch.response.Desc
            });
        }
        if (nextProps.exportCompanyListFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_company_list', 'exportCompanyListFetch', 'close');
            message.success('导出成功');
            window.open(nextProps.exportCompanyListFetch.response.Data.FileUrl, "_blank");
        }
        if (nextProps.exportCompanyListFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_company_list', 'exportCompanyListFetch', 'close');
            message.error(nextProps.exportCompanyListFetch.response.Desc);
        }
    }
    getCompanyList(props) {
        console.log(223, props);
        getCompanyList(Object.assign(
            {
                RecordIndex: (props.page - 1) * props.pageSize,
                RecordSize: props.pageSize
            },
            translateParamPost.query({
                AccountStatus: props.q_accountStatus.value ? parseInt(props.q_accountStatus.value, 10) : '',
                AreaCode: props.q_areaCode.value && props.q_areaCode.value[2] ? props.q_areaCode.value[2] : '',
                CooperationStatus: props.q_cooperStatus.value ? parseInt(props.q_cooperStatus.value, 10) : '',
                CreateDateBegin: props.q_createTime.value && props.q_createTime.value[0] ? props.q_createTime.value[0].format('YYYY-MM-DD') : '',
                CreateDateEnd: props.q_createTime.value && props.q_createTime.value[1] ? props.q_createTime.value[1].format('YYYY-MM-DD') : '',
                EmployeeID: (this.props.q_employeeId.value && this.props.q_employeeId.value.value) ? parseInt(this.props.q_employeeId.value.value, 10) : '',
                LaborBossID: (this.props.q_laborBossId.value && this.props.q_laborBossId.value.value) ? parseInt(this.props.q_laborBossId.value.value, 10) : '',
                LaborName: props.q_companyName.value || ''
            }),
            translateParamPost.order({
                OrderByCreateTime: props.o_createTimeOrder,
                ModifyTimeOrder: props.o_modifyTimeOrder
            }, { antd: true })
        ));
    }
    handleExport() {
        exportCompanyList(translateParamPost.query({
            AccountStatus: this.props.q_accountStatus.value ? parseInt(this.props.q_accountStatus.value, 10) : '',
            AreaCode: this.props.q_areaCode.value && this.props.q_areaCode.value[2] ? this.props.q_areaCode.value[2] : '',
            CooperationStatus: this.props.q_cooperStatus.value ? parseInt(this.props.q_cooperStatus.value, 10) : '',
            CreateDateBegin: this.props.q_createTime.value && this.props.q_createTime.value[0] ? this.props.q_createTime.value[0].format('YYYY-MM-DD') : '',
            CreateDateEnd: this.props.q_createTime.value && this.props.q_createTime.value[1] ? this.props.q_createTime.value[1].format('YYYY-MM-DD') : '',
            EmployeeID: (this.props.q_employeeId.value && this.props.q_employeeId.value.value) ? parseInt(this.props.q_employeeId.value.value, 10) : '',
            LaborBossID: (this.props.q_laborBossId.value && this.props.q_laborBossId.value.value) ? parseInt(this.props.q_laborBossId.value.value, 10) : '',
            LaborName: this.props.q_companyName.value || ''
        }));
    }
    handleSearch() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                if (this.props.page === 1) {
                    this.getCompanyList(this.props);
                } else {
                    setParams('state_servicer_labor_company_list', {
                        page: 1
                    });
                }
            }
        });
    }
    handleReset() {
        resetQueryParams('state_servicer_labor_company_list');
    }
    handleChangeCooperStatus(checked, record) {
        modifyCompanyTeamworkStatus({
            CooperationStatus: checked ? 1 : 2,
            LaborID: record.LaborID
        });
    }
    handleTableChange(pagination, filters, sorter) {
        if (sorter) {
            if (sorter.columnKey) {
                setParams('state_servicer_labor_company_list', {
                    page: 1,
                    [sorter.columnKey]: (sorter.columnKey ? sorter.order : false)
                });
            } else {
                setParams('state_servicer_labor_company_list', {
                    page: 1,
                    o_createTimeOrder: false,
                    o_modifyTimeOrder: false
                });

            }

        }
        let page = pagination.current;
        let pageSize = pagination.pageSize;
        setParams('state_servicer_labor_company_list', {
            page: page,
            pageSize: pageSize
        });
    }
    handleCreateCompany() {
        browserHistory.push({
            pathname: '/bc/servicer/company/create/new'
        });
    }
    handleEdit(record) {
        browserHistory.push({
            pathname: '/bc/servicer/company/edit/' + record.LaborID
            // query: {
            //     shortName: record.ShortName,
            //     name: record.LaborName,
            //     bossName: record.BossName,
            //     bossId: record.LaborBossID,
            //     contactName: record.LinkMan,
            //     contactMobile: record.Mobile,
            //     percentTag: record.DepositPercentage,
            //     creditPoint: record.CreditDefault,
            //     email: record.Mail,
            //     areaCode: record.AreaCode,
            //     address: record.Address,
            //     logoPath: encodeURIComponent(record.LogoPath),
            //     otherPath: encodeURIComponent(record.OtherPicPath),
            //     BLPath: encodeURIComponent(record.PicPath)
            // }
        });
    }
    handleSeeLog() {
        browserHistory.push({
            pathname: '/bc/log/5'
        });
    }
    handleSeeCheck() {
        browserHistory.push({
            pathname: '/bc/servicer/company/check'
        });
    }

    render() {
        const { recordList, recordCount, pageSize, page, businessCommon, o_createTimeOrder, o_modifyTimeOrder } = this.props;
        const { showTableSpin } = this.state;
        const { getFieldDecorator } = this.props.form;
        let laborBossList = businessCommon.LaborBossSimpleList;
        let employeeList = businessCommon.EmployeeList;

        let laborBossOptions = laborBossList.map((item) => {
            return (<AutoOption key={item.LaborBossID} value={item.LaborBossID.toString()}>{item.BossName}</AutoOption>);
        });

        const STATE_NAME = 'state_servicer_labor_company_list';
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>劳务公司</h1>
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
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="劳务公司">
                                            {getFieldDecorator('q_companyName', {
                                                rules: [
                                                    {
                                                        pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                                        message: '劳务公司名称为中文或英文'
                                                    }
                                                ]
                                            })(<Input type="text" placeholder="简称或全称" />)}
                                        </FormItem>

                                    </Col>
                                    <Col span={8} key={2}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="大老板">
                                            {getFieldDecorator('q_laborBossId', {
                                                rules: []
                                            })(<AutoCompleteSelect allowClear={true} optionsData={{ valueKey: 'LaborBossID', textKey: 'BossName', dataArray: laborBossList }} />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={3}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="所属地区">
                                            {getFieldDecorator('q_areaCode', {
                                                rules: []
                                            })(<Cascader options={this.antOptions} placeholder="请选择省/市/区" changeOnSelect showSearch/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={4}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="创建日期">
                                            {getFieldDecorator('q_createTime', {
                                                rules: []
                                            })(<RangePicker />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={4} key={5}>
                                        <FormItem {...{
                                            labelCol: { span: 10 },
                                            wrapperCol: { span: 14 }
                                        }} label="账户状态">
                                            {getFieldDecorator('q_accountStatus', {
                                                rules: [],
                                                initialValue: '-9999'
                                            })(<Select>
                                                <Option value="-9999">全部</Option>
                                                <Option value="1">正常</Option>
                                                <Option value="2">即将欠费</Option>
                                                <Option value="3">欠费</Option>
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={4} key={6}>
                                        <FormItem {...{
                                            labelCol: { span: 10 },
                                            wrapperCol: { span: 14 }
                                        }} label="合作状态">
                                            {getFieldDecorator('q_cooperStatus', {
                                                rules: [],
                                                initialValue: '-9999'
                                            })(<Select>
                                                <Option value="-9999">全部</Option>
                                                <Option value="1">合作</Option>
                                                <Option value="2">暂停合作</Option>
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={7}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="所属业务员">
                                            {getFieldDecorator('q_employeeId', {
                                                rules: []
                                            })(<AutoCompleteSelect allowClear={true} optionsData={{ valueKey: 'SalesEmployeeID', textKey: 'Name', dataArray: employeeList }} />)}
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
                                    <Button type="" htmlType="button" onClick={this.handleCreateCompany.bind(this)}>新建公司</Button>
                                    <Button type="" className="ml-8" htmlType="button" onClick={this.handleSeeCheck.bind(this)}>审核公司({this.props.AuditCount})</Button>
                                    <Button type="" className="ml-8" htmlType="button" onClick={this.handleExport.bind(this)}>导出列表</Button>
                                    <Button type="" className="ml-8" htmlType="button" onClick={this.handleSeeLog.bind(this)}>查看日志</Button>
                                </div>
                            </Row>
                            <Row className="mt-24">
                                <Table rowKey={record => record.LaborID.toString()}
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
                                        title="公司简称"
                                        dataIndex="ShortName"
                                    />
                                    <Column
                                        title="劳务公司"
                                        dataIndex="LaborName"
                                    />
                                    <Column
                                        title="大老板"
                                        dataIndex="BossName"
                                    />
                                    <Column
                                        title="所属地区"
                                        dataIndex="AreaCode"
                                        render={(text, record, index) => {
                                            let str = CONFIG.getPCA.getPCAString(record.AreaCode);
                                            return (
                                                <div>
                                                    {str + record.Address}
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="合作状态"
                                        dataIndex="d"
                                        key="d"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    <Switch checked={record.CooperationStatus === 1 ? true : false} onChange={(checked) => this.handleChangeCooperStatus(checked, record)} />
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="押金比率(%)"
                                        dataIndex="DepositPercentage"
                                    />
                                    <Column
                                        title="账户余额"
                                        dataIndex="Balance"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {(record.Balance / 100).FormatMoney({ fixed: 2 })}
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="账户状态"
                                        dataIndex="AccountStatus"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {record.AccountStatus === 1 ? '正常' : (record.AccountStatus === 2 ? '即将欠费' : (record.AccountStatus === 3 ? '欠费' : '-'))}
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="审核状态"
                                        dataIndex="AuditStatus"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {record.AuditStatus === 2 ? '待审核' : (record.AuditStatus === 3 ? '审核通过' : (record.AuditStatus === 4 ? '审核未通过' : '-'))}
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="创建时间"
                                        dataIndex="CreateTime"
                                        sorter={true}
                                        sortOrder={o_createTimeOrder}
                                        key='o_createTimeOrder'
                                    />
                                    <Column
                                        title="最近一次更新"
                                        dataIndex="ModifyTime"
                                        sorter={true}
                                        sortOrder={o_modifyTimeOrder}
                                        key='o_modifyTimeOrder'
                                    />
                                    <Column
                                        title="业务员"
                                        dataIndex="AuditEmployeeID"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {record.EmployeeName}
                                                </div>
                                            );
                                        }}
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
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields: (props) => {
        return {
            q_companyName: props.q_companyName,
            q_laborBossId: props.q_laborBossId,
            q_areaCode: props.q_areaCode,
            q_createTime: props.q_createTime,
            q_accountStatus: props.q_accountStatus,
            q_cooperStatus: props.q_cooperStatus,
            q_employeeId: props.q_employeeId
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_servicer_labor_company_list', fields);
    }
})(Company);