import React from 'react';
import {Row, Form, Input, Select, Button, Col, Icon, DatePicker, Switch, Table, Popconfirm, Radio, Modal, message} from 'antd';
import getPriceAllocation from 'ACTION/ExpCenter/PriceAllocation';
import ModActivityInfo from 'ACTION/ExpCenter/PriceAllocation/getModActivityInfo';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import setFetchStatus from 'ACTION/setFetchStatus';
import "LESS/pages/price-allocation.less";
import moment from 'moment';
message.config({
    top: "50%",
    duration: 2,
    marginTop: "-17px"
});
import setParams from 'ACTION/setParams';
const RangePicker = DatePicker.RangePicker;
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import {browserHistory} from 'react-router';
import fun from "COMPONENT/DelEmpyParms";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
let filterObject = fun.filterObject;
const STATE_NAME2 = 'state_ec_setData';

let titleList = [ // 虚拟搜索目录数据
    {
        name: "活动标题",
        value: "Title"
    },
    {
        name: "配置时间",
        value: "Time"
    },
    {
        name: "配置",
        value: "toConfig"
    },
    {
        name: "添加配置",
        value: "add"
    },
    {
        name: "启用状态",
        value: "Status"
    }
];


class EditableTable extends React.PureComponent { // table组件
    constructor(props) {
        super(props);

        this.columns = [{
            title: '日期',
            dataIndex: 'Time',
            width: '30%',
            render: (text, record) => {
                const {StartTime, EndTime} = record;
                return (
                    <div>
                        <AlertWindow ActivityList = {this.props.ActivityList} text={StartTime + " -- " + EndTime} data={record}></AlertWindow>
                    </div>
                );
            }
        }, {
            title: '活动标题',
            dataIndex: 'Title',
            width: '20%',
            render: (text, record) => {
                const {Title} = record;
                return (
                    <div>
                        <AlertWindow ActivityList = {this.props.ActivityList} text={Title} data={record}></AlertWindow>
                    </div>
                );
            }
        }, {
            title: '绩效',
            dataIndex: 'AmountInfo',
            width: '20%',
            render: (text, record) => {
                const {AmountInfo} = record;
                return (
                    <div>
                         {AmountInfo.data.map((item, index)=>{
                             return(
                                 <div key={index}>
                                     满 {item.meet}单底薪{item.BasicSalary}元，奖励{item.Commission}元/单
                                 </div>
                             );
                         })}
                    </div>
                );
            }
        }, {
            title: '状态',
            dataIndex: 'Status',
            width: '10%',
            render: (text, record) => {
                const {Status} = record;
                return (
                    <div className="editable-row-operations">
                        <Switch checked={Status == 1 ? false : true} onChange={() => {
                            this.props.clickState(text, record);
                        }}/>
                    </div>
                );
            }
        }, {
            title: '创建时间',
            dataIndex: 'CreateTime',
            width: '20%',
            render: (text, record) => {
                const {CreateTime} = record;
                return (
                    <div>
                        {CreateTime}
                    </div>
                );
            }
        }];
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.setModActivityInfoFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setModActivityInfoFetch', 'close');
            getPriceAllocation({
                HubIDList: this.props.HubIDListALL,
                RecordIndex: 0,
                RecordSize: 2000
            });
        }
    }
    render() {
        return <Table loading={this.props.loading} bordered dataSource={this.props.ActivityList} columns={this.columns}/>;
    }
}

class AccountSearchForm extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);

        this.state = {
            toConfig: [{BasicSalary: "", Commission: "", meet: ""}],
            StartTime: this.props.dateList ? this.props.dateList.StartTime : "",
            EndTime: this.props.dateList ? this.props.dateList.EndTime : "",
            open: false
        };
        this.handleCancel = this.handleCancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.changeData = this.changeData.bind(this);
        this.clickAddInfo = this.clickAddInfo.bind(this);
        this.delInfo = this.delInfo.bind(this);
        this.checkRule = this.checkRule.bind(this);
        this.handleOpenChange = this.handleOpenChange.bind(this);
    }
    componentWillMount() {

        if(!this.props.type) {
            setTimeout(()=>{
                this.props.form.setFieldsValue({
                    Title: this.props.dateList.Title,
                    Status: this.props.dateList.Status,
                    Time: [moment(this.props.dateList.StartTime, 'YYYY/MM/DD HH:mm:ss'), moment(this.props.dateList.EndTime, 'YYYY/MM/DD HH:mm:ss')],
                    toConfig: Object.assign([], this.props.dateList.AmountInfo.data)
                });
            }, 100);
            this.setState({
                toConfig: Object.assign([], this.props.dateList.AmountInfo.data)
            });
        }

    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let currentList = values;
            let parms = {};
            console.log(err);
            for (let key in currentList) {
                if(!values[key] && key != "add") {
                    message.destroy();
                    message.error('内容不全，请将信息补充完整。');
                    return;
                }
            }
            parms.StartTime = this.state.StartTime;
            parms.EndTime = this.state.EndTime;
            parms.HubActivityID = this.props.dateList ? this.props.dateList.HubActivityID : null;
            parms.HubIDList = this.props.HubIDListALL;
            parms.Status = currentList.Status;
            parms.Title = currentList.Title;
            parms.AmountInfo = {
                "data": this.state.toConfig
            };
            parms.AmountInfo = JSON.stringify(parms.AmountInfo);
            ModActivityInfo(filterObject(parms));
            if(this.props.type) { // 新建清除，编辑不清除
                this.props.form.resetFields();
                this.setState({
                    toConfig: [{BasicSalary: "", Commission: "", meet: ""}]
                });
            }
            this.props.close();
        });
    };
    handleCancel() {
        this.props.close();
    }
    handleOpenChange(open) {
        this.setState({ open: open });
    }

    onChange(dates, dateStrings) {

        let chooseStartTime = new Date(dateStrings[0]);
        let chooseEndTime = new Date(dateStrings[1]);
        for (let i = 0; i < this.props.ActivityList.length; i++) {
            let forStartTime = new Date(this.props.ActivityList[i].StartTime);
            let forEndTime = new Date(this.props.ActivityList[i].EndTime);
            if(!this.props.type && this.props.dateList.key != i) {
                if((forStartTime <= chooseStartTime && forEndTime >= chooseStartTime) || (forStartTime <= chooseEndTime && forEndTime >= chooseEndTime)) {
                    this.setState({ open: false });
                    setTimeout(()=>{ // 这里有一个异步延迟，加个一次性定时器
                        this.props.form.setFieldsValue({
                            Time: [moment(this.props.dateList.StartTime, 'YYYY/MM/DD HH:mm:ss'), moment(this.props.dateList.EndTime, 'YYYY/MM/DD HH:mm:ss')]
                        });
                    }, 50);
                    message.destroy();
                    message.error('您设置的活动时间有重叠，请重新设置。');
                    return;
                }
            }else if(this.props.type) {
                if((forStartTime <= chooseStartTime && forEndTime >= chooseStartTime) || (forStartTime <= chooseEndTime && forEndTime >= chooseEndTime)) {
                    this.setState({ open: false });
                    setTimeout(()=>{ // 这里有一个异步延迟，加个一次性定时器
                        this.props.form.setFieldsValue({
                            Time: [null, null]
                        });
                    }, 50);
                    message.destroy();
                    message.error('您设置的活动时间有重叠，请重新设置。');
                    return;
                }
            }

        }
        this.setState({
            StartTime: dateStrings[0],
            EndTime: dateStrings[1]
        });
    }
    changeData(e) {
        let toConfig = this.state.toConfig;
        toConfig[e.target.tabIndex][e.target.name] = Number(e.target.value);
       this.setState({
           toConfig: Object.assign([], toConfig)
       });
    }
    checkRule(e) {
        let toConfig = this.state.toConfig;
        if(e.target.name == "meet") {
            for (let i = 0; i < toConfig.length && i < e.target.tabIndex; i++) {
                if(toConfig[i].meet >= Number(e.target.value)) { // 这边要去掉和自身比较
                    e.target.value = "";
                    toConfig[e.target.tabIndex][e.target.name] = "";
                    message.destroy();
                    message.error('输入有误，请按活动规则输入。');
                    return;
                }
            }
            for (let i = e.target.tabIndex + 1; i < toConfig.length; i++) {
                if(toConfig[i].meet <= Number(e.target.value)) { // 这边要去掉和自身比较
                    e.target.value = "";
                    toConfig[e.target.tabIndex][e.target.name] = "";
                    message.destroy();
                    message.error('输入有误，请按活动规则输入。');
                    return;
                }
            }
        }
    }
    clickAddInfo() {
        let toConfig = this.state.toConfig;
        toConfig.push({BasicSalary: "", Commission: "", meet: ""});
        this.setState({
            toConfig: Object.assign([], toConfig)
        });

    }
    delInfo(index) {
        let toConfig = this.state.toConfig;

        if(toConfig.length > 1) {
            toConfig.splice(index, 1);
        }
        this.setState({
            toConfig: Object.assign([], toConfig)
        });
    }
    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        let children = [];
        for (let i = 0; i < titleList.length; i++) {
            children.push(
                <Col span={24} key={i} style={{ padding: "0  10px"}}>
                    <FormItem {...formItemLayout} label={titleList[i].name}>
                        {getFieldDecorator(titleList[i].value)(
                            titleList[i].name == "配置时间" ? <RangePicker
                                ranges={{ "今天": [moment(), moment()], "本月": [moment(), moment().endOf('month')] }}
                                showTime
                                format="YYYY/MM/DD HH:mm:ss"
                                onChange={this.onChange}
                                open={this.state.open}
                                onOpenChange={this.handleOpenChange}
                            /> : titleList[i].name == "启用状态" ? <RadioGroup>
                                <Radio value={1}>停用</Radio>
                                <Radio value={2}>开启</Radio>
                            </RadioGroup> : titleList[i].name == "配置" ? <div>{this.state.toConfig.map((item, index)=>{return(<div key={index}> 满 <input type="text" tabIndex = {index} value={this.state.toConfig[index].meet ? this.state.toConfig[index].meet : ""} className="instyle" name="meet" onChange={this.changeData} onBlur={this.checkRule}/> 单
                                    <span className="mleft"> 底薪 </span><input type="text" tabIndex = {index} value={this.state.toConfig[index].BasicSalary ? this.state.toConfig[index].BasicSalary : ""} className="instyle" name="BasicSalary" onChange={this.changeData}/> 元 <span className="mleft"> 奖励 </span>
                                    <input type="text" tabIndex = {index} value={this.state.toConfig[index].Commission ? this.state.toConfig[index].Commission : ""} className="instyle" name="Commission" onChange={this.changeData}/> 元/单 <span onClick={()=>{this.delInfo(index);}} style={{fontSize: "22px", cursor: "pointer", marginLeft: "10px", display: index == 0 ? "none" : "inline-block"}} className="iconfont icon-offline"></span></div>);})}</div>
                                : titleList[i].name == "添加配置" ? <span style={{fontSize: "22px", cursor: "pointer"}} onClick={this.clickAddInfo} className="iconfont icon-addition"></span> :
                                <Input style={{ height: 30 }}/>
                        )}
                    </FormItem>
                </Col>
            );
        }
        return(
            <div>
                {children}
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



export default class PriceAllocation extends React.PureComponent { // 页面组件
    constructor(props) {
        super(props);

        this.handleGoPage = this.handleGoPage.bind(this);
        this.ClickState = this.ClickState.bind(this);
    }
    componentWillMount() {
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        getPriceAllocation({
            HubIDList: this.HubIDListALL,
            RecordIndex: 0,
            RecordSize: 2000
        });
    }
    handleGoPage() {
        browserHistory.goBack();
    }
    ClickState(a, b) {
        // let upArr = this.props.ActivityList;
        // upArr[b.key].Status = (upArr[b.key].Status == 1 ? 2 : 1);
        // setParams("state_ec_priceAllocation", {ActivityList: Object.assign([], upArr)});
        ModActivityInfo({
            AmountInfo: JSON.stringify(b.AmountInfo),
            EndTime: b.EndTime,
            StartTime: b.StartTime,
            HubActivityID: b.HubActivityID,
            HubIDList: b.HubIDList,
            Status: b.Status == 1 ? 2 : 1,
            Title: b.Title
        });
    }
    render() {
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">地推价格配置</div>
                    <Button type='primary' className='title-btn'
                            onClick={this.handleGoPage}>返回
                    </Button>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-2">
                            <AlertWindow HubIDListALL={this.HubIDListALL} ActivityList = {this.props.ActivityList} type = "createAdd"></AlertWindow>
                            <EditableTable loading={this.props.RecordListLoading} {...this.props.setStatus} ActivityList = {this.props.ActivityList} clickState = {this.ClickState}></EditableTable>
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
        return(
            <div>
                {this.props.type !== "createAdd" ? <a href="javascript:;" onClick={()=>{this.showModal(this);}}>{this.props.text}</a> : <Button style={{margin: "20px 0"}} onClick={()=>{this.showModal(this);}} type="primary">新建活动</Button>}

                <Modal
                    title="新建活动"
                    visible={this.state.visible}
                    onOk={this.setAccount}
                    onCancel={this.hideModal}
                    okText="新建"
                    cancelText="取消"
                    width="800px"
                >
                    <WrappedAccount HubIDListALL={this.props.HubIDListALL} ActivityList = {this.props.ActivityList} type={this.props.type} dateList = {this.props.data ? this.props.data : null} close = {this.hideModal}></WrappedAccount>
                </Modal>
            </div>
        );
    }
}
