import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Dropzone from 'react-dropzone';

import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import { EventDealStatusMap, EventTypeMap } from 'UTIL/constant';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";

import ossConfig from 'CONFIG/ossConfig';

import EventService from 'SERVICE/Management/eventmanagement';
 
const IMG_PATH = ossConfig.getImgPath();

const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

import loding_img from 'IMAGE/loding.gif';

const {
  modifyEventType,
  replyEvent,
  endingEvent
} = EventService;

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
  Select
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;

class EventDetailModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSendMessage: false,
      sendMessages: [],
      uploadImgs: [],
      questionRemark: '',
      previewImagesVisible: false,
      previewImages: [],
      previewImagesIndex: 0,
      eventType: 0,
      pasteImgModalVisible: false,
      imgLoding: false,
      pastedImg: {}
    };
  }

  handleOnCancel = (e) => {
    if (e) {
      e.persist();
      if (e.type === 'keydown' && e.keyCode === 27) {
        return;
      }
    }
    
    this.props.form.resetFields();
    this.setState({
      eventType: 0,
      uploadImgs: [],
      questionRemark: '',
      sendMessages: []
    });
    this.props.onCancel();
  }

  handleEndEvent = () => {
    endingEvent({
      EventID: (this.props.detailInfo.Detail || {}).EventID
    }).then((res) => {
      if (res.Code === 0) {
        message.success('操作成功');
        this.props.onChangeEndStatus(true);
      } else {
        message.error(res.Desc || '操作失败');
      }
    }).catch((err) => {
      message.error(err.Desc || '操作失败');
    });
  }

  handleReply = () => {
    const {
      form
    } = this.props;

    form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        const {
          QuestionRemark
        } = values;

        replyEvent({
          EventID: (this.props.detailInfo.Detail || {}).EventID,
          DealRemark: QuestionRemark
        }).then((res) => {
          if (res.Code === 0) {
            message.success('发送成功');
            this.props.form.setFieldsValue({
              QuestionRemark: ''
            });
            this.setState({
              questionRemark: '',
              sendMessages: this.state.sendMessages.concat({
                type: 'msg',
                Belongs: 2,
                ComplexName: (this.props.detailInfo.Detail || {}).DiplomatName || '',
                CreateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                PictureList: [],
                ReadStatus: 0,
                Remark: QuestionRemark
              })
            }, () => {
              this.props.scrollToBottom(this.messageBox);
            });
            this.props.onChangeEndStatus(false);
          } else {
            message.error(res.Desc || '出错了，请稍后尝试');
          }
        }).catch((err) => {
            message.error(err.Desc || '出错了，请稍后尝试');
        });
      }
    });
  }

  handleUploadChange = ({ file, fileList, e}) => {
    if (fileList.length && fileList[fileList.length - 1].originFileObj) {
      if (!ossConfig.checkImage(file)) return;
      if (!this.uploader) this.uploader = new AliyunOssUploader();

      this.uploader.uploadFile(fileList[fileList.length - 1].originFileObj, (res, error) => {
        if (res) {
          this.setState({
            uploadImgs: this.state.uploadImgs.concat({
              uid: file.uid,
              name: file.name,
              status: 'done',
              customPath: IMG_PATH,
              rawUrl: res.name,
              url: IMG_PATH + res.name
            })
          });

          replyEvent({
            EventID: (this.props.detailInfo.Detail || {}).EventID,
            Pictures: [res.name]
          }).then((resp) => {
            if (resp.Code === 0) {
              message.success('发送成功');
              this.setState({
                sendMessages: this.state.sendMessages.concat({
                  type: 'msg',
                  Belongs: 2,
                  ComplexName: (this.props.detailInfo.Detail || {}).DiplomatName || '',
                  CreateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                  PictureList: [res.name],
                  ReadStatus: 0,
                  Remark: ''
                })
              }, () => {
                this.props.scrollToBottom(this.messageBox);
              });
              this.props.onChangeEndStatus(false);
            } else {
              message.error(resp.Desc || '发送失败，请稍后尝试');
            }
          }).catch((err) => {
              message.error(err.Desc || '发送失败，请稍后尝试');
          });

        } else {
            message.info('图片上传失败');
        }
      }, 'web/event/detail/');
    } else {
      this.setState({
        uploadImgs: fileList
      });
    }
  }

  handleSelectEventType = (value) => {
    this.setState({
      eventType: +value
    });
    if (+value !== 8 && +value !== 0) {
      modifyEventType({
        EventID: (this.props.detailInfo.Detail || {}).EventID,
        EventType: +value
      }).then((res) => {
        if (res.Code === 0) {
          message.success('修改事件分类成功');
        } else {
          message.error(res.Desc || '修改失败');
        }
      }).catch((err) => {
        message.error(err.Desc || '修改失败');
      });
    }
  }

  handleSaveOtherType = (e) => {
    console.log(e.target.value);
    modifyEventType({
      EventID: (this.props.detailInfo.Detail || {}).EventID,
      EventType: 8,
      Other: e.target.value
    }).then((res) => {
      if (res.Code === 0) {
        message.success('修改事件分类成功');
      } else {
        message.error(res.Desc || '修改失败');
      }
    }).catch((err) => {
      message.error(err.Desc || '修改失败');
    });
  }

  handleReplyChange = (e) => {
    this.setState({
      questionRemark: e.target.value
    });
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      
      if (!ossConfig.checkImage(file)) return;
      if (!this.uploader) this.uploader = new AliyunOssUploader();

      this.uploader.uploadFile(file, (res, error) => {
        if (res) {
          this.setState({
            uploadImgs: this.state.uploadImgs.concat({
              uid: file.uid,
              name: file.name,
              status: 'done',
              customPath: IMG_PATH,
              rawUrl: res.name,
              url: IMG_PATH + res.name
            })
          });

          replyEvent({
            EventID: (this.props.detailInfo.Detail || {}).EventID,
            Pictures: [res.name]
          }).then((resp) => {
            if (resp.Code === 0) {
              message.success('发送成功');
              this.setState({
                sendMessages: this.state.sendMessages.concat({
                  type: 'msg',
                  Belongs: 2,
                  ComplexName: (this.props.detailInfo.Detail || {}).DiplomatName || '',
                  CreateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                  PictureList: [res.name],
                  ReadStatus: 0,
                  Remark: ''
                })
              }, () => {
                this.props.scrollToBottom(this.messageBox);
              });
              this.props.onChangeEndStatus(false);
            } else {
              message.error(resp.Desc || '发送失败，请稍后尝试');
            }
          }).catch((err) => {
              message.error(err.Desc || '发送失败，请稍后尝试');
          });

        } else {
            message.info('图片上传失败');
        }
      }, 'web/event/detail/');
    }
    
  }

  handlePreivewImages = (History, sendMessages, currentPic) => {
    const allImgs = History.reduce((wrap, cur) => wrap.concat(...cur.PictureList), []).concat(sendMessages.reduce((container, item) => container.concat(...item.PictureList), []));

    this.setState({
      previewImagesVisible: true,
      previewImagesIndex: allImgs.indexOf(currentPic) === -1 ? 0 : allImgs.indexOf(currentPic),
      previewImages: allImgs.map(pic => {
          return {
              src: pic.indexOf('http') !== -1 ? pic : IMG_PATH + pic
          };
      })
    });
  }

  handlePaste = (e) => {
    e.persist();
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          this.setState({
            pasteImgModalVisible: true,
            imgLoding: true
          });

          if (!this.uploader) this.uploader = new AliyunOssUploader();
          this.uploader.uploadFile(blob, (res, error) => {
            if (res) {
              this.setState({
                pastedImg: {
                  rawUrl: res.name,
                  url: IMG_PATH + res.name
                },
                imgLoding: false
              });
            } else {
                message.info('图片上传失败');
            }
          }, 'web/event/paste/');
          e.preventDefault();
        }
      }
    }
  }

  handleCancelSendImg = () => {
    this.setState({
      pasteImgModalVisible: false,
      pastedImg: {},
      imgLoding: false
    });
  }

  handleSendImg = () => {
    replyEvent({
      EventID: (this.props.detailInfo.Detail || {}).EventID,
      Pictures: [this.state.pastedImg.rawUrl]
    }).then((resp) => {
      if (resp.Code === 0) {
        message.success('发送成功');
        this.setState({
          pasteImgModalVisible: false,
          pastedImg: {},
          imgLoding: false,
          sendMessages: this.state.sendMessages.concat({
            type: 'msg',
            Belongs: 2,
            ComplexName: (this.props.detailInfo.Detail || {}).DiplomatName || '',
            CreateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            PictureList: [this.state.pastedImg.rawUrl],
            ReadStatus: 0,
            Remark: ''
          })
        }, () => {
          this.props.scrollToBottom(this.messageBox);
        });
        this.props.onChangeEndStatus(false);
      } else {
        message.error(resp.Desc || '发送失败，请稍后尝试');
      }
    }).catch((err) => {
        message.error(err.Desc || '发送失败，请稍后尝试');
    });
  }
  
  render() {
    const {
      form: {
        getFieldDecorator
      },
      isEndEvent,
      rowRecord,
      detailInfo: {
        Detail = {},
        History = []
      },
      visible
    } = this.props;

    const {
      uploadImgs,
      sendMessages,
      previewImagesIndex,
      eventType,
      questionRemark,
      pasteImgModalVisible,
      imgLoding,
      pastedImg
    } = this.state;
    

    return (
      <Modal
        width="60%"
        title="详情"
        visible={visible}
        footer={null}
        maskClosable={false}
        onCancel={this.handleOnCancel}
      >
        <div className="event-detail-box">
          <div className="event-detail__hd">
            <div>
              <div className="flex flex--between">
                <div className="flex">
                  <label>会员：</label>
                  <div>{`${Detail.UserName}${Detail.Mobile == '' ? '' : `-${Detail.Mobile}`}`}</div>
                </div>
                <div className="flex">
                  <label>企业：</label>
                  <div>{Detail.RecruitName}</div>
                </div>
                <div className="flex">
                  <label>面试时间：</label>
                  <div>{Detail.InterviewDate}</div>
                </div>
                <div className="flex">
                  <label>劳务：</label>
                  <div>{Detail.LaborName}</div>
                </div>
                <div className="flex">
                  <label>当前状态：</label>
                  <div>{(EventDealStatusMap[Detail.DealStatus] || '')}</div>
                </div>
                <div className="flex">
                  <label>发布人：</label>
                  <div>{Detail.BrokerName}</div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex">
                  <label>问题描述：</label>
                  <div className="flex__item" style={{wordBreak: 'break-all'}}>{Detail.QuestionRemark}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="event-detail__bd mt-10" ref={(node) => {
            this.messageBox = node;
            this.props.setRef(node);
          }}>

            <Dropzone
              onDrop={this.onDrop}
              accept={['image/jpeg', 'image/png']}
              disableClick={true}
              disablePreview={true}
              disabled={Detail.DealStatus === 4 || Detail.DealStatus === 5}
              style={{
                position: 'relative'
              }}
            >
              <div className="messages">

                <ul className="msg-list">
                  {History.filter(item => !(!(item.PictureList || []).length && item.Remark === '')).map((item, index) => (
                    <li className={classnames('msg-item', {
                      'you': item.Belongs !== 2,
                      'me': item.Belongs === 2
                    })} key={index}>
                      {item.CreateTime.slice(0, -3) !== ((History[index - 1] || {}).CreateTime || '').slice(0, -3) ? (
                        <div className="time-wrap">
                          <span className="time">{item.CreateTime.slice(0, -3)}</span>
                        </div>
                      ) : ''}
                      {(item.PictureList || []).map((pic, i) => (
                        <div className="msg-item__bd" key={i}>
                          <div className="avt">{item.ComplexName.substring(0, 1)}</div>
                          <div className="bubble">
                            <p className="msg-cont"><img src={pic.indexOf('http') !== -1 ? pic : IMG_PATH + pic} width="80" height="80" onClick={() => this.handlePreivewImages(History, sendMessages, pic)} /></p>
                          </div>
                        </div>
                      ))}
                      {item.Remark ? (
                        <div className="msg-item__bd">
                          <div className="avt">{item.ComplexName.substring(0, 1)}</div>
                          <div className="bubble">
                            <p className="msg-cont">{item.Remark}</p>
                          </div>
                        </div>
                      ) : ''}
                    </li>
                  ))}
                  {sendMessages.map((item, i) => (
                    item.type === 'action' ? (
                      <li className="msg-item me" key={i}>
                        <div className="time-wrap">
                          <span className="time">{item.Reamrk}</span>
                        </div>
                      </li>
                    ) : (
                      <li className="msg-item me" key={i}>
                        {item.CreateTime.slice(0, -3) !== ((sendMessages[i - 1] || {}).CreateTime || '').slice(0, -3) ? (
                          <div className="time-wrap">
                            <span className="time">{item.CreateTime.slice(0, -3)}</span>
                          </div>
                        ) : ''}
                        {(item.PictureList || []).map((pic, i) => (
                          <div className="msg-item__bd" key={i}>
                            <div className="avt">{item.ComplexName.substring(0, 1)}</div>
                            <div className="bubble">
                              <p className="msg-cont"><img src={pic.indexOf('http') !== -1 ? pic : IMG_PATH + pic} width="80" height="80" onClick={() => this.handlePreivewImages(History, sendMessages, pic)} /></p>
                            </div>
                          </div>
                        ))}
                        {item.Remark ? (
                          <div className="msg-item__bd">
                            <div className="avt">{item.ComplexName.substring(0, 1)}</div>
                            <div className="bubble">
                              <p className="msg-cont">{item.Remark}</p>
                            </div>
                          </div>
                        ) : ''}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </Dropzone>
            
          </div>

          <div className="event-detail__ft">
            <div className="event-action-area">
              <div className="event-action-area__hd flex flex--y-center">
                <div className="flex flex__item flex--y-center">
                  {/* <div className="flex flex--y-center">
                    <FormItem label="事件分类" className="flexible-form-item form-item__zeromb">
                      {getFieldDecorator('EventType', {
                        initialValue: `${Detail.EventType === 0 ? '' : Detail.EventType}`,
                        rules: [
                          {
                            required: true,
                            message: '请填写事件分类！'
                          }
                        ]
                      })(
                        <Select
                          placeholder="请选择"
                          size="default"
                          onChange={this.handleSelectEventType}
                          style={{width: 100}}
                        >
                          {
                            Object.keys(EventTypeMap).filter(k => +k !== 8).map((key) => {
                              return (
                                <Option key={key} value={key}>{EventTypeMap[key]}</Option>
                              );
                            })
                          }
                          <Option key={8} value="8">其他</Option>
                        </Select>
                      )}
                    </FormItem>
                    {(eventType !== 0 ? eventType : Detail.EventType) === 8 ? (
                      <FormItem className="flexible-form-item form-item__zeromb" style={{marginLeft: 10}}>
                        {getFieldDecorator('Other', {
                          initialValue: Detail.OtherRemark
                        })(
                          <Input size="default" maxLength="15" onBlur={this.handleSaveOtherType} placeholder="请填写" />
                        )}
                      </FormItem>
                    ) : ''}
                  </div> */}
                  <div className="ml-20">
                    <Upload
                      accept="image/jpeg,image/png"
                      name="avatar"
                      showUploadList={false}
                      fileList={uploadImgs}
                      onChange={this.handleUploadChange}
                      disabled={Detail.DealStatus === 4 || Detail.DealStatus === 5}
                    >
                      <a className={classnames('action-btn', {
                        disabled: Detail.DealStatus === 4 || Detail.DealStatus === 5
                      })}>上传图片</a>
                    </Upload>
                  </div>
                </div>
                <div>
                  <a className={classnames('action-btn', {
                    disabled: Detail.DealStatus === 4 || Detail.DealStatus === 5 || isEndEvent || Detail.Department === 5 || Detail.Department === 4 || Detail.Department === 2 || Detail.Department === 1
                  })} onClick={this.handleEndEvent}>处理完毕</a>
                </div>
              </div>
              <div className="event-action-area__bd">
               <div style={{
                  padding: '0 20px'
                }}>
                  <Form>
                    <Row>
                      <Col span={24}>
                        <FormItem>
                          <div style={{
                            textAlign: 'right'
                          }}>
                            {getFieldDecorator('QuestionRemark', {
                              rules: [
                                {
                                  required: true,
                                  message: '回复内容不能为空'
                                },
                                {
                                  validator: function (rule, value, cb) {
                                    if (!!value && value.length > 400) {
                                        cb('回复内容不能多于400个字');
                                    }
                                    cb();
                                  }
                                }
                              ]
                            })(
                              <Input.TextArea
                                disabled={Detail.DealStatus === 4 || Detail.DealStatus === 5}
                                autosize={{minRows: 4, maxRows: 8}}
                                style={{resize: 'none'}}
                                maxLength="400"
                                placeholder="请输入"
                                onChange={this.handleReplyChange}
                                onPressEnter={this.handleReply}
                                onPaste={this.handlePaste}
                              />
                            )}
                            <span>{questionRemark.length}/400</span>
                          </div>
                        </FormItem>
                      </Col>
                      <Col span={24} style={{textAlign: 'right'}}>
                        <Button type="primary" disabled={Detail.DealStatus === 4 || Detail.DealStatus === 5} onClick={this.handleReply}>发送</Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            </div>
          </div>

          <Viewer
            visible={this.state.previewImagesVisible}
            activeIndex={previewImagesIndex}
            drag={false}
            zoomable={true}
            rotatable={true}
            scalable={false}
            noImgDetails={true}
            attribute={false}
            noNavbar={true}
            onClose={() => { this.setState({ previewImagesVisible: false }); } }
            images={this.state.previewImages}
          />

          <Modal
            visible={pasteImgModalVisible}
            width={450}
            title="发送图片"
            onCancel={this.handleCancelSendImg}
            onOk={this.handleSendImg}
          >
            <div style={{ height: 300}}>
              {imgLoding ? (
                <img className="img-fluid" style={{ margin: '0 auto'}} src={loding_img} />
              ) : (
                <img className="img-fluid" style={{ maxHeight: '100%', margin: '0 auto' }} src={pastedImg.url} />
              )}
            </div>
          </Modal>
        </div>
      </Modal>
    );
  }
}

export default Form.create({})(EventDetailModal);
