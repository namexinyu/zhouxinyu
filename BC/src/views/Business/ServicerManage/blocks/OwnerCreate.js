import React from 'react';
import { Row, Form, Col, Input, Button, Icon, Select, Cascader, DatePicker, Table, Switch, Modal, message } from 'antd';
import { browserHistory } from 'react-router';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import uploadRule from 'CONFIG/uploadRule';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import LaborAction from 'ACTION/Business/Labor/LaborAction';
import doTabPage from 'ACTION/TabPage/doTabPage';
import setFetchStatus from 'ACTION/setFetchStatus';
import QueryParam from 'mams-com/lib/utils/base/QueryParam';

const {
    createLaborBossInfo,
    getLaborBossCompanyList
} = LaborAction;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { Column, ColumnGroup } = Table;

class OwnerEdit extends React.PureComponent {
    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            resetState('state_servicer_labor_boss_create');
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.createLaborBossInfoFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_boss_create', 'createLaborBossInfoFetch', 'close');
            message.success(((this.props.routeParams.ownerId === '0' && !QueryParam.getQueryParam(window.location.href, 'checkId')) ? '新建' : '修改') + '大老板成功');
            doTabPage({
                id: this.props.location.pathname + this.props.location.search,
                route: this.props.location.pathname
            }, 'close');
        }
        if (nextProps.createLaborBossInfoFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_boss_create', 'createLaborBossInfoFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.createLaborBossInfoFetch.response.Desc
            });
        }
    }
    handleUploadChange(id, fileList) {
        setParams('state_servicer_labor_boss_create', {
            [id]: fileList
        });
    }
    handleCancel() {
        doTabPage({
            id: this.props.location.pathname,
            route: this.props.location.pathname
        }, 'close');
    }
    handleSubmit() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) return;
            let params = {};
            params.IDCardNum = values.laborBossIdCard;
            params.LbAuditID = QueryParam.getQueryParam(window.location.href, 'checkId') ? parseInt(QueryParam.getQueryParam(window.location.href, 'checkId'), 10) : 0;
            params.LBossID = parseInt(this.props.routeParams.ownerId, 10);
            params.LBossName = values.laborBossName;
            params.MobileNum = values.laborBossMobile;
            if (this.props.laborBossIdCardPositive.length) {
                params.IDCardPhoto1Url = this.props.laborBossIdCardPositive[0].response.name;
            }
            if (this.props.laborBossIdCardOpposite.length) {
                params.IDCardPhoto2Url = this.props.laborBossIdCardOpposite[0].response.name;
            }
            createLaborBossInfo(params);
        });
    }
    render() {
        const { laborBossIdCardPositive, laborBossIdCardOpposite, companyList } = this.props;
        const { getFieldDecorator } = this.props.form;
        const isCreate = this.props.routeParams.ownerId === '0' || QueryParam.getQueryParam(window.location.href, 'checkId');
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>新建大老板</h1>
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
                                        }} label="姓名">
                                            {getFieldDecorator('laborBossName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入大老板姓名'
                                                    },
                                                    {
                                                        pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                                        message: '姓名必须为中文或英文字符'
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
                                            {getFieldDecorator('laborBossMobile', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入大老板联系电话'
                                                    },
                                                    {
                                                        pattern: /^1[3-9][0-9]\d{8}$/,
                                                        message: '请输入正确的11位手机号'
                                                    }
                                                ]
                                            })(<Input placeholder="请输入大老板联系电话" type="tel" />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={4}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="身份证号">
                                            {getFieldDecorator('laborBossIdCard', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入18位身份证号'
                                                    },
                                                    {
                                                        pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                                                        message: '请输入正确的18位身份证号'
                                                    }
                                                ]
                                            })(<Input placeholder="请输入18位身份证号" type="text" />)}
                                        </FormItem>
                                    </Col>
                                    {/* {!isCreate && <Col span={8} key={3}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="合作状态">
                                            {getFieldDecorator('cooperStatus', {
                                                rules: []
                                            })(<Switch />)}
                                        </FormItem>
                                    </Col>} */}
                                </Row>
                                <Row gutter={40}>
                                    <Col span={2}></Col>
                                    <Col span={4} key={5}>
                                        <AliyunUpload id={'laborBossIdCardPositive'} accept="image/jpeg,image/png" oss={uploadRule.laborBossCertPicture}
                                            listType="picture-card" defaultFileList={laborBossIdCardPositive} maxNum={1} uploadChange={this.handleUploadChange.bind(this)} />
                                        <p>正面身份证</p>
                                    </Col>
                                    <Col span={4} key={6}>
                                        <AliyunUpload id={'laborBossIdCardOpposite'} accept="image/jpeg,image/png" oss={uploadRule.laborBossCertPicture}
                                            listType="picture-card" defaultFileList={laborBossIdCardOpposite} maxNum={1} uploadChange={this.handleUploadChange.bind(this)} />
                                        <p>反面身份证</p>
                                    </Col>
                                </Row>
                            </Form>

                            {!isCreate && <Row className="mt-16">
                                <Table
                                    rowKey={record => record.LaborID.toString()}
                                    dataSource={companyList}
                                    pagination={false}>
                                    <Column
                                        title="劳务公司"
                                        dataIndex="ShortName"
                                    />
                                    <Column
                                        title="账户信用"
                                        dataIndex="AccountCredit"
                                    />
                                    <Column
                                        title="账户余额"
                                        dataIndex="AccountBalance"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {(record.AccountBalance / 100).FormatMoney({ fixed: 2 })}
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="冻结押金"
                                        dataIndex="FrozenAmount"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {(record.FrozenAmount / 100).FormatMoney({ fixed: 2 })}
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="可用余额"
                                        dataIndex="AccountCanUse"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {(record.AccountCanUse / 100).FormatMoney({ fixed: 2 })}
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
                                </Table>
                            </Row>}
                            <Row className="mt-24 text-center">
                                <Button htmlType="button" onClick={this.handleCancel.bind(this)}>返回</Button>
                                <Button htmlType="button" type="primary" className="ml-8" onClick={this.handleSubmit.bind(this)}>提交</Button>
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
            laborBossName: props.laborBossName,
            laborBossMobile: props.laborBossMobile,
            laborBossIdCard: props.laborBossIdCard
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_servicer_labor_boss_create', fields);
    }

})(OwnerEdit);