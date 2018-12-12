import React from 'react';
import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getWdAthuRoleList, addWdAthuRole, editWdAthuRole, deleteWdAthuRole, configWdAthuRole, getWdAuthMenuResources } from 'ADMIN_SERVICE/WDGP_Authority';
import { toJS } from 'mobx';
export class View extends BaseView {
  @observable pagination = {
    total: 0,
    pageSize: 10,
    current: 1
  };
  @observable tableRecordList = [];
  @observable selectedRowKeys = [];
  @observable tableLoading = false; // 用于table组件的loading状态
  @observable configRoleID = ''; // 标记配置哪一行
  @observable PlatType = 1;
  @observable roleModalInfo = {
    Visible: false,
    confirmLoading: false,
    RoleID: ''
  };

  @observable configRoleInfo = {
    Visible: false,
    confirmLoading: false,
    RoleID: ''
  };

  @observable ResourceData = {};
  @observable roleResourceModalInfo = {
    disabled: true,
    confirmLoading: false,
    checkedKeys: {}
  };
  checked: []
}


export default class extends BaseViewStore {
  // pagination
  @action
  handleTableChange = (pagination, filters, sorter) => {
    let change = {
      current: pagination.current < 1 ? 1 : pagination.current,
      pageSize: pagination.pageSize
    };
    this.view.pagination.current = change.current;
    this.view.pagination.pageSize = change.pageSize;
    this.getRoleList();
  };

  // get role list
  @action
  getRoleList = async () => {
    this.view.tableLoading = true;
    try {
      const { current, pageSize } = this.view.pagination;
      let res = await getWdAthuRoleList({
        RecordIndex: (current - 1) * pageSize,
        RecordSize: pageSize,
        PlatType: 1
      });
      this.view.tableRecordList = res.Data.RoleList || [];
      this.view.selectedRowKeys = [];
      this.view.pagination.total = res.Data.RecordCount;
    } catch (e) {
      this.view.tableRecordList = [];
    }
    this.view.tableLoading = false;
  };
  // get menu resource
  @action.bound
  async mergeResourceList (record) {
    let res = await getWdAuthMenuResources({ PlatType: 1 });
    this.view.ResourceData = res.Data || {};
    this.view.roleResourceModalInfo = {
      ...this.view.roleResourceModalInfo,
      Visible: true,
      checkedKeys: {
        checked: (record.MenuIDList || []).map(item => item.toString())
      }
    };
  };

  // edit role or config authority
  @action.bound
  handleTabRowClick (name, record) {
    this.view.roleModalInfo = {
      ...this.view.roleModalInfo,
      RoleID: record.RoleID,
      RoleName: record.RoleName,
      Remark: record.Remark,
      checkedKeys: {
        checked: (record.MenuIDList || []).map(item => item.toString())
      }
    };
    this.view.checked = record.MenuIDList;
    if (name === 'edit') {
      // this.view.configRoleID = record.RoleID;
      this.view.roleModalInfo = {
        ...this.view.roleModalInfo,
        Visible: true,
        RoleID: record.RoleID,
        RoleName: record.RoleName,
        Remark: record.Remark
      };
    } else if (name === 'config') {
      this.mergeResourceList(record);
      this.view.configRoleID = record.RoleID;
      this.view.configRoleInfo = {
        ...this.view.configRoleInfo,
        Visible: true,
        RoleID: record.RoleID,
        RoleName: record.RoleName,
        Remark: record.Remark
      };
    }
  }
  // delete role
  @action.bound
  async handleDeleteRole () {
    try {
      await deleteWdAthuRole({ RID: this.view.selectedRowKeys, PlatType: 1 });
      message.success('删除成功');
    } catch (e) {
      message.error(e.message);
    }
    this.getRoleList();
  }

  handleRoleModalChange = {
        // open modal
  @action
  onShow: () => {
    this.view.roleModalInfo = {
        ...this.view.roleModalInfo,
        Visible: true,
        RoleID: '',
        RoleName: '',
        Remark: ''
    };
  },
// save role
@action
onOk: async (bFlag) => {
  
  let RoleInfo = this.view.roleModalInfo;
  RoleInfo.confirmLoading = true;
  try {
    
    let param = {
      Remark: RoleInfo.Remark,
      RoleName: RoleInfo.RoleName,
      RoleID: RoleInfo.RoleID,
      PlatType: 1
    };
    RoleInfo.RoleID && (param.RoleID = RoleInfo.RoleID);
    RoleInfo.RoleID ? await editWdAthuRole(param) : await addWdAthuRole(param);
    RoleInfo.Visible = false;
  } catch (e) {
    message.error(e.message);
  }
  RoleInfo.confirmLoading = false;
  this.getRoleList();
},
        @action
onCancel: () => {
  this.view.roleModalInfo.Visible = false;
},
        @action
afterClose: () => {
  this.view.resetProperty('roleModalInfo');
},
        @action
handleValuesChange: values => (this.view.roleModalInfo = { ...this.view.roleModalInfo, ...values })
    };

handleRoleResourceModalChange = {
        @action
onOk: async () => {
  this.view.roleResourceModalInfo.confirmLoading = true;
  try {
    const { checkedKeys, RoleID } = this.view.roleResourceModalInfo;
    const MenuIDList = checkedKeys.checked && toJS(checkedKeys.checked);
    let checkedList = [];
    if (checkedKeys.checked) checkedList.push(MenuIDList);
    if (checkedKeys.halfChecked) checkedList.push(...checkedKeys.halfChecked);
    let ResIDList = Array.from(new Set(checkedList)).map(item => Number(item));
    let res = await configWdAthuRole({
      ...this.view.configRoleInfo,
      MenuIDList,
      PlatType: 1
    });
    if (res.Code === 0) {
      message.success('配置成功');
    }
    // this.view.roleResourceModalInfo.Visible = false;
    // this.view.configRoleID = RoleID;
  } catch (e) {
    message.error(e.message);
  }
  this.view.roleResourceModalInfo.confirmLoading = false;
  this.getRoleList();
},
        @action
onCancel: () => {
  this.view.roleResourceModalInfo.checkedKeys = {
    checked: this.view.checked && this.view.checked.map(item => item.toString())
  };
},
        @action
afterClose: () => {
  this.view.resetProperty('roleResourceModalInfo');
},
        @action
onResourceCheck: checkedKeys => {
  this.view.roleResourceModalInfo = {
    ...this.view.roleResourceModalInfo,
    disabled: false,
    checkedKeys
  };
}
    };

@action
handleTabRowChange = (selectedRowKeys, selectedRows) => {
  this.view.selectedRowKeys = selectedRowKeys;
};

@computed
get deleteDisabled() {
  return this.view.selectedRowKeys.length === 0;
}
}