import React from 'react';
import classnames from 'classnames';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';

import { CONFIG } from 'mams-com';
const { AppSessionStorage } = CONFIG;

import ossConfig from 'CONFIG/ossConfig'; 
const IMG_PATH = ossConfig.getImgPath();

import CooperationService from 'SERVICE/Business/Cooperation/index';

const {
  updateCooperationInfo
} = CooperationService;

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

class CooperationDetailModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      replyremark: '',
      audioUrl: '',
      videoUrl: '',
      previewImagesVisible: false,
      previewImages: [],
      previewImagesIndex: 0,
      isPlayingAudio: false,
      previewVideoVisible: false
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
      replyremark: ''
    });
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
          ReplyRemark
        } = values;

        updateCooperationInfo({
          FeedBackID: (this.props.rowRecord || {}).FeedBackID || 0,
          ReplyRemark: ReplyRemark || ''
        }).then((res) => {
          if (res.Code === 0) {
            message.success("操作成功");
            this.props.form.resetFields();
            this.setState({
              replyremark: ''
            });
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

  handleTextAreaChange = (e) => {
    this.setState({
      replyremark: e.target.value
    });
  }

  handlePlayAudio = (audioUrl) => {
    this.stopPlayAudio();
    if (!this.state.isPlayingAudio) {
      this.playAudio(audioUrl);
    }
  }

  playAudio = (src) => {
    this.setState({
      audioUrl: src,
      isPlayingAudio: true
    }, () => {
      this.audioPlayer.play();
    });
  }

  stopPlayAudio = () => {
    if (this.state.isPlayingAudio) {
      this.pauseAudio();
    }
  }

  pauseAudio = () => {
    this.setState({
      isPlayingAudio: false
    }, () => {
      this.audioPlayer.pause();
    });
  }

  handlePreivewImages = (dataList, currentPic) => {
    // const allImgs = dataList.reduce((wrap, cur) => wrap.concat(...cur.PictureList), []);
    const allImgs = dataList || [];

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

  handlePlayVideo = (videoUrl) => {
    this.setState({
      videoUrl: videoUrl,
      previewVideoVisible: true
    }, () => {
      this.videoPlayer.play();
    });
  }

  handleHideVideo = () => {
    this.videoPlayer.pause();
    this.setState({
      previewVideoVisible: false
    }, () => {
      this.setState({
        videoUrl: ''
      });
    });
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldsValue
      },
      detailInfo,
      rowRecord,
      visible
    } = this.props;

    const {
      replyremark,
      audioUrl,
      videoUrl
    } = this.state;
    
    return (
      <Modal
        title="详情"
        visible={visible}
        onCancel={this.handleOnCancel}
        onOk={this.handleOnOk}
      >
        <Form>
          <Row>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="会员姓名">
                <div>{detailInfo.NickName || ''}</div>
              </FormItem>
            </Col>
            
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="手机号码">
                <div>{detailInfo.Mobile || ''}</div>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="接收时间">
                <div>{detailInfo.CreateTime || ''}</div>
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="回访时间">
                <div>{detailInfo.ReplyStatus === 0 ? '' : detailInfo.ReplyTime}</div>
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="内容描述">
                <div>
                  <div>{detailInfo.Text || ''}</div>
                  {(detailInfo.AudioList || []).length ? (
                    <div className="mt-8 flex flex--wrap">
                      {(detailInfo.AudioList || []).map((ao, i) => (
                        <div className="voice-item flex mt-8" key={i}>
                          <a className="bubble voice" onClick={() => this.handlePlayAudio(IMG_PATH + ao.AudioUrl)}>
                            <i className={classnames('icon-voice__wx', {
                              'icon-voice__wx__playing': this.state.isPlayingAudio && this.state.audioUrl.indexOf(ao.AudioUrl) !== -1
                            })}></i>
                          </a>
                        <div className="voice-duration">{`${ao.AudioTime.length > 2 && /^\d+$/.test(ao.AudioTime) ? Math.floor(+ao.AudioTime / 1000) : ao.AudioTime}`}</div>
                        </div>
                      ))}

                    </div>
                  ) : ''}

                  {(detailInfo.VedioList || []).length ? (
                    <div className="mt-8 flex flex-wrap">
                      {(detailInfo.VedioList || []).map((vo, i) => (
                        <div className="video-item">
                          <div className="bubble video">
                            <video width="140" height="100" data-w="140" data-h="100" preload="auto" src={IMG_PATH + vo.VedioUrl}>
                            </video>
                            <div className="video-play-button flex flex--center" onClick={() => this.handlePlayVideo(IMG_PATH + vo.VedioUrl)}>
                              <img src="//public-10000230.image.myqcloud.com/80e1088d-8535-4256-aa39-2db44519c30d" width="30" style={{zIndex: 1}} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : ''}
                  
                  {(detailInfo.PictureList || []).length ? (
                    <div className="mt-8">
                      {(detailInfo.PictureList || []).map((pic, i) => (
                        <img className="ml-8" src={pic.indexOf('http') !== -1 ? pic : IMG_PATH + pic} onClick={() => this.handlePreivewImages(detailInfo.PictureList || [], pic)} width="80" height="80" />
                      ))}
                    </div>
                  ) : ''}
                  
                </div>
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label="回访记录" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <div>
                  {getFieldDecorator('ReplyRemark', {
                    initialValue: detailInfo.ReplyRemark || '',
                    rules: [
                      {
                        validator: function (rule, value, cb) {
                          if (!!value && value.length > 200) {
                              cb('解决方案不能多于200个字');
                          }
                          cb();
                        }
                      }
                    ]
                  })(
                    <Input.TextArea
                      autosize={{minRows: 3, maxRows: 6}}
                      style={{resize: 'none'}}
                      maxLength="200"
                      placeholder="请输入"
                      onChange={this.handleTextAreaChange}
                    />
                  )}
                  <span>{replyremark.length}/200</span>
                </div>
              </FormItem>
            </Col>

            <audio ref={(node) => (this.audioPlayer = node)} src={audioUrl} onEnded={this.stopPlayAudio}></audio>

            <Viewer
              visible={this.state.previewImagesVisible}
              activeIndex={this.state.previewImagesIndex}
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
              visible={this.state.previewVideoVisible}
              width="800px"
              footer={null}
              className="video-preview-modal"
              wrapClassName="vertical-center-modal"
              onCancel={this.handleHideVideo}
              closable={false}
              bodyStyle={{
                padding: 0,
                height: 600
              }}
            >
            <span style={{
              position: "absolute",
              right: "1%",
              top: "0",
              color: "#fff",
              zIndex: "9999",
              cursor: "pointer",
              fontSize: "20px"}} onClick={this.handleHideVideo}>X</span>
              <div style={{backgroundColor: '#000'}}>
                <video ref={(node) => (this.videoPlayer = node)} loop={true} autoPlay={true} controls preload="auto" src={videoUrl} style={{backgroundColor: '#000', width: 800, height: 600}}></video>
              </div>
          </Modal>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({})(CooperationDetailModal);
