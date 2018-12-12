import { observable, action, toJS, isObservable, observe } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message, Modal } from "antd";
import { updateResources } from 'ADMIN_SERVICE/ZXX_Authority';
import { getWdAuthMenuResources, addWdAuthMenu, editWdAuthMenu, deleteWdAuthMenu } from 'ADMIN_SERVICE/WDGP_Authority';

const confirm = Modal.confirm;

export class View extends BaseView {
  @observable ResourceData = {};
  @observable hasChange = false;
  @observable ResourceModal = {};
  @observable loadResourceLoading = false;
  @observable PlatType: 1;
}

export default class extends BaseViewStore {

  @action.bound
  async getResourceList () {
    let view = this.view;
    view.loadResourceLoading = true;
    try {
      let res = await getWdAuthMenuResources({ PlatType: 1 });
      view.ResourceData = res.Data || {};
      view.hasChange = false;
      this.mapResource(view.ResourceData);
    } catch (error) {
      view.ResourceData = {};
      message.error(error.message);
    }
    view.loadResourceLoading = false;
  };

  @action
  handleResourceDrop = ({ node, dragNode, dragNodesKeys, dropPosition: dropPositionn, dropToGap }) => {
    const dropKey = node.props.eventKey;
    const dragKey = dragNode.props.eventKey;
    const dropPos = node.props.pos.split('-');
    const dropPosition = dropPositionn - Number(dropPos[dropPos.length - 1]);

    const loop = (dataList, key, callback, data) => {
      dataList.forEach((item, index, arr) => {
        if (item.MenuID.toString() === key) {
          return callback(item, index, arr, data);
        }
        if (item.SubResources) {
          return loop(item.SubResources, key, callback, item);
        }
      });
    };
    const dataList = toJS(this.view.ResourceData).Resources || [];
    let dragObj;
    // todo 不能直接删
    loop(dataList, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    let flag;
    if (dropToGap) { // dragNode在dropNode之后
      let ar;
      let i;
      let d;
      loop(dataList, dropKey, (item, index, arr, data) => {
        ar = arr;
        i = index;
        d = data;
      });
      let error = this.validate(dragObj, d);
      if (!error) {
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
        flag = true;
      } else {
        message.error(error);
      }
    } else { // dragNode成为dropNode的子node
      loop(dataList, dropKey, (item) => {
        let error = this.validate(dragObj, item);
        if (!error) {
          if (!item.SubResources) item.SubResources = [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.SubResources.push(dragObj);
          flag = true;
        } else {
          message.error(error);
        }
      });
    }
    if (flag) {
      this.view.hasChange = true;
      this.view.ResourceData.Resources = dataList;
    }
  };

  validate = (dragObj, parent) => {
    if (parent && parent.attrType === 1) {
      return `${parent.MenuName}不能作为父节点`;
    }
    if (parent && parent.attrType === 3 && dragObj.attrType !== 1) {
      return `${parent.MenuName}的子节点只能是功能节点`;
    }
  };

  getResID = (Resources) => Resources.map(item => {
    let result = { MenuID: item.MenuID };
    if (item.SubResources) {
      result.SubResources = this.getResID(item.SubResources);
    }
    return result;
  });

  @action
  handleResourceChangeCommit = async () => {
    this.view.loadResourceLoading = true;
    let Resources = this.view.ResourceData.Resources[0];
    try {
      await updateResources(Resources);
    } catch (e) {
      message.error(e.message);
      this.view.loadResourceLoading = false;
    }
    this.getResourceList();
  };

  mapResource (data) {
    let list = (data.SubResources || data.Resources);
    if (list && list.length) {
      for (let item of list) {
        if (data.attrType !== 4) {
          if (item.Type === 2) {
            if (data.attrType === 2) {
              data.attrType = 4;
            } else {
              data.attrType = 3;
            }
          }
          if (item.Type === 1) {
            if (data.attrType === 3) {
              data.attrType = 4;
            } else {
              data.attrType = 2;
            }
          }
        }
        this.mapResource(item);
      }
      if (!data.attrType) {
        data.attrType = 6;
      }
    } else if (data.Type === 2) {
      data.attrType = 1;
    } else {
      data.attrType = 5;
    }
  }

  // a = autorun(() => console.log('ResourceData', toJS(this.view.ResourceData)));

  // -------------------- ResourceModal --------------------

  @action.bound
  async handleResourceModalConfirm (fieldsValue) {
    let Type = this.view.ResourceModal.Type;
    const param = {
      IconUrl: fieldsValue.IconUrl || '',
      MenuName: fieldsValue.MenuName,
      NavUrl: fieldsValue.NavUrl || '',
      Remark: fieldsValue.Remark || '',
      BtnUid: fieldsValue.BtnUid,
      Type: Type || 1,
      PlatType: 1
    };

    if (Type === 2 && !param.BtnUid) return;

    try {
      if (this.view.ResourceModal.OperateType == 'add') { // 新增
        param.ParentNav = this.view.ResourceModal.parentResourceID;
        param.MenuID = this.view.ResourceModal.MenuID;
        await addWdAuthMenu(param);
      } else {
        param.MenuID = this.view.ResourceModal.MenuID;
        await editWdAuthMenu(param);
      }
      this.handleResourceModalCancel();
      this.handleResourceModalAfterClose();
    } catch (e) {
      message.error(e.message);
    }
    this.getResourceList();
  }

  @action.bound
  async handleResourceDelete (MenuID) {
    try {
      await deleteWdAuthMenu({ MenuID });
      message.success('删除成功');
    } catch (e) {
      message.error(e.message);
    }
    this.getResourceList();
  }

  @action.bound
  handleResourceModalCancel () {
    this.view.ResourceModal.Visible = false;
  }

  @action.bound
  handleResourceModalAfterClose () {
    this.view.ResourceModal = {};
  }

  @action.bound
  handleAddMenu () {
    this.view.ResourceModal = {
      Type: 1,
      Visible: true,
      OperateType: 'add',
      parentResourceName: '',
      parentResourceID: ''
    };
  }

  @action.bound
  handleResourceSave (pos, key) {
    this.view.ResourceModal.Type = 2;
    if (!pos || !pos.length) return;
    let Resource = pos.reduce((pre, cur, index, arr) => {
      let Resources = pre[index === 0 ? 'Resources' : 'SubResources'];
      console.log(Resources);
      pre = Resources[cur];
      return pre;
    }, this.view.ResourceData);
    switch (key) {
      case 'add':
      case 'add-fun':
      case 'delete':
        // let Resource = pos.reduce((pre, cur, index, arr) => {
        //     let Resources = pre[index === 0 ? 'Resources' : 'SubResources'];
        //     pre = Resources[cur];
        //     return pre;
        // }, this.view.ResourceData);
        if (isObservable(Resource)) {
          Resource = toJS(Resource);
        }

        if (Resource && Resource.MenuID) {
          if (key === 'delete') {
            this.view.ResourceModal.OperateType = 'delete';
            confirm({
              title: '确定删除?',
              okText: '删除',
              okType: 'danger',
              cancelText: '取消',
              onOk: () => this.handleResourceDelete(Resource.MenuID)
            });
          } else {
            this.view.ResourceModal = {
              Type: key === 'add-fun' ? 2 : 1,
              Visible: true,
              OperateType: 'add',
              parentResourceName: Resource.MenuName,
              parentResourceID: Resource.MenuID
            };
          }
        }
        break;
      case 'modify':
        let ResourceObj = pos.reduce((pre, cur, index, arr) => {
          let Resources = pre.Resource[index === 0 ? 'Resources' : 'SubResources'];
          pre.Resource = Resources[cur];
          if (index === arr.length - 2) pre.parentResourceName = pre.Resource.MenuName;
          return pre;
        }, { Resource: this.view.ResourceData });

        if (isObservable(ResourceObj.Resource)) {
          ResourceObj.Resource = toJS(ResourceObj.Resource);
        }
        if (ResourceObj.Resource) {
          this.view.ResourceModal = {
            Visible: true,
            OperateType: 'edit',
            parentResourceName: ResourceObj.parentResourceName,
            ...ResourceObj.Resource
          };
        }
        break;
    }
  }
}