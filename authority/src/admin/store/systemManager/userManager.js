import { observable, action, toJS, computed, isObservable } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message } from 'antd';
import { updateTree, delJobTitle, getJobTitleList, getWdAthuJobInfo, addWdAthuJobTitle, getWdAthuUserRoleJobRelation, getWdAthuRoleList, getWdAthuJobAllList, getWdAthuEmployeeList } from 'ADMIN_SERVICE/WDGP_Authority';

export class View extends BaseView {
  @observable searchValue = {
    JobTitleName: '',
    Status: 0
  };
  @observable JobTitleName = []
  @observable selectedRowKeys = [];
  @observable billList = [];
  @observable totalNum = 0;
  @observable unValidNum = 0;
  @observable ValidNum = 0;
  @observable total = 0;
  @observable Type = ''
  @observable paging = {
    RecordIndex: 1,
    RecordSize: 10
  };
  @observable cityModelValue = {
    EmployeeID: [],
    JobTitleID: '',
    JobTitleName: '',
    LeaderTitleName: '',
    LeaderTitleID: undefined,
    PlatType: 1,
    RoleID: undefined,
    Status: 1,
    parentResourceName: ''
  }
  @observable cityModelName = {
    UID: '',
    addModel: false,
    addModelName: "新建岗位"
  };
  @observable roleList = [];
  @observable jobList = [];
  @observable employeeList = [];
  @observable jobTitleList = [];
  @observable getBillListStatus = false;
  @observable CityMgmtID = null;
  @observable userJobList = [];
  @observable treeLoading = false;
  @observable hasChange = false;
  @observable fetchStatus = ''

  // 排序
  order = {
    JobTitleOrder: 1,
    RoleOrder: 0,
    CreateTimeOrder: 0,
    LastModifyTimeOrder: 0
  }
}

export default class extends BaseViewStore {

  saveJiguan = (obj) => {
    let value = obj;
    if (obj && obj.text) {
      this.view.searchValue.JobTitleName = value.text;
    } else {
      this.view.searchValue.JobTitleName = '';
    }
  }

  @action
  getBillList = async (fieldValues) => {
    if (!fieldValues) {
      this.view.paging = {
        RecordIndex: 1,
        RecordSize: 10
      };
    }

    let view = this.view;
    let searchValue = { ...{}, ...view.searchValue, JobTitleName: view.searchValue.JobTitleName };
    for (let name in this.view.order) {
      if (this.view.order[name] !== 0) {
        searchValue = { ...searchValue, [name]: this.view.order[name] };
      }
    }
    for (let key in searchValue) {
      searchValue[key] === '' && delete searchValue[key];
    }
    let query = { ...{}, PlatType: 1, ...searchValue, ...(toJS(view.paging)) };
    view.billList = [];
    query.RecordIndex = (query.RecordIndex - 1) * query.RecordSize;
    view.getBillListStatus = true;

    try {
      let res = await getWdAthuJobInfo({ ...query });
      view.getBillListStatus = false;
      view.billList = res.Data.JobTitleList || [];
      view.total = res.Data.RecordCount;
      view.totalNum = res.Data.CountList.TotalNum;
      view.unValidNum = res.Data.CountList.UnValidNum;
      view.ValidNum = res.Data.CountList.ValidNum;
    } catch (error) {
      view.totalNum = 0;
      view.unValidNum = 0;
      view.validNum = 0;
      view.getBillListStatus = false;
      message.error(error.message);
    }
  };

  // 排序
  @action
  orderSort = async (value, flag) => {
    this.view.order[value] = flag;
    for (let name in this.view.order) {
      if (name !== value) {
        this.view.order[name] = 0;
      }
    }
    this.getBillList();
  }

  @action
  handleFormValuesChange = (values) => {
    for (let key in values) {
      this.view.searchValue[key] = values[key];
    }
  };

  @action
  handleFormReset = () => {
    this.view.resetProperty('searchValue');
    this.view.searchValue = {
      JobTitleName: '',
      Status: 0
    };
  };

  @action
  savePage = (values) => {
    this.view.paging = {
      RecordIndex: values.page,
      RecordSize: values.pageSize
    };
  };

  @action
  showAddModel = (record) => {
    this.getRoleList();
    this.getJobAllList();
    this.getEmployeeList();
    this.view.cityModelName = {
      addModel: true,
      addModelName: "新建岗位"
    };
    this.view.cityModelValue = {
      EmployeeID: [],
      JobTitleID: '',
      JobTitleName: '',
      LeaderTitleID: record && record.JobTitleID ? record.JobTitleID : '',
      parentResourceName: record && record.JobTitleName ? record.JobTitleName : '',
      PlatType: 1,
      RoleID: undefined,
      Status: 1
    };
  };

  @action
  hiddenAddModel = () => {
    this.view.cityModelName = {
      addModel: false,
      addModelName: "新建岗位"
    };
    this.view.cityModelValue = {
      EmployeeID: [],
      JobTitleID: '',
      JobTitleName: '',
      LeaderTitleID: undefined,
      PlatType: 1,
      RoleID: undefined,
      Status: 1
    };
  };

  @action.bound
  handleResourceSave (pos, key) {
    this.view.Type = 2;
    if (!pos || !pos.length) return;
    const Resource = pos.reduce((pre, cur, index, arr) => {
      const Resources = pre[0];
      // console.log(Resources);
      this.view.cityModelValue = {
        EmployeeID: Resources.Employees && Resources.Employees.map(item => item.EmployeeID),
        LeaderTitleID: Resources.JobTitleID ? Resources.JobTitleID : '',
        JobTitleName: Resources.JobTitleName,
        LeaderTitleName: Resources.LeaderTitleName,
        TabLeaderTitleID: Resources.LeaderTitleID,
        PlatType: 1,
        RoleID: Resources.RoleID,
        Status: Resources.Status,
        parentResourceName: Resources.JobTitleName
      };
      pre = Resources[cur];
      return pre;
    }, this.view.userJobList);
    this.getRoleList();
    this.getJobAllList();
    this.getEmployeeList();
    this.view.cityModelName = {
      addModel: true,
      addModelName: "编辑岗位"
    };
    switch (key) {
      case 'add':
      case 'add-fun':
      case 'delete':
        // let Resource = pos.reduce((pre, cur, index, arr) => {
        //     let Resources = pre[index === 0 ? 'Resources' : 'SubResources'];
        //     pre = Resources[cur];
        //     return pre;
        // }, this.view.ResourceData);
        // if (isObservable(Resource)) {
        //   Resource = toJS(Resource);
        // }

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
          console.log(pre);
          let Resources = pre[0];
          pre.Resource = Resources[cur];
          if (index === arr.length - 2) pre.parentResourceName = pre.JobTitleName;
          return pre;
        }, this.view.userJobList);

        if (isObservable(ResourceObj.Resource)) {
          ResourceObj.Resource = toJS(ResourceObj.Resource);
        }
        if (ResourceObj.Resource) {
          this.view.parentResourceName = ResourceObj.parentResourceName;
        }
        break;
    }
  }


  @action
  getUserRoleJobRelation = async () => {
    this.view.treeLoading = true;
    const view = this.view;
    try {
      let res = await getWdAthuUserRoleJobRelation({ PlatType: 1 });
      view.userJobList = res.Data.PositionTreeList || [];
      view.hasChange = false;
    } catch (e) {
      view.userJobList = [];
      message.error('获取岗位&角色&员工关系失败');
    }
    this.view.treeLoading = false;
  };
  // edit a job
  @action
  editAddModeValue = (record) => {
    console.log(record);
    this.getRoleList();
    this.getJobAllList();
    this.getEmployeeList();
    this.view.cityModelName = {
      addModel: true,
      addModelName: "编辑岗位"
    };

    this.view.cityModelValue = {
      EmployeeID: record.Employees && record.Employees.map(item => item.EmployeeID),
      LeaderTitleID: record.JobTitleID ? record.JobTitleID : '',
      JobTitleName: record.JobTitleName,
      LeaderTitleName: record.LeaderTitleName,
      TabLeaderTitleID: record.LeaderTitleID,
      PlatType: 1,
      RoleID: record.RoleID,
      Status: record.Status,
      parentResourceName: record.JobTitleName
    };
  };

  // save a job
  @action
  saveAddModeValue = async (param) => {
    let view = this.view;
    if (this.view.cityModelValue.JobTitleID === '') {
      try {
        let res = await addWdAthuJobTitle({ ...param, LeaderTitleID: view.cityModelValue.LeaderTitleID });
        if (res.Code === 0) {
          view.fetchStatus = 'success';
        }
        this.hiddenAddModel();
        // this.getJobTitleList();
        this.getUserRoleJobRelation();
      } catch (error) {
        view.fetchStatus = 'false';
        view.getBillListStatus = false;
        message.error(error.message);
      }
    } else {
      try {
        let res = await addWdAthuJobTitle({ ...param, JobTitleID: view.cityModelValue.LeaderTitleID });
        // this.getBillList();
        this.hiddenAddModel();
        // this.getJobTitleList();
        this.getUserRoleJobRelation();
      } catch (error) {
        view.getBillListStatus = false;
        message.error(error.message);
      }
    }
  };

  // get role list
  @action
  getRoleList = async () => {
    try {
      let res = await getWdAthuRoleList({ PlatType: 1 });
      this.view.roleList = res.Data.RoleList;
    } catch (e) {
      this.view.roleList = [];
      message.error('获取角色失败');
    }
  }

  // get job list
  @action
  getJobAllList = async () => {
    try {
      let res = await getWdAthuJobAllList({ PlatType: 1 });
      this.view.jobList = res.Data.JobTitleRoleList || [];
    } catch (e) {
      this.view.jobList = [];
      message.error('获取岗位列表失败');
    }

  }

  // 删除岗位
  @action.bound
  async handleDeleteRole (item) {
    try {
      await delJobTitle({ JobTitleID: [item.JobTitleID], PlatType: 1 });
      message.success('删除成功');
      this.getUserRoleJobRelation();
    } catch (e) {
      message.error(e.message);
    }
    this.getJobAllList();
  }

  // get employee List
  @action
  getEmployeeList = async () => {
    try {
      let res = await getWdAthuEmployeeList({ PlatType: 1 });
      this.view.employeeList = res.Data || [];
    } catch (e) {
      this.view.employeeList = [];
      message.error('获取员工列表失败');
    }
  };

  getJobTitleList = async () => {
    try {
      let res = await getJobTitleList({ PlatType: 1 });
      this.view.jobTitleList = res.Data.JobTitleRoleList || [];
    } catch (e) {
      this.view.jobTitleList = [];
      message.error('获取岗位列表失败');
    }
  }

  @action
  handleTabRowChange = (selectedRowKeys, selectedRows) => {
    this.view.selectedRowKeys = selectedRowKeys;
  };

  @action
  onDrop = ({ node, dragNode, dragNodesKeys, dropPosition: dropPositionn, dropToGap }) => {
    const dropKey = node.props.eventKey;
    const dragKey = dragNode.props.eventKey;
    const dropPos = node.props.pos.split('-');
    const dropPosition = dropPositionn - Number(dropPos[dropPos.length - 1]);

    const loop = (dataList, key, callback, data) => {
      dataList.forEach((item, index, arr) => {
        if (item.JobTitleID.toString() === key) {
          return callback(item, index, arr, data);
        }
        if (item.SubTitleUserList) {
          return loop(item.SubTitleUserList, key, callback, item);
        }
      });
    };
    const dataList = toJS(this.view.userJobList) || [];
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
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
      flag = true;
    } else { // dragNode成为dropNode的子node
      loop(dataList, dropKey, (item) => {
        // let error = this.validate(dragObj, item);
        if (!item.SubTitleUserList) item.SubTitleUserList = [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.SubTitleUserList.push(dragObj);
        flag = true;
      });
    }
    if (flag) {
      this.view.hasChange = true;
      this.view.userJobList = dataList;
    }
  };
  @action
  handleResourceChangeCommit = async () => {
    this.view.treeLoading = true;
    let Resources = this.view.userJobList[0];
    try {
      await updateTree(Resources);
    } catch (e) {
      message.error(e.message);
      this.view.treeLoading = false;
    }
    this.getUserRoleJobRelation();
  };

  @computed
  get deleteDisabled () {
    return this.view.selectedRowKeys.length === 0;
  }
}