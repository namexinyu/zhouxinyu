import React from 'react';
import {Card, Row, Col, Button, Table, Form, Input, Icon, DatePicker, Popconfirm, message, Modal} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import {browserHistory} from 'react-router';
import questionReplys from "ACTION/Broker/Question/question";
import answers from "ACTION/Broker/Question/answer";
import {RegexRule, Constant} from 'UTIL/constant/index';
import "LESS/pages/question.less";
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

 class questionReply extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_question';
        this.state = {
            length: '',
            record: '',
            modify: '',
            visible: false,
            flag: false,
            columns: [{
                title: '序号',
                dataIndex: 'key',
                width: 4.2,
                render: (text, record) => text
              }, {
                title: '提问时间',
                dataIndex: 'CreateTime',
                width: '12%'
              }, {
                title: '会员姓名',
                dataIndex: 'UserName',
                width: '7.4%',
                render: (text, record) =><span style={{color: '#108ee9', cursor: 'pointer'}} onClick={this.skip.bind(this, record)}>{text}</span>
              }, {
                title: '提问的内容',
                dataIndex: 'Ask',
                width: '29.6%'
              }, {
                title: '回答',
                dataIndex: 'Answer',
                width: '44.1%',
                render: (text, record) =><TextArea style={{width: '100%', height: '100%', resize: 'none', outline: 'none'}} value={text}/>
              }, {
                title: '操作',
                width: '3.5%',
                render: (text, record) =><span style={{color: '#108ee9', cursor: 'pointer'}} onClick={this.may.bind(this, record)}>修改</span>
              }
            ]
        };
    }
    skip=(record)=> {
        browserHistory.push({
            pathname: '/broker/member/detail/' + record['UserID'],
            query: {
                memberName: record['UserName']
            }
        });
    }
    may=(record)=> {
        let _that = this;
       this.setState({
           record: record,
           modify: record['Answer'],
           length: record['Answer']['length'],
           visible: true
       }, ()=>{
        this.props.form.setFieldsValue({
            modify: this.state.modify
          });
       });
    }
  startParams=()=> {
    let params = this.props.question;
     let go = {
        MatchAsk: params['MatchAsk'],
        MatchUserName: params['MatchUserName'],
        PageInfo: {
            Count: params['pageSize'],
            Offset: (params['currentPage'] - 1) * params['pageSize']
        },
        TimeEnd: params['TimeEnd'],
        TimeStart: params['TimeStart']
     };
     questionReplys(go);
   }
    componentWillMount() {
        this.startParams();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.question == this.props.question) {
            this.setState({
                flag: true
            });
        }else{
            this.setState({
                flag: false
            });
        }
    }
    componentDidUpdate() {
        if(!this.state.flag) {
            this.startParams();
        };
    }
    handleSearch=(e)=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                if(values['date']) {
                    setParams(this.STATE_NAME, {
                        MatchAsk: values['search'] || '',
                        MatchUserName: values['name'] || '',
                        TimeStart: values['date'].length > 0 ? moment(values['date'][0]).format('YYYY-MM-DD HH:mm:ss') : '',
                        TimeEnd: values['date'].length > 0 ? moment(values['date'][1]).format('YYYY-MM-DD HH:mm:ss') : ''
                    });
                }else{
                    setParams(this.STATE_NAME, {
                        MatchAsk: values['search'] || '',
                        MatchUserName: values['name'] || '',
                        TimeStart: '',
                        TimeEnd: ''
                    });
                }
                
            }
        });
    }
    hideModal=()=> {
        answers({AskID: this.state.record['AskID'], Content: this.state.modify});
        this.startParams();
        this.setState({
            visible: false
        });
        message.success('修改成功！');
    }
    maby=(e)=>{
      this.setState({
        modify: e.target.value,
        length: e.target.value['length']
      });
    }
    again=()=> {
        this.props.form.resetFields();
    }
    againd=(a)=> {
       console.log(a);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const param = this.props.question;
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
                xs: { span: 24 },
                sm: { span: 5 }
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
              }
          };
        return (
            <div style={{padding: '15px'}}>
               <div style={{background: 'white', padding: '10px'}} className='question'>
               <Form
                    onSubmit={this.handleSearch}
                    >
                    <Row gutter={24}>
                    <Col span={9}>
                        <FormItem label="办理日期" {...firstLayout}>
                           {getFieldDecorator("date", {
                            rules: []
                            })(
                                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={this.againd}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem label="会员姓名" {...formItemLayout}>
                           {getFieldDecorator("name", {
                            rules: []
                            })(
                                <Input size="large" placeholder=""/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem label="内容搜索" {...formItemLayout}>
                           {getFieldDecorator("search", {
                            rules: []
                            })(
                                <Input size="large" placeholder=""/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <Button type="primary" size='large' style={{marginRight: '10px'}} htmlType="submit">搜索</Button>
                        <Button type="default" size='large' onClick={this.again}>重置</Button>
                    </Col>
                    </Row>
                </Form>
                    <Row>
                       <Table columns={this.state.columns}
                                bordered={true}
                        //        loading={data.RecordListLoading}
                                dataSource={param['questionList']}
                                pagination={{
                                    total: param['totalSize'],
                                    pageSize: param['pageSize'],
                                    current: param['currentPage'],
                                    onChange: (page, pageSize) => {
                                        setParams(this.STATE_NAME, {currentPage: page});
                                    },
                                    onShowSizeChange: (current, size) => setParams(this.STATE_NAME, {pageSize: size, currentPage: current}),
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    pageSizeOptions: ['20', '40', '80'],
                                    showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                         }}
                        >
                        </Table>
                    </Row>
                    <Modal
                        title={`提问：${this.state.record['Ask']}`}
                        visible={this.state.visible}
                        onOk={this.hideModal}
                        onCancel={()=>{
                            this.setState({visible: false, modify: ''});
                            message.error('取消修改！');
                         }
                        }
                        okText="确认"
                        cancelText="取消"
                        >
                        <div>
                            回答：
                             <Form>
                                <FormItem>
                                    {getFieldDecorator("modify", {
                                        rules: []
                                        })(
                                            <textarea style={{border: 'none', resize: 'none', height: '100px', width: '100%', outline: 'none'}} onChange={this.maby} maxLength='140'/>
                                     )}
                               </FormItem>
                            </Form>
                            <div style={{textAlign: 'right'}}>
                                <span>
                                    {this.state.length}/140
                                </span>
                            </div>
                        </div>
                    </Modal>
               </div>
            </div>
        );
    }
}
export default Form.create()(questionReply);
