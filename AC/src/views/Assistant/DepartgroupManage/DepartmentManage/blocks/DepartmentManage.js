import React from 'react';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

import DepartgroupManageService from 'SERVICE/Assistant/DepartgroupManageService';

import setParams from 'ACTION/setParams';
import DepartgroupManageAction from 'ACTION/Assistant/DepartgroupManageAction';
import BoardAction from 'ACTION/Assistant/BoardAction';

const {
  getDepartmentList
} = DepartgroupManageAction;

const {
  addDepartment,
  updateDepartment
} = DepartgroupManageService;

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
  Cascader,
  message
} from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;

const STATE_NAME = 'state_ac_depart_manage';

class DepartmentManage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: (this.props.departInfo.pageQueryParams.RecordIndex / this.props.departInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      isEdit: false,
      departModalVisible: false,
      departRecord: {},
      editDepartment: ''
    };
  }

  componentWillMount() {
    this.fetchDeparmenttList(this.props.departInfo.pageQueryParams);
  }

  fetchDeparmenttList = (queryParams = {}) => {
    const {
      DepartName,
      RecordIndex,
      RecordSize
    } = queryParams;

    getDepartmentList({
      DepName: DepartName.value || '',
      OperatorID: employeeId,
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
      departInfo: {
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

    this.fetchDeparmenttList({
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
      departInfo: {
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

    this.fetchDeparmenttList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleNewDepartment = () => {
    this.setState({
      departModalVisible: true,
      isEdit: false
    });
  }

  showModifyModal = (record) => {
    this.setState({
      departModalVisible: true,
      departRecord: record,
      editDepartment: record.BrokerDepartmentName,
      isEdit: true
    });
  }

  handleOnOk = () => {
    const {
      editDepartment
    } = this.state;

    if (editDepartment.trim() === '') {
      message.warn('名称不能为空');
      return;
    }
    const {
      isEdit,
      departRecord
    } = this.state;
    if (isEdit) {
      updateDepartment({
        BrokerDepartmentID: departRecord.BrokerDepartmentID,
        BrokerDepartmentName: editDepartment,
        OperatorID: employeeId
      }).then((res) => {
        if (res.Code === 0) {
          message.success('修改部门成功');
          this.handleOnCancel();
          this.fetchDeparmenttList(this.props.departInfo.pageQueryParams);
          BoardAction.GetBrokerDepartList();
        } else {
          message.error(res.Data.Desc || '操作失败，请稍后重试');
        }
      }).catch((err) => {
        message.error(err.Desc || '操作失败，请稍后重试');
      });
    } else {
      addDepartment({
        BrokerDepartmentName: editDepartment,
        OperatorID: employeeId
      }).then((res) => {
        if (res.Code === 0) {
          message.success('新增部门成功');
          this.handleOnCancel();
          this.fetchDeparmenttList(this.props.departInfo.pageQueryParams);
          BoardAction.GetBrokerDepartList();
        } else {
          message.error(res.Data.Desc || '操作失败，请稍后重试');
        }
      }).catch((err) => {
        message.error(err.Desc || '操作失败，请稍后重试');
      });
    }
  }

  handleOnCancel = () => {
    this.setState({
      isEdit: false,
      departModalVisible: false,
      departRecord: {},
      editDepartment: ''
    });
  }

  handleEditDepartmentName = (e) => {
    this.setState({
      editDepartment: e.target.value
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      departInfo: {
        DepartmentList,
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      page,
      pageSize,
      isEdit,
      departModalVisible,
      editDepartment
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>部门管理</h1>
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
                            {getFieldDecorator('DepartName')(
                              <Input placeholder="" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
                          <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </Col>
                      </Row>
                      <Row type="flex" align="end">
                        <Col span={8} style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={this.handleNewDepartment}>新增部门</Button>
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
                    dataSource={DepartmentList}
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
                      title="部门编号"
                      dataIndex="BrokerDepartmentID"
                    />
                    <Column
                      title="部门名称"
                      dataIndex="BrokerDepartmentName"
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

              <Modal
                title={isEdit ? '编辑部门' : '新增部门'}
                visible={departModalVisible}
                onOk={this.handleOnOk}
                onCancel={this.handleOnCancel}
              >
                <Row>
                  <Col>
                      <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="部门名称">
                        <Input value={editDepartment} onChange={this.handleEditDepartmentName} />
                      </FormItem>
                  </Col>
                </Row>
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
      DepartName
    } = props.departInfo.pageQueryParams;

    return {
      DepartName
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.departInfo.pageQueryParams, fields)
    });
  }
})(DepartmentManage);
