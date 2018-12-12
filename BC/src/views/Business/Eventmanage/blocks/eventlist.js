import React from 'react';
import moment from 'moment';

import { CONFIG } from 'mams-com';
const { AppSessionStorage } = CONFIG;
import { EventTypeMap, EventDealStatusMap } from "UTIL/constant";


import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import EventDetailModal from './EventDetailModal';

import setParams from 'ACTION/setParams';
import getEventList from "ACTION/Common/Management/eventlist";
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import EventNewlyAddedModal from "./EventNewlyAddedModal";
import EventService from 'SERVICE/Business/Management/eventmanagement';

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
  Tooltip,
  Icon,
  message,
  Radio,
  Checkbox
} from 'antd';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const {MonthPicker} = DatePicker;
const RangePicker = DatePicker.RangePicker;
import CommonAction from 'ACTION/Business/Common';
const STATE_NAME = 'state_broker_eventlist';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
const {
  getRecruitSimpleList,
  getLaborSimpleList,
  getUserMobileNumber
} = CommonAction;
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

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
      DutyDepartment: 0,
      page: (this.props.eventListInfo.pageQueryParams.RecordIndex / this.props.eventListInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      rowRecord: {},
      detailInfo: {},
      isEndEvent: false,
      detailModalVisible: false,
      EventNewlyAddedModal: false,
      queryParams: {
        Department: {value: 1}
      }
    };
  }

  componentWillMount() {
    getLaborSimpleList();
    GetMAMSRecruitFilterList();
    this.fetchEventList(this.props.eventListInfo.pageQueryParams);
  }

  componentDidMount() {
    EventService.GetMyDutyDepartment().then((data) => {
      this.setState({
        DutyDepartment: data.Data.DutyDepartment || 0
      });
    });
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
      EventType,
      BrokerName,
      InterviewDate,
      CreatedTime,
      orderInfo,
      RecordIndex,
      RecordSize,
      RelatedToMe,
      Department,
      DiplomatName,
      YearMonthEnd,  
      YearMonthStart, 
      InterviewDateEnd, 
      LaborID,
      Satisfaction,
      AbnormalType
    } = queryParams;
    console.log(LaborID, "vvvvvvvvvvvvvvvvvvvvvvvvvvv");
    const dealStatusValueMap = {
      1: [1],
      2: [2],
      3: [3],
      4: [4, 5]
    };
    getEventList({
      DiplomatID: employeeId,
      BrokerName: BrokerName.value || '',
      DealStatus: DealStatus === 0 ? [0] : dealStatusValueMap[DealStatus],
      EventType: EventType.value != null ? +EventType.value : 0,
      BelongsMe: RelatedToMe.value ? 1 : 0,
      Mobile: Mobile.value || '',
      UserName: Name.value || '',
      EventID: EventNumber.value != null ? +EventNumber.value : 0,
      RecruitTmpID: RecruitName.value ? +RecruitName.value.value : 0,
      InterviewDate: (InterviewDate.value && InterviewDate.value !== "") ? InterviewDate.value.format("YYYY-MM-DD") : "",
      QueryStartDate: CreatedTime.value && CreatedTime.value.length && moment(CreatedTime.value[0]).isValid() ? moment(CreatedTime.value[0]).format('YYYY-MM-DD') : '',
      QueryEndDate: CreatedTime.value && CreatedTime.value.length && moment(CreatedTime.value[1]).isValid() ? moment(CreatedTime.value[1]).format('YYYY-MM-DD') : '',
      OrderType: +orderInfo.order,
      Department: Department.value * 1 || 0,
      DiplomatName: DiplomatName.value || "",
      YearMonthEnd: (YearMonthEnd.value && YearMonthEnd.value !== "") ? YearMonthEnd.value.format("YYYY-MM") : "",  
      YearMonthStart: (YearMonthStart.value && YearMonthStart.value !== "") ? YearMonthStart.value.format("YYYY-MM") : "", 
      InterviewDateEnd: (InterviewDateEnd.value && InterviewDateEnd.value !== "") ? InterviewDateEnd.value.format("YYYY-MM-DD") : "", 
      AbnormalType: AbnormalType.value * 1 || 0,
      LaborID: LaborID.value ? (LaborID.value !== "" ? LaborID.value.value * 1 : 0) : 0,
      Satisfaction: +(Satisfaction.value || 0),
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

  handleSwitchStatus = (type) => {
    setParams(STATE_NAME, {
      pageQueryParams: {
        ...this.props.eventListInfo.pageQueryParams,
        DealStatus: type
      }
    });
    this.fetchEventList({
      ...this.props.eventListInfo.pageQueryParams,
      DealStatus: type
    });
    
  }

  handleShowDetailModal = (record) => {
    EventService.getEventdetail({
      DiplomatID: employeeId,
      EventID: record.EventID
    }).then((res) => {
      if (res.Code === 0) {
        this.setState({
          rowRecord: record,
          isEndEvent: true,
          detailModalVisible: true,
          detailInfo: {
            Detail: (res.Data || {}).Detail || {},
            History: (res.Data || {}).History || []
          }
        }, () => {
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
    // this.fetchEventList(this.props.eventListInfo.pageQueryParams);
  }

  handleHideDetailModal = () => {
    this.setState({
      rowRecord: {}, 
      detailInfo: {},
      isEndEvent: false,
      detailModalVisible: false
    });
    this.fetchEventList(this.props.eventListInfo.pageQueryParams);
  }

  handleSetRef = (node) => {
    this.messageBox = node;
  }

  scrollToBottom(element) {
    if (element.scrollHeight > element.clientHeight) {
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  }

  handleChangeEndStatus = (value) => {
    this.setState({
      isEndEvent: value
    });
  }
  onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }
  EventNewlyAddedModal = (type) => {
    this.setState({
      EventNewlyAddedModal: type
    });
  }
  setParams = (queryParams) => {
    this.setState({
        queryParams: queryParams
    });
  }
  handleExportLog = () => {
    const {
      Name,
      Mobile,
      RecruitName,
      EventNumber,
      DealStatus,
      EventType,
      BrokerName,
      InterviewDate,
      CreatedTime,
      orderInfo,
      RecordIndex,
      RecordSize,
      RelatedToMe,
      Department,
      DiplomatName,
      Satisfaction,
      YearMonthEnd,  
      YearMonthStart, 
      InterviewDateEnd, 
      AbnormalType,
      LaborID
    } = this.props.eventListInfo.pageQueryParams;
    console.log(LaborID, "aaaaaaaaaaaaaaaaaaaaaaaaaaa");
    const dealStatusValueMap = {
      1: [1],
      2: [2],
      3: [3],
      4: [4, 5]
    };
    EventService.EventList({
      DiplomatID: employeeId,
      BrokerName: BrokerName.value || '',
      DealStatus: DealStatus === 0 ? [0] : dealStatusValueMap[DealStatus],
      EventType: EventType.value != null ? +EventType.value : 0,
      BelongsMe: RelatedToMe.value ? 1 : 0,
      Mobile: Mobile.value || '',
      UserName: Name.value || '',
      EventID: EventNumber.value != null ? +EventNumber.value : 0,
      RecruitTmpID: RecruitName.value ? +RecruitName.value.value : 0,
      InterviewDate: (InterviewDate.value && InterviewDate.value !== "") ? InterviewDate.value.format("YYYY-MM-DD") : "",
      QueryStartDate: CreatedTime.value && CreatedTime.value.length && moment(CreatedTime.value[0]).isValid() ? moment(CreatedTime.value[0]).format('YYYY-MM-DD') : '',
      QueryEndDate: CreatedTime.value && CreatedTime.value.length && moment(CreatedTime.value[1]).isValid() ? moment(CreatedTime.value[1]).format('YYYY-MM-DD') : '',
      OrderType: +orderInfo.order,
      Department: Department.value * 1 || 0,
      DiplomatName: DiplomatName.value || "",
      YearMonthEnd: (YearMonthEnd.value && YearMonthEnd.value !== "") ? YearMonthEnd.value.format("YYYY-MM") : "",  
      YearMonthStart: (YearMonthStart.value && YearMonthStart.value !== "") ? YearMonthStart.value.format("YYYY-MM") : "", 
      InterviewDateEnd: (InterviewDateEnd.value && InterviewDateEnd.value !== "") ? InterviewDateEnd.value.format("YYYY-MM-DD") : "", 
      AbnormalType: AbnormalType.value * 1 || 0,
      LaborID: LaborID ? (LaborID.value !== "" ? LaborID.value.value * 1 : 0) : 0,
      Satisfaction: +(Satisfaction.value || 0)
    }).then((data) => {
      if (data.Code == 0) {
        message.success("导出成功");
        window.open(data.Data.Url, '_blank');
      }
    }).catch((err) => {
      message.error(err.Desc || "导出失败");
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      allRecruitList,
      eventListInfo: {
        eventList,
        eventCountInfo,
        pageQueryParams: {
          DealStatus,
          orderInfo
        },
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      detailModalVisible,
      detailInfo,
      isEndEvent,
      rowRecord,
      page,
      pageSize
    } = this.state;
     
    const warmInfo = (
      <ul>
        <li>1.点击【处理完毕】后，系统划转至【处理完毕】类目中；</li>
        <li>2.未点击【处理完毕】，则该事件始终处于【处理中】类目中；</li>
        <li>3.点击【处理完毕】后，当经纪人有回复，则该事件仍处于【处理中】类目中；</li>
        <li>4.【已结案】【已裁决】均为【已处理状态】。</li>
      </ul>
    );

    return (
      <div style={{padding: 15}}>
        <Row style={{
          backgroundColor: '#fff',
          padding: 12
        }}>
          <Col span={24}>
            <div>
              <Row>
                <Col span={24}>
                  <div>
                    <Form>
                      <Row gutter={8}>
                        <Col span={6}>
                          <FormItem className="form-item__zeromb" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="会员姓名" style={{marginBottom: 10}}>
                            {getFieldDecorator('Name')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="手机号">
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
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="面试企业">
                            {getFieldDecorator('RecruitName')(
                              <AutoCompleteSelect allowClear={true} optionsData={{
                                valueKey: 'RecruitTmpID',
                                textKey: 'RecruitName',
                                dataArray: allRecruitList
                              }}/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="流水号">
                            {getFieldDecorator('EventNumber')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        {/* <Col span={6}>
                          <FormItem label="当前状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('DealStatus')(
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
                        </Col> */}
                        <Col span={6}>
                          <FormItem label="事件分类" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                            {getFieldDecorator('EventType')(
                              <Select
                                  placeholder="请选择"
                                  size="default"
                              >
                                <Option key="0" value="0">全部</Option>
                                {
                                  Object.keys(EventTypeMap).filter(k => +k !== 8).map((key) => {
                                    return (
                                      <Option key={key} value={key}>{EventTypeMap[key]}</Option>
                                    );
                                  })
                                }
                                <Option key={8} value="8">其他</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="发布人">
                            {getFieldDecorator('BrokerName')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="处理人">
                            {getFieldDecorator('DiplomatName')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="处理对象">
                            {getFieldDecorator('Department')(
                              <Select>
                                <Option value={"0"}>全部</Option>
                                {/* <Option value={"3"}>体验中心</Option> */}
                                <Option value={"2"}>补贴/推荐费</Option>
                                <Option value={"4"}>回访客服</Option>
                                <Option value={"1"}>业务客服</Option>
                                <Option value={"5"}>用户体验官</Option>
                                <Option value={"6"}>薪资组</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                       <Col span={6}>
                              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="劳务公司">
                                  {getFieldDecorator('LaborID')(
                                      <AutoCompleteInput
                                          textKey="ShortName" valueKey="LaborID"
                                          dataSource={this.props.common.LaborSimpleList}/>
                                  )}
                              </FormItem>
                          </Col>
                        
                        {
                           this.state.DutyDepartment == 6 && <Col span={6}>
                           <FormItem label="异常类型" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                             {getFieldDecorator("AbnormalType", {
                                 initialValue: ""
                                 })(
                                     <Select placeholder="请选择异常类型" className="w-100" allowClear={true}>
                                         <Option value="1">少发</Option>
                                         <Option value="2">未发</Option>
                                     </Select>
                                 )}
                           </FormItem>
                         </Col>
                        }
                        
                        <Col span={6}>
                          <FormItem label="面试日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                            <div className="flex">
                              {getFieldDecorator("InterviewDate")(
                                <DatePicker />
                              )}
                              ~
                              {getFieldDecorator("InterviewDateEnd")(
                                <DatePicker />
                              )}
                            </div>
                            
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem label="发布时间" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                            {getFieldDecorator("CreatedTime")(
                              <RangePicker />
                            )}
                          </FormItem>
                        </Col>
                        {
                          this.state.DutyDepartment == 6 && <Col span={6}>
                          <FormItem label="发薪月份" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                            <div className="flex">
                              {getFieldDecorator("YearMonthStart")(
                                <MonthPicker />
                              )}
                              ~
                              {getFieldDecorator("YearMonthEnd")(
                                <MonthPicker />
                              )}
                            </div>
                          </FormItem>
                        </Col>
                        }

                        <Col span={6}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="评价">
                            {getFieldDecorator('Satisfaction')(
                              <Select>
                                <Option value="0">全部</Option>
                                <Option value="1">好评</Option>
                                <Option value="3">一般</Option>
                                <Option value="2">差评</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        
                        <Col span={6}>
                          <FormItem label="与我相关" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                            {getFieldDecorator("RelatedToMe")(
                              <RadioGroup>
                                <RadioButton value={true}>是</RadioButton>
                                <RadioButton value={false}>全部</RadioButton>
                              </RadioGroup>
                            )}
                          </FormItem>
                        </Col>
                        
                      </Row>

                      <Row>
                        <Col span={17}>
                          <div>
                            <Tooltip placement="topLeft" title={warmInfo}>
                              <Icon type="question-circle" className="mr-10" />
                            </Tooltip>

                            <Button className="mr-16" type="primary" size="large" ghost={DealStatus !== 0}
                              onClick={() => this.handleSwitchStatus(0)}>全部({(eventCountInfo.DOING || 0) + (eventCountInfo.DONE || 0) + (eventCountInfo.TODO || 0) + (eventCountInfo.DONE2 || 0)})</Button>

                            <Button className="mr-16" type="primary" size="large" ghost={DealStatus !== 1}
                              onClick={() => this.handleSwitchStatus(1)}>待处理({eventCountInfo.TODO || 0})</Button>

                            <Button className="mr-16" type="primary" size="large" ghost={DealStatus !== 2}
                              onClick={() => this.handleSwitchStatus(2)}>处理中({eventCountInfo.DOING || 0})</Button>

                            <Button className="mr-16" type="primary" size="large" ghost={DealStatus !== 3}
                              onClick={() => this.handleSwitchStatus(3)}>处理完毕({eventCountInfo.DONE2 || 0})</Button>

                            <Button className="mr-16" type="primary" size="large" ghost={DealStatus !== 4}
                              onClick={() => this.handleSwitchStatus(4)}>已处理({eventCountInfo.DONE || 0})</Button>

                          </div>
                        </Col>
                        
                        <Col span={6} offset={1}>
                          <FormItem style={{textAlign: 'right'}}>
                            <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                          </FormItem>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <Button onClick={() => this.EventNewlyAddedModal(true)}>事件发布</Button>
                <Button onClick={() => this.handleExportLog()}>导出</Button>
              </div>
              
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
                      render={(text, record, index) => {
                        return (
                          <div>{text}<span className="icon-corner-mark" style={{
                            borderLeft: `10px solid ${colorMap[record.ColorLevel] || 'transparent'}`
                          }}></span></div>
                        );
                      }}
                    />
                    <Column
                      title="会员姓名"
                      dataIndex="UserName"
                      width={68}
                    />
                    <Column
                      title="手机号"
                      dataIndex="Mobile"
                      width={85}
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
                      title="劳务公司"
                      dataIndex="LaborName"
                    />
                    <Column
                      title="问题描述"
                      dataIndex="QuestionRemark"
                      width={225}
                    />
                    <Column
                        title="发布人"
                        dataIndex="BrokerName"
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
                            return text == 1 ? "业务客服" : text == 2 ? "补贴/推荐费" : text == 3 ? "体验中心" : text == 4 ? "回访客服" : text == 6 ? "薪资组" : "用户体验官";
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
                          return EventDealStatusMap[text] || '';
                        }}
                    />
                    <Column
                        title="事件分类"
                        dataIndex="EventType"
                        render={(text, record) => {
                            return EventTypeMap[text] || '';
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

              <EventDetailModal
                visible={detailModalVisible}
                rowRecord={rowRecord}
                isEndEvent={isEndEvent}
                detailInfo={detailInfo}
                onCancel={this.handleHideDetailModal}
                onOk={this.handleSaveDetail}
                setRef={this.handleSetRef}
                scrollToBottom={this.scrollToBottom}
                onChangeEndStatus={this.handleChangeEndStatus}
              />
              <EventNewlyAddedModal 
              DutyDepartment={this.state.DutyDepartment}
              pageQueryParams={this.props.eventListInfo.pageQueryParams}
              fetchEventList={this.fetchEventList}
              queryParams={this.state.queryParams}
              setParams={this.setParams} 
              EventNewlyAddedModal={this.EventNewlyAddedModal} 
              visible={this.state.EventNewlyAddedModal} />
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
      EventType,
      BrokerName,
      InterviewDate,
      CreatedTime,
      RelatedToMe,
      DiplomatName,
      YearMonthEnd,  
      YearMonthStart, 
      InterviewDateEnd, 
      LaborID,
      Satisfaction,
      AbnormalType
    } = props.eventListInfo.pageQueryParams;

    return {
      Name,
      Mobile,
      RecruitName,
      EventNumber,
      EventType,
      BrokerName,
      InterviewDate,
      CreatedTime,
      RelatedToMe,
      DiplomatName,
      YearMonthEnd,  
      YearMonthStart, 
      InterviewDateEnd, 
      LaborID,
      Satisfaction,
      AbnormalType
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.eventListInfo.pageQueryParams, fields)
    });
  }
})(EventList);
