import React from 'react';
import {Row, Form, Input, Select, Button, Col, Icon, DatePicker, Switch, Table, Popconfirm, Radio, Modal, message } from 'antd';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import getLandManage from 'ACTION/ExpCenter/LandManage';
import getNewAccount from 'ACTION/ExpCenter/NewAccount';
import setFetchStatus from 'ACTION/setFetchStatus';
import getBindEmployee from 'ACTION/ExpCenter/BindEmployee';
import setParams from 'ACTION/setParams';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const EmployeeID = AppSessionStorage.getEmployeeID();
const HubManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") !== -1;
import fac from 'COMPONENT/FUCTIONS';
const {messageSuccess, messageError} = fac;
const STATE_NAME = 'state_ec_land_manage';
const STATE_NAME2 = 'state_ec_bind_employee';
const STATE_NAME3 = 'state_ec_new_account';
message.config({
    top: "50%",
    duration: 2,
    marginTop: "-17px"
});
class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);


    }


    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let Parms = {...values};
            for (let key in values) {
                Parms[key] = Parms[key] || '';
                if(key === "HubID") {
                    Parms[key] = Number(Parms[key]) || 0;
                }
            }
            getLandManage(Parms);
            setParams(STATE_NAME, {QueryParams: Object.assign({}, Parms)});
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };


    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;

        return(
            <Row>
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="账号">
                            {getFieldDecorator('ReceAccountName')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="姓名">
                            {getFieldDecorator('Name')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="手机号">
                            {getFieldDecorator('Mobile')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="身份证号">
                            {getFieldDecorator('IDCardNum')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="体验中心" style={{display: this.props.HubList.length > 1 ? "block" : "none"}}>
                            {getFieldDecorator("HubID")(
                                    <Select
                                        placeholder="全部体验中心"
                                        size="large"
                                    >
                                        <Option value="">全部体验中心</Option>
                                        {
                                            (this.props.HubList || []).map((item, index) => {
                                                return (
                                                    <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right', paddingRight: "10px", marginBottom: "20px" }}>
                        <Button onClick={this.handleReset}>重置</Button>
                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">搜索</Button>
                    </Col>
                </Row>
            </Row>

        );
    }

    render() {
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
                style={{position: "relative"}}
            >
                <Row gutter={40}>{this.getFields()}</Row>
            </Form>
        );
    }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);





export default class LandManage extends React.PureComponent { // 页面组件
    constructor(props) {
        super(props);


    }
    componentWillMount() {
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        let Parms = {...this.props.QueryParams};
        Parms.HubID = this.HubList.length > 1 ? 0 : this.HubIDListALL[0];
        getLandManage(Parms);
        setParams(STATE_NAME, {QueryParams: Object.assign({}, Parms)});
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.getBindEmployeeFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'getBindEmployeeFetch', 'close');
            messageSuccess("绑定员工成功！");
            getLandManage(this.props.QueryParams);
        }
        if(nextProps.getNewAccountFetch.status === "success") {
            setFetchStatus(STATE_NAME3, 'getNewAccountFetch', 'close');
            messageSuccess("新建账号成功，已生成二维码。");
            getLandManage(this.props.QueryParams);
        }
    }
    handleCancel = ()=>{
        setParams(STATE_NAME, {showModel2: false, record: null});
    };
    render() {
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">地推账号管理</div>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-2">
                            <WrappedAdvancedSearchForm HubList={this.HubList}/>
                            <AlertWindow HubList={this.HubList} showModel={this.props.showModel} record={this.props.record}/>
                            <Table rowKey="key" loading={this.props.RecordListLoading} bordered dataSource={this.props.RecordList} columns={createColumns()} />
                            <Modal title="" width="300px" visible={this.props.showModel2} onCancel={this.handleCancel} footer={null}>
                                <img src={this.props.record ? this.props.record.URL : ''} alt="请先绑定账号生成二维码"/>
                            </Modal>
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}
function createColumns() {
    return ([{
        title: '账号名称',
        dataIndex: 'ReceAccountName'
    }, {
        title: '真实姓名',
        dataIndex: 'Name'
    }, {
        title: '手机号',
        dataIndex: 'Mobile'
    }, {
        title: '身份证号',
        dataIndex: 'IDCardNum'
    }, {
        title: '所属体验中心',
        dataIndex: 'HubName'
    }, {
        title: '操作',
        dataIndex: 'op',
        render: (text, record) => {
        return (
            <div>
                <a href="javascript:;" style={{marginRight: "10px"}} onClick={()=>{
                    setParams(STATE_NAME, {showModel2: true, record: record});
                }}>查看二维码</a>
                <a href="javascript:;" disabled={record.IDCardNum ? true : false} onClick={()=>{
                    if(record.IDCardNum) return;
                    setParams(STATE_NAME, {record: record, showModel: true});
                }}>绑定员工</a>
            </div>
        );
    }
    }].map((item)=>{
        if(!item.render) {
            item.render = (text, record) => {
                let listName = record[item.dataIndex];
                return (
                    <div>
                        {listName}
                    </div>
                );
            };
        }
        return item;
    }));
}

class AlertWindow extends React.PureComponent { // 弹出框组件

    constructor(props) {
        super(props);
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
    }
    componentWillMount() {

    }
    hideModal() {
        setParams(STATE_NAME, {record: null, showModel: false});
    }
    showModal() {

        setParams(STATE_NAME, {showModel: true});
    }
    render() {
        return (
            <div>
                {HubManager ? <Button style={{margin: "20px 10px 20px 0"}} onClick={this.showModal} type="primary" >新建账号</Button> : ''}
                <Modal
                    title={this.props.record ? "绑定员工" : "新建账号"}
                    visible={this.props.showModel}
                    okText="确定"
                    cancelText="取消"
                    width="400px"
                    onCancel={this.hideModal}>
                    {this.props.record ? <WrappedAccount2 close={this.hideModal} record={this.props.record}/> : <WrappedAccount HubList={this.props.HubList} close={this.hideModal}/>}
                </Modal>
            </div>
        );
    }
}
class AccountSearchForm extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);


    }
    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err && values.ReceAccountName && values.HubID) {
                getNewAccount({
                    ReceAccountName: values.ReceAccountName,
                    HubID: Number(values.HubID)
                });
                this.props.form.resetFields();
                this.props.close();
            }
        });

    };

    handleCancel = () => {
        this.props.close();
    };

    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Col span={24}>
                    <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="账号名称">
                        {getFieldDecorator("ReceAccountName", {rules: [
                            {
                                required: true,
                                message: '账号名称必填'
                            }]})(
                            <Input size="large"/>
                        )}
                    </FormItem>
                </Col>

                <Col span={24}>
                    <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="体验中心">
                        {getFieldDecorator("HubID", { rules: [
                            {
                                required: true,
                                message: '体验中心必选'
                            }]})(
                                <Select placeholder="全部体验中心" size="large">
                                    <Option value="">全部体验中心</Option>
                                    {
                                        (this.props.HubList || []).map((item, index) => {
                                            return (
                                                <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                            );
                                        })
                                    }
                                </Select>
                        )}
                    </FormItem>
                </Col>
                <div style={{position: "absolute", right: 20, bottom: -59, zIndex: 10}}>
                    <Button onClick={this.handleCancel} size="large" style={{ marginRight: 8 }}>取消</Button>
                    <Button size="large" type="primary" htmlType="submit">确定</Button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={40}>{this.getFields()}</Row>
            </Form>
        );
    }
}

const WrappedAccount = Form.create()(AccountSearchForm);


class AccountSearchForm2 extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);


    }
    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err && values.Name && values.Mobile && values.IDCardNum) {
                getBindEmployee({
                    IDCardNum: values.IDCardNum,
                    Name: values.Name,
                    Mobile: values.Mobile,
                    HubRecommendTodayID: this.props.record.HubRecommendTodayID
                });
                this.props.form.resetFields();
                this.props.close();
            }
        });

    };

    handleCancel = () => {
        this.props.close();
    };

    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Col span={24}>
                    <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="姓名">
                        {getFieldDecorator("Name", {rules: [
                            {
                                required: true,
                                message: '姓名必填'
                            }]})(
                            <Input size="large"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="手机号">
                        {getFieldDecorator("Mobile", {rules: [
                            {pattern: /^1[3-9][0-9]\d{8}$/, message: '请输入正确的手机号'}, {
                                required: true,
                                message: '手机号必填'
                            }]})(
                            <Input size="large"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="身份证号">
                        {getFieldDecorator("IDCardNum", {rules: [
                            {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号'}, {
                                required: true,
                                message: '身份证号必填'
                            }]})(
                            <Input size="large"/>
                        )}
                    </FormItem>
                </Col>
                <div style={{position: "absolute", right: 20, bottom: -59, zIndex: 10}}>
                    <Button onClick={this.handleCancel} size="large" style={{ marginRight: 8 }}>取消</Button>
                    <Button size="large" type="primary" htmlType="submit">确定</Button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={40}>{this.getFields()}</Row>
            </Form>
        );
    }
}

const WrappedAccount2 = Form.create()(AccountSearchForm2);