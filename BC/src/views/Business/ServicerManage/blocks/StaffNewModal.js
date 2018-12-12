import React from 'react';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import StaffManageService from 'SERVICE/Business/StaffManage/index';

const {
  addServiceStaff
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

class StaffNewModal extends React.PureComponent {
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
      form
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

        addServiceStaff({
          EntName: RecruitName.text,
          RecruitTmpID: +RecruitName.value,
          LaborName: LaborName.text,
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
      }
    });
  }

  // handleTextAreaChange = (e, type) => {
  //   this.setState({
  //     [type]: e.target.value
  //   });
  // }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldsValue
      },
      visible
    } = this.props;

    return (
      <Modal
        title="新建"
        visible={visible}
        onCancel={this.handleOnCancel}
        onOk={this.handleOnOk}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="劳务公司">
                {getFieldDecorator('LaborName', {
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

export default Form.create({})(StaffNewModal);
