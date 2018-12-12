import React from 'react';
import {Row, Col, Form, Select, DatePicker, Button, Input, Table, Card, Modal, Upload, Icon, message} from 'antd';
import getLaborAccount from 'ACTION/Finance/AccountManage/LaborAccount';
import CommonAction from 'ACTION/Finance/Common';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import Status from "VIEW/Status";
import setParams from 'ACTION/setParams';
import getLaborComByBoss from 'ACTION/Finance/AccountManage/LaborComByBoss';
import getTransferMoney from 'ACTION/Finance/AccountManage/TransferMoney';
import getRechargeLaborAccount from 'ACTION/Finance/AccountManage/RechargeLaborAccount';
import {CONFIG} from 'mams-com';

const {AppSessionStorage} = CONFIG;
import {browserHistory} from 'react-router';
import uploadRule from 'CONFIG/uploadRule';
import setFetchStatus from 'ACTION/setFetchStatus';

const EmployeeID = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
const STATE_NAME = 'state_fc_laborAccount';
import "LESS/Finance/AccountManage/index.less";

const FormItem = Form.Item;
const {Option} = Select;
import moment from 'moment';

moment.locale('zh-cn');
message.config({
    top: "50%",
    duration: 2,
    marginTop: "-17px"
});
const {
    getLaborBossSimpleList,
    getLaborSimpleList
} = CommonAction;

class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);


        this.state = {
            quickScreen: [
                {
                    value: "全部",
                    type: 0
                },
                {
                    value: "正常",
                    type: 0
                },
                {
                    value: "即将欠费",
                    type: 0
                },
                {
                    value: "欠费",
                    type: 0
                }
            ]
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
            let AccountStatus = [];
            let quickScreen = this.state.quickScreen;
            let Parms = this.props.Parms;
            for (let i = 1; i < quickScreen.length; i++) {
                if (quickScreen[i].type) {
                    AccountStatus.push(i - 1);
                }
            }
            Parms.AccountStatus = Object.assign([], AccountStatus);
            Parms.LaborName = (values.LaborName && values.LaborName.text) ? values.LaborName.text : "";
            Parms.BossName = (values.BossName && values.BossName.text) ? values.BossName.text : "";
            Parms.RecordIndex = 0;
            Parms.RecordSize = 10;
            setParams(STATE_NAME, {
                Parms: Object.assign({}, Parms)
            });
            getLaborAccount(Parms);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    onChange() {

    }

    changeScreen(e) {
        let Index = e.target.tabIndex;
        let quickScreen = this.state.quickScreen;
        let Parms = this.props.Parms;
        let AccountStatus = [];
        if (!Index && quickScreen[Index].type) { // 判断全选
            quickScreen = quickScreen.map((item) => {
                item.type = 0;
                return item;
            });
        } else if (!Index && !quickScreen[Index].type) {
            quickScreen = quickScreen.map((item) => {
                item.type = 1;
                return item;
            });
        } else {
            if (quickScreen[Index].type) {
                quickScreen[Index].type = 0;
                quickScreen[0].type = 0;
            } else {
                quickScreen[Index].type = 1;
                for (var i = 1; i < quickScreen.length; i++) {
                    if (!quickScreen[i].type) {
                        break;
                    }
                }
                if (i == quickScreen.length) {
                    quickScreen[0].type = 1;
                }
            }
        }
        for (let i = 1; i < quickScreen.length; i++) {
            if (quickScreen[i].type) {
                AccountStatus.push(i - 1);
            }
        }
        Parms.AccountStatus = Object.assign([], AccountStatus);
        Parms.RecordIndex = 0;
        Parms.RecordSize = 10;
        setParams(STATE_NAME, {
            Parms: Object.assign({}, Parms)
        });
        this.setState({
            quickScreen: quickScreen
        });
        getLaborAccount(Parms);
    }

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Row>
                <Col span={8}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="劳务公司">
                        {getFieldDecorator('LaborName')(
                            <AutoCompleteInput
                                textKey="ShortName" valueKey="LaborID"
                                dataSource={this.props.common.LaborSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="大老板">
                        {getFieldDecorator('BossName')(
                            <AutoCompleteInput
                                textKey="BossName" valueKey="LaborBossID"
                                dataSource={this.props.common.LaborBossSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} style={{textAlign: 'right', paddingRight: "10px", marginBottom: "20px"}}>
                    <Button onClick={this.handleReset}>
                        重置
                    </Button>
                    <Button style={{marginLeft: 8}} type="primary" htmlType="submit">搜索</Button>
                </Col>
                <Col span={13}>
                    <FormItem labelCol={{span: 3}} wrapperCol={{span: 21}} label="快速筛选">
                        {getFieldDecorator('AccountStatus')(
                            <div className="quickScreenWrap">
                                {
                                    this.state.quickScreen.map((item, index) => {
                                        return (
                                            <Button type={item.type ? "primary" : ""} onClick={this.changeScreen}
                                                    className="quickScreen" tabIndex={index}
                                                    key={index}>{item.value}</Button>
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

class AccountSearchForm extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);


        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let Parms = {};
            let PropParms = this.props.Parms;
            let Amounts = null;
            PropParms.RecordIndex = 0;
            PropParms.RecordSize = 10;
            Parms.Amount = Number(values.Amount) * 100;
            Parms.iLaborIDFrom = values.iLaborIDFrom ? values.iLaborIDFrom.data.iLaborID : null;
            Amounts = values.iLaborIDFrom.data.Available;
            Parms.iLaborIDTo = values.iLaborIDTo ? values.iLaborIDTo.data.iLaborID : null;
            Parms.iLaborBossID = this.props.dataList.iLaborBossID;
            if (Parms.iLaborIDFrom && Parms.iLaborIDTo) {
                if (Parms.Amount > Amounts) {
                    message.destroy();
                    message.error("转出金额不得超出可用余额！");
                    return;
                }
                if (Parms.iLaborIDFrom === Parms.iLaborIDTo) {
                    message.destroy();
                    message.error("转出账户和转入账户不得相同！");
                    return;
                }
                getTransferMoney(Parms);
                setParams(STATE_NAME, {
                    Parms: Object.assign({}, PropParms)
                });
            } else {
                message.destroy();
                message.error("信息不足，请填写完整！");
                return;
            }
            this.props.form.resetFields();
            this.props.close();
        });
    };

    handleCancel = () => {
        this.props.close();
    };

    handleChange(e) {
        if (Number(e.target.value) > 30000) {
            message.destroy();
            message.error("转出金额不得大于30000元");
            e.target.value = "";
        }
    }

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="大老板">
                        {getFieldDecorator('BossName')(
                            <Input disabled placeholder={this.props.dataList.BossName}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="转出账户">
                        {getFieldDecorator('iLaborIDFrom')(
                            <AutoCompleteInput
                                textKey="LaborName" valueKey="iLaborID"
                                dataSource={this.props.RecordListLabor}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="转出金额">
                        {getFieldDecorator('Amount')(
                            <Input addonAfter="元" placeholder="请输入转出金额" onChange={this.handleChange}/>
                        )}最大转出金额 30000.00 元
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="转入账户">
                        {getFieldDecorator('iLaborIDTo')(
                            <AutoCompleteInput
                                textKey="LaborName" valueKey="iLaborID"
                                dataSource={this.props.RecordListLabor}/>
                        )}
                    </FormItem>
                </Col>
                <div style={{position: "absolute", right: 20, bottom: -59, zIndex: 10}}>
                    <Button onClick={this.handleCancel} size="large" style={{marginRight: 8}}>
                        取消
                    </Button>
                    <Button size="large" type="primary" htmlType="submit">确定</Button>
                </div>
            </div>
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

const WrappedAccount = Form.create()(AccountSearchForm);


class AccountSearchFormTow extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);

        this.state = {
            upParms: {
                Amount: 0,
                RechargeMode: null,
                iLaborID: null,
                RechargeTime: ""
            }
        };
        this.handleUploadChange = this.handleUploadChange.bind(this);
        this.changeTime = this.changeTime.bind(this);
    }

    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let upParms = this.state.upParms;
            let PropParms = this.props.Parms;
            PropParms.RecordIndex = 0;
            PropParms.RecordSize = 10;
            if (!values.Amount || !values.RechargeMode || !this.props.entBL.length) {
                message.destroy();
                message.error("充值信息请补充完整！");
                return;
            }
            upParms.Amount = values.Amount ? Number(values.Amount) * 100 : 0;
            upParms.RechargeMode = values.RechargeMode ? Number(values.RechargeMode) : null;
            upParms.iLaborID = this.props.dataList.iLaborID;
            upParms.Certificate = this.props.entBL[0].response.name;
            upParms.EmployeeID = EmployeeID;
            upParms.WhoRecharge = values.WhoRecharge || "";
            upParms.AccountNumber = values.AccountNumber || "";
            // upParms.RechargeTime = values.RechargeTime || "";
            upParms.GiftAmount = values.GiftAmount ? Number(values.GiftAmount) * 100 : 0;
            if (upParms.GiftAmount > upParms.Amount * 0.03) {
                message.destroy();
                message.error("额外送金额不能超过充值金额的3%！");
                return;
            }
            getRechargeLaborAccount(upParms);
            setParams(STATE_NAME, {
                Parms: Object.assign({}, PropParms)
            });
            setParams(STATE_NAME, {
                entBL: []
            });
            console.log(upParms.RechargeTime, 111);
            this.props.close();
            this.props.form.resetFields();
        });
    };
    handleCancel = () => {
        this.props.close();
    };

    handleUploadChange(id, list) {
        setParams(STATE_NAME, {
            [id]: list
        });
    }

    changeTime(v, t) {
        this.setState({
            upParms: Object.assign({}, this.state.upParms, {RechargeTime: t})
        });
    }

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        const {entBL} = this.props;
        return (
            <div>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="劳务公司">
                        {getFieldDecorator('LaborName')(
                            <Input disabled placeholder={this.props.dataList.LaborName}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="充值人名称">
                        {getFieldDecorator('WhoRecharge')(
                            <Input placeholder="请输入充值人名称"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="充值人账号">
                        {getFieldDecorator('AccountNumber')(
                            <Input placeholder="请输入充值人账号"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="充值时间">
                        {getFieldDecorator('RechargeTime')(
                            <DatePicker
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}
                                onChange={this.changeTime}
                            />
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="充值金额">
                        {getFieldDecorator('Amount')(
                            <Input addonAfter="元" placeholder="请输入额外送金额"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="额外送">
                        {getFieldDecorator('GiftAmount')(
                            <Input addonAfter="元" placeholder="请输入充值金额"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="充值方式">
                        {getFieldDecorator('RechargeMode')(
                            <Select
                                placeholder="请选择"
                                size="large"
                            >
                                <Option value="1">汇款</Option>
                                <Option value="2">现金</Option>
                                <Option value="3">支票</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 5}} wrapperCol={{span: 19}} label="上传凭证">
                        {getFieldDecorator('entBL')(
                            <AliyunUpload id={'entBL'} accept="image/jpeg,image/png" oss={uploadRule.entCertPicture}
                                          listType="picture-card" defaultFileList={entBL} maxNum={1}
                                          uploadChange={this.handleUploadChange.bind(this)}/>
                        )}
                    </FormItem>
                </Col>
                <div style={{position: "absolute", right: 20, bottom: -59, zIndex: 10}}>
                    <Button onClick={this.handleCancel} size="large" style={{marginRight: 8}}>
                        取消
                    </Button>
                    <Button size="large" type="primary" htmlType="submit">确定</Button>
                </div>
            </div>
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

const WrappedAccountTow = Form.create()(AccountSearchFormTow);


class EditableTable extends React.PureComponent { // table组件
    constructor(props) {
        super(props);

        this.columns = [{
            title: '劳务公司',
            dataIndex: 'LaborName',
            width: '15%',
            render: (text, record) => {
                const {LaborName} = record;
                return (
                    <div>
                        {LaborName}
                    </div>
                );
            }
        }, {
            title: '大老板',
            dataIndex: 'BossName',
            width: '10%',
            render: (text, record) => {
                const {BossName} = record;
                return (
                    <div>
                        {BossName}
                    </div>
                );
            }
        }, {
            title: '信用评分',
            dataIndex: 'Credit',
            width: '10%',
            render: (text, record) => {
                const {Credit} = record;
                return (
                    <div>
                        {Credit}
                    </div>
                );
            }
        }, {
            title: '账户余额',
            dataIndex: 'Balance',
            width: '10%',
            render: (text, record) => {
                const {Balance} = record;
                return (
                    <div>
                        {Balance / 100}
                    </div>
                );
            }
        }, {
            title: '冻结押金',
            dataIndex: 'FrozenAmount',
            width: '10%',
            render: (text, record) => {
                const {FrozenAmount} = record;
                return (
                    <div>
                        {FrozenAmount / 100}
                    </div>
                );
            }
        }, {
            title: '可用余额',
            dataIndex: 'Difference',
            width: '10%',
            render: (text, record) => {
                const {Difference} = record;
                return (
                    <div>
                        {Difference / 100}
                    </div>
                );
            }
        }, {
            title: '账户状态',
            dataIndex: 'AccountStatus',
            width: '10%',
            render: (text, record) => {
                const {AccountStatus} = record;
                return (
                    <div>
                        {Status.AccountStatus[Number(AccountStatus)]}
                    </div>
                );
            }
        }, {
            title: '操作',
            dataIndex: 'toStatus',
            width: '20%',
            render: (text, record) => {
                const {iAccountID} = record;
                return (
                    <div>
                        <AlertWindowTow Parms={this.props.Parms} entBL={this.props.entBL} data={record}
                                        common={this.props.common} text="充值"/>&emsp;
                        {/* 暂时隐藏
                        <AlertWindow data = {record} Parms = {this.props.Parms} RecordListLabor = {this.props.RecordListLabor} text="划款" />&emsp;
                        */}
                        <a href="javascript:;" onClick={() => {
                            this.leaveThisPage(iAccountID);
                        }}>收支明细</a>
                    </div>
                );
            }
        }];
        this.state = {
            current: 1,
            selectedRowKeys: [] // Check here to configure the default column
        };
        this.handleTabTable = this.handleTabTable.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.leaveThisPage = this.leaveThisPage.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.getRechargeLaborAccountFetch.status === "success") {
            setFetchStatus(STATE_NAME, 'getRechargeLaborAccountFetch', 'close');
            getLaborAccount(this.props.Parms);
        }
        if (nextProps.getTransferMoneyFetch.status === "success") {
            setFetchStatus(STATE_NAME, 'getTransferMoneyFetch', 'close');
            setTimeout(() => {
                getLaborAccount(this.props.Parms);
            }, 50);
        }
        this.setState({
            current: this.props.Parms.RecordIndex ? (this.props.Parms.RecordIndex / this.props.Parms.RecordSize) + 1 : 1
        });
    }

    render() {
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            onSelection: this.onSelection
        };
        return <Table
            rowKey={'iAccountID'}
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
            rowSelection={rowSelection}
        />;
    }

    leaveThisPage(id) {
        browserHistory.push({pathname: "/fc/account/balance-details", query: {id: id}});
    }

    handleTabTable(value) {
        this.setState({
            current: value.current
        });
        let Parms = this.props.Parms;
        Parms.RecordSize = value.pageSize;
        Parms.RecordIndex = value.current * Parms.RecordSize - Parms.RecordSize;
        setParams(STATE_NAME, {
            Parms: Object.assign({}, Parms)
        });
        getLaborAccount(Parms);
    }

    onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys: selectedRowKeys});
    }
}


class LaborAccount extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        getLaborSimpleList(); // 劳务公司模糊下拉数据
        getLaborBossSimpleList(); // 大老板模糊下拉数据
        getLaborAccount(this.props.Parms);
    }

    render() {
        return (
            <div>
                <div className='ivy-page-title'>
                    <h1>劳务账户</h1>
                </div>

                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <WrappedAdvancedSearchForm Parms={this.props.Parms} common={this.props.common}/>
                        <EditableTable
                            getRechargeLaborAccountFetch={this.props.getRechargeLaborAccountFetch}
                            getTransferMoneyFetch={this.props.getTransferMoneyFetch}
                            entBL={this.props.entBL} RecordListLabor={this.props.RecordListLabor}
                            common={this.props.common} contentList={this.props.RecordList} Parms={this.props.Parms}
                            RecordCount={this.props.RecordCount}/>
                    </Card>
                </div>

            </div>
        );
    }
}

class AlertWindow extends React.PureComponent { // 弹出框组件

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            textValue: ""
        };
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentWillMount() {
        // getLaborComByBoss
    }

    showModal() {
        getLaborComByBoss({
            iLaborBossID: this.props.data.iLaborBossID
        });
        this.setState({
            visible: true
        });
    }

    hideModal() {
        this.setState({
            visible: false
        });
    }

    render() {
        return (
            <div style={{display: "inline-block"}}>
                <a onClick={this.showModal}>{this.props.text}</a>
                <Modal
                    title="账户划款"
                    visible={this.state.visible}
                    okText="确定"
                    cancelText="取消"
                    width="500px"
                    onCancel={this.hideModal}
                >
                    <WrappedAccount Parms={this.props.Parms} dataList={this.props.data}
                                    RecordListLabor={this.props.RecordListLabor}
                                    close={this.hideModal}></WrappedAccount>
                </Modal>
            </div>
        );
    }
}


class AlertWindowTow extends React.PureComponent { // 弹出框组件

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            textValue: ""
        };
        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentWillMount() {


    }

    showModal() {
        this.setState({
            visible: true
        });
    }

    hideModal() {
        this.setState({
            visible: false
        });
    }

    render() {
        return (
            <div style={{display: "inline-block"}}>
                <a onClick={this.showModal}>{this.props.text}</a>
                <Modal
                    title="账户充值"
                    visible={this.state.visible}
                    okText="确定"
                    cancelText="取消"
                    width="500px"
                    onCancel={this.hideModal}
                >
                    <WrappedAccountTow Parms={this.props.Parms} entBL={this.props.entBL} dataList={this.props.data}
                                       common={this.props.common} close={this.hideModal}></WrappedAccountTow>
                </Modal>
            </div>
        );
    }
}


export default LaborAccount;
