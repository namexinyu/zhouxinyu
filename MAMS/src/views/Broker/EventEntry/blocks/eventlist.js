import React from 'react';
import moment from 'moment';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import { EventDealStatusMap } from 'UTIL/constant/constant';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import EventEmitModal from './EventEmitModal';
import EventDetailModal from './EventDetailModal';

import setParams from 'ACTION/setParams';
import eventquery from "ACTION/Broker/EventEntry/eventquery";
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

import EventService from 'SERVICE/Broker/EventService';

const {
  GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  Modal,
  DatePicker,
  message
} from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;

const STATE_NAME = 'state_broker_eventlist';

const brokerId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginId');
const colorMap = {
  1: 'red',
  2: 'yellow',
  3: 'blue',
  4: 'green'
};
class EventList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.eventListInfo.pageQueryParams.RecordIndex / this.props.eventListInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      rowRecord: {},
      detailInfo: {},
      emitModalVisible: false,
      detailModalVisible: false
    };
  }

  componentWillMount() {
    GetMAMSRecruitFilterList();
    this.fetchEventList(this.props.eventListInfo.pageQueryParams);
  }

  componentDidMount() {
    const {
      location
    } = this.props;
    if ((location.state || {}).EventID != null) {
      this.handleShowDetailModal({
        EventID: (location.state || {}).EventID
      });
    }
  }

  fetchEventList = (queryParams = {}) => {
    const {
      Name,
      Mobile,
      RecruitName,
      EventNumber,
      DealStatus,
      DiplomatName,
      InterviewDate,
      CreatedTime,
      orderInfo,
      RecordIndex,
      RecordSize,
      Department,
      InterviewDateEnd
    } = queryParams;

    eventquery({
      BrokerID: brokerId,
      DiplomatName: DiplomatName.value || '',
      DealStatus: DealStatus.value != null ? (+DealStatus.value === 2 ? [2, 3] : [+DealStatus.value]) : [0],
      Mobile: Mobile.value || '',
      UserName: Name.value || '',
      EventID: EventNumber.value != null ? +EventNumber.value : 0,
      RecruitTmpID: RecruitName.value ? +RecruitName.value.value : 0,
      InterviewDate: InterviewDate.value && moment(InterviewDate.value).isValid() ? moment(InterviewDate.value).format('YYYY-MM-DD') : '',
      InterviewDateEnd: InterviewDateEnd.value && moment(InterviewDateEnd.value).isValid() ? moment(InterviewDateEnd.value).format('YYYY-MM-DD') : '',
      QueryStartDate: CreatedTime.value && CreatedTime.value.length && moment(CreatedTime.value[0]).isValid() ? moment(CreatedTime.value[0]).format('YYYY-MM-DD') : '',
      QueryEndDate: CreatedTime.value && CreatedTime.value.length && moment(CreatedTime.value[1]).isValid() ? moment(CreatedTime.value[1]).format('YYYY-MM-DD') : '',
      OrderType: +orderInfo.order,
      Department: Department.value * 1,
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
      eventListInfo: {
        pageQueryParams
      }
    } = this.props;

    this.setState({
      page: 1,
      pageSize: pageQueryParams.RecordSize
    });

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams,
        RecordIndex: 0,
        RecordSize: pageQueryParams.RecordSize
      }
    });

    this.fetchEventList({
      ...pageQueryParams,
      RecordIndex: 0,
      RecordSize: pageQueryParams.RecordSize
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  handleTableChange = ({ current, pageSize }, filters, sorter) => {
    const {
      eventListInfo: {
        pageQueryParams
      }
    } = this.props;

    this.setState({
      page: current,
      pageSize: pageSize
    });

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams,
        RecordIndex: (current - 1) * pageSize,
        RecordSize: pageSize,
        orderInfo: {
          key: sorter.columnKey ? sorter.columnKey : pageQueryParams.orderInfo.key,
          order: sorter.order ? (sorter.order === 'descend' ? 0 : 1) : 0
        }
      }
    });

    this.fetchEventList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize,
      orderInfo: {
        key: sorter.columnKey ? sorter.columnKey : pageQueryParams.orderInfo.key,
        order: sorter.order ? (sorter.order === 'descend' ? 0 : 1) : 0
      }
    });
  }

  handleShowEmitModal = () => {
    this.setState({
      emitModalVisible: true
    });
  }

  handleEmitEvent = () => {
    this.fetchEventList(this.props.eventListInfo.pageQueryParams);
  }

  handleCancelEmitEvent = () => {
    this.setState({
      emitModalVisible: false
    });
  }

  handleShowDetailModal = (record) => {
    EventService.getEventdetail({
      BrokerID: brokerId,
      EventID: record.EventID
    }).then((res) => {
      if (res.Code === 0) {
        this.setState({
          rowRecord: record,
          detailModalVisible: true,
          detailInfo: {
            Detail: (res.Data || {}).Detail || {},
            History: (res.Data || {}).History || []
          }
        }, () => {
          if (((res.Data || {}).Detail || {}).DealStatus === 5) {
            Modal.info({
              title: '提示',
              content: '用户体验官已经做好评判啦~'
            });
          }
          this.scrollToBottom(this.messageBox);
          
        });
      } else {
        message.error(res.Desc || '出错了，请稍后尝试');
      }
    }).catch((err) => {
        message.error(err.Desc || '出错了，请稍后尝试');
    });
  }

  handleSaveDetail = () => {
    this.fetchEventList(this.props.eventListInfo.pageQueryParams);
  }

  handleHideDetailModal = () => {
    this.setState({
      rowRecord: {},
      detailInfo: {},
      detailModalVisible: false
    });
  }

  handleSetRef = (node) => {
    this.messageBox = node;
  }

  scrollToBottom(element) {
    if (element.scrollHeight > element.clientHeight) {
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  }
  
  render() {
    const {
      form: { getFieldDecorator },
      recruitFilterList,
      eventListInfo: {
        eventList,
        pageQueryParams: {
          orderInfo
        },
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      emitModalVisible,
      detailModalVisible,
      detailInfo,
      rowRecord,
      page,
      pageSize
    } = this.state;    

    return (
      <div>
        <div className="ivy-page-title">
          <h1>事件列表</h1>
        </div>
        <Row style={{
          height: '100%',
          overflowX: 'auto',
          paddingTop: 40
        }}>
          <Col span={24} style={{
            padding: "24px"
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "24px"
            }}>
              <Row>
                <Col span={24}>
                  <div>
                    <Form>
                      <Row gutter={8}>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="会员姓名">
                            {getFieldDecorator('Name')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="手机号">
                            {getFieldDecorator('Mobile', {
                              rules: [
                                {
                                  pattern: /^1[0-9][0-9]\d{8}$/,
                                  message: '请输入正确的11位手机号'
                                }
                              ]
                            })(
                              <Input type="tel" maxLength="11" placeholder="请输入手机号码"/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="面试企业">
                            {getFieldDecorator('RecruitName')(
                              <AutoCompleteSelect allowClear={true} optionsData={{
                                valueKey: 'RecruitTmpID',
                                textKey: 'RecruitName',
                                dataArray: recruitFilterList
                              }}/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="流水号">
                            {getFieldDecorator('EventNumber')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="当前状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('DealStatus', {
                              initialValue: "0"
                            })(
                              <Select
                                placeholder="请选择"
                                size="default"
                              >
                                <Option key="0" value="0">全部</Option>
                                {
                                  Object.keys(EventDealStatusMap).map((key) => {
                                    return (
                                        <Option key={key} value={key}>{EventDealStatusMap[key]}</Option>
                                    );
                                  })
                                }

                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="处理人">
                            {getFieldDecorator('DiplomatName')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem label="面试日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                            {getFieldDecorator("InterviewDate")(
                              <DatePicker />
                            )}-
                             {getFieldDecorator("InterviewDateEnd")(
                              <DatePicker />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="发布时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator("CreatedTime")(
                              <RangePicker style={{width: '100%'}} />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="处理对象" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator("Department", {
                              initialValue: "0"
                            })(
                              <Select>
                                <Option value={"0"}>全部</Option>
                                {/* <Option value={"3"}>体验中心</Option> */}
                                <Option value={"2"}>补贴返费</Option>
                                <Option value={"4"}>回访客服</Option>
                                <Option value={"1"}>业务部门</Option>
                                <Option value={"5"}>用户体验官</Option>
                                <Option value={"6"}>薪资组</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={18}>
                          <FormItem style={{textAlign: 'right'}}>
                            <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>
                          <Button type="primary" onClick={this.handleShowEmitModal}>发布事件</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>

              <Row className="mt-20">
                <Col span={24}>
                  <Table
                    rowKey={(record, index) => index}
                    dataSource={eventList}
                    pagination={{
                      total: RecordCount,
                      defaultPageSize: pageSize,
                      defaultCurrent: page,
                      current: page,
                      pageSize: pageSize,
                      pageSizeOptions: ['40', '80', '120'],
                      showTotal: (total, range) => {
                        return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                      },
                      showSizeChanger: true,
                      showQuickJumper: true
                    }}
                    bordered={true}
                    loading={isFetching}
                    onChange={this.handleTableChange}
                  >
                    <Column
                     title="流水号"
                     dataIndex="EventID"
                     width={60}
                     className="eventid-column"
                     render={(text, record) => {
                       return (
                         <div>{text}<span className="icon-corner-mark" style={{
                           borderLeft: `10px solid ${colorMap[record.ColorLevel] || 'transparent'}`
                         }}></span></div>
                       );
                     }}
                   />
                    />
                    <Column
                      title="会员姓名"
                      dataIndex="UserName"
                      width={70}
                    />
                    <Column
                      title="手机号"
                      dataIndex="Mobile"
                      width={88}
                      render={(text) => {
                        return text.replace(/(\d{3})\d{4}(\d{3,})/, '$1****$2');
                      }}
                    />
                    <Column
                        title="企业名称"
                        dataIndex="RecruitName"
                    />
                    <Column
                      title="面试时间"
                      dataIndex="InterviewDate"
                    />
                    <Column
                      title="问题描述"
                      dataIndex="QuestionRemark"
                      width={225}
                    />
                    <Column
                        title="处理人"
                        dataIndex="DiplomatName"
                    />
                    <Column
                        title="处理对象"
                        dataIndex="Department"
                        render={
                          (text) => {
                            return text == 1 ? "业务部门" : text == 2 ? "补贴返费" : text == 3 ? "体验中心" : text == 4 ? "回访客服" : text == 6 ? "薪资组" : "用户体验官";
                          }
                        }
                    />
                    <Column
                        title="事件分类"
                        dataIndex="EventType"
                        render={
                          (text) => {
                            return text == 1 ? "工资待遇" :
                             text == 2 ?	"补贴咨询" : 
                             text == 3 ? "推荐费" : 
                             text == 4 ?	"报名咨询" : 
                             text == 5 ?	"劳务协助" : 
                             text == 6 ?	"离职事宜" : 
                             text == 7 ? "系统问题" : 
                             text == 8 ?	"其它" : 
                             text == 9 ? "面试状态" : 
                             text == 10 ? "录用条件" : 
                             text == 11 ? "体检、住宿" : 
                             text == 12 ? "周薪薪" : 
                             text == 13 ? "需求问题" : "";
                          }
                        }
                    />
                    <Column
                        title="发布时间"
                        dataIndex="CreateTime"
                        sorter={true}
                        sortOrder={orderInfo.key === 'CreateTime' ? (orderInfo.order === 1 ? 'ascend' : 'descend') : ''}
                    />
                    <Column
                        title="最后更新时间"
                        dataIndex="ModifyTime"
                    />
                    <Column
                        title="当前状态"
                        dataIndex="DealStatus"
                        render={(text, record) => {
                            return text === 2 || text === 3 ? '处理中' : EventDealStatusMap[text] || '';
                        }}
                    />
                    <Column
                        title="操作"
                        key="action"
                        render={(text, record) => {
                            return (
                              <a onClick={() => this.handleShowDetailModal(record)}>详情</a>
                            );
                        }}
                    />
                  </Table>
                </Col>
              </Row>

              <EventEmitModal
                recruitFilterList={recruitFilterList}
                visible={emitModalVisible}
                onOk={this.handleEmitEvent}
                onCancel={this.handleCancelEmitEvent}
              />

              <EventDetailModal
                visible={detailModalVisible}
                rowRecord={rowRecord}
                detailInfo={detailInfo}
                onCancel={this.handleHideDetailModal}
                onOk={this.handleSaveDetail}
                setRef={this.handleSetRef}
                scrollToBottom={this.scrollToBottom}
              />

            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      Name,
      Mobile,
      RecruitName,
      EventNumber,
      DealStatus,
      DiplomatName,
      InterviewDate,
      CreatedTime,
      Department,
      InterviewDateEnd
    } = props.eventListInfo.pageQueryParams;

    return {
      Name,
      Mobile,
      RecruitName,
      EventNumber,
      DealStatus,
      DiplomatName,
      InterviewDate,
      CreatedTime,
      Department,
      InterviewDateEnd
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.eventListInfo.pageQueryParams, fields)
    });
  }
})(EventList);
