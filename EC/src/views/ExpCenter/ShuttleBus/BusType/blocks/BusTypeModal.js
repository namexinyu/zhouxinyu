import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import BusType from 'SERVICE/ExpCenter/BusType';
import setParams from "ACTION/setParams";
const STATE_NAME = "reducersBusType";
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
class BusTypeModal extends React.Component {
    handleOk = (e) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) return;
            let params = {};
            // 新增
            if (values.ModalSeatNum.trim() !== "") {
                if (values.ModalSeatNum * 1 > 127) {
                    message.warning("座位数最大为127");
                }else if(values.ModalSeatNum * 1 < 1) {
                    message.warning("座位数最小为1");
                } else {
                    params.SeatNum = values.ModalSeatNum * 1;
                    BusType.getAddBusType(params).then((data) => {
                        if (data.Code == 0) {
                            message.success("添加成功");
                            this.props.check();
                            setParams(STATE_NAME, {
                                displayModal: false
                            });
                            this.props.form.resetFields();
                        } else {
                            message.error(data.Desc);
                        }
                    })
                    .catch((data) => {
                        message.error(data.Desc);
                    });  
                }
            }
        });
    }
    handleCancel = (e) => {
        // 取消
        setParams(STATE_NAME, {
            displayModal: false
        });
        this.props.form.resetFields();
    }
    render () {
        const FormItem = Form.Item;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return(
            <Modal 
                title= {"新增车型"}
                visible= {this.props.list.displayModal}
                onOk={this.handleOk}
                onCancel={this.handleCancel}>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="车座数" >
                        {getFieldDecorator('ModalSeatNum', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写车座数'
                                    }
                                ]})(<Input type= "number" placeholder="请输入" />)}  
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
        const {
            ModalSeatNum
        } = props.list.queryParams;
        return {
            ModalSeatNum
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, props.list.queryParams, fields)
        });
    }
})(BusTypeModal);