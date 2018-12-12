import React from 'react';
import 'LESS/pages/workBench.less';
import BusScheduleForm from "./BusScheduleForm";
import BusScheduleModal from "./BusScheduleModal";
import {Modal, Button, Table, message } from 'antd';
import getBusScheduleList from 'ACTION/ExpCenter/ShuttleBus/getBusScheduleList';
import MAMSCommonAction from 'ACTION/Common/MAMSCommonAction';
import BusSchedule from 'SERVICE/ExpCenter/BusSchedule';
import ShuttleBus from 'SERVICE/ExpCenter/ShuttleBus';
import setParams from "ACTION/setParams";
const STATE_NAME = "reducersBusSchedule";
export default class TestPage extends React.PureComponent {
    constructor(props) {
        super(props);  
        this.state = {
            item: {}
        };
    }
    columns = [
        {
            title: '始发地',
            dataIndex: 'OriginName',
            className: "listpadding",
            render: (value, record, index) => {
                const obj = {
                  children: value,
                  props: {}
                };
                if (index == 0) {
                    let size = 0;
                    let indexs = 0;
                    this.props.list.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.BusRouteID === item.BusRouteID && record.DestID == item.DestID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size;
                } else if (index > 0 && record.BusRouteID === this.props.list.RecordList[index - 1].BusRouteID) {
                  obj.props.rowSpan = 0;
                }else {
                    let size = 0;
                    let indexs = 0;
                    this.props.list.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.BusRouteID === item.BusRouteID && record.DestID == item.DestID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size; 
                }
                return obj;
            }
        },
        {
            title: '目的地',
            dataIndex: 'DestName',
            className: "listpadding",
            render: (value, record, index) => {
                const obj = {
                  children: value,
                  props: {}
                };
                if (index == 0) {
                    let size = 0;
                    let indexs = 0;
                    this.props.list.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.BusRouteID === item.BusRouteID && record.DestID == item.DestID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size;
                } else if (index > 0 && record.BusRouteID === this.props.list.RecordList[index - 1].BusRouteID) {
                  obj.props.rowSpan = 0;
                }else {
                    let size = 0;
                    let indexs = 0;
                    this.props.list.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.BusRouteID === item.BusRouteID && record.DestID == item.DestID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size; 
                }
                return obj;
            }
        },
        {
            title: '公里数(千米)',
            dataIndex: 'Distance',
            className: "listpadding",
            render: (value, record, index) => {
                const obj = {
                  children: value == 0 ? "" : (value).FormatMoney({fixed: 2}),
                  props: {}
                };
                if (index == 0) {
                    let size = 0;
                    let indexs = 0;
                    this.props.list.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.BusRouteID === item.BusRouteID && record.DestID == item.DestID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size;
                } else if (index > 0 && record.BusRouteID === this.props.list.RecordList[index - 1].BusRouteID) {
                  obj.props.rowSpan = 0;
                }else {
                    let size = 0;
                    let indexs = 0;
                    this.props.list.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.BusRouteID === item.BusRouteID && record.DestID == item.DestID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size; 
                }
                return obj;
            }
        },
        {
            title: '发车时间',
            dataIndex: 'ScheduleTime',
            className: "listpadding"
        },
        {
            title: '操作人',
            dataIndex: 'EmployeeName',
            className: "listpadding"
        },
        {
            title: '提交时间',
            dataIndex: 'ModifyTime',
            className: "listpadding"
        },
        {
            title: '备注',
            dataIndex: 'Remark',
            className: "listpadding"
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (value, record, index) => {
                const obj = {
                  children: <span><a onClick={this.DelBusType.bind(this, record.BusRouteID, record.OriginName, record.DestName)}>删除</a><a> | </a><a onClick={this.displayModal.bind(this, 0, record)}>编辑</a></span>,
                  props: {}
                }; 
                if (index == 0) {
                    let size = 0;
                    let indexs = 0;
                    this.props.list.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.BusRouteID === item.BusRouteID && record.DestID == item.DestID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size;
                } else if (index > 0 && record.BusRouteID === this.props.list.RecordList[index - 1].BusRouteID) {
                  obj.props.rowSpan = 0;
                }else {
                    let size = 0;
                    let indexs = 0;
                    this.props.list.RecordList.map((item, index) => {
                        if (index - indexs > 1) {
                        } else {
                            if (record.BusRouteID === item.BusRouteID && record.DestID == item.DestID) {
                                size += 1;
                            }
                            indexs = index;
                        }
                    });
                    obj.props.rowSpan = size; 
                }
                return obj;
            }
        }
    ];
    // 分页
    onChange = (page, pageSize) => {
        setParams(STATE_NAME, {
            pageParam: {
                ...this.props.list.pageParam,
                RecordIndex: page,
                RecordSize: pageSize
            }
        });
        let param = {};
        if (this.props.list.queryParams.OriginID.value && this.props.list.queryParams.OriginID.value.trim() !== "") {
            param.OriginID = this.props.list.queryParams.OriginID.value * 1;
        }
        if (this.props.list.queryParams.DestID.value && this.props.list.queryParams.DestID.value.trim() !== "") {
            param.DestID = this.props.list.queryParams.DestID.value * 1;
        }
        param.RecordIndex = (page - 1) * pageSize;
        param.RecordSize = pageSize;
        getBusScheduleList(param); 
    };
    // 编辑
    displayModal = (ModalType, record) => {
        let size = [];
        let BusScheduleIDList = [];
        let indexs = 0;
        let {BusRouteID, BusScheduleID, DestID, DestName, Distance, EmployeeName, OriginID, OriginName, Remark} = record;
        let item = {BusRouteID, BusScheduleID, DestID, DestName, Distance, EmployeeName, OriginID, OriginName, Remark};
        this.props.list.RecordList.map((item, index) => {
            if (index - indexs > 1) {
               
            } else {
                if (record.OriginID === item.OriginID && record.DestID === item.DestID) {
                    size.push(item.ScheduleTime);
                    BusScheduleIDList.push(item.BusScheduleID);
                }
                indexs = index;
            }
        });
        if (size == "") {
            size = [];
        }
        item.ScheduleTime = size;
        this.setState({item});
        setParams(STATE_NAME, {
            queryParams: {
                ...this.props.list.queryParams,
                ScheduleTimeList: size,
                BusScheduleIDList: BusScheduleIDList
            },
            displayModal: true,
            ModalType: ModalType
        });
    }
    // 删除
    DelBusType = (BusRouteID, OriginName, DestName) => {
        ShuttleBus.getBusCheck({BusRouteID}).then((data) => {
            Modal.confirm({
                title: '提示',
                content: `是否删除${OriginName}—>${DestName}？`,
                iconType: 'info-circle',
                onOk: () => {
                    BusSchedule.getDelBusSchedule({BusRouteIDs: [{RouteID: BusRouteID}]}).then((data) => {
                        if (data.Code == 0) {
                            message.success("删除成功");
                            this.check();
                        } else {
                            message.error(data.Desc);
                        }
                    })
                    .catch((data) => {
                        message.error(data.Desc);
                    });
                }
            });
        }).catch((data) => {
            Modal.warning({
                title: '提示',
                content: '当前班次处于合作状态'
            });
        });
    }
    // 分页
    check = () => {
        let param = {};
        if (this.props.list.queryParams.OriginID.value && this.props.list.queryParams.OriginID.value.trim() !== "") {
            param.OriginID = this.props.list.queryParams.OriginID.value * 1;
        }
        if (this.props.list.queryParams.DestID.value && this.props.list.queryParams.DestID.value.trim() !== "") {
            param.DestID = this.props.list.queryParams.DestID.value * 1;
        }
        param.RecordIndex = (this.props.list.pageParam.RecordIndex - 1) * this.props.list.pageParam.RecordSize;
        param.RecordSize = this.props.list.pageParam.RecordSize;
        getBusScheduleList(param); 
    }
    componentDidMount() {
        MAMSCommonAction.GetHubList();
        this.check();
    }
    render() {
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">班次管理</div>
                </div>
                <div style={{background: "#fff", padding: "20px 20px", margin: "0 20px"}}>
                    <BusScheduleForm check={this.check} HubSimpleList={this.props.HubSimpleList} list={this.props.list} />
                    <div style={{marginBottom: "10px"}}>
                        <Button onClick={this.displayModal.bind(this, 1)}>新增班次</Button>
                    </div>
                    <Table
                        bordered
                        rowKey={(text, record, index) => index}
                        columns={this.columns}
                        dataSource={this.props.list.RecordList}
                        pagination = {{
                            showQuickJumper: true,
                            showSizeChanger: true,
                            current: this.props.list.pageParam.RecordIndex,
                            pageSize: this.props.list.pageParam.RecordSize,
                            total: this.props.list.RecordCount,
                            pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
                            showTotal: (total, range) => {
                                return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                            },
                            onChange: (page, pageSize) => this.onChange(page, pageSize),
                            onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize)}}/>
                        <BusScheduleModal check={this.check} record={this.state.item} HubSimpleList={this.props.HubSimpleList} list={this.props.list} />
                </div>
            </div>
        );
    }
}