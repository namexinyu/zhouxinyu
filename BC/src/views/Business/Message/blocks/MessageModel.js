import React from 'react';
import {Card, Row, Col, Button, Table, Form, Input, Icon, DatePicker, Checkbox, message, Modal, Select, Upload} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import {browserHistory} from 'react-router';
import "LESS/pages/message.less";
import Messagemodal from "ACTION/Common/Message/messagemodal";
import MessageService from 'SERVICE/Business/Message/Message';
import ossConfig from 'CONFIG/ossConfig';
import uploadRule from 'CONFIG/uploadRule';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import {CONFIG} from 'mams-com';
import { EINPROGRESS } from 'constants';
const {AppSessionStorage} = CONFIG;


const IMG_PATH = ossConfig.getImgPath();
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

 class Messagemodals extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_mams_message';
        this.state = {
            checkedList: [1, 2, 3],
            optionlist: [4, 5, 6],
            indeterminate: true,
            checkAll: false,
            record: [],
            visibleTo: false,
            Hub: [
                {EmployeeID: 0, EmployeeType: 'HubManager', PushToWhichApp: 4},
                {EmployeeID: 0, EmployeeType: 'HubSupervisor', PushToWhichApp: 4},
                {EmployeeID: 0, EmployeeType: 'HubRecep', PushToWhichApp: 4}
            ],
            Biz: [
            {EmployeeID: 0, EmployeeType: 'BizSupervisor', PushToWhichApp: 0},
            {EmployeeID: 0, EmployeeType: 'BizLabour', PushToWhichApp: 0},
            {EmployeeID: 0, EmployeeType: 'BizEnterp', PushToWhichApp: 0}
            ],
            Broker: [
            {EmployeeID: 0, EmployeeType: 'Broker', PushToWhichApp: 2},
            {EmployeeID: 0, EmployeeType: 'BrokerBoss', PushToWhichApp: 2},
            {EmployeeID: 0, EmployeeType: 'BrokerManager', PushToWhichApp: 2},
            {EmployeeID: 0, EmployeeType: 'BrokerManagerAssist', PushToWhichApp: 2},
            {EmployeeID: 0, EmployeeType: 'BrokerSupervisor', PushToWhichApp: 2}
            ],
            imgs: []
        };
    }

    handleUploadChange = ({ file, fileList, e}) => {

        if (fileList.length && fileList[fileList.length - 1].originFileObj) {
            if (!ossConfig.checkImage(file)) return;
            if (!this.uploader) this.uploader = new AliyunOssUploader();

            this.uploader.uploadFile(fileList[fileList.length - 1].originFileObj, (res, error) => {
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
                    console.log('fail', error);
                }
            }, '/web/message/');
        } else {
            this.setState({
                imgs: fileList
            });
        }
        
    }
    
    rejigger=(values)=> {
        let go = {
            BaseNotifyInfo: {
                CanFindEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                FromEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                FromEmployeeName: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountName'),
                NewContext: values['Messagetext'],
                OldContext: '',
                OverdueTime: 0,
                NotifyType: 3,
                WhoGetTheNotify: this.state.record,
                PicsPath: this.props['Modal']['message']['imgs']
            }
        };
        Messagemodal(go);
        setParams(this.STATE_NAME, {visible: false});
    }

    handleSearch=(e)=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                const {
                    Messagetext,
                    Notice
                } = values;
                console.log(values);
                console.log(this.state.imgs);
                MessageService.AddNotify({
                    BaseNotifyInfo: {
                        CanFindEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                        FromEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                        FromEmployeeName: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountName'),
                        NewContext: Messagetext,
                        OldContext: '',
                        OverdueTime: 0,
                        NotifyType: 3,
                        WhoGetTheNotify: Notice.reduce((wrap, item) => {
                            return wrap.concat(JSON.parse(item));
                        }, []),
                        PicsPath: this.state.imgs.map(item => item.rawUrl)
                    }
                }).then((res) => {
                    if (res.Code === 0) {
                        message.success('消息发送成功！');
                        setParams(this.STATE_NAME, {visible: false});
                        this.props.form.setFieldsValue({
                            Notice: [],
                            Messagetext: ''
                        });
                        this.setState({
                            imgs: []
                        });
                        this.props.onOk();
                       
                    } else {
                      message.error(res.Desc || '消息发送失败，请重新发送！');        
                    }
                  }).catch((err) => {
                    message.error(err.Desc || '消息发送失败，请重新发送！');
                  });
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
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

          const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
          );
        return (
            <div className="message">
                    <Modal
                        title="发消息"
                        visible={this.props['Modal']['message']['visible']}
                        onOk={this.handleSearch}
                        onCancel={() => {
                            setParams(this.STATE_NAME, {visible: false});
                            this.props.form.setFieldsValue({
                                Notice: [],
                                Messagetext: ''
                            });
                            this.setState({
                                imgs: []
                            });
                        }}
                        >
                         <Form
                        onSubmit={this.handleSearch}
                        >
                        <Row>
                        <FormItem label="通知对象" {...firstLayout}>
                        {getFieldDecorator("Notice", {
                            rules: [{required: true, message: '请选择通知对象！'}]
                            })(
                                <Checkbox.Group style={{ width: '100%' }}>
                                <Row>
                                  <Col span={8}><Checkbox value={JSON.stringify(this.state.Broker)}>经纪中心</Checkbox></Col>
                                  {/* <Col span={8}><Checkbox value={JSON.stringify(this.state.Hub)}>集散主管</Checkbox></Col> */}
                                  <Col span={8}><Checkbox value={JSON.stringify(this.state.Biz)}>业务</Checkbox></Col>
                                </Row>
                              </Checkbox.Group>
                            )}
                        </FormItem>
                        <FormItem label="内容" {...firstLayout}>
                        {getFieldDecorator("Messagetext", {
                            rules: [
                                {required: true, message: '请填写内容！'},
                                {
                                    validator: function (rule, value, cb) {
                                        if (!!value && value.length > 300) {
                                          cb('填写内容不能多于300个字');
                                        }
                                        cb();
                                    }
                                }
                            ]
                            })(
                              <TextArea maxLength="300"></TextArea>
                            )}
                        </FormItem>
                        <FormItem label="上传图片" {...firstLayout}>
                                <Col span={24}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <Upload
                                        accept="image/jpeg,image/png"
                                        listType="picture-card"
                                        name="avatar"
                                        fileList={this.state.imgs}
                                        beforeUpload={this.handlePictureBeforeUpload}
                                        onRemove={this.handlePictureRemove}
                                        onChange={this.handleUploadChange}
                                    >
                                        {this.state.imgs.length >= 3 ? null : uploadButton}
                                    </Upload>
                                    <span>支持上传3个截图，每个大小不得超过2M</span>
                                </div>
                                
                            </Col>
                        </FormItem>
                        </Row>
                        </Form>
                    </Modal>
                    <Modal
                        title="提醒"
                        visible={this.state.visibleTo}
                        onOk={this.handleOk}
                        onCancel={()=>this.setState({visibleTo: true})}
                        footer={null}
                        >
                        <div>
                            {this.state.quick}
                        </div>
                        <div style={{textAlign: 'center', marginTop: '10px'}}>
                           <Button type="primary" size="large" onClick={() => this.setState({visibleTo: false})}>确定</Button>
                        </div>
                    </Modal>
            </div>
        );
    }
}

export default Form.create()(Messagemodals);
