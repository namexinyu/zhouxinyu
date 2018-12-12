import React from 'react';
import { Modal, Tree, Icon } from 'antd';
import { toJS } from 'mobx';

export default class RoleResourceModal extends React.PureComponent {

  loop = (data) => {
    const Resources = data.SubResources || data.Resources;
    return Resources && Resources.length ? Resources.map(item => {
      let icon = item.SubResources && item.SubResources.length ? <Icon type="folder" /> :
        item.Type === 1 ? <Icon type="file" /> :
          item.Type === 2 ? <Icon type="appstore-o" /> : undefined;
      return (
        <Tree.TreeNode
          icon={icon}
          key={item.MenuID} selectable={false}
          title={item.MenuName}>
          {this.loop(item)}
        </Tree.TreeNode>
      );
    }) : undefined;
  };

  render () {
    const { Visible, confirmLoading, ResourceData, checkedKeys, handleModalChange } = this.props;
    return (
      <div>
        <Tree
          checkStrictly={true}
          checkable defaultExpandAll showIcon showLine
          onCheck={handleModalChange.onResourceCheck}
          checkedKeys={toJS(checkedKeys)}>
          {this.loop(ResourceData)}
        </Tree>
      </div>
    );
  }
};