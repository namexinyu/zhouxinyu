import React from 'react';
import {Row, Col, Form, Select, DatePicker, Button, Input, Table, Card, Modal, Upload, Icon, Alert} from 'antd';
import getBalanceDetails from 'ACTION/Finance/AccountManage/BalanceDetails';
import setParams from 'ACTION/setParams';
import Status from "VIEW/Status";
const STATE_NAME = 'state_fc_balanceDetails';
import "LESS/Finance/AccountManage/index.less";
const FormItem = Form.Item;
const {Option} = Select;
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
moment.locale('zh-cn');

class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);


        this.state = {
            quickScreen: [
                {
                    value: "全部",
                    type: 0,
                    typeNum: null
                },
                {
                    value: "账户充值",
                    type: 0,
                    typeNum: 12
                },
                {
                    value: "劳务订单",
                    type: 0,
                    typeNum: 9
                },
                {
                    value: "收退费",
                    type: 0,
                    typeNum: 3
                },
                {
                    value: "劳务转账进账",
                    type: 0,
                    typeNum: 13
                },
                {
                    value: "劳务转账出账",
                    type: 0,
                    typeNum: 14
                },
                {
                    value: "赠送金额",
                    type: 0,
                    typeNum: 26
                }
            ],
            Time: ""
        };
        this.onChange = this.onChange.bind(this);
        this.changeScreen = this.changeScreen.bind(this);
    }
    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let Parms = this.props.Parms;
            Parms.CreateTimeStart = this.state.Time ? this.state.Time[0] : "";
            Parms.CreateTimeEnd = this.state.Time ? this.state.Time[1] : "";
            Parms.RecordIndex = 0;
            Parms.RecordSize = 10;
            for (let i = 1; i < this.state.quickScreen.length; i++) {
                if(this.state.quickScreen[i].type) {
                    Parms.TradeType.push(this.state.quickScreen[i].typeNum);
                }
            }
            setParams(STATE_NAME, {
                Parms: Object.assign({}, Parms)
            });
            getBalanceDetails(Parms);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            Time: ""
        });
    };
    onChange(data, dataString) {
        this.setState({
            Time: dataString
        });
    }
    changeScreen(e) {
        let Index = e.target.tabIndex;
        let quickScreen = this.state.quickScreen;
        let Parms = this.props.Parms;
        let TradeType = [];
        if(!Index && quickScreen[Index].type) { // 判断全选
            quickScreen = quickScreen.map((item)=>{
                item.type = 0;
                return item;
            });
        }else if(!Index && !quickScreen[Index].type) {
            quickScreen = quickScreen.map((item)=>{
                item.type = 1;
                return item;
            });
        }else{
            if(quickScreen[Index].type) {
                quickScreen[Index].type = 0;
                quickScreen[0].type = 0;
            }else{
                quickScreen[Index].type = 1;
                for (var i = 1; i < quickScreen.length; i++) {
                    if(!quickScreen[i].type) {
                        break;
                    }
                }
                if(i == quickScreen.length) {
                    quickScreen[0].type = 1;
                }
            }
        }
        for (let i = 1; i < quickScreen.length; i++) {
            if(quickScreen[i].type) {
                TradeType.push(quickScreen[i].typeNum);
            }
        }
        Parms.TradeType = Object.assign([], TradeType);
        Parms.RecordIndex = 0;
        Parms.RecordSize = 10;
        setParams(STATE_NAME, {
            Parms: Object.assign({}, Parms)
        });
        this.setState({
            quickScreen: quickScreen
        });
        getBalanceDetails(Parms);
    }
    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        return(
            <Row>
                <Col span={8}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="签到日期">
                        {getFieldDecorator('signData')(
                            <RangePicker
                                ranges={{ "今天": [moment(), moment()], "本月": [moment(), moment().endOf('month')] }}
                                format="YYYY/MM/DD"
                                onChange={this.onChange}
                            />
                        )}
                    </FormItem>
                </Col>
                <Col span={16} style={{ textAlign: 'right', paddingRight: "10px", marginBottom: "20px" }}>
                    <Button onClick={this.handleReset}>
                        重置
                    </Button>
                    <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">搜索</Button>
                </Col>
                <Col span={20}>
                    <FormItem labelCol={{span: 2}} wrapperCol={{span: 22}} label="快速筛选">
                        {getFieldDecorator('quickScreen')(
                            <div className="quickScreenWrap">
                                {
                                    this.state.quickScreen.map((item, index)=>{
                                        return(
                                            <Button type={item.type ? "primary" : ""} onClick={this.changeScreen} className="quickScreen" tabIndex={index} key={index}>{item.value}</Button>
                                        );
                                    })
                                }
                            </div>
                        )}
                    </FormItem>
                </Col>
            </Row>

        );
    }

    render() {
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={40}>{this.getFields()}</Row>
            </Form>
        );
    }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

class EditableTable extends React.PureComponent { // table组件
    constructor(props) {
        super(props);

        this.columns = [{
            title: '入账时间',
            dataIndex: 'CreateTime',
            width: '20%',
            sorter: true,
            render: (text, record) => {
                const { CreateTime } = record;
                return (
                    <div>
                        {CreateTime}
                    </div>
                );
            }
        }, {
            title: '交易类型',
            dataIndex: 'TradeType',
            width: '20%',
            render: (text, record) => {
                const { TradeType } = record;
                return (
                    <div>
                        {Status.TradeType[Number(TradeType)]}
                    </div>
                );
            }
        }, {
            title: '收支金额',
            dataIndex: 'Amount',
            width: '20%',
            render: (text, record) => {
                const { Amount } = record;
                return (
                    <div>
                        {Amount / 100}
                    </div>
                );
            }
        }, {
            title: '账户余额',
            dataIndex: 'Balance',
            width: '20%',
            render: (text, record) => {
                const { Balance } = record;
                return (
                    <div>
                        {Balance / 100}
                    </div>
                );
            }
        }, {
            title: '备注',
            dataIndex: 'Remark',
            width: '20%',
            render: (text, record) => {
                const { Remark } = record;
                return (
                    <div>
                        {Remark}
                    </div>
                );
            }
        }];
        this.state = {
            current: 1
        };
        this.handleTabTable = this.handleTabTable.bind(this);
    }
    render() {
        return(
            <div>
                <Alert message={<div>收入金额：<span>{this.props.TotalIn / 100} </span>元， 支出金额：<span>{this.props.TotalOut / 100}</span> 元</div>} showIcon type="info" style={{marginBottom: "10px", color: "#1890FF"}} />
                <Table
                    rowKey={'key'}
                    pagination={{
                        total: this.props.RecordCount,
                        pageSize: this.props.Parms.RecordSize,
                        current: this.props.Parms.RecordIndex ? this.state.current : 1,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                    }}
                    bordered dataSource={this.props.contentList ? this.props.contentList : []}
                    columns={this.columns}
                    onChange={this.handleTabTable}
                />
            </div>
        );
    }
    handleTabTable(value, filter, sorter) {
        this.setState({
            current: value.current
        });
        let Parms = this.props.Parms;
        Parms.RecordSize = value.pageSize;
        Parms.RecordIndex = value.current * Parms.RecordSize - Parms.RecordSize;
        if(sorter.order) {
            Parms.Order = (sorter.order == "descend") ? 0 : 1;
        }
        setParams(STATE_NAME, {
            Parms: Object.assign({}, Parms)
        });
        getBalanceDetails(Parms);
    }
}


class BalanceDetails extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let id = window.location.search ? Number(window.location.search.slice(1).split("=")[1]) : null;
        let Parms = this.props.Parms;
        Parms.iAccountID = id;
        setParams(STATE_NAME, {
            Parms: Object.assign({}, Parms)
        });
        getBalanceDetails(Parms);
    }
    render() {
        return (
            <div>
                <div className='ivy-page-title'>
                    <div className="ivy-title">收支明细</div>
                </div>

                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <WrappedAdvancedSearchForm Parms = {this.props.Parms}/>
                        <div className="fc-line"></div>
                        <EditableTable contentList = {this.props.RecordList} Parms = {this.props.Parms} RecordCount = {this.props.RecordCount} TotalOut = {this.props.TotalOut} TotalIn = {this.props.TotalIn}></EditableTable>
                    </Card>
                </div>

            </div>
        );
    }
}



export default BalanceDetails;
