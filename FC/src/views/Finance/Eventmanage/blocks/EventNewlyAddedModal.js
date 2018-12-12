import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Dropzone from 'react-dropzone';

import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";

import ossConfig from 'CONFIG/ossConfig';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import EventService from 'SERVICE/Finance/Management/eventmanagement';
import uploadRule from 'CONFIG/uploadRule';
import { CONFIG } from 'mams-com';
const { AppSessionStorage } = CONFIG;
const IMG_PATH = ossConfig.getImgPath();
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
const {
  modifyEventType,
  replyEvent,
  endingEvent
} = EventService;

import {
  message,
  Form,
  Input,
  Modal,
  Icon,
  Upload,
  Select
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;

class EventNewlyAddedModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        queryParams: {},
        imgs: [],
        Uploadvalue: true,
        previewVisible: false,
        previewUrl: ""
    };
  }
  setParams = (queryParams) => {
    this.setState({
        queryParams: queryParams
    });
  }
  handleOnCancel = () => {
    this.props.setParams({});
    this.setState({
      questionRemark: '',
      imgs: []
    });
    this.props.EventNewlyAddedModal(false);
  }
  handlePictureUpload=(file, index)=> {
    if (!ossConfig.checkImage(file)) return;
    if (!this.uploader) this.uploader = new AliyunOssUploader();
    this.uploader.uploadFile(file, (res, message) => {
        if (res) {
          this.setState({
            imgs: this.state.imgs.concat({
              uid: file.uid,
              name: file.name,
              status: 'done',
              customPath: IMG_PATH,
              rawUrl: res.name,
              url: IMG_PATH + res.name
          })
          });
        } else {
            message.info('图片上传失败');
            console.log('fail', message);
        }
        
    }, "/web/eventlist/imgs");
    
    return false;
}
Dle = (data) => {
  let imgs = [];
 this.state.imgs.map((Item) => {
      if (data.uid !== Item.uid) {
        imgs.push(Item);
      }
 });
 this.setState({
  imgs: imgs
 });
}
preview=(a)=> {
  this.setState({
    previewVisible: true,
    previewUrl: a
  });
}
handleOnOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const {
          QuestionRemark
        } = values;

        const {
            imgs
        } = this.state;
        if (this.state.Uploadvalue == true) {
          EventService.getEventEntry({
            Department: 5,
            QuestionRemark,
            FromType: 7,
            PubEmployeeID: employeeId,
            Pictures: imgs.map(item => item.rawUrl)
          }).then((res) => {
            if (res.Code === 0) {
              if (Date.now() > new Date(moment().format('YYYY-MM-DD') + ' 21:00')) {
                Modal.warning({
                  title: '提示',
                  content: `小姐姐，业务客服已下班，该问题分配给${res.Data.DiplomatName}，可能明早8:00以后才能回复。如紧急请电话或微信qq群询问。`,
                  onOk: () => {
                    this.props.fetchEventList(this.props.pageQueryParams);
                    this.handleOnCancel();
                  }
                });
              } else {
                message.success(`发布成功，事件处理人是${res.Data.DiplomatName}`);
                this.props.fetchEventList(this.props.pageQueryParams);
                this.handleOnCancel();
              }
            } else {
              message.error(res.Desc || '出错了，请稍后尝试');
            }
          }).catch((err) => {
              message.error(err.Desc || '出错了，请稍后尝试');
          });
        } else {
          message.warning("请等图片上传完毕在发布");
        }
      }
    });
  }
  render() {
    const FormItem = Form.Item;
    const {form} = this.props;
    const {getFieldDecorator} = form;
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
    const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">上传</div>
        </div>
      );
      console.log(this.props.queryParams, "5555555555555555555");
    return (
      <Modal
        width="40%"
        title={<div><span>发布事件</span><span style={{width: "20px",
            height: "20px",
            display: "inline-block",
            background: "#000",
            color: "#fff",
            textAlign: "center",
            borderRadius: "50%",
            lineHeight: "20px",
            margin: "0 5px 0 5px"}}>!</span><span>(只有与用户相关的事件，用户体验官才会处理)</span></div>}
        visible={this.props.visible}
        onOk={this.handleOnOk}
        onCancel={() => this.props.EventNewlyAddedModal(false)}>
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="事件类型:"
                    >
                            <span>用户体验官</span>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="问题描述:"
                    >
                    {getFieldDecorator('QuestionRemark', {
                        initialValue: '',
                        rules: [
                                { 
                                    required: true,
                                    message: '请填写问题描述'
                                }
                        ]})(
                            <TextArea style={{height: "100px"}} maxLength="200" />
                    )}
                        <span>{this.props.queryParams.QuestionRemark ? this.props.queryParams.QuestionRemark.value.length : 0}/200</span>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="上传图片:"
                    >
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Upload id="imgs" accept="image/jpeg,image/png"
                                    listType="picture-card"
                                    fileList={this.state.imgs}
                                    beforeUpload={(file) => this.handlePictureUpload(file)}
                                    onPreview = {(file) => this.preview(file.url)}
                                    onRemove={(file) => this.Dle(file)}
                                    name="avatar">
                                {this.state.imgs.length >= 3 ? "" : uploadButton}
                            </Upload>
                        <span>支持上传3个截图，每个大小不得超过2M</span>
                    </div>
                </FormItem>
            </Form>
            <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>this.setState({previewVisible: false})}>
                <img alt="example" style={{ width: '100%' }} src={this.state.previewUrl} />
            </Modal>
      </Modal>
    );
  }
}

// export default Form.create({})(EventNewlyAddedModal);
export default Form.create({
    mapPropsToFields(props) {
      const {
        QuestionRemark
      } = props.queryParams;
  
      return {
        QuestionRemark
      };
    },
    onFieldsChange(props, fields) {
        props.setParams(
            Object.assign({}, props.queryParams, fields)
        );
    }
  })(EventNewlyAddedModal);