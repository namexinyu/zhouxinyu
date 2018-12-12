import React from 'react';
import 'LESS/pages/workBench.less';
import BusOrderForm from "./BusOrderForm";
import BusOrderModal from "./BusOrderModal";
import { Button, Modal, Input, Table, Select, message } from 'antd';
import GetBusOrderDetail from 'ACTION/ExpCenter/ShuttleBus/GetBusOrderDetail';
import GetBusOrderList from 'ACTION/ExpCenter/ShuttleBus/GetBusOrderList';
import BusOrder from 'SERVICE/ExpCenter/BusOrder';
import MAMSCommonAction from 'ACTION/Common/MAMSCommonAction';
import setParams from "ACTION/setParams";
const STATE_NAME = "reducersBusOrder";
// 
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
            width: "50px",
            render: (text, record, index) => <span>{(index + 1) + this.props.list.pageParam.RecordSize * (this.props.list.pageParam.RecordIndex - 1)}</span>
        },
        {
            title: '日期',
            dataIndex: 'CreateTime',
            className: "listpadding"
        },
        {
            title: '始发地',
            dataIndex: 'OriginDesc',
            className: "listpadding"
        },
        {
            title: '目的地',
            dataIndex: 'DestDesc',
            className: "listpadding"
        },
        {
            title: '租车公司',
            dataIndex: 'RentCorpName',
            className: "listpadding"
        },
        {
            title: '车座',
            dataIndex: 'BusType',
            className: "listpadding",
            width: "50px"
        },
        {
            title: '实载人数',
            dataIndex: 'GetOnCount',
            className: "listpadding",
            width: "80px"
        },
        {
            title: '应付',
            dataIndex: 'ChargeAmount',
            className: "listpadding",
            render: (text, record) => <div>{(record.Amount / 100).FormatMoney({fixed: 2}) + '元'}</div>
        },
        {
            title: '应收',
            dataIndex: 'ReceivableAmount',
            className: "listpadding",
            render: (text, record) => <div>{(record.ReceivableAmount / 100).FormatMoney({fixed: 2}) + '元'}</div>
        },
        {
            title: '费用承担方',
            dataIndex: 'ChargeFor',
            className: "listpadding",
            width: "90px",
            render: (text, record, index) => <span>{text == 1 ? "公司" : text == 2 ? "劳务" : ""}</span>
        },
        {
            title: '订单状态',
            dataIndex: 'BusOrderStatus',
            className: "listpadding",
            width: "100px",
            render: (text, record, index) => <span>{text == 1 ? "未发车" : text == 2 ? "已发车" : "已完成"}</span>

        },
        {
            title: '结算状态',
            dataIndex: 'SettleStatus',
            className: "listpadding",
            width: "100px",
            render: (text, record, index) => <span>{text == 1 ? "已结算" : "未结算"}</span>
        },
        {
            title: '操作人',
            dataIndex: 'EmployeeName',
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
            render: (text, record, index) => <a onClick={this.displayModal.bind(this, record)}>订单明细</a>
        }
    ];
    onChange = (page, pageSize) => {
        setParams(STATE_NAME, {
            pageParam: {
                ...this.props.list.pageParam,
                RecordIndex: page,
                RecordSize: pageSize
            }
        });
        let obj = this.param();
        let param = {...obj};
        param.RecordIndex = (page - 1) * pageSize;
        param.RecordSize = pageSize;
        GetBusOrderList(param);
    };
    check = () => {
        let obj = this.param();
        let param = {...obj};
        param.RecordIndex = (this.props.list.pageParam.RecordIndex - 1) * this.props.list.pageParam.RecordSize;
        param.RecordSize = this.props.list.pageParam.RecordSize;
        GetBusOrderList(param);
    }
    param = () => {
        let param = {TypeKey: "web"};
        if (this.props.list.queryParams.OrderStartDate.value) {
            param.OrderStartDate = this.props.list.queryParams.OrderStartDate.value.format('YYYY-MM-DD');
        }
        if (this.props.list.queryParams.OrderEndDate.value) {
            param.OrderEndDate = this.props.list.queryParams.OrderEndDate.value.format('YYYY-MM-DD');
        }
        if (this.props.list.queryParams.DestName.value) {
            param.DestID = this.props.list.queryParams.DestName.value * 1;
        }
        if (this.props.list.queryParams.RenterName.value && this.props.list.queryParams.RenterName.value.trim() !== "") {
            param.RentCorpName = this.props.list.queryParams.RenterName.value;
        }
        if (this.props.list.queryParams.OrderStatus.value) {
            param.BusOrderStatus = this.props.list.queryParams.OrderStatus.value * 1;
        }
        if (this.props.list.queryParams.SettleStatus.value) {
            param.SettleStatus = this.props.list.queryParams.SettleStatus.value * 1;
        }
        if (this.props.list.queryParams.OriginName.value) {
            param.OriginID = this.props.list.queryParams.OriginName.value * 1;
        }
        return param;
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let ChargeAmount = 0;
        let ReceivableAmount = 0;
        let BrokerCountAmount = 0;
        let CheckOutType = true;
        selectedRows.map((item) => {
            if (item.Amount / 100 >= 0) {
                ChargeAmount += item.Amount / 100;
            }
            if (item.ReceivableAmount / 100 >= 0) {
                ReceivableAmount += item.ReceivableAmount / 100;
            }
            if (item.Amount / 100 / item.GetOnCount * item.BrokerCount >= 0) {
                BrokerCountAmount += item.Amount / 100 / item.GetOnCount * item.BrokerCount;    
            }
            if (item.BusOrderStatus == 1 || item.BusOrderStatus == 2) {
                CheckOutType = false;
            }
        });
        setParams(STATE_NAME, {
            selectedRowKeys: selectedRowKeys,
            ChargeAmount: ChargeAmount,
            ReceivableAmount: ReceivableAmount,
            BrokerCountAmount: BrokerCountAmount,
            CheckOutType: CheckOutType
        });
    }
    displayModal = (record) => {
        GetBusOrderDetail({BusOrderID: record.BusOrderID});
        setParams(STATE_NAME, {
            displayModal: true,
            queryParams: {
                ...this.props.list.queryParams,
                ChargeFor: {value: record.ChargeFor},
                ReceivableAmount: {value: record.ReceivableAmount / 100},
                Remark: {value: record.Remark}
            }
        });
    }
    CheckOut = () => {
        if (this.props.list.selectedRowKeys.length == 0) {
            message.warning("请选择要结算订单");
        }else {
            if (this.props.list.CheckOutType == false) {
                Modal.warning({
                    title: '提示',
                    content: '所选项有【已发车】状态订单！！'
                });
            }else{
                BusOrder.SetSettleStatus({OrderIDList: this.props.list.selectedRowKeys}).then((data) => {
                    if (data.Code == 0) {
                        message.success("结算成功");
                        this.check();
                        setParams(STATE_NAME, {
                            selectedRowKeys: [],
                            ChargeAmount: 0.00,
                            ReceivableAmount: 0.00,
                            BrokerCountAmount: 0.00
                        });
                    }
                }).catch((data) => {
                    message.error(data.Desc);
                });
            }
            
        }
    }
    componentDidMount() {
        this.check();
        MAMSCommonAction.GetHubList();
    }
    render() {
        const { selectedRowKeys } = this.props.list;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                        <div className="ivy-title">订单管理</div>
                </div>
                <div style={{margin: "0px 20px 0px", padding: "20px 20px", background: "#fff"}}>
                    <BusOrderForm check={this.check} HubSimpleList={this.props.HubSimpleList} list={this.props.list} />
                    <div style={{ marginBottom: "10px" }}>
                        <Button onClick={this.CheckOut}>确认结算</Button>
                    </div>
                    <div>
                        已选：{this.props.list.selectedRowKeys !== [] ? this.props.list.selectedRowKeys.length : 0} 项,   应付：{(this.props.list.ChargeAmount).FormatMoney({fixed: 2})} 元，应收：{(this.props.list.ReceivableAmount).FormatMoney({fixed: 2})}元，经纪中心：{(this.props.list.BrokerCountAmount).FormatMoney({fixed: 2})}元
                    </div>
                    <Table
                        bordered
                        rowKey='BusOrderID'
                        columns={this.columns}
                        dataSource={this.props.list.RecordList}
                        rowSelection={rowSelection}
                        pagination={{
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
                            onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize)
                        }} />
                    <BusOrderModal check={this.check} list={this.props.list} />
                </div>
            </div>
        );
    }
}