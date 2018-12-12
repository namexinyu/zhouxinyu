import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import setParams from 'ACTION/setParams';
import presignTraceAction from 'ACTION/Assistant/PresignTraceAction';

const { getPresignTraceList } = presignTraceAction;

import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import { getAuthority } from 'CONFIG/DGAuthority';


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
  Modal
} from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
const { Column, ColumnGroup } = Table;

const STATE_NAME = 'state_ac_presign_trace';

class PresignTrace extends React.PureComponent {
  constructor(props) {
    super(props);
    const { eAuthDepartment } = getAuthority();
    this.state = {
      groupVisible: false,
      groupTraceData: [],
      groupTraceRecord: {},
      departmentsMap: eAuthDepartment
    };
  }

  componentWillMount() {
    this.fetchPresignTraceList(this.props.presignTraceInfo.pageQueryParams);
  }

  fetchPresignTraceList = (queryParams = {}) => {
    const {
      ExpectedDate,
      Department,
      PageInfo
    } = queryParams;

    getPresignTraceList({
      DateStart: ExpectedDate.value && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
      DateEnd: ExpectedDate.value && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
      DepartID: Department.value != null ? +Department.value : 0,
      PageInfo
    });
  }

  handleSearch = () => {
    const {
      presignTraceInfo: {
        pageQueryParams
      }
    } = this.props;

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams
      }
    });

    this.fetchPresignTraceList({
      ...pageQueryParams
    });
  }

  handleReset = () => {
    this.props.form.setFieldsValue({
      ExpectedDate: [moment().startOf('month'), moment()],
      Department: '0'
    });
  }

  packData = (data) => {
    const backGroupList = [{
      BrokerCount: '',
      GroupName: '',
      GroupID: '',
      BrokerList: [],
      PreOrderData: {
        CheckInNoPre: '',
        PreCheckIn: '',
        PreCheckInNoCome: '',
        RealCheckIn: ''
      }
    }];
    return data.reduce((wrap, current, currentIndex) => {
      return wrap.concat((current.GroupList || backGroupList).map((item, i) => {
        return {
          key: (wrap[wrap.length - 1] ? wrap[wrap.length - 1].key : 0) + i + 1,
          DepartID: current.DepartID,
          DepartName: current.DepartName,
          DepartBrokerCount: current.BrokerCount,
          DepartCheckInNoPre: current.PreOrderData.CheckInNoPre,
          DepartPreCheckIn: current.PreOrderData.PreCheckIn,
          DepartPreCheckInNoCome: current.PreOrderData.PreCheckInNoCome,
          DepartRealCheckIn: current.PreOrderData.RealCheckIn,
          GroupID: item.GroupID,
          GroupName: item.GroupName,
          GroupBrokerCount: item.BrokerCount,
          GroupCheckInNoPre: item.PreOrderData.CheckInNoPre,
          GroupPreCheckIn: item.PreOrderData.PreCheckIn,
          GroupPreCheckInNoCome: item.PreOrderData.PreCheckInNoCome,
          GroupRealCheckIn: item.PreOrderData.RealCheckIn,
          rowSpan: (current.GroupList || backGroupList).length,
          BrokerList: item.BrokerList
        };
      }));
    }, []);
  }

  renderDepartContent = (text, record, index, processedData) => {
    if (record.rowSpan == null || record.rowSpan === 1) {
      return {
        children: text,
        props: {}
      };
    }
    if (index === 0) {
      return {
        children: text,
        props: {
          rowSpan: record.rowSpan
        }
      };
    }
    const previousRow = processedData[index - 1];
    const nextRow = processedData[index + 1] || {};
    return {
      children: text,
      props: {
        rowSpan: (previousRow.DepartID !== record.DepartID && record.DepartID === nextRow.DepartID) ? record.rowSpan : 0
      }
    };
  }

  showGroupModal = (record) => {
    this.setState({
      groupVisible: true,
      groupTraceRecord: record,
      groupTraceData: (record.BrokerList || []).map((item, index) => {
        return {
          BrokerAccount: item.BrokerAccount,
          BrokerName: item.BrokerName,
          DepartName: record.DepartName,
          GroupName: record.GroupName,
          CheckInNoPre: item.PreOrderData.CheckInNoPre,
          PreCheckIn: item.PreOrderData.PreCheckIn,
          PreCheckInNoCome: item.PreOrderData.PreCheckInNoCome,
          RealCheckIn: item.PreOrderData.RealCheckIn
        };
      })
    });
  }

  hideGroupModal = () => {
    this.setState({
      groupVisible: false,
      groupTraceData: [],
      groupTraceRecord: {}
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      presignTraceInfo: {
        TotalInfo,
        presignTraceList
      }
    } = this.props;

    console.log(TotalInfo);
    

    const processedPresignTraceData = this.packData(presignTraceList);

    if (processedPresignTraceData.length) {
      processedPresignTraceData.push({
        DepartID: '',
        DepartName: '总计',
        DepartBrokerCount: TotalInfo.BrokerCount,
        DepartCheckInNoPre: TotalInfo.CheckInNoPre,
        DepartPreCheckIn: TotalInfo.PreCheckIn,
        DepartPreCheckInNoCome: TotalInfo.PreCheckInNoCome,
        DepartRealCheckIn: TotalInfo.RealCheckIn,
        GroupID: '',
        GroupName: '',
        GroupBrokerCount: '',
        GroupCheckInNoPre: '',
        GroupPreCheckIn: '',
        GroupPreCheckInNoCome: '',
        GroupRealCheckIn: ''
      });
    }

    const { groupVisible, groupTraceData, groupTraceRecord, departmentsMap } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>预签到走向</h1>
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
                      <Row gutter={32}>
                        <Col span={8}>
                          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label="日期">
                            {getFieldDecorator('ExpectedDate', {
                              rules: [{
                                validator: (rule, value, cb) => {
                                  const [start, end] = value;
                                  if (value && start.month() !== end.month()) {
                                    cb('日期范围选择不能跨月，只能在当前月份范围选择');
                                  }
                                  cb();
                                }
                              }]
                            })(
                              <RangePicker style={{width: "100%"}} />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label="部门">
                            {getFieldDecorator('Department')(
                              <Select
                                placeholder="请选择"
                                size="default"
                              >
                                <Option key="0" value="0">全部</Option>
                                {
                                  Object.keys(departmentsMap).map((key) => {
                                    return (
                                      <Option key={key} value={key}>{departmentsMap[key]}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8} style={{textAlign: 'right'}}>
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
                    dataSource={processedPresignTraceData}
                    pagination={false}
                    bordered={true}
                  >
                    <Column
                      title="部门"
                      dataIndex="DepartName"
                      render={(text, record, index) => {
                        return this.renderDepartContent(text, record, index, processedPresignTraceData);
                      }}
                    />
                    <Column
                      title="人数"
                      dataIndex="DepartBrokerCount"
                      render={(text, record, index) => {
                        return this.renderDepartContent(text, record, index, processedPresignTraceData);
                      }}
                    />
                    <Column
                      title="预签到"
                      dataIndex="DepartPreCheckIn"
                      render={(text, record, index) => {
                        return this.renderDepartContent(text, record, index, processedPresignTraceData);
                      }}
                    />
                    <Column
                      title="实签到"
                      dataIndex="DepartRealCheckIn"
                      render={(text, record, index) => {
                        return this.renderDepartContent(text, record, index, processedPresignTraceData);
                      }}
                    />
                    <Column
                      title="未签到实到"
                      dataIndex="DepartCheckInNoPre"
                      render={(text, record, index) => {
                        return this.renderDepartContent(text, record, index, processedPresignTraceData);
                      }}
                    />
                    <Column
                      title="预签到未到"
                      dataIndex="DepartPreCheckInNoCome"
                      render={(text, record, index) => {
                        return this.renderDepartContent(text, record, index, processedPresignTraceData);
                      }}
                    />
                    <Column
                      title="队名"
                      dataIndex="GroupName"
                      render={(text, record) => {
                        return (text ? <a onClick={() => this.showGroupModal(record)}>{text}</a> : '');
                      }}
                    />
                    <Column
                      title="人数"
                      dataIndex="GroupBrokerCount"
                    />
                    <Column
                      title="预签到"
                      dataIndex="GroupPreCheckIn"
                    />
                    <Column
                      title="实签到"
                      dataIndex="GroupRealCheckIn"
                    />
                    <Column
                      title="未签到实到"
                      dataIndex="GroupCheckInNoPre"
                    />
                    <Column
                      title="预签到未到"
                      dataIndex="GroupPreCheckInNoCome"
                    />
                  </Table>
                </Col>
              </Row>

              <Modal
                visible={groupVisible}
                width="80%"
                title={`${groupTraceRecord.DepartName}/${groupTraceRecord.GroupName}`}
                footer={false}
                onCancel={() => this.hideGroupModal()}>
                  <Table
                    rowKey={(record, index) => index}
                    dataSource={groupTraceData}
                    pagination={false}
                    bordered={true}
                  >
                    <Column
                      title="工号"
                      dataIndex="BrokerAccount"
                    />
                    <Column
                      title="昵称"
                      dataIndex="BrokerName"
                    />
                    <Column
                      title="部门"
                      dataIndex="DepartName"
                    />
                    <Column
                      title="队名"
                      dataIndex="GroupName"
                    />
                    <Column
                      title="预签到"
                      dataIndex="PreCheckIn"
                    />
                    <Column
                      title="实签到"
                      dataIndex="RealCheckIn"
                    />
                    <Column
                      title="未签到实到"
                      dataIndex="CheckInNoPre"
                    />
                    <Column
                      title="预签到未到"
                      dataIndex="PreCheckInNoCome"
                    />
                  </Table>
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
      Department,
      ExpectedDate
    } = props.presignTraceInfo.pageQueryParams;

    return {
      Department,
      ExpectedDate
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.presignTraceInfo.pageQueryParams, fields)
    });
  }
})(PresignTrace);
