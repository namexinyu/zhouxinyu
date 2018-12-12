import { observable, action, toJS } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message } from 'antd';
import { getWdAthuUser, AddWdAthuUser, EditWdAthuUser, getWdAthuEmployeeList, getWdAthuJobAllList } from 'ADMIN_SERVICE/WDGP_Authority';

export class View extends BaseView {
  @observable searchValue = {
    EmployeeID: '',
    EnName: '',
    Name: '',
    IsValid: 0
  };
  @observable leaveNum = 0;
  @observable onJobNum = 0;
  @observable totalNum = 0;
  @observable billList = [];
  @observable total = 0;
  @observable paging = {
    RecordIndex: 1,
    RecordSize: 10
  };
  @observable cityModelValue = {
    EmployeeID: '',
    EnName: '',
    IsValid: 1,
    PlatType: 1,
    RealName: '',
    WorkNum: '',
    RoleID: [],
    JobTitleListRoleID: [],
    JobTitleList: [],
    JobTitleListJodId: []
  }
  @observable cityModelName = {
    addModel: false,
    addModelName: "新增员工信息",
    EmployeeID: ''
  };
  @observable getBillListStatus = false;
  @observable employeeList = [];
  @observable jobList = [];

  // 排序
  order = {
    WorkNumOrder: 1,
    EnNameOrder: 1,
    CreateTimeOrder: 1,
    LastModifytimeOrder: 1
  }
}

export default class extends BaseViewStore {
  saveJiguan = (obj) => {
    let value = obj;
    this.view.searchValue.EnName = value.text;
  }

  saveEmployeeName = (obj) => {
    let value = obj;
    this.view.searchValue.Name = value.text;
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
    let searchValue = { ...{}, ...view.searchValue };
    for (let name in this.view.order) {
      if (this.view.order[name] !== 0) {
        searchValue = { ...searchValue, [name]: this.view.order[name] };
      }
    }
    for (let key in searchValue) {
      if (key === 'EmployeeID') {
        searchValue[key] === '' ? delete searchValue[key] : (searchValue[key] = Number(searchValue[key]));
      }
      searchValue[key] === '' && delete searchValue[key];
    }
    let query = { ...{}, ...this.view.order, PlatType: 1, ...searchValue, ...(toJS(view.paging)) };

    view.billList = [];
    query.RecordIndex = (query.RecordIndex - 1) * query.RecordSize;
    view.getBillListStatus = true;
    try {
      let res = await getWdAthuUser({ ...query });
      view.getBillListStatus = false;
      view.billList = res.Data.EmployeeList || [];
      view.total = res.Data.RecordCount;
      view.leaveNum = res.Data.CountList.LeaveNum;
      view.onJobNum = res.Data.CountList.OnJobNum;
      view.totalNum = res.Data.CountList.Total;
      return res.Data;
    } catch (error) {
      view.leaveNum = 0;
      view.onJobNum = 0;
      view.totalNum = 0;
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
  handleAddValuesChange = (values) => {
    this.view.cityModelValue = values;
  }

  @action
  handleFormReset = () => {


    this.view.resetProperty('searchValue');
    this.view.searchValue = {
      EmployeeID: '',
      EnName: '',
      Name: '',
      IsValid: 0
    };
  };

  @action
  savePage = (values) => {
    this.view.paging = {
      RecordIndex: values.page,
      RecordSize: values.pageSize
    };
  }

  @action
  showAddModel = () => {
    this.getJobAllList();
    this.view.cityModelName = {
      addModel: true,
      addModelName: "新增员工信息",
      EmployeeID: ''
    };
  }

  @action
  hiddenAddModel = () => {
    this.view.cityModelName = {
      addModel: false,
      addModelName: "新增员工信息"
    };
    this.view.cityModelValue = {
      EmployeeID: '',
      EnName: '',
      IsValid: 1,
      PlatType: 1,
      RealName: '',
      WorkNum: '',
      JobTitleList: []
    };
  }

  @action
  editAddModeValue = (record) => {
    this.getJobAllList();
    this.view.cityModelName = {
      addModel: true,
      addModelName: "编辑员工信息"
    };
    this.view.cityModelValue = {
      EmployeeID: record.EmployeeID,
      EnName: record.EnName,
      IsValid: record.IsValid,
      PlatType: 1,
      RealName: record.Name,
      WorkNum: record.WorkNum,
      RoleID: record.JobTitles && record.JobTitles.map(item => String(item.RoleID)),
      JobTitleList: record.JobTitles && record.JobTitles.map(item => String(item.JobTitleID))
    };
  };

  handleOnchangeTitleList = (e, item) => {
    this.view.cityModelValue = {
      ...this.view.cityModelValue,
      JobTitleListJodId: item && item.map(item => item.props.item),
      JobTitleList: e,
      RoleID: this.view.jobList.filter(item => e && e.some(id => id === item.JobTitleID)).map((item, index) => item.RoleID)
    };
  }

  @action
  saveAddModeValue = async (param, callback) => {
    let view = this.view;
    if (view.cityModelName.EmployeeID === '') {
      try {
        view.cityModelValue = {
          ...view.cityModelValue,
          ...param,
          JobTitleListJodId: view.cityModelValue.JobTitleListJodId,
          JobTitleList: toJS(view.cityModelValue.JobTitleList),
          RoleID: toJS(view.cityModelValue.RoleID)
        };
        const params = {
          ...view.cityModelValue,
          ...param,
          JobTitleList: view.cityModelValue.JobTitleListJodId
        };
        let res = await AddWdAthuUser(params);
        this.getBillList();
        this.getEmployeeList();
        this.hiddenAddModel();
        callback;
      } catch (error) {
        view.getBillListStatus = false;
        message.error(error.message);
      }
    } else {
      const items = {
        ...view.cityModelValue,
        ...param,
        JobTitleID: toJS(view.cityModelValue.JobTitleList),
        RoleID: toJS(view.cityModelValue.RoleID)
      };
      view.cityModelValue = {
        ...items
      };
      try {
        let res = await EditWdAthuUser(items);
        this.getBillList();
        this.hiddenAddModel();
        this.getEmployeeList();
        callback;
      } catch (error) {
        view.getBillListStatus = false;
        message.error(error.message);
      }
    }
  }

  // 获取员工列表
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

  // 获取岗位列表
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
}