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
import getTodaySign from "ACTION/Broker/TodaySign/Sign";
import getHubList from "ACTION/Broker/HubListInfo/HubListInfo";
import resetUserInforList from "ACTION/Broker/xddResetList";
import {browserHistory} from 'react-router';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import getAllRecruitData from 'ACTION/Broker/GetAllRecruitListIncludeForbid';
// import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import setParams from 'ACTION/setParams';
import fac from 'COMPONENT/FUCTIONS';
const {chooseType} = fac;
import resetState from 'ACTION/resetState';
// import Status from "VIEW/Status";
const STATE_NAME = 'state_today_sign';
import stateObjs from "VIEW/StateObjects";
const {
    GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;
const FormItem = Form.Item;
const {Option} = Select;
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;
moment.locale('zh-cn');
let chooseTypes = [];
let OrderParams = {};

function filterObject(obj) {
    let wrapObj = {};
    if (isArray(obj) === "Object") {
        var returnObj = [];
        for (let key in obj) {
            if (isArray(obj[key]) === "Object") {
                if (key === "Time") {
                    if (obj[key].value[0] && obj[key].value[1]) {
                        let lobj1 = {Key: "StartDate", Value: obj[key].value[0].format('YYYY-MM-DD')};
                        let lobj2 = {Key: "StopDate", Value: obj[key].value[1].format('YYYY-MM-DD')};
                        returnObj.push(lobj1, lobj2);
                    } else {
                        continue;
                    }

                } else if (key === "CheckinCloseStatus" && obj[key].value.length === chooseTypes.length * 2 - 1) {
                    continue;
                } else if(key === "CheckinRecruitID") {
                    if(!obj["CheckinRecruitID"].value.value) {
                        continue;
                    }
                    returnObj.push({Key: "CheckinRecruitID", Value: obj["CheckinRecruitID"].value.value});
                } else if (obj[key] && obj[key].value) {
                    let lobj = {Key: key, Value: obj[key].value};
                    returnObj.push(lobj);
                }
            } else if (key === "RecordIndex" || key === "RecordSize") {
                wrapObj[key] = obj[key];
            }
        }
        wrapObj.QueryParams = returnObj;
        wrapObj.OrderParams = OrderParams;
        return (wrapObj);
    }
    return obj;
}

function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}

class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);


        // this.onChange = this.onChange.bind(this);
        this.chooseType = this.chooseType.bind(this);
    }

    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let Parms = {...this.props.QueryParams};
            for (let key in values) {
                if (key === "CheckinRecruitID") {
                    Parms.CheckinRecruitID = {value: {...values.CheckinRecruitID}};
                    continue;
                }
                if (key === "Time" || key === "CheckinCloseStatus") {
                    Parms["Time"] = {value: values.Time || [null, null]};
                    Parms["CheckinCloseStatus"] = {value: this.props.QueryParams.CheckinCloseStatus.value || ""};
                } else {
                    Parms[key] = {};
                    Parms[key].value = values[key] || "";
                }

            }
            Parms.RecordIndex = 0;
            Parms.RecordSize = 20;
            setParams(STATE_NAME, {
                QueryParams: Object.assign({}, this.props.QueryParams, {
                    RecordIndex: Parms.RecordIndex,
                    RecordSize: Parms.RecordSize
                })
            });
            getTodaySign(filterObject(Parms));
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
        resetUserInforList(STATE_NAME);
    };

    chooseType(e) {
        let ChooseArr = [...this.props.chooseTypes];
        let TypeArr = this.props.QueryParams.CheckinCloseStatus.value;
        let date = chooseType(e, ChooseArr, TypeArr, setParams, STATE_NAME, this.props.chooseAll);
        TypeArr = date.TypeArr.join();
        setParams(STATE_NAME, { QueryParams: Object.assign({}, this.props.QueryParams, {CheckinCloseStatus: {value: TypeArr}})});
    }

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="会员姓名">
                            {getFieldDecorator('UserName')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="会员电话">
                            {getFieldDecorator('UserMobile')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="签到企业">
                            {getFieldDecorator('CheckinRecruitID')(
                                <AutoCompleteSelect
                                    allowClear={true}
                                    optionsData={{
                                        valueKey: "RecruitTmpID",
                                        textKey: "RecruitName",
                                        dataArray: this.props.recruitList || []
                                    }}

                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="签到地址">
                            {getFieldDecorator('CheckinHubID')(
                                <Select size="default" placeholder="请选择">
                                    <Option value="">请选择</Option>
                                    {
                                        (this.props.hubList || []).map((item, index) => {
                                            return (
                                                <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="签到日期">
                            {getFieldDecorator('Time', {initialValue: this.props.searchArr ? [moment(getTime(0), 'YYYY/MM/DD'), moment(getTime(0), 'YYYY/MM/DD')] : ""})(
                                <RangePicker
                                    disabledDate={disabledDate}
                                    ranges={{"今天": [moment(), moment()], "本月": [moment(), moment().endOf('month')]}}
                                    format="YYYY/MM/DD"
                                    style={{width: "100%"}}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16}>
                        <label style={{width: "12.7%", textAlign: "right", display: "inline-block"}}>签到状态：</label>
                        <span><Checkbox type="checkbox" onChange={this.chooseType} value=""
                                        checked={!this.props.chooseAll}/> 全选</span>&emsp;
                        {this.props.chooseTypes.map((item, index) => {
                            return (
                                <span style={{marginRight: "10px"}} key={index}><Checkbox checked={item.chooseType}
                                                                                          onChange={this.chooseType}
                                                                                          value={index + 1}/> {item.name}</span>
                            );
                        })}
                    </Col>
                    <Col span={8} style={{textAlign: 'right', paddingRight: "10px", marginBottom: "20px"}}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                            重置
                        </Button>
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

const getFormProps = (props) => {
    let result = {};
    for (let key in props) {
        if (isArray(props[key]) === "Object") {
            result[key] = props[key];
        }
    }
    return result;
};

const WrappedAdvancedSearchForm = Form.create({
    mapPropsToFields(props) {
        return getFormProps(props.QueryParams);
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {QueryParams: Object.assign({}, props.QueryParams, fields)});
    }
})(AdvancedSearchForm);

class SignListDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            current: Math.floor(this.props.QueryParams.RecordIndex / this.props.QueryParams.RecordSize) + 1
        };
        this.handleTabTable = this.handleTabTable.bind(this);
        this.handleClickUser = this.handleClickUser.bind(this);
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            // 获取会员列表
            getHubList();
            getAllRecruitData();
            GetMAMSRecruitFilterList();
            OrderParams = this.props.OrderParams;
            chooseTypes = this.props.chooseTypes;
            let QueryParams = Object.assign({}, this.props.QueryParams);
            if (window.location.search) {
                this.searchArr = window.location.search.slice(1).split("=");
                if (this.searchArr[0] === "from" && this.searchArr[1] === "board" && !QueryParams.IsSign) {
                    QueryParams.Time = {value: [moment(), moment()]};
                    setParams(STATE_NAME, {QueryParams: Object.assign({}, QueryParams)});
                }
            }
            getTodaySign(filterObject(QueryParams));
        }


    }

    handleClickUser(record) {
        if (record.UserID) {
            browserHistory.push({
                pathname: '/broker/member/detail/' + record.UserID,
                query: {
                    memberName: record.UserName
                }
            });
        }
    }

    handleTabTable(value, filter, sorter) {
        this.setState({
            current: value.current
        });
        let QueryParams = this.props.QueryParams;
        QueryParams.RecordSize = value.pageSize;
        QueryParams.RecordIndex = value.current * QueryParams.RecordSize - QueryParams.RecordSize;
        if (sorter.order) {
            OrderParams.Order = (sorter.order == "descend") ? 1 : 0;
        }
        setParams(STATE_NAME, {
            QueryParams: Object.assign({}, QueryParams),
            OrderParams: OrderParams
        });
        getTodaySign(filterObject(QueryParams));
    }

    render() {
        let hubList = (this.props.hub_list.HubList.Data && this.props.hub_list.HubList.Data.HubList) ? this.props.hub_list.HubList.Data.HubList : [];
        return (
            <div>
                <div className='ivy-page-title'>
                    <div className="ivy-title">
                        <h1>签到名单</h1>
                    </div>
                </div>

                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <WrappedAdvancedSearchForm searchArr={this.searchArr}
                                                   chooseAll={this.props.chooseAll}
                                                   chooseTypes={this.props.chooseTypes}
                                                   recruitList={this.props.AllRecruitListData.RecordList}
                                                   hubList={hubList}
                                                   QueryParams={this.props.QueryParams}/>
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
                            bordered dataSource={this.props.UserInforList || []}
                            columns={CreateColumns(this.props.OrderParams.Order, this.handleClickUser)}
                            onChange={this.handleTabTable}
                            loading={this.props.RecordListLoading}
                        />
                    </Card>
                </div>

            </div>
        );
    }
}

function CreateColumns(Order, handleClickUser) {
    return ([{
        title: '会员姓名', dataIndex: 'UserName', width: '20%',
        render: (text, record) => {
            const {UserName} = record;
            return (
                <div>
                    {
                        <a href="javascript:;" onClick={()=>{handleClickUser(record);}}>{UserName}</a>
                    }
                </div>
            );
        }
    }, {
        title: '签到企业', dataIndex: 'CheckinRecruitName', width: '20%'
    }, {
        title: '签到地址', dataIndex: 'CheckinHubName', width: '20%'
    }, {
        title: '签到状态', dataIndex: 'CheckinCloseStatus', width: '20%',
        render: (text, record) => {
            const {CheckinCloseStatus} = record;
            return (
                <div>
                    {stateObjs.CheckinCloseStatus[CheckinCloseStatus]}
                </div>
            );
        }
    }, {
        title: '签到时间',
        dataIndex: 'CheckinTime',
        width: '20%',
        sorter: true,
        sortOrder: Order === 1 ? "descend" : "ascend",
        render: (text, record) => {
            const {CheckinTime} = record;
            return (
                <div>
                    {new Date(CheckinTime).Format('yyyy-MM-dd hh:mm')}
                </div>
            );
        }
    }].map((item) => {
        if (!item.render) {
            item.render = (text, record) => {
                let dataName = record[item.dataIndex];
                return (
                    <div>
                        {dataName}
                    </div>
                );
            };
        }
        return item;
    }));
}

function getTime(time) {
    let nowdate = new Date();
    nowdate.setDate(nowdate.getDate() + time);
    return nowdate.getFullYear() + "-" + changeNumStyle(+nowdate.getMonth() + 1) + "-" + changeNumStyle(nowdate.getDate());

}

function changeNumStyle(num) {
    return num <= 9 ? '0' + num : num;
}

function disabledDate(current) { // TODO这里有个权限限制
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
}

export default SignListDetails;
