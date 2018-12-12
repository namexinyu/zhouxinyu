import React from 'react';
import {
  Modal,
  Form,
  Input
} from 'antd';
import createFormField from 'ADMIN_UTILS/createFormField';
import { RoleType } from 'ADMIN_CONFIG/enum/Role';

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
};
const ModalForm = Form.create({
  mapPropsToFields: props => createFormField(props.formValue),
  onValuesChange: (props, changedValues, allValues) => props.onValuesChange(changedValues)
})(({ handleSubmit, handleFormReset, form, type }) => {
  const { getFieldDecorator } = form;

  return (
    <Form>
      <Form.Item {...formItemLayout} label="角色名称">
        {getFieldDecorator('RoleName', {
          rules: [
            {
              required: true,
              message: '角色名称必填'
            }
          ]
        })(
          <Input placeholder='请输入' maxLength={10} />
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="备注">
        {getFieldDecorator('Remark')(<Input.TextArea placeholder='请输入' maxLength={200} />)}
      </Form.Item>

    </Form>
  );
});

export default class RoleModal extends React.PureComponent {

  formRef = React.createRef();

  handleOk = () => {
    this.formRef.current.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.handleModalChange.onOk();
    });
  };

  render () {
    const { Visible, confirmLoading, roleModalInfo, handleModalChange } = this.props;
    return (
      <Modal
        title={roleModalInfo.RoleID ? '修改角色' : '新增角色'}
        confirmLoading={confirmLoading}
        onOk={this.handleOk}
        onCancel={handleModalChange.onCancel}
        afterClose={handleModalChange.afterClose}
        visible={Visible}>
        <ModalForm ref={this.formRef}
          formValue={roleModalInfo}
          onValuesChange={handleModalChange.handleValuesChange}
        />
      </Modal>
    );
  }
};