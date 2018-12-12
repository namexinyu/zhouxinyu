import React from 'react';

import CooperationDetailModal from './CooperationDetailModal';

import setParams from 'ACTION/setParams';
import CooperationAction from "ACTION/Business/Cooperation/index";

import CooperationService from 'SERVICE/Business/Cooperation/index';

const {
  getCooperationList
} = CooperationAction;

const {
  getCooperationDetail
} = CooperationService;

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  Alert,
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
const RangePicker = DatePicker.RangePicker;

const STATE_NAME = 'state_business_cooperation';

class CooperationList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.cooperationInfo.pageQueryParams.RecordIndex / this.props.cooperationInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      endOpen: false,
      detailModalVisible: false,
      detailInfo: {},
      rowRecord: {}
    };
  }

  componentWillMount() {
    this.fetchCooperationList(this.props.cooperationInfo.pageQueryParams);
  }

  fetchCooperationList = (queryParams = {}) => {
    const {
      StartDate,
      EndDate,
      Name,
      Mobile,
      RecordIndex,
      RecordSize
    } = queryParams;

    getCooperationList({
      CreateDateBegin: (StartDate || {}).value ? StartDate.value.format('YYYY-MM-DD') : '',
      CreateDateEnd: (EndDate || {}).value ? EndDate.value.format('YYYY-MM-DD') : '',
      Mobile: Mobile.value || '',
      Name: Name.value || '',
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
      cooperationInfo: {
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

    this.fetchCooperationList({
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
      cooperationInfo: {
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

    this.fetchCooperationList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  disabledStartDate = (current, field) => {
    const endValue = this.props.cooperationInfo.pageQueryParams[field].value;
    if (!current || !endValue) {
      return false;
    }
    return current.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (current, field) => {
    const startValue = this.props.cooperationInfo.pageQueryParams[field].value;
    if (!current || !startValue) {
      return false;
    }
    return current.valueOf() <= startValue.valueOf();
  }

  handleDBClick = (record) => {
    getCooperationDetail({
      FeedBackID: record.FeedBackID
    }).then((res) => {
      if (res.Code === 0) {
        this.setState({
          rowRecord: record,
          detailModalVisible: true,
          detailInfo: (res.Data || {})
        });
      } else {
        message.error(res.Desc || '出错了，请稍后尝试');
      }
    }).catch((err) => {
      message.error(err.Desc || '出错了，请稍后尝试');
    });
  }

  handleOnOk = () => {
    this.handleOnCancel();
    this.fetchCooperationList(this.props.cooperationInfo.pageQueryParams);
  }

  handleOnCancel = () => {
    this.setState({
      rowRecord: {},
      detailInfo: {},
      detailModalVisible: false
    });
  }
  
  render() {
    const {
      form: { getFieldDecorator },
      cooperationInfo: {
        cooperationList,
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      rowRecord,
      endOpen,
      detailModalVisible,
      detailInfo,
      page,
      pageSize
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>商务合作</h1>
        </div>
        <div style={{padding: 24}}>
          <Row style={{
            backgroundColor: '#fff',
            padding: 20
          }}>
            <Col span={24}>
              <div>
                <Row>
                  <Col span={24}>
                    <div>
                      <Form>
                        <Row gutter={8}>
                          <Col span={6}>
                            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="接收日期">
                              <div className="flex flex--y-center">
                                <FormItem className="form-item__zeromb">
                                  {getFieldDecorator('StartDate')(
                                    <DatePicker
                                      onOpenChange={this.handleStartOpenChange}
                                      disabledDate={(current) => {
                                        return this.disabledStartDate(current, 'EndDate');
                                      }}
                                      placeholder="开始日期"
                                    />
                                  )}
                                </FormItem>
                                <FormItem style={{marginLeft: 8}} className="form-item__zeromb">
                                  {getFieldDecorator('EndDate')(
                                    <DatePicker
                                      onOpenChange={this.handleEndOpenChange}
                                      open={endOpen}
                                      disabledDate={(current) => {
                                        return this.disabledEndDate(current, 'StartDate');
                                      }}
                                      placeholder="结束日期"
                                    />
                                  )}
                                </FormItem>
                              </div>
                            </FormItem>
                          </Col>

                          <Col span={6}>
                            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="姓名">
                              {getFieldDecorator('Name')(
                                <Input />
                              )}
                            </FormItem>
                          </Col>

                          <Col span={6}>
                            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="手机号">
                              {getFieldDecorator('Mobile')(
                                <Input />
                              )}
                            </FormItem>
                          </Col>
                          
                          <Col span={6}>
                            <FormItem style={{textAlign: 'right'}}>
                              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                            </FormItem>
                          </Col>
                        </Row>

                        <Row type="flex" align="middle" justify="space-between">
                          <Col span={9}>
                            <FormItem style={{textAlign: 'right'}} className="form-item__zeromb">
                              <div className="flex flex--y-center flex--between">
                                <Alert message="双击表格行可以查看详情" type="info" showIcon/>
                              </div>
                            </FormItem>
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
                      dataSource={cooperationList}
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
                      onRowDoubleClick={this.handleDBClick}
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
                        title="姓名"
                        dataIndex="NickName"
                        width={68}
                      />
                      <Column
                        title="手机号"
                        dataIndex="Mobile"
                      />
                      <Column
                        title="内容描述"
                        width="240"
                        dataIndex="Text"
                      />
                      <Column
                        title="回访内容"
                        width="240"
                        dataIndex="ReplyRemark"
                      />
                      <Column
                        title="接收时间"
                        dataIndex="CreateTime"
                      />
                      <Column
                        title="回访时间"
                        dataIndex="ReplyTime"
                        render={(text, record) => {
                          return record.ReplyStatus === 0 ? '' : text;
                        }}
                      />
                    </Table>
                  </Col>
                </Row>

                <CooperationDetailModal
                  visible={detailModalVisible}
                  rowRecord={rowRecord}
                  detailInfo={detailInfo}
                  onCancel={this.handleOnCancel}
                  onOk={this.handleOnOk}
                />

              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  } 
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      StartDate,
      EndDate,
      Name,
      Mobile
    } = props.cooperationInfo.pageQueryParams;

    return {
      StartDate,
      EndDate,
      Name,
      Mobile
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.cooperationInfo.pageQueryParams, fields)
    });
  }
})(CooperationList);
