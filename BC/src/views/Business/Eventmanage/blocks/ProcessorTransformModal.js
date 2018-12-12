import React from 'react';
import EventManagementService from 'SERVICE/Business/Management/eventmanagement';

const { getMoveEvent } = EventManagementService;

import {
  Button,
  Row,
  Col,
  message,
  Form,
  Input,
  Icon,
  Modal,
  Upload,
  Select
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class ProcessorTransModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleOnOK = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
				console.log(err);
				return;
      }

      console.log(values);
      
      const { Processor, Remark } = values;

      getMoveEvent({
        DealDiplomatID: +JSON.parse(sessionStorage.getItem('mams_session_login_info')).employeeId || 0,
        EventIDs: [this.props.EventDetail.EventID],
        NewDiplomatID: +Processor || 0,
        MoveReason: Remark || ''
      }).then((res) => {
        if (res.Code === 0) {
          message.success('转移成功！');
          this.props.form.resetFields();
          this.props.onOk();
        } else {
          message.error(res.Data.Desc || '操作失败，请联系技术人员');
        }
      }).catch((err) => {
        message.error(err.Desc || '操作失败，请联系技术人员');
      });
    });
  }

  handleOnCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  render() {
    const {
      form: {
        getFieldDecorator
      },
      visible,
      eventarrange,
      onCancel,
      availableProcessors
    } = this.props;

    return (
      <Modal
        title="转移处理人"
        visible={visible}
        onOk={this.handleOnOK}
        onCancel={this.handleOnCancel}
      >
        <Form className="">
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="通知对象">
            {getFieldDecorator('Processor', {
              rules: [
                {
                  required: true,
                  message: '请选择通知对象'
                }
              ]
            })(
              <Select
                placeholder="请选择"
                size="default"
              >
                {
                  eventarrange.map((item, i) => {
                    return (
                      <Option key={i} value={`${item.DiplomatID}`}>{item.DiplomatName}</Option>
                    );
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="备注">
            {getFieldDecorator('Remark', {
              rules: [
                {
                  required: true,
                  message: '备注不能为空'
                }
              ]
            })(
              <Input.TextArea autosize={{minRows: 4, maxRows: 8}} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({})(ProcessorTransModal);
