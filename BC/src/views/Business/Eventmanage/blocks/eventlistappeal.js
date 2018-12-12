import React from 'react';
import {Card, Row, Col, Button, Table, Form, Input, Icon, DatePicker, Popconfirm, message, Modal} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import {CONFIG} from 'mams-com';
const {AppSessionStorage} = CONFIG;
import {browserHistory} from 'react-router';
import { EventTypeMap, EventDealStatusMap } from "UTIL/constant";
import eventlistappeal from "ACTION/Common/Management/eventlistappeal";
import resetState from 'ACTION/resetState';
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EventNatureMap = {
  1: '用户体验',
  2: '经纪人利益',
  3: '其他'
};

 class Eventlistappeal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_eventlistappeal';
        this.state = {
          flag: false
        };
         this.columns = [{
            title: '流水号',
            dataIndex: 'EventID',
            width: '4.6%',
            render: (text, record) => text
          }, {
            title: '事件分类',
            dataIndex: 'EventType',
            render: (text, record) => {
              return (
                <div>{EventTypeMap[record.EventType] || ''}</div>
              );
            }
          }, {
            title: '事件性质',
            dataIndex: 'EventNature',
            render: (text, record) => {
              return EventNatureMap[text] || '';
            }
          }, {
            title: '会员姓名',
            dataIndex: 'UserName'
          }, {
            title: '手机号',
            dataIndex: 'Mobile'
          }, {
            title: '面试时间',
            dataIndex: 'InterviewDate'
          }, {
            title: '企业名称',
            dataIndex: 'RecruitName'
          }, {
            title: '事件发布者',
            dataIndex: 'BrokerName'
          }, {
            title: '发布时间',
            dataIndex: 'CreateTime'
          }, {
            title: '事件处理者',
            dataIndex: 'DiplomatName'
          }, {
            title: '问题描述',
            dataIndex: 'QuestionRemark'
          }, {
            title: '满意度',
            dataIndex: 'Satisfaction',
            render: (text, record) =>
            <div>
                  <span style={record['Satisfaction'] == 1 ? {display: 'block'} : {display: 'none'}}>点赞</span>
                  <span style={record['Satisfaction'] == 2 ? {display: 'block'} : {display: 'none'}}>差评</span>
            </div>
          }, {
            title: '当前状态',
            dataIndex: 'DealStatus',
            render: (text, record) => {
              return EventDealStatusMap[record.DealStatus || ''];
            }
          }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => <span style={{color: '#108ee9'}} onClick={this.skip.bind(this, record)}>详情</span>
          }];
        };
  startParams=(a)=> {
    let params = a || this.props.list;
     let go = {
      RecordSize: params['pageSize'],
      RecordIndex: (params['currentPage'] - 1) * params['pageSize'],
      DealStatus: [9]
     };
     eventlistappeal(go);
   }
   
   skip=(a)=> {
    browserHistory.push({
        pathname: '/bc/event-management/listdetail',
        state: a
    });
  }

  make=()=> {
    resetState(this.STATE_NAME);
    this.setState({
       flag: true
    });
  }

    componentWillMount() {
        this.startParams();
    }

    componentWillReceiveProps(nextProps) {
      if((this.props.list['pageSize'] !== nextProps.list['pageSize']) || (this.props.list['currentPage'] !== nextProps.list['currentPage'])) {
        this.startParams(nextProps.list);
      }else{
        if(this.state.flag) {
          this.startParams(nextProps.list);
          this.setState({
             flag: false
          });
        }
      }
    }
  
    render() {
        const { getFieldDecorator } = this.props.form;
        const param = this.props.list;
        return (
            <div style={{padding: '15px'}}>
               <div style={{background: 'white', padding: '10px'}}>
                  <Row justify="end" style={{marginBottom: '12px'}}>
                    <Col span={2} push={22} style={{marginLeft: '10px'}}>
                      <Button type="primary" onClick={() =>this.make()}>刷新</Button>
                    </Col>
                  </Row>
                       <Table columns={this.columns}
                                bordered={true}
                                loading={param['eventlistappealstatus']}
                                dataSource={param['eventlistappeal']}
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
                                    pageSizeOptions: ['40', '80', '120'],
                                    showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                         }}
                        >
                        </Table>
               </div>
            </div>
        );
    }
}
export default Form.create()(Eventlistappeal);
