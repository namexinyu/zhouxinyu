import React from 'react';

import GroupEditModal from './GroupEditModal';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import { getAuthority } from 'CONFIG/DGAuthority';

// import DepartgroupManageService from 'SERVICE/Assistant/DepartgroupManageService';

import setParams from 'ACTION/setParams';
import DepartgroupManageAction from 'ACTION/Assistant/DepartgroupManageAction';
import BoardAction from 'ACTION/Assistant/BoardAction';

const {
  getGroupList
} = DepartgroupManageAction;
const {
  GetBrokerDepartList
} = BoardAction;

const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  Modal,
  message
} from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;

const STATE_NAME = 'state_ac_group_manage';

class GroupManage extends React.PureComponent {
  constructor(props) {
    super(props);
    const { eAuthDepartment } = getAuthority();

    this.state = {
      page: (this.props.groupInfo.pageQueryParams.RecordIndex / this.props.groupInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      departmentMap: eAuthDepartment,
      isEdit: false,
      groupModalVisible: false,
      groupRecord: {}
    };
  }

  componentWillMount() {
    this.fetchGroupList(this.props.groupInfo.pageQueryParams);
  }

  fetchGroupList = (queryParams = {}) => {
    const {
      GroupName,
      Department,
      RecordIndex,
      RecordSize
    } = queryParams;

    getGroupList({
      BrokerDepartmentID: Department.value != null ? +Department.value : 0,
      GroupName: GroupName.value || '',
      OperatorID: employeeId,
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
      groupInfo: {
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

    this.fetchGroupList({
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
      groupInfo: {
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

    this.fetchGroupList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleNewGroup = () => {
    this.setState({
      groupModalVisible: true,
      isEdit: false
    });
  }

  showModifyModal = (record) => {
    this.setState({
      groupModalVisible: true,
      groupRecord: record,
      isEdit: true
    });
  }

  handleSaveChange = () => {
    this.fetchGroupList(this.props.groupInfo.pageQueryParams);
    GetBrokerDepartList();
  }

  handleCancelSave = () => {
    this.setState({
      isEdit: false,
      groupModalVisible: false,
      groupRecord: {}
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      groupInfo: {
        GroupList,
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      page,
      pageSize,
      departmentMap,
      isEdit,
      groupModalVisible,
      groupRecord
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>战队管理</h1>
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
                        <Col span={8}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="部门名称">
                            {getFieldDecorator('Department')(
                              <Select
                                placeholder="请选择"
                                size="default"
                              >
                                <Option key="0" value="0">全部</Option>
                                {
                                  Object.keys(departmentMap).map((key) => {
                                    return (
                                      <Option key={key} value={`${key}`}>{departmentMap[key]}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="战队名称">
                            {getFieldDecorator('GroupName')(
                              <Input placeholder="" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                          <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </Col>
                      </Row>
                      <Row type="flex" align="end">
                        <Col span={8} style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={this.handleNewGroup}>新增战队</Button>
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
                    dataSource={GroupList}
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
                      title="所属部门"
                      dataIndex="BrokerDepartmentID"
                      render={(text) => {
                        return departmentMap[text] || '';
                      }}
                    />
                    <Column
                      title="战队编号"
                      dataIndex="BrokerGroupID"
                    />
                    <Column
                      title="战队名称"
                      dataIndex="BrokerGroupName"
                    />
                    <Column
                      title="操作"
                      key="action"
                      render={(text, record) => {
                        return (
                          <div>
                            <Button type="primary" onClick={() => this.showModifyModal(record)}>编辑</Button>
                          </div>
                        );
                      }}
                    />
                  </Table>
                </Col>
              </Row>

              <GroupEditModal
                 visible={groupModalVisible}
                 onOk={this.handleSaveChange}
                 onCancel={this.handleCancelSave}
                 isEdit={isEdit}
                 rowRecord={groupRecord}
                 departments={departmentMap}
              />
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
      GroupName,
      Department
    } = props.groupInfo.pageQueryParams;

    return {
      GroupName,
      Department
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.groupInfo.pageQueryParams, fields)
    });
  }
})(GroupManage);
