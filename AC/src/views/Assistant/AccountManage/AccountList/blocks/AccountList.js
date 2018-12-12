import React from 'react';

import AccountModal from './AccountModal';

import { getAuthority } from 'CONFIG/DGAuthority';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

import AccountManageService from 'SERVICE/Assistant/AccountManageService';

import setParams from 'ACTION/setParams';
import AccountManageAction from 'ACTION/Assistant/AccountManageAction';

const {
  getAccountList,
  getAccoutLevel
} = AccountManageAction;

const {
  getAccountDetail,
  changeAccountStatus
} = AccountManageService;

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

const STATE_NAME = 'state_ac_account_manage';

const AccountStatusMap = {
  1: '启用',
  2: '禁用'
};

class AccountList extends React.PureComponent {
  constructor(props) {
    super(props);
    const { DGList } = getAuthority();

    this.state = {
      page: (this.props.accountInfo.pageQueryParams.RecordIndex / this.props.accountInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      FormDGList: DGList.map(item => {
        return {
          ...item,
          children: item.children.length ? [{
            label: '所有',
            value: 0
          }].concat(item.children) : item.children
        };
      }),
      DGList: DGList,
      AccountModalVisible: false,
      isEdit: false,
      AccountForm: {
        UserLoginName: '',
        UserMobile: '',
        UserRealName: '',
        UserAccountNumber: '',
        UserNickName: '',
        UserWorkMobile: '',
        UserWorkWechat: '',
        UserWorkQQ: [{
          QQ: ''
        }, {
          QQ: ''
        }, {
          QQ: ''
        }],
        UserDepartmentGroup: [],
        UserLevel: '',
        UserBrokerID: 0,
        UserBrokerEmployeeID: 0
      }
    };
  }

  componentWillMount() {
    this.fetchAccountList(this.props.accountInfo.pageQueryParams);
    getAccoutLevel();
  }

  fetchAccountList = (queryParams = {}) => {
    const {
      BrokerAccount,
      LoginName,
      RealName,
      NickName,
      DepartmentGroup,
      AccountStatus,
      RecordIndex,
      RecordSize
    } = queryParams;

    const [departmentId, groupId] = DepartmentGroup.value || [];

    getAccountList({
      BrokerAccount: BrokerAccount.value || '',
      LoginName: LoginName.value || '',
      RealName: RealName.value || '',
      NickName: NickName.value || '',
      AccountStatus: AccountStatus.value != null ? +AccountStatus.value : 0,
      BrokerDepartment: (departmentId === -9999 || departmentId == null) ? 0 : departmentId,
      BrokerGroup: groupId == null ? 0 : groupId,
      OperatorID: employeeId,
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
      accountInfo: {
        pageQueryParams
      }
    } = this.props;
    console.log(pageQueryParams);

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

    this.fetchAccountList({
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
      accountInfo: {
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

    this.fetchAccountList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleNewAccount = () => {
    this.setState({
      isEdit: false,
      AccountModalVisible: true
    });
  }

  handleEditAccount = (record) => {
    getAccountDetail({
      BrokerID: record.BrokerID,
      OperatorID: employeeId
    }).then((res) => {
      if (res.Code === 0) {
        const {
          LoginName,
          Mobile,
          RealName,
          BrokerAccount,
          NickName,
          WorkMobile,
          WorkQQ,
          WorkWeChat,
          BrokerDepartment,
          BrokerGroup,
          RankLevel,
          BrokerID,
          BrokerEmployeeID
        } = res.Data;

        this.setState({
          isEdit: true,
          AccountModalVisible: true,
          AccountForm: {
            UserLoginName: LoginName,
            UserMobile: Mobile,
            UserRealName: RealName,
            UserAccountNumber: BrokerAccount,
            UserNickName: NickName,
            UserWorkMobile: WorkMobile,
            UserWorkWechat: WorkWeChat,
            UserWorkQQ: WorkQQ.map(item => {
              return {
                QQ: item
              };
            }),
            UserDepartmentGroup: BrokerGroup ? [BrokerDepartment, BrokerGroup] : [BrokerDepartment],
            UserLevel: `${RankLevel}`,
            UserBrokerID: BrokerID,
            UserBrokerEmployeeID: BrokerEmployeeID
          }
        });
      } else {
        message.error(res.Data.Desc || '获取详情数据出错了，请稍后重试');
      }
    }).catch((err) => {
      message.error(err.Desc || '获取详情数据出错了，请稍后重试');
    });
  }

  handleSaveAccout = () => {
    this.fetchAccountList(this.props.accountInfo.pageQueryParams);
  }

  handleCancelSaveAccount = () => {
    this.setState({
      isEdit: false,
      AccountModalVisible: false,
      AccountForm: {
        UserLoginName: '',
        UserMobile: '',
        UserRealName: '',
        UserAccountNumber: '',
        UserNickName: '',
        UserWorkMobile: '',
        UserWorkWechat: '',
        UserWorkQQ: [{
          QQ: ''
        }, {
          QQ: ''
        }, {
          QQ: ''
        }],
        UserDepartmentGroup: [],
        UserLevel: '',
        UserBrokerID: 0,
        UserBrokerEmployeeID: 0
      }
    });
  }

  handleChangeAccountStatus = (record) => {
    confirm({
      title: `确认${record.AccountStatus === 2 ? '激活' : '关闭'}该账号吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        changeAccountStatus({
          AccountStatus: record.AccountStatus === 2 ? 1 : 2,
          BrokerID: record.BrokerID,
          OperatorID: employeeId
        }).then((res) => {
          if (res.Code === 0) {
            message.success(`成功${record.AccountStatus === 2 ? '激活' : '关闭'}该账号`);
            this.fetchAccountList(this.props.accountInfo.pageQueryParams);
          } else {
            message.error(res.Data.Desc || '操作失败，请稍后重试');
          }
        }).catch((err) => {
          message.error(err.Desc || '操作失败，请稍后重试');
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      accountInfo: {
        AccountList,
        RankLevelList,
        RecordCount,
        isFetching
      }
    } = this.props;

    const {
      page,
      pageSize,
      FormDGList,
      DGList,
      AccountForm,
      AccountModalVisible,
      isEdit
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>账号查询</h1>
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
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="工号">
                            {getFieldDecorator('BrokerAccount')(
                              <Input placeholder="会员工号" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="英文名/登录名">
                            {getFieldDecorator('LoginName')(
                              <Input placeholder="会员英文名/登录名" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="真实姓名">
                            {getFieldDecorator('RealName')(
                              <Input placeholder="会员真实姓名" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="昵称">
                            {getFieldDecorator('NickName')(
                              <Input placeholder="会员昵称" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={8}>
                        <Col span={6}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="部门/队">
                            {getFieldDecorator('DepartmentGroup')(
                              <Cascader
                                allowClear={true}
                                placeholder="请选择"
                                options={FormDGList}
                              >
                              </Cascader>
                            )}
                          </FormItem>
                        </Col>

                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="状态">
                            {getFieldDecorator('AccountStatus')(
                              <Select size="default" placeholder="请选择">
                                <Option value="0">全部</Option>
                                {
                                  Object.keys(AccountStatusMap).map((key) => {
                                    return (
                                      <Option key={key} value={key}>{AccountStatusMap[key]}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6} offset={6} style={{ textAlign: 'right' }}>
                          <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                          <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </Col>
                      </Row>

                      <Row type="flex" align="end">
                        <Col span={6} style={{ textAlign: 'right' }}>
                          <Button type="primary" onClick={this.handleNewAccount}>新增账号</Button>
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
                    dataSource={AccountList}
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
                      title="工号"
                      dataIndex="BrokerAccount"
                    />
                    <Column
                      title="英文名（登录名）"
                      dataIndex="LoginName"
                    />
                    <Column
                      title="姓名"
                      dataIndex="RealName"
                    />
                    <Column
                      title="手机号"
                      dataIndex="Mobile"
                    />
                    <Column
                      title="部门"
                      dataIndex="BrokerDepartment"
                    />
                    <Column
                      title="战队"
                      dataIndex="BrokerGroup"
                    />
                    <Column
                      title="昵称"
                      dataIndex="NickName"
                    />
                    <Column
                      title="创建日期"
                      dataIndex="CreateTime"
                    />
                    <Column
                      title="状态"
                      dataIndex="AccountStatus"
                      render={(text, record) => {
                        return AccountStatusMap[text] || '';
                      }}
                    />
                    <Column
                      title="操作"
                      key="action"
                      render={(text, record) => {
                        return (
                          <div>
                            <Button type="primary" onClick={() => this.handleEditAccount(record)}>编辑</Button>
                            <Button onClick={() => this.handleChangeAccountStatus(record)}>{record.AccountStatus === 2 ? '激活' : '关闭'}</Button>
                          </div>
                        );
                      }}
                    />
                  </Table>
                </Col>
              </Row>

              <AccountModal
                visible={AccountModalVisible}
                onOk={this.handleSaveAccout}
                onCancel={this.handleCancelSaveAccount}
                isEdit={isEdit}
                AccountForm={AccountForm}
                DGList={DGList}
                RankLevelList={RankLevelList}
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
      BrokerAccount,
      LoginName,
      RealName,
      NickName,
      DepartmentGroup,
      AccountStatus
    } = props.accountInfo.pageQueryParams;

    return {
      BrokerAccount,
      LoginName,
      RealName,
      NickName,
      DepartmentGroup,
      AccountStatus
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.accountInfo.pageQueryParams, fields)
    });
  }
})(AccountList);
