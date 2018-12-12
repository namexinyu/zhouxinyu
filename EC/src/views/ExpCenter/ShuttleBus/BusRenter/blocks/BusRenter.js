import React from 'react';
import 'LESS/pages/workBench.less';
import BusRenterForm from "./BusRenterForm";
import BusRenterModal from "./BusRenterModal";
import {Button, Table, message, Modal } from 'antd';
import getBusRenterList from 'ACTION/ExpCenter/ShuttleBus/getBusRenterList';
import BusRenter from 'SERVICE/ExpCenter/BusRenter';
import ShuttleBus from 'SERVICE/ExpCenter/ShuttleBus';
import setParams from "ACTION/setParams";
const STATE_NAME = "reducersBusRenter";
export default class TestPage extends React.PureComponent {
    constructor(props) {
        super(props);  
        this.state = {
            BusRentCorpID: "",
            record: ""
        };
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'IDCardNum',
            className: "listpadding",
            width: "50px",
            render: (text, record, index) => <span>{(index + 1) + this.props.list.pageParam.RecordSize * (this.props.list.pageParam.RecordIndex - 1)}</span>
        },
        {
            title: '租车公司',
            dataIndex: 'RentCorpName',
            className: "listpadding",
            width: "300px"
        },
        {
            title: '联系人',
            dataIndex: 'LinkmanName',
            className: "listpadding",
            width: "100px"
        },
        {
            title: '联系电话',
            dataIndex: 'Mobile',
            className: "listpadding",
            width: "100px"
        },
        {
            title: '司机电话',
            dataIndex: 'Drivers',
            className: "listpadding",
            width: "100px",
            render: (text, record, index) => <span>{text.map((item) => {
                return <p>{ item.Mobile }</p>;
            })}</span>
        },
        {
            title: '操作人',
            dataIndex: 'EmployeeName',
            className: "LinkmanName",
            width: "100px"
        },
        {
            title: '提交时间',
            dataIndex: 'CreateTime',
            className: "listpadding",
            width: "180px"
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => <span><a onClick={this.DelBusType.bind(this, record.BusRentCorpID, record.RentCorpName)}>删除</a><a> | </a><a onClick={this.displayModal.bind(this, 0, record)}>编辑</a></span>
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
        if (this.props.list.queryParams.Name.value && this.props.list.queryParams.Name.value.trim() !== "") {
            param.Name = this.props.list.queryParams.Name.value;
        }
        param.RecordIndex = (page - 1) * pageSize;
        param.RecordSize = pageSize;
        getBusRenterList(param);
    };
    // 显示模态框与保存ID
    displayModal = (ModalType, record) => {
        this.setState({
            BusRentCorpID: record.BusRentCorpID,
            record: record
        });
        if (ModalType == 0) {
            setParams(STATE_NAME, {
               queryParams: {
                   ...this.props.list.queryParams,
                   DriverMobileList: record.Drivers
               }
            });
        }
        setParams(STATE_NAME, {
            displayModal: true,
            ModalType: ModalType
        }); 
    }
    // 删除
    DelBusType = (id, RentCorpName) => {
        ShuttleBus.getBusCheck({BusRentCorpID: id}).then((data) => {
            Modal.confirm({
                title: '提示',
                content: `是否删除${RentCorpName}租车公司？`,
                iconType: 'info-circle',
                onOk: () => {
                    BusRenter.getDelBusRenter({BusRentCorpID: [id]}).then((data) => {
                        if (data.Code == 0) {
                            message.success("删除成功");
                            this.check();
                        }
                    })
                    .catch((data) => {
                        message.error(data.Desc);
                    });
                }
            });
        }).catch(() => {
            Modal.warning({
                title: '提示',
                content: '当前租车公司处于合作状态'
            });
        });
    }
    // 查询
    check = () => {
        let param = {};
        if (this.props.list.queryParams.Name.value && this.props.list.queryParams.Name.value.trim() !== "") {
            param.Name = this.props.list.queryParams.Name.value;
        }
        param.RecordIndex = (this.props.list.pageParam.RecordIndex - 1) * this.props.list.pageParam.RecordSize;
        param.RecordSize = this.props.list.pageParam.RecordSize;
        getBusRenterList(param);
    }
    componentDidMount () {
     this.check();
    }
    render() {
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">租车公司管理</div>
                </div>
                <div style={{background: "#fff", padding: "20px 20px", margin: "0 20px"}}>
                    <BusRenterForm check={this.check} list={this.props.list} />
                    <div style={{marginBottom: "10px"}}>
                        <Button onClick={this.displayModal.bind(this, 1)}>新增租车公司</Button>
                    </div>
                    <Table
                        bordered
                        rowKey='BusRentCorpID'
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
                    <BusRenterModal record={this.state.record} BusRentCorpID={this.state.BusRentCorpID} check={this.check} list={this.props.list} />
                </div>
            </div>
        );
    }
}