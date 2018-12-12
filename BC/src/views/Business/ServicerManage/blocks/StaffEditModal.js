import React from 'react';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import StaffManageService from 'SERVICE/Business/StaffManage/index';

const {
  addServiceStaff,
  updateServiceStaff
} = StaffManageService;

import {
  Button,
  Row,
  Col,
  message,
  Form,
  Input,
  Modal,
  Cascader,
  Upload,
  InputNumber,
  Select
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;

class StaffEditModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleOnCancel = (e) => {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  handleOnOk = () => {

    const {
      form,
      type,
      rowRecord
    } = this.props;

    form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        const {
          LaborName,
          RecruitName,
          Mobile,
          Remark
        } = values;

        if (type === 'copy') {
          addServiceStaff({
            EntName: RecruitName.text,
            LaborName: LaborName.text,
            RecruitTmpID: +RecruitName.value,
            LaborID: +LaborName.value,
            Mobile: Mobile,
            Remark: Remark || ''
          }).then((res) => {
            if (res.Code === 0) {
              message.success("操作成功");
              this.props.onOk();
            } else {
              message.error(res.Desc || '出错了，请稍后尝试');
            }
          }).catch((err) => {
              message.error(err.Desc || '出错了，请稍后尝试');
          });
        } else {
          updateServiceStaff({
            LaborContactID: rowRecord.LaborContactID,
            EntName: RecruitName.text,
            LaborName: LaborName.text,
            LaborID: +LaborName.value,
            RecruitTmpID: +RecruitName.value,
            Mobile: Mobile,
            Remark: Remark || ''
          }).then((res) => {
            if (res.Code === 0) {
              message.success("操作成功");
              this.props.onOk();
            } else {
              message.error(res.Desc || '出错了，请稍后尝试');
            }
          }).catch((err) => {
              message.error(err.Desc || '出错了，请稍后尝试');
          });
        }
      }
    });
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldsValue
      },
      type,
      rowRecord,
      visible
    } = this.props;
    
    return (
      <Modal
        title={type === 'copy' ? '复制' : '编辑'}
        visible={visible}
        onCancel={this.handleOnCancel}
        onOk={this.handleOnOk}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="劳务公司">
                {getFieldDecorator('LaborName', {
                  initialValue: rowRecord.laborInfo ? rowRecord.laborInfo : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请选择劳务公司'
                    },
                    {
                      validator: (rule, value, cb) => {
                          if (value && !value.value) {
                              cb('劳务公司为必选项');
                          }
                          cb();
                      }
                    }
                  ]
                })(
                  <AutoCompleteSelect allowClear={true} optionsData={{
                    valueKey: 'LaborID',
                    textKey: 'ShortName',
                    dataArray: this.props.commonData.LaborSimpleList
                  }}/>
                )}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="企业名称">
                {getFieldDecorator('RecruitName', {
                  initialValue: rowRecord.recruitInfo ? rowRecord.recruitInfo : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请选择企业名称'
                    },
                    {
                      validator: (rule, value, cb) => {
                          if (value && !value.value) {
                              cb('企业名称为必选项');
                          }
                          cb();
                      }
                    }
                  ]
                })(
                  <AutoCompleteSelect allowClear={true} optionsData={{
                    valueKey: 'RecruitTmpID',
                    textKey: 'RecruitName',
                    dataArray: this.props.commonData.RecruitSimpleList
                  }}/>
                )}
              </FormItem>
            </Col>
            
            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="联系电话">
                {getFieldDecorator('Mobile', {
                  initialValue: rowRecord.Mobile || '',
                  rules: [
                    {
                      required: true,
                      message: '手机号不能为空'
                    },
                    {
                      pattern: /^1[2-9][0-9]\d{8}$/,
                      message: '请输入正确的11位手机号'
                    }
                  ]
                })(
                  <Input type="tel" maxLength="11" />
                )}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label="备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <div>
                  {getFieldDecorator('Remark', {
                    initialValue: rowRecord.Remark || '',
                    rules: [
                      {
                        validator: function (rule, value, cb) {
                          if (!!value && value.length > 60) {
                              cb('备注不能多于60个字');
                          }
                          cb();
                        }
                      }
                    ]
                  })(
                    <Input.TextArea
                      autosize={{minRows: 3, maxRows: 6}}
                      style={{resize: 'none'}}
                      maxLength="60"
                      placeholder="请输入"
                    />
                  )}
                </div>
              </FormItem>
            </Col>

          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({})(StaffEditModal);
