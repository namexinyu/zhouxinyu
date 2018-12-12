import React from 'react';
import moment from 'moment';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

import setParams from 'ACTION/setParams';
import AccountManageAction from 'ACTION/Assistant/AccountManageAction';

const {
  getOperationLogs
} = AccountManageAction;

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

const STATE_NAME = 'state_ac_operation_log';

class OperationLog extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.operationInfo.pageQueryParams.RecordIndex / this.props.operationInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40
    };
  }

  componentWillMount() {
    this.featchOperationLogList(this.props.operationInfo.pageQueryParams);
  }

  featchOperationLogList = (queryParams = {}) => {
    const {
      LoginName,
      OperationItem,
      ExpectedDate,
      RecordIndex,
      RecordSize
    } = queryParams;

    getOperationLogs({
      OperatorID: employeeId,
      OperatorName: LoginName.value || '',
      OperationType: OperationItem.value || '',
      StartDate: ExpectedDate.value && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
      StopDate: ExpectedDate.value && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
      operationInfo: {
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

    this.featchOperationLogList({
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
      operationInfo: {
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

    this.featchOperationLogList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }


  render() {
    const {
      form: { getFieldDecorator },
      operationInfo: {
        OperationLogList,
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
          <h1>操作日志</h1>
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
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="操作人">
                            {getFieldDecorator('LoginName')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="操作项">
                            {getFieldDecorator('OperationItem')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="操作时间">
                            {getFieldDecorator('ExpectedDate')(
                              <RangePicker style={{width: "100%"}}/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
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
                    dataSource={OperationLogList}
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
                      title="操作人"
                      dataIndex="OperatorName"
                    />
                    <Column
                      title="操作项"
                      dataIndex="OperationType"
                    />
                    <Column
                      title="修改前"
                      dataIndex="BeforeModify"
                    />
                    <Column
                      title="修改后"
                      dataIndex="AfterModify"
                    />
                    <Column
                      title="操作时间"
                      dataIndex="OperateDate"
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
      BrokerAccount,
      OperationItem,
      ExpectedDate
    } = props.operationInfo.pageQueryParams;

    return {
      BrokerAccount,
      OperationItem,
      ExpectedDate
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.operationInfo.pageQueryParams, fields)
    });
  }
})(OperationLog);
