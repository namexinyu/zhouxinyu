import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberNeedList from 'ACTION/Common/Assistance/MemberNeed';

import { getAuthority } from 'CONFIG/DGAuthority';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

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

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
const { Column, ColumnGroup } = Table;

const STATE_NAME = 'state_ac_memberneed';

const needTypeMap = {
  '1': '一键来接',
  '2': '新注册',
  '3': '报名',
  '4': '关注',
  '5': '提问',
  '6': '反馈',
  '7': '求助',
  '8': '划转'
};

class MemberNeed extends React.PureComponent {
  constructor(props) {
    super(props);
    const { DGList } = getAuthority();

    this.state = {
      page: (this.props.memberNeedInfo.pageQueryParams.RecordIndex / this.props.memberNeedInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      DGList
    };
  }

  componentWillMount() {
    const {
      memberNeedInfo
    } = this.props;

    this.fetchMemberNeedList(this.props.memberNeedInfo.pageQueryParams);
  }

  fetchMemberNeedList = (queryParams = {}) => {
    const {
      MatchUserName = {},
      UserMobile = {},
      BrokerHandleStatus = {},
      CreatedDate,
      DepartmentGroup,
      BrokerAccount,
      RecordIndex,
      RecordSize
    } = queryParams;

    const [departmentId, groupId] = DepartmentGroup.value || [];

    getMemberNeedList({
        UserName: MatchUserName.value || '',
        Mobile: UserMobile.value || '',
        BrokerAccount: BrokerAccount.value || '',
        DepartID: (departmentId === -9999 || departmentId == null) ? 0 : departmentId,
        GroupID: groupId == null ? 0 : groupId,
        StartTime: CreatedDate.value && moment(CreatedDate.value[0]).isValid() ? moment(CreatedDate.value[0]).format('YYYY-MM-DD') : '',
        EndTime: CreatedDate.value && moment(CreatedDate.value[1]).isValid() ? moment(CreatedDate.value[1]).format('YYYY-MM-DD') : '',
        MsgHandleStatus: BrokerHandleStatus.value ? +BrokerHandleStatus.value : -1,
        RecordIndex,
        RecordSize
    });
  }

  handleSearch = () => {
    const {
      form: {
        getFieldError
      },
      memberNeedInfo: {
        pageQueryParams
      }
    } = this.props;

    if (getFieldError('CreatedDate')) {
      return;
    }

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

    this.fetchMemberNeedList({
      ...pageQueryParams,
      RecordIndex: 0,
      RecordSize: pageQueryParams.RecordSize
    });

  }

  handleReset = () => {
    this.props.form.resetFields(['MatchUserName', 'UserMobile', 'BrokerHandleStatus', 'DepartmentGroup', 'BrokerAccount']);
    this.props.form.setFieldsValue({
      CreatedDate: [moment().startOf('month'), moment()]
    });
  }

  handleTableChange = ({current, pageSize }) => {

    const {
      form: {
        getFieldError
      },
      memberNeedInfo: {
        pageQueryParams
      }
    } = this.props;

    if (getFieldError('CreatedDate')) {
      return;
    }

    this.setState({
      page: current,
      pageSize: pageSize
    });

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams,
        RecordIndex: (current - 1) * pageSize,
        RecordSize: pageSize
      }
    });

    this.fetchMemberNeedList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });

  }

  render() {
    const {
      form: { getFieldDecorator },
      memberNeedInfo: {
        memberNeedList,
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      page,
      pageSize,
      DGList
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>会员需求</h1>
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
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="创建时间">
                            {getFieldDecorator('CreatedDate', {
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
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="会员电话">
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
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="经纪人处理">
                            {getFieldDecorator('BrokerHandleStatus')(
                                <Select
                                  placeholder="请选择"
                                  size="default"
                                >
                                    <Option value="-1">全部</Option>
                                    <Option value="1">已处理</Option>
                                    <Option value="0">未处理</Option>
                                </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
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
                    dataSource={memberNeedList}
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
                      title="序号"
                      dataIndex="seqNo"
                      width={42}
                      render={(text, record, index) => {
                        return (index + 1) + pageSize * (page - 1);
                      }}
                    />
                    <Column
                      title="创建时间"
                      dataIndex="CreateTime"
                    />
                    <Column
                      title="会员姓名"
                      dataIndex="RealName"
                      render={(text, record) => {
                        return (
                          <Link to={`/ac/member/detail/${record.BrokerID}/${record.UserID}`}>{record.UserName || record.UserCallName || record.UserNickName}</Link>
                        );
                      }}
                    />
                    <Column
                      title="会员手机号码"
                      dataIndex="Mobile"
                    />
                    <Column
                      title="需求类型"
                      dataIndex="MsgType"
                      render={(text) => {
                        return needTypeMap[text] || '';
                      }}
                    />
                    <Column
                      title="需求说明"
                      dataIndex="Content"
                    />
                    <Column
                      title="需求状态"
                      dataIndex="MsgHandleStatus"
                      render={(text, record) => {
                          const handleStatusSet = ['未处理', '已处理'];
                          return (
                              <span style={{color: text == 0 ? 'red' : 'inherit'}}>{handleStatusSet[text] || ''}</span>
                          );
                      }}
                    />
                    <Column
                      title="经纪人"
                      dataIndex="NickName"
                    />
                    <Column
                      title="经纪人工号"
                      dataIndex="BrokerAccount"
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
      BrokerHandleStatus,
      CreatedDate,
      DepartmentGroup,
      BrokerAccount
    } = props.memberNeedInfo.pageQueryParams;

    return {
        MatchUserName,
        UserMobile,
        BrokerHandleStatus,
        CreatedDate,
        DepartmentGroup,
        BrokerAccount
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.memberNeedInfo.pageQueryParams, fields)
    });
  }
})(MemberNeed);
