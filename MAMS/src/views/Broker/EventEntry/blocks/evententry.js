import React from 'react';
import {Card, Row, Col, Button, Table, Form, Input, Icon, DatePicker, Radio, message, Modal, Upload, Select} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import {browserHistory} from 'react-router';
import resetState from 'ACTION/resetState';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import evententry from "ACTION/Broker/EventEntry/evententry";
import EventService from 'SERVICE/Broker/EventService';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import answers from "ACTION/Broker/Question/answer";
import {RegexRule, Constant} from 'UTIL/constant/index';
import "LESS/pages/evententry.less";
// import "LESS/component/picture-upload.less";
import ossConfig from 'CONFIG/ossConfig';
import uploadRule from 'CONFIG/uploadRule';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import Wikis from 'SERVICE/Wiki/index';
import formatDate from 'UTIL/base/formatDate';
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const {
    GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;
const IMG_PATH = ossConfig.getImgPath();
const STATE_NAME = 'state_broker_evententry';
const RadioGroup = Radio.Group;
function disabledDateTow(current) {
    const today = new Date();
    return current && new Date(formatDate(current)).getTime() > new Date(formatDate(today)).getTime();
}

 class Evententry extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_evententry';
        this.state = {
            messages: '',
            visible: false,
            previewVisible: false,
            depres: false,
            PicUrls: {},
            previewUrl: '',
            Uploadvalue: true,
            TabsList: [],
            RecordList: [],
            HotArticleList: [],
            record: "",
            QryDoc: [],
            value: "",
            page: 1,
            pageSize: 10,
            total: 0,
            WikiModl: false,
            WikiModlRecordList: [],
            detail: [],
            detailModl: false
        };
    }
    componentWillMount() {
        GetMAMSRecruitFilterList();
        Wikis.GetHotArticle().then((data) => {
            this.setState({
                HotArticleList: data.Data.RecordList || []
            });
        });
    }

    handleEventEmit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err) {
                console.log(values);
                const {
                    UserName,
                    UserMobile,
                    InterviewDate,
                    RecruitName,
                    QuestionRemark,
                    InterviewStep, 
                    EventType, 
                    Department,
                    UserAccount, 
                    AbnormalType, 
                    MoneyValue, 
                    YearMonth
                } = values;
                let Pictures = [];
                if (this.props.entry.PicUrls.length > 0) {
                    this.props.entry.PicUrls.map((Item) => {
                        Pictures.push(Item.rawUrl);
                    });
                }
                let QuestionRemarkText = "";
                if (Department == 6) {
                    QuestionRemarkText = `会员名称:${UserName}，手机号:${UserMobile},面试时间:${moment(InterviewDate).format('YYYY-MM-DD')}企业名称:${ RecruitName.text}会员工号:${UserAccount},异常类型:${AbnormalType == 1 ? "少发" : "未发"},金额:${MoneyValue},月份:${YearMonth.format('YYYY-MM')},问题描述:${QuestionRemark}`;
                } else {
                    QuestionRemarkText = `${UserName ? UserName : ""}${UserMobile ? "(" + UserMobile + ")" : ""}${InterviewDate ? moment(InterviewDate).format('YYYY-MM-DD') : ''}面试${RecruitName.value ? "(" + RecruitName.text + ")" : ""}${QuestionRemark}`;
                }
                if (this.state.Uploadvalue == true) {
                    EventService.getEventEntry({
                        InterviewDate: InterviewDate ? moment(InterviewDate).format('YYYY-MM-DD') : '',
                        Mobile: UserMobile || '',
                        Pictures: Pictures,
                        QuestionRemark: QuestionRemarkText || '',
                        RecruitName: RecruitName ? RecruitName.text : '',
                        RecruitTmpID: RecruitName ? +RecruitName.value : 0,
                        UserID: this.props.entry.UserID || 0,
                        InterviewStep, 
                        EventType: EventType * 1, 
                        Department: Department * 1,
                        UserName: UserName || '',
                        UserAccount,
                        AbnormalType: AbnormalType * 1,
                        MoneyValue: MoneyValue * 1,
                        YearMonth: YearMonth ? YearMonth.format("YYYY-MM") : ""
                    }).then((res) => {
                        if (res.Code === 0) {
    
                            if (Date.now() > new Date(moment().format('YYYY-MM-DD') + ' 21:00')) {
                                Modal.warning({
                                    title: '提示',
                                    content: `小姐姐，业务客服已下班，该问题分配给${res.Data.DiplomatName}，可能明早8:00以后才能回复。如紧急请电话或微信qq群询问。`,
                                    onOk: () => {
                                        this.setState({
                                            depres: true
                                        });
                                        setParams(STATE_NAME, {
                                            queryParams: {
                                                UserName: '',
                                                UserMobile: '',
                                                InterviewDate: undefined,
                                                RecruitName: {
                                                    value: '',
                                                    text: ''
                                                },
                                                QuestionRemark: '',
                                                InterviewStep: "", 
                                                EventType: "", 
                                                Department: ""
                                            },
                                            PicUrls: []
                                        });
                                        this.props.form.resetFields();
                                    }
                                });
                            } else {
                                message.success(`操作成功，事件处理人是${res.Data.DiplomatName}`);
                                this.setState({
                                    depres: true
                                });
                                setParams(STATE_NAME, {
                                    queryParams: {
                                        UserName: '',
                                        UserMobile: '',
                                        InterviewDate: undefined,
                                        RecruitName: {
                                            value: '',
                                            text: ''
                                        },
                                        QuestionRemark: '',
                                        InterviewStep: "", 
                                        EventType: "", 
                                        Department: ""
                                    },
                                    PicUrls: []
                                });
                                this.props.form.resetFields();
                            }
                        } else {
                            message.error(res.Desc || '出错了，请稍后尝试');
                        }
                    }).catch((err) => {
                        message.error(err.Desc || '出错了，请稍后尝试');
                    });
                }else {
                    message.warning("请等图片上传完毕在发布");
                }
                
            }
        });
    }
   
    handlePictureUpload=(file, index)=> {
        this.setState({
            Uploadvalue: false
        });
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                if (index) {
                    setParams(this.STATE_NAME, {PicUrls: this.props.entry.PicUrls.concat(IMG_PATH + res.name)});
                } else {
                    setParams(this.STATE_NAME, {PicUrls: this.props.entry.PicUrls.concat({
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        customPath: IMG_PATH,
                        rawUrl: res.name,
                        url: IMG_PATH + res.name
                    })});
                }
                this.setState({
                    Uploadvalue: true
                });
            } else {
                message.info('图片上传失败');
                console.log('fail', message);
            }
            
        }, uploadRule.assistancePicture.path);
        
        return false;
    }
   
    preview=(a)=> {
        this.setState({
          previewVisible: true,
          previewUrl: a
        });
    }
    Dle = (data) => {
        let PicUrls = [];
       this.props.entry.PicUrls.map((Item) => {
            if (data.uid !== Item.uid) {
                PicUrls.push(Item);
            }
       });
       setParams(this.STATE_NAME, {PicUrls: PicUrls});
    }

    handleDateChange = (date, dateString) => {
        const {
            form,
            entry: {
                queryParams,
                interviewList
            }
        } = this.props;

        setParams(STATE_NAME, {
            queryParams: {
                ...queryParams,
                InterviewDate: date
            }
        });
        const matchedInterview = interviewList.filter(item => item.InterviewDate === dateString)[0];
        if (matchedInterview) {
            setParams(STATE_NAME, {
                queryParams: {
                    ...queryParams,
                    InterviewDate: date,
                    RecruitName: {
                        value: `${matchedInterview.RecruitTmpID || ''}`,
                        text: matchedInterview.PositionName
                    }
                }
            });
        }
    }

    handleInputChange = (e, type) => {
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.entry.queryParams,
                [type]: e.target.value
            }
        });
    }

    handleRecruitChange = (value) => {
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.entry.queryParams,
                RecruitName: value
            }
        });
    }
    EventSubTypeChange = (e) => {
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.entry.queryParams,
                EventType: e
            }
        });
    }
    InterviewStepChange = (e) => {
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.entry.queryParams,
                InterviewStep: e.target.value
            }
        });
    }
    DepartmentChange = (e) => {
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.entry.queryParams,
                Department: e
            }
        });
    }
    DatePicker = (e) => {
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.entry.queryParams,
                YearMonth: e
            }
        });
    }
    onChange = (value) => {
        this.setState({
            value: value
        });
        Wikis.GetTopSearch({Text: value}).then((data) => {
            console.log(data);
            this.setState({
                QryDoc: data.Data.RecordList || []
            });
        });
      
    }

    TextList = (data) => {
        console.log(data, "1111111111");
        return ;
    }

    handleSearchList = (value, item) => {
        Wikis.getDocDetail({
            DocID: item.props.DocID * 1
          }).then((res) => {
            if (res.Code === 0) {
              this.setState({
                detailModl: true,
                detail: res.Data || {}
              });
            } else {
              message.error(res.Desc || '出错了，请稍后尝试');
            }
        }).catch((err) => {
        message.error(err.Desc || '出错了，请稍后尝试');
        });
    }
    WikiModlonClick = (value) => {
        browserHistory.push({
            pathname: '/broker/event-management/Wiki/' + value
        });
    }
    onClick = (value, item) => {
        Wikis.getDocDetail({
            DocID: value * 1
          }).then((res) => {
            if (res.Code === 0) {
              this.setState({
                detailModl: true,
                detail: res.Data || {}
              });
            } else {
              message.error(res.Desc || '出错了，请稍后尝试');
            }
        }).catch((err) => {
        message.error(err.Desc || '出错了，请稍后尝试');
        });
    }
    handleSearch = () => {
        Wikis.GetQryDoc({Text: this.state.value, RecordIndex: 0,
            RecordSize: 10}).then((data) => {
            if (data.Data.RecordList && data.Data.RecordList.length > 0) {
                this.setState({
                    WikiModlRecordList: data.Data.RecordList || [],
                    total: data.Data.RecordCount || 0,
                    WikiModl: true
                });
            } else {
                message.warning("没有搜索到相关的问题");
            }
        });
    }
    AbnormalType = (e) => {
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.entry.queryParams,
                AbnormalType: e
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const param = this.props.entry;
        const {
            queryParams
        } = param;
        const formItemLayout = {
            labelCol: {
              xs: { span: 3 },
              sm: { span: 2 }
            },
            wrapperCol: {
              xs: { span: 8 },
              sm: { span: 8 }
            }
          };

          const formItemLayouts = {
            labelCol: {
              xs: { span: 10 },
              sm: { span: 10 }
            },
            wrapperCol: {
              xs: { span: 12 },
              sm: { span: 12 }
            }
          };
          const firstLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 2 }
              },
              wrapperCol: {
                xs: { span: 8 },
                sm: { span: 8 }
              }
          };
          const fLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 17}
        };

        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传</div>
            </div>
        );
        const {
            detail
          } = this.state;
          const extraButtons = (
            <div>
            </div>
          );
        return (
            <div style={{padding: '15px'}}>
               <div style={{background: 'white', padding: '10px'}} className='question'>
               <Form style={{paddingBottom: '40px', border: '1px solid #999', display: "flex", position: "relative"}} >
                    <div style={{width: "100%"}}>
                        <FormItem label="面试阶段" {...formItemLayout} style={{padding: '8px 0'}}>
                           {getFieldDecorator("InterviewStep", {
                              initialValue: queryParams.InterviewStep || "",
                              rules: [{required: true, message: '请选择面试阶段!'}]
                            })(
                                <RadioGroup onChange={this.InterviewStepChange} name="radiogroup" >
                                    <Radio value={1}>面试前</Radio>
                                    <Radio value={2}>面试中</Radio>
                                    <Radio value={3}>面试后</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem label="事件分类" {...formItemLayout} style={{padding: '8px 0'}}>
                           {getFieldDecorator("EventType", {
                              initialValue: queryParams.EventType
                            })(
                                <Select placeholder="请选择事件分类" onChange={this.EventSubTypeChange} className="w-100" allowClear={true}>
                                    <Option value={"1"}>工资待遇</Option>
                                    <Option value={"2"}>补贴咨询</Option>
                                    <Option value={"3"}>推荐费</Option>
                                    <Option value={"4"}>报名咨询</Option>
                                    <Option value={"5"}>劳务协助</Option>
                                    <Option value={"6"}>离职事宜</Option>
                                    <Option value={"7"}>系统问题</Option>
                                    <Option value={"9"}>面试状态</Option>
                                    <Option value={"10"}>录用条件</Option>
                                    <Option value={"11"}>体检、住宿</Option>
                                    <Option value={"12"}>周薪薪</Option>
                                    <Option value={"13"}>需求问题</Option>
                                    <Option value={"8"}>其他</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="处理对象" {...formItemLayout} style={{padding: '8px 0'}}>
                           {getFieldDecorator("Department", {
                              initialValue: queryParams.Department,
                              rules: [{required: true, message: '请选择处理对象!'}]
                            })(
                                <Select placeholder="请选择不通过原因" onChange={this.DepartmentChange} className="w-100" allowClear={true}>
                                    <Option value="1">业务客服</Option>
                                    <Option value="2">补贴/推荐费</Option>
                                    {/* <Option value="3">体验中心</Option> */}
                                    <Option value="4">回访客服</Option>
                                    <Option value="5">用户体验官</Option>
                                    <Option value="6">薪资组</Option>
                                </Select>
                            )}
                        </FormItem>
                        <div style={{display: "flex", margin: "0 2%"}}>
                        <FormItem label="会员名称" {...formItemLayouts} style={{padding: '8px 0'}}>
                           {getFieldDecorator("UserName", {
                               initialValue: queryParams.UserName,
                               rules: [{required: queryParams.Department == 6 ? true : false, message: '填写会员名称!'}]
                           })(
                                <Input size="large" onChange={(e) => this.handleInputChange(e, 'UserName')} />
                            )}
                        </FormItem>
                        <FormItem label="手机号" {...formItemLayouts} style={{padding: '8px 0'}}>
                            {getFieldDecorator('UserMobile', {
                              initialValue: queryParams.UserMobile,
                              rules: [
                                {required: queryParams.Department == 6 ? true : false, message: '请输入手机号码!'},
                                {
                                  pattern: /^1[2-9][0-9]\d{8}$/,
                                  message: '请输入正确的11位手机号'
                                }
                              ]
                            })(
                              <Input type="tel" maxLength="11" placeholder="请输入手机号码" onChange={(e) => this.handleInputChange(e, 'UserMobile')} />
                            )}
                        </FormItem>
                        </div>
                        <div style={{display: "flex", margin: "0 2%"}}>
                            <FormItem label="面试时间" {...formItemLayouts} style={{padding: '8px 0'}}>
                            {getFieldDecorator("InterviewDate", {
                                initialValue: queryParams.InterviewDate,
                                rules: [{required: queryParams.Department == 6 ? true : false, message: '请选择面试时间!'}]
                                })(
                                    <DatePicker placeholder="请选择" disabledDate={disabledDateTow} onChange={this.handleDateChange} />
                                )}
                            </FormItem>
                            <FormItem label="企业名称" {...formItemLayouts} style={{padding: '8px 0'}}>
                            {getFieldDecorator("RecruitName", {
                                initialValue: queryParams.RecruitName,
                                rules: [{required: queryParams.Department == 6 ? true : false, message: '请选择企业名称!'}, {
                                    validator: function (rule, value, cb) {
                                      if (queryParams.Department == 6 && !value.value) {
                                        cb("请选择企业名称!");
                                      }
                                      cb();
                                    }
                                  }]
                                })(
                                    <AutoCompleteSelect onChange={this.handleRecruitChange} allowClear={true} optionsData={{
                                        valueKey: 'RecruitTmpID',
                                        textKey: 'RecruitName',
                                        dataArray: this.props.recruitFilterList
                                    }}/>
                                )}
                            </FormItem>
                        </div>
                        {
                            queryParams.Department == 6 && <div>
                            <div style={{display: "flex", margin: "0 2%"}}>
                                <FormItem label="会员工号" {...formItemLayouts} style={{padding: '8px 0'}}>
                                {getFieldDecorator("UserAccount", {
                                    initialValue: queryParams.UserAccount,
                                    rules: [{ 
                                        required: true,
                                        message: '请填写会员工号!'
                                      },
                                      {
                                            pattern: /^[0-9a-zA-Z]*$/g,
                                            message: '只能输入字母数字!'
                                          }]
                                    })(
                                        <Input onChange={(e) => this.handleInputChange(e, 'UserAccount')}/>
                                    )}
                                </FormItem>
                                <FormItem label="异常类型" {...formItemLayouts} style={{padding: '8px 0'}}>
                                {getFieldDecorator("AbnormalType", {
                                    initialValue: queryParams.AbnormalType,
                                    rules: [{required: true, message: '请选择异常类型!'}]
                                    })(
                                        <Select onSelect={(e) => this.AbnormalType(e)} style={{width: 150}} placeholder="请选择异常类型" className="w-100" allowClear={true}>
                                            <Option value="1">少发</Option>
                                            <Option value="2">未发</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </div>
                            <div style={{display: "flex", margin: "0 3%"}}>
                                <FormItem label="金额" {...formItemLayouts} style={{padding: '8px 0'}}>
                                {getFieldDecorator("MoneyValue", {
                                    initialValue: queryParams.MoneyValue,
                                    rules: [{ 
                                        required: true, 
                                        message: '请输入金额!' 
                                      }, {
                                        pattern: /^[0-9]*$/g,
                                        message: '只能输入数字!'
                                      }]
                                    })(
                                        <Input onChange={(e) => this.handleInputChange(e, 'MoneyValue')}/>
                                    )}
                                </FormItem>
                                <FormItem label="月份" {...formItemLayouts} style={{padding: '8px 0'}}>
                                {getFieldDecorator("YearMonth", {
                                    initialValue: queryParams.YearMonth,
                                    rules: [{required: true, message: '请选择月份!'}]
                                    })(
                                        
                                        <MonthPicker placeholder="请选择月份!" onChange={(e) => this.DatePicker(e, "YearMonth")}/>
                                    )}
                                </FormItem>

                            </div>
                        </div>
                        }
                        
                        <FormItem label="问题描述" {...firstLayout} style={{padding: '8px 0'}}>
                          <div style={{textAlign: 'right'}}>
                              最多可输入200字
                          </div>
                           {getFieldDecorator("QuestionRemark", {
                                initialValue: queryParams.QuestionRemark,
                                rules: [{required: true, message: '请填写问题描述!'}]
                            })(
                                <TextArea rows={4} maxLength='200' onChange={(e) => this.handleInputChange(e, 'QuestionRemark')} /> 
                            )}
                        </FormItem>
                        <FormItem {...fLayout} label="上传图片">
                            <Upload id="PicUrls" accept="image/jpeg,image/png"
                                    listType="picture-card"
                                    fileList={param.PicUrls}
                                    beforeUpload={(file) => this.handlePictureUpload(file)}
                                    onPreview = {(file) => this.preview(file.url)}
                                    onRemove={(file) => this.Dle(file)}
                                    name="avatar">
                                {param.PicUrls.length >= 3 ? "" : uploadButton}
                            </Upload>
                            <span>支持上传3个截图，每个大小不得超过2M</span>
                        </FormItem>
                        <Row>
                           <Col xs={{ span: 8, offset: 8 }} lg={{ span: 8, offset: 8 }}>
                                <Button type="default" size='large' htmlType="submit" style={{marginTop: '20px'}} onClick={this.handleEventEmit} disabled={this.state.depres}>事件发布</Button>
                           </Col>
                        </Row>
                        </div>
                        <div style={{width: "30%", position: "absolute", margin: "1% 0 0 60%", border: "1px solid", borderRadius: "5px"}}>
                        <h2 style={{
                            background: "#46b60f",
                            marginBottom: "2%",
                            padding: "1%",
                            borderRadius: "5px 5px 0 0",
                            color: "#fff"
                        }}>事件百科</h2>
                            <div style={{marginLeft: "5%", position: "relative"}}>
                                    <Select
                                        style={{ width: 200 }}
                                        showSearch={true}
                                        placeholder=''
                                        defaultActiveFirstOption={false}
                                        onSearch={this.onChange}
                                        onSelect={(value, item) => this.handleSearchList(value, item)}
                                        mode="combobox"
                                        notFoundContent=""
                                        showArrow={false}
                                        filterOption={false}
                                        >
                                        {
                                            (this.state.QryDoc || []).map((item, i) => {
                                            return (
                                                <Option key={i} DocID={item.DocID}
                                                value={item.Title}>{item.Title}</Option>
                                            );
                                            })
                                        }
                                    </Select>
                                <Button style={{margin: "0 0", borderRadius: "0 4px 4px 0"}} type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                            </div>
                            <div style={{marginLeft: "5%",
                                        padding: "2% 0"
                                        }}>
                                <h3 style={{padding: "2% 0", borderBottom: "1px solid #eee", margin: "0 0 20px 0", fontWeight: "900",
    fontSize: "17px"}}>常见问题</h3>
                                <ul>
                                    {
                                        this.state.HotArticleList.map((item, index) => {
                                            return <li key={index} style={{overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            cursor: "pointer",
                                            whiteSpace: "nowrap"}} onClick={() => this.onClick(item.DocID)}>{index + 1 + "." + item.Title}</li>;
                                        })
                                    }
                                </ul>
                            </div>
                    </div>
                </Form>
                <Modal
                    title=""
                    visible={this.state.visible}
                    onOk={() => this.setState({visible: false})}
                    onCancel={() => this.setState({visible: false})}
                    >
                    <p>{this.state.messages}</p>
                </Modal>
                
               </div>
               <Modal
                    title={this.state.value}
                    visible={this.state.WikiModl}
                    onOk={() => this.setState({WikiModl: false})}
                    onCancel={() => this.setState({WikiModl: false})}
                    >
                   <ul>
                       {
                           this.state.WikiModlRecordList.map((item, index) => {
                            return <li key={index} style={{overflow: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                            whiteSpace: "nowrap"}} onClick={() => this.WikiModlonClick(item.DocID)}>{index + 1 + "." + item.Title}</li>;    
                           })
                       }
                   </ul>
                </Modal>
                <Modal
                    title="详情"
                    visible={this.state.detailModl}
                    onOk={() => this.setState({detailModl: false})}
                    onCancel={() => this.setState({detailModl: false})}
                    >
                  <div>
                    <div>
                    <Row style={{
                        backgroundColor: '#fff'
                    }}>
                        <Col span={24}>
                        <div>
                            <Row>
                            <Col span={24}>
                                <div className="EventWikiDetails">
                                <Card title={detail.Title || ''} extra={extraButtons} className="baike-card">
                                    <div className="card-cnt-wrap">
                                    <div dangerouslySetInnerHTML={{__html: (detail.Content || '')}}></div>
                                    </div>
                                </Card>
                                </div>
                            </Col>
                            </Row>
                        </div>
                        </Col>
                    </Row>
                    </div>
                </div>
                </Modal>
               <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>this.setState({previewVisible: false})}>
                  <img alt="example" style={{ width: '100%' }} src={this.state.previewUrl} />
                </Modal>
            </div>
        );
    }
}

export default Form.create()(Evententry);
