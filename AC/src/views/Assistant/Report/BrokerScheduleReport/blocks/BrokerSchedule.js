import React from 'react';
import moment from 'moment';
import classnames from 'classnames';

import getMonthDays from 'UTIL/base/getMonthDays';
import ReportService from 'SERVICE/Assistant/ReportService';

import setParams from 'ACTION/setParams';
import ReportAction from 'ACTION/Assistant/ReportAction';

const {
  getBorkerScheduleList
} = ReportAction;

const {
  setBrokerSchedule
} = ReportService;

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import { getAuthority } from 'CONFIG/DGAuthority';

const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

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
  Cascader,
  Dropdown,
  Menu,
  message
} from 'antd';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { Column } = Table;

const STATE_NAME = 'state_ac_broker_schedule';

function disabledMonth(current) {
  return current && current.valueOf() > moment().add(1, 'month').toDate().getTime();
}

class BrokerSchedule extends React.PureComponent {
  constructor(props) {
    super(props);
    const { DGList } = getAuthority();

    this.state = {
      page: (this.props.scheduleInfo.pageQueryParams.RecordIndex / this.props.scheduleInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 20,
      scheduleStatusMap: {
        1: '上班',
        2: '休息',
        3: '请假',
        4: '门店'
      },
      DGList
    };
  }

  componentWillMount() {
    this.fetchScheduleList(this.props.scheduleInfo.pageQueryParams);
  }

  componentDidMount() {
    // setTimeout(() => {
    //   const {
    //     scheduleInfo: {
    //       scheduleList,
    //       totalInfo,
    //       monthDays
    //     }
    //   } = this.props;

    //   const antTbody = document.querySelector('.schedule-table .ant-table-tbody');
    //   if (scheduleList.length) {
    //     if (antTbody && antTbody.childNodes.length) {
    //       const statsElement = `<tr class="schedule-stats-row">
    //         <td>${totalInfo.BrokerNickName}</td>
    //         <td>${totalInfo.SleepDays}</td>
    //         ${monthDays.map(item => `<td>${totalInfo.DayStats[item.date]}</td>`).join('')}
    //       </tr>`;
    //       antTbody.insertAdjacentHTML('beforeend', statsElement);
    //       document.querySelector('.schedule-table .ant-table-fixed-left .ant-table-tbody').insertAdjacentHTML('beforeend', `<tr class="schedule-stats-row-fixed-left"><td>${totalInfo.BrokerNickName}</td><td>${totalInfo.SleepDays}</td></tr>`);
    //     }
    //   }
    // }, 0);
  }

  componentDidUpdate(prevProps) {
    const antTbody = document.querySelector('.schedule-table .ant-table-tbody');
    if (this.props.scheduleInfo.scheduleList.length && antTbody.childNodes.length && !document.querySelector('.schedule-stats-row')) {
      const statsElement = `<tr class="schedule-stats-row">
        <td>${this.props.scheduleInfo.totalInfo.BrokerNickName}</td>
        <td>${this.props.scheduleInfo.totalInfo.SleepDays}</td>
        ${this.props.scheduleInfo.monthDays.map(item => `<td>${this.props.scheduleInfo.totalInfo.DayStats[item.date]}</td>`).join('')}
      </tr>`;
      antTbody.insertAdjacentHTML('beforeend', statsElement);
      document.querySelector('.schedule-table .ant-table-fixed-left .ant-table-tbody').insertAdjacentHTML('beforeend', `<tr class="schedule-stats-row-fixed-left"><td>${this.props.scheduleInfo.totalInfo.BrokerNickName}</td><td>${this.props.scheduleInfo.totalInfo.SleepDays}</td></tr>`);
    }

    if (document.querySelector('.schedule-stats-row')) {
      if (!this.props.scheduleInfo.scheduleList.length) {
        document.querySelector('.schedule-stats-row').innerHTML = '';
        document.querySelector('.schedule-stats-row-fixed-left').innerHTML = '';
      } else {
        const {
          scheduleInfo: {
            monthDays,
            totalInfo
          }
        } = this.props;

        if (document.querySelector('.schedule-stats-row').innerHTML === '') {
          document.querySelector('.schedule-stats-row').innerHTML = `
            <td>${totalInfo.BrokerNickName}</td>
            <td>${totalInfo.SleepDays}</td>
            ${monthDays.map(item => `<td>${totalInfo.DayStats[item.date]}</td>`).join('')}
          `;
          document.querySelector('.schedule-stats-row-fixed-left').innerHTML = `
            <td>${totalInfo.BrokerNickName}</td>
            <td>${totalInfo.SleepDays}</td>
          `;
        } else {
          if (JSON.stringify(prevProps.scheduleInfo.totalInfoList) !== JSON.stringify(this.props.scheduleInfo.totalInfoList)) {
            document.querySelector('.schedule-stats-row').innerHTML = `
              <td>${totalInfo.BrokerNickName}</td>
              <td>${totalInfo.SleepDays}</td>
              ${monthDays.map(item => `<td>${totalInfo.DayStats[item.date]}</td>`).join('')}
            `;
            document.querySelector('.schedule-stats-row-fixed-left').innerHTML = `
              <td>${totalInfo.BrokerNickName}</td>
              <td>${totalInfo.SleepDays}</td>
            `;
          }
        }
      }
    }
  }

  fetchScheduleList = (queryParams = {}) => {
    const {
      Date,
      DepartmentGroup,
      BrokerAccount,
      RecordIndex,
      RecordSize
    } = queryParams;

    const [departmentId, groupId] = DepartmentGroup.value || [];

    getBorkerScheduleList({
      QueryDate: Date.value && moment(Date.value).isValid() ? moment(Date.value).format('YYYY-MM') : '',
      DepartID: (departmentId === -9999 || departmentId == null) ? 0 : departmentId,
      GroupID: groupId == null ? 0 : groupId,
      BrokerAccount: BrokerAccount.value || '',
      RecordSize: RecordSize,
      RecordIndex: RecordIndex
    });
  }

  handleSearch = () => {
    const {
      scheduleInfo: {
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
      },
      monthDays: pageQueryParams.Date.value && moment(pageQueryParams.Date.value).isValid() ? getMonthDays(moment(pageQueryParams.Date.value).year(), moment(pageQueryParams.Date.value).month() + 1) : getMonthDays()
    });

    this.fetchScheduleList({
      ...pageQueryParams,
      RecordIndex: 0,
      RecordSize: pageQueryParams.RecordSize
    });
  }

  handleReset = () => {
    this.props.form.setFieldsValue({
      Date: moment(),
      DepartmentGroup: [],
      BrokerAccount: ''
    });
  }

  handleTableChange = ({current, pageSize }) => {
    const {
      scheduleInfo: {
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
        RecordSize: pageSize
      }
    });

    this.fetchScheduleList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleDropdownVisible = (flag, index, date) => {    
    const {
      scheduleInfo: {
        scheduleList
      }
    } = this.props;
    setParams(STATE_NAME, {
      scheduleList: scheduleList.map((item, i) => {
        if (i === index) {
          item.WillInStatusMap[date].visible = flag;
        }
        return item;
      })
    });
  }

  handleMenuClick = (e, index, date, record) => {
    const {
      scheduleInfo: {
        scheduleList,
        pageQueryParams
      }
    } = this.props;

    setBrokerSchedule({
      BrokerID: record.BrokerID,
      EmployeeID: record.EmployeeID,
      QueryDate: pageQueryParams.Date.value && moment(pageQueryParams.Date.value).isValid() ? moment(pageQueryParams.Date.value).format('YYYY-MM') : '',
      TheDay: +date,
      WillInStatus: +e.key
    }).then((res) => {
      if (res.Code === 0) {
        message.success('修改排班成功！');
        setParams(STATE_NAME, {
          scheduleList: scheduleList.map((item, i) => {
            if (i === index) {
              item.WillInStatusMap[date].WillInStatus = +e.key;
              item.WillInStatusMap[date].visible = false;
            }
            return item;
          })
        });
        this.fetchScheduleList(this.props.scheduleInfo.pageQueryParams);
      } else {
        message.error(res.Desc || '出错了，请稍后尝试');        
      }
    }).catch((err) => {
      message.error(err.Desc || '出错了，请稍后尝试');
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      scheduleInfo: {
        scheduleList,
        pageQueryParams: {
          Date
        },
        monthDays,
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      page,
      pageSize,
      scheduleStatusMap,
      DGList
    } = this.state;
    
    return (
      <div>
        <div className="ivy-page-title">
          <h1>经纪人排班</h1>
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
                      <Row gutter={8}>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="日期">
                            {getFieldDecorator('Date')(
                              <MonthPicker placeholder="请选择" style={{width: '100%'}} disabledDate={disabledMonth} />
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
                          <Button type="primary" onClick={this.handleSearch}>搜索</Button>
                          <Button style={{marginLeft: 12}} onClick={this.handleReset}>重置</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Table
                    className="schedule-table"
                    rowClassName={() => 'schedule-table-row'}
                    rowKey={(record, index) => index}
                    dataSource={scheduleList}
                    scroll={{x: 2000}}
                    pagination={{
                      total: RecordCount,
                      defaultPageSize: pageSize,
                      defaultCurrent: page,
                      current: page,
                      pageSize: pageSize,
                      pageSizeOptions: ['20', '40', '60'],
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
                      title="昵称"
                      dataIndex="BrokerNickName"
                      fixed="left"
                      width={230}
                      render={(text, record) => {
                        const { DepartName, GroupName, EmployeeName, BrokerName } = record;
                        return `${DepartName}/${GroupName}/${EmployeeName}-${BrokerName}`;
                      }}
                    />
                    <Column
                      title="休息天数"
                      fixed="left"
                      dataIndex="SleepDays"
                      width={72}
                    />
                    {monthDays.map((item) => (
                      <Column
                        title={(<div style={{textAlign: 'center'}}><div>{item.date}</div><div>{item.week}</div></div>)}
                        key={item.date}
                        className="schedule-table-cell"
                        render={(text, record, index) => {
                          const dropdownMenu = (
                            <Menu onClick={(e) => this.handleMenuClick(e, index, item.date, record)}>
                              {Object.keys(scheduleStatusMap).map((key) => (
                                <Menu.Item key={key}>
                                  <span>{scheduleStatusMap[key]}</span>
                                </Menu.Item>
                              ))}
                            </Menu>
                          );
                          return (
                            <div className="flex">
                              <Dropdown overlay={dropdownMenu}
                                trigger={['click']}
                                onVisibleChange={(flag) => this.handleDropdownVisible(flag, index, item.date)}
                                visible={(record.WillInStatusMap[item.date] || {}).visible}
                              >
                                <span className={classnames('flex__item flex flex--center', {
                                  'schedule-status__work': (record.WillInStatusMap[item.date] || {}).WillInStatus === -1 || (record.WillInStatusMap[item.date] || {}).WillInStatus === 1,
                                  'schedule-status__vacation': (record.WillInStatusMap[item.date] || {}).WillInStatus === 3,
                                  'schedule-status__outlet': (record.WillInStatusMap[item.date] || {}).WillInStatus === 4,
                                  'schedule-status__rest': (record.WillInStatusMap[item.date] || {}).WillInStatus === 2
                                })}>{scheduleStatusMap[(record.WillInStatusMap[item.date] || {}).WillInStatus] || '上班'}</span>
                              </Dropdown>
                            </div>
                          );
                        }}
                      />
                    ))}
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
      Date,
      BrokerAccount,
      DepartmentGroup
    } = props.scheduleInfo.pageQueryParams;

    return {
      Date,
      BrokerAccount,
      DepartmentGroup
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.scheduleInfo.pageQueryParams, fields)
    });
  }
})(BrokerSchedule);
