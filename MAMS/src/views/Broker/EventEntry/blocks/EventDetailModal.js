import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Dropzone from 'react-dropzone';

import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';

import { EventDealStatusMap } from 'UTIL/constant/constant';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import ossConfig from 'CONFIG/ossConfig';

import EventService from 'SERVICE/Broker/EventService';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

const IMG_PATH = ossConfig.getImgPath();

const brokerId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginId');

import loding_img from 'IMAGE/loding.gif';


const {
  getManagerName,
  applyUpManager,
  applyJudge,
  replyEvent,
  ratingEvent,
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
      isFindSuperior: false,
      isEndEvent: false,
      isApplyJudge: false,
      ratedEvent: false,
      ratingType: 0,
      sendMessages: [],
      uploadImgs: [],
      previewImagesVisible: false,
      previewImages: [],
      previewImagesIndex: 0,
      questionRemark: '',
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
      isFindSuperior: false,
      isEndEvent: false,
      isApplyJudge: false,
      ratedEvent: false,
      questionRemark: '',
      ratingType: 0,
      uploadImgs: [],
      sendMessages: []
    });
    this.props.onCancel();
  }

  handleFindSuperior = () => {
    Modal.confirm({
      title: '提示',
      content: `小姐姐，找主管后，${this.props.detailInfo.Detail.DiplomatName}会被扣分，确定这样做吗？`,
      onOk: () => {
        applyUpManager({
          EventID: (this.props.detailInfo.Detail || {}).EventID
        }).then((resp) => {
          if (resp.Code === 0) {
            message.success('操作成功');
            this.setState({
              isFindSuperior: true,
              sendMessages: this.state.sendMessages.concat({
                type: 'action',
                Remark: '找主管！'
              })
            }, () => {
              this.props.scrollToBottom(this.messageBox);
            });
          } else {
            message.error(resp.Desc || '操作失败');
          }
        }).catch((err) => {
          message.error(err.Desc || '操作失败');
        });
      }
    });
  }

  handleFindJudge = () => {
    Modal.confirm({
      title: '提示',
      content: '提交用户体验官后，【用户体验官】会对双方进行评分，确定这样做吗？',
      onOk: () => {
        applyJudge({
          EventID: (this.props.detailInfo.Detail || {}).EventID
        }).then((resp) => {
          if (resp.Code === 0) {
            message.success('操作成功');
            this.setState({
              isApplyJudge: true,
              sendMessages: this.state.sendMessages.concat({
                type: 'action',
                Remark: '提交用户体验官！'
              })
            }, () => {
              this.props.scrollToBottom(this.messageBox);
            });
          } else {
            message.error(resp.Desc || '操作失败');
          }
        }).catch((err) => {
          message.error(err.Desc || '操作失败');
        });
      }
    });
  }

  handleEndEvent = () => {
    Modal.confirm({
      title: '提示',
      content: '小姐姐，结案后，表示你的问题解决了，这个问题就不能再发送信息了呦~',
      okText: '知道了',
      onOk: () => {
        endingEvent({
          BrokerID: brokerId,
          BrokerName: (this.props.detailInfo.Detail || {}).BrokerName || '',
          EventID: (this.props.detailInfo.Detail || {}).EventID
        }).then((res) => {
          if (res.Code === 0) {
            message.success('操作成功');
            this.setState({
              isEndEvent: true,
              sendMessages: this.state.sendMessages.concat({
                type: 'action',
                Remark: '结案！'
              })
            }, () => {
              this.props.scrollToBottom(this.messageBox);
            });
          } else {
            message.error(res.Desc || '操作失败');
          }
        }).catch((err) => {
          message.error(err.Desc || '操作失败');
        });
      }
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

        const {
          detailInfo: {
            Detail = {}
          }
        } = this.props;

        replyEvent({
          BrokerID: brokerId,
          BrokerName: Detail.BrokerName || '',
          EventID: Detail.EventID,
          Remark: QuestionRemark
        }).then((res) => {
          if (res.Code === 0) {
            message.success('发送成功');
            this.props.form.resetFields();
            this.setState({
              questionRemark: '',
              sendMessages: this.state.sendMessages.concat({
                type: 'msg',
                Belongs: 1,
                ComplexName: Detail.BrokerName || '',
                CreateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                PictureList: [],
                ReadStatus: 0,
                Remark: QuestionRemark
              })
            }, () => {
              this.props.scrollToBottom(this.messageBox);
            });
          } else {
            message.error(res.Desc || '出错了，请稍后尝试');
          }
        }).catch((err) => {
            message.error(err.Desc || '出错了，请稍后尝试');
        });
      }
    });
  }

  handleRating = (satisfaction) => {
    ratingEvent({
      EventID: (this.props.detailInfo.Detail || {}).EventID,
      Satisfaction: +satisfaction
    }).then((res) => {
      if (res.Code === 0) {
        this.setState({
          ratedEvent: true,
          ratingType: +satisfaction
        });
        message.success('评价成功');
        this.handleOnCancel();
        this.props.onOk();
      } else {
        message.error(res.Desc || '出错了，请稍后尝试');
      }
    }).catch((err) => {
        message.error(err.Desc || '出错了，请稍后尝试');
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

          const {
            detailInfo: {
              Detail = {}
            }
          } = this.props;

          replyEvent({
            BrokerID: brokerId,
            BrokerName: Detail.BrokerName || '',
            EventID: Detail.EventID,
            Pictures: [res.name]
          }).then((resp) => {
            if (resp.Code === 0) {
              message.success('发送成功');
              this.setState({
                sendMessages: this.state.sendMessages.concat({
                  type: 'msg',
                  Belongs: 1,
                  ComplexName: Detail.BrokerName || '',
                  CreateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                  PictureList: [res.name],
                  ReadStatus: 0,
                  Remark: ''
                })
              }, () => {
                this.props.scrollToBottom(this.messageBox);
              });
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

          const {
            detailInfo: {
              Detail = {}
            }
          } = this.props;
          replyEvent({
            BrokerID: brokerId,
            BrokerName: Detail.BrokerName || '',
            EventID: Detail.EventID,
            Pictures: [res.name]
          }).then((resp) => {
            if (resp.Code === 0) {
              message.success('发送成功');
              this.setState({
                sendMessages: this.state.sendMessages.concat({
                  type: 'msg',
                  Belongs: 1,
                  ComplexName: Detail.BrokerName || '',
                  CreateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                  PictureList: [res.name],
                  ReadStatus: 0,
                  Remark: ''
                })
              }, () => {
                this.props.scrollToBottom(this.messageBox);
              });
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

  handleReplyChange = (e) => {
    this.setState({
      questionRemark: e.target.value
    });
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
      BrokerID: brokerId,
      BrokerName: (this.props.detailInfo.Detail || {}).BrokerName || '',
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
            Belongs: 1,
            ComplexName: (this.props.detailInfo.Detail || {}).BrokerName || '',
            CreateTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            PictureList: [this.state.pastedImg.rawUrl],
            ReadStatus: 0,
            Remark: ''
          })
        }, () => {
          this.props.scrollToBottom(this.messageBox);
        });
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
        getFieldDecorator,
        getFieldsValue
      },
      rowRecord,
      detailInfo: {
        Detail = {},
        History = []
      },
      visible
    } = this.props;

    const {
      isFindSuperior,
      isEndEvent,
      isApplyJudge,
      ratingType,
      ratedEvent,
      uploadImgs,
      sendMessages,
      previewImagesIndex,
      questionRemark,
      pasteImgModalVisible,
      imgLoding,
      pastedImg
    } = this.state;

    const hasProcessor = History.some(item => item.Belongs === 2);
    
    const actionBelongsIndex = History.findIndex(item => item.Belongs === 3);
    

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
                  <label>当前状态：</label>
                  <div>{Detail.DealStatus === 2 || Detail.DealStatus === 3 ? '处理中' : (EventDealStatusMap[Detail.DealStatus] || '')}</div>
                </div>
                <div className="flex">
                  <label>处理人：</label>
                  <div>{Detail.DiplomatName}</div>
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
              disabled={Detail.DealStatus === 4 || Detail.DealStatus === 5 || isEndEvent || isApplyJudge || Detail.UpEventTimes >= 2}
              style={{
                position: 'relative'
              }}
            >
              <div className="messages">

                <ul className="msg-list">
                  {History.filter(item => !(!(item.PictureList || []).length && item.Remark === '')).map((item, index) => (
                    item.Belongs === 3 ? (
                      <li className="msg-item me" key={index}>
                        <div className="time-wrap">
                          <span className="time">{item.Remark}</span>
                        </div>
                      </li>
                    ) : (
                      <li className={classnames('msg-item', {
                        'you': item.Belongs !== 1,
                        'me': item.Belongs === 1
                      })} key={index}>
                        {item.CreateTime.slice(0, -3) !== ((History[index - 1] || {}).CreateTime || '').slice(0, -3) ? (
                          <div className="time-wrap">
                            <span className="time">{item.CreateTime.slice(0, -3)}</span>
                          </div>
                        ) : ''}
                        {(item.PictureList || []).map((pic, i) => (
                          <div className="msg-item__bd" key={i}>
                            <div className="flex flex--column flex--y-center">
                              <div style={{fontSize: 12}}>{item.ComplexName}</div>
                              <div className="avt">{item.ComplexName.substring(0, 1)}</div>
                            </div>
                            <div className="bubble">
                              <p className="msg-cont"><img src={pic.indexOf('http') !== -1 ? pic : IMG_PATH + pic} width="80" height="80" onClick={() => this.handlePreivewImages(History, sendMessages, pic)} /></p>
                            </div>
                            <span className="status">
                              <span>{item.Belongs === 1 ? (item.ReadStatus === 0 ? '未读' : '已读') : ''}</span>
                              <span>{item.Belongs === 2 ? (item.ReturnFlag === 1 ? '已退回' : '') : ''}</span>
                            </span>
                          </div>
                        ))}
                        {item.Remark ? (
                          <div className="msg-item__bd">
                            <div className="flex flex--column flex--y-center">
                              <div style={{fontSize: 12}}>{item.ComplexName}</div>
                              <div className="avt">{item.ComplexName.substring(0, 1)}</div>
                            </div>
                            <div className="bubble">
                              <p className="msg-cont">{item.Remark}</p>
                            </div>
                            <span className="status">
                              <span>{item.Belongs === 1 ? (item.ReadStatus === 0 ? '未读' : '已读') : ''}</span>
                              <span>{item.Belongs === 2 ? (item.ReturnFlag === 1 ? '已退回' : '') : ''}</span>
                            </span>
                          </div>
                        ) : ''}
                      </li>
                    )
                  ))}
                  {sendMessages.map((item, i) => (
                    item.type === 'action' ? (
                      <li className="msg-item me" key={i}>
                        <div className="time-wrap">
                          <span className="time">{item.Remark}</span>
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
                            <div className="flex flex--column flex--y-center">
                              <div style={{fontSize: 12}}>{item.ComplexName}</div>
                              <div className="avt">{item.ComplexName.substring(0, 1)}</div>
                            </div>
                            <div className="bubble">
                              <p className="msg-cont"><img src={pic.indexOf('http') !== -1 ? pic : IMG_PATH + pic} width="80" height="80" onClick={() => this.handlePreivewImages(History, sendMessages, pic)} /></p>
                            </div>
                            <span className="status">
                              <span>{item.Belongs === 1 ? (item.ReadStatus === 0 ? '未读' : '已读') : ''}</span>
                              <span>{item.Belongs === 2 ? (item.ReturnFlag === 1 ? '已退回' : '') : ''}</span>
                            </span>
                          </div>
                        ))}
                        {item.Remark ? (
                          <div className="msg-item__bd">
                            <div className="flex flex--column flex--y-center">
                              <div style={{fontSize: 12}}>{item.ComplexName}</div>
                              <div className="avt">{item.ComplexName.substring(0, 1)}</div>
                            </div>
                            <div className="bubble">
                              <p className="msg-cont">{item.Remark}</p>
                            </div>
                            <span className="status">
                              <span>{item.Belongs === 1 ? (item.ReadStatus === 0 ? '未读' : '已读') : ''}</span>
                              <span>{item.Belongs === 2 ? (item.ReturnFlag === 1 ? '已退回' : '') : ''}</span>
                            </span>
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
              <div className="event-action-area__hd flex">
                <div className="flex flex__item ">
                  <div>
                    <Upload
                      accept="image/jpeg,image/png"
                      name="avatar"
                      showUploadList={false}
                      fileList={uploadImgs}
                      onChange={this.handleUploadChange}
                      disabled={Detail.DealStatus === 4 || Detail.DealStatus === 5 || Detail.UpEventTimes >= 2 || isEndEvent || isApplyJudge}
                    >
                      <a className={classnames('action-btn', {
                        disabled: Detail.DealStatus === 4 || Detail.DealStatus === 5 || Detail.UpEventTimes >= 2 || isEndEvent || isApplyJudge
                      })}>上传图片</a>
                    </Upload>
                  </div>
                  <a className={classnames('action-btn ml-20', {
                    disabled: Detail.DealStatus === 4 || Detail.DealStatus === 5 || Detail.UpEventTimes >= 2 || !hasProcessor || Detail.UpEventTimes >= 1 || isFindSuperior || isEndEvent || isApplyJudge
                  })} onClick={this.handleFindSuperior}>找主管</a>
                  <a className={classnames('action-btn ml-20', {
                    disabled: Detail.DealStatus === 4 || Detail.DealStatus === 5 || Detail.UpEventTimes >= 2 || isEndEvent || isApplyJudge
                  })} onClick={this.handleEndEvent}>{isEndEvent ? '已结案' : '结案'}</a>
                </div>
                <div>
                  <a className={classnames('action-btn', {
                    disabled: Detail.DealStatus === 4 || Detail.DealStatus === 5 || Detail.UpEventTimes >= 2 || !hasProcessor || Detail.UpEventTimes >= 2 || isEndEvent || isApplyJudge || isFindSuperior || (actionBelongsIndex !== -1 && History.slice(actionBelongsIndex).every(item => item.Belongs !== 2))
                  })} onClick={this.handleFindJudge}>提交用户体验官</a>
                </div>
              </div>
              <div className="event-action-area__bd">
                
                {Detail.DealStatus === 4 || Detail.DealStatus === 5 || isEndEvent ? (
                  Detail.DealStatus === 5 ? (
                    <div style={{padding: '20px 0'}}>
                      <div style={{textAlign: 'center'}} className="mt-14">姐姐们，辛苦啦~</div>
                    </div>
                  ) : (
                    <div style={{padding: '20px 0'}}>
                      <div className="flex flex--around">
                        <Button disabled={Detail.Satisfaction !== 0 || ratedEvent} className={classnames({
                          active: Detail.Satisfaction === 1 || ratingType === 1
                        })} onClick={() => this.handleRating(1)}>点赞</Button>
                        <Button disabled={Detail.Satisfaction !== 0 || ratedEvent} className={classnames({
                          active: Detail.Satisfaction === 3 || ratingType === 3
                        })} onClick={() => this.handleRating(3)}>一般</Button>
                        <Button disabled={Detail.Satisfaction !== 0 || ratedEvent} className={classnames({
                          active: Detail.Satisfaction === 2 || ratingType === 2
                        })} onClick={() => this.handleRating(2)}>差评</Button>
                      </div>
                      <div style={{textAlign: 'center'}} className="mt-14">
                        {Detail.Satisfaction !== 0 ? `姐姐们，辛苦啦，感谢你对${Detail.DiplomatName}的评价~` : `姐姐们，动动小手，给${Detail.DiplomatName}一个评价呗~`}
                      </div>
                    </div>
                  )
                ) : (
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
                                  disabled={Detail.UpEventTimes >= 2 || isApplyJudge}
                                  autosize={{minRows: 4, maxRows: 8}}
                                  style={{resize: 'none'}}
                                  maxLength="400"
                                  placeholder="请输入"
                                  onChange={this.handleReplyChange}
                                  onPaste={this.handlePaste}
                                  onPressEnter={this.handleReply}
                                />
                              )}
                              <span>{questionRemark.length}/400</span>
                            </div>
                          </FormItem>
                        </Col>
                        <Col span={24} style={{textAlign: 'right'}}>
                          <Button type="primary" disabled={Detail.UpEventTimes >= 2 || isApplyJudge} onClick={this.handleReply}>发送</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                )}
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
