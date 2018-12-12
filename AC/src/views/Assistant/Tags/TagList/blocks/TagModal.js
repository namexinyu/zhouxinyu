import React from 'react';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import getClient from 'COMPONENT/AliyunUpload/getClient';

import uploadRule from 'CONFIG/uploadRule';

import {
  Button,
  Row,
  Col,
  message,
  Form,
  Input,
  Icon,
  Modal,
  Upload
} from 'antd';

const FormItem = Form.Item;

class TagModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: ''
    };
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  }

  handleCancelPreview = () => {
    this.setState({
      previewVisible: false
    });
  }

  handleInputChange = (index) => {
    this.props.onInputChange(this, index);
  }

  handleUploadChange = (id, fileList, index) => {
    if (fileList && fileList.length && fileList[fileList.length - 1].lastModified && fileList[fileList.length - 1].size > 2 * 1024 * 1024) {
      return;
    }
    this.props.onUploadChange(this, fileList, index);
  }

  handleOnResponse = (res, fileList, index) => {
    if (fileList && fileList.length && fileList[fileList.length - 1].lastModified && fileList[fileList.length - 1].size > 2 * 1024 * 1024) {
      return;
    }
    this.props.onResponse(this, fileList, res, index);
  }

  handleNormalizeFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        setFieldsValue
      },
      title,
      visible,
      onOk,
      onCancel,
      onRemoveTagContent,
      onAddTagContent,
      tagForm: {
        Name,
        TagBody,
        TagRemark
      }
    } = this.props;

    const { previewVisible, previewImage } = this.state;

    getFieldDecorator('TagBody', { initialValue: TagBody });

    return (
      <Modal
        title={title}
        width="50%"
        visible={visible}
        onOk={() => onOk(this)}
        onCancel={() => onCancel(this)}
      >
        <Form className="tag-modal-form">
          <FormItem className="tag-modal-form__name" labelCol={{span: 3}} wrapperCol={{span: 8}} label="标签：">
            {getFieldDecorator('Name', {
              initialValue: Name,
              rules: [
                {
                  required: true,
                  message: '标签不能为空'
                },
                {
                  validator: function (rule, value, cb) {
                      if (!!value && !!value.length && value.length > 10) {
                          cb('标签不能多于10个字');
                      }
                      cb();
                  }
                }
              ]
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          {TagBody.map((item, index) => (
            <Row key={index}>
              <Col span={24}>
                <Row>
                  <Col span={0}>
                    <FormItem labelCol={{span: 0}} wrapperCol={{span: 0}}>
                      {getFieldDecorator(`TagBody[${index}].Flag`, {
                        initialValue: item.Flag
                      })(
                        <Input type="hidden" />
                      )}
                  </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={0}>
                    <FormItem labelCol={{span: 0}} wrapperCol={{span: 0}}>
                      {getFieldDecorator(`TagBody[${index}].CommonTagDetailID`, {
                        initialValue: item.CommonTagDetailID
                      })(
                        <Input type="hidden" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                
                
                <FormItem labelCol={{span: 3}} wrapperCol={{span: 8}} label="标签名称：">
                  {getFieldDecorator(`TagBody[${index}].Content`, {
                    initialValue: item.Content,
                    rules: [
                      {
                        required: true,
                        message: '标签名称不能为空'
                      },
                      {
                        validator: function (rule, value, cb) {
                            if (!!value && value.length > 10) {
                              cb('标签名称不能多于10个字');
                            }
                            cb();
                        }
                      }
                    ]
                  })(
                    <Input onChange={() => this.handleInputChange(index)} placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem wrapperCol={{span: 21, offset: 3}}>
                  {getFieldDecorator(`TagBody[${index}].Upload`, {
                    valuePropName: 'defaultFileList',
                    initialValue: item.Upload,
                    getValueFromEvent: this.handleNormalizeFile
                  })(
                    <AliyunUpload
                      id={'tagUpload'}
                      accept="image/jpeg,image/png"
                      oss={uploadRule.tagPicture}
                      listType="picture-card"
                      maxNum={5}
                      onResponse={(res, fileList) => this.handleOnResponse(res, fileList, index)}
                      uploadChange={(id, fileList) => this.handleUploadChange(id, fileList, index)}
                    />
                  )}
                </FormItem>
                <FormItem labelCol={{span: 3}} wrapperCol={{span: 21}} label="话术：">
                  {getFieldDecorator(`TagBody[${index}].TagSpeech`, {
                    initialValue: item.TagSpeech,
                    rules: [{
                      validator: function (rule, value, cb) {
                        if (!!value && value.length > 50) {
                          cb('话术不能多于50个字');
                        }
                        cb();
                      }
                    }]
                  })(
                    <Input onChange={() => this.handleInputChange(index)} placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem wrapperCol={{span: 21, offset: 3}}>
                  {(TagBody.length > 1) && (
                    <Button
                      type="danger"
                      className="mr-20"
                      icon="delete"
                      onClick={() => onRemoveTagContent(this, index)}
                    >删除</Button>
                  )}
                  {(index === TagBody.length - 1 && TagBody.length < 10) && (
                    <Button type="primary" icon="plus" onClick={() => onAddTagContent(this)}>添加</Button>
                  )}
                </FormItem>
              </Col>
            </Row>
          ))}
          
          <FormItem className="tag-modal-form__remark" labelCol={{span: 3}} wrapperCol={{span: 21}} label="备注">
            {getFieldDecorator('TagRemark', {
              initialValue: TagRemark,
              rules: [{
                validator: function (rule, value, cb) {
                  if (!!value && value.length > 50) {
                      cb('备注不能多于50个字');
                  }
                  cb();
                }
              }]
            })(
              <Input.TextArea autosize={{minRows: 4, maxRows: 8}} maxLength="100" placeholder="请输入" />
            )}
          </FormItem>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({})(TagModal);
