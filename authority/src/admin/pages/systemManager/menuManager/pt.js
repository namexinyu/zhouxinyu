import React, { Fragment } from 'react';
import { Tree, Button, Menu, Dropdown, Icon, Spin } from 'antd';
import { tabWrap } from 'ADMIN_PAGES';
import { inject, observer } from "mobx-react";
import ResourceModal from './resourceModal';
import authority, { AuthorityButton } from 'ADMIN_COMPONENTS/Authority';
import { toJS } from 'mobx';
@tabWrap({
  tabName: '平台菜单管理',
  stores: ['ptResourceStore']
})
@inject('ptResourceStore')
@observer
export default class extends React.Component {

  componentDidMount () {
    if (!this.props.ptResourceStore.view.isDirty) {
      this.init();
    }
  }

  init () {
    this.props.ptResourceStore.getResourceList();
  }

  handleDropDownMenuClick = ({ item, key }) => {
    this.props.ptResourceStore.handleResourceSave(item.props.pos, key);
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
    const Resources = data.SubResources || data.Resources;
    return Resources && Resources.length ? Resources.map((item, index) => {
      let pos = (pPos ? pPos + '-' : '') + index;
      let attrType = item.attrType;
      let icon = item.IconUrl ? <img width={16} height={16} src={item.IconUrl} /> :
        attrType === 1 ? <Icon type="appstore-o" /> :
          attrType === 5 ? <Icon type="file" /> :
            <Icon type="folder" />;
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
        <span className={item.MenuName ? 'color-cyan' : 'color-red'}>{item.MenuName || '(未配置名称)'}</span>
        <span style={{ userSelect: 'none' }}>{item.NavUrl ? '（链接：' + item.NavUrl + '）' : ''}</span>
        <MenuEditGroup pos={pos} attrType={attrType} handleMenuEdit={this.handleDropDownMenuClick} />
      </span>;
      return (
        <Tree.TreeNode
          icon={icon}
          key={item.MenuID} selectable={false}
          title={title}>
          {this.loop(item, pos, hasChange)}
        </Tree.TreeNode>
      );
    }) : undefined;
  };

  render () {
    const { handleAddMenu, getResourceList, handleResourceChangeCommit, handleResourceDrop, handleResourceModalCancel, handleResourceModalConfirm, handleResourceModalAfterClose } = this.props.ptResourceStore;
    const { ResourceData, hasChange, ResourceModal: ResourceModalItem, loadResourceLoading } = this.props.ptResourceStore.view;
    return (
      <Spin spinning={loadResourceLoading}>
        {
          ResourceData && ResourceData.Resources && toJS(ResourceData.Resources).length === 0 &&
          <Button type='primary' className='mr-8' onClick={handleAddMenu}>新建</Button>
        }
        <Button type='primary' className='mr-8'
          onClick={handleResourceChangeCommit} disabled={!hasChange}>保存</Button>
        <Button disabled={!hasChange} onClick={getResourceList}>重置</Button>
        {!loadResourceLoading && <Tree
          showIcon showLine defaultExpandAll draggable={true}
          onDrop={handleResourceDrop}>
          {this.loop(ResourceData, '', hasChange)}
        </Tree>}
        <ResourceModal {...ResourceModalItem}
          handleCancel={handleResourceModalCancel}
          handleAfterClose={handleResourceModalAfterClose}
          handleConfirm={handleResourceModalConfirm}
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
        {(attrType === 2 || attrType === 5 || attrType === 6) &&
          <Fragment>| <a className='ml-8 mr-8' name="add">添加子菜单</a></Fragment>}
        {(attrType === 3 || attrType === 5 || attrType === 6) &&
          <Fragment>| <a className='ml-8 mr-8' name="add-fun">添加功能</a></Fragment>}
        <Fragment>| <a className='ml-8 mr-8' name="modify">修改</a></Fragment>
        {(attrType === 1 || attrType === 5) &&
          <Fragment>| <a className='ml-8 mr-8' name="delete">删除</a></Fragment>}
      </span>
    );
  }
}