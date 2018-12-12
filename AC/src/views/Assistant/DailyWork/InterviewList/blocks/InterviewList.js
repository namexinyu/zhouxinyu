import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import setParams from 'ACTION/setParams';
import DailyAction from 'ACTION/Assistant/DailyAction';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

const { GetMAMSRecruitFilterList } = ActionMAMSRecruitment;
const {
  getInterviewList,
  getInterviewCountdown
} = DailyAction;

import Mapping_Interview from 'CONFIG/EnumerateLib/Mapping_Interview';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import { getAuthority } from 'CONFIG/DGAuthority';

const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

import image_label from 'IMAGE/label_blue.png';

const {
  eJFFInterviewStatus,
  eInterviewStatus,
  eBrokerInterviewStatus,
  eWorkCardStatus,
  ePayType,
  eCountdownStatus
} = Mapping_Interview;

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  DatePicker,
  Modal,
  Tooltip,
  Cascader
} from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
const { Column, ColumnGroup } = Table;

const STATE_NAME = 'state_ac_interviewList';

class InterviewList extends React.PureComponent {
  constructor(props) {
    super(props);
    const { DGList } = getAuthority();

    this.state = {
      page: (this.props.interviewInfo.pageQueryParams.PageInfo.Offset / this.props.interviewInfo.pageQueryParams.PageInfo.Count) + 1,
      pageSize: 40,
      countdownVisible: false,
      countdownRecord: {},
      DGList
    };
  }

  componentWillMount() {
    this.fetchInterviewList(this.props.interviewInfo.pageQueryParams);
    GetMAMSRecruitFilterList();
  }

  fetchInterviewList = (queryParams = {}) => {
    const {
      ExpectedDate,
      RealName,
      Mobile,
      CheckinRecruitID,
      JFFInterviewStatus,
      BrokerInterviewStatus,
      InterviewStatus,
      BrokerAccount,
      PayType,
      DepartmentGroup,
      orderInfo,
      PageInfo
    } = queryParams;

    const [departmentId, groupId] = DepartmentGroup.value || [];

    getInterviewList({
      BrokerAccount: BrokerAccount.value || '',
      BrokerInterviewStatus: BrokerInterviewStatus.value != null ? +BrokerInterviewStatus.value : 0,
      CheckinRecruitID: CheckinRecruitID.value ? +CheckinRecruitID.value.value : 0,
      CheckinTimeStart: ExpectedDate.value && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
      CheckinTimeEnd: ExpectedDate.value && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
      DepartID: (departmentId === -9999 || departmentId == null) ? 0 : departmentId,
      GroupID: groupId == null ? 0 : groupId,
      // CheckinTimeStart: ExpectedDate.value && moment(ExpectedDate.value).isValid() ? moment(ExpectedDate.value).format('YYYY-MM-DD') : '',
      // CheckinTimeEnd: ExpectedDate.value && moment(ExpectedDate.value).isValid() ? moment(ExpectedDate.value).format('YYYY-MM-DD') : '',
      CountdownStatus: 0,
      EmployeeID: employeeId,
      ServiceInterviewStatus: InterviewStatus.value != null ? +InterviewStatus.value : -1,
      JFFInterviewStatus: JFFInterviewStatus.value != null ? +JFFInterviewStatus.value : -1,
      Mobile: Mobile.value || '',
      OrderParams: [{
        Key: orderInfo.key,
        Order: orderInfo.order
      }],
      PayType: PayType.value != null ? +PayType.value : -1,
      RealName: RealName.value || '',
      WorkCardStatus: 0,
      RecordSize: PageInfo.Count,
      RecordIndex: PageInfo.Offset
    });
  }

  handleSearch = () => {
    const {
      form: {
        getFieldError
      },
      interviewInfo: {
        pageQueryParams
      }
    } = this.props;

    if (getFieldError('ExpectedDate')) {
      return;
    }

    this.setState({
      page: 1,
      pageSize: pageQueryParams.PageInfo.Count
    });

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams,
        PageInfo: {
          Offset: 0,
          Count: pageQueryParams.PageInfo.Count
        }
      }
    });

    this.fetchInterviewList({
      ...pageQueryParams,
      PageInfo: {
        Offset: 0,
        Count: pageQueryParams.PageInfo.Count
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    // this.props.form.resetFields(['RealName', 'Mobile', 'CheckinRecruitID', 'JFFInterviewStatus', 'BrokerInterviewStatus', 'InterviewStatus', 'BrokerAccount', 'PayType']);
    // this.props.form.setFieldsValue({
    //   ExpectedDate: moment()
    // });
  }

  handleTableChange = ({current, pageSize }, filters, sorter) => {
    const {
      form: {
        getFieldError
      },
      interviewInfo: {
        pageQueryParams
      }
    } = this.props;

    if (getFieldError('ExpectedDate')) {
      return;
    }

    this.setState({
      page: current,
      pageSize: pageSize
    });

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams,
        PageInfo: {
          Count: pageSize,
          Offset: (current - 1) * pageSize
        },
        orderInfo: {
          key: sorter.columnKey ? sorter.columnKey : pageQueryParams.orderInfo.key,
          order: sorter.order ? (sorter.order === 'descend' ? 2 : 1) : 2
        }
      }
    });

    this.fetchInterviewList({
      ...pageQueryParams,
      PageInfo: {
        Count: pageSize,
        Offset: (current - 1) * pageSize
      },
      orderInfo: {
        key: sorter.columnKey ? sorter.columnKey : pageQueryParams.orderInfo.key,
        order: sorter.order ? (sorter.order === 'descend' ? 2 : 1) : 2
      }
    });
  }

  showCountdownModal = (record) => {// 查看补贴信息
    this.setState({
      countdownVisible: true,
      countdownRecord: record
    });
    getInterviewCountdown({
      InterviewID: record.InterviewID,
      UUID: record.UUID
    });
  }

  hideCountdownModal = (record) => {
    this.setState({
      countdownVisible: false,
      countdownRecord: {}
    });
  }

  transferContentInfo = (SubsidyData) => {
    const {
      CountdownStatus = 0,
      Amount = 0,
      PayType = 0,
      RecruitName = '',
      RemindDate = ''
    } = SubsidyData;
    let ret = {};

    // 0: '未开启',
    // 1: '进行中',
    // 2: '倒计时结束',
    // 3: '补贴申请中',
    // 4: '补贴已到余额',
    // 5: '补贴作废',
    // 6: '补贴结束',
    // 7: '180天后无效'

    switch (CountdownStatus) {
      case 1:
        ret = {
          titleRightContent: (<span className="color-orange"> {(Amount / 100).FormatMoney({fixed: 0})}元</span>),
          mainContent: this.getCountdownDate(RemindDate),
          subContent: '工作至倒计时结束，即可领取补贴'
        };
        break;
      case 2:
        ret = {
          titleRightContent: '',
          mainContent: (<span className="color-orange">{(Amount / 100).FormatMoney({fixed: 0})}元</span>),
          subContent: '倒计时结束，请尽快领取补贴'
        };
        break;
      case 3:
        ret = {
          titleRightContent: '',
          mainContent: (<span className="color-orange">{(Amount / 100).FormatMoney({fixed: 0})}元</span>),
          subContent: (<span className="color-blue">补贴审核中</span>)
        };
        break;
      case 4:
        ret = {
          titleRightContent: '',
          mainContent: (<span className="color-orange">{(Amount / 100).FormatMoney({fixed: 0})}元</span>),
          subContent: (<span className="color-blue">补贴已发放</span>)
        };
        break;
      case 5:
      case 6:
      case 7:
      case 8:
        ret = {
          titleRightContent: '',
          mainContent: (<span className="color-orange">{(Amount / 100).FormatMoney({fixed: 0})}元</span>),
          subContent: (<span className="color-blue">{eCountdownStatus[CountdownStatus]}</span>)
        };
        break;
      default:
        ret = {
          titleRightContent: '',
          mainContent: Amount ? '补贴未开启' : '当前没有补贴',
          subContent: ''
        };
    };
    return ret;
  }

  getCountdownDate = (date) => {
    if (date && moment(date).isValid()) {
      let hours = moment(date).diff(moment(), 'hours');
      return (
        <div>倒计时中&nbsp;&nbsp;
          <span className="color-orange">{Math.floor(hours / 24)}</span>&nbsp;&nbsp;天&nbsp;&nbsp;
          <span className="color-orange">{hours % 24}</span> &nbsp;&nbsp;小时
        </div>
      );
    } else {
      return '进行中';
    }
  }


  render() {
    const {
      form: { getFieldDecorator },
      interviewInfo: {
        interviewList,
        recordTotalCount,
        isFetching,
        pageQueryParams: {
          orderInfo
        },
        SubsidyData
      }
    } = this.props;

    const {
      page,
      pageSize,
      DGList,
      countdownVisible,
      countdownRecord: {
        CheckinTime,
        CheckinRecruitName
      }
    } = this.state;

    const {
      titleRightContent,
      mainContent,
      subContent
    } = this.transferContentInfo(SubsidyData);

    const {
      SubsidyStruct = {},
      SubsidyType = 0
    } = SubsidyData;
    
    return (
      <div>
        <div className="ivy-page-title">
          <h1>面试名单</h1>
        </div>
        <Row>
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
                      <Row>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="签到日期">
                            {getFieldDecorator('ExpectedDate', {
                              rules: [
                                {
                                  validator: (rule, value, cb) => {
                                    if (value) {
                                      const [start, end] = value;
                                      if (end.diff(start, 'days') > 30) {
                                        cb('时间区间最大为一个月');
                                      }
                                    }
                                    cb();
                                  }
                                }
                              ]
                            })(
                              // <DatePicker allowClear={false} style={{width: "100%"}} />
                              <RangePicker style={{width: "100%"}}/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="会员姓名">
                            {getFieldDecorator('RealName')(
                                <Input placeholder="请输入会员姓名" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="会员手机号码">
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
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="企业">
                            {getFieldDecorator('CheckinRecruitID')(
                              <AutoCompleteSelect allowClear={true} optionsData={{
                                valueKey: 'RecruitTmpID',
                                textKey: 'RecruitName',
                                dataArray: this.props.allRecruitList
                              }}/>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="业务处理">
                            {getFieldDecorator('JFFInterviewStatus')(
                              <Select size="default" placeholder="请选择">
                                <Option value="-1">全部</Option>
                                {
                                  Object.keys(eJFFInterviewStatus).map((key) => {
                                    return (
                                      <Option key={key} value={key}>{eJFFInterviewStatus[key]}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="经纪人处理">
                            {getFieldDecorator('BrokerInterviewStatus')(
                              <Select size="default" placeholder="请选择">
                                <Option value="0">全部</Option>
                                {
                                  Object.keys(eBrokerInterviewStatus).map((key) => {
                                    return (
                                      <Option key={key} value={key}>{eBrokerInterviewStatus[key]}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="客服回访">
                            {getFieldDecorator('InterviewStatus')(
                              <Select size="default" placeholder="请选择">
                                <Option value="-1">全部</Option>
                                {
                                  Object.keys(eInterviewStatus).map((key) => {
                                    return (
                                      <Option key={key} value={key}>{eInterviewStatus[key]}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="经纪人">
                            {getFieldDecorator('BrokerAccount')(
                              <Input placeholder="请输入经纪人工号" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="是否周薪薪">
                            {getFieldDecorator('PayType')(
                              <Select size="default" placeholder="请选择">
                                <Option value="-1">全部</Option>
                                {
                                  Object.keys(ePayType).map((key) => {
                                    return (
                                      <Option key={key} value={key}>{ePayType[key]}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="部门/组">
                            {getFieldDecorator('DepartmentGroup')(
                              <Cascader
                                allowClear={true}
                                placeholder="请选择"
                                options={DGList}
                              >
                              </Cascader>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6} offset={6} style={{textAlign: 'right'}}>
                          <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                          <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Table
                    rowKey={(record, index) => index}
                    dataSource={interviewList}
                    pagination={{
                      total: recordTotalCount,
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
                      title="会员姓名"
                      dataIndex="UserRealName"
                      render={(text, record) => {
                        return (
                          <Link to={`/ac/member/detail/${record.BrokerID}/${record.UserID}`}>{record.UserRealName || record.UserCallName || record.UserNickName || ''}</Link>
                        );
                      }}
                    />
                    <Column
                      title="会员手机号码"
                      dataIndex="Mobile"
                      render={(text, record) => {
                        return text.replace(/(\d{3})\d{4}(\d{3,})/, '$1****$2');
                      }}
                    />
                    <Column
                      title="企业"
                      dataIndex="CheckinRecruitName"
                    />
                    <Column
                      title="经纪人处理"
                      dataIndex="BrokerInterviewStatus"
                      render={(text) => {
                        return eBrokerInterviewStatus[text] || '';
                      }}
                    />
                    <Column
                      title="业务处理"
                      dataIndex="JFFInterviewStatus"
                      render={(text, record) => {
                        const colorMap = {
                          1: 'color-warning',
                          2: 'color-success',
                          3: 'color-danger',
                          4: 'color-danger'
                        };
                        return (
                          <span className={colorMap[text] || ''}>{eJFFInterviewStatus[text] || ''}</span>
                        );
                      }}
                    />
                    <Column
                      title="未通过原因"
                      dataIndex="InterviewComment"
                    />
                    <Column
                      title="客服回访"
                      dataIndex="ServiceInterviewStatus"
                      render={(text, record) => {
                        const colorMap = {
                          2: 'color-success',
                          3: 'color-danger',
                          4: 'color-danger'
                        };
                        return (
                          <span className={colorMap[text] || ''}>{eInterviewStatus[text] || ''}</span>
                        );
                      }}
                    />
                    <Column
                      title="回访记录"
                      dataIndex="CallBackRecord"
                      render={(text) => {
                        if (text && text.length > 21) {
                          return (
                            <Tooltip title={text}>
                              <span style={{
                                display: "inline-block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "300px"
                              }}>{text}</span>
                            </Tooltip>
                          );
                        }
                        return text;
                      }}
                    />
                    <Column
                      title="补贴信息"
                      dataIndex="CountdownStatus"
                      render={(text, record) => {
                        return (<a onClick={() => this.showCountdownModal(record)}>查看</a>);
                      }}
                    />
                    <Column
                      title="补贴类型"
                      dataIndex="SubsidyType"
                      render={(text, record) => {
                        const SubsidyTypeMap = {
                            1: '在职日',
                            2: '工作日'
                        };
                        return (
                            <span style={{color: text === 2 ? 'red' : 'inherit'}}>{SubsidyTypeMap[text] || ''}</span>
                        );
                      }}
                    />
                    <Column
                      title="工牌"
                      dataIndex="WorkCardStatus"
                      render={(text, record) => {
                        const colorMap = {
                          1: 'color-warning',
                          2: 'color-success',
                          3: 'color-danger',
                          4: 'color-danger'
                        };
                        return (
                          <span className={colorMap[text] || ''}>{eWorkCardStatus[text] || ''}</span>
                        );
                      }}
                    />
                    <Column
                      title="经纪人"
                      dataIndex="Broker"
                      render={(text, record) => {
                        return (<div>{`${record.BrokerNickName}(${record.BrokerAccount})`}</div>);
                      }}
                    />
                    <Column
                      title="签到日期"
                      dataIndex="CheckinTime"
                      sorter={true}
                      sortOrder={orderInfo.key === 'CheckinTime' ? (orderInfo.order === 1 ? 'ascend' : 'descend') : ''}
                      render={(text, record) => {
                        const t = record.CheckinTime;
                        return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD HH:mm') : '';
                      }}
                    />
                    <Column
                      title="面试日期"
                      dataIndex="InterviewDate"
                      sorter={true}
                      sortOrder={orderInfo.key === 'InterviewDate' ? (orderInfo.order === 1 ? 'ascend' : 'descend') : ''}
                      render={(text, record) => {
                        const t = record.InterviewDate;
                        return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD HH:mm') : '';
                      }}
                    />
                  </Table>
                </Col>
              </Row>

              <Modal
                visible={countdownVisible}
                title="补贴信息"
                width={480}
                onOk={() => this.hideCountdownModal()}
                footer={false}
                onCancel={() => this.hideCountdownModal()}>
                <div className="pl-8 pr-8">
                  <Row>
                    <Col span={12}>
                      <div style={{
                        marginBottom: '4px',
                        fontSize: '14px',
                        lineHeight: '22px'
                      }}>
                        面试日期:&nbsp; {CheckinTime && moment(CheckinTime).isValid() ? moment(CheckinTime).format('YYYY.MM.DD') : ''}
                      </div>
                      <span style={{
                        fontSize: '14px',
                        lineHeight: '14px',
                        background: 'url(' + image_label + ') no-repeat',
                        backgroundSize: '100% 100%',
                        color: '#ffffff',
                        padding: '5px 14px 5px 8px'
                      }}>{CheckinRecruitName}</span>
                    </Col>
                    <Col span={12}>
                      <div style={{
                        textAlign: 'right',
                        fontSize: '24px',
                        lineHeight: '50px'
                      }}>
                        {titleRightContent}
                      </div>
                    </Col>
                  </Row>

                  {SubsidyType === 2 ? (
                    <div style={{textAlign: 'center', padding: '14px 0'}}>
                      <div><span style={{color: 'red', fontSize: '24px'}}>{SubsidyStruct.AllWorkDay}</span>个工作日 <span>{this.state.Data.Amount}}</span>元</div>
                      <div>还剩<span style={{color: 'red', fontSize: '24px'}}>{SubsidyStruct.LastWorkDay}</span>个工作日</div>
                    </div>
                  ) : (
                    <Row className="mt-24 mb-16">
                      <Col span={24} className="text-center">
                        <div style={{
                          fontSize: '24px',
                          lineHeight: '36px',
                          marginBottom: '8px'
                        }}>{mainContent}</div>
                        <div style={{
                          fontSize: '14px',
                          lineHeight: '22px',
                          color: '#666666'
                        }}>&nbsp;{subContent}</div>
                      </Col>
                    </Row>
                  )}
                </div>
              </Modal>

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
      ExpectedDate,
      RealName,
      Mobile,
      CheckinRecruitID,
      JFFInterviewStatus,
      BrokerInterviewStatus,
      InterviewStatus,
      BrokerAccount,
      PayType,
      DepartmentGroup
    } = props.interviewInfo.pageQueryParams;

    return {
      ExpectedDate,
      RealName,
      Mobile,
      CheckinRecruitID,
      JFFInterviewStatus,
      BrokerInterviewStatus,
      InterviewStatus,
      BrokerAccount,
      PayType,
      DepartmentGroup
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.interviewInfo.pageQueryParams, fields)
    });
  }
})(InterviewList);
