import React, { Fragment } from 'react';
import { Tree, Button, Menu, Dropdown, Icon, Spin, Modal } from 'antd';
import { tabWrap } from 'ADMIN_PAGES';
import { inject, observer } from "mobx-react";
import AddUserModel from './addUserModal';
import authority, { AuthorityButton } from 'ADMIN_COMPONENTS/Authority';
import { toJS } from 'mobx';
const confirm = Modal.confirm;
@tabWrap({
  tabName: '岗位&角色&员工关系图',
  stores: ['userManagerStore']
})
@inject('userManagerStore')
@observer
export default class extends React.Component {

  componentDidMount () {
    if (!this.props.userManagerStore.view.isDirty) {
      this.init();
    }
  }

  init = (query) => {
    this.props.userManagerStore.getUserRoleJobRelation();
  };


  handleDropDownMenuClick = ({ item, key }) => {
    this.props.userManagerStore.handleResourceSave(item.props.pos, key);
  };

  menu = (ResID, pos, attrType) => {
    const position = pos.split('-');
    return (
      <Menu onClick={this.handleDropDownMenuClick} style={{ width: 200, height: 130 }}>
        <Menu.Item key="add" id={ResID} pos={position}
          disabled={!(attrType === 2 || attrType === 5 || attrType === 6)}>
          <Icon type="file-add" className='mr-8' />添加子菜单
                </Menu.Item>
        <Menu.Item key="add-fun" id={ResID} pos={position}
          disabled={!(attrType === 3 || attrType === 5 || attrType === 6)}>
          <Icon type="ellipsis" className='mr-8' />添加功能
                </Menu.Item>
        <Menu.Item key="modify" id={ResID} pos={position}>
          <Icon type="edit" className='mr-8' />修改
                </Menu.Item>
        <Menu.Item key="delete" id={ResID} pos={position} disabled={!(attrType === 1 || attrType === 5)}>
          <Icon type="delete" className='mr-8' />删除
                </Menu.Item>
      </Menu>
    );
  };

  /**
   * attrType
   *
   *  当Resource.Type === 2    按钮
   *      1：按钮
   *  当Resource.Type === 1    菜单
   *      2：有子菜单
   *      3：有子功能
   *      4：既有子菜单，又有子功能
   *      5：无child
   *      6：有child，无子菜单，无子功能(特殊情况)
   *
   * @param data
   * @param pPos
   * @param hasChange
   * @returns {any}
   */

  loop = (data, pPos, hasChange) => {
    return data && data.length ? data.map((item, index) => {
      let pos = (pPos ? pPos + '-' : '') + index;
      let attrType = item.attrType;
      // let icon = item.IconUrl ? <img width={16} height={16} src={item.IconUrl} /> :
      //   attrType === 1 ? <Icon type="appstore-o" /> :
      //     attrType === 5 ? <Icon type="file" /> :
      //       <Icon type="folder" />;
      /*            const title = <Dropdown overlay={this.menu(item.ResID, pos, attrType)} disabled={hasChange}
                                          trigger={['contextMenu']}>
                                   <span>
                                       <span
                                           className={item.Name ? 'color-cyan' : 'color-red'}>{item.Name || '(未配置名称)'}</span>
                                       <span
                                           style={{userSelect: 'none'}}>{item.NavUrl ? '（链接：' + item.NavUrl + '）' : ''}</span>
                                   </span>
                  </Dropdown>; */

      const title = <span>
        <span className={item.JobTitleName ? 'color-cyan' : 'color-red'}>
          {item.JobTitleName}({item.RoleName})({item.Employees ? item.Employees.map((employee, index) => employee.EmployeeName + (index === toJS(item.Employees).length - 1 ? '' : '，')) : '无'})
        </span>
        <MenuEditGroup pos={pos} attrType={attrType} handleMenuEdit={this.handleDropDownMenuClick} />
      </span>;
      return (
        <Tree.TreeNode
          // icon={icon}
          key={item.JobTitleID} selectable={false}
          title={title}>
          {this.loop(item, pos, hasChange)}
        </Tree.TreeNode>
      );
    }) : undefined;
  };

  render () {
    // const { handleAddMenu, getResourceList, handleResourceChangeCommit, handleResourceDrop, handleResourceModalCancel, handleResourceModalConfirm, handleResourceModalAfterClose } = this.props.ptResourceStore;
    // const { ResourceData, ResourceModal: ResourceModalItem, loadResourceLoading } = this.props.ptResourceStore.view;
    const { view, getUserRoleJobRelation, onDrop, saveJiguan, deleteDisabled, handleTabRowChange, handleOnchangeJoblist, handleFormReset, handleFormValuesChange, handleAddValuesChange, getBillList, showAddModel, hiddenAddModel, saveAddModeValue } = this.props.userManagerStore;
    const { jobTitleList, searchValue, billList, paging, getBillListStatus, total, cityModelValue, cityModelName, selectedRowKeys } = view;
    const { hasChange, userJobList, treeLoading, totalNum, unValidNum, ValidNum, roleList, jobList, employeeList } = view;
    return (
      <Spin
        spinning={treeLoading}
      >
        {/* {
          ResourceData && ResourceData.Resources && toJS(ResourceData.Resources).length === 0 &&
          <Button type='primary' className='mr-8' onClick={handleAddMenu}>新建</Button>
        } */}
        <Button type='primary' className='mr-8'
          // onClick={handleResourceChangeCommit} 
          disabled={!hasChange}>保存</Button>
        <Button disabled={!hasChange}
        // onClick={getResourceList}
        >重置</Button>
        {/* {!loadResourceLoading && <Tree
          showIcon showLine defaultExpandAll draggable={true}
        // onDrop={handleResourceDrop}
        >
          {this.loop(userJobList, '', hasChange)}
        </Tree>} */}
        <Tree
          showIcon showLine defaultExpandAll draggable={true}
          onDrop={onDrop}
        >
          {this.loop(userJobList, '', hasChange)}
        </Tree>
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

      </Spin>
    );
  }
}

class MenuEditGroup extends React.Component {

  handleMenuEdit = this.props.handleMenuEdit;

  handleClick = (e) => {
    const pos = this.props.pos;
    const key = e.target.name;
    if (key && pos) {
      const position = pos.split('-');
      this.handleMenuEdit({
        item: { props: { pos: position } }, key
      });
    }
  };

  render () {
    const attrType = this.props.attrType;
    return (
      <span onClick={this.handleClick} className='ml-8'>
        <Fragment>| <a className='ml-8 mr-8' name="add">添加子菜单</a></Fragment>
        <Fragment>| <a className='ml-8 mr-8' name="add-fun">添加功能</a></Fragment>
        <Fragment>| <a className='ml-8 mr-8' name="modify">修改</a></Fragment>
        <Fragment>| <a className='ml-8 mr-8' name="delete">删除</a></Fragment>
      </span>
    );
  }
}