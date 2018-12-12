import React from 'react';
import {Row, Col, Form, Select, DatePicker, Button, Input, Table, Card, Modal, Upload, Icon, Alert, Checkbox } from 'antd';
import getHaveDoneData from 'ACTION/Broker/HaveDone/HaveDoneData';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
const STATE_NAME = 'state_broker_have_done';
import stateObjs from "VIEW/StateObjects";
const FormItem = Form.Item;
const {Option} = Select;
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
moment.locale('zh-cn');
let initParams = {};
let chooseTypes = [];
function filterObject(obj) {
    let wrapObj = {};
    if(isArray(obj) == "Object") {
        for(let i in obj) {
            if(isArray(obj[i]) == "Array" && obj[i].length == 0 && i == "WaitTypelist") {
                let typeArr = [];
                for (let j = 0; j < chooseTypes.length; j++) {
                    typeArr.push(j + 1);
                }
                wrapObj[i] = typeArr;
            }else{
                wrapObj[i] = obj[i];
            }
        }
        return wrapObj;
    }
    return obj;
}

function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}

class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);

        this.state = {
            Time: ""
        };
        this.chooseType = this.chooseType.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let Parms = Object.assign({}, this.props.QueryParams, Parms);
            Parms.StarTime = this.state.Time[0] ? this.state.Time[0].replace(/\//g, "-") : "2013-01-01";
            Parms.EndTime = this.state.Time[1] ? this.state.Time[1].replace(/\//g, "-") : getTime(new Date());
            Parms.WaitTypelist = this.props.QueryParams.WaitTypelist || [];
            Parms.UserName = values.UserName ? values.UserName.trim() : "";
            Parms.Phone = values.Phone ? values.Phone.trim() : "";
            Parms.RecordIndex = 0;
            Parms.RecordSize = 20;
            setParams(STATE_NAME, {
                QueryParams: Object.assign({}, Parms)
            });
            getHaveDoneData(filterObject(Parms));
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            Time: ""
        });
        let ChooseArr = this.props.chooseTypes;
        for(let i = 0;i < ChooseArr.length;i++) {
            ChooseArr[i].chooseType = false;
        }
        setParams(STATE_NAME, {
            chooseTypes: ChooseArr,
            chooseAll: true,
            QueryParams: Object.assign({}, this.props.QueryParams, {WaitTypelist: []})
        });
    };
    onChange(data, dataString) {
        this.setState({
            Time: dataString
        });
    }
    chooseType(e) {
        let ChooseArr = this.props.chooseTypes;
        let TypeArr = this.props.QueryParams.WaitTypelist;
        if(e.target.checked && e.target.value) {
            let val = Number(e.target.value);
            TypeArr.push(val);
            ChooseArr[+e.target.value - 1].chooseType = true;
            setParams(STATE_NAME, {
                chooseTypes: ChooseArr
            });
            if(TypeArr.length === ChooseArr.length) {
                setParams(STATE_NAME, {
                    chooseAll: false
                });
            }
        }else if(e.target.value === "") {
            let chooseAllState = this.props.chooseAll;
            if(chooseAllState) {
                for(let i = 0;i < ChooseArr.length;i++) {
                    ChooseArr[i].chooseType = true;
                }
                setParams(STATE_NAME, {
                    chooseTypes: ChooseArr,
                    chooseAll: false
                });
            }else{
                for(let i = 0;i < ChooseArr.length;i++) {
                    ChooseArr[i].chooseType = false;
                }
                setParams(STATE_NAME, {
                    chooseTypes: ChooseArr,
                    chooseAll: true
                });
            }
            if(chooseAllState) {
                TypeArr = this.props.chooseTypes.map((item, index)=>{
                    return (index + 1);
                });
            }else{
                TypeArr = [];
            }

        }else if(!e.target.checked) {
            ChooseArr[+e.target.value - 1].chooseType = false;
            setParams(STATE_NAME, {
                chooseTypes: ChooseArr
            });
            for(let i = 0;i < TypeArr.length;i++) {
                if(TypeArr[i] === e.target.value) {
                    TypeArr.splice(i, 1);
                    i--;
                }
            }
            setParams(STATE_NAME, {
                chooseAll: true
            });
        }
        setParams(STATE_NAME, {QueryParams: Object.assign({}, this.props.QueryParams, {WaitTypelist: TypeArr})});
    }
    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="办理日期">
                            {getFieldDecorator('StarTime')(
                                <RangePicker
                                    ranges={{ "今天": [moment(), moment()], "本月": [moment(), moment().endOf('month')] }}
                                    format="YYYY/MM/DD"
                                    style={{width: "100%"}}
                                    onChange={this.onChange}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="会员姓名">
                            {getFieldDecorator('UserName')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="会员电话">
                            {getFieldDecorator('Phone')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16}>
                        <FormItem labelCol={{span: 3}} wrapperCol={{span: 21}} label="待办类型">
                            {getFieldDecorator('WaitTypelist')(
                                <div>
                                    <span><Checkbox type="checkbox" onChange={this.chooseType} value="" checked={!this.props.chooseAll}></Checkbox> 全选</span>&emsp;
                                    { this.props.chooseTypes.map((item, index)=>{
                                        return(
                                            <span style={{marginRight: "10px"}} key={index}><Checkbox checked={item.chooseType} onChange={this.chooseType} value={index + 1}></Checkbox> {item.name}</span>
                                        );
                                    })}
                                </div>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right', paddingRight: "10px", marginBottom: "20px" }}>
                        <Button onClick={this.handleReset}>
                            重置
                        </Button>
                        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">搜索</Button>
                    </Col>
                </Row>
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

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);

class EditableTable extends React.PureComponent { // table组件
    constructor(props) {
        super(props);


        this.columns = [{
            title: '办理时间',
            dataIndex: 'Retime',
            width: '20%',
            render: (text, record) => {
                const { Retime } = record;
                return (
                    <div>
                        {new Date(Retime).Format('yyyy-MM-dd hh:mm')}
                    </div>
                );
            }
        }, {
            title: '会员姓名',
            dataIndex: 'UserName',
            width: '10%',
            render: (text, record) => {
                const { UserName } = record;
                return (
                    <div>
                        {UserName}
                    </div>
                );
            }
        }, {
            title: '待办类型',
            dataIndex: 'ReType',
            width: '10%',
            render: (text, record) => {
                const { ReType } = record;
                return (
                    <div>
                        {stateObjs.ReType[ReType]}
                    </div>
                );
            }
        }, {
            title: '待办说明',
            dataIndex: 'ReContent',
            width: '40%',
            render: (text, record) => {
                const { ReContent } = record;
                return (
                    <div>
                        {ReContent}
                    </div>
                );
            }
        }, {
            title: '办理记录',
            dataIndex: 'ReCallRecord',
            width: '20%',
            render: (text, record) => {
                const { ReCallRecord } = record;
                return (
                    <div>
                        {ReCallRecord}
                    </div>
                );
            }
        }];
        this.state = {
            current: 1
        };
        this.handleClickUser = this.handleClickUser.bind(this);
        this.handleTabTable = this.handleTabTable.bind(this);
    }
    handleClickUser(record, index, event) {
        if (record.UserID) {
            browserHistory.push({
                pathname: '/broker/member/detail/' + record.UserID,
                query: {
                    memberName: record.Name
                }
            });
        }
    }
    handleTabTable(value) {
        this.setState({
            current: value.current
        });
        let Parms = this.props.QueryParams;
        Parms.RecordSize = value.pageSize;
        Parms.RecordIndex = value.current * Parms.RecordSize - Parms.RecordSize;
        setParams(STATE_NAME, {
            QueryParams: Object.assign({}, Parms)
        });
        getHaveDoneData(filterObject(Parms));
    }
    render() {
        return(
            <div>
                <Table
                    rowKey={'key'}
                    pagination={{
                        total: this.props.RecordCount,
                        pageSize: this.props.QueryParams.RecordSize,
                        current: this.props.QueryParams.RecordIndex ? this.state.current : 1,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ["20", "40", "60", "80", "120"],
                        showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                    }}
                    bordered dataSource={this.props.contentList || []}
                    onChange={this.handleTabTable}
                    columns={this.columns}
                    onRowClick={this.handleClickUser}
                />
            </div>
        );
    }
}


class HaveDoDetails extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        initParams = Object.assign({}, this.props.QueryParams);
        chooseTypes = this.props.chooseTypes;
        getHaveDoneData(filterObject(initParams));
    }
    render() {
        let RecordDone = [];
        if (this.props.RecordDone && this.props.RecordDone.length) {
            RecordDone = this.props.RecordDone;
            for (let i = 0; i < RecordDone.length; i++) {
                RecordDone[i].UserName = RecordDone[i].RealName || RecordDone[i].CallName || RecordDone[i].Name;
            }
        }
        return (
            <div>
                <div className='ivy-page-title'>
                    <h1 className="ivy-title">已办记录</h1>
                </div>

                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <WrappedAdvancedSearchForm chooseAll={this.props.chooseAll} chooseTypes={this.props.chooseTypes} QueryParams = {this.props.QueryParams}/>
                        <div className="fc-line"></div>
                        <EditableTable contentList = {this.props.RecordDone} QueryParams = {this.props.QueryParams} RecordCount = {this.props.RecordCount}></EditableTable>
                    </Card>
                </div>

            </div>
        );
    }
}

function getTime(time) {
    return time.getFullYear() + "/" + changeNumStyle(+time.getMonth() + 1) + "/" + changeNumStyle(time.getDate());
}
function changeNumStyle(num) {
    return num <= 9 ? '0' + num : num;
}

export default HaveDoDetails;
