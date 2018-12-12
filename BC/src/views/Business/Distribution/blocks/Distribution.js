import {
    Table
} from 'antd';
import React from 'react';
import setParams from "ACTION/setParams";
import DistributionForm from "./DistributionForm";
import Store from 'ACTION/Business/Store/index';
import CommonAction from 'ACTION/Business/Common';
import ResettlementScheme from "ACTION/Business/ResettlementScheme/index";
import moment from 'moment';
const STATE_NAME = "Distribution";
const {
    getLaborSimpleList,
    getRecruitSimpleList
} = CommonAction;
export default class Distribution extends React.PureComponent {
    constructor(props) {      
        super(props);
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
        let { RecruitTmpID, LaborID, RecruitDate, HubID, AllotType} = this.props.Distribution.queryParams;
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
        if (HubID.value) {
            params.HubID = HubID.value * 1;
        }
        if (AllotType.value) {
            params.AllotType = AllotType.value * 1;
        }
        params.RecordIndex = (page - 1) * pageSize || 0 ;
        params.RecordSize = pageSize || 10;
        ResettlementScheme.GetAllotStatisticsList(params);
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
                this.props.Distribution.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size;
            } else if (index > 0 && record.RecruitTmpID === this.props.Distribution.RecordList[index - 1].RecruitTmpID) {
              obj.props.rowSpan = 0;
            }else {
                let size = 0;
                let indexs = 0;
                this.props.Distribution.RecordList.map((item, index) => {
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
                this.props.Distribution.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size;
            } else if (index > 0 && record.RecruitTmpID === this.props.Distribution.RecordList[index - 1].RecruitTmpID) {
              obj.props.rowSpan = 0;
            }else {
                let size = 0;
                let indexs = 0;
                this.props.Distribution.RecordList.map((item, index) => {
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
                this.props.Distribution.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size;
            } else if (index > 0 && record.RecruitTmpID === this.props.Distribution.RecordList[index - 1].RecruitTmpID) {
              obj.props.rowSpan = 0;
            }else {
                let size = 0;
                let indexs = 0;
                this.props.Distribution.RecordList.map((item, index) => {
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
        title: '当前分配人数',
        dataIndex: 'HadAllotNumber',
        render: (value, record, index) => {
            const obj = {
              children: value,
              props: {}
            };
            if (index == 0) {
                let size = 0;
                let indexs = 0;
                this.props.Distribution.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size;
            } else if (index > 0 && record.RecruitTmpID === this.props.Distribution.RecordList[index - 1].RecruitTmpID) {
              obj.props.rowSpan = 0;
            }else {
                let size = 0;
                let indexs = 0;
                this.props.Distribution.RecordList.map((item, index) => {
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
        title: '放弃人数',
        dataIndex: 'DropNumber',
        render: (value, record, index) => {
            const obj = {
              children: value,
              props: {}
            };
            if (index == 0) {
                let size = 0;
                let indexs = 0;
                this.props.Distribution.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size;
            } else if (index > 0 && record.RecruitTmpID === this.props.Distribution.RecordList[index - 1].RecruitTmpID) {
              obj.props.rowSpan = 0;
            }else {
                let size = 0;
                let indexs = 0;
                this.props.Distribution.RecordList.map((item, index) => {
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
        title: "未分配人数",
        className: "UnallocatedInstrument",
        children: [{
            title: "合计",
            className: "UnallocatedInstrument",
            dataIndex: 'NoAllotTotalNumber',
            key: 'WaitSettlementNumber',
            render: (value, record, index) => {
                const obj = {
                  children: value,
                  props: {}
                };
                if (index == 0) {
                    let size = 0;
                    let indexs = 0;
                    this.props.Distribution.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size;
                } else if (index > 0 && record.RecruitTmpID === this.props.Distribution.RecordList[index - 1].RecruitTmpID) {
                  obj.props.rowSpan = 0;
                }else {
                    let size = 0;
                    let indexs = 0;
                    this.props.Distribution.RecordList.map((item, index) => {
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
            title: "男",
            className: "UnallocatedInstrument",
            dataIndex: 'NoAllotMenNumber',
            key: 'NoAllotMenNumber',
            render: (value, record, index) => {
                const obj = {
                  children: value,
                  props: {}
                };
                if (index == 0) {
                    let size = 0;
                    let indexs = 0;
                    this.props.Distribution.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size;
                } else if (index > 0 && record.RecruitTmpID === this.props.Distribution.RecordList[index - 1].RecruitTmpID) {
                  obj.props.rowSpan = 0;
                }else {
                    let size = 0;
                    let indexs = 0;
                    this.props.Distribution.RecordList.map((item, index) => {
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
            title: "女",
            className: "UnallocatedInstrument",
            dataIndex: 'NoAllotWomenNumber',
            key: 'NoAllotWomenNumber',
            render: (value, record, index) => {
                // 此代码可以写一个函数
                const obj = {
                  children: value,
                  props: {}
                };
                if (index == 0) {
                    let size = 0;
                    let indexs = 0;
                    this.props.Distribution.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.RecruitTmpID === item.RecruitTmpID && record.HubID == item.HubID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size;
                } else if (index > 0 && record.RecruitTmpID === this.props.Distribution.RecordList[index - 1].RecruitTmpID) {
                  obj.props.rowSpan = 0;
                }else {
                    let size = 0;
                    let indexs = 0;
                    this.props.Distribution.RecordList.map((item, index) => {
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
        }]
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
        render: (text, record, value) => {
            return <span>{record.AllotType == 1 ? text : text + "%"}</span>;
        }
      }, {
        title: "当前分配比例",
        dataIndex: 'CurAllotPer'
      }, {
        title: "已分配人数",
        dataIndex: 'CurAllotNumber'
      }];
    render() {
        let {RecordCount, RecordSize, RecordIndex} = this.props.Distribution;
        return (
            <div className="recruitment-info-view">
                
                <div className="ivy-page-title" style={{position: 'relative'}}>
                    <h1>分配报表</h1> 
                </div>
                <div style={{background: "#fff", margin: "20px", padding: "20px"}} className='assistance-page-view'>
                    <DistributionForm 
                        StoreList={this.props.StoreList.StoreList}
                        SettlementForm={this.props.Distribution}
                        common={this.props.common}
                        queryParams={this.props.Distribution.queryParams}
                        />
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
                        dataSource={this.props.Distribution.RecordList} />
                </div>
            </div>
            
        );
    }
}
