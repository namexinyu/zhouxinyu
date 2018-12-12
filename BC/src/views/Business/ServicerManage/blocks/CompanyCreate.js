import React from 'react';
import {
    Row,
    Form,
    Col,
    Input,
    Button,
    Icon,
    InputNumber,
    Select,
    Cascader,
    DatePicker,
    Table,
    Switch,
    Modal,
    Radio,
    Checkbox,
    message
} from 'antd';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import doTabPage from 'ACTION/TabPage/doTabPage';
import setFetchStatus from 'ACTION/setFetchStatus';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import {CONFIG} from 'mams-com';

const {getPCA, antAreaOptions} = CONFIG;
import ActionCompany from 'ACTION/Business/Company/ActionCompany';
import CommonAction from 'ACTION/Business/Common';
import QueryParam from 'mams-com/lib/utils/base/QueryParam';

const {
    createCompanyInfo,
    getCompanyDetail,
    getCheckCompanyDetail,
    editCheckCompanyInfo,
    getLaborBossContactInfo
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

class CompanyCreate extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = antAreaOptions;
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getLaborBossSimpleList();
            resetState('state_servicer_labor_company_create');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.createCompanyInfoFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_company_create', 'createCompanyInfoFetch', 'close');
            message.success(this.props.routeParams.companyId === 'new' ? '新建劳务公司成功' : '修改劳务公司信息成功');
            doTabPage({
                id: this.props.location.pathname + this.props.location.search
            }, 'close');
        }
        if (nextProps.createCompanyInfoFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_company_create', 'createCompanyInfoFetch', 'close');
            let res = nextProps.createCompanyInfoFetch.response;
            Modal.error({
                title: window.errorTitle.normal,
                content: res ? (res.customDesc || res.Desc) : ''
            });
        }

        if (nextProps.getLaborBossContactInfoFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_company_create', 'getLaborBossContactInfoFetch', 'close');
            let data = nextProps.getLaborBossContactInfoFetch.response.Data;
            setParams('state_servicer_labor_company_create', {
                contactName: {
                    value: data.BossName
                },
                contactMobile: {
                    value: data.Mobile
                }
            });
        }
        if (nextProps.getLaborBossContactInfoFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_company_create', 'getLaborBossContactInfoFetch', 'close');
            setParams('state_servicer_labor_company_create', {
                useLaborBossContactCheck: false
            });
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.getLaborBossContactInfoFetch.response.Desc
            });
        }
    }

    handleTranslateData(data) {
        this.props.form.setFields({
            companyShortName: {
                value: data.ShortName
            },
            companyName: {
                value: data.LaborName
            },
            laborBossId: {
                value: {
                    value: data.LaborBossID,
                    text: data.BossName
                }
            },
            contactName: {
                value: data.LinkMan
            },
            contactMobile: {
                value: data.Mobile
            },
            percentTag: {
                value: data.DepositPercentage
            },
            defaultCreditPoint: {
                value: data.CreditDefault
            },
            email: {
                value: data.Mail
            },
            areaCode: {
                value: getPCA.getPCACode(data.AreaCode)
            },
            address: {
                value: data.Address
            }
        });
        getClient(uploadRule.companyCertPicture).then((client) => {
            let companyOther = data.OtherPicPath;
            if (companyOther) {
                setParams('state_servicer_labor_company_create', {
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
                setParams('state_servicer_labor_company_create', {
                    companyOther: []
                });
            }
            let companyBL = data.PicPath;
            if (companyBL) {
                setParams('state_servicer_labor_company_create', {
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
                setParams('state_servicer_labor_company_create', {
                    companyBL: []
                });
            }
        });
        getClient(uploadRule.companyLogo).then((client) => {
            let companyLogo = data.LogoPath;
            if (companyLogo) {
                setParams('state_servicer_labor_company_create', {
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
                setParams('state_servicer_labor_company_create', {
                    companyLogo: []
                });
            }
        });
    }

    handleUploadChange(id, fileList) {
        setParams('state_servicer_labor_company_create', {
            [id]: fileList
        });
    }

    handleCancelEdit() {
        doTabPage({
            id: this.props.location.pathname + this.props.location.search
        }, 'close');
    }

    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) return;
            let params = {
                Address: values.address || '',
                AreaCode: (values.areaCode && values.areaCode[2]) ? values.areaCode[2] : '',
                CreditDefault: values.defaultCreditPoint ? parseInt(values.defaultCreditPoint, 10) : '',
                DepositPercentage: values.percentTag ? parseInt(values.percentTag, 10) : '',
                LaborBossID: values.laborBossId && values.laborBossId.value ? parseInt(values.laborBossId.value, 10) : '',
                LaborName: values.companyName || '',
                ShortName: values.companyShortName || ''
            };
            if (this.props.routeParams.companyId !== 'new') {
                params.LaborID = parseInt(this.props.routeParams.companyId, 10);
            }
            if (values.contactName) {
                params.LinkMan = values.contactName;
            }
            if (values.contactMobile) {
                params.Mobile = values.contactMobile;
            }
            if (values.email) {
                params.Mail = values.email;
            }
            if (this.props.companyBL.length && this.props.companyBL[0].status === 'done') {
                params.PicPath = this.props.companyBL[0].response.name;
            }
            if (this.props.companyLogo.length && this.props.companyLogo[0].status === 'done') {
                params.LogoPath = this.props.companyLogo[0].response.name;
            }
            if (this.props.companyOther.length && this.props.companyOther[0].status === 'done') {
                params.OtherPicPath = this.props.companyOther[0].response.name;
            }
            if (QueryParam.getQueryParam(window.location.href, 'checkId')) {
                params.LaborAuditID = parseInt(QueryParam.getQueryParam(window.location.href, 'checkId'), 10);
                editCheckCompanyInfo(params);
            } else {
                createCompanyInfo(params);
            }

        });
    }

    useLaborBossContact(e) {
        if (e.target.checked) {
            if (!this.props.laborBossId || !this.props.laborBossId.value || !this.props.laborBossId.value.value) {
                message.warning('请先选择大老板');
                setParams('state_servicer_labor_company_create', {
                    useLaborBossContactCheck: false
                });
                return false;
            } else {
                setParams('state_servicer_labor_company_create', {
                    useLaborBossContactCheck: true
                });
                getLaborBossContactInfo({
                    LaborBossID: parseInt(this.props.laborBossId.value.value, 10)
                });
            }
        } else {
            setParams('state_servicer_labor_company_create', {
                useLaborBossContactCheck: false,
                contactName: {
                    value: ''
                },
                contactMobile: {
                    value: ''
                }
            });
        }
    }

    render() {
        const {businessCommon, companyBL, companyLogo, companyOther, companyAccountInfo} = this.props;
        const {getFieldDecorator} = this.props.form;
        let laborBossList = businessCommon.LaborBossSimpleList;
        let accountRecord = companyAccountInfo ? [companyAccountInfo] : [];
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>新建公司</h1>
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
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="公司简称">
                                            {getFieldDecorator('companyShortName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入公司简称'
                                                    },
                                                    {
                                                        pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                                        message: '公司名称必须为中文或英文字符'
                                                    }
                                                ]
                                            })(<Input type="text" placeholder="公司简称"/>)}
                                        </FormItem>

                                    </Col>
                                    <Col span={16} key={2}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="公司全称">
                                            {getFieldDecorator('companyName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入公司全称'
                                                    },
                                                    {
                                                        pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                                        message: '公司名称必须为中文或英文字符'
                                                    }
                                                ]
                                            })(<Input type="text" placeholder="公司全称" onChange={this.handleChange}/>)}
                                        </FormItem>

                                    </Col>
                                </Row>
                                <Row gutter={40}>
                                    <Col span={8} key={3}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="大老板">
                                            {getFieldDecorator('laborBossId', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '大老板必选'
                                                    }
                                                ]
                                            })(<AutoCompleteSelect allowClear={true} optionsData={{
                                                valueKey: 'LaborBossID',
                                                textKey: 'BossName',
                                                dataArray: laborBossList
                                            }}/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={5} key={4}>
                                        <FormItem {...{
                                            labelCol: {span: 10},
                                            wrapperCol: {span: 14}
                                        }} label="对外联系人">
                                            {getFieldDecorator('contactName', {
                                                rules: [
                                                    {
                                                        pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                                        message: '联系人名称必须为中文或英文字符'
                                                    }
                                                ]
                                            })(<Input type="text" placeholder="对接人"/>)}
                                        </FormItem>

                                    </Col>
                                    <Col span={5} key={5}>
                                        <FormItem {...{
                                            labelCol: {span: 10},
                                            wrapperCol: {span: 14}
                                        }} label="联系电话">
                                            {getFieldDecorator('contactMobile', {
                                                rules: [
                                                    {
                                                        pattern: /^1[3-9][0-9]\d{8}$/,
                                                        message: '请输入正确的11位手机号'
                                                    }
                                                ]
                                            })(<Input type="text" placeholder="联系电话" onChange={this.handleChange}/>)}
                                        </FormItem>

                                    </Col>
                                    <Col span={5} key={6}>
                                        <FormItem>
                                            <Checkbox
                                                checked={this.props.useLaborBossContactCheck}
                                                onChange={this.useLaborBossContact.bind(this)}
                                            >
                                                勾选法人联系方式
                                            </Checkbox>
                                        </FormItem>

                                    </Col>
                                </Row>
                                <Row gutter={40}>
                                    <Col span={8} key={7}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="押金比率(%)">
                                            {getFieldDecorator('percentTag', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '押金比率必填'
                                                    }
                                                ]
                                            })(<InputNumber min={0} max={100} className="w-100" placeholder="押金比率"/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={8}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="初始信用分">
                                            {getFieldDecorator('defaultCreditPoint', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '初始信用分必填'
                                                    }
                                                ]
                                            })(<InputNumber min={0} max={900} className="w-100" placeholder="初始信用分"/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={9}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="邮箱">
                                            {getFieldDecorator('email', {
                                                rules: [
                                                    {
                                                        pattern: /^\S+\@\S+\.\S+$/,
                                                        message: '请输入邮箱，例如example@qq.com'
                                                    }
                                                ]
                                            })(<Input type="text" placeholder="邮箱"/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={40}>
                                    <Col span={8} key={10}>
                                        <FormItem {...{
                                            labelCol: {span: 5},
                                            wrapperCol: {span: 19}
                                        }} label="所属地区">
                                            {getFieldDecorator('areaCode', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '所属区域必选'
                                                    }
                                                ]
                                            })(<Cascader options={this.antOptions} placeholder="请选择省/市/区" changeOnSelect
                                                         showSearch/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={16} key={11}>
                                        <FormItem>
                                            {getFieldDecorator('address', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入详细地址'
                                                    }
                                                ]
                                            })(<Input type="text" placeholder="详细地址"/>)}
                                        </FormItem>
                                    </Col>
                                    {/* <Col span={8} key={12}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="合作状态">
                                            {getFieldDecorator('address', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: 'cooperStatus'
                                                    },
                                                ]
                                            })(<Switch />)}
                                        </FormItem>
                                    </Col> */}
                                </Row>
                            </Form>
                            <Row className="mt-16">
                                <Col span={2} key={16}></Col>
                                <Col span={4} key={13}>
                                    <AliyunUpload id={'companyBL'} accept="image/jpeg,image/png"
                                                  oss={uploadRule.companyCertPicture}
                                                  listType="picture-card" defaultFileList={companyBL} maxNum={1}
                                                  uploadChange={this.handleUploadChange.bind(this)}/>
                                    <p>营业执照</p>
                                </Col>
                                <Col span={4} key={14}>
                                    <AliyunUpload id={'companyLogo'} accept="image/jpeg,image/png"
                                                  oss={uploadRule.companyLogo}
                                                  listType="picture-card" defaultFileList={companyLogo} maxNum={1}
                                                  uploadChange={this.handleUploadChange.bind(this)}/>
                                    <p>公司Logo</p>
                                </Col>
                                <Col span={4} key={15}>
                                    <AliyunUpload id={'companyOther'} accept="image/jpeg,image/png"
                                                  oss={uploadRule.companyCertPicture}
                                                  listType="picture-card" defaultFileList={companyOther} maxNum={1}
                                                  uploadChange={this.handleUploadChange.bind(this)}/>
                                    <p>其他证明</p>
                                </Col>
                            </Row>
                            {this.props.routeParams.companyId !== 'new' && <Row className="mt-24">
                                <Table rowKey={record => record.AccountID.toString()}
                                       dataSource={accountRecord}
                                       pagination={false}>
                                    <Column
                                        title="信用评分"
                                        dataIndex="Credit"
                                    />
                                    <Column
                                        title="账户余额"
                                        dataIndex="Balance"
                                        render={(text, record, index) => {
                                            return (
                                                <div>{(record.Balance / 100).FormatMoney({fixed: 2})}</div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="冻结押金"
                                        dataIndex="FrozenAmount"
                                        render={(text, record, index) => {
                                            return (
                                                <div>{(record.FrozenAmount / 100).FormatMoney({fixed: 2})}</div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="可用余额"
                                        dataIndex="AvailableAmount"
                                        render={(text, record, index) => {
                                            return (
                                                <div>{(record.AvailableAmount / 100).FormatMoney({fixed: 2})}</div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="账户状态"
                                        dataIndex="AccountStatus"
                                        render={(text, record, index) => {
                                            return (
                                                <div>{record.AccountStatus === 1 ? '正常' : (record.AccountStatus === 2 ? '即将欠费' : (record.AccountStatus === 3 ? '欠费' : '-'))}</div>
                                            );
                                        }}
                                    />
                                </Table>
                            </Row>}
                            <Row className="mt-24 text-center">
                                <Button htmlType="button" type="cancel"
                                        onClick={this.handleCancelEdit.bind(this)}>取消</Button>
                                <Button htmlType="button" type="primary" className="ml-8"
                                        onClick={this.handleSubmit.bind(this)}>提交</Button>
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
            companyShortName: props.companyShortName,
            companyName: props.companyName,
            laborBoss: props.laborBoss,
            contactName: props.contactName,
            contactMobile: props.contactMobile,
            percentTag: props.percentTag,
            defaultCreditPoint: props.defaultCreditPoint,
            email: props.email,
            areaCode: props.areaCode,
            address: props.address,
            cooperStatus: props.cooperStatus
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_servicer_labor_company_create', fields);
    }

})(CompanyCreate);