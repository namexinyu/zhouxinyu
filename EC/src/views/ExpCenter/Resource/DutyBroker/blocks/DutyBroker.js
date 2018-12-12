import React from 'react';
import {Row, Form, Input, Select, Button, Col, Icon, DatePicker, Switch, Table, Popconfirm, Radio, Modal } from 'antd';
import getBrokersOnDuty from 'ACTION/ExpCenter/BrokersOnDuty/getBrokersOnDuty';
import getBrokersOnDutyEdit from 'ACTION/ExpCenter/BrokersOnDuty/getBrokersOnDutyEdit';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import State from "VIEW/globalStateData.json";
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getBrokerFilterList from 'ACTION/ExpCenter/Broker/getBrokerFilterList';
const { TextArea } = Input;
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const EmployeeID = AppSessionStorage.getEmployeeID();
const HubManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;
const STATE_NAME = 'state_ec_brokersOnDuty';
const STATE_NAME2 = 'state_ec_brokersOnDutyEdit';
import "LESS/pages/StaffManage.less";

function fliterPower(targetArr) {
    if(HubManager) {
        return targetArr;
    }else{
        let fliterArr = Object.assign([], targetArr);
        for (let i = 0; i < fliterArr.length; i++) {
            if(targetArr[i].name == "体验中心" || targetArr[i].name == "所属体验中心") {
                fliterArr.splice(i, 1);
                i--;
            }
        }
        return fliterArr;
    }
}

let titleList = [ // 虚拟搜索目录数据
    {
        name: "日期",
        value: "Date"
    },
    {
        name: "纪经人",
        value: "Broker"
    },
    {
        name: "体验中心",
        value: "HubList"
    }
];

titleList = fliterPower(titleList);

class EditableTable extends React.PureComponent { // table组件
    constructor(props) {
        super(props);
        this.columns = [{
            title: '日期', dataIndex: 'Date', width: '20%'
        }, {
            title: '纪经人', dataIndex: 'Broker', width: '10%'
        }, {
            title: '工号', dataIndex: 'EmployeeID', width: '10%'
        }, {
            title: '外勤地点', dataIndex: 'Where', width: '20%'
        }, {
            title: '工作时间段', dataIndex: 'WorkingTime', width: '20%'
        }, {
            title: '出勤情况', dataIndex: 'Status', width: '20%',
            render: (text, record) => {
                const { Status, editable } = record;
                return (
                        <div>

                            <Select
                                value={State.Description[Status]}
                                style={{ width: 100 }}
                                size="large"
                                onChange={this.changeState}
                                onFocus={()=>{this.getRecord(text, record);}}
                            >
                                <Option value="">正常</Option>
                                <Option value="1">迟到</Option>
                                <Option value="2">早退</Option>
                                <Option value="3">迟到+早退</Option>
                            </Select>
                        </div>
                );
            }
        }].map((item) => {
            if(!item.render) {
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
        this.getRecord = this.getRecord.bind(this);
        this.changeState = this.changeState.bind(this);
        this.state = {
            currentRecord: {}
        };
    }
    getRecord(text, record) {
        this.setState({
            currentRecord: Object.assign({}, record)
        });
    }
    changeState(value) {
        getBrokersOnDutyEdit({
            ID: this.state.currentRecord.ID,
            OperatorID: EmployeeID,
            Status: Number(value)
        });
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.getBrokersOnDutyEditFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'getBrokersOnDutyEditFetch', 'close');
            getBrokersOnDuty(this.props.parms);
        }
    }
    render() {
        return <Table loading={this.props.loading} bordered dataSource={this.props.RecordList} columns={this.columns} />;
    }
}
class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.handleChangeStaple = this.handleChangeStaple.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let parameter = this.props.parms;
            for (let i = 0; i < this.props.brockList.length; i++) {
                if(this.props.brockList[i].NickName === values.Broker) {
                    parameter.BrokerID = this.props.brockList[i].BrokerID;
                }
            }
            getBrokersOnDuty(parameter);
            setParams(STATE_NAME, {parms: Object.assign({}, parameter)});
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    onChange(dates, dateStrings) {
        setParams(STATE_NAME, {parms: Object.assign({}, this.props.parms, {DateUpperBound: dateStrings[1], DateLowerBound: dateStrings[0]})});
    }
    handleChangeStaple(value) {
        setParams(STATE_NAME, {parms: Object.assign({}, this.props.parms, {HubList: value ? [Number(value)] : []})});
    }
    handleChange(value) {
        console.log(`${value}`);
    }
    handleRefresh() {
        getBrokersOnDuty({
            RecordIndex: 0,
            RecordSize: 2000,
            HubIDList: this.props.HubIDListALL
        });
        this.props.form.resetFields();
    }
    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        let children = [];
        for (let i = 0; i < titleList.length; i++) {
            children.push(
                <Col span={8} key={i} style={{ padding: "0  10px"}}>
                    <FormItem labelCol = {{ span: titleList[i].name == "日期" ? 3 : 6 }} wrapperCol = {{ span: titleList[i].name == "日期" ? 21 : 18 }} label={titleList[i].name}>
                        {getFieldDecorator(titleList[i].value)(
                            titleList[i].name == "日期" ? <RangePicker
                                ranges={{ "今天": [moment(), moment()], "本月": [moment(), moment().endOf('month')] }}
                                showTime
                                format="YYYY/MM/DD HH:mm:ss"
                                onChange={this.onChange}
                            /> : titleList[i].name == "体验中心" ? <Select
                                placeholder="全部体验中心"
                                size="large"
                                onChange={this.handleChangeStaple}
                            >
                                <Option value="">全部体验中心</Option>
                                {
                                    (this.props.HubList || []).map((item, index)=>{
                                        return(
                                            <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                        );
                                    })
                                }
                            </Select> : titleList[i].name == "司机权限状态" ? <RadioGroup>
                                    <Radio value={1}>停用</Radio>
                                    <Radio value={2}>开启</Radio>
                                </RadioGroup> :

                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    onChange={this.handleChange}
                                >
                                    {this.props.brockList.map((item, index)=>{
                                        return(
                                            <Option key={item.NickName || ""}>{item.NickName}</Option>
                                        );
                                    })}
                                </Select>
                        )}
                    </FormItem>
                </Col>
            );
        }
        return(
            <Row>{children}
                <Col span={24} style={{ textAlign: 'right', paddingRight: "10px", marginBottom: "20px" }}>
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





export default class Diver extends React.PureComponent { // 页面组件
    constructor(props) {
        super(props);


    }
    componentWillMount() {
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        let Parms = this.props.parms;
        Parms.HubList = this.HubIDListALL;
        getBrokersOnDuty(Parms);
        getBrokerFilterList();
        setParams(STATE_NAME, {parms: Object.assign({}, Parms)});
    }

    render() {
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">值班经纪人出勤情况</div>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-2">
                            <WrappedAdvancedSearchForm parms={this.props.parms} brockList = {this.props.brockList.brokerFilterList} HubList={this.HubList}/>
                            <EditableTable loading={this.props.RecordListLoading} parms={this.props.parms} {...this.props.setStatus} RecordList = {this.props.RecordList}></EditableTable>
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}
