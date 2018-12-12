import React from 'react';
import 'LESS/pages/workBench.less';
import BusTypeForm from "./BusTypeForm";
import BusTypeModal from "./BusTypeModal";
import { Button, Table, message, Modal } from 'antd';
import setParams from "ACTION/setParams";
import BusType from 'SERVICE/ExpCenter/BusType';
import getBusTypeList from 'ACTION/ExpCenter/ShuttleBus/getBusTypeList';
import ShuttleBus from 'SERVICE/ExpCenter/ShuttleBus';
const STATE_NAME = "reducersBusType";
export default class TestPage extends React.PureComponent {
    constructor(props) {
        super(props);  
        this.state = {};
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'IDCardNum',
            className: "listpadding",
            width: "80px",
            render: (text, record, index) => <span>{(index + 1) + this.props.list.pageParam.RecordSize * (this.props.list.pageParam.RecordIndex - 1)}</span>
            
        },
        {
            title: '车座数',
            dataIndex: 'SeatNum',
            className: "listpadding",
            width: "100px"
        },
        {
            title: '操作人',
            dataIndex: 'EmployeeName',
            className: "listpadding",
            width: "100px"
        },
        {
            title: '提交时间',
            dataIndex: 'CommitTime',
            className: "listpadding",
            width: "200px"
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => <span><a onClick={this.DelBusType.bind(this, record.BusTypeID, record.SeatNum)} >删除</a></span>
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
        if (this.props.list.queryParams.SeatNum.value && this.props.list.queryParams.SeatNum.value.trim() !== "") {
            param.SeatNum = this.props.list.queryParams.SeatNum.value * 1;
        }
        param.RecordIndex = (page - 1) * pageSize;
        param.RecordSize = pageSize;
        getBusTypeList(param);
    };
    // 显示模态框与保存ID
    displayModal = () => {
        setParams(STATE_NAME, {
            displayModal: true
        }); 
    }
    // 查询
    check = () => {
        let param = {};
        if (this.props.list.queryParams.SeatNum.value.trim() !== "") {
            param.SeatNum = this.props.list.queryParams.SeatNum.value * 1;
        }
        param.RecordIndex = (this.props.list.pageParam.RecordIndex - 1) * this.props.list.pageParam.RecordSize;
        param.RecordSize = this.props.list.pageParam.RecordSize;
        getBusTypeList(param);
    }
    // 删除
    DelBusType = (BusTypeID, SeatNum) => {
        ShuttleBus.getBusCheck({BusTypeID}).then((data) => {
            Modal.confirm({
                title: '提示',
                content: `是否删除${SeatNum}座车型？`,
                iconType: 'info-circle',
                onOk: () => {
                    BusType.getDelBusType({BusTypeIDList: [{BusTypeID}]}).then((data) => {
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
                content: '当前车型处于合作状态'
            });
        });
    }
    componentDidMount() {
        this.check();
    }
    render() {
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">车型管理</div>
                </div>
                <div style={{background: "#fff", padding: "20px 20px", margin: "0  20px"}}>
                    <BusTypeForm check={this.check} list={this.props.list} />
                    <div style={{marginBottom: "10px"}}>
                        <Button onClick={this.displayModal}>新增车型</Button>
                    </div>
                    <Table
                        bordered
                        rowKey='BusTypeID'
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
                    <BusTypeModal check={this.check} BusTypeID={this.state.BusTypeID} list={this.props.list} />
                </div>
            </div>
        );
    }
}
