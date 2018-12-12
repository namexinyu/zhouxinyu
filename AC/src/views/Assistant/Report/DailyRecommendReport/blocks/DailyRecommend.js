import React from 'react';
import moment from 'moment';

import ReportService from 'SERVICE/Assistant/ReportService';

import setParams from 'ACTION/setParams';
import ReportAction from 'ACTION/Assistant/ReportAction';

const {
  getDailyRecommendList
} = ReportAction;

const {
  exportDailyRecommend
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
  message
} from 'antd';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { Column } = Table;

const STATE_NAME = 'state_ac_daily_recommend';

class DailyRecommend extends React.PureComponent {
  constructor(props) {
    super(props);
    const { DGList } = getAuthority();

    this.state = {
      page: (this.props.recommendInfo.pageQueryParams.RecordIndex / this.props.recommendInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      DGList
    };
  }

  componentWillMount() {
    this.fetchRecommendList(this.props.recommendInfo.pageQueryParams);
  }

  fetchRecommendList = (queryParams = {}) => {
    const {
      Date,
      DepartmentGroup,
      RecordIndex,
      RecordSize
    } = queryParams;

    console.log(Date);
    

    const [departmentId, groupId] = DepartmentGroup.value || [];

    getDailyRecommendList({
      Date: Date.value && moment(Date.value).isValid() ? moment(Date.value).format('YYYY-MM') : '',
      DepartID: (departmentId === -9999 || departmentId == null) ? 0 : departmentId,
      GroupID: groupId == null ? 0 : groupId,
      RecordSize: RecordSize,
      RecordIndex: RecordIndex
    });
  }

  handleSearch = () => {
    const {
      recommendInfo: {
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

    this.fetchRecommendList({
      ...pageQueryParams,
      RecordIndex: 0,
      RecordSize: pageQueryParams.RecordSize
    });
  }

  handleReset = () => {
    this.props.form.setFieldsValue({
      Date: moment(),
      DepartmentGroup: []
    });
  }

  handleTableChange = ({current, pageSize }) => {
    const {
      recommendInfo: {
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

    this.fetchRecommendList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleExport = () => {
    const {
      Date,
      DepartmentGroup,
      RecordIndex,
      RecordSize
    } = this.props.recommendInfo.pageQueryParams;

    const [departmentId, groupId] = DepartmentGroup.value || [];

    exportDailyRecommend({
      Date: Date.value && moment(Date.value).isValid() ? moment(Date.value).format('YYYY-MM') : '',
      DepartID: (departmentId === -9999 || departmentId == null) ? 0 : departmentId,
      GroupID: groupId == null ? 0 : groupId,
      RecordSize: RecordSize,
      RecordIndex: RecordIndex
    }).then((res) => {
      if (res.Code === 0) {
        message.success('导出成功');
        window.open(res.Data, '_blank');
      } else {
        message.error(res.Desc || '导出失败，请稍后尝试');
      }
    }).catch((err) => {
      message.error(err.Desc || '导出失败，请稍后尝试');
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      recommendInfo: {
        recommendList,
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
          <h1>每日推荐统计</h1>
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
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="日期">
                            {getFieldDecorator('Date')(
                              <MonthPicker placeholder="请选择" />
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
                        <Col span={6} offset={6}>
                          <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                          <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
                          <Button style={{float: 'right'}} type="primary" onClick={this.handleExport}>导出</Button>
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
                    dataSource={recommendList}
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
                    scroll={{ x: 1900}}
                    onChange={this.handleTableChange}
                  >
                    <Column
                      title="工号"
                      dataIndex="BrokerAccount"
                      fixed="left"
                      width={45}
                    />
                    <Column
                      title="昵称"
                      dataIndex="BrokerNickName"
                      fixed="left"
                      width={60}
                    />
                    <Column
                      title="部门"
                      fixed="left"
                      width={80}
                      dataIndex="DepartName"
                    />
                    <Column
                      title="队名"
                      fixed="left"
                      dataIndex="GroupName"
                      width={80}
                    />
                    <Column
                      title="段位"
                      fixed="left"
                      dataIndex="RankName"
                      width={45}
                    />
                    <Column
                      title="推荐总数"
                      fixed="left"
                      dataIndex="TotalRecommendCount"
                      width={70}
                    />
                    <Column
                      title="排名"
                      fixed="left"
                      dataIndex="InterviewCountRank"
                      width={45}
                    />
                    <Column
                      title="日期"
                      children={[{
                        title: '1',
                        key: '1',
                        render: (text, record) =><div style={record['DayRecordList'][0] ? record['DayRecordList'][0]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][0] ? record['DayRecordList'][0]['RecommendCount'] : ''}</div>
                      }, {
                        title: '2',
                        key: '2',
                        render: (text, record) =><div style={record['DayRecordList'][1] ? record['DayRecordList'][1]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][1] ? record['DayRecordList'][1]['RecommendCount'] : ''}</div>
                      }, {
                        title: '3',
                        key: '3',
                        render: (text, record) =><div style={record['DayRecordList'][2] ? record['DayRecordList'][2]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][2] ? record['DayRecordList'][2]['RecommendCount'] : ''}</div>
                      }, {
                        title: '4',
                        key: '4',
                        render: (text, record) =><div style={record['DayRecordList'][3] ? record['DayRecordList'][3]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][3] ? record['DayRecordList'][3]['RecommendCount'] : ''}</div>
                      }, {
                        title: '5',
                        key: '5',
                        render: (text, record) =><div style={record['DayRecordList'][4] ? record['DayRecordList'][4]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][4] ? record['DayRecordList'][4]['RecommendCount'] : ''}</div>
                      }, {
                        title: '6',
                        key: '6',
                        render: (text, record) =><div style={record['DayRecordList'][5] ? record['DayRecordList'][5]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][5] ? record['DayRecordList'][5]['RecommendCount'] : ''}</div>
                      }, {
                        title: '7',
                        key: '7',
                        render: (text, record) =><div style={record['DayRecordList'][6] ? record['DayRecordList'][6]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][6] ? record['DayRecordList'][6]['RecommendCount'] : ''}</div>
                      }, {
                        title: '8',
                        key: '8',
                        render: (text, record) =><div style={record['DayRecordList'][7] ? record['DayRecordList'][7]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][7] ? record['DayRecordList'][7]['RecommendCount'] : ''}</div>
                      }, {
                        title: '9',
                        key: '9',
                        render: (text, record) =><div style={record['DayRecordList'][8] ? record['DayRecordList'][8]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][8] ? record['DayRecordList'][8]['RecommendCount'] : ''}</div>
                      }, {
                        title: '10',
                        key: '10',
                        render: (text, record) =><div style={record['DayRecordList'][9] ? record['DayRecordList'][9]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][9] ? record['DayRecordList'][9]['RecommendCount'] : ''}</div>
                      }, {
                        title: '11',
                        key: '11',
                        render: (text, record) =><div style={record['DayRecordList'][10] ? record['DayRecordList'][10]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][10] ? record['DayRecordList'][10]['RecommendCount'] : ''}</div>
                      }, {
                        title: '12',
                        key: '12',
                        render: (text, record) =><div style={record['DayRecordList'][11] ? record['DayRecordList'][11]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][11] ? record['DayRecordList'][11]['RecommendCount'] : ''}</div>
                      }, {
                        title: '13',
                        key: '13',
                        render: (text, record) =><div style={record['DayRecordList'][12] ? record['DayRecordList'][12]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][12] ? record['DayRecordList'][12]['RecommendCount'] : ''}</div>
                      }, {
                        title: '14',
                        key: '14',
                        render: (text, record) =><div style={record['DayRecordList'][13] ? record['DayRecordList'][13]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][13] ? record['DayRecordList'][13]['RecommendCount'] : ''}</div>
                      }, {
                        title: '15',
                        key: '15',
                        render: (text, record) =><div style={record['DayRecordList'][14] ? record['DayRecordList'][14]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][14] ? record['DayRecordList'][14]['RecommendCount'] : ''}</div>
                      }, {
                        title: '16',
                        key: '16',
                        render: (text, record) =><div style={record['DayRecordList'][15] ? record['DayRecordList'][15]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][15] ? record['DayRecordList'][15]['RecommendCount'] : ''}</div>
                      }, {
                        title: '17',
                        key: '17',
                        render: (text, record) =><div style={record['DayRecordList'][16] ? record['DayRecordList'][16]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][16] ? record['DayRecordList'][16]['RecommendCount'] : ''}</div>
                      }, {
                        title: '18',
                        key: '18',
                        render: (text, record) =><div style={record['DayRecordList'][17] ? record['DayRecordList'][17]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][17] ? record['DayRecordList'][17]['RecommendCount'] : ''}</div>
                      }, {
                        title: '19',
                        key: '19',
                        render: (text, record) =><div style={record['DayRecordList'][18] ? record['DayRecordList'][18]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][18] ? record['DayRecordList'][18]['RecommendCount'] : ''}</div>
                      }, {
                        title: '20',
                        key: '20',
                        render: (text, record) =><div style={record['DayRecordList'][19] ? record['DayRecordList'][19]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][19] ? record['DayRecordList'][19]['RecommendCount'] : ''}</div>
                      }, {
                        title: '21',
                        key: '21',
                        render: (text, record) =><div style={record['DayRecordList'][20] ? record['DayRecordList'][20]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][20] ? record['DayRecordList'][20]['RecommendCount'] : ''}</div>
                      }, {
                        title: '22',
                        key: '22',
                        render: (text, record) =><div style={record['DayRecordList'][21] ? record['DayRecordList'][21]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][21] ? record['DayRecordList'][21]['RecommendCount'] : ''}</div>
                      }, {
                        title: '23',
                        key: '23',
                        render: (text, record) =><div style={record['DayRecordList'][22] ? record['DayRecordList'][22]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][22] ? record['DayRecordList'][22]['RecommendCount'] : ''}</div>
                      }, {
                        title: '24',
                        key: '24',
                        render: (text, record) =><div style={record['DayRecordList'][23] ? record['DayRecordList'][23]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][23] ? record['DayRecordList'][23]['RecommendCount'] : ''}</div>
                      }, {
                        title: '25',
                        key: '25',
                        render: (text, record) =><div style={record['DayRecordList'][24] ? record['DayRecordList'][24]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][24] ? record['DayRecordList'][24]['RecommendCount'] : ''}</div>
                      }, {
                        title: '26',
                        key: '26',
                        render: (text, record) =><div style={record['DayRecordList'][25] ? record['DayRecordList'][25]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][25] ? record['DayRecordList'][25]['RecommendCount'] : ''}</div>
                      }, {
                        title: '27',
                        key: '27',
                        render: (text, record) =><div style={record['DayRecordList'][26] ? record['DayRecordList'][26]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][26] ? record['DayRecordList'][26]['RecommendCount'] : ''}</div>
                      }, {
                        title: '28',
                        key: '28',
                        render: (text, record) =><div style={record['DayRecordList'][27] ? record['DayRecordList'][27]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][27] ? record['DayRecordList'][27]['RecommendCount'] : ''}</div>
                      }, {
                        title: '29',
                        key: '29',
                        render: (text, record) =><div style={record['DayRecordList'][28] ? record['DayRecordList'][28]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][28] ? record['DayRecordList'][28]['RecommendCount'] : ''}</div>
                      }, {
                        title: '30',
                        key: '30',
                        render: (text, record) =><div style={record['DayRecordList'][29] ? record['DayRecordList'][29]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][29] ? record['DayRecordList'][29]['RecommendCount'] : ''}</div>
                      }, {
                        title: '31',
                        key: '31',
                        render: (text, record) =><div style={record['DayRecordList'][30] ? record['DayRecordList'][30]['IsPassed'] == 0 ? {color: 'inherit'} : {} : {}}>{record['DayRecordList'][30] ? record['DayRecordList'][30]['RecommendCount'] : ''}</div>
                      }]}
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
      Date,
      DepartmentGroup
    } = props.recommendInfo.pageQueryParams;

    return {
      Date,
      DepartmentGroup
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.recommendInfo.pageQueryParams, fields)
    });
  }
})(DailyRecommend);
