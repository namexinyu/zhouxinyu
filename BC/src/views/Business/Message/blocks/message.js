import React from 'react';
import {Card, Row, Col, Button, Table, Form, Input, Icon, DatePicker, Checkbox, message, Modal, Select, Upload} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import setParams from "ACTION/setParams";
import moment from 'moment';
import {browserHistory} from 'react-router';
import "LESS/pages/message.less";
import Message from "ACTION/Common/Message/message";
import uploadRule from 'CONFIG/uploadRule';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import MessageModel from "./MessageModel";

import {CONFIG} from 'mams-com';
const {AppSessionStorage} = CONFIG;
import ossConfig from 'CONFIG/ossConfig';
const IMG_PATH = ossConfig.getImgPath();

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const session_login_info = JSON.parse(sessionStorage.getItem('mams_session_login_info'));

 class Messages extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_mams_message';
        this.state = {
            visible: true,
            flag: false,
            previewImagesVisible: false,
            page: (this.props.message.pageQueryParams.RecordIndex / this.props.message.pageQueryParams.RecordSize) + 1,
            pageSize: 40,
            previewImages: [],
            columns: [{
                title: '发送时间',
                dataIndex: 'CreateTime',
                width: '150px',
                render: (text, record) => text
              }, {
                title: '发送人',
                dataIndex: 'FromEmployeeName',
                width: '60px'
              }, {
                title: '消息类型',
                dataIndex: 'NotifyType',
                width: '70px',
                render: (text, record) => 
                    <div>
                        {text == 1 ? '面试变更' : ''}
                        {text == 2 ? '招聘修改' : ''}
                        {text == 3 ? '自定义' : ''}
                        {text == 4 ? '面试变更' : ''}
                    </div>
              }, {
                title: '企业',
                dataIndex: 'RecruitName',
                render: (text, record) => {
                    const { NotifyType, NewContext } = record;
                    if (NotifyType === 1 || NotifyType === 4) {
                        return JSON.parse(NewContext).RecruitName || '';
                    }
                    if (NotifyType === 2) {
                        return JSON.parse(NewContext).Title.RecruitName || '';
                    }
                    if (NotifyType === 3) {
                        return '';
                    }
                }
                
              }, {
                title: '修改前',
                dataIndex: 'OldContext',
                render: (text, record) => {
                    const msgType = record.NotifyType;
                    if (msgType === 1 || msgType === 4) {// 面试变更
                        return '';
                    }
                    if (msgType === 2) {// 招聘修改
                        const oldRecruitInfo = JSON.parse(record.OldContext) || [];
                        const oldRecruitInfoContent = oldRecruitInfo.Content.filter(item => !!item.value);
                        if (!oldRecruitInfoContent.length) {
                            return '';
                        } else {
                            return (
                                <div>
                                    {oldRecruitInfoContent.filter(item => item.key.indexOf('招聘状态') !== -1).length ? '' : <div>{oldRecruitInfo.Title.DayType === 1 ? '今日：' : '明日：'}</div>}
                                    {oldRecruitInfoContent.map((item, i) => (
                                        <div style={{ padding: '0 10px' }} key={i}>{`${item.key}${item.value}`}</div>
                                    ))}
                                </div>
                            );
                        }
                    }

                    if (msgType === 3) {// 自定义
                        return '';
                    }
                }
                
              }, {
                title: '修改后',
                dataIndex: 'NewContext',
                width: '400px',
                render: (text, record) => {
                    const msgType = record.NotifyType;
                    const rawMsg = record.NewContext;
                    if (msgType === 1) {// 会员面试变更
                        const newMsg = JSON.parse(rawMsg);
                        return (
                            <div style={{ padding: 10 }}>会员{newMsg.UserName}（{newMsg.UserMobile}）,面试{newMsg.RecruitName}现场放弃</div>
                        );
                    }
                    if (msgType === 2) {// 招聘修改
                        const newMsg = JSON.parse(rawMsg);
                        const isRecruitStatus = !!(newMsg.Content.filter(item => item.key.indexOf('招聘状态') !== -1).length);
                        if (isRecruitStatus) {// 是否招聘修改
                            return (
                                <div style={{ padding: 10 }}>{`${newMsg.Title.RecruitName}${newMsg.Title.DayType === 1 ? '今日' : '明日'}${newMsg.Content[0].value === '开启' ? '招聘' : '暂停招聘'}`}</div>
                            );
                        } else {
                            return (
                                <div>
                                    <div>{newMsg.Title.DayType === 1 ? '今日：' : '明日：'}</div>
                                    {newMsg.Content.map((item, i) => (
                                        <div style={{ padding: '0 10px' }} key={i}>{`${item.key}${item.value}`}</div>
                                    ))}
                                </div>
                            );
                        }
                    }

                    if (msgType === 3) {// 自定义
                        return (
                            <div style={{ padding: 10, display: 'flex' }}>
                                {rawMsg}
                                <span>
                                    {(record.PicsPath || []).map((item, i) => (
                                        <Icon style={{
                                            fontSize: "22px",
                                            cursor: 'pointer',
                                            color: "#3399e7"
                                        }} className="ml-8" type="picture" key={i} onClick={() => this.handlePreivewImages((record.PicsPath || []), i)} />
                                    ))}
                                </span>
                            </div>
                        );
                    }

                    if (msgType === 4) {// 经纪人会员面试变更
                        const newMsg = JSON.parse(rawMsg);
                        return (
                            <div style={{ padding: 10 }}>{newMsg.BrokerName}的会员{newMsg.UserName},面试{newMsg.RecruitName}现场放弃</div>
                        );
                    }
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
                    src: IMG_PATH + pic
                };
            })
        });
    }

    componentWillMount() {
        this.fetchMessageList(this.props.message.pageQueryParams);
    }
    fetchMessageList = (queryParams = {}) => {
        const {
            MessageDate = {},
            MessageType = {},
            RecordIndex,
            RecordSize
        } = queryParams;
      
        Message({
            EmployeeID: session_login_info.employeeId,
            EmployeeType: JSON.parse(session_login_info.roleCodeList)[0] || '',
            StartTime: MessageDate.value && moment(MessageDate.value[0]).isValid() ? moment(MessageDate.value[0]).format('YYYY-MM-DD') : '',
            EndTime: MessageDate.value && moment(MessageDate.value[1]).isValid() ? moment(MessageDate.value[1]).format('YYYY-MM-DD') : '',
            NotifyType: MessageType.value != null ? +MessageType.value : 0,
            RecordIndex,
            RecordSize
        });
    }

    handleSearch = () => {

        const {
            message: {
              pageQueryParams
            }
          } = this.props;
      
          this.setState({
            page: 1,
            pageSize: pageQueryParams.RecordSize
          });
      
          setParams('state_mams_message', {
            pageQueryParams: {
              ...pageQueryParams,
              RecordIndex: 0,
              RecordSize: pageQueryParams.RecordSize
            }
          });
      
          this.fetchMessageList({
            ...pageQueryParams,
              RecordIndex: 0,
              RecordSize: pageQueryParams.RecordSize
          });

    }


    handleTableChange = ({current, pageSize }) => {
        const {
          message: {
            pageQueryParams
          }
        } = this.props;
    
        this.setState({
          page: current,
          pageSize: pageSize
        });
    
        setParams('state_mams_message', {
          pageQueryParams: {
            ...pageQueryParams,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
          }
        });
    
        this.fetchMessageList({
          ...pageQueryParams,
          RecordIndex: (current - 1) * pageSize,
          RecordSize: pageSize
        });
      }

      handleAfterSend = () => {
        this.fetchMessageList(this.props.message.pageQueryParams);
      }

    again=()=> {
        this.props.form.resetFields();
    }
    handleOk=()=> {

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let param = this.props.message;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 }
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 }
            }
          };
          const firstLayout = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 }
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
              }
          };
         // console.log(this.props);
        return (
            <div className="message">
                <div className="ivy-page-title">
                    <h1 style={{float: "left"}}>消息列表</h1>
                    <div style={{float: "right"}}>
                        <Icon type="sound" className="Icon"/>
                        <Button type="default" size="large" style={{margin: "0 30px 0 10px"}} onClick={() =>setParams(this.STATE_NAME, {visible: true, imgs: []})}>发消息</Button>
                    </div>
                </div>
               <div style={{background: 'white', margin: '10px', padding: '5px'}}>
               <Form>
                    <Row gutter={24} style={{padding: '15px 0'}}>
                    <Col span={8} style={{height: '20px'}}>
                        <FormItem label="日期" {...formItemLayout}>
                           {getFieldDecorator("MessageDate", {
                            rules: []
                            })(
                                <RangePicker style={{width: 'auto'}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="消息类型" {...formItemLayout}>
                           {getFieldDecorator("MessageType", {
                            rules: []
                            })(
                                <Select
                                showSearch
                                placeholder="请选择"
                            >
                                <Option value='0'>全部</Option>
                                <Option value='2'>招聘修改</Option>
                                <Option value='3'>自定义</Option>
                               </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} style={{paddingLeft: 35}}>
                        <Button type="default" size='large' htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                        <Button type="default" size='large' className="ml-10" onClick={this.again}>重置</Button>
                    </Col>
                    </Row>
                </Form>
                    <Row>
                       <Table columns={this.state.columns}
                                bordered={true}
                                loading={param['Messagestatus']}
                                dataSource={param['Message']}
                                onChange={this.handleTableChange}
                                pagination={{
                                    total: param['totalSize'],
                                    defaultPageSize: this.state.pageSize,
                                    defaultCurrent: this.state.page,
                                    current: this.state.page,
                                    pageSize: this.state.pageSize,
                                    pageSizeOptions: ['40', '80', '120'],
                                    showTotal: (total, range) => {
                                        return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                    },
                                    showSizeChanger: true,
                                    showQuickJumper: true
                         }}
                        >
                        </Table>
                    </Row>
                    <MessageModel Modal={this.props} onOk={this.handleAfterSend}/>
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
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        const {
            MessageDate,
            MessageType
        } = props.message.pageQueryParams;
    
        return {
            MessageDate,
            MessageType
        };
    },
    onFieldsChange(props, fields) {
        setParams('state_mams_message', {
          pageQueryParams: Object.assign({}, props.message.pageQueryParams, fields)
        });
    }
})(Messages);
