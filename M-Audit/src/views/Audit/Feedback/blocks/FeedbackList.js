import React from 'react';
import moment from 'moment';

import FeedbackDetailModal from './FeedbackDetailModal';

import { feedbackTypeMap } from 'UTIL/constant/index';

import setParams from 'ACTION/setParams';
import FeedbackAction from 'ACTION/Audit/FeedbackAction';
import DepartGroupAction from 'ACTION/Common/DepartGroupAction';

import FeedbackService from 'SERVICE/Audit/FeedbackService';
import EntryModal from "./EntryModal";
const {
  getFeedbackList
} = FeedbackAction;

const {
  GetBrokerDepartList
} = DepartGroupAction;

const {
  exportFeedbackList,
  getFeedbackDetail
} = FeedbackService;

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  Modal,
  DatePicker,
  Cascader,
  message,
  Alert
} from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;

const STATE_NAME = 'state_audit_feedback_list';

class EventList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.feedbackListInfo.pageQueryParams.RecordIndex / this.props.feedbackListInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      visible: false,
      queryParams: {
        FeedbackType: {value: "-9999"},
        UserMobile: {value: ""}, 
        UserName: {value: ""}, 
        TypeEx: {value: ""}, 
        SueRemark: {value: ""}
      },
      detailInfo: {},
      detailModalVisible: false
    };
  }

  componentWillMount() {
    GetBrokerDepartList();
    this.fetchFeedbackList(this.props.feedbackListInfo.pageQueryParams);
  }

  fetchFeedbackList = (queryParams = {}) => {
    const {
      CreatedTime,
      UserName,
      BrokerAccountName,
      DepartmentGroup,
      FeedbackType,
      orderInfo,
      RecordIndex,
      RecordSize
    } = queryParams;

    const [departmentId, groupId] = DepartmentGroup.value || [];

    const postDataQueryParams = [];

    if ((CreatedTime.value || []).length) {
      postDataQueryParams.push({
        Key: 'StartDate',
        Value: moment(CreatedTime.value[0]).format('YYYY-MM-DD')
      }, {
        Key: 'EndDate',
        Value: moment(CreatedTime.value[1]).format('YYYY-MM-DD')
      });
    }

    if (BrokerAccountName.value) {
      postDataQueryParams.push({
        Key: 'BrokerAccountName',
        Value: BrokerAccountName.value || ''
      });
    }

    if (FeedbackType.value && FeedbackType.value != 0) {
      postDataQueryParams.push({
        Key: 'FeedbackType',
        Value: +FeedbackType.value
      });
    }

    if (UserName.value) {
      postDataQueryParams.push({
        Key: 'UserName',
        Value: UserName.value
      });
    }

    if (departmentId && departmentId !== -9999) {
      postDataQueryParams.push({
        Key: 'DepartName',
        Value: (this.props.departGroupList.filter(item => item.DepartID === departmentId)[0] || {}).DepartName
      });
    }

    if (groupId != null && groupId !== -1) {
      postDataQueryParams.push({
        Key: 'GroupName',
        Value: (((this.props.departGroupList.filter(item => item.DepartID === departmentId)[0] || {}).GroupList || []).filter(cur => cur.GroupID === groupId)[0] || {}).GroupName
      });
    }
    
    getFeedbackList({
      QueryParams: postDataQueryParams,
      // QueryParams: [{
      //   Key: 'StartDate',
      //   Value: CreatedTime.value && CreatedTime.value.length && moment(CreatedTime.value[0]).isValid() ? moment(CreatedTime.value[0]).format('YYYY-MM-DD') : ''
      // }, {
      //   Key: 'EndDate',
      //   Value: CreatedTime.value && CreatedTime.value.length && moment(CreatedTime.value[1]).isValid() ? moment(CreatedTime.value[1]).format('YYYY-MM-DD') : ''
      // }, {
      //   Key: 'BrokerAccountName',
      //   Value: BrokerAccountName.value || ''
      // }, {
      //   Key: 'FeedbackType',
      //   Value: FeedbackType.value != null ? +FeedbackType.value : 0
      // }, {
      //   Key: 'UserName',
      //   Value: UserName.value || ''
      // }, {
      //   Key: 'DepartName',
      //   Value: departmentId == null || departmentId === -9999 ? '' : (this.props.departGroupList.filter(item => item.DepartID === departmentId)[0] || {}).DepartName
      // }, {
      //   Key: 'GroupName',
      //   Value: (groupId == null || groupId == -1) ? '' : (((this.props.departGroupList.filter(item => item.DepartID === departmentId)[0] || {}).GroupList || []).filter(cur => cur.GroupID === groupId)[0] || {}).GroupName
      // }],
      OrderParams: Object.keys(orderInfo).map(key => {
        return {
          Key: key,
          Order: +orderInfo[key].order
        };
      }),
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
      feedbackListInfo: {
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

    this.fetchFeedbackList({
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
      feedbackListInfo: {
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
        RecordSize: pageSize,
        orderInfo: {
          ...pageQueryParams.orderInfo,
          [sorter.columnKey]: {
            key: sorter.columnKey,
            order: sorter.order ? (sorter.order === 'descend' ? 1 : 0) : 1
          }
        }
      }
    });

    this.fetchFeedbackList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize,
      orderInfo: {
        ...pageQueryParams.orderInfo,
        [sorter.columnKey]: {
          key: sorter.columnKey,
          order: sorter.order ? (sorter.order === 'descend' ? 1 : 0) : 1
        }
      }
    });
  }

  handleExport = () => {
    const {
      CreatedTime,
      UserName,
      BrokerAccountName,
      DepartmentGroup,
      FeedbackType,
      orderInfo
    } = this.props.feedbackListInfo.pageQueryParams;

    const [departmentId, groupId] = DepartmentGroup.value || [];

    const postDataQueryParams = [];

    if ((CreatedTime.value || []).length) {
      postDataQueryParams.push({
        Key: 'StartDate',
        Value: moment(CreatedTime.value[0]).format('YYYY-MM-DD')
      }, {
        Key: 'EndDate',
        Value: moment(CreatedTime.value[1]).format('YYYY-MM-DD')
      });
    }

    if (BrokerAccountName.value) {
      postDataQueryParams.push({
        Key: 'BrokerAccountName',
        Value: BrokerAccountName.value || ''
      });
    }

    if (FeedbackType.value && FeedbackType.value != 0) {
      postDataQueryParams.push({
        Key: 'FeedbackType',
        Value: +FeedbackType.value
      });
    }

    if (UserName.value) {
      postDataQueryParams.push({
        Key: 'UserName',
        Value: UserName.value
      });
    }

    if (departmentId && departmentId !== -9999) {
      postDataQueryParams.push({
        Key: 'DepartName',
        Value: (this.props.departGroupList.filter(item => item.DepartID === departmentId)[0] || {}).DepartName
      });
    }

    if (groupId != null && groupId !== -1) {
      postDataQueryParams.push({
        Key: 'GroupName',
        Value: (((this.props.departGroupList.filter(item => item.DepartID === departmentId)[0] || {}).GroupList || []).filter(cur => cur.GroupID === groupId)[0] || {}).GroupName
      });
    }

    exportFeedbackList({
      QueryParams: postDataQueryParams,
      OrderParams: Object.keys(orderInfo).map(key => {
        return {
          Key: key,
          Order: +orderInfo[key].order
        };
      })
    }).then((res) => {
      if (res.Code === 0) {
          message.success('导出成功');
          window.open(res.Data.Url, '_blank');
      } else {
          message.error(res.Desc || '出错了，请稍后尝试');
      }
    }).catch((err) => {
        message.error(err.Desc || '出错了，请稍后尝试');
    });
  }

  handleDBClick = (record) => {
    getFeedbackDetail({
      PhoneFeedbackID: record.PhoneFeedbackID
    }).then((res) => {
      if (res.Code === 0) {
        this.setState({
          detailModalVisible: true,
          detailInfo: res.Data || {}
        });
      } else {
        message.error(res.Desc || '出错了，请稍后尝试');
      }
    }).catch((err) => {
        message.error(err.Desc || '出错了，请稍后尝试');
    });
  }

  handleHideDetailModal = () => {
    this.setState({
      detailModalVisible: false,
      detailInfo: {}
    });
  }

  handleSaveDetail = () => {
    this.handleHideDetailModal();
    this.fetchFeedbackList(this.props.feedbackListInfo.pageQueryParams);
  }
  visibleModl = (Type) => {
    this.setState({
      visible: Type,
      queryParams: {}
    });
  }
  setParams = (query) => {
    this.setState({
      queryParams: {...this.state.queryParams, ...query.queryParams}
    });
  }
  queryParamsFN = (query) => {
    this.setState({
      queryParams: {...this.state.queryParams, ...query}
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      departGroupList,
      feedbackListInfo: {
        feedbackList,
        pageQueryParams: {
          orderInfo
        },
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      detailModalVisible,
      detailInfo,
      page,
      pageSize
    } = this.state;

    const DGList = [{
      value: -9999,
      label: '全部',
      children: []
    }].concat(departGroupList.map((item) => {
      return {
        value: item.DepartID,
        label: item.DepartName,
        children: (item.GroupList || []).length ? [{value: -1, label: '全部'}].concat((item.GroupList || []).map(cur => {
          return {
            value: cur.GroupID,
            label: cur.GroupName
          };
        })) : []
      };
    }));
    
    
    return (
      <div>
        <div className="ivy-page-title" style={{position: 'relative'}}>
          <h1>400投诉列表</h1>
        </div>
        <Row style={{
          height: '100%',
          overflowX: 'auto'
        }}>
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
                          <FormItem label="投诉日期" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator("CreatedTime")(
                              <RangePicker style={{width: '100%'}} />
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
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="经纪人">
                            {getFieldDecorator('BrokerAccountName')(
                              <Input placeholder="请输入昵称或工号" />
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
                          <FormItem label="类型" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('FeedbackType')(
                              <Select
                                  placeholder="请选择"
                                  size="default"
                              >
                                <Option key="0" value="0">全部</Option>
                                {
                                  Object.keys(feedbackTypeMap).map(key => (
                                    <Option key={key} value={`${key}`}>{feedbackTypeMap[key]}</Option>
                                  ))
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>

                        <Col span={6} offset={12}>
                          <FormItem style={{textAlign: 'right'}}>
                            <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                          </FormItem>
                        </Col>
                      </Row>
                      <Row type="flex" align="middle" justify="space-between">
                        <Col span={6}>
                          <FormItem>
                            <Button onClick={() => this.visibleModl(true)} type="primary">录入投诉</Button>
                          </FormItem>
                        </Col>
                        <Col span={9}>
                          <FormItem style={{textAlign: 'right'}}>
                            <div className="flex flex--y-center flex--between">
                              <Alert message="双击表格行可以查看事件详情" type="info" showIcon/>
                              <Button onClick={this.handleExport}>导出</Button>
                            </div>
                          </FormItem>
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
                    dataSource={feedbackList}
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
                    onRowDoubleClick={this.handleDBClick}
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
                    />
                    <Column
                        title="经纪人"
                        dataIndex="BrokerName"
                    />
                    <Column
                      title="区"
                      dataIndex="DepartName"
                    />
                    <Column
                      title="组"
                      dataIndex="GroupName"
                    />
                    <Column
                      title="类型"
                      dataIndex="FeedbackType"
                      render={(text, record) => {
                        return text == 4 ? `${feedbackTypeMap[text]}-${record.TypeEx}` : (feedbackTypeMap[text] || '');
                      }}
                    />
                    <Column
                      title="问题描述"
                      dataIndex="SueRemark"
                      render={(text) => {
                        return <a style={{
                          maxWidth: 225,
                          display: 'block',
                          overflow: text.length > 30 ? 'hidden' : 'initial',
                          textOverflow: text.length > 30 ? 'ellipsis' : 'initial',
                          whiteSpace: text.length > 30 ? 'nowrap' : 'initial'
                        }}>{text}</a>; 
                      }}
                    />
                    <Column
                      title="解决方案"
                      dataIndex="DealRemark"
                      render={(text) => {
                        return <span style={{
                          maxWidth: 225,
                          display: 'block',
                          overflow: text.length > 30 ? 'hidden' : 'initial',
                          textOverflow: text.length > 30 ? 'ellipsis' : 'initial',
                          whiteSpace: text.length > 30 ? 'nowrap' : 'initial'
                        }}>{text}</span>; 
                      }}
                    />
                    <Column
                      title="解决成本"
                      dataIndex="SolveConsume"
                      render={(text, record) => {
                        return `${record.DealRemark == "" ? "" : parseFloat((+text || 0) / 100).toFixed(2) + "元"}`;
                      }}
                    />
                    <Column
                      title="回访跟踪"
                      dataIndex="ReturnRemark"
                      render={(text) => {
                        return <a style={{
                          maxWidth: 225,
                          display: 'block',
                          overflow: text.length > 30 ? 'hidden' : 'initial',
                          textOverflow: text.length > 30 ? 'ellipsis' : 'initial',
                          whiteSpace: text.length > 30 ? 'nowrap' : 'initial'
                        }}>{text}</a>; 
                      }}
                    />
                    <Column
                      title="投诉日期"
                      dataIndex="CreateTime"
                      sorter={true}
                      sortOrder={orderInfo.CreateTime ? (orderInfo.CreateTime.order === 1 ? 'descend' : 'ascend') : ''}
                    />
                  </Table>
                </Col>
              </Row>

              <FeedbackDetailModal
                visible={detailModalVisible}
                onCancel={this.handleHideDetailModal}
                onOk={this.handleSaveDetail}
                detailInfo={detailInfo}
              />

            </div>
          </Col>
        </Row>
        <EntryModal 
          fetchFeedbackList={this.fetchFeedbackList}
          feedbackListInfo={this.props.feedbackListInfo}
          queryParamsFN={this.queryParamsFN}
          queryParams={this.state.queryParams}
          setParams={this.setParams}
          visible={this.state.visible}
          visibleModl={this.visibleModl}
          />
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      CreatedTime,
      UserName,
      BrokerAccountName,
      DepartmentGroup,
      FeedbackType
    } = props.feedbackListInfo.pageQueryParams;

    return {
      CreatedTime,
      UserName,
      BrokerAccountName,
      DepartmentGroup,
      FeedbackType
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.feedbackListInfo.pageQueryParams, fields)
    });
  }
})(EventList);
