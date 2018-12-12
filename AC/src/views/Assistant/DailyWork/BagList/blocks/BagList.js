import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import BagListService from 'SERVICE/Assistant/BagListService';

import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import bagListAction from 'ACTION/Assistant/BagListAction';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import getBrokerList from 'ACTION/Common/Employee/getBrokerList';

import { getAuthority } from 'CONFIG/DGAuthority';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

const { getBagList, getRecruitBasicCount } = bagListAction;
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
  Alert,
  Cascader
} from 'antd';
import { SSL_OP_TLS_BLOCK_PADDING_BUG, EDEADLK } from 'constants';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
const { Column, ColumnGroup } = Table;

const STATE_NAME = 'state_ac_bag_list';

const trackStatusMap = {
  '-1': '请选择',
  '1': '未结案',
  '2': '3天内无法联系',
  '3': '已入职',
  '4': '放弃',
  '5': '急需找工作',
  '6': '已有工作',
  '7': '学生',
  '8': '年后来面试'
};
class BagList extends React.PureComponent {
  constructor(props) {
    super(props);
    const { DGList } = getAuthority();

    this.state = {
      page: (this.props.bagListInfo.pageQueryParams.PageInfo.Offset / this.props.bagListInfo.pageQueryParams.PageInfo.Count) + 1,
      pageSize: 40,
      TodayEnrolCnt: 0,
      TommrowEnrolCnt: 0,
      DGList
    };
  }

  componentWillMount() {
    const {
      brokerInfo,
      bagListInfo
    } = this.props;

    if (brokerInfo.brokerList.length) {
      this.fetchBagList({
        ...bagListInfo.pageQueryParams,
        brokerList: brokerInfo.brokerList
      });
      this.getCountInfo('all', brokerInfo.brokerList);
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
      this.fetchBagList({
        ...this.props.bagListInfo.pageQueryParams,
        brokerList
      });
      this.getCountInfo('all', brokerList);
    }

    if (getBrokerListFetch.status === 'error') {
      setFetchStatus('state_mams_employeeFilterList', 'getBrokerListFetch', 'close');
      message.error(getBrokerListFetch.response.Desc || '获取经纪人列表失败');
    }
  }

  fetchBagList = (queryParams = {}) => {
    const {
      MatchUserName = {},
      UserMobile = {},
      RecruitTmpID = {},
      CaseStatus = {},
      ExpectedDate,
      DepartmentGroup,
      BrokerAccount,
      PageInfo,
      brokerList
    } = queryParams;

    const [departmentId, groupId] = DepartmentGroup.value || [];

    getBagList({
      BrokerIDList: brokerList.map(broker => +broker.BrokerID),
      CaseStatus: CaseStatus.value ? +CaseStatus.value : -1,
      ExpectedDays: '',
      BrokerAccount: BrokerAccount.value || '',
      DepartID: (departmentId === -9999 || departmentId == null) ? 0 : departmentId,
      GroupID: groupId == null ? 0 : groupId,
      ExpectedDaysStart: ExpectedDate.value && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
      ExpectedDaysEnd: ExpectedDate.value && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
      MatchUserName: MatchUserName.value || '',
      UserMobile: UserMobile.value || '',
      PositionName: RecruitTmpID.value ? RecruitTmpID.value.text : '',
      PageInfo
    });
  }

  getCountInfo(type, brokerList) {
    const tomorrow = moment().add(1, 'days');
    const today = moment();
    const getBagListService = BagListService.getBagList;
    let queryParams = {
      BrokerIDList: brokerList.map(broker => +broker.BrokerID),
      CaseStatus: 1,
      ExpectedDays: '',
      ExpectedDaysStart: '',
      ExpectedDaysEnd: '',
      BrokerAccount: '',
      DepartID: 0,
      GroupID: 0,
      MatchUserName: '',
      UserMobile: '',
      PositionName: '',
      PageInfo: {
        Count: 40,
        Offset: 0
      }
    };

    switch (type) {
      case 'all':
        setTimeout(() => {
          getBagListService({
            ...queryParams,
            ExpectedDaysStart: tomorrow.format('YYYY-MM-DD'),
            ExpectedDaysEnd: tomorrow.format('YYYY-MM-DD')
          }).then((res) => {
            this.setState({
              TommrowEnrolCnt: res.Data.PageInfo.TotalCount
            });
          });
        }, 500);

        setTimeout(() => {
          getBagListService({
            ...queryParams,
            ExpectedDaysStart: today.format('YYYY-MM-DD'),
            ExpectedDaysEnd: today.format('YYYY-MM-DD')
          }).then((res) => {
            this.setState({
              TodayEnrolCnt: res.Data.PageInfo.TotalCount
            });
          });
        }, 1500);
        break;
      case 'tomorrow':
        setTimeout(() => {
          getBagListService({
            ...queryParams,
            ExpectedDaysStart: tomorrow.format('YYYY-MM-DD'),
            ExpectedDaysEnd: tomorrow.format('YYYY-MM-DD')
          }).then((res) => {
            this.setState({
              TommrowEnrolCnt: res.Data.PageInfo.TotalCount
            });
          });
        }, 500);
        break;
      case 'today':
        setTimeout(() => {
          getBagListService({
            ...queryParams,
            ExpectedDaysStart: today.format('YYYY-MM-DD'),
            ExpectedDaysEnd: today.format('YYYY-MM-DD')
          }).then((res) => {
            this.setState({
              TodayEnrolCnt: res.Data.PageInfo.TotalCount
            });
          });
        }, 500);
    }
  }

  handleSearch = () => {
    const {
      bagListInfo: {
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

    this.fetchBagList({
      ...pageQueryParams,
      PageInfo: {
        Offset: 0,
        Count: pageQueryParams.PageInfo.Count
      },
      brokerList: this.props.brokerInfo.brokerList
    });
    this.getCountInfo('all', this.props.brokerInfo.brokerList);
  }

  handleReset = () => {
    this.props.form.resetFields();
    setParams(STATE_NAME, {
      textDecorationType: ''
    });
  }

  handleTableChange = ({current, pageSize }) => {

    const {
      bagListInfo: {
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

    this.fetchBagList({
      ...pageQueryParams,
      PageInfo: {
        Count: pageSize,
        Offset: (current - 1) * pageSize
      },
      brokerList: this.props.brokerInfo.brokerList
    });
    this.getCountInfo('all', this.props.brokerInfo.brokerList);
  }

  quickQuery = (type) => {
    this.setState({
      page: 1
    });

    const { bagListInfo: { pageQueryParams }} = this.props;
    const expectedDate = type === 'today' ? moment() : moment().add(1, 'days');

    setParams(STATE_NAME, {
      textDecorationType: type,
      pageQueryParams: {
        MatchUserName: {
          value: ''
        },
        UserMobile: {
          value: ''
        },
        RecruitTmpID: {
          value: {
            value: '',
            text: ''
          }
        },
        CaseStatus: {
          value: '1'
        },
        ExpectedDate: {
          value: [expectedDate, expectedDate]
        },
        PageInfo: {
          Offset: 0,
          Count: pageQueryParams.PageInfo.Count
        }
      }
    });

    this.fetchBagList({
      MatchUserName: {
        value: ''
      },
      UserMobile: {
        value: ''
      },
      RecruitTmpID: {
        value: {
          value: '',
          text: ''
        }
      },
      CaseStatus: {
        value: '1'
      },
      ExpectedDate: {
        value: [expectedDate, expectedDate]
      },
      PageInfo: {
        Offset: 0,
        Count: pageQueryParams.PageInfo.Count
      },
      brokerList: this.props.brokerInfo.brokerList
    });
    this.getCountInfo(type, this.props.brokerInfo.brokerList);
  }

  render() {
    const {
      form: { getFieldDecorator },
      bagListInfo: {
        bagList,
        recordTotalCount,
        isFetching,
        textDecorationType
      }
    } = this.props;

    const {
      page,
      pageSize,
      DGList,
      TodayEnrolCnt,
      TommrowEnrolCnt
    } = this.state;

    const alertMsgNode = (
      <div>
        <span
          style={{
            color: "#108ee9",
            cursor: "pointer",
            textDecoration: textDecorationType === 'tomorrow' ? 'underline' : 'initial',
            fontWeight: textDecorationType === 'tomorrow' ? '500' : '400'
          }}
          onClick={() => this.quickQuery('tomorrow')}
        >明日预计入职</span>：{TommrowEnrolCnt}个，
        <span
          style={{
            color: "#108ee9",
            cursor: "pointer",
            textDecoration: textDecorationType === 'today' ? 'underline' : 'initial',
            fontWeight: textDecorationType === 'today' ? '500' : '400'
          }}
          onClick={() => this.quickQuery('today')}
        >今日预计入职</span>：{TodayEnrolCnt}个
      </div>
    );

    return (
      <div>
        <div className="ivy-page-title">
          <h1>口袋名单</h1>
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
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="追踪状态">
                              {getFieldDecorator('CaseStatus')(
                                <Select
                                  placeholder="请选择"
                                  size="default"
                                >
                                  {Object.keys(trackStatusMap).map((key) => {
                                    return (<Option value={key} key={key}>{trackStatusMap[key]}</Option>);
                                  })}
                                </Select>
                              )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="预计入职日期">
                            {getFieldDecorator('ExpectedDate')(
                              <RangePicker style={{width: "100%"}}/>
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
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="经纪人工号">
                            {getFieldDecorator('BrokerAccount')(
                                <Input placeholder="请输入经纪人工号" />
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
                  <Alert
                    message={alertMsgNode}
                    type="info"
                    showIcon
                    style={{
                      marginBottom: "10px"
                    }}
                  />
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Table
                    rowKey="UserRecruitBasicID"
                    dataSource={bagList}
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
                      dataIndex="seqNo"
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
                      title="追踪状态"
                      dataIndex="CaseStatus"
                      render={(text) => {
                        return text === -1 ? '' : trackStatusMap[text];
                      }}
                    />
                    <Column
                      title="预计入职日期"
                      dataIndex="ExpectedDays"
                    />
                    <Column
                      title="经纪人"
                      dataIndex="BrokerName"
                    />
                    <Column
                      title="经纪人工号"
                      dataIndex="BrokerAccount"
                    />
                    <Column
                      title="操作时间"
                      dataIndex="CreateTime"
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
      CaseStatus,
      DepartmentGroup,
      BrokerAccount
    } = props.bagListInfo.pageQueryParams;

    return {
      MatchUserName,
      UserMobile,
      RecruitTmpID,
      ExpectedDate,
      CaseStatus,
      DepartmentGroup,
      BrokerAccount
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.bagListInfo.pageQueryParams, fields)
    });
  }
})(BagList);
