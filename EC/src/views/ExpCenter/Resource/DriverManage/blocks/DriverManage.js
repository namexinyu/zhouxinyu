import React from 'react';
import {Row, Form, Input, Select, Button, Col, Icon, DatePicker, Switch, Table, Popconfirm, Radio, Modal} from 'antd';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import setParams from 'ACTION/setParams';
import getDriverList from 'ACTION/ExpCenter/DriverList';
import setSetDriverPick from 'ACTION/ExpCenter/SetCommonData/setSetDriverPick';
import getVehicleList from 'ACTION/ExpCenter/GetCommonData/getVehicleList';
import setModHubCarInfo from 'ACTION/ExpCenter/SetCommonData/setModHubCarInfo';
import setDriverOrderChange from 'ACTION/ExpCenter/SetCommonData/setDriverOrderChange';
import setFetchStatus from 'ACTION/setFetchStatus';
import "LESS/pages/StaffManage.less";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
const STATE_NAME = 'state_ec_driverList';
const STATE_NAME2 = 'state_ec_setData';

function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}

function filterObject(obj, HubIDListALL) { // 删除空数据
    if (isArray(obj) == "Object") {
        var returnObj = {};
        for (let i in obj) {
            if (isArray(obj[i]) == "Object" && Object.keys(obj[i]).length == 0) {
                continue;
            } else if (isArray(obj[i]) == "Array" && obj[i].length == 0) {
                continue;
            } else {
                if (i == "HubIDList") {
                    if (obj[i]) {
                        returnObj[i] = [Number(obj[i])];
                    } else {
                        returnObj[i] = HubIDListALL;
                    }
                } else if (i == "RecordIndex" || i == "RecordSize") {
                    returnObj[i] = obj[i];
                } else if (obj[i]) {
                    if (typeof obj[i] === "string") {
                        returnObj[i] = obj[i].trim();
                    } else {
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

function fliterPower(HubIDListALL, targetArr) {
    if (HubIDListALL.length > 1) {
        return targetArr;
    } else {
        let fliterArr = Object.assign([], targetArr);
        for (let i = 0; i < fliterArr.length; i++) {
            if (targetArr[i].name == "体验中心" || targetArr[i].name == "所属体验中心") {
                fliterArr.splice(i, 1);
                i--;
            }
        }
        return fliterArr;
    }
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
        name: "APP接单权限",
        value: "Status"
    }
];
let titleList2 = [ // 虚拟搜索目录数据
    {
        name: "车牌号码",
        value: "VehiclePlate"
    }
];
let titleList3 = [ // 虚拟搜索目录数据
    {
        name: "姓名",
        value: "Name"
    },
    {
        name: "排序",
        value: "Order"
    }
];
titleList = fliterPower(HubIDListALL, titleList);

class EditableTable extends React.PureComponent { // table组件
    constructor(props) {
        super(props);


        this.columns = [{
            title: '接待账号', dataIndex: 'Account', width: '8%'
        }, {
            title: '姓名', dataIndex: 'Name', width: '8%'
        }, {
            title: '所属体验中心', dataIndex: 'HubName', width: '15%'
        }, {
            title: '手机号', dataIndex: 'Phone', width: '15%'
        }, {
            title: '车牌号码', dataIndex: 'VehiclePlate', width: '10%',
            render: (text, record) => {
                const {VehiclePlate} = record;
                return (
                    <div>
                        <AlertWindow type="a" parms={this.props.parms} tag="name"
                                     text={VehiclePlate ? VehiclePlate : "选择车辆"} contentList={this.props.contentList}
                                     data={record} VehicleList={this.props.VehicleList}></AlertWindow>
                    </div>
                );
            }
        }, {
            title: '颜色', dataIndex: 'VehicleColor', width: '8%'
        }, {
            title: '车型', dataIndex: 'VehicleType', width: '10%'
        }, {
            title: '排序', dataIndex: 'Order', width: '8%',
            render: (text, record) => {
                const {Order} = record;
                return (
                    <div>
                        <AlertWindow HubIDListALL={this.props.HubIDListALL} type="a" parms={this.props.parms}
                                     tag="order" contentList={this.props.contentList} text={Order}
                                     data={record}></AlertWindow>
                    </div>
                );
            }
        }, {
            title: '定位', dataIndex: 'Positioning', width: '8%',
            render: (text, record) => {
                const {Positioning} = record;
                return (
                    <div>
                        <a href="javascript:;">{Positioning}</a>
                    </div>
                );
            }
        }, {
            title: 'APP接单权限', dataIndex: 'Status', width: '8%',
            render: (text, record) => {
                const {Status} = record;
                return (
                    <div className="editable-row-operations">
                        <Switch checked={Status == 2 ? false : Status == 1 ? true : false} onChange={() => {
                            this.props.clickState(text, record);
                        }}/>
                    </div>
                );
            }
        }].map((item) => {
            if (!item.render) {
                item.render = (text, record) => {
                    let dateResult = record[item.dataIndex];
                    return (
                        <div>
                            {dateResult}
                        </div>
                    );
                };
            }
            return item;
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.setModHubCarInfoFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setModHubCarInfoFetch', 'close');
            getDriverList(filterObject(this.props.parms, this.props.HubIDListALL));
        }
        if (nextProps.setDriverOrderChangeFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setDriverOrderChangeFetch', 'close');
            getDriverList(filterObject(this.props.parms, this.props.HubIDListALL));
        }
        if (nextProps.setSetDriverPickFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setSetDriverPickFetch', 'close');
            getDriverList(filterObject(this.props.parms, this.props.HubIDListALL));
        }
    }

    render() {
        return <Table loading={this.props.loading} bordered dataSource={this.props.contentList}
                      columns={this.columns}/>;
    }
}

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
            setParams(STATE_NAME, {parms: Object.assign({}, filterObject(values, this.props.HubIDListALL))});
            getDriverList(filterObject(values, this.props.HubIDListALL));
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };
    handleRefresh = () => {
        this.props.form.resetFields();
        getDriverList({
            RecordIndex: 0,
            RecordSize: 2000,
            HubIDList: this.props.HubIDListALL
        });
    };

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        let children = [];
        for (let i = 0; i < titleList.length; i++) {
            children.push(
                <Col span={8} key={i} style={{padding: "0  10px"}}>
                    <FormItem {...formItemLayout} label={titleList[i].name}>
                        {getFieldDecorator(titleList[i].value)(
                            titleList[i].name == "体验中心" ? <Select
                                placeholder="全部体验中心"
                                size="large"
                            >
                                <Option value="">全部体验中心</Option>
                                {
                                    this.props.HubList.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                        );
                                    })
                                }
                            </Select> : titleList[i].name == "APP接单权限" ? <RadioGroup>
                                    <Radio value={2}>停用</Radio>
                                    <Radio value={1}>开启</Radio>
                                </RadioGroup> :

                                <Input style={{height: 30}}/>
                        )}
                    </FormItem>
                </Col>
            );
        }
        return (
            <Row>{children}
                <Col span={8} style={{textAlign: 'right', paddingRight: "10px"}}>
                    <Button onClick={this.handleReset}>
                        重置
                    </Button>
                    <Button style={{marginLeft: 8}} type="primary" htmlType="submit">搜索</Button>
                </Col>
            </Row>

        );
    }

    render() {
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch} style={{position: "relative"}}>
                <Row gutter={40}>{this.getFields()}</Row>
            </Form>
        );
    }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

class AccountSearchForm extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);

        let VehicleList = [];
        for (let i = 0; i < this.props.VehicleList.length; i++) {
            if (this.props.VehicleList[i].HubID === this.props.dateList.HubID) {
                VehicleList.push(this.props.VehicleList[i]);
            }
        }
        this.state = {
            VehicleList: VehicleList
        };
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            for (let i = 0; i < this.state.VehicleList.length; i++) {
                if (this.state.VehicleList[i].VehiclePlate === values.VehiclePlate) {
                    setModHubCarInfo({
                        DriverID: this.props.dateList.DriverID,
                        VehiclePlate: values.VehiclePlate,
                        VehicleColor: this.state.VehicleList[i].VehicleColor,
                        VehicleType: this.state.VehicleList[i].VehicleType
                    });
                }
            }

        });

        this.props.close();
    };

    handleCancel() {
        this.props.close();
    }

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        let children = [];
        for (let i = 0; i < titleList2.length; i++) {
            children.push(
                <Col span={8} key={i} style={{padding: "0  10px"}}>
                    <FormItem {...formItemLayout} label={titleList2[i].name}>
                        {getFieldDecorator(titleList2[i].value)(
                            <Select
                                placeholder="请选择车牌号"
                                size="large"
                            >
                                <Option value="">{this.state.VehicleList.length ? "请选择车牌号" : "该集散无车牌可选"}</Option>
                                {
                                    (this.state.VehicleList || []).map((item, index) => {
                                        return (
                                            <Option key={index}
                                                    value={item.VehiclePlate || ""}>{item.VehiclePlate}</Option>
                                        );
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
            );
        }
        return (
            <div>
                {children}
                <div style={{position: "absolute", right: 20, bottom: -59, zIndex: 10}}>
                    <Button onClick={this.handleCancel} size="large" style={{marginRight: 8}}>
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

class AccountSearchFormTow extends React.Component { // 排序弹窗

    constructor(props) {
        super(props);


        let listNum = [];
        for (let i = 0; i < this.props.contentList.length; i++) {
            if (this.props.contentList[i].HubID === this.props.dateList.HubID) {
                listNum.push(this.props.contentList[i]);
            }
        }
        listNum.sort(function (a, b) {
            return a.Order - b.Order;
        });
        this.state = {
            listNum: listNum,
            orderNum: this.props.dateList.Order
        };
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let listNum = [];
            for (let i = 0; i < this.props.contentList.length; i++) {
                if (this.props.contentList[i].HubID === this.props.dateList.HubID) {
                    listNum.push(this.props.contentList[i]);
                }
            }
            listNum.sort(function (a, b) {
                return a.Order - b.Order;
            });
            if (values.Order) {
                let OrderList = {};
                // let listNum = this.state.listNum;
                OrderList.DriverID = this.props.dateList.DriverID;
                OrderList.HubIDList = this.props.HubIDListALL;
                OrderList.NewOrder = Number(values.Order);
                for (let i = 0; i < listNum.length; i++) {
                    if (listNum[i].Order == values.Order) {
                        OrderList.OldDriverID = listNum[i].DriverID;
                        // OrderList.OldOrder = this.state.orderNum;
                        OrderList.OldOrder = this.props.dateList.Order;
                    }
                }
                setDriverOrderChange(OrderList);
            }

        });
        this.props.close();
    };

    handleCancel() {
        this.props.close();
    }

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        let children = [];
        for (let i = 0; i < titleList3.length; i++) {
            children.push(
                <Col span={8} key={i} style={{padding: "0  10px"}}>
                    <FormItem {...formItemLayout} label={titleList3[i].name}>
                        {getFieldDecorator(titleList3[i].value)(
                            titleList3[i].name == "排序" ? <Select
                                placeholder="请选择司机排序"
                                size="large"
                            >
                                <Option value="">请选择司机排序</Option>
                                {
                                    (this.state.listNum || []).map((item, index) => {
                                        return (
                                            <Option key={index} value={item.Order + ""}>{item.Order}</Option>
                                        );
                                    })
                                }
                            </Select> : <span>{this.props.dateList.Name}</span>
                        )}
                    </FormItem>
                </Col>
            );
        }
        return (
            <div>
                {children}
                <div style={{position: "absolute", right: 20, bottom: -59, zIndex: 10}}>
                    <Button onClick={this.handleCancel} size="large" style={{marginRight: 8}}>
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

const WrappedAccountTow = Form.create()(AccountSearchFormTow);

export default class Diver extends React.PureComponent { // 页面组件
    constructor(props) {
        super(props);
        this.ClickState = this.ClickState.bind(this);
    }

    componentWillMount() {
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        let Parms = this.props.parms;
        Parms.HubIDList = this.HubIDListALL;
        getDriverList(Parms);
        getVehicleList({HubIDList: this.HubIDListALL});
        setParams(STATE_NAME, {parms: Object.assign({}, Parms)});
    }

    ClickState(a, b) {
        setSetDriverPick({
            DriverID: b.DriverID,
            HubIDList: this.HubIDListALL,
            Status: b.Status == 1 ? 2 : 1
        });
    }

    render() {
        let DriverListArr = this.props.DriverList;
        if (DriverListArr) {
            for (let j = 0; j < DriverListArr.length; j++) {
                for (let i = 0; i < this.HubList.length; i++) {
                    if (this.HubList[i].HubID == DriverListArr[j].HubID) {
                        DriverListArr[j].HubName = this.HubList[i].HubName;
                    }
                }
                if (!DriverListArr[j].HubName) {
                    DriverListArr[j].HubName = "该体验中心ID未找到";
                }
            }
        }
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">司机管理</div>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-2">
                            <WrappedAdvancedSearchForm HubList={this.HubList} HubIDListALL={this.HubIDListALL}/>
                            <EditableTable loading={this.props.RecordListLoading} {...this.props.setStatus}
                                           HubIDListALL={this.HubIDListALL} parms={this.props.parms}
                                           clickState={this.ClickState} contentList={this.props.DriverList}
                                           VehicleList={this.props.VehicleList}></EditableTable>
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
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.setAccount = this.setAccount.bind(this);
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

    setAccount() {
        this.hideModal();
    }

    render() {
        return (
            <div>
                {this.props.type == "a" ? <a href="javascript:;" onClick={() => {
                    this.showModal(this);
                }}>{this.props.text}</a> : <Button style={{margin: "20px 0"}} onClick={() => {
                    this.showModal(this);
                }} type="primary">新建接待账号</Button>}

                <Modal
                    title="新建接待账号"
                    visible={this.state.visible}
                    onOk={this.setAccount}
                    onCancel={this.hideModal}
                    okText="新建"
                    cancelText="取消"
                    width="830px"
                >
                    {
                        this.props.tag == "name" ?
                            <WrappedAccount HubIDListALL={this.props.HubIDListALL} parms={this.props.parms}
                                            dateList={this.props.data} contentList={this.props.contentList}
                                            close={this.hideModal}
                                            VehicleList={this.props.VehicleList}></WrappedAccount> :
                            <WrappedAccountTow HubIDListALL={this.props.HubIDListALL} parms={this.props.parms}
                                               contentList={this.props.contentList} dateList={this.props.data}
                                               close={this.hideModal}></WrappedAccountTow>
                    }

                </Modal>
            </div>
        );
    }
}
