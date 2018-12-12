import {
    Form,
    Button,
    message,
    Table,
    Modal
} from 'antd';
import React from 'react';
import setParams from "ACTION/setParams";
import BusinessAffairsForm from "./BusinessAffairsForm";
import moment from 'moment';
import CommonAction from 'ACTION/Business/Common';
import Store from 'ACTION/Business/Store/index';
import ResettlementScheme from "ACTION/Business/ResettlementScheme/index";
import BusinessAffairsitem from 'SERVICE/Business/ResettlementScheme/index';
import BusinessAffairsModal from "./BusinessAffairsModal";
const {
    getLaborSimpleList,
    getRecruitSimpleList
} = CommonAction;
const STATE_NAME = "BusinessAffairs";
export default class BusinessAffairs extends React.PureComponent {
    constructor(props) {      
        super(props);
        this.state = {
            modalVisible: false,
            SubsidyList: [],
            type: 0,
            RecruitDate: "",
            RecruitTmpID: "",
            RemainNumber: 0,
            HubID: 0
        };
    }
    componentDidMount() {
        getLaborSimpleList(); 
        getRecruitSimpleList(); 
        Store.GetHubList();
        this.onChange();
    }
    onChange = (page, pageSize) => {
        setParams(STATE_NAME, {
            RecordSize: pageSize || 10,
            RecordIndex: page || 0
        });
        let { RecruitTmpID, LaborID, RecruitDate, AllotType} = this.props.BusinessAffairs.queryParams;
        let params = {};
        if (RecruitTmpID.value) {
            params.RecruitTmpID = RecruitTmpID.value * 1;
        }
        if (LaborID.value) {
            params.LaborID = LaborID.value * 1;
        }
        if (RecruitDate.value) {
            params.RecruitDate = RecruitDate.value.format("YYYY-MM-DD");
        }
        if (AllotType.value) {
            params.AllotType = AllotType.value * 1;
        }
        params.RecordIndex = (page - 1) * pageSize || 0 ;
        params.RecordSize = pageSize || 10;
        ResettlementScheme.GetAllotList(params);
    }
    columns = [{
        title: '生效日期',
        dataIndex: 'RecruitDate',
        render: (value, record, index) => {
            const obj = {
              children: value,
              props: {}
            };
            if (index == 0) {
                let size = 0;
                let indexs = 0;
                this.props.BusinessAffairs.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size;
            } else if (index > 0 && record.RecruitTmpID === this.props.BusinessAffairs.RecordList[index - 1].RecruitTmpID) {
              obj.props.rowSpan = 0;
            }else {
                let size = 0;
                let indexs = 0;
                this.props.BusinessAffairs.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size; 
            }
            return obj;
        }
      }, {
        title: '集散/门店',
        dataIndex: 'HubName',
        render: (value, record, index) => {
            const obj = {
              children: value,
              props: {}
            };
            if (index == 0) {
                let size = 0;
                let indexs = 0;
                this.props.BusinessAffairs.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size;
            } else if (index > 0 && record.RecruitTmpID === this.props.BusinessAffairs.RecordList[index - 1].RecruitTmpID) {
              obj.props.rowSpan = 0;
            }else {
                let size = 0;
                let indexs = 0;
                this.props.BusinessAffairs.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size; 
            }
            return obj;
        }
      }, {
        title: '企业简称',
        dataIndex: 'RecruitTmpName',
        render: (value, record, index) => {
            const obj = {
              children: value,
              props: {}
            };
            if (index == 0) {
                let size = 0;
                let indexs = 0;
                this.props.BusinessAffairs.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size;
            } else if (index > 0 && record.RecruitTmpID === this.props.BusinessAffairs.RecordList[index - 1].RecruitTmpID) {
              obj.props.rowSpan = 0;
            }else {
                let size = 0;
                let indexs = 0;
                this.props.BusinessAffairs.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size; 
            }
            return obj;
        }
      }, {
        title: '分配方式',
        dataIndex: 'AllotType',
        render: (text, record, value) => {return <span>{text == 1 ? "按名额" : "按比例"}</span>;}
      }, {
        title: '劳务公司',
        dataIndex: 'LaborName'
      }, {
        title: '劳务报价',
        dataIndex: 'LaborSubsidyList',
        render: (text, record, value) => {
            return (record.LaborSubsidyList || []).map((item) => {
                return <p>{`${item.Gender == 1 ? "男" : item.Gender == 2 ? "女" : "男女不限"}:${item.SubsidyDay || ""}天返${item.SubsidyAmount || ""}元`}</p>;
            });
        }
      }, {
        title: "预设分配比例/名额",
        dataIndex: 'NumberOrPer',
        render: (value, record, index) => {
            return <span>{record.AllotType == 1 ? value : value + "%"}</span>;
        }
      }, {
        title: "  操作",
        dataIndex: 'AllOkInFromLabor',
        render: (value, record, index) => {
            const obj = {
              children: <span>
              <a onClick={() => this.NewlyAdded(2, record)}>编辑 </a>
              <a onClick={() => this.ToVoid(record)}>| 作废</a>
          </span>,
              props: {}
            };
            if (index == 0) {
                let size = 0;
                let indexs = 0;
                this.props.BusinessAffairs.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size;
            } else if (index > 0 && record.RecruitTmpID === this.props.BusinessAffairs.RecordList[index - 1].RecruitTmpID) {
              obj.props.rowSpan = 0;
            }else {
                let size = 0;
                let indexs = 0;
                this.props.BusinessAffairs.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size; 
            }
            return obj;
        }
      }];
    ToVoid = (record) => {
        Modal.confirm({
            title: '提示',
            content: '确认作废该分配方案？',
            onOk() {
                BusinessAffairsitem.DeleteHubRecAllot({
                    HubID: record.HubID,
                    RecruitDate: record.RecruitDate,
                    RecruitTmpID: record.RecruitTmpID
                }).then((data) => {
                    if (data.Code == 0) { 
                        message.success("已作废该企业配置");
                        this.onChange();
                     }
                }).catch((err) => {
                    message.error(err.Desc);
                });
            },
            onCancel() {
            }
        });
    }
    NewlyAdded = (type, record) => {
        if (type == 1) {
            this.setState({
                modalVisible: true,
                type,
                RemainNumber: -1
            });
        } else {
            BusinessAffairsitem.GetHubRecAllot({
                HubID: record.HubID,
                RecruitDate: record.RecruitDate,
                RecruitTmpID: record.RecruitTmpID
            }).then((Data) => {
                setParams(STATE_NAME, {
                    SubsidyList: Data.Data.RecordList
                });
                this.setState({
                    RemainNumber: Data.Data.RemainNumber,
                    HubID: record.HubID,
                    RecruitDate: record.RecruitDate,
                    RecruitTmpID: record.RecruitTmpID,
                    modalVisible: true,
                    type
                });
            }).catch((err) => {
                message.error(err.Desc);
            });
        }
    }
    ThroughFormValuesChange = (value, type, index) => {
        let SubsidyList = this.props.BusinessAffairs.SubsidyList;
        if (type == "NumberOrPer") {
            SubsidyList[index].NumberOrPer = value.target.value * 1;
            setParams(STATE_NAME, {
                SubsidyList: SubsidyList
            });
        }
        if (type == "LaborID") {
            SubsidyList[index].LaborID = value;
            setParams(STATE_NAME, {
                SubsidyList: SubsidyList
            });
        }
    }
    add = (item) => {
        this.setState({
            ...item
        });
    }
    gitmodalVisible = () => {
        this.setState({
            modalVisible: false,
            type: 0,
            RecruitDate: "",
            RecruitTmpID: "",
            RemainNumber: 0,
            HubID: 0
        });
        setParams(STATE_NAME, {
            SubsidyList: []
        });
    }
    render() {
        
        let {RecordCount, RecordSize, RecordIndex, SubsidyList} = this.props.BusinessAffairs;
        return (
            <div className="recruitment-info-view">
                <div className="ivy-page-title" style={{position: 'relative'}}>
                    <h1>运维分配</h1> 
                </div>
                <div style={{background: "#fff", margin: "20px", padding: "20px"}} className='assistance-page-view'>
                    <BusinessAffairsForm 
                        StoreList={this.props.StoreList.StoreList}
                        SettlementForm={this.props.BusinessAffairs}
                        common={this.props.common}
                        queryParams={this.props.BusinessAffairs.queryParams}
                        />
                    <Button style={{marginBottom: "20px"}} onClick={() => this.NewlyAdded(1)}>新增</Button>
                    <Table
                        pagination={{
                            total: RecordCount,
                            defaultPageSize: RecordSize,
                            defaultCurrent: RecordIndex,
                            current: RecordIndex,
                            pageSize: RecordSize,
                            pageSizeOptions: ['10', '50', '100', "200"],
                            onChange: (page, pageSize) => this.onChange(page, pageSize),
                            onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize),
                            showTotal: (total, range) => {
                              return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                            },
                            showSizeChanger: true,
                            showQuickJumper: true
                          }}
                        bordered
                        rowKey="SPBossID"
                        columns={this.columns}
                        dataSource={this.props.BusinessAffairs.RecordList || [{
                            RecruitDate: "1",
                            AllotType: 2,
                            LaborName: "zhangshan"
                        }]} />
                </div>
                <BusinessAffairsModal
                    onChange={this.onChange}
                    type={this.state.type} 
                    StoreList={this.props.StoreList}
                    common={this.props.common}
                    add={this.add}
                    ThroughFormValuesChange={this.ThroughFormValuesChange}
                    SubsidyList={SubsidyList}
                    RecruitDate={this.state.RecruitDate}
                    RecruitTmpID={this.state.RecruitTmpID}
                    HubID={this.state.HubID}
                    RemainNumber={this.state.RemainNumber}
                    modalVisible={this.state.modalVisible}
                    gitmodalVisible={this.gitmodalVisible}/>
            </div>
        );
    }
}

