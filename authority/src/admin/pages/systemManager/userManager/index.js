import React from 'react';
import { Table, Input, Button, Form, Row, Col, Select, Modal } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { toJS } from 'mobx';
import { Link } from 'react-router-dom';
import SearchForm from './searchForm';
import AddUserModel from './addUserModal';
import 'ADMIN_ASSETS/less/pages/userManager.less';
const confirm = Modal.confirm;
@tabWrap({
  tabName: '我打岗位设置',
  stores: ['userManagerStore']
})
@inject('userManagerStore')
@observer
export default class extends React.Component {
  state = {
    selectedRowKeys: [],
    JobTitleOrder: 'ascend',
    RoleOrder: '',
    CreateTimeOrder: '',
    LastModifyTimeOrder: '',
    visible: false
  };
  // 分页查询
  onChange = (pagination, filters, sorter) => {
    const { savePage, orderSort } = this.props.userManagerStore;
    if (sorter.columnKey === 'JobTitleName' && sorter.order !== this.state.JobTitleOrder) {
      this.setState({ JobTitleOrder: sorter.order });
      orderSort('JobTitleOrder', sorter.order === 'ascend' ? 1 : 2);
    } else if (sorter.columnKey === 'RoleName' && sorter.order !== this.state.RoleOrder) {
      this.setState({ RoleOrder: sorter.order });
      orderSort('RoleOrder', sorter.order === 'ascend' ? 1 : 2);
    } else if (sorter.columnKey === 'CreateTime' && sorter.order !== this.state.CreateTimeOrder) {
      this.setState({ CreateTimeOrder: sorter.order });
      orderSort('CreateTimeOrder', sorter.order === 'ascend' ? 1 : 2);
    } else if (sorter.columnKey === 'LastModifyTime' && sorter.order !== this.state.LastModifyTimeOrder) {
      this.setState({ LastModifyTimeOrder: sorter.order });
      orderSort('LastModifyTimeOrder', sorter.order === 'ascend' ? 1 : 2);
    } else {
      savePage({ page: pagination.current, pageSize: pagination.pageSize });
      this.init(1);
    }
  };

  showTotal = (total) => {
    return `总共 ${total} 条数`;
  };

  componentDidMount () {
    this.props.userManagerStore.getJobTitleList();
    this.props.userManagerStore.getBillList();
  };

  init = (query) => {
    this.props.userManagerStore.getBillList(query);
  };

  showAddModelChange = () => {
    let { userManagerStore } = this.props;
    userManagerStore.showAddModel();
  }

  editAddModeValue = (record) => {
    this.props.userManagerStore.editAddModeValue(record);
  }

  handleOpenModal = () => {
    this.props.userManagerStore.getUserRoleJobRelation();
    this.setState({
      visible: true
    });
  }

  handleCancle = () => {
    this.setState({
      visible: false
    });
  }

  render () {
    const { view, saveJiguan, deleteDisabled, handleTabRowChange, handleOnchangeJoblist, handleFormReset, handleFormValuesChange, handleAddValuesChange, getBillList, showAddModel, hiddenAddModel, saveAddModeValue } = this.props.userManagerStore;
    const { jobTitleList, searchValue, billList, paging, getBillListStatus, total, cityModelValue, cityModelName, selectedRowKeys } = view;
    const { userJobList, totalNum, unValidNum, ValidNum, roleList, jobList, employeeList } = view;
    let columns = [
      {
        title: '岗位名称',
        dataIndex: 'JobTitleName',
        width: '15%',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.JobTitleName.length - b.JobTitleName.length
      }, {
        title: '所属角色',
        dataIndex: 'RoleName',
        className: 'bg-y',
        width: '15%',
        sorter: (a, b) => a.RoleName.length - b.RoleName.length
      }, {
        title: '人员',
        dataIndex: 'Employees',
        className: 'bg-y',
        width: '10%',
        render: (text, redord, index) => text && text.map((item, index) => item.EmployeeName + (index === text.length - 1 ? '' : '，'))
      }, {
        title: '上级岗位',
        dataIndex: 'LeaderTitleName',
        className: 'bg-y',
        width: '10%'
      }, {
        title: '下级岗位数量',
        dataIndex: 'UnderTitleNum',
        className: 'bg-y',
        width: '10%'
      }, {
        title: '账户状态',
        dataIndex: 'Status',
        className: 'bg-y',
        width: '10%',
        render: (text, record) => <span>{record.Employees && record.Employees.length > 0 ? <span>有人</span> : <span className="color-red">无人</span>}</span>
      },
      {
        title: '操作',
        dataIndex: 'oprate',
        className: 'bg-y',
        width: '10%',
        render: (text, record, index) => <a onClick={this.editAddModeValue.bind(this, record)}>编辑</a>
      },
      {
        title: '创建时间',
        dataIndex: 'CreateTime',
        className: 'bg-y',
        width: '10%',
        sorter: true
      }, {
        title: '最后修改时间',
        dataIndex: 'LastModifyTime',
        className: 'bg-y',
        width: '10%',
        sorter: true
      }];
    return (
      <div className="user-manager">
        <SearchForm
          onValuesChange={handleFormValuesChange}
          searchValue={searchValue}
          handleSubmit={getBillList}
          jobTitleList={jobTitleList}
          saveJiguan={saveJiguan}
          handleFormReset={handleFormReset}
        />
        <div style={{ marginBottom: '10px', marginLeft: '5px' }}>全部岗位有{totalNum}个，有人岗位{ValidNum}个人，无人{unValidNum}个</div>
        <Table
          rowKey="JobTitleID"
          columns={columns}
          bordered
          dataSource={toJS(billList)}
          onChange={this.onChange}
          pagination={{
            showQuickJumper: true,
            current: paging.RecordIndex,
            showSizeChanger: true,
            pageSize: paging.RecordSize,
            total: total,
            pageSizeOptions: ['10', '20', '30', '50', '100', "200"],
            showTotal: this.showTotal
          }}
          loading={getBillListStatus} />
        <AddUserModel
          roleList={roleList}
          userJobList={userJobList}
          jobList={jobList}
          handleOnchange={handleOnchangeJoblist}
          employeeList={employeeList}
          userManagerStore={this.props.userManagerStore}
          cityModelName={cityModelName}
          cityModelValue={cityModelValue}
          onValuesChange={handleAddValuesChange}
          hiddenAddModel={hiddenAddModel}
          getBillListStatus={getBillListStatus}
          saveAddModeValue={saveAddModeValue}
        />
      </div>
    );
  }
}