import React from 'react';
import { TimePicker, Modal, Button, Form, Input, message, Select } from 'antd';
import BusSchedule from 'SERVICE/ExpCenter/BusSchedule';
import setParams from "ACTION/setParams";
const Option = Select.Option;
const STATE_NAME = "reducersBusSchedule";
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 }
    }
};
const { TextArea } = Input;
class BusScheduleModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Item: [],
            types: true
        };
    }
    handleOk = (e) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) return;
            let params = {};
            if (this.props.list.ModalType == 1) {
                // 新增
                if (values.OriginHubID) {
                    let OriginHubID = values.OriginHubID.split("/");
                    params.OriginHubID = OriginHubID[0] * 1;
                    params.OriginHub = OriginHubID[1];
                }
                if (values.DestHubID) {
                    let DestHubID = values.DestHubID.split("/");
                    params.DestHubID = DestHubID[0] * 1;
                    params.DestHub = DestHubID[1];
                }
                if (values.Distance.trim() !== "") {
                    params.Distance = values.Distance * 1;
                }
                if (this.props.list.queryParams.ScheduleTimeList.length > 0) {
                    params.ScheduleTimeList = this.props.list.queryParams.ScheduleTimeList;
                }
                if (values.Remark.trim() !== "") {
                    params.Remark = values.Remark;
                }
                BusSchedule.getAddBusSchedule(params).then((data) => {
                    if (data.Code == 0) {
                        message.success("添加成功");
                        setParams(STATE_NAME, {
                            displayModal: false
                        });
                        this.props.form.resetFields();
                        this.props.check();
                    }
                })
                .catch((data) => {
                    message.error(data.Desc);
                });
            } else {
                // 修改
                if (values.Distance) {
                    params.Distance = values.Distance * 1;
                } else {
                    params.Distance = 0;
                }
                params.Remark = values.Remark.trim();
                params.RouteID = this.props.record.BusRouteID;
                let ScheduleTimeList = [];
                this.props.list.queryParams.ScheduleTimeList.map((item, index) => {
                    ScheduleTimeList.push({RouteID: this.props.record.BusRouteID, ScheduleTime: item, BusScheduleID: this.props.list.queryParams.BusScheduleIDList[index]});
                });
                params.ScheduleTimeList = ScheduleTimeList;
                BusSchedule.getModBusSchedule(params).then((data) => {
                    if (data.Code == 0) {
                        message.success("修改成功");
                        setParams(STATE_NAME, {
                            displayModal: false
                        });
                        this.props.check();
                        this.props.form.resetFields();
                    } else {
                        message.warning(data.Desc);
                    }
                }).catch((data) => {
                    message.error(data.Desc);
                });
            }
        });
    }
    handleCancel = (e) => {
        // 取消
        setParams(STATE_NAME, {
            displayModal: false,
            queryParams: {
                ...this.props.list.queryParams,
                ScheduleTimeList: []
            }
        });
        this.setState({
            Item: []
        });
        this.props.form.resetFields();
    }
    // 添加时间
    addTimeList = () => {
        if (this.props.list.queryParams.Dates !== "") {
            let Time = this.props.list.queryParams.ScheduleTimeList;
            let ScheduleTime = this.props.list.queryParams.Dates.value.format('HH:mm');
            let TimeType = false;
            Time.map((item) => {
                if (item == ScheduleTime) {
                    TimeType = true;
                    return;
                }
            });
            if (TimeType == false) {
                Time.push(ScheduleTime);
            }else {
                message.warning("时间重复请重新选择");
            }
            setParams(STATE_NAME, {
                queryParams: {
                    ...this.props.list.queryParams,
                    Dates: "",
                    ScheduleTimeList: Time
                }
            }); 
        } else {
            message.warning("请选择时间");
        }
    }
    // 删除时间
    DelDate = (DelDateindex) => {
        let Item = this.props.list.queryParams.ScheduleTimeList;
        let arr = [];
        Item.map((item, index) => {
            if (index !== DelDateindex) {
                arr.push(item); 
            }
        });
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.list.queryParams,
                ScheduleTimeList: arr
            }
        });
        this.setState({
            Item: arr,
           types: false 
        });
    }
    render () {
        const FormItem = Form.Item;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return(
            <Modal 
                width={600}
                title= {this.props.list.ModalType == 1 ? "新增班次" : "编辑"}
                visible= {this.props.list.displayModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="始发地：" >
                        {getFieldDecorator('OriginHubID', {
                                initialValue: this.props.record.OriginName ? this.props.record.OriginName : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择始发地'
                                    }
                            ]})(<Select disabled={this.props.list.ModalType !== 1 ? true : false}>
                                    {this.props.HubSimpleList.map((key, index) => {
                                        return (<Option key={index} value={key.HubID + "/" + key.HubName}>{key.HubName}</Option>);
                                    })}
                                </Select>)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="目的地：">
                    {getFieldDecorator('DestHubID', {
                            initialValue: this.props.record.DestName ? this.props.record.DestName : '',
                            rules: [{
                                required: true,
                                message: '请选择目的地'
                            }]
                        })(<Select disabled={this.props.list.ModalType !== 1 ? true : false}>
                                {this.props.HubSimpleList.map((key, index) => {
                                    return (<Option key={index} value={key.HubID + "/" + key.HubName}>{key.HubName}</Option>);
                                })}
                            </Select>)}  
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="公里数：">
                    {getFieldDecorator('Distance', {
                            initialValue: this.props.record.Distance || ''
                        })(<Input type="number" placeholder="请输入"/>)}  
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="发车时间：">
                    {getFieldDecorator('Dates', {
                            initialValue: ''
                        })(<TimePicker
                            format="HH:mm"
                            />)} <Button onClick={this.addTimeList} style={{display: "inline"}} >添加</Button>
                    </FormItem>
                    {
                        this.props.list.queryParams.ScheduleTimeList.length > 0 && <FormItem>
                            { this.props.list.queryParams.ScheduleTimeList.map((Item, index) => {
                                    return <div key={index} style={{marginLeft: "100px"}}><span><span style={{padding: "0 10px"}}>{Item.split(":")[0]}</span><span style={{padding: "0 10px"}}>时</span><span style={{padding: "0 10px"}}>{Item.split(":")[1]}</span><span style={{padding: "0 10px"}}>分</span></span><a onClick={this.DelDate.bind(this, index)}>删除</a></div>;
                                })
                            }
                            </FormItem>
                    }
                    <FormItem
                        {...formItemLayout}
                        label="备注：">
                    {getFieldDecorator('Remark', {
                            initialValue: this.props.record.Remark || ''
                        })(<TextArea style={{height: "180px"}} placeholder="请写明原因" rows={4} maxLength="200" />)}  
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
        const {
            OriginHubID,
            DestHubID,
            Distance,
            Dates,
            Remark
        } = props.list.queryParams;
        return {
            OriginHubID,
            DestHubID,
            Distance,
            Dates,
            Remark
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, props.list.queryParams, fields)
        });
    }
})(BusScheduleModal);