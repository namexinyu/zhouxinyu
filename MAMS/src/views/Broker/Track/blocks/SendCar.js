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
import getSendCarData from 'ACTION/Broker/TodayEstimateSign/SendCar';
import getHubList from "ACTION/Broker/HubListInfo/HubListInfo";
import resetUserInforList from "ACTION/Broker/xddResetList";
import { browserHistory } from 'react-router';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import setParams from 'ACTION/setParams';

const STATE_NAME = 'state_today_track_send_car';
import stateObjs from "VIEW/StateObjects";
import fac from 'COMPONENT/FUCTIONS';
import getPickupLocationList from 'ACTION/Broker/MemberDetail/getPickupLocationList';
const { chooseType } = fac;
const FormItem = Form.Item;
const { Option } = Select;
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
                        let lobj1 = { Key: "DispatchStartDate", Value: obj[key].value[0].format('YYYY-MM-DD') };
                        let lobj2 = { Key: "DispatchStopDate", Value: obj[key].value[1].format('YYYY-MM-DD') };
                        returnObj.push(lobj1, lobj2);
                    } else {
                        continue;
                    }

                } else if (key === "PreTime") {
                    continue;
                } else if (key === "PickupStatus" && obj[key].value.length === chooseTypes.length * 2 - 1) {
                    continue;
                } else if (obj[key] && obj[key].value) {
                    let lobj = { Key: key, Value: obj[key].value };
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


        this.chooseType = this.chooseType.bind(this);
    }

    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let Parms = { ...this.props.QueryParamsCar };
            for (let key in values) {
                if (key === "PickupStartAddr") {
                    Parms.PickupStartAddr.value = values.PickupStartAddr ? values.PickupStartAddr.text : null;
                    continue;
                }
                if (key === "Time" || key === "PickupStatus") {
                    Parms["Time"] = { value: values.Time || [null, null] };
                    Parms["PickupStatus"] = { value: this.props.QueryParamsCar.PickupStatus.value || "" };
                } else {
                    Parms[key] = {};
                    Parms[key].value = values[key] || "";
                }

            }
            Parms.RecordIndex = 0;
            Parms.RecordSize = 20;
            setParams(STATE_NAME, {
                QueryParamsCar: Object.assign({}, this.props.QueryParamsCar, {
                    RecordIndex: Parms.RecordIndex,
                    RecordSize: Parms.RecordSize
                })
            });
            getSendCarData(filterObject(Parms));
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
        resetUserInforList(STATE_NAME);
    };

    chooseType(e) {
        let ChooseArr = [...this.props.chooseTypes];
        let TypeArr = this.props.QueryParamsCar.PickupStatus.value;
        let date = chooseType(e, ChooseArr, TypeArr, setParams, STATE_NAME, this.props.chooseAll);
        TypeArr = date.TypeArr.join();
        setParams(STATE_NAME, { QueryParamsCar: Object.assign({}, this.props.QueryParamsCar, { PickupStatus: { value: TypeArr } }) });
    }
    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="会员姓名">
                            {getFieldDecorator('UserName')(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="手机号码">
                            {getFieldDecorator('UserMobile')(
                                <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="派单类型">
                            {getFieldDecorator('PickupMode')(
                                <Select size="default" placeholder="请选择">
                                    <Option value="">全部</Option>
                                    <Option value="1">我打派车</Option>
                                    <Option value="2">代派滴滴</Option>
                                    <Option value="3">会员打车</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <FormItem label="去哪儿接" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                            {getFieldDecorator('PickupStartAddr')(<AutoCompleteSelect enableEntryValue={true} allowClear={true} optionsData={{
                                valueKey: 'LocationID',
                                textKey: ['LocationName'],
                                dataArray: [{ LocationID: 9999, LocationName: '需要问路' }].concat(this.props.pickupLocationList)
                            }} />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="往哪儿送">
                            {getFieldDecorator('PickupTargetAddrID')(
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
                        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="派车日期">
                            {getFieldDecorator('Time', { initialValue: this.props.searchArr ? [moment(getTime(0), 'YYYY/MM/DD'), moment(getTime(0), 'YYYY/MM/DD')] : "" })(
                                <RangePicker
                                    ranges={{ "今天": [moment(), moment()], "本月": [moment(), moment().endOf('month')] }}
                                    format="YYYY/MM/DD"
                                    style={{ width: "100%" }}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={16}>
                        <label style={{ width: "15%", textAlign: "right", display: "inline-block" }}>派车单状态：</label>
                        <span><Checkbox type="checkbox" onChange={this.chooseType} value="" checked={!this.props.chooseAll}></Checkbox> 全选</span>&emsp;
                        {this.props.chooseTypes.map((item, index) => {
                            return (
                                <span style={{ marginRight: "10px" }} key={index}><Checkbox checked={item.chooseType} onChange={this.chooseType} value={index + 1}></Checkbox> {item.name}</span>
                            );
                        })}
                    </Col>
                    <Col span={8} style={{ textAlign: 'right', paddingRight: "10px", marginBottom: "20px" }}>

                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
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
        return getFormProps(props.QueryParamsCar);
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, { QueryParamsCar: Object.assign({}, props.QueryParamsCar, fields) });
    }
})(AdvancedSearchForm);

class SendCar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            current: Math.floor(this.props.QueryParamsCar.RecordIndex / this.props.QueryParamsCar.RecordSize) + 1
        };
        this.handleTabTable = this.handleTabTable.bind(this);
        this.handleClickUser = this.handleClickUser.bind(this);
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            // 获取会员列表
            getHubList();
            getRecruitNameList();
            getPickupLocationList();
            OrderParams = this.props.OrderParams;
            chooseTypes = this.props.chooseTypes;
            let QueryParamsCar = Object.assign({}, this.props.QueryParamsCar);
            if (window.location.search) {
                this.searchArr = window.location.search.slice(1).split("=");
                if (this.searchArr[0] == "from" && this.searchArr[1] == "board") {
                    QueryParamsCar.Time = { value: [moment(), moment()] };
                    setParams(STATE_NAME, { QueryParamsCar: Object.assign({}, QueryParamsCar) });
                }
            }
            getSendCarData(filterObject(QueryParamsCar));
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
        let QueryParamsCar = this.props.QueryParamsCar;
        QueryParamsCar.RecordSize = value.pageSize;
        QueryParamsCar.RecordIndex = value.current * QueryParamsCar.RecordSize - QueryParamsCar.RecordSize;
        if (sorter.order) {
            OrderParams.Order = (sorter.order === "descend") ? 1 : 0;
        }
        setParams(STATE_NAME, {
            QueryParamsCar: Object.assign({}, QueryParamsCar),
            OrderParams: Object.assign({}, OrderParams)
        });
        getSendCarData(filterObject(QueryParamsCar));
    }

    render() {
        let estimateSignList = [];
        let RecordCount = this.props.RecordCount;
        let hubList = (this.props.hub_list.HubList.Data && this.props.hub_list.HubList.Data.HubList) ? this.props.hub_list.HubList.Data.HubList : [];
        if (RecordCount) {
            estimateSignList = this.props.UserInforList;
            for (let i = 0; i < estimateSignList.length; i++) {
                for (let j = 0; j < estimateSignList[i].UserNameList.length; j++) {
                    if (estimateSignList[i].UserNameList[j].Type == 1 && estimateSignList[i].UserNameList[j].UserName) {
                        estimateSignList[i].UserName = estimateSignList[i].UserNameList[j].UserName;
                        break;
                    } else if (estimateSignList[i].UserNameList[j].Type == 2 && estimateSignList[i].UserNameList[j].UserName) {
                        estimateSignList[i].UserName = estimateSignList[i].UserNameList[j].UserName;
                        break;
                    } else {
                        estimateSignList[i].UserName = estimateSignList[i].UserNameList[j].UserName;
                    }
                }
            }
        }
        return (
            <div>
                <div className='ivy-page-title'>
                    <div className="ivy-title">
                        <h1>派车单跟踪</h1>
                    </div>
                </div>

                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <WrappedAdvancedSearchForm searchArr={this.searchArr}

                            chooseAll={this.props.chooseAll}
                            chooseTypes={this.props.chooseTypes} pickupLocationList={this.props.pickupLocationList}
                            recruitList={this.props.recruitList.recruitNameList}
                            hubList={hubList} QueryParamsCar={this.props.QueryParamsCar} />
                        <Table
                            rowKey={'key'}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.QueryParamsCar.RecordSize,
                                current: this.props.QueryParamsCar.RecordIndex ? this.state.current : 1,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                pageSizeOptions: ["20", "40", "60", "80", "120"],
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            bordered dataSource={estimateSignList || []}
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
        title: '会员姓名', dataIndex: 'UserName',
        render: (text, record) => {
            const { UserName } = record;
            return (
                <div>
                    {<a href="javascript:;" onClick={() => { handleClickUser(record); }}>{UserName}</a>}
                </div>
            );
        }
    }, {
        title: '手机号码', dataIndex: 'UserMobile',
        render: (text, record) => {
            let mobile = record.UserMobile;
            return (mobile && mobile.length === 11 ? mobile.substr(0, 3) + '****' + mobile.substr(7, 4) : '-');
        }
    }, {
        title: '去哪儿接', dataIndex: 'PickupStartAddr'
    }, {
        title: '往哪儿送', dataIndex: 'PickupTargetAddr'
    }, {
        title: '派单类型', dataIndex: 'PickupMode', types: "status"
    }, {
        title: '派单状态', dataIndex: 'PickupStatus', types: "status",
        render: (text, record) => {
            const { PickupStatus, ContactStatus } = record;

            return (
                <div>
                    {PickupStatus === 4 ? stateObjs.PickupStatus[PickupStatus] + "(" + stateObjs.ContactStatus[ContactStatus] + ")" : stateObjs.PickupStatus[PickupStatus]}
                </div>
            );
        }
    }, {
        title: '派车日期', dataIndex: 'DispatchTime', sorter: true, sortOrder: Order === 1 ? "descend" : "ascend"
    }].map((item) => {
        if (!item.render) {
            item.render = (text, record) => {
                let dataName = record[item.dataIndex];
                return (
                    <div>
                        {item.types ? stateObjs[item.dataIndex][dataName] : dataName}
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

export default SendCar;
