import React from 'react';
import moment from 'moment';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

import setParams from 'ACTION/setParams';
import BelongingSplitAction from 'ACTION/Assistant/BelongingSplitAction';

const {
  getSplitLogList
} = BelongingSplitAction;

const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  message,
  DatePicker
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;

const STATE_NAME = 'state_ac_belonging_split';

class SplitLog extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.splitLogInfo.pageQueryParams.RecordIndex / this.props.splitLogInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40
    };
  }

  componentWillMount() {
    this.fetchSplitLogList(this.props.splitLogInfo.pageQueryParams);
  }

  fetchSplitLogList = (queryParams = {}) => {
    const {
      UserName,
      Mobile,
      NewBroker,
      OldBroker,
      OperatorName,
      ExpectedDate,
      RecordIndex,
      RecordSize
    } = queryParams;

    getSplitLogList({
      UserName: UserName.value || '',
      Mobile: Mobile.value || '',
      NewBroker: NewBroker.value || '',
      OldBroker: OldBroker.value || '',
      OperatorName: OperatorName.value || '',
      StartDate: ExpectedDate.value && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
      StopDate: ExpectedDate.value && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
      splitLogInfo: {
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

    this.fetchSplitLogList({
      ...pageQueryParams,
      RecordIndex: 0,
      RecordSize: pageQueryParams.RecordSize
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  handleTableChange = ({ current, pageSize }) => {
    const {
      splitLogInfo: {
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

    this.fetchSplitLogList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }


  render() {
    const {
      form: { getFieldDecorator },
      splitLogInfo: {
        SplitLogList,
        RecordCount,
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
          <h1>会员归属拆分日志</h1>
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
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="创建时间">
                            {getFieldDecorator('ExpectedDate')(
                              <RangePicker style={{width: "100%"}}/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="会员姓名">
                            {getFieldDecorator('UserName')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="手机号">
                            {getFieldDecorator('Mobile')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="新经纪人">
                            {getFieldDecorator('NewBroker')(
                              <Input placeholder="昵称或工号" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={8}>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="操作人">
                            {getFieldDecorator('UserName')(
                              <Input placeholder="登录名或真实姓名" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="旧经纪人">
                            {getFieldDecorator('Mobile')(
                              <Input placeholder="昵称或工号" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6} offset={6} style={{ textAlign: 'right' }}>
                          <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
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
                    dataSource={SplitLogList}
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
                      title="会员姓名"
                      dataIndex="UserName"
                    />
                    <Column
                      title="手机号"
                      dataIndex="Mobile"
                    />
                    <Column
                      title="新经纪人"
                      dataIndex="NewBroker"
                    />
                    <Column
                      title="旧经纪人"
                      dataIndex="OldBroker"
                    />
                    <Column
                      title="划转类型"
                      dataIndex="TransferType"
                    />
                    <Column
                      title="备注"
                      dataIndex="Remark"
                    />
                    <Column
                      title="操作日期"
                      dataIndex="OperateDate"
                    />
                    <Column
                      title="操作人"
                      dataIndex="Operator"
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
      UserName,
      Mobile,
      NewBroker,
      OldBroker,
      OperatorName,
      ExpectedDate
    } = props.splitLogInfo.pageQueryParams;

    return {
      UserName,
      Mobile,
      NewBroker,
      OldBroker,
      OperatorName,
      ExpectedDate
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.splitLogInfo.pageQueryParams, fields)
    });
  }
})(SplitLog);
