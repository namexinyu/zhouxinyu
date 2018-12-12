import React from 'react';
import {Card, Row, Col, Button, Table, Form, Input, Icon, DatePicker, Radio, Modal, Select, message, Upload} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import {browserHistory} from 'react-router';
import eventdetail from "ACTION/Common/Management/eventdetail";
import eventalter from "ACTION/Common/Management/eventgetReplyEvent";
import doTabPage from 'ACTION/TabPage/doTabPage';
import "LESS/pages/eventdetail.less";
import ossConfig from 'CONFIG/ossConfig';
import uploadRule from 'CONFIG/uploadRule';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import { EventTypeMap, EventDealStatusMap } from "UTIL/constant";

import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
const IMG_PATH = ossConfig.getImgPath();

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const RadioGroup = Radio.Group;


const EventNatureMap = {
    1: '用户体验',
    2: '经纪人利益',
    3: '其他'
};

 class Eventdetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_mams_eventdetail';
        this.state = {
            previewImagesVisible: false,
            previewImages: [],
            screenShotImgs: [],
            previewVisible: false,
            previewUrl: '',
            k: true,
            visible: false,
            nek: false,
            flak: false,
            flak1: false,
            flak2: false,
            flak3: false,
            flak4: false,
            good: false,
            columns: [{
                title: '处理时间',
                dataIndex: 'CreateTime',
                width: '150px',
                render: (text, record) => text
              }, {
                title: '处理人',
                dataIndex: 'ComplexName',
                width: '80px'
              }, {
                title: '状态',
                dataIndex: 'DealStatus',
                width: '80px',
                render: (text, record) => {
                    return EventDealStatusMap[record.DealStatus || ''];
                }
              }, {
                title: '备注',
                dataIndex: 'Remark',
                render: (text, record) => {
                    return (
                        <div>
                            <span>{record.Remark}</span>
                            <div>
                                {(record.PictureList || []).map((item, i) => (
                                    <Icon style={{
                                        fontSize: "22px",
                                        cursor: 'pointer',
                                        color: "#3399e7"
                                    }} className="ml-8" type="picture" key={i} onClick={() => this.handlePreivewImages((record.PictureList || []), i)} />
                                ))}
                            </div>
                        </div>
                    );
                }
              }]
        };
    }

    handlePreivewImages = (imgs, i) => {
        const copyImgs = [...imgs];
        const removedImg = copyImgs.splice(i, 1);
        
        this.setState({
            previewImagesVisible: true,
            previewImages: removedImg.concat(copyImgs).map(pic => {
                return {
                    src: pic.indexOf('http') !== -1 ? pic : IMG_PATH + pic
                };
            })
        });
    }

    handleUploadChange = ({ file, fileList, e}) => {

        if (fileList.length && fileList[fileList.length - 1].originFileObj) {
            if (!ossConfig.checkImage(file)) return;
            if (!this.uploader) this.uploader = new AliyunOssUploader();

            this.uploader.uploadFile(fileList[fileList.length - 1].originFileObj, (res, error) => {
                if (res) {
                    this.setState({
                        screenShotImgs: this.state.screenShotImgs.concat({
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
                    console.log('fail', error);
                }
            }, '/web/event/capture/');
        } else {
            this.setState({
                screenShotImgs: fileList
            });
        }   
    }

    // handlePictureUpload=(file, index)=> {
    //     if (!ossConfig.checkImage(file)) return;
    //     if (!this.uploader) this.uploader = new AliyunOssUploader();
    //     this.uploader.uploadFile(file, (res, message) => {
    //         if (res) {
    //             if (index) {
    //                 setParams(this.STATE_NAME, {imgs: this.props.detail['imgs'].concat(IMG_PATH + res.name)});
    //                 setParams(this.STATE_NAME, {PicUrls: this.props.detail['PicUrls'].concat(IMG_PATH + res.name)});
    //             } else {
    //                 setParams(this.STATE_NAME, {imgs: this.props.detail['imgs'].concat(IMG_PATH + res.name)});
    //                 setParams(this.STATE_NAME, {PicUrls: this.props.detail['PicUrls'].concat(IMG_PATH + res.name)});
    //             }
    //         } else {
    //             message.info('图片上传失败');
    //             console.log('fail', message);
    //         }
    //     }, uploadRule.assistancePicture.path);
    //     return false;
    // }
   
   startParams=()=> {
      if(this.props.location.state['EventID']) {
        let params = this.props.location.state;
        localStorage.setItem('EventID', params['EventID']);
        let goo = {
            EventID: params['EventID']
        };
        eventdetail(goo);
        return true;
      }

      let go = {
        EventID: localStorage.getItem('EventID')
       };
       eventdetail(go);
   }
   componentWillMount() {
      this.startParams();
      setParams(this.STATE_NAME, {imgs: []});
   }
   componentDidMount() {
   
   }
    componentWillReceiveProps(nextProps) {
        if(this.state.flak) {
            if(nextProps.detail.EventalterFetch['status'] == 'success') {
                if(nextProps.detail.EventalterFetch['response']['Code'] == 0) {
                    message.success('操作成功！', 3, () => {
                        doTabPage(this.props.tabPageInfo.currentTab, 'close');
                    });
                    }else{
                    message.error('操作失败，请联系技术人员！', 3);
                    }
                    this.setState({
                      flak: false
                    });
             }else if(nextProps.detail.EventalterFetch['status'] == 'error') {
                   message.error('操作失败，请联系技术人员！', 3);
                   this.setState({
                    flak: false
                  });
             }
        }
            
        if(this.props.detail['EventDetail'] !== nextProps.detail['EventDetail']) {
            const params = nextProps.detail['EventDetail'];
            this.props.form.setFieldsValue({
               QuestionRemark: params['QuestionRemark']
             });
        }
    }
    confirm(a) { 
        this.setState({
            visible: true,
            nek: true
        });
    }

    maybe=(a)=> {
        this.setState({
         previewUrl: a,
         previewVisible: true
        });
     }

    handleOk=(a, e)=> {
        const params = this.props.detail['EventDetail'];
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let mation = 'mm';
                  switch (a)
                   {
                       case 4:
                        mation = 'flak1';
                       break;
                       case 3:
                        mation = 'flak2';
                       break;
                       case 6:
                        mation = 'flak3';
                       break;
                       case 13:
                        mation = 'flak4';
                       break;
                   }
                   this.setState({
                       flak1: true,
                       flak2: true,
                       flak3: true,
                       flak4: true,
                       visible: false,
                       flak: true
                   });
                    let go = {
                        DiplomatID: params['DiplomatID'],
                        EventID: params['EventID'],
                        DealRemark: values['Opinion'],
                        DealStatus: a,
                        EventType: Number(values['EventType']),
                        PictureList: this.state.screenShotImgs.map(item => item.rawUrl)
                        // Pictures: this.props.detail['PicUrls']
                    };
                    eventalter(go);  
                    let quick = setTimeout(() => {
                        setParams(this.STATE_NAME, {imgs: []});
                        clearTimeout(quick);
                    }, 2000);
            }
          });     
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const params = this.props.detail['EventDetail'];
        const history = this.props.detail['EventHistory'];
        const firstLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 2 }
              },
              wrapperCol: {
                xs: { span: 19 },
                sm: { span: 16 }
              }
          };
        const formLayout = {
            labelCol: {
                xs: { span: 5 },
                sm: { span: 5 }
              },
              wrapperCol: {
                xs: { span: 18 },
                sm: { span: 16 }
              }
        };
        if(params['EventType'] == 0) {
             this.setState({
                good: "待分类"
             });
        }

        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
        );

        return (
            <div style={{padding: '15px'}}>
                     <Row>
                      <Col span={24}>
                          <div style={{background: '#108ee9', padding: '10px 0 10px 10px'}}>
                              事件详情
                          </div>
                      </Col>
                      </Row>
               <div style={{background: 'white', padding: '10px 10px 30px 10px'}}>
                      <Row gutter={24} className="translate">
                      <Col span={8} className="eventdetail" style={{height: '23px', marginBottom: '7px'}}>
                      <Form>
                            <FormItem label="事件分类" {...formLayout} style={{marginLeft: '-11px'}}>
                            {getFieldDecorator("EventType", {
                                rules: [{required: true, message: '请填写事件分类！'}],
                                initialValue: String(params['EventType'] == 0 ? '' : params['EventType'])
                                })(
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                >
                                    {Object.keys(EventTypeMap).map((key) => (
                                        <Option value={`${key}`} key={key}>{EventTypeMap[key]}</Option>
                                    ))}
                                </Select> 
                                )}
                            </FormItem>
                            </Form>
                      </Col>
                      <Col span={8} style={{marginBottom: '5px'}}>
                          <span>事件性质:</span>
                          <span>{EventNatureMap[params.EventNature] || ''}</span>
                      </Col>
                      <Col span={8} style={{marginBottom: '18px'}}>
                          <span>满意度:</span>
                          <span style={params['Satisfaction'] == 1 ? {display: 'block'} : {display: 'none'}}>点赞</span>
                          <span style={params['Satisfaction'] == 2 ? {display: 'block'} : {display: 'none'}}>差评</span>
                      </Col>
                      <Col span={8} style={{marginBottom: '5px'}}>
                          <span>当前状态:</span>
                          <span>{EventDealStatusMap[params.DealStatus] || ''}</span>
                      </Col>
                      <Col span={8} style={{marginBottom: '5px'}}>
                          <span>会员名称:</span>
                          <span>{params['UserName']}</span>
                      </Col>
                      <Col span={8} style={{marginBottom: '18px'}}>
                          <span>手机号码:</span>
                          <span>{params.Mobile || ''}</span>
                      </Col>
                      <Col span={8} style={{marginBottom: '5px'}}>
                          <span>面试时间:</span>
                          <span>{params['InterviewDate'] == '0000-00-00' ? '' : params['InterviewDate']}</span>
                      </Col>
                      <Col span={8} style={{marginBottom: '5px'}}>
                          <span>企业名称:</span>
                          <span>{params['RecruitName']}</span>
                      </Col>
                      <Col span={8} style={{marginBottom: '18px'}}>
                          <span>事件发布者:</span>
                          <span>{params['BrokerName']}</span>
                      </Col>
                      <Col span={8} style={{marginBottom: '5px'}}>
                          <span>事件发布时间:</span>
                          <span>{params['CreateTime']}</span>
                      </Col>
                      <Col span={8}>
                          <span>事件处理者:</span>
                          <span>{params['DiplomatName']}</span>
                      </Col>
                    </Row>
                    <Row gutter={24} style={{marginTop: '20px'}}>
                            <Form
                            >
                                <Col span={24} style={{marginLeft: '-20px'}}>
                                    <FormItem label="问题描述" {...firstLayout}>
                                    <div style={{textAlign: 'right'}}>最多输入200字</div>
                                    {getFieldDecorator("QuestionRemark", {
                                        rules: [{required: true, message: '请填写问题描述！'}]
                                        })(
                                            <TextArea rows={4} maxLength="200" disabled={(params['DealStatus'] == 2 || params['DealStatus'] == 12 || params['DealStatus'] == 3)}/>   
                                        )}
                                    </FormItem>
                                </Col>
                            </Form>
                            <Col span={24} className="imgs">
                                    <span>截图：</span>
                                    {
                                      (params['PictureList'] ? params['PictureList'].length > 0 ? params['PictureList'] : [] : []).map((item, index)=> {
                                        return (
                                            <span className="imges" key={index}>
                                                <img src={item} onClick={this.maybe.bind(this, item)} />
                                            </span>
                                        );
                                      })
                                    }
                            </Col>
                            {/* <Col span={24} style={(params['DealStatus'] == 2 || params['DealStatus'] == 12 || params['DealStatus'] == 3) ? {display: 'none'} : {marginTop: '20px'}}>
                                {this.props.detail['imgs'] && this.props.detail['imgs'].length > 0 ? this.props.detail['imgs'].map((url, index) => {
                                    return (
                                        <Upload accept="image/jpeg,image/png"
                                                className="avatar-uploader size-small float-left mr-16" key={index}
                                                beforeUpload={(file) => this.handlePictureUpload(file, index)}
                                                onRemove={() => this.handlePictureRemove(index)}
                                                disabled={(this.props.detail['imgs'] || []).length >= 3}
                                                name="avatar"
                                                >
                                          <img style={{width: '100px', height: '100px'}} src={url}/>
                                        </Upload>);
                                }) : ''}
                                {(this.props.detail['imgs'] || []).length >= 3 ? '' : (
                                    <Upload accept="image/jpeg,image/png"
                                            className="avatar-uploader size-small float-left"
                                            beforeUpload={(file) => this.handlePictureUpload(file)}
                                            onRemove={(index) => this.handlePictureRemove(index)}
                                            name="avatar">
                                        <Icon type="plus" className="avatar-uploader-trigger"/>
                                    </Upload>)}
                                    <span>支持上传3个截图，每个大小不得超过2M</span>
                            </Col> */}
                        </Row>
               </div>
                <Row style={{background: 'white', paddingBottom: '30px'}}>
                    <Col span={24}>
                        <div style={{background: '#108ee9', padding: '10px 0 10px 10px'}}>
                            操作历史
                        </div>
                    </Col>
                    <Col span={24} style={{padding: '20px', background: 'white'}}>
                        <Table columns={this.state.columns}
                                bordered={true}
                                dataSource={history}
                                pagination={false}
                                style={{width: '90%'}}
                        >
                        </Table>
                    </Col>
                    <Col span={24}>
                        <div style={{background: '#108ee9', padding: '10px 0 10px 10px'}}>
                            事件处理
                        </div>
                    </Col>
                    <Col span={24} style={{padding: '20px'}}>
                           <Form
                            >
                                <FormItem label="处理意见" {...firstLayout}>
                                {getFieldDecorator("Opinion", {
                                    rules: [{required: true, message: '请填写处理意见！'}]
                                    })(
                                        <TextArea rows={4} maxLength="200"/>   
                                    )}
                                </FormItem>

                                <FormItem label="截图导入" {...firstLayout}>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <Upload
                                            accept="image/jpeg,image/png"
                                            listType="picture-card"
                                            name="avatar"
                                            fileList={this.state.screenShotImgs}
                                            onChange={this.handleUploadChange}
                                        >
                                            {this.state.screenShotImgs.length >= 3 ? null : uploadButton}
                                        </Upload>
                                        <span>支持上传3张截图，每张大小不得超过2M</span>
                                    </div>
                                </FormItem>
                            </Form>
                    </Col>
                    <Col span={10} offset={5}>
                        <Button type="default" style={{marginRight: '50px'}} size="large" htmlType="submit" onClick={this.handleOk.bind(this, 4)} disabled={this.state.flak1}>处理完毕</Button>
                        <Button type="default" style={{marginRight: '50px'}} size="large" htmlType="submit" onClick={this.handleOk.bind(this, 3)} disabled={this.state.flak2}>处理中</Button>
                        <Button type="default" style={{marginRight: '50px'}} size="large" htmlType="submit" onClick={this.handleOk.bind(this, 6)} disabled={this.state.flak3}>补充资料</Button>
                        {/* <Button type="default" size="large" htmlType="submit" onClick={this.handleOk.bind(this, 13)} disabled={this.state.flak4}>拒绝</Button> */}
                    </Col>
                </Row>

                <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>this.setState({previewVisible: false})}>
                  <img alt="example" style={{ width: '100%' }} src={this.state.previewUrl} />
                </Modal>

                <Viewer
                    visible={this.state.previewImagesVisible}
                    drag={false}
                    zoomable={false}
                    rotatable={false}
                    scalable={false}
                    noImgDetails={true}
                    attribute={false}
                    noNavbar={true}
                    onClose={() => { this.setState({ previewImagesVisible: false }); } }
                    images={this.state.previewImages}
                />
            </div>
        );
    }
}
export default Form.create()(Eventdetail);
