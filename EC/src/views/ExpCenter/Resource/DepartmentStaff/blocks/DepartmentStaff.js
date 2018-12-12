import React from 'react';
import {Row, Form, Input, Select, Button, Col, Icon, DatePicker, Switch, Table, Popconfirm, Radio, Modal, message } from 'antd';
import getEmployeeList from 'ACTION/ExpCenter/EmployeeList';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import getDepartAllEmpName from 'ACTION/ExpCenter/GetCommonData/getDepartAllEmpName';
import getAccountChangeList from 'ACTION/ExpCenter/GetCommonData/getAccountChangeList';
import setModAccountName from 'ACTION/ExpCenter/SetCommonData/setModAccountName';
import setModAccountRelation from 'ACTION/ExpCenter/SetCommonData/setModAccountRelation';
import setAddNewAccount from 'ACTION/ExpCenter/SetCommonData/setAddNewAccount';
import setAddDriver from 'ACTION/ExpCenter/SetCommonData/setAddDriver';
import fac from 'COMPONENT/FUCTIONS';
const {forFor, messageSuccess, messageError} = fac;
import "LESS/pages/StaffManage.less";
message.config({
    top: "50%",
    duration: 2,
    marginTop: "-17px"
});
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const STATE_NAME = 'state_ec_employeeList';
const STATE_NAME2 = 'state_ec_setData';


function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}
function filterObject(obj, HubIDListALL) { // 删除空数据
    if(isArray(obj) == "Object") {
        var returnObj = {};
        for(let i in obj) {
            if(isArray(obj[i]) == "Object" && Object.keys(obj[i]).length == 0) {
                continue;
            }else if(isArray(obj[i]) == "Array" && obj[i].length == 0) {
                continue;
            }else{
                if(i == "HubIDList") {
                    if(obj[i]) {
                        returnObj[i] = [Number(obj[i])];
                    }else{
                        returnObj[i] = HubIDListALL;
                    }
                }else if(i == "RecordIndex" || i == "RecordSize") {
                    returnObj[i] = obj[i];
                }else if(obj[i]) {
                    if(typeof obj[i] === "string") {
                        returnObj[i] = obj[i].trim();
                    }else{
                        returnObj[i] = obj[i];
                    }
                }
            }
        }
        returnObj.RecordIndex = 0;
        returnObj.RecordSize = 2000;
        return returnObj;
    }
    return obj;
}

let titleList = [ // 虚拟搜索目录数据
    {
        name: "姓名",
        value: "Name"
    },
    {
        name: "接待账号",
        value: "Account"
    },
    {
        name: "体验中心",
        value: "HubIDList"
    },
    {
        name: "手机号",
        value: "Phone"
    },
    {
        name: "司机职位分配",
        value: "DriverStatus"
    }
];

class EditableTable extends React.PureComponent { // table组件
    constructor(props) {
        super(props);

        this.columns = [{
            title: '接待账号', dataIndex: 'Account', width: '15%',
            render: (text, record) => {
                const { Account } = record;
                return (
                    <div>
                        <AlertWindowTow parms = {this.props.parms} text = {Account} data = {record} contentList = {this.props.contentList}></AlertWindowTow>
                    </div>
                );
            }
        }, {
            title: '姓名', dataIndex: 'Name', width: '15%',
            render: (text, record) => {
                const { Name } = record;
                return (
                    <div>
                        <AlertWindow HubIDListALL={this.props.HubIDListALL} parms = {this.props.parms} text = {Name} distributed = {this.props.distributed} data = {record} DepartAllName = {this.props.DepartAllName} contentList = {this.props.contentList}></AlertWindow>
                    </div>
                );
            }
        }, {
            title: '所属体验中心', dataIndex: 'HubName', width: '20%',
            render: (text, record) => {
                const { HubName } = record;
                return (
                    <div>
                        <AlertWindow HubIDListALL={this.props.HubIDListALL} parms = {this.props.parms} text = {HubName} distributed = {this.props.distributed} data = {record} DepartAllName = {this.props.DepartAllName} contentList = {this.props.contentList}></AlertWindow>
                    </div>
                );
            }
        }, {
            title: '手机号', dataIndex: 'Phone', width: '20%',
            render: (text, record) => {
                const { Phone } = record;
                return (
                    <div>
                        {Phone}
                    </div>
                );
            }
        }, {
            title: '司机职位分配', dataIndex: 'DriverStatus', width: '15%',
            render: (text, record) => {
                const { DriverStatus } = record;
                return (
                    <div className="editable-row-operations">
                        <Switch checked={DriverStatus == 1 ? false : true} onChange={()=>{this.props.clickState(text, record);}}/>
                    </div>
                );
            }
        }, {
            title: '账号使用记录', dataIndex: 'check', width: '15%',
            render: (text, record) => {
                return (
                    <div>
                        <AlertWindowThree text="查看记录" ChangeList = {this.props.ChangeList} data = {record}></AlertWindowThree>
                    </div>
                );
            }
        }];
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.setModAccountNameFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setModAccountNameFetch', 'close');
            getEmployeeList(this.props.parms);
        }
        if(nextProps.setAddNewAccountFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setAddNewAccountFetch', 'close');
            getEmployeeList(this.props.parms);
        }
        if(nextProps.setModAccountRelationFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setModAccountRelationFetch', 'close');
            getEmployeeList(this.props.parms);
        }
        if(nextProps.setAddDriverFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setAddDriverFetch', 'close');
            getEmployeeList(this.props.parms);
        }
    }
    render() {
        return <Table loading={this.props.loading} bordered dataSource={this.props.contentList ? this.props.contentList : []} columns={this.columns} />;
    }
}
class EditableTableTow extends React.PureComponent { // table组件
    constructor(props) {
        super(props);

        this.columns = [{
            title: '开始时间', dataIndex: 'StartTime', width: '33%'
        }, {
            title: '结束时间', dataIndex: 'EndTime', width: '33%'
        }, {
            title: '姓名', dataIndex: 'Name', width: '33%'
        }].map((item)=>{
            item.render = (text, record) => {
                let dateResult = record[item.dataIndex];
                return (
                    <div>
                        {(item.dataIndex === "EndTime" && !dateResult) ? '至今' : dateResult}
                    </div>
                );
            };
            return item;
        });
    }
    render() {
        return <Table bordered dataSource={this.props.ChangeList ? this.props.ChangeList : []} columns={this.columns} />;
    }
}
class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);

        this.state = {
            parms: {
                RecordIndex: 0,
                RecordSize: 2000
            }
        };
    }
    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            setParams(STATE_NAME, {parms: Object.assign({}, filterObject(values, this.props.HubIDListALL))});
            getEmployeeList(filterObject(values, this.props.HubIDListALL));
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };
    handleRefresh() {
        getEmployeeList({
            RecordIndex: 0,
            RecordSize: 2000,
            HubIDList: this.props.HubIDListALL
        });
        this.props.form.resetFields();
    }
    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        let children = [];
        for (let i = 0; i < titleList.length; i++) {
            children.push(
                <Col span={8} key={i} style={{ padding: "0  10px"}}>
                    <FormItem {...formItemLayout} label={titleList[i].name}>
                        {getFieldDecorator(titleList[i].value)(
                           titleList[i].name == "体验中心" ? <Select
                                placeholder="全部体验中心"
                                size="large"
                            >
                                <Option value="">全部体验中心</Option>
                                {
                                    (this.props.distributed || []).map((item, index)=>{
                                        return(
                                            <Option key={index} value={item.HubID + ''}>{item.HubName}</Option>
                                        );
                                    })
                                }
                            </Select> : titleList[i].name == "司机职位分配" ? <RadioGroup>
                                    <Radio value={1}>关</Radio>
                                    <Radio value={2}>开</Radio>
                                </RadioGroup> :

                                <Input style={{ height: 30 }}/>
                        )}
                    </FormItem>
                </Col>
            );
        }
        return(
            <Row>{children}
                <Col span={8} style={{ textAlign: 'right', paddingRight: "10px", marginBottom: "20px" }}>
                    <Button onClick={this.handleReset}>
                        重置
                    </Button>
                    <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">搜索</Button>
                </Col>
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

class AccountSearchForm extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);


    }
    componentWillMount() {
        if(!this.props.type) {
            setTimeout(()=>{
                this.props.form.setFieldsValue({
                    Account: this.props.dateList.Account,
                    Name: this.props.dateList.Name
                });
            }, 100);
        }
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let parms = {};
            let parms2 = {};
            let off = false;
            let LoginName = values.Name ? values.Name.split("&#")[0] : '';
            if(values.Name && values.Name.indexOf("##") !== -1) {
                messageError('英文名为空，新建账号失败。');
                return;
            }
            if(this.props.type) {
                if(values.Account && values.HubID && values.Name) {
                    forFor(this.props.contentList, "Account", values.Account, function () { // 杜绝接待账号名重复
                        messageError('接待账号重复。');
                        off = true;
                    });
                    forFor(this.props.DepartAllName, "LoginName", LoginName, (i) => { // 获取EmployeeID
                        parms2.EmployeeID = this.props.DepartAllName[i].EmployeeID;
                    });
                    if(off) return;
                    parms2.Account = values.Account;
                    parms2.HubID = Number(values.HubID);
                    setAddNewAccount(parms2);
                }else{
                    messageError('请将账号信息填写完整。');
                }
            }else{
                forFor(this.props.DepartAllName, "LoginName", LoginName, (i) => {
                    parms.EmployeeID = this.props.DepartAllName[i].EmployeeID;
                });
                parms.HubID = this.props.dateList.HubID;
                parms.RecordID = this.props.dateList.RecordID;
                parms.HubIDList = this.props.HubIDListALL;
                setModAccountRelation(parms);
            }
        });
        this.props.form.resetFields();
        this.props.close();
    };

    handleCancel = () => {
        this.props.close();
    };

    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Col span={7}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="接待账号">
                        {getFieldDecorator("Account")(
                            !this.props.type ? <span>{this.props.dateList.Account}</span> :
                                <Input style={{height: 30}} placeholder={this.props.dateList["Account"]}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="姓名">
                        {getFieldDecorator("Name")(
                            <Select
                                showSearch
                                style={{width: '100%'}}
                                placeholder={this.props.dateList["Name"]}>
                                {this.props.DepartAllName.map((item, index) => {
                                    return (
                                        <Option
                                            key={item.LoginName ? item.LoginName + "&#" + item.Name : index + "##"}>{item.Name + "(" + (item.LoginName ? item.LoginName : "英文名为空") + ")"}</Option>
                                    );
                                })}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={9}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="所属体验中心">
                        {getFieldDecorator("HubID")(
                            !this.props.type ? <span>{this.props.dateList.HubName}</span> :
                            <Select
                                placeholder="全部体验中心"
                                size="large"
                            >
                                <Option value="">全部体验中心</Option>
                                {
                                    (this.props.distributed || []).map((item, index) => {
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
                    <Button onClick={this.handleCancel} size="large" style={{ marginRight: 8 }}>
                        取消
                    </Button>
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



export default class StaffManage extends React.PureComponent { // 页面组件
    constructor(props) {
        super(props);


        this.ClickState = this.ClickState.bind(this);
    }
    componentWillMount() {
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        let Parms = {...this.props.parms};
        Parms.HubIDList = this.HubIDListALL;
        getEmployeeList(Parms);
        getDepartAllEmpName();
        setParams(STATE_NAME, {parms: Object.assign({}, Parms)});
    }
    ClickState(a, b) {
        setAddDriver({
            AccountID: b.AccountID,
            HubID: b.HubID,
            RecordID: b.RecordID,
            DriverStatus: b.DriverStatus == 1 ? 2 : 1
        });
    }
    render() {
        let EmployeeListArr = this.props.EmployeeList;
        if(EmployeeListArr) {
            for (let j = 0; j < EmployeeListArr.length; j++) {
                forFor(this.HubList, "HubID", EmployeeListArr[j].HubID, (i) => {
                    EmployeeListArr[j].HubName = this.HubList[i].HubName;
                }, () => {
                    EmployeeListArr[j].HubName = "该体验中心ID未找到";
                });
            }
        }
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">部门员工管理</div>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-2">
                            <WrappedAdvancedSearchForm HubIDListALL={this.HubIDListALL} distributed = {this.HubList}/>
                            <AlertWindow HubIDListALL={this.HubIDListALL}
                                         parms = {this.props.parms}
                                         createNew = {true}
                                         DepartAllName = {this.props.DepartAllName}
                                         text = "新建"
                                         distributed = {this.HubList}
                                         contentList = {this.props.EmployeeList}></AlertWindow>
                            <EditableTable loading={this.props.RecordListLoading}
                                           {...this.props.setStatus}
                                           HubIDListALL={this.HubIDListALL}
                                           parms = {this.props.parms}
                                           ChangeList = {this.props.ChangeList}
                                           clickState = {this.ClickState}
                                           distributed = {this.HubList}
                                           contentList = {this.props.EmployeeList}
                                           DepartAllName = {this.props.DepartAllName}></EditableTable>
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}
class AlertWindow extends React.PureComponent { // 弹出框组件

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
    }
    componentWillMount() {


    }

    showModal() {
        this.setState({
            visible: true
        });
    }
    hideModal() {
        this.setState({
            visible: false
        });
    }

    render() {
        return(
            <div>
                {this.props.createNew ? <Button href="javascript:;" style={{marginBottom: "20px"}} type="primary" onClick={()=>{this.showModal(this);}}>{this.props.text}</Button> : <a href="javascript:;" onClick={()=>{this.showModal(this);}}>{this.props.text}</a>}
                <Modal
                    title={this.props.createNew ? "新建接待账号" : "修改接待账号"}
                    visible={this.state.visible}
                    okText="确定"
                    cancelText="取消"
                    width="830px"
                    onCancel={this.hideModal}
                >
                    <WrappedAccount HubIDListALL={this.props.HubIDListALL} parms = {this.props.parms} contentList = {this.props.contentList} DepartAllName = {this.props.DepartAllName} type = {this.props.createNew ? this.props.createNew : false} dateList = {this.props.data ? this.props.data : []} distributed = {this.props.distributed} close = {this.hideModal}></WrappedAccount>
                </Modal>
            </div>
        );
    }
}
class AlertWindowTow extends React.PureComponent { // 弹出框组件

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            textValue: ""
        };
        this.showModal = this.showModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.changeData = this.changeData.bind(this);
    }
    componentWillMount() {


    }

    showModal() {
        this.setState({
            visible: true,
            textValue: this.props.text
        });
    }
    handleCancel() {
        this.setState({
            visible: false
        });
    }
    handleOk() {
        let off = false;
        forFor(this.props.contentList, "Account", this.state.textValue, () => {
            messageError('接待账号已经存在，请重新选择接待账号。');
            off = true;
        });
        if(off) return;
        setModAccountName({
            Account: this.state.textValue,
            AccountID: this.props.data.AccountID,
            RecordID: this.props.data.RecordID,
            HubIDList: this.props.parms.HubIDList
        });
        this.setState({
            visible: false
        });
    }
    changeData(e) {
        this.setState({
            textValue: e.target.value
        });
    }
    render() {
        return(
            <div>
                {<a href="javascript:;" onClick={()=>{this.showModal(this);}}>{this.props.text}</a>}
                <Modal
                    title="修改员工信息"
                    visible={this.state.visible}
                    okText="确定"
                    cancelText="取消"
                    width="800px"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Input value={this.state.textValue} onChange={this.changeData}/>
                </Modal>
            </div>
        );
    }
}
class AlertWindowThree extends React.PureComponent { // 弹出框组件

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };
        this.showModal = this.showModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    showModal() {
        getAccountChangeList({AccountID: this.props.data.AccountID});
        this.setState({
            visible: true
        });
    }
    handleCancel() {
        this.setState({
            visible: false
        });
    }
    render() {
        return(
            <div>
                {<a href="javascript:;" onClick={()=>{this.showModal(this);}}>{this.props.text}</a>}
                <Modal
                    title="账号使用记录"
                    visible={this.state.visible}
                    width="800px"
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <EditableTableTow ChangeList = {this.props.ChangeList}></EditableTableTow>
                </Modal>
            </div>
        );
    }
}