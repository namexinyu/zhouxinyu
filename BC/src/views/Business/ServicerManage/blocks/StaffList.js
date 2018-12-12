import React from 'react';

import { CONFIG } from 'mams-com';
const { AppSessionStorage } = CONFIG;

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import setParams from 'ACTION/setParams';
import StaffManageAction from "ACTION/Business/StaffManage/index";
import CommonAction from 'ACTION/Business/Common';

import StaffManageService from 'SERVICE/Business/StaffManage/index';

const {
  getRecruitSimpleList,
  getLaborSimpleList
} = CommonAction;

const {
  getServiceStaffList
} = StaffManageAction;

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
  Tooltip,
  Icon,
  message,
  Radio,
  Checkbox
} from 'antd';

import StaffNewModal from './StaffNewModal';
import StaffEditModal from './StaffEditModal';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;

const STATE_NAME = 'state_servicer_staff_list';

const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

class StaffList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.staffListInfo.pageQueryParams.RecordIndex / this.props.staffListInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      newModalVisible: false,
      editModalVisible: false,
      eidtType: '',
      rowRecord: {}
    };
  }

  componentWillMount() {
    getRecruitSimpleList();
    getLaborSimpleList();
    this.fetchStaffList(this.props.staffListInfo.pageQueryParams);
  }

  fetchStaffList = (queryParams = {}) => {
    const {
      RecruitName,
      LaborName,
      RecordIndex,
      RecordSize
    } = queryParams;

    getServiceStaffList({
      EntName: RecruitName.value ? (RecruitName.value || {}).text : '',
      LaborName: LaborName.value ? (LaborName.value || {}).text : '',
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
      staffListInfo: {
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

    this.fetchStaffList({
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
      staffListInfo: {
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

    this.fetchStaffList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleEditStaff = (record) => {
    this.setState({
      editModalVisible: true,
      rowRecord: {
        ...record,
        laborInfo: {
          value: record.LaborID,
          text: record.LaborName
        },
        recruitInfo: {
          value: record.RecruitTmpID,
          text: record.EntName
        }
      },
      eidtType: 'edit'
    });
  }

  handleCopyStaff = (record) => {
    this.setState({
      editModalVisible: true,
      rowRecord: {
        ...record,
        laborInfo: {
          value: record.LaborID,
          text: record.LaborName
        },
        recruitInfo: {
          value: record.RecruitTmpID,
          text: record.EntName
        }
      },
      eidtType: 'copy'
    });
  }

  handleRemoveStaff = (record) => {
    Modal.confirm({
      title: '删除',
      content: '确认删除该服务人员吗？',
      onOk: () => {
        console.log('hello');
        StaffManageService.deleteServiceStaff({
          LaborContactID: record.LaborContactID
        }).then((res) => {
          if (res.Code === 0) {
            message.success("删除成功");
            this.fetchStaffList(this.props.staffListInfo.pageQueryParams);
          } else {
            message.error(res.Desc || '出错了，请稍后尝试');
          }
        }).catch((err) => {
            message.error(err.Desc || '出错了，请稍后尝试');
        });
      }
    });
  }

  handleNewStaff = () => {
    this.setState({
      newModalVisible: true
    });
  }

  handleCancelNewStaff = () => {
    this.setState({
      newModalVisible: false
    });
  }

  handleSaveNewStaff = () => {
    this.handleCancelNewStaff();
    this.fetchStaffList(this.props.staffListInfo.pageQueryParams);
  }

  handleCancelEditStaff = () => {
    this.setState({
      editModalVisible: false,
      eidtType: '',
      rowRecord: {}
    });
  }

  handleSaveEditStaff = () => {
    this.handleCancelEditStaff();
    this.fetchStaffList(this.props.staffListInfo.pageQueryParams);
  }
  
  render() {
    const {
      form: { getFieldDecorator },
      staffListInfo: {
        staffList,
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      newModalVisible,
      editModalVisible,
      eidtType,
      rowRecord,
      page,
      pageSize
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>服务人员管理</h1>
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
                          <Col span={8}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="劳务公司">
                              {getFieldDecorator('LaborName')(
                                <AutoCompleteSelect allowClear={true} optionsData={{
                                  valueKey: 'LaborID',
                                  textKey: 'ShortName',
                                  dataArray: this.props.common.LaborSimpleList
                                }}/>
                              )}
                            </FormItem>
                          </Col>

                          <Col span={8}>
                            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="企业名称">
                              {getFieldDecorator('RecruitName')(
                                <AutoCompleteSelect allowClear={true} optionsData={{
                                  valueKey: 'RecruitTmpID',
                                  textKey: 'RecruitName',
                                  dataArray: this.props.common.RecruitSimpleList
                                }}/>
                              )}
                            </FormItem>
                          </Col>
                          
                          <Col span={8}>
                            <FormItem style={{textAlign: 'right'}}>
                              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                            </FormItem>
                          </Col>
                        </Row>

                        <Row gutter={8}>
                          <Col span={8}>
                            <FormItem>
                              <Button type="primary" onClick={this.handleNewStaff}>新建</Button>
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
                      dataSource={staffList}
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
                        title="劳务公司"
                        dataIndex="LaborName"
                      />
                      <Column
                          title="企业名称"
                          dataIndex="EntName"
                      />
                      <Column
                        title="联系电话"
                        dataIndex="Mobile"
                      />
                      <Column
                        title="备注"
                        dataIndex="Remark"
                      />
                      <Column
                          title="操作"
                          key="action"
                          render={(text, record) => {
                              return (
                                <div>
                                  <a onClick={() => this.handleEditStaff(record)}>编辑</a>
                                  <a className="ml-10" onClick={() => this.handleCopyStaff(record)}>复制</a>
                                  <a className="ml-10" style={{
                                    color: '#f04134'
                                  }} onClick={() => this.handleRemoveStaff(record)}>删除</a>
                                </div>
                              );
                          }}
                      />
                    </Table>
                  </Col>
                </Row>

                <StaffNewModal
                  visible={newModalVisible}
                  onCancel={this.handleCancelNewStaff}
                  onOk={this.handleSaveNewStaff}
                  commonData={this.props.common}
                />

                <StaffEditModal
                  visible={editModalVisible}
                  type={eidtType}
                  rowRecord={rowRecord}
                  onCancel={this.handleCancelEditStaff}
                  onOk={this.handleSaveEditStaff}
                  commonData={this.props.common}
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
      RecruitName,
      LaborName
    } = props.staffListInfo.pageQueryParams;

    return {
      RecruitName,
      LaborName
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.staffListInfo.pageQueryParams, fields)
    });
  }
})(StaffList);
