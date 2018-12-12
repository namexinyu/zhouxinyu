import React from 'react';
import moment from 'moment';
import { browserHistory, Link } from 'react-router';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import DailyAction from 'ACTION/Assistant/DailyAction';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import getBrokerList from 'ACTION/Common/Employee/getBrokerList';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

const { getPickUpList } = DailyAction;
const { GetMAMSRecruitFilterList } = ActionMAMSRecruitment;

import {
  Button,
  Row,
  Col,
  message,
  Table,
  Select,
  Form,
  Input,
  DatePicker,
  Alert
} from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
const { Column, ColumnGroup } = Table;

const STATE_NAME = 'state_ac_pickUpList';

const visitStatusMap = {
  0: '待确认',
  1: '已确认',
  2: '已拒绝'
};

class PickUpList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.pickUpInfo.pageQueryParams.PageInfo.Offset / this.props.pickUpInfo.pageQueryParams.PageInfo.Count) + 1,
      pageSize: 40
    };
  }

  componentWillMount() {
    const {
      brokerInfo,
      pickUpInfo
    } = this.props;
    if (brokerInfo.brokerList.length) {
      this.fetchPickUpList({
        ...pickUpInfo.pageQueryParams,
        brokerList: brokerInfo.brokerList      
      });
    } else {
      getBrokerList({
        EmployeeID: employeeId
      });
    }
    GetMAMSRecruitFilterList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      brokerInfo: {
        getBrokerListFetch,
        brokerList
      }
    } = nextProps;

    if (getBrokerListFetch.status === 'success') {
      setFetchStatus('state_mams_employeeFilterList', 'getBrokerListFetch', 'close');
      this.fetchPickUpList({
        ...this.props.pickUpInfo.pageQueryParams,
        brokerList: brokerList      
      });
    }

    if (getBrokerListFetch.status === 'error') {
      setFetchStatus('state_mams_employeeFilterList', 'getBrokerListFetch', 'close');
      message.error(getBrokerListFetch.response.Desc || '获取经纪人列表失败');
    }
  }

  fetchPickUpList = (queryParams = {}) => {
    const {
      MatchUserName,
      UserMobile,
      RecruitTmpID,
      ExpectedDate,
      VisitStatus,
      IsSign,
      BrokerAccount,
      PageInfo,
      brokerList
    } = queryParams;

    getPickUpList({
      BrokerIDList: brokerList.map(broker => +broker.BrokerID),
      CheckinStatus: IsSign.value ? +IsSign.value : -1,
      MatchUserName: MatchUserName.value || '',
      UserMobile: UserMobile.value || '',
      PositionName: RecruitTmpID.value ? RecruitTmpID.value.text : '',
      PreCheckinTimeStart: ExpectedDate.value && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
      PreCheckinTimeEnd: ExpectedDate.value && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
      PreCheckinAddr: '',
      EmployeeID: BrokerAccount.value ? +BrokerAccount.value : 0,
      VisitStatus: VisitStatus.value ? +VisitStatus.value : -1,
      PageInfo
    });
  }

  handleSearch = () => {
    const {
      pickUpInfo: {
        pageQueryParams
      }
    } = this.props;

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

    this.fetchPickUpList({
      ...pageQueryParams,
      PageInfo: {
        Offset: 0,
        Count: pageQueryParams.PageInfo.Count
      },
      brokerList: this.props.brokerInfo.brokerList
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  handleTableChange = ({current, pageSize }) => {
    const {
      pickUpInfo: {
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
        PageInfo: {
          Count: pageSize,
          Offset: (current - 1) * pageSize
        }
      }
    });

    this.fetchPickUpList({
      ...pageQueryParams,
      PageInfo: {
        Count: pageSize,
        Offset: (current - 1) * pageSize
      },
      brokerList: this.props.brokerInfo.brokerList
    });
  }

  render() {

    const {
      form: { getFieldDecorator },
      pickUpInfo: {
        pickUpList = [],
        recordTotalCount,
        isFetching
      }
    } = this.props;
    const {
      page,
      pageSize
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>预签到名单</h1>
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
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="预签到日期">
                            {getFieldDecorator('ExpectedDate')(
                              <RangePicker style={{width: "100%"}}/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="会员姓名">
                            {getFieldDecorator('MatchUserName')(
                                <Input placeholder="请输入会员姓名" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="会员手机号码">
                            {getFieldDecorator('UserMobile', {
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
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="报名企业">
                            {getFieldDecorator('RecruitTmpID')(
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
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="经纪人">
                            {getFieldDecorator('BrokerAccount')(
                                <Input placeholder="请输入经纪人工号" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="回访状态">
                                {getFieldDecorator('VisitStatus')(
                                    <Select size="default" placeholder="请选择">
                                        <Option value="-1">全部</Option>
                                        {
                                            Object.keys(visitStatusMap).map((key) => {
                                                return (
                                                    <Option key={key} value={key}>{visitStatusMap[key]}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="是否签到">
                                {getFieldDecorator('IsSign')(
                                    <Select
                                        placeholder="请选择"
                                        size="default"
                                    >
                                        <Option value="-1">全部</Option>
                                        <Option value="0">未签到</Option>
                                        <Option value="1">已签到</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} style={{textAlign: 'right'}}>
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
                    rowKey={record => record.UserPreOrderID}
                    dataSource={pickUpList}
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
                      title="序号"
                      width={42}
                      render={(text, record, index) => {
                        return (index + 1) + pageSize * (page - 1);
                      }}
                    />
                    <Column
                      title="会员姓名"
                      dataIndex="UserName"
                      render={(text, record) => {
                        return (
                          <Link to={`/ac/member/detail/${record.BrokerID}/${record.UserID}`}>{record.UserName || record.UserCallName || record.UserNickName}</Link>
                        );
                      }}
                    />
                    <Column
                      title="会员手机号码"
                      dataIndex="UserMobile"
                      render={(text, record) => {
                        return text.replace(/(\d{3})\d{4}(\d{3,})/, '$1****$2');
                      }}
                    />
                    <Column
                      title="报名企业"
                      dataIndex="PositionName"
                    />
                    <Column
                      title="预签到地址"
                      dataIndex="PreCheckinAddr"
                    />
                    <Column
                      title="预签到日期"
                      dataIndex="PreCheckinTime"
                      render={(text, record) => {
                        return record.PreCheckinTime && moment(record.PreCheckinTime).isValid() ? moment(record.PreCheckinTime).format('YYYY-MM-DD') : '';
                      }}
                    />
                    <Column
                      title="回访状态"
                      dataIndex="VisitStatus"
                      render={(text) => {
                        return (text == null || text == -1) ? '' : visitStatusMap[text];
                      }}
                    />
                    <Column
                      title="回访备注"
                      dataIndex="ReplyContent"
                    />
                    <Column
                      title="是否签到"
                      dataIndex="CheckinStatus"
                      render={(text) => {
                        return (text == null || text == -1) ? '' : ['未签到', '已签到'][text];
                      }}
                    />
                    <Column
                      title="经纪人"
                      dataIndex="BrokerName"
                    />
                  </Table>
                </Col>
              </Row>

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
      MatchUserName,
      UserMobile,
      RecruitTmpID,
      ExpectedDate,
      VisitStatus,
      IsSign,
      BrokerAccount
    } = props.pickUpInfo.pageQueryParams;

    return {
      MatchUserName,
      UserMobile,
      RecruitTmpID,
      ExpectedDate,
      VisitStatus,
      IsSign,
      BrokerAccount
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.pickUpInfo.pageQueryParams, fields)
    });
  }
})(PickUpList);
