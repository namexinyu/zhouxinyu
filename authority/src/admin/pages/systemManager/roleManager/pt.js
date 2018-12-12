import React, { Fragment } from 'react';
import { tabWrap } from 'ADMIN_PAGES';
import { inject, observer } from "mobx-react";
import { Button, Table, Row, Modal, Col } from 'antd';
import { RoleType } from 'ADMIN_CONFIG/enum/Role';
import RoleModal from './roleModal';
import RoleResourceModal from './roleResourceModal';
import 'ADMIN_ASSETS/less/pages/roleManager.less';

const confirm = Modal.confirm;
@tabWrap({
  tabName: '平台角色管理',
  stores: ['ptRoleStore']
})
@inject('ptRoleStore', 'globalStore')
@observer
export default class extends React.Component {
  getRoleList = this.props.ptRoleStore.getRoleList;
  handleTabRowClick = this.props.ptRoleStore.handleTabRowClick;
  handleDeleteRole = this.props.ptRoleStore.handleDeleteRole;

  componentDidMount () {
    if (!this.props.ptRoleStore.view.isDirty) {
      this.getRoleList();
    }
  }

  handleDeleteRoleConfirm = () => {
    confirm({
      title: '提示',
      content: '删除记录后不可恢复，确定删除删除吗？',
      onOk: () => this.handleDeleteRole()
    });
  };

  handleTableRow = {
    onRow: record => ({
      // 点击表格行
      onClick: event => this.handleTabRowClick(event.target.name, record),
      // 鼠标移入行
      onMouseEnter: event => {
      }
    }),

    onHeaderRow: column => ({
      // 点击表头行
      onClick: () => {
      }
    })
  };

  render () {
    const { view, handleTableChange, handleTabRowChange, handleRoleModalChange, handleRoleResourceModalChange, deleteDisabled } = this.props.ptRoleStore;
    const { pagination, roleModalInfo, roleResourceModalInfo, ResourceData, expandedKeys, tableRecordList, tableLoading, selectedRowKeys, configRoleID } = view;
    return (
      <Fragment>
        <Row className='mb-16'>
          <Button onClick={handleRoleModalChange.onShow} type='primary'>新增</Button>
          <Button className='ml-8' type='danger'
            onClick={this.handleDeleteRoleConfirm}
            disabled={deleteDisabled}>删除</Button>
        </Row>
        <RoleModal
          Visible={roleModalInfo.Visible}
          confirmLoading={roleModalInfo.confirmLoading}
          roleModalInfo={roleModalInfo}
          handleModalChange={handleRoleModalChange} />
        <Row className="role-manager">
          <Col span={14}>
            <Table
              rowKey='RoleID'
              bordered={true}
              {...this.handleTableRow}
              rowSelection={{
                selectedRowKeys,
                onChange: handleTabRowChange
              }}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['10', '50', '100', '200'],
                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
              }}
              dataSource={tableRecordList.toJS()} // mobx的数组，实际上是一个obj，需要转换成 js 的数组，mobx数组有个 toJS 的 function
              loading={tableLoading}
              onChange={handleTableChange}
              rowClassName={(record, index) => record.RoleID === configRoleID ? 'bg-color' : ''}
              columns={[
                { title: '角色名称', dataIndex: 'RoleName' },
                { title: '备注', dataIndex: 'Remark' },
                {
                  title: '操作', dataIndex: 'xxx',
                  width: '130px',
                  render: (text, record) => <span>
                    <a name="edit" className='mr-8' style={{ color: record.RoleID === configRoleID ? '#fff' : '#40a9ff' }}>修改</a>|
                                <a name="config" className='ml-8' style={{ color: record.RoleID === configRoleID ? '#fff' : '#40a9ff' }}>配置权限</a>
                  </span>
                }
              ]} />
          </Col>
          <Col span={10} style={{ padding: '0 10px' }}>
            <div className="orderBox">
              <div className="order-title">
                <span>操作栏</span>
              </div>
              {
                roleResourceModalInfo.Visible &&
                <div className="role-tree">
                  <RoleResourceModal
                    Visible={roleResourceModalInfo.Visible}
                    confirmLoading={roleResourceModalInfo.confirmLoading}
                    checkedKeys={roleResourceModalInfo.checkedKeys}
                    expandedKeys={expandedKeys}
                    ResourceData={ResourceData}
                    handleModalChange={handleRoleResourceModalChange} />
                </div>}
              <div className="order-btnbox">
                <Button size='small' type="danger" onClick={handleRoleResourceModalChange.onCancel} disabled={roleResourceModalInfo.disabled}>取消</Button>
                <Button size='small' disabled={roleResourceModalInfo.disabled} loading={roleResourceModalInfo.confirmLoading} type="primary" style={{ marginLeft: '55px' }} onClick={handleRoleResourceModalChange.onOk}>保存</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}