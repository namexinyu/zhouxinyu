import React from 'react';
import {Row, Form, Input, Select, Button, Col, Icon, DatePicker, Switch, Table, Popconfirm, Radio, Modal } from 'antd';
import getEmployeeList from 'ACTION/ExpCenter/EmployeeList';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import setAddDriver from 'ACTION/ExpCenter/SetCommonData/setAddDriver';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import "LESS/pages/StaffManage.less";
const STATE_NAME2 = 'state_ec_setData';
const STATE_NAME = 'state_ec_employeeList';
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
        name: "手机号",
        value: "Phone"
    },
    {
        name: "司机职位分配",
        value: "DriverStatus"
    }
];
class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);

    }
    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
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
                            titleList[i].name == "司机职位分配" ? <RadioGroup>
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
                <Col span={8} style={{ textAlign: 'right', paddingRight: "10px" }}>
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

export default class StaffManage extends React.PureComponent { // 页面组件
    constructor(props) {
        super(props);

        this.ClickState = this.ClickState.bind(this);
    }
    componentWillMount() {
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        let Parms = this.props.parms;
        Parms.HubIDList = this.HubIDListALL;
        getEmployeeList(Parms);
        setParams(STATE_NAME, {parms: Object.assign({}, Parms)});
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.setAddDriverFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setAddDriverFetch', 'close');
            getEmployeeList(this.props.parms);
        }
    }
    ClickState(a, b) {
        setAddDriver({
            AccountID: b.AccountID,
            HubID: b.HubID,
            RecordID: b.RecordID,
            DriverStatus: b.DriverStatus === 1 ? 2 : 1
        });
    }
    render() {
        let EmployeeList = this.props.EmployeeList;
        if(EmployeeList && EmployeeList.length) {
            EmployeeList.map((item) => {
                return(item.HubName = this.HubList[0].HubName);
            });
        }
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">员工管理</div>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-2">
                            <WrappedAdvancedSearchForm HubIDListALL={this.HubIDListALL}/>
                            <Table loading={this.props.RecordListLoading} bordered dataSource={this.props.EmployeeList} columns={createColumns(this.ClickState)} />
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}

function createColumns(clickState) {
    return([{
        title: '接待账号', dataIndex: 'Account', width: '20%'
    }, {
        title: '姓名', dataIndex: 'Name', width: '20%'
    }, {
        title: '所属体验中心', dataIndex: 'HubName', width: '20%'
    }, {
        title: '手机号码', dataIndex: 'Phone', width: '20%'
    }, {
        title: '司机职位分配', dataIndex: 'DriverStatus', width: '20%', type: 'switch'
    }].map((item) => {
        item.render = (text, record) => {
            let dateResult = record[item.dataIndex];
            return (
                <div>
                    {item.type ? <Switch checked={dateResult == 1 ? false : true} onChange={()=>{clickState(text, record);}}/> : dateResult}
                </div>
            );
        };
        return item;
    }));
}