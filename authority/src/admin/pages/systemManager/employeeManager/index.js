import React from 'react';
import { Table, Input, Button, Form, Row, Col, Select } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { toJS } from 'mobx';
import moment from 'moment';
import SearchForm from './searchForm';
import AddEmployee from './AddEmployee';

@tabWrap({
  tabName: '员工管理',
  stores: ['employeeManagerStore']
})
@inject('employeeManagerStore')
@observer
export default class extends React.Component {
  state = {
    selectedRowKeys: [],
    WorkNumOrder: 'ascend',
    EnNameOrder: '',
    CreateTimeOrder: '',
    LastModifytimeOrder: ''
  };
  // 分页查询
  onChange = (pagination, filters, sorter) => {
    const { savePage, orderSort } = this.props.employeeManagerStore;
    if (sorter.columnKey === 'WorkNum' && sorter.order !== this.state.WorkNumOrder) {
      this.setState({ WorkNumOrder: sorter.order });
      orderSort('WorkNumOrder', sorter.order === 'ascend' ? 1 : 2);
    } else if (sorter.columnKey === 'EnName' && sorter.order !== this.state.EnNameOrder) {
      this.setState({ EnNameOrder: sorter.order });
      orderSort('EnNameOrder', sorter.order === 'ascend' ? 1 : 2);
    } else if (sorter.columnKey === 'CreateTime' && sorter.order !== this.state.CreateTimeOrder) {
      this.setState({ CreateTimeOrder: sorter.order });
      orderSort('CreateTimeOrder', sorter.order === 'ascend' ? 1 : 2);
    } else if (sorter.columnKey === 'LastModifyTime' && sorter.order !== this.state.LastModifytimeOrder) {
      this.setState({ LastModifytimeOrder: sorter.order });
      orderSort('LastModifytimeOrder', sorter.order === 'ascend' ? 1 : 2);
    } else {
      savePage({ page: pagination.current, pageSize: pagination.pageSize });
      this.init(1);
    }
  };

  showTotal = (total) => {
    return `总共 ${total} 条数`;
  };

  componentDidMount () {
    if (!this.props.employeeManagerStore.view.isDirty) {
      this.init();
      this.props.employeeManagerStore.getEmployeeList();
    }
  };

  init = (query) => {
    this.props.employeeManagerStore.getBillList(query);
  };

  showAddModelChange = () => {
    let { employeeManagerStore } = this.props;
    employeeManagerStore.showAddModel();
  }

  editAddModeValue = (record) => {
    this.props.employeeManagerStore.editAddModeValue(record);
  }

  render () {
    const { view, saveJiguan, saveEmployeeName, handleFormReset, handleFormValuesChange, handleAddValuesChange, getBillList, showAddModel, hiddenAddModel, saveAddModeValue, handleOnchangeTitleList } = this.props.employeeManagerStore;
    const { searchValue, billList, paging, getBillListStatus, total, cityModelValue, cityModelName } = view;
    const { employeeList, jobList, leaveNum, onJobNum, totalNum } = view;
    const jobListData = toJS(jobList);
    let columns = [
      {
        title: '工号',
        dataIndex: 'WorkNum',
        width: '10%',
        // defaultSortOrder: 'ascend',
        sorter: true
      }, {
        title: '英文名',
        dataIndex: 'EnName',
        className: 'bg-y',
        width: '10%',
        sorter: true
      }, {
        title: '姓名',
        dataIndex: 'Name',
        className: 'bg-y',
        width: '10%'
      }, {
        title: '岗位',
        dataIndex: 'JobTitleName',
        className: 'bg-y',
        width: '10%',
        render: (text, record, index) => record.JobTitles && record.JobTitles.map((item, index) => item.JobTitleName + (index === record.JobTitles.length - 1 ? '' : '，'))
      }, {
        title: '角色',
        dataIndex: 'RoleName',
        className: 'bg-y',
        width: '10%',
        render: (text, record, index) => record.JobTitles && record.JobTitles.map((item, index) => item.RoleName + (index === record.JobTitles.length - 1 ? '' : '，'))
      }, {
        title: '账户状态',
        dataIndex: 'IsValid',
        className: 'bg-y',
        width: '10%',
        render: (text, record, index) => text && text === 1 ? '在职' : text === 2 ? <span style={{ color: '#e84e40' }}>离职</span> : ''
      }, {
        title: '操作',
        dataIndex: 'oprate',
        className: 'bg-y',
        width: '10%',
        render: (text, record, index) => <a onClick={() => this.editAddModeValue(record)}>编辑</a>

      }, {
        title: '创建时间',
        dataIndex: 'CreateTime',
        className: 'bg-y',
        width: '10%',
        sorter: true
      }, {
        title: '最后修改时间',
        dataIndex: 'LastModifyTime',
        // render: (text, record, index) => moment(text).isValid() && moment(text).format('YYYY-MM-DD'),
        className: 'bg-y',
        width: '10%',
        sorter: (a, b) => a.LastModifyTime - b.LastModifyTime
      }];
    return (
      <div>
        <SearchForm
          onValuesChange={handleFormValuesChange}
          searchValue={searchValue}
          handleSubmit={getBillList}
          handleFormReset={handleFormReset}
          employeeList={employeeList}
          saveJiguan={saveJiguan}
          saveEmployeeName={saveEmployeeName}
        />
        <Button style={{ marginBottom: '10px', marginRight: '50px' }} type="primary" onClick={() => this.showAddModelChange()}>新增</Button>
        <span>全部人员{totalNum}个，在职{onJobNum}个人，离职{leaveNum}个</span>
        <Table
          rowKey="EmployeeID"
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
        <AddEmployee
          userManagerStore={this.props.userManagerStore}
          cityModelName={cityModelName}
          cityModelValue={cityModelValue}
          onValuesChange={handleAddValuesChange}
          hiddenAddModel={hiddenAddModel}
          getBillListStatus={getBillListStatus}
          saveAddModeValue={saveAddModeValue}
          jobList={jobListData}
          handleOnchange={handleOnchangeTitleList}
        />
      </div>
    );
  }
}