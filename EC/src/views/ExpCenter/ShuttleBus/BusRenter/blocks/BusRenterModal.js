import React from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import setParams from "ACTION/setParams";
import BusRenter from 'SERVICE/ExpCenter/BusRenter';
const STATE_NAME = "reducersBusRenter";
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
class BusRenterModal extends React.Component {
    handleOk = (e) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) return;
            let params = {};
            if (this.props.list.ModalType == 1) {
                // 新增
                if (values.LinkmanName.trim() !== "") {
                    params.LinkmanName = values.LinkmanName;
                }
                if (values.RentCorpName.trim() !== "") {
                    params.RentCorpName = values.RentCorpName;
                }
                if (values.Mobile.trim() !== "") {
                    params.Mobile = values.Mobile;
                }
                if (this.props.list.queryParams.DriverMobileList.length > 0) {
                    params.Drivers = this.props.list.queryParams.DriverMobileList;
                }
                BusRenter.getAddBusRenter(params).then((data) => {
                    if (data.Code == 0) {
                        message.success("添加成功");
                       this.handleCancel();
                        this.props.check();
                        this.props.form.resetFields();
                    } else {
                        message.error(data.Desc);
                    }
                })
                .catch((data) => {
                    message.error(data.Desc);
                });
            } else {
                // 修改
                if (values.LinkmanName.trim() !== "") {
                    params.LinkmanName = values.LinkmanName;
                } 
                if (values.RentCorpName.trim() !== "") {
                    params.RentCorpName = values.RentCorpName;
                } 
                if (values.Mobile.trim() !== "") {
                    params.Mobile = values.Mobile;
                }
                if (this.props.list.queryParams.DriverMobileList.length > 0) {
                    params.Drivers = this.props.list.queryParams.DriverMobileList;
                }
                params.BusRentCorpID = this.props.BusRentCorpID * 1;
                BusRenter.getModBusRenter(params).then((data) => {
                    if (data.Code == 0) {
                        message.success("修改成功");
                        this.handleCancel();
                        this.props.check();
                        this.props.form.resetFields();
                    } else {
                        message.error(data.Desc);
                    }
                })
                .catch((data) => {
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
                DriverMobileList: []
            }
        });
        this.props.form.resetFields();
    }
    addTimeList = () => {
        let type = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
        let DriverMobileList = this.props.list.queryParams.DriverMobileList;
        if (this.props.list.queryParams.DriverMobile.value) {
            if (!type.test(this.props.list.queryParams.DriverMobile.value)) {
                message.warning("请填写正确的手机号!");
            } else {
                let type = true;
                DriverMobileList.map((item) => {
                    if(this.props.list.queryParams.DriverMobile.value == item.Mobile) {
                        type = false;
                    }
                });
                if (type) {
                    DriverMobileList.push({Mobile: this.props.list.queryParams.DriverMobile.value});
                    setParams(STATE_NAME, {
                        queryParams: {
                            ...this.props.list.queryParams,
                            DriverMobileList: DriverMobileList,
                            DriverMobile: ""
                        }
                    });
                }else {
                    setParams(STATE_NAME, {
                        queryParams: {
                            ...this.props.list.queryParams,
                            DriverMobile: ""
                        }
                    });
                    message.warning("手机号重复!");
                }
            }
        } else {
        message.warning("请填写手机号!");
        }
    }
    DelDate = (DelDateindex) => {
        let Item = this.props.list.queryParams.DriverMobileList;
        let arr = [];
        Item.map((item, index) => {

            if (index !== DelDateindex) {
                arr.push(item);
            }
        });
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.list.queryParams,
                DriverMobileList: arr
            }
        });
    }
    render () {
        const FormItem = Form.Item;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return(
            <Modal 
                title= {this.props.list.ModalType == 1 ? "新增租车公司" : "编辑"}
                visible= {this.props.list.displayModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="租车公司：" >
                        {getFieldDecorator('RentCorpName', {
                            initialValue: this.props.record.RentCorpName || '',
                            rules: [
                                {
                                    required: true,
                                    message: '请填写租车公司'
                                }
                            ]})(<Input disabled={this.props.list.ModalType == 1 ? false : true} placeholder="请输入" maxLength={"20"} />)}  
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="联系人：">
                    {getFieldDecorator('LinkmanName', {
                            initialValue: this.props.record.LinkmanName || '',
                             rules: [{
                                required: true,
                                message: '请填写联系人'
                            }]
                        })(<Input placeholder="请输入" maxLength={"11"}/>)}  
                    </FormItem>                    
                    <FormItem
                        {...formItemLayout}
                        label="联系电话：">
                    {getFieldDecorator('Mobile', {
                            initialValue: this.props.record.Mobile || '',
                            rules: [{
                                required: true,
                                message: '请填写联系电话'
                            }, {
                                pattern: /^1[3|4|5|6|7|8][0-9]\d{4,8}$/,
                                message: '请输入正确的手机号码'
                        }]
                        })(<Input placeholder="请输入" maxLength={"11"}/>)}  
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="司机电话：">
                        {getFieldDecorator('DriverMobile', {
                            initialValue: ''
                        })(<Input style={{width: "70%", display: "inline"}} placeholder="请输入" maxLength={"11"}/>)}<Button onClick={this.addTimeList} style={{display: "inline"}} >添加</Button>
                    </FormItem>
                    {
                        this.props.list.queryParams.DriverMobileList.length > 0 && <FormItem>
                            { this.props.list.queryParams.DriverMobileList.map((Item, index) => {
                                    return <div key={index} style={{marginLeft: "100px"}}><span>{Item.Mobile}</span><a style={{marginLeft: "10px"}} onClick={this.DelDate.bind(this, index)}>删除</a></div>;
                                })
                            }
                            </FormItem>
                    }
                </Form>
            </Modal>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
        const {
         RentCorpName,
         LinkmanName,
         Mobile,
         DriverMobile
        } = props.list.queryParams;
        return {
            RentCorpName,
            LinkmanName,
            Mobile,
            DriverMobile
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, props.list.queryParams, fields)
        });
    }
})(BusRenterModal);