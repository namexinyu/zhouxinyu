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
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import EventManagementService from 'SERVICE/Business/Management/eventmanagement';
import { EventTypeMap, EventDealStatusMap } from "UTIL/constant";
import ossConfig from 'CONFIG/ossConfig';
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

 class Eventquerydetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'eventquerydetail';
        this.state = {
            previewImagesVisible: false,
            previewImages: [],
            screenShotImgs: [],
            visible: false,
            saveButtonDisabled: false,
            nek: false,
            flak: false,
            flak1: false,
            flak2: false,
            flak3: false,
            flak4: false,
            previewVisible: false,
            previewUrl: '',
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
                key: 'Remark',
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
   }
   componentDidMount() {
       
   }
    componentWillReceiveProps(nextProps) {
        // if(this.props.detail['EventDetail'] !== nextProps.detail['EventDetail']) {
        //     const params = nextProps.detail['EventDetail'];
        //     this.props.form.setFieldsValue({
        //        QuestionRemark: params['QuestionRemark']
        //      });
        // }
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

    handleSave = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
				console.log(err);
                return;
            }

            const {
                EventType
            } = values;

            EventManagementService.saveQueryEventDetail({
                EventID: this.props.detail.EventDetail.EventID,
                EventType: EventType == '' ? 0 : +EventType
            }).then((res) => {
                if (res.Code === 0) {
                    message.success('保存成功', 3, () => {
                        doTabPage(this.props.tabPageInfo.currentTab, 'close');
                    });
                    this.setState({
                        saveButtonDisabled: true
                    });
                } else {
                    message.error(res.Desc || '保存失败，请稍后尝试');                
                }
            }).catch((err) => {
                message.error(err.Desc || '保存失败，请稍后尝试');
            });
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
                      <Col span={8} style={{height: '23px', marginBottom: '5px'}}>
                        <Form>
                            <FormItem label="事件分类" {...formLayout}>
                                {getFieldDecorator("EventType", {
                                    rules: [{required: true, message: '请填写事件分类！'}],
                                    initialValue: `${params.EventType === 0 ? '' : params.EventType}`
                                })(
                                    <Select
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
                      <Col span={8}>
                          <span>处理时长:</span>
                          <span>{(params.DealDuringMin === '' || params.DealDuringMin == null || params.DealDuringMin === '0.00') ? '' : `${params.DealDuringMin}分钟`}</span>
                      </Col>
                    </Row>
                    <Row gutter={24} style={{marginTop: '20px'}}>
                            <Form
                            >
                                <Col span={24} style={{marginLeft: '-20px'}}>
                                    <FormItem label="问题描述" {...firstLayout}>
                                        <TextArea rows={4} maxLength="200" disabled value={params.QuestionRemark} />   
                                    {/* <div style={{textAlign: 'right'}}>最多输入200字</div> */}
                                    {/* {getFieldDecorator("QuestionRemark", {
                                        rules: [{required: true, message: '请填写问题描述！'}]
                                        })(
                                            <TextArea rows={4} maxLength="200" disabled/>   
                                        )} */}
                                    </FormItem>
                                </Col>
                            </Form>
                            <Col span={24} className="imgs">
                                    <span>截图：</span>
                                    {
                                      (params['PictureList'] ? params['PictureList'].length > 0 ? params['PictureList'] : [] : []).map((item, index)=> {
                                        return (
                                            <span className="imges" key={index}>
                                                <img src={item} onClick={this.maybe.bind(this, item)}/>
                                            </span>
                                        );
                                      })
                                    }
                            </Col>
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
                                    <TextArea rows={4} maxLength="200" disabled value={params.Opinion || ''} />   
                                {/* {getFieldDecorator("Opinion", {
                                    rules: [{required: true, message: '请填写处理意见！'}]
                                    })(
                                        <TextArea rows={4} maxLength="200" disabled/>   
                                    )} */}
                                </FormItem>

                            </Form>
                    </Col>
                    <Col span={24}>
                        <div style={{textAlign: 'center'}}>
                            <Button type="primary" size="large" onClick={this.handleSave} disabled={this.state.saveButtonDisabled}>保存</Button>
                        </div>
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
export default Form.create()(Eventquerydetail);
