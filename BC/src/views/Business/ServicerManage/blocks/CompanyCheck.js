import React from 'react';
import {
    Row,
    Form,
    Col,
    Input,
    Button,
    Icon,
    Select,
    Cascader,
    DatePicker,
    Table,
    Switch,
    InputNumber,
    Modal,
    Radio,
    message
} from 'antd';
import {browserHistory} from 'react-router';
import ActionCompany from 'ACTION/Business/Company/ActionCompany';
import CommonAction from 'ACTION/Business/Common';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import translateParamPost from 'ACTION/translateParamPost';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import {CONFIG} from 'mams-com';
import CompanyService from 'SERVICE/Business/Company';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import resetQueryParams from 'ACTION/resetQueryParams';

const {getCheckCompanyDetail} = CompanyService;
const {getPCA} = CONFIG;
const {
    getCompanyCheckList,
    checkCompany,
    exportCompanyAuditList
} = ActionCompany;
const {
    getRecruitSimpleList,
    getLaborBossSimpleList,
    getLaborSimpleList,
    getEmployeeList
} = CommonAction;
const FormItem = Form.Item;
const Option = Select.Option;
const {RangePicker} = DatePicker;
const {Column, ColumnGroup} = Table;
const RadioGroup = Radio.Group;

class CompanyCheck extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkVisible: false,
            showTableSpin: false,
            checkValue: 1
        };
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.getCompanyCheckList(this.props);
            getLaborBossSimpleList();
            getEmployeeList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.page !== this.props.page || nextProps.pageSize !== this.props.pageSize || nextProps.o_createTimeOrder !== this.props.o_createTimeOrder || nextProps.o_modifyTimeOrder !== this.props.o_modifyTimeOrder || nextProps.checkStatus !== this.props.checkStatus) {
            this.getCompanyCheckList(nextProps);
        }
        if (nextProps.getCompanyCheckListFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_company_check', 'getCompanyCheckListFetch', 'close');
            this.setState({
                showTableSpin: false
            });
        }
        if (nextProps.getCompanyCheckListFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_company_check', 'getCompanyCheckListFetch', 'close');
            this.setState({
                showTableSpin: false
            });
            message.error(nextProps.getCompanyCheckListFetch.response.Desc);
        }
        if (nextProps.checkCompanyFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_company_check', 'checkCompanyFetch', 'close');
            message.success('审核劳务公司成功');
            this.setState({
                checkVisible: false,
                checkValue: ''
            });
            this.getCompanyCheckList(nextProps);
        }
        if (nextProps.checkCompanyFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_company_check', 'checkCompanyFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.checkCompanyFetch.response.Desc
            });
        }
        if (nextProps.exportCompanyAuditListFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_company_check', 'exportCompanyAuditListFetch', 'close');
            message.success('导出成功');
            window.open(nextProps.exportCompanyAuditListFetch.response.Data.FileUrl, "_blank");
        }
        if (nextProps.exportCompanyAuditListFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_company_check', 'exportCompanyAuditListFetch', 'close');
            message.error(nextProps.exportCompanyAuditListFetch.response.Desc);
        }
    }

    getCompanyCheckList(props) {
        getCompanyCheckList(Object.assign(
            {
                RecordIndex: (props.page - 1) * props.pageSize,
                RecordSize: props.pageSize,
                AuditStatus: props.checkStatus
            },
            translateParamPost.query({
                CreateDate: props.q_createTime.value ? props.q_createTime.value.format('YYYY-MM-DD') : '',
                EmployeeID: (props.q_employeeId.value && props.q_employeeId.value.value) ? parseInt(props.q_employeeId.value.value, 10) : '',
                LaborBossID: (props.q_laborBossId.value && props.q_laborBossId.value.value) ? parseInt(props.q_laborBossId.value.value, 10) : '',
                LaborName: props.q_companyName.value || ''
            })
        ));
    }

    handleExport() {
        exportCompanyAuditList(translateParamPost.query({
            CreateDate: this.props.q_createTime.value ? this.props.q_createTime.value.format('YYYY-MM-DD') : '',
            EmployeeID: (this.props.q_employeeId.value && this.props.q_employeeId.value.value) ? parseInt(this.props.q_employeeId.value.value, 10) : '',
            LaborBossID: (this.props.q_laborBossId.value && this.props.q_laborBossId.value.value) ? parseInt(this.props.q_laborBossId.value.value, 10) : '',
            LaborName: this.props.q_companyName.value || ''
        }));
    }

    handleSearch() {
        this.props.form.validateFieldsAndScroll(['q_companyName', 'q_laborBossId', 'q_createTime', 'q_employeeId'], (errors, values) => {
            if (!errors) {
                if (this.props.page === 1) {
                    this.getCompanyCheckList(this.props);
                } else {
                    setParams('state_servicer_labor_company_check', {
                        page: 1
                    });
                }
            }
        });
    }

    handleReset() {
        resetQueryParams('state_servicer_labor_company_check');
    }

    handleTableChange(pagination, filters, sorter) {
        if (sorter) {
            if (sorter.columnKey) {
                setParams('state_servicer_labor_company_check', {
                    page: 1,
                    [sorter.columnKey]: (sorter.columnKey ? sorter.order : false)
                });
            } else {
                setParams('state_servicer_labor_company_check', {
                    page: 1,
                    o_createTimeOrder: false,
                    o_modifyTimeOrder: false
                });

            }

        }
        let page = pagination.current;
        let pageSize = pagination.pageSize;
        setParams('state_servicer_labor_company_check', {
            page: page,
            pageSize: pageSize
        });
    }

    handleChangeCheckStatus(value) {
        setParams('state_servicer_labor_company_check', {
            checkStatus: value
        });
    }

    handleCheck(record) {
        getClient(uploadRule.companyCertPicture).then((client) => {
            let companyBL = record.PicPath;
            let companyOther = record.OtherPicPath;
            if (companyBL) {
                setParams('state_servicer_labor_company_check', {
                    companyBL: [{
                        status: 'done',
                        uid: companyBL,
                        name: companyBL,
                        url: client.signatureUrl(companyBL),
                        response: {
                            name: companyBL
                        }
                    }]
                });
            } else {
                setParams('state_servicer_labor_company_check', {
                    companyBL: []
                });
            }
            if (companyOther) {
                setParams('state_servicer_labor_company_check', {
                    companyOther: [{
                        status: 'done',
                        uid: companyOther,
                        name: companyOther,
                        url: client.signatureUrl(companyOther),
                        response: {
                            name: companyOther
                        }
                    }]
                });
            } else {
                setParams('state_servicer_labor_company_check', {
                    companyOther: []
                });
            }
        });
        getClient(uploadRule.companyLogo).then((client) => {
            let companyLogo = record.LogoPath;
            if (companyLogo) {
                setParams('state_servicer_labor_company_check', {
                    companyLogo: [{
                        status: 'done',
                        uid: companyLogo,
                        name: companyLogo,
                        url: client.signatureUrl(companyLogo),
                        response: {
                            name: companyLogo
                        }
                    }]
                });
            } else {
                setParams('state_servicer_labor_company_check', {
                    companyLogo: []
                });
            }
        });
        setParams('state_servicer_labor_company_check', {
            currentCompany: record,
            noPassReason: '',
            checkPercentTag: {
                value: ''
            },
            checkCreditPoint: {
                value: ''
            },
            checkEmployee: {
                value: ''
            }
        });
        getCheckCompanyDetail({LaborAuditID: record.LaborAuditID}).then(res => {
            res.Data && setParams('state_servicer_labor_company_check', {
                checkCreditPoint: {
                    value: res.Data.CreditDefault
                },
                checkPercentTag: {
                    value: res.Data.DepositPercentage
                }
            });
        }).catch(err => {
            message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
        });
        // record.LaborAuditID
        this.setState({
            checkVisible: true,
            checkValue: 1
        });
    }

    handleReEdit(record) {
        browserHistory.push({
            pathname: '/bc/servicer/company/edit/replay',
            query: {
                checkId: record.LaborAuditID
            }
        });
    }

    getPCAString(aCode) {
        return getPCA.getPCAString(aCode);
    }

    handleOkCheck() {
        this.props.form.validateFieldsAndScroll(['noPassReason', 'checkPercentTag', 'checkCreditPoint', 'checkEmployee'], (errors, values) => {

            if (errors) return;
            let params = {
                AuditStatus: this.state.checkValue === 1 ? 3 : (this.state.checkValue === 2 ? 4 : ''),
                LaborAuditID: this.props.currentCompany.LaborAuditID,
                LaborID: this.props.currentCompany.LaborID
            };
            if (values.noPassReason && this.state.checkValue === 2) {
                params.Remark = values.noPassReason;
            }
            if (this.state.checkValue === 1) {
                params.CreditDefault = values.checkCreditPoint;
                params.DepositPercentage = values.checkPercentTag;
                params.EmployeeID = parseInt(values.checkEmployee.value, 10);
            }
            checkCompany(params);
        });

    }

    handleCloseCheck() {
        this.setState({
            checkVisible: false,
            checkStatus: ''
        });
    }

    handleCheckChange(e) {
        this.setState({
            checkValue: e.target.value
        });
    }

    handleSeeLog() {
        browserHistory.push({
            pathname: '/bc/log/5'
        });
    }

    render() {
        const {recordList, recordCount, pageSize, page, checkStatus, businessCommon, currentCompany, companyBL, companyLogo, companyOther} = this.props;
        const {showTableSpin, checkVisible, checkValue} = this.state;
        const {getFieldDecorator} = this.props.form;
        let laborBossList = businessCommon.LaborBossSimpleList;
        let employeeList = businessCommon.EmployeeList;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>审核公司</h1>
                </div>
                <Row>
                    <div className="container-fluid mt-24">
                        <div className="container bg-white">
                            <Form
                                className="ant-advanced-search-form"
                            >
                                <Row gutter={20}>
                                    <Col span={6} key={1}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="劳务公司">
                                            {getFieldDecorator('q_companyName', {
                                                rules: [
                                                    {
                                                        pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                                        message: '劳务公司名称为中文或英文'
                                                    }
                                                ]
                                            })(<Input placeholder="简称或全称" type="text"/>)}
                                        </FormItem>

                                    </Col>
                                    <Col span={6} key={2}>
                                        <FormItem {...{
                                            labelCol: {span: 8},
                                            wrapperCol: {span: 16}
                                        }} label="大老板">
                                            {getFieldDecorator('q_laborBossId', {
                                                rules: []
                                            })(<AutoCompleteSelect allowClear={true} optionsData={{
                                                valueKey: 'LaborBossID',
                                                textKey: 'BossName',
                                                dataArray: laborBossList
                                            }}/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={6} key={3}>
                                        <FormItem {...{
                                            labelCol: {span: 8},
                                            wrapperCol: {span: 16}
                                        }} label="创建时间">
                                            {getFieldDecorator('q_createTime', {
                                                rules: []
                                            })(<DatePicker/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={6} key={4}>
                                        <FormItem {...{
                                            labelCol: {span: 10},
                                            wrapperCol: {span: 14}
                                        }} label="所属业务员">
                                            {getFieldDecorator('q_employeeId', {
                                                rules: []
                                            })(<AutoCompleteSelect allowClear={true} optionsData={{
                                                valueKey: 'SalesEmployeeID',
                                                textKey: 'Name',
                                                dataArray: employeeList
                                            }}/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{textAlign: 'right'}}>
                                        <Button type="primary" htmlType="button"
                                                onClick={this.handleSearch.bind(this)}>查询</Button>
                                        <Button style={{marginLeft: 8}}
                                                onClick={this.handleReset.bind(this)}>重置</Button>
                                    </Col>
                                </Row>
                            </Form>
                            <Row className="mt-24">
                                <Button type={checkStatus === -9999 ? 'primary' : ''} htmlType="button"
                                        onClick={() => this.handleChangeCheckStatus(-9999)}>全部公司({this.props.AllAuditCount})</Button>
                                <Button type={checkStatus === 2 ? 'primary' : ''} htmlType="button" className="ml-8"
                                        onClick={() => this.handleChangeCheckStatus(2)}>待审核({this.props.UnAuditCount})</Button>
                                <Button type={checkStatus === 4 ? 'primary' : ''} htmlType="button" className="ml-8"
                                        onClick={() => this.handleChangeCheckStatus(4)}>已拒绝({this.props.RejectCount})</Button>
                            </Row>
                            <Row className="mt-24">
                                <div className="float-right text-right">
                                    <Button type="" htmlType="button" onClick={this.handleSeeLog}>查看日志</Button>
                                    <Button type="" htmlType="button" className="ml-8"
                                            onClick={this.handleExport.bind(this)}>导出列表</Button>
                                </div>
                            </Row>
                            <Row className="mt-24">
                                <Table rowKey={record => record.LaborAuditID.toString()}
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
                                        title="创建时间"
                                        dataIndex="CreateTime"
                                    />
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
                                        title="所属地址"
                                        dataIndex="AreaCode"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {getPCA.getPCAString(record.AreaCode) + record.Address}
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
                                                    {record.AuditStatus === 2 ? '待审核' : (record.AuditStatus === 3 ? '审核通过' : (record.AuditStatus === 4 ? '已拒绝' : '-'))}
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="备注"
                                        dataIndex="Remark"
                                        key="Remark"
                                    />
                                    <Column
                                        title="业务员"
                                        dataIndex="EmployeeName"
                                        key="EmployeeName"
                                    />
                                    <Column
                                        title="操作"
                                        dataIndex="g"
                                        key="g"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {record.AuditStatus === 2 && <a href="javascript:void(0)"
                                                                                    onClick={() => this.handleCheck(record)}>审核</a>}
                                                    {record.AuditStatus === 4 && <a href="javascript:void(0)"
                                                                                    onClick={() => this.handleReEdit(record)}>重新编辑</a>}
                                                </div>
                                            );
                                        }}
                                    />
                                </Table>
                            </Row>
                        </div>
                    </div>
                </Row>
                <Modal
                    title="审核公司"
                    visible={checkVisible}
                    onOk={this.handleOkCheck.bind(this)}
                    onCancel={this.handleCloseCheck.bind(this)}
                >
                    <Row>
                        <FormItem {...{
                            labelCol: {span: 6},
                            wrapperCol: {span: 18}
                        }} label="公司简称" required>
                            {currentCompany.ShortName}
                        </FormItem>
                        <FormItem {...{
                            labelCol: {span: 6},
                            wrapperCol: {span: 18}
                        }} label="公司全称" required>
                            {currentCompany.LaborName}
                        </FormItem>
                        <FormItem {...{
                            labelCol: {span: 6},
                            wrapperCol: {span: 18}
                        }} label="联系人/电话">
                            {currentCompany.LinkMan + '/' + currentCompany.Mobile}
                        </FormItem>
                        <FormItem {...{
                            labelCol: {span: 6},
                            wrapperCol: {span: 18}
                        }} label="邮箱">
                            {currentCompany.Mail}
                        </FormItem>
                        <FormItem {...{
                            labelCol: {span: 6},
                            wrapperCol: {span: 18}
                        }} label="详细地址">
                            {this.getPCAString(currentCompany.AreaCode) + currentCompany.Address}
                        </FormItem>
                    </Row>
                    <Row className="mt-24">
                        <Col span={6} key={1}>
                            <AliyunUpload id={'companyBL'} accept="image/jpeg,image/png" disabled={true}
                                          listType="picture-card" defaultFileList={companyBL} maxNum={1}/>
                            <p>营业执照</p>
                        </Col>
                        <Col span={6} key={2}>
                            <AliyunUpload id={'companyLogo'} accept="image/jpeg,image/png" disabled={true}
                                          listType="picture-card" defaultFileList={companyLogo} maxNum={1}/>
                            <p>公司Logo</p>
                        </Col>
                        <Col span={6} key={3}>
                            <AliyunUpload id={'companyOther'} accept="image/jpeg,image/png" disabled={true}
                                          listType="picture-card" defaultFileList={companyOther} maxNum={1}/>
                            <p>其他资质</p>
                        </Col>
                    </Row>
                    <Row className="mt-24">
                        <RadioGroup onChange={this.handleCheckChange.bind(this)} value={checkValue}>
                            <Radio value={1}>审核通过</Radio>
                            <Radio value={2}>审核不通过</Radio>
                        </RadioGroup>
                    </Row>
                    {checkValue === 2 && <Row className="mt-24">
                        <Col span={24} key={1}>
                            <FormItem {...{
                                labelCol: {span: 4},
                                wrapperCol: {span: 19}
                            }} label="拒绝原因">
                                {getFieldDecorator('noPassReason', {
                                    rules: [
                                        {
                                            required: checkValue === 2 && checkVisible ? true : false,
                                            message: '拒绝原因必填'
                                        },
                                        {
                                            min: 5,
                                            message: '原因不能少于5个字'
                                        }
                                    ]
                                })(<Input placeholder="请输入拒绝原因，至少5个字" type="text"/>)}
                            </FormItem>
                        </Col>
                    </Row>}
                    {checkValue === 1 && <Row className="mt-24">
                        <Col span={24} key={1}>
                            <FormItem {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} label="分配业务员">
                                {getFieldDecorator('checkEmployee', {
                                    rules: [
                                        {
                                            required: checkValue === 1 && checkVisible ? true : false,
                                            message: '业务员必选'
                                        }
                                    ]
                                })(<AutoCompleteSelect allowClear={true} optionsData={{
                                    valueKey: 'SalesEmployeeID',
                                    textKey: 'Name',
                                    dataArray: employeeList
                                }}/>)}
                            </FormItem>
                        </Col>
                        <Col span={24} key={2}>
                            <FormItem {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} label="配置押金比率(%)">
                                {getFieldDecorator('checkPercentTag', {
                                    rules: [
                                        {
                                            required: checkValue === 1 && checkVisible ? true : false,
                                            message: '押金比率必填'
                                        }
                                    ]
                                })(<InputNumber min={0} max={100} className="w-100" placeholder="请输入押金比率（0-100）"
                                                type="text"/>)}
                            </FormItem>
                        </Col>
                        <Col span={24} key={3}>
                            <FormItem {...{
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} label="初始信用分(%)">
                                {getFieldDecorator('checkCreditPoint', {
                                    rules: [
                                        {
                                            required: checkValue === 1 && checkVisible ? true : false,
                                            message: '初始信用分必填'
                                        }
                                    ]
                                })(<InputNumber min={0} max={900} className="w-50" placeholder="请输入初始信用分（0-900）,建议400分"
                                                type="text"/>)}建议400分
                            </FormItem>
                        </Col>
                    </Row>}
                </Modal>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields: (props) => {
        return {
            q_companyName: props.q_companyName,
            q_laborBossId: props.q_laborBossId,
            q_createTime: props.q_createTime,
            q_employeeId: props.q_employeeId,
            checkPercentTag: props.checkPercentTag,
            checkCreditPoint: props.checkCreditPoint,
            checkEmployee: props.checkEmployee
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_servicer_labor_company_check', fields);
    }

})(CompanyCheck);