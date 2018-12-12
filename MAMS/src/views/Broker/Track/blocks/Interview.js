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
    Radio,
    Alert,
    Checkbox
} from 'antd';
import getTodayInterview from "ACTION/Broker/TodayInterview/Interview";
import resetUserInforList from "ACTION/Broker/xddResetList";
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import {browserHistory} from 'react-router';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import setParams from 'ACTION/setParams';
import AssistanceNewModal from 'VIEW/Broker/Assistance/blocks/AssistanceNewModal';
import setBrokerInterviewStatus from 'ACTION/Broker/TodayInterview/SetBrokerInterviewStatus';
import getAllRecruitData from 'ACTION/Broker/GetAllRecruitListIncludeForbid';
import setFetchStatus from 'ACTION/setFetchStatus';
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import getTodayTrackData from 'ACTION/Broker/WorkBoard/getTodayTrack';
import {DataTransfer, paramTransfer} from 'UTIL/base/CommonUtils';
import InterviewCountdownModal from './InterviewCountdownModal';
import {RegexRule, Constant} from 'UTIL/constant/index';
import resetState from 'ACTION/resetState';
// import Status from "VIEW/Status";
const STATE_NAME = 'state_today_Interview';
const STATE_NAME2 = 'state_broker_interview_status';
import stateObjs from "VIEW/StateObjects";

const FormItem = Form.Item;
const {Option} = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
import moment from 'moment';
import Recruit from "../../Recruit/blocks/Recruit";

const {
    GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;
const RangePicker = DatePicker.RangePicker;
moment.locale('zh-cn');
let OrderParams = {};

function filterObject(obj) {
    let wrapObj = {};
    if (isArray(obj) === "Object") {
        var returnObj = [];
        for (let key in obj) {
            if (isArray(obj[key]) === "Object") {
                if (key === "Time") {
                    if (obj[key].value[0] && obj[key].value[1]) {
                        let StartDate = {Key: "CheckinDateStart", Value: obj[key].value[0].format('YYYY-MM-DD')};
                        let StopDate = {Key: "CheckinDateEnd", Value: obj[key].value[1].format('YYYY-MM-DD')};
                        returnObj.push(StartDate, StopDate);
                    }
                } else if (key === "CheckinRecruitID") {
                    if (!obj["CheckinRecruitID"].value.value) {
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

    }

    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            // console.log(values);
            let Parms = {...this.props.QueryParams};
            for (let key in values) {
                if (key === "CheckinRecruitID") {
                    Parms.CheckinRecruitID = {value: {...values.CheckinRecruitID}};
                    continue;
                }
                if (key === "Time") {
                    Parms["Time"] = {value: values.Time || [null, null]};
                } else {
                    Parms[key] = {};
                    Parms[key].value = values[key] || "";
                }

            }
            Parms.RecordIndex = 0;
            Parms.RecordSize = 40;
            setParams(STATE_NAME, {
                QueryParams: Object.assign({}, this.props.QueryParams, {
                    RecordIndex: Parms.RecordIndex,
                    RecordSize: Parms.RecordSize
                })
            });
            getTodayInterview(filterObject({
                ...Parms,
                ZxxType: {
                    value: Parms.ZxxType.value && !!Parms.ZxxType.value.length ? Parms.ZxxType.value[0] : ''
                }
            }));
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
        resetUserInforList(STATE_NAME);
    };

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
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="手机号码">
                            {getFieldDecorator('UserMobile')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="面试企业">
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
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="经纪人处理">
                            {getFieldDecorator('BrokerInterviewStatus')(
                                <Select size="default" placeholder="请选择">
                                    <Option value="">请选择</Option>
                                    <Option value="0">未处理</Option>
                                    <Option value="2">面试通过</Option>
                                    <Option value="3">面试不通过</Option>
                                    <Option value="4">面试放弃</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="业务处理">
                            {getFieldDecorator('JFFInterviewStatus')(
                                <Select
                                    placeholder="请选择"
                                    size="default"
                                >
                                    <Option value="">请选择</Option>
                                    <Option value="0">未处理</Option>
                                    <Option value="1">未面试</Option>
                                    <Option value="2">面试通过</Option>
                                    <Option value="3">面试不通过</Option>
                                    <Option value="4">放弃面试</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="客服回访">
                            {getFieldDecorator('InterviewStatus')(
                                <Select size="default" placeholder="请选择">
                                    <Option value="">请选择</Option>
                                    <Option value="0">未处理</Option>
                                    <Option value="1">待确认</Option>
                                    <Option value="2">正常入职</Option>
                                    <Option value="3">不通过</Option>
                                    <Option value="4">放弃</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    {/*
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="倒计时">
                            {getFieldDecorator('CountdownStatus')(
                                <Select size="default" placeholder="请选择">
                                    <Option value="">请选择</Option>
                                    <Option value="0">未开启</Option>
                                    <Option value="1">进行中</Option>
                                    <Option value="2">已结束</Option>
                                    <Option value="3">未进行</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="工牌状态">
                            {getFieldDecorator('WorkCardStatus')(
                                <Select
                                    placeholder="请选择"
                                    size="default"
                                >
                                    <Option value="">请选择</Option>
                                    <Option value="1">审核中</Option>
                                    <Option value="2">审核通过</Option>
                                    <Option value="3">审核失败</Option>
                                    <Option value="4">未上传</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    */}
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="签到时间">
                            {getFieldDecorator('Time')(
                                <RangePicker
                                    disabledDate={disabledDate}
                                    ranges={{"今天": [moment(), moment()], "本月": [moment(), moment().endOf('month')]}}
                                    format="YYYY/MM/DD"
                                    style={{width: "100%"}}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem wrapperCol={{span: 22, offset: 2}}>
                            {getFieldDecorator('ZxxType')(
                               <CheckboxGroup>
                                <Checkbox value="ZXX">周薪薪</Checkbox>
                               </CheckboxGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} style={{textAlign: 'right', paddingRight: "10px", marginBottom: "20px"}}>

                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
                {/*
                <Row>
                    <Col span={8} offset={8} style={{textAlign: 'right', paddingRight: "10px", marginBottom: "20px"}}>

                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
                */}
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


class InterviewDetails extends React.PureComponent {
    constructor(props) {
        super(props);


        this.state = {
            current: Math.floor(this.props.QueryParams.RecordIndex / this.props.QueryParams.RecordSize) + 1,
            currentRecord: {},
            countdownRecord: undefined
        };
        this.handleTabTable = this.handleTabTable.bind(this);
        this.handleClickUser = this.handleClickUser.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            OrderParams = this.props.OrderParams;
            getTodayInterview(filterObject({
                ...this.props.QueryParams,
                ZxxType: {
                    value: this.props.QueryParams.ZxxType.value && !!this.props.QueryParams.ZxxType.value.length ? this.props.QueryParams.ZxxType.value[0] : ''
                }
            }));
            GetMAMSRecruitFilterList();
            getRecruitNameList();
            getAllRecruitData();
            getTodayTrackData();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.setBrokerInterviewStatusFetch.status === "success") {
            setFetchStatus(STATE_NAME2, 'setBrokerInterviewStatusFetch', 'close');
            getTodayInterview(filterObject({
                ...this.props.QueryParams,
                ZxxType: {
                    value: this.props.QueryParams.ZxxType.value && !!this.props.QueryParams.ZxxType.value.length ? this.props.QueryParams.ZxxType.value[0] : ''
                }
            }));
        }
    }

    handleRightClick(record, index, e) {
        if (e) e.preventDefault();
        let targetPlatformCode;
        let showPickDepartmentModal = true;
        let TargetDepartmentList = Object.keys(mams)
            .filter((key) => mams[key].acceptAssistance && key != CurrentPlatformCode)
            .map((key) => ({DepartID: key, DepartName: mams[key].department}));
        Modal.confirm({
            title: '选择部门发号施令',
            visible: true,
            content: (<div className="mt-16">
                <RadioGroup
                    onChange={(e) => {
                        targetPlatformCode = e.target.value;
                    }}>
                    {TargetDepartmentList.map((item, index) => {
                        return (<Radio key={index} value={item.DepartID}>{item.DepartName}</Radio>);
                    })}
                </RadioGroup></div>),
            onOk: () => {
                if (!targetPlatformCode) {
                    return false;
                }
                let user = {
                    UserID: record.UserID,
                    UserName: record.UserName,
                    Mobile: record.UserMobile
                };
                let param = {
                    Recruit: {value: {value: record.CheckinRecruitID, text: record.CheckinRecruitName}},
                    CheckinDate: {
                        value: record.CheckinTime && moment(record.CheckinTime).isValid() ?
                            moment(record.CheckinTime) : undefined
                    },
                    Mobile: {value: record.UserMobile},
                    Content: {value: ''},
                    TargetDepartID: {value: targetPlatformCode + ''}
                };
                setParams(this.props.asNew.state_name, {showModal: true, User: user, Data: param});
                showPickDepartmentModal = false;
            }
        });
        console.log('handleRightClick', record, index);
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
            OrderParams[0].Order = (sorter.order == "descend") ? 1 : 0;
        }
        setParams(STATE_NAME, {
            QueryParams: Object.assign({}, QueryParams),
            OrderParams: OrderParams
        });
        getTodayInterview(filterObject({
            ...QueryParams,
            ZxxType: {
                value: QueryParams.ZxxType.value && !!QueryParams.ZxxType.value.length ? QueryParams.ZxxType.value[0] : ''
            }
        }));
    }

    changeState = (value) => {
        setBrokerInterviewStatus({
            BrokerInterviewStatus: Number(value),
            UserOrderStatusID: this.state.currentRecord.UserOrderStatusID
        });
    };
    getRecord = (text, record) => {
        this.setState({
            currentRecord: Object.assign({}, record)
        });
    };

    openCountdownModal = (record) => {
        this.setState({countdownRecord: Object.assign({}, record)});
    };

    render() {
        return (
            <div>
                <div className='ivy-page-title'>
                    <div className="ivy-title">
                        <h1>面试名单</h1>
                    </div>
                </div>

                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <WrappedAdvancedSearchForm chooseAll={this.props.chooseAll}
                                                   recruitList={this.props.AllRecruitListData.RecordList}
                                                   QueryParams={this.props.QueryParams}/>
                        <Alert message={<div><span>今日签到数:</span> {this.props.labelData.todayTrack.TodayCheckInBaseCount}<span
                            style={{marginLeft: "20px"}}>今日面试数:</span>
                            <span>{this.props.labelData.todayTrack.TodayInterviewBase}</span></div>} type="info"
                               style={{margin: "10px 0"}} showIcon/>

                        <Table
                            rowKey={'key'}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.QueryParams.RecordSize,
                                current: this.props.QueryParams.RecordIndex ? this.state.current : 1,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                pageSizeOptions: Constant.pageSizeOptions,
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            bordered dataSource={this.props.RecordList || []}
                            columns={CreateColumns(this.props.OrderParams[0].Order, this.changeState, this.getRecord, this.handleClickUser, this.openCountdownModal)}
                            onChange={this.handleTabTable}
                            loading={this.props.RecordListLoading}
                        />
                    </Card>
                </div>
                {this.props.asNew.showModal ? <AssistanceNewModal asNew={this.props.asNew}
                                                                  recruitNameList={this.props.recruitNameList}/> : ''}
                {this.state.countdownRecord ?
                    <InterviewCountdownModal record={this.state.countdownRecord}
                                             onModalClose={() => this.setState({countdownRecord: undefined})}/> : ''}
            </div>
        );
    }
}

function CreateColumns(Order, changeState, getRecord, handleClickUser, openCountdownModal) {
    return ([
        {
            title: '序号', key: 'seqNo', width: 42,
            render: (text, record, index) => index + 1
        },
        {
            title: '会员姓名', dataIndex: 'UserName',
            render: (text, record) => {
                const {UserName} = record;
                return (
                    <div>
                        {
                            <a href="javascript:;" onClick={() => {
                                handleClickUser(record);
                            }}>{UserName}</a>
                        }
                    </div>
                );
            }
        },
        {
            title: '手机号码', dataIndex: 'UserMobile',
            render: (text, record) => {
                return DataTransfer.phone(record.UserMobile);
            }
        },
        {
            title: '企业', dataIndex: 'CheckinRecruitName'
        },
        {
            title: '经纪人处理', dataIndex: 'BrokerInterviewStatus',
            render: (text, record) => {
                const {BrokerInterviewStatus} = record;
                return (
                    <div>
                        {
                            <Select
                                value={stateObjs.BrokerInterviewStatus[BrokerInterviewStatus]}
                                style={{width: 100}}
                                className={record.BrokerInterviewStatus === 0 ? 'color-danger border-danger' : ''}
                                size="large"
                                onFocus={() => {
                                    getRecord(text, record);
                                }}
                                onChange={changeState}>
                                <Option value="0">未处理</Option>
                                <Option value="2">通过</Option>
                                <Option value="3">不通过</Option>
                                <Option value="4">放弃</Option>
                            </Select>
                        }
                    </div>
                );
            }
        },
        {
            title: '面试状态', dataIndex: 'JFFInterviewStatus', types: "status"
        },
        {
            title: '状态说明', dataIndex: 'InterviewComment'
        },
        {
            title: '客服回访', dataIndex: 'InterviewStatus', types: "status"
        },
        {
            title: '回访记录', dataIndex: 'ServiceRemark'
        },
        // {
        //     title: '倒计时', dataIndex: 'CountdownStatus', types: "status"
        // },
        {
            title: '补贴信息', dataIndex: 'CountdownStatus',
            render: (text, record) => {
                return (<a onClick={() => openCountdownModal(record)}>查看</a>);
            }
        },
        {
            title: '补贴类型', dataIndex: 'SubsidyType',
            render: (text, record) => {
                const SubsidyTypeMap = {
                    1: '在职日',
                    2: '工作日'
                };
                return (
                    <span style={{color: text === 2 ? 'red' : 'inherit'}}>{SubsidyTypeMap[text] || ''}</span>
                );
            }
        },
        {
            title: '工牌', dataIndex: 'WorkCardStatus', types: "status"
        },
        {
            title: '签到时间', dataIndex: 'CheckinTime', sorter: true, sortOrder: Order === 1 ? "descend" : "ascend",
            render: (text, record) => {
                const {CheckinTime} = record;
                return (
                    <div>
                        {new Date(CheckinTime).Format('yyyy-MM-dd hh:mm')}
                    </div>
                );
            }
        },
        {
            title: '面试时间', dataIndex: 'LaborCheckinTime',
            render: (text, record) => {
                const {LaborCheckinTime} = record;
                return (
                    <div>
                        {new Date(LaborCheckinTime).Format('yyyy-MM-dd hh:mm')}
                    </div>
                );
            }
        }].map((item) => {
        if (!item.render) {
            item.render = (text, record) => {
                let dataName = record[item.dataIndex];
                if ((item.dataIndex === "JFFInterviewStatus" || item.dataIndex === "InterviewStatus") && dataName === 2) {
                    return (
                        <div style={{color: "green"}}>
                            {stateObjs[item.dataIndex][dataName]}
                        </div>
                    );
                }
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

function disabledDate(current) { // TODO这里有个权限限制
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
}

export default InterviewDetails;
