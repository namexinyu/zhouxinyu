import React from 'react';
import {
    Row,
    Col,
    Form,
    Select,
    DatePicker,
    Button,
    Input,
    Table,
    Card,
    Modal,
    Upload,
    Icon,
    Alert,
    Checkbox
} from 'antd';
import BrokerAction from 'ACTION/Assistant/BrokerAction';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
import stateObjs from "VIEW/StateObjects";
import "LESS/pages/need-do.less";
import fac from 'COMPONENT/FUCTIONS';
import moment from 'moment';
import QueryParam from 'UTIL/base/QueryParam';

const getHaveDoneData = BrokerAction.GetHaveDoneList;
const getNeedToDoData = BrokerAction.GetNeedDoList;
const STATE_NAME = 'state_ac_needDoList';
const {chooseType} = fac;
const FormItem = Form.Item;
const {Option} = Select;

const RangePicker = DatePicker.RangePicker;
moment.locale('zh-cn');
let initParams = {};
let chooseTypeArr = [];

function filterObject(obj) {
    let wrapObj = {};
    if (isArray(obj) == "Object") {
        for (let i in obj) {
            if (isArray(obj[i]) == "Array" && obj[i].length == 0 && i == "WaitTypelist") {
                let typeArr = [];
                for (let j = 0; j < chooseTypeArr.length; j++) {
                    typeArr.push(j + 1);
                }
                wrapObj[i] = typeArr;
            } else {
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


        this.chooseType = this.chooseType.bind(this);
    }

    componentWillMount() {
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let param = filterObject(this.props.QueryParams);
            param.BrokerID = QueryParam.getQueryParam(window.location.href, 'BrokerID') - 0;
            getNeedToDoData(param);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
        let ChooseArr = this.props.chooseTypes;
        for (let i = 0; i < ChooseArr.length; i++) {
            ChooseArr[i].chooseType = false;
        }
        setParams(STATE_NAME, {
            chooseTypes: ChooseArr,
            chooseAll: true,
            QueryParams: Object.assign({}, this.props.QueryParams, {WaitTypelist: []})
        });
    };

    chooseType(e) {
        let ChooseArr = [...this.props.chooseTypes];
        let TypeArr = [...this.props.QueryParams.WaitTypelist].join();
        let date = chooseType(e, ChooseArr, TypeArr, setParams, STATE_NAME, this.props.chooseAll);
        TypeArr = date.TypeArr;
        setParams(STATE_NAME, {QueryParams: Object.assign({}, this.props.QueryParams, {WaitTypelist: TypeArr})});

    }

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Row>
                <Col span={18}>
                    <FormItem labelCol={{span: 3}} wrapperCol={{span: 20}} label="待办类型">
                        {getFieldDecorator('WaitTypelist')(
                            <div>
                                <span><Checkbox type="checkbox" onChange={this.chooseType} value=""
                                                checked={!this.props.chooseAll}></Checkbox> 全选</span>&emsp;
                                {this.props.chooseTypes.map((item, index) => {
                                    return (
                                        <span style={{marginRight: "10px"}} key={index}><Checkbox
                                            checked={item.chooseType} onChange={this.chooseType}
                                            value={index + 1}></Checkbox> {item.name}</span>
                                    );
                                })}
                            </div>
                        )}
                    </FormItem>
                </Col>
                <Col span={6} style={{textAlign: 'right', paddingRight: "10px", marginBottom: "20px"}}>
                    <Button onClick={this.handleReset}>
                        重置
                    </Button>
                    <Button style={{marginLeft: 8}} type="primary" htmlType="submit">搜索</Button>
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
            title: '最新待办时间',
            dataIndex: 'CreateTime',
            width: '20%',
            render: (text, record) => {
                const {CreateTime} = record;
                return (
                    <div>
                        {new Date(CreateTime).Format('yyyy-MM-dd hh:mm')}
                    </div>
                );
            }
        }, {
            title: '会员姓名',
            dataIndex: 'UserName',
            width: '15%',
            render: (text, record) => {
                const {UserName} = record;
                return (
                    <div>
                        {UserName}
                    </div>
                );
            }
        }, {
            title: '待办类型',
            dataIndex: 'WaitTypelist',
            width: '65%',
            render: (text, record) => {
                const {WaitTypelist} = record;
                return (
                    <div>
                        {
                            WaitTypelist.map((item1, index1) => {
                                return (
                                    <span className="need-do-type-span btn-info" style={{
                                        padding: "3px 5px",
                                        backgroundColor: "#108ee9",
                                        marginRight: "5px",
                                        borderRadius: "3px",
                                        color: "#fff"
                                    }} key={index1}>{stateObjs.ReType[item1]}</span>
                                );
                            })
                        }
                    </div>
                );
            }
        }];
        this.handleClickUser = this.handleClickUser.bind(this);
    }

    handleClickUser(record, index, event) {
        if (record.UserID) {
            browserHistory.push({pathname: '/ac/member/detail/' + QueryParam.getQueryParam(window.location.href, 'BrokerID') + '/' + record.UserID});
        }
    }

    render() {
        return (
            <div>
                <Table className="need-do-table" onRowClick={this.handleClickUser} bordered
                       dataSource={this.props.contentList || []} columns={this.columns}/>
            </div>
        );
    }
}


class NeedDoDetails extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        initParams = Object.assign({}, this.props.QueryParams);
        chooseTypeArr = this.props.chooseTypes || [];
        let param = filterObject(initParams);
        param.BrokerID = QueryParam.getQueryParam(window.location.href, 'BrokerID') - 0;
        getNeedToDoData(param);
    }

    render() {
        let needDoList = [];
        if (this.props.WaitList && this.props.WaitList.length) {
            needDoList = this.props.WaitList;
            for (let i = 0; i < needDoList.length; i++) {
                needDoList[i].UserName = needDoList[i].RealName || needDoList[i].CallName || needDoList[i].NickName;
            }
        }
        return (
            <div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <WrappedAdvancedSearchForm chooseAll={this.props.chooseAll} chooseTypes={this.props.chooseTypes}
                                                   QueryParams={this.props.QueryParams}/>
                        <div className="fc-line"></div>
                        <EditableTable contentList={this.props.WaitList} QueryParams={this.props.QueryParams}
                                       RecordCount={this.props.RecordCount}></EditableTable>
                    </Card>
                </div>

            </div>
        );
    }
}


export default NeedDoDetails;
