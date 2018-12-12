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
    Checkbox,
    message
} from 'antd';

const {TextArea} = Input;
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import getRecruitBasicData from 'ACTION/Broker/BagList/RecruitBasic';
import getAllRecruitData from 'ACTION/Broker/GetAllRecruitListIncludeForbid';
import UpdateUserRecruitBasic from 'ACTION/Broker/BagList/UpdateUserRecruitBasic';
import createDispatchOrder from 'ACTION/Broker/MemberDetail/createDispatchOrder';
import setPrePickSetting from 'ACTION/Broker/BagList/PrePickSetting';
import helpMemberApply from 'ACTION/Broker/MemberDetail/helpMemberApply';
import {browserHistory} from 'react-router';
import getBagListData from 'ACTION/Broker/BagList';
import getHubList from "ACTION/Broker/HubListInfo/HubListInfo";
import setFetchStatus from 'ACTION/setFetchStatus';
import stateObjs from "VIEW/StateObjects";
import setParams from 'ACTION/setParams';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import getPickupLocationList from 'ACTION/Broker/MemberDetail/getPickupLocationList';
import PocketAction from 'ACTION/Broker/Pocket';
import MemberDetailService from "SERVICE/Broker/MemberDetailService";
import {DataTransfer, paramTransfer} from 'UTIL/base/CommonUtils';
import {Constant} from 'UTIL/constant/index';
import { trackStatusMap } from 'UTIL/constant/constant';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

const brokerId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginId');

const {
    getLatestPocketCase,
    updatePocketCase,
    setEstimatePick,
    setPocketCase
} = PocketAction;

const {
    GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;
const STATE_NAME = 'state_broker_bag_list';
const STATE_NAME2 = "state_broker_member_detail_process";
const FormItem = Form.Item;
const {Option} = Select;
import moment from 'moment';
import BrokerService from "../../../../services/Broker/BrokerService";

moment.locale('zh-cn');
const RangePicker = DatePicker.RangePicker;
message.config({
    top: "50%",
    duration: 2,
    marginTop: "-17px"
});

// 查数据类型函数
function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}

// 参数筛选函数
function filterObject(obj, value) {
    if (isArray(obj) === "Object") {
        var returnObj = {};
        for (let key in obj) {
            if (isArray(obj[key]) === "Object") { //  && obj[key] && obj[key].value
                if (key === "Time" && !obj["StartExpectedDays"]) {
                    if (value === 0 || value) {
                        if (value === "2013-01-01") {
                            returnObj.StartExpectedDays = "";
                            returnObj.EndExpectedDays = getTime(-1);
                        } else {
                            returnObj.StartExpectedDays = getTime(value);
                            returnObj.EndExpectedDays = getTime(value);
                        }
                    } else {
                        if (obj[key].value && obj[key].value[0]) {
                            returnObj.StartExpectedDays = obj[key].value[0].format('YYYY-MM-DD');
                            returnObj.EndExpectedDays = obj[key].value[1].format('YYYY-MM-DD');
                        } else {
                            returnObj.StartExpectedDays = '';
                            returnObj.EndExpectedDays = '';
                        }
                    }
                } else if (key === "CaseStatus" || key === "DayDealStatus") {
                    returnObj[key] = obj[key].value ? Number(obj[key].value) : -1;
                } else if (key === "RecruitTmpID") {
                    if (!obj["RecruitTmpID"] || !obj["RecruitTmpID"].value || !obj["RecruitTmpID"].value.value) {
                        continue;
                    }
                    returnObj[key] = Number(obj["RecruitTmpID"].value.value);
                } else {
                    returnObj[key] = obj[key].value ? obj[key].value : '';
                }
            } else if (key === "RecordStartIndex" || key === "RecordCount" || key === "SequenceWay") {
                returnObj[key] = obj[key];
            }
        }
        return (returnObj);
    }
    return obj;
}

// 搜索列表组件
class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let Parms = {...this.props.QueryParams};
            for (let key in values) {
                if (key === "RecruitTmpID") {
                    Parms.RecruitTmpID = {value: {...values.RecruitTmpID}};
                    continue;
                }
                Parms[key] = {};
                Parms[key].value = values[key] || "";
            }

            Parms.RecordStartIndex = 0;
            Parms.RecordCount = this.props.QueryParams.RecordCount || 40;

            setParams(STATE_NAME, {
                QueryParams: Object.assign({}, this.props.QueryParams, {
                    RecordStartIndex: Parms.RecordStartIndex,
                    RecordCount: Parms.RecordCount
                })
            });
            if (values.Time && values.Time[0] && values.Time[0].format('YYYY-MM-DD') === getTime(0) && values.Time[1].format('YYYY-MM-DD') === getTime(0)) {
                setParams(STATE_NAME, {
                    clickActive: 0
                });
            } else if (values.Time && values.Time[0] && values.Time[0].format('YYYY-MM-DD') === getTime(1) && values.Time[1].format('YYYY-MM-DD') === getTime(1)) {
                setParams(STATE_NAME, {
                    clickActive: 1
                });
            } else {
                setParams(STATE_NAME, {
                    clickActive: null
                });
            }

            const processedQueryData = filterObject(Parms);

            console.log('hello search', this.props.QueryParams);

            getBagListData({
              BrokerID: brokerId,
              CaseStatus: processedQueryData.CaseStatus,
              ExpectedDays: '',
              ExpectedDaysEnd: processedQueryData.EndExpectedDays,
              ExpectedDaysStart: processedQueryData.StartExpectedDays,
              MatchUserName: processedQueryData.UserName,
              PositionName: this.props.QueryParams.RecruitTmpID.value ? this.props.QueryParams.RecruitTmpID.value.text : '',
              UserMobile: processedQueryData.Mobile,
              PageInfo: {
                Count: this.props.QueryParams.RecordCount,
                Offset: 0
              }
            });
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
        setParams(STATE_NAME, {
            clickActive: null
        });
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
                            {getFieldDecorator('Mobile')(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="报名企业">
                            {getFieldDecorator('RecruitTmpID')(
                                <AutoCompleteSelect allowClear={true} optionsData={{
                                    valueKey: 'RecruitTmpID',
                                    textKey: 'RecruitName',
                                    dataArray: this.props.allRecruitList
                                }}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="追踪状态">
                            {getFieldDecorator('CaseStatus')(
                                <Select
                                    placeholder="请选择"
                                    size="default"
                                >
                                  {Object.keys(trackStatusMap).map((key) => {
                                    return (<Option value={key} key={key}>{trackStatusMap[key]}</Option>);
                                  })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="预计入职日期">
                            {getFieldDecorator('Time')(
                                <RangePicker style={{width: "100%"}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{textAlign: 'right', paddingRight: "10px"}}>
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
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

// TODO 页面主函数
class BagList extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            current: this.props.QueryParams.RecordStartIndex === 0 ? 1 : (this.props.QueryParams.RecordStartIndex / this.props.QueryParams.RecordCount) + 1
        };
        this.handleTabTable = this.handleTabTable.bind(this);
        this.filterDate = this.filterDate.bind(this);
    }

    componentWillMount() {
        GetMAMSRecruitFilterList();
        // 判断是否返回、tab页切换，如果不是则执行下面代码
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            const {
              CaseStatus,
              UserName,
              RecruitTmpID,
              Mobile,
              Time,
              RecordCount,
              RecordStartIndex
            } = this.props.QueryParams;

            getBagListData({
              BrokerID: brokerId,
              CaseStatus: CaseStatus.value != null ? +CaseStatus.value : -1,
              ExpectedDays: '',
              ExpectedDaysStart: Time.value && moment(Time.value[0]).isValid() ? moment(Time.value[0]).format('YYYY-MM-DD') : '',
              ExpectedDaysEnd: Time.value && moment(Time.value[0]).isValid() ? moment(Time.value[1]).format('YYYY-MM-DD') : '',
              MatchUserName: UserName.value || '',
              PositionName: RecruitTmpID.value ? RecruitTmpID.value.text : '',
              UserMobile: Mobile.value || '',
              PageInfo: {
                Count: RecordCount,
                offset: RecordStartIndex
              }
            });
        }

        getRecruitBasicData();
        getHubList();
        getPickupLocationList();
        getAllRecruitData();
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.faulch.helpMemberApplyFetch.status === "success") {
        //     setFetchStatus(STATE_NAME2, 'helpMemberApplyFetch', 'close');
        //     setPrePickSetting(this.props.setPick);
        // }
    }

    handleTabTable(value, filter, sorter) {
        this.setState({
            current: value.current
        });
        let soderNum = 1;
        let QueryParams = {...this.props.QueryParams};
        if (sorter && sorter.columnKey === 'ExpectedDays') {
            sorter.order === 'ascend' ? soderNum = 1 : soderNum = 2;
        } else if (sorter && sorter.columnKey === 'PickDate') {
            sorter.order === 'ascend' ? soderNum = 3 : soderNum = 4;
        } else if (sorter && sorter.columnKey === 'ModifyTime') {
            sorter.order === 'ascend' ? soderNum = 5 : soderNum = 6;
        }
        QueryParams.SequenceWay = soderNum;
        QueryParams.RecordCount = value.pageSize;
        QueryParams.RecordStartIndex = value.current * value.pageSize - value.pageSize;
        setParams(STATE_NAME, {
            QueryParams: Object.assign({}, QueryParams)
        });

        const processedQueryData = filterObject(QueryParams);
        console.log('hello pagination change', processedQueryData);

        getBagListData({
          BrokerID: brokerId,
          CaseStatus: processedQueryData.CaseStatus,
          ExpectedDays: '',
          ExpectedDaysStart: processedQueryData.StartExpectedDays,
          ExpectedDaysEnd: processedQueryData.EndExpectedDays,
          MatchUserName: processedQueryData.UserName,
          PositionName: this.props.QueryParams.RecruitTmpID.value ? this.props.QueryParams.RecruitTmpID.value.text : '',
          UserMobile: processedQueryData.Mobile,
          PageInfo: {
            Count: processedQueryData.RecordCount,
            Offset: processedQueryData.RecordStartIndex
          }
        });
    }

    dblClickTab(e, props) {
        browserHistory.push({
            pathname: '/broker/member/detail/' + e.UserID,
            query: {
                memberName: e.UserName
            }
        });
    }

    filterDate(value) {
        let st = null;
        let stop = null;
        if (value === "2013-01-01") {
            st = "2013-01-01";
            stop = getTime(-1);
            setParams(STATE_NAME, {
                clickActive: 2
            });
        } else {
            st = getTime(value);
            stop = getTime(value);
            setParams(STATE_NAME, {
                clickActive: value
            });

        }
        setParams(STATE_NAME, {
            QueryParams: Object.assign({}, this.props.QueryParams, {Time: {value: [moment(st, 'YYYY-MM-DD'), moment(stop, 'YYYY-MM-DD')]}})
        });

        const processedQueryData = filterObject(this.props.QueryParams, value);
        console.log('filter hello processedQueryData', processedQueryData);

        getBagListData({
          BrokerID: brokerId,
          CaseStatus: 1,
          ExpectedDays: '',
          ExpectedDaysStart: processedQueryData.StartExpectedDays,
          ExpectedDaysEnd: processedQueryData.EndExpectedDays,
          MatchUserName: processedQueryData.UserName,
          PositionName: this.props.QueryParams.RecruitTmpID.value ? this.props.QueryParams.RecruitTmpID.value.text : '',
          UserMobile: processedQueryData.Mobile,
          PageInfo: {
            Count: 40,
            Offset: 0
          }
        });

        getRecruitBasicData();
    }

    render() {
        console.log('render table', this.props);
        let hubList = (this.props.hub_list.HubList.Data && this.props.hub_list.HubList.Data.HubList) ? this.props.hub_list.HubList.Data.HubList : [];
        return (
            <div>
                <div className='ivy-page-title'>
                    <h1 className="ivy-title">口袋名单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <WrappedAdvancedSearchForm allRecruitList={this.props.AllRecruitListData.RecordList}
                                                   QueryParams={this.props.QueryParams}/>
                        <Alert style={{margin: "10px 0"}} message={<div><a href="javascript:;" style={{
                            textDecorationLine: this.props.clickActive === 1 ? "underline" : "none",
                            fontWeight: this.props.clickActive === 1 ? "800" : "400"
                        }} onClick={() => {
                            this.filterDate(1);
                        }}>拨打明日预计入职</a>：{this.props.TommrowEnrolCnt}个，<a
                            href="javascript:;" style={{
                            textDecorationLine: this.props.clickActive === 0 ? "underline" : "none",
                            fontWeight: this.props.clickActive === 0 ? "800" : "400"
                        }} onClick={() => {
                            this.filterDate(0);
                        }}>日结今日预计入职</a>：{this.props.TodayEnrolCnt}个</div>} type="info" showIcon/>
                        <Table bordered
                               rowKey={'key'}
                               pagination={{
                                   total: this.props.RecordTotalCount,
                                   pageSize: this.props.QueryParams.RecordCount,
                                   current: (this.props.QueryParams.RecordStartIndex === 0) ? 1 : this.state.current,
                                   showSizeChanger: true,
                                   showQuickJumper: true,
                                   pageSizeOptions: Constant.pageSizeOptions,
                                   showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                               }}
                               columns={createColumns(this.props.QueryParams.SequenceWay)}
                               onRowDoubleClick={(e) => {
                                   this.dblClickTab(e);
                               }}
                               loading={this.props.RecordListLoading}
                               onChange={this.handleTabTable}
                               dataSource={this.props.QueryRecruitBasicList}/>
                        {this.props.showWindow ?
                            <AlertWindow showWindow={this.props.showWindow} text='' allProps={this.props}
                                         pickupLocationList={this.props.faulch.pickupLocationList}
                                         recruitList={this.props.allRecruitList.recruitFilterList}
                                         record={this.props.record || {}} hubList={hubList}/> : ""}
                    </Card>
                </div>


            </div>
        );
    }
}

// 点击进入会员详情页函数
function ClickUserName(UserID, UserName) {
    if (UserID) {
        browserHistory.push({
            pathname: '/broker/member/detail/' + UserID,
            query: {
                memberName: UserName
            }
        });
    }
}

// table的栅栏结构
function createColumns(Order) {
    return ([
        {
            title: '序号', key: 'seqNo', width: 42,
            render: (text, record, index) => index + 1
        },
        {
            title: '会员姓名', dataIndex: 'UserName',
            render: (text, record) => {
                const {UserName} = record;
                let name = record.UserName || record.UserCallName || record.UserNickName;
                return (
                    <div>
                        <a href="javascript:;" onClick={() => {
                            ClickUserName(record.UserID, name);
                        }}>{name}</a>
                    </div>
                );
            }
        },
        {
            title: '手机号码', dataIndex: 'Mobile',
            render: (text, record) => {
                return DataTransfer.phone(record.UserMobile);
            }
        },
        {
            title: '报名企业', dataIndex: 'PositionName'
        },
        {
            title: '追踪状态', dataIndex: 'CaseStatus',
            render: (text, record) => {
                return text === -1 ? '' : trackStatusMap[text];
            }
        },
        // {
        //     title: '当天处理状态', dataIndex: 'DayDealStatus', type: "state"
        // },
        // {
        //     title: '预签到日期',
        //     dataIndex: 'PickDate',
        //     sorter: true,
        //     sortOrder: Order === 3 ? "ascend" : Order === 4 ? "descend" : false
        // },
        {
            title: '预计入职日期',
            dataIndex: 'ExpectedDays'
            // sorter: true,
            // sortOrder: Order === 1 ? "ascend" : Order === 2 ? "descend" : false
        },
        {
            title: '操作时间',
            dataIndex: 'CreateTime'
            // sorter: true,
            // sortOrder: Order === 5 ? "ascend" : Order === 6 ? "descend" : false
        }
    ].map((item) => {
        if (!item.render) {
            item.render = (text, record) => {
                let dataName = record[item.dataIndex];
                // if(item.dataIndex === "CaseStatus" && dataName === 7) {
                //     return(
                //         <div>
                //             <a href="javascript:;" onClick={()=>{confirm(record);return false;}}>放弃</a>
                //         </div>
                //     );
                // }
                return (
                    <div>
                        {item.type ? stateObjs[item.dataIndex][dataName] : dataName}
                    </div>
                );
            };
        }
        return item;
    }));
}

// 预签到代码块
class AccountSearchForm3 extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    // componentDidMount() {
    //     let record = this.props.record;
    //     this.props.form.setFieldsValue({
    //         PreRecruitID: {
    //             value: record && record.RecruitTmpID ? record.RecruitTmpID.toString() : '',
    //             text: record.PositionName || ''
    //         }
    //     });
    // }
    componentWillReceiveProps(nextProps) {
        if (nextProps.allProps.processInfo.helpMemberApplyFetch.status === 'success') {
            setFetchStatus('state_broker_member_detail_process', 'helpMemberApplyFetch', 'close');
            setEstimatePick(nextProps.allProps.setPick);
        }
        if (nextProps.allProps.processInfo.helpMemberApplyFetch.status === 'error') {
            setFetchStatus('state_broker_member_detail_process', 'helpMemberApplyFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.allProps.processInfo.helpMemberApplyFetch.response.Desc
            });
        }

        if (nextProps.allProps.pocketInfo.setEstimatePickFetch.status === 'success') {
            setFetchStatus('state_broker_detail_pocket', 'setEstimatePickFetch', 'close');
            message.success('设置预签到成功');
            let Parms = this.props.allProps.QueryParams;
            getBagListData(filterObject(Parms));
            getRecruitBasicData();
            this.props.form.resetFields();
            this.props.close();
            this.props.closeAll();
        }
        if (nextProps.allProps.pocketInfo.setEstimatePickFetch.status === 'error') {
            setFetchStatus('state_broker_detail_pocket', 'setEstimatePickFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.allProps.pocketInfo.setEstimatePickFetch.response.Desc
            });
        }

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let p_p = this.props.record.Mobile;
                if (values.UserID) {
                    let record = this.props.record || '';
                    const userMobileList = record.UserMirrorList || [];
                    let u_u = userMobileList.find((v) => v.UserID == values.UserID);
                    if (u_u) p_p = u_u.Mobile;
                }
                let data = this.props.ApplyData;
                if (data) {
                    let pa_pa = {
                        UserID: values.UserID ? values.UserID - 0 : this.props.record.UserID,
                        Content: data.Content,
                        RecruitID: Number(values.PreRecruitID.value),
                        GatherDepartID: values.PickLocationID ? Number(values.PickLocationID.value) : 0,
                        SignTime: values.PickDate.format('YYYY-MM-DD'),
                        Type: data.Type,
                        MsgFlowID: data.MsgFlowID,
                        UserPreOrderID: data.UserPreOrderID,
                        UserOrderID: data.UserOrderID,
                        UserStatus: data.UserStatus
                    };
                    MemberDetailService.modifyMemberApply(pa_pa).then((res) => {
                        if (res && !res.error) {
                            // message.destroy();
                            // message.success('设置预签到成功');
                            setEstimatePick({
                                PickDate: values.PickDate.format('YYYY-MM-DD'),
                                PreRecruitID: Number(values.PreRecruitID.value),
                                PickLocationID: values.PickLocationID ? Number(values.PickLocationID.value) : 0,
                                RecruitBasicID: this.props.record.RecruitBasicID,
                                UserID: values.UserID ? values.UserID - 0 : this.props.record.UserID
                            });
                            // let Parms = this.props.allProps.QueryParams;
                            // getBagListData(filterObject(Parms));
                            getRecruitBasicData();
                            // this.props.form.resetFields();
                            // this.props.close();
                            // this.props.closeAll();
                        }
                    }, (err) => {
                        message.destroy();
                        message.info("设置预签到失败" + (err && err.Desc) ? ':' + err.Desc : '');
                    });
                } else {
                    helpMemberApply({
                        Content: values.Content || '',
                        GatherDepartID: values.PickLocationID ? Number(values.PickLocationID.value) : 0,
                        Name: this.props.record.UserName,
                        Phone: p_p,
                        RecruitID: Number(values.PreRecruitID.value),
                        SignTime: values.PickDate.format('YYYY-MM-DD'),
                        Type: 2,
                        UserID: values.UserID ? values.UserID - 0 : this.props.record.UserID,
                        UserStatus: 0
                    });
                    setParams(STATE_NAME, {
                        setPick: Object.assign({}, {
                            PickDate: values.PickDate.format('YYYY-MM-DD'),
                            PreRecruitID: Number(values.PreRecruitID.value),
                            PickLocationID: values.PickLocationID ? Number(values.PickLocationID.value) : 0,
                            RecruitBasicID: this.props.record.RecruitBasicID,
                            UserID: values.UserID ? values.UserID - 0 : this.props.record.UserID
                        })
                    });
                }
                if (values.PickDate && this.props.record.PickDate !== values.PickDate.format('YYYY-MM-DD')) {
                    updatePocketCase({
                        CaseStatus: this.props.record.CaseStatus,
                        RecruitID: Number(values.PreRecruitID.value),
                        ExpectedDays: values.PickDate.format('YYYY-MM-DD'),
                        RecruitBasicID: this.props.record.RecruitBasicID,
                        Content: values.Content || '',
                        UserID: values.UserID ? values.UserID - 0 : this.props.record.UserID
                    });
                }
            }
            // if (!values.PickDate || !values.PreRecruitID || !values.PickLocationID) {
            //     alert("请将信息填写完整！");
            //     return;
            // }


        });
        // this.props.form.resetFields();
        // this.props.close();
    };

    handleCancel = () => {
        this.props.close();
    };

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        let record = this.props.record || '';
        const userMobileList = record.UserMirrorList || [];
        let ApplyData = this.props.ApplyData || {};
        console.log('userMobileList', ApplyData);
        const recruitList = this.props.allProps.allRecruitList.recruitFilterList || [];
        let initRecruit = {
            value: record && record.RecruitTmpID ? record.RecruitTmpID.toString() : '',
            text: record.PositionName || ''
        };
        let initDate = this.props.record.PickDate && moment(this.props.record.PickDate).isValid() ? moment(this.props.record.PickDate, 'YYYY-MM-DD') : null;
        let initPlace = {value: undefined, text: undefined};
        if (ApplyData) {
            initRecruit = recruitList.find((v) => v.RecruitTmpID === ApplyData.RecruitID) || initRecruit;
            if (ApplyData.SignTime && moment(ApplyData.SignTime).isValid()) {
                initDate = moment(ApplyData.SignTime, 'YYYY-MM-DD');
            }
            if (ApplyData.GatherDepartID) {
                let hList = this.props.hubList || [];
                let hIndex = hList.findIndex((v) => v.HubID == ApplyData.GatherDepartID);
                console.log('ApplyData.GatherDepartID', ApplyData.GatherDepartID, this.props.hubList);
                if (hIndex != -1) {
                    initPlace = {value: ApplyData.GatherDepartID, text: hList[hIndex].HubName};
                }
            }
        }
        return (
            <div>
                <Col span={12}>
                    {userMobileList.length > 1 ? (
                        <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="手机号码">
                            {getFieldDecorator("UserID", {initialValue: ApplyData.UserID || (this.props.record.UserID + '')})(
                                <Select className="w-100" placeholder="选择手机号">
                                    {userMobileList.map((v_v, i_i) => {
                                        return (<Option value={v_v.UserID + ''} key={'a' + i_i}>{v_v.Mobile}</Option>);
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    ) : (
                        <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="手机号码">
                            {getFieldDecorator("Mobile", {initialValue: this.props.record.Mobile})(
                                <Input disabled size="default"/>
                            )}
                        </FormItem>
                    )}
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="报名企业">
                        {getFieldDecorator('PreRecruitID', {
                            rules: [
                                {
                                    required: true,
                                    message: '报名企业必选'
                                },
                                {
                                    validator: (rule, value, cb) => {
                                        if (value && !value.value) {
                                            cb('报名企业必选');
                                        }
                                        cb();
                                    }
                                }
                            ],
                            initialValue: initRecruit
                        })(<AutoCompleteSelect allowClear={true} optionsData={{
                            valueKey: 'RecruitTmpID',
                            textKey: 'RecruitName',
                            dataArray: this.props.allProps.allRecruitList.recruitFilterList
                        }}/>)}
                        {/* {getFieldDecorator('PreRecruitID')(
                            <AutoCompleteSelect
                                allowClear={true}
                                optionsData={{
                                    valueKey: "RecruitID",
                                    textKey: "RecruitName",
                                    dataArray: this.props.recruitList || []
                                }}

                            ></AutoCompleteSelect>
                        )} */}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="预签到日期">
                        {getFieldDecorator('PickDate', {
                            rules: [
                                {
                                    required: true,
                                    message: '预签到日期必选'
                                }],
                            initialValue: initDate
                        })(
                            <DatePicker size="default" disabledDate={disabledDateTow}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="预签到地址">
                        {getFieldDecorator('PickLocationID', {
                            rules: [
                                {
                                    required: true,
                                    message: '预签到地址必选'
                                },
                                {
                                    validator: (rule, value, cb) => {
                                        if (value && !value.value) {
                                            cb('预签到地址必选');
                                        }
                                        cb();
                                    }
                                }
                            ],
                            initialValue: initPlace
                        })(<AutoCompleteSelect allowClear={true} optionsData={{
                            valueKey: 'HubID',
                            textKey: 'HubName',
                            dataArray: this.props.hubList
                        }}/>)}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label="联系记录">
                        {getFieldDecorator('Content')(<TextArea autosize={{minRows: 4, maxRows: 6}}/>)}
                    </FormItem>
                </Col>
                <div style={{position: "absolute", right: 20, bottom: -59, zIndex: 10}}>
                    <Button size="large" type="primary" htmlType="submit" style={{marginRight: 8}}>确定</Button>
                    <Button onClick={this.handleCancel} size="large">
                        取消
                    </Button>
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

const WrappedAccount3 = Form.create()(AccountSearchForm3);

// 派车代码块
class AccountSearchForm2 extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);


    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.allProps.processInfo.createDispatchOrderFetch.status === 'success') {
            setFetchStatus('state_broker_member_detail_process', 'createDispatchOrderFetch', 'close');
            message.success('派车成功');
            let Parms = nextProps.allProps.QueryParams;
            getBagListData(filterObject(Parms));
            getRecruitBasicData();
            this.props.form.resetFields();
            this.props.close();
            this.props.closeAll();
        }
        if (nextProps.allProps.processInfo.createDispatchOrderFetch.status === 'error') {
            setFetchStatus('state_broker_member_detail_process', 'createDispatchOrderFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.allProps.processInfo.createDispatchOrderFetch.response.Desc + '1'
            });
        }
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let p_p = this.props.record.Mobile;
                if (values.UserID) {
                    let record = this.props.record || '';
                    const userMobileList = record.UserMirrorList || [];
                    let u_u = userMobileList.find((v) => v.UserID == values.UserID);
                    if (u_u) p_p = u_u.Mobile;
                }
                createDispatchOrder({
                    BuddyNum: parseInt(values.BuddyNum || 0, 10),
                    PickupLocate: values.PickupLocate.text,
                    DestinationID: parseInt(values.DestinationID.value, 10),
                    RecruitID: this.props.record.RecruitTmpID || 0,
                    Name: this.props.record.UserName || this.props.record.UserCallName || this.props.record.UserNickName,
                    UserID: values.UserID ? values.UserID - 0 : this.props.record.UserID,
                    Phone: p_p,
                    UserOrderID: 0,
                    CarryTime: this.props.record.PickDate
                });
            }
        });
    };

    handleCancel = () => {
        this.props.close();
    };

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        let record = this.props.record || '';
        const userMobileList = record.UserMirrorList || [];
        return (
            <div>
                <Col span={12}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="去哪儿接">
                        {getFieldDecorator("PickupLocate", {
                            rules: [
                                {
                                    required: true,
                                    message: '接站地点必填'
                                }
                            ]
                        })(
                            <AutoCompleteSelect enableEntryValue={true} allowClear={true} optionsData={{
                                valueKey: 'LocationID',
                                textKey: ['LocationName'],
                                dataArray: [{
                                    LocationID: 9999,
                                    LocationName: '需要问路'
                                }].concat(this.props.pickupLocationList)
                            }}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="往哪儿送">
                        {getFieldDecorator('DestinationID', {
                            rules: [
                                {
                                    required: true,
                                    message: '送达地点必选'
                                },
                                {
                                    validator: (rule, value, cb) => {
                                        if (value && !value.value) {
                                            cb('送达地点必选');
                                        }
                                        cb();
                                    }
                                }
                            ]
                        })(<AutoCompleteSelect allowClear={true} optionsData={{
                            valueKey: 'HubID',
                            textKey: 'HubName',
                            dataArray: this.props.hubList
                        }}/>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    {userMobileList.length > 1 ? (
                        <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="手机号码">
                            {getFieldDecorator("UserID", {initialValue: this.props.record.UserID + ''})(
                                <Select className="w-100" placeholder="选择手机号">
                                    {userMobileList.map((v_v, i_i) => {
                                        return (<Option value={v_v.UserID + ''} key={'b' + i_i}>{v_v.Mobile}</Option>);
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    ) : (
                        <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="手机号码">
                            {getFieldDecorator("Mobile", {initialValue: this.props.record.Mobile})(
                                <Input disabled size="default"/>
                            )}
                        </FormItem>
                    )}
                </Col>
                <Col span={12}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="随行人数">
                        {getFieldDecorator('BuddyNum', {
                            rules: [
                                {
                                    required: true,
                                    message: '随行人数必填'
                                },
                                {
                                    pattern: /^[0-9]*$/,
                                    message: '随行人数必须为数字'
                                },
                                {
                                    validator: (rule, value, cb) => {
                                        if (parseInt(value, 10) < 0) {
                                            cb('随行人数必须大于或等于0');
                                        }
                                        cb();
                                    }
                                }
                            ],
                            initialValue: '0'
                        })(<Input type="number" placeholder="请输入随行人数（除会员自己）"/>)}
                    </FormItem>
                </Col>
                <div style={{position: "absolute", right: 20, bottom: -59, zIndex: 10}}>
                    <Button size="large" type="primary" htmlType="submit" style={{marginRight: 8}}>确定</Button>
                    <Button onClick={this.handleCancel} size="large">
                        取消
                    </Button>
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

const WrappedAccount2 = Form.create()(AccountSearchForm2);


// 会员管理代码块
class AccountSearchForm extends React.Component { // 编辑或新建用户时的表单

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        // console.log(this.props, 888);
        // let record = this.props.record;
        // this.props.form.setFieldsValue({
        //     PreRecruitID: {
        //         value: record && record.RecruitTmpID ? record.RecruitTmpID.toString() : '',
        //         text: record.PositionName || ''
        //     }
        // });
        if (nextProps.allProps.pocketInfo.updatePocketCaseFetch.status === 'success') {
            setFetchStatus('state_broker_detail_pocket', 'updatePocketCaseFetch', 'close');
            message.success('更新口袋信息成功');
            getRecruitBasicData();
            // getLatestPocketCase({
            //     UserID: nextProps.userId
            // });
            // this.props.form.resetFields();
            this.props.close();

            let Parms = this.props.allProps.QueryParams;
            getBagListData(filterObject(Parms));
        }
        if (nextProps.allProps.pocketInfo.updatePocketCaseFetch.status === 'error') {
            setFetchStatus('state_broker_detail_pocket', 'updatePocketCaseFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.allProps.pocketInfo.updatePocketCaseFetch.response.Desc
            });
        }
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let recruitList = 0;
                for (let i = 0; i < this.props.recruitList.length; i++) {
                    if (this.props.recruitList[i].RecruitName === this.props.record.PositionName) {
                        recruitList = this.props.recruitList[i].RecruitID;
                    }
                }

                updatePocketCase({
                    CaseStatus: values.CaseStatus ? Number(values.CaseStatus) : this.props.record.CaseStatus,
                    RecruitID: values.RecruitID ? Number(values.RecruitID.value) : recruitList,
                    ExpectedDays: values.ExpectedDays ? values.ExpectedDays.format('YYYY-MM-DD') : null,
                    RecruitBasicID: this.props.record.RecruitBasicID,
                    Content: values.Content || '',
                    UserID: values.UserID ? values.UserID - 0 : this.props.record.UserID
                });
                // UpdateUserRecruitBasic({
                //     CaseStatus: values.CaseStatus ? Number(values.CaseStatus) : this.props.record.CaseStatus,
                //     RecruitID: values.RecruitID ? Number(values.RecruitID.value) : recruitList,
                //     ExpectedDays: values.ExpectedDays ? values.ExpectedDays.format('YYYY-MM-DD') : null,
                //     RecruitBasicID: this.props.record.RecruitBasicID,
                //     Remark: values.Remark ? values.Remark : this.props.record.Remark
                // });
            }
        });
        // this.props.form.resetFields();
        // this.props.close();
    };

    handleCancel = () => {
        this.props.close();
    };

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const CaseStatus = getFieldValue('CaseStatus');
        let record = this.props.record || '';
        const userMobileList = record.UserMirrorList || [];
        return (
            <div>
                <Col span={8}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="会员姓名">
                        {getFieldDecorator("UserName", {initialValue: (this.props.record.UserName || this.props.record.UserCallName || this.props.record.UserNickName)})(
                            <Input disabled size="default"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    {userMobileList.length > 1 ? (
                        <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="手机号码">
                            {getFieldDecorator("UserID", {initialValue: this.props.record.UserID + ''})(
                                <Select className="w-100" placeholder="选择手机号">
                                    {userMobileList.map((v_v, i_i_c) => {
                                        return (
                                            <Option value={v_v.UserID + ''} key={'c' + i_i_c}>{v_v.Mobile}</Option>);
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    ) : (
                        <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="手机号码">
                            {getFieldDecorator("Mobile", {initialValue: this.props.record.Mobile})(
                                <Input disabled size="default"/>
                            )}
                        </FormItem>
                    )}
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="报名企业">
                        {getFieldDecorator('RecruitID', {
                            rules: [
                                {
                                    required: true,
                                    message: '报名企业必选'
                                },
                                {
                                    validator: (rule, value, cb) => {
                                        if (value && !value.value) {
                                            cb('报名企业必选');
                                        }
                                        cb();
                                    }
                                }
                            ],
                            initialValue: {
                                value: record && record.RecruitTmpID ? record.RecruitTmpID.toString() : '',
                                text: record.PositionName || ''
                            }
                        })(<AutoCompleteSelect allowClear={true} optionsData={{
                            valueKey: 'RecruitTmpID',
                            textKey: 'RecruitName',
                            dataArray: this.props.allProps.allRecruitList.recruitFilterList
                        }}/>)}
                        {/* {getFieldDecorator('RecruitID')(
                            <AutoCompleteSelect
                                allowClear={true}
                                optionsData={{
                                    valueKey: "RecruitID",
                                    textKey: "RecruitName",
                                    dataArray: this.props.recruitList || []
                                }}

                            ></AutoCompleteSelect>
                        )} */}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="追踪状态">
                        {getFieldDecorator('CaseStatus', {
                            initialValue: this.props.record.CaseStatus + ""
                        })(
                            <Select placeholder="请选择" size="default">
                                {Object.keys(trackStatusMap).map((key) => {
                                  return (<Option value={key} key={key}>{trackStatusMap[key]}</Option>);
                                })}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="预计入职日期">
                        {getFieldDecorator('ExpectedDays', {
                            rules: [
                                {
                                    required: true,
                                    message: '预计入职日期必选'
                                }
                            ],
                            initialValue: this.props.record.ExpectedDays ? moment(this.props.record.ExpectedDays, 'YYYY-MM-DD') : ''
                        })(
                            <DatePicker size="default" disabledDate={disabledDate}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={16} className={CaseStatus == 7 ? 'mb-8' : 'display-none'}>
                    <Row><Col offset={4} span={20}>
                        <div className="color-danger" style={{position: 'relative', top: '-8px'}}>该会员会离开口袋名单</div>
                    </Col></Row>
                </Col>
                <Col span={16}>
                    <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}} label="联系记录">
                        {getFieldDecorator('Content')(
                            <TextArea autosize={{minRows: 4, maxRows: 6}}/>
                        )}
                    </FormItem>
                </Col>
                <div style={{position: "absolute", right: 20, bottom: -59, zIndex: 10}}>

                    <Button size="large" type="primary" htmlType="submit" style={{marginRight: 8}}>确定</Button>
                    <Button onClick={this.handleCancel} size="large">
                        取消
                    </Button>
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

// 弹窗主组件
class AlertWindow extends React.PureComponent { // 弹出框组件

    constructor(props) {
        super(props);

        this.state = {
            currentList: 1,
            ApplyData: undefined
        };
        this.hideModal = this.hideModal.bind(this);
        this.hideAllAlertWindow = this.hideAllAlertWindow.bind(this);
        this.hideModalWrappedAccountTow = this.hideModalWrappedAccountTow.bind(this);
    }

    componentWillMount() {
        MemberDetailService.getMemberApplyInfo({UserID: this.props.record.UserID}).then((res) => {
            if (res && !res.error && res.Data && res.Data.Checked) {
                this.setState({ApplyData: res.Data.Record});
            }
        });
    }

    componentWillUpdate() {
        return true;
    }

    hideModal() {
        this.setState({
            currentList: 1
        });
        setParams(STATE_NAME, {
            showWindow: false
        });
    }

    hideModalWrappedAccountTow() {
        this.setState({
            currentList: 1
        });
    }

    hideAllAlertWindow() {
        setParams(STATE_NAME, {
            showWindow: false
        });
    }

    render() {
        let name = this.props.record.UserName || this.props.record.UserCallName || this.props.record.UserNickName;
        return (
            <div>
                {<span>{this.props.text}</span>}
                <Modal
                    title={this.state.currentList === 1 ? "会员报名管理" : this.state.currentList === 3 ? name + "--设预签到" : this.state.currentList === 2 ? name + '--派车' : ''}
                    visible={this.props.allProps.showWindow}
                    okText="确定"
                    cancelText="取消"
                    width="830px"
                    onCancel={this.hideModal}
                >
                    {this.state.currentList === 1 ?
                        <div style={{overflow: "hidden", marginBottom: "15px"}}><Button onClick={() => {
                            this.setState({currentList: 2});
                        }} style={{float: "right"}} type="primary" ghost>派车</Button><Button type="primary"
                                                                                            onClick={() => {
                                                                                                this.setState({currentList: 3});
                                                                                            }} style={{
                            float: "right",
                            marginRight: "5px"
                        }} ghost>设预签到</Button></div> : ""}
                    {this.state.currentList === 1 ?
                        <WrappedAccount allProps={this.props.allProps} recruitList={this.props.recruitList}
                                        record={this.props.record} closeAll={this.hideAllAlertWindow}
                                        close={this.hideModal}></WrappedAccount> : this.state.currentList === 2 ?
                            <WrappedAccount2 allProps={this.props.allProps}
                                             pickupLocationList={this.props.pickupLocationList}
                                             hubList={this.props.hubList} record={this.props.record}
                                             closeAll={this.hideAllAlertWindow}
                                             close={this.hideModalWrappedAccountTow}></WrappedAccount2> : this.state.currentList === 3 ?
                                <WrappedAccount3 allProps={this.props.allProps} hubList={this.props.hubList}
                                                 record={this.props.record} closeAll={this.hideAllAlertWindow}
                                                 ApplyData={this.state.ApplyData}
                                                 close={this.hideModalWrappedAccountTow}
                                                 recruitList={this.props.recruitList}
                                                 hubList2={this.props.hubList}></WrappedAccount3> : ''}

                </Modal>
            </div>
        );
    }
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
    if (current) {
        let newDate = new Date();
        newDate.setTime(current.valueOf());
        let datas = newDate.getFullYear() + "-" + changeNumStyle(+newDate.getMonth() + 1) + "-" + changeNumStyle(newDate.getDate());
        return datas < getTime(0);
    }
}

function disabledDateTow(current) { // TODO这里有个权限限制
    // Can not select days before today and today
    if (current) {
        let newDate = new Date();
        newDate.setTime(current.valueOf());
        let datas = newDate.getFullYear() + "-" + changeNumStyle(+newDate.getMonth() + 1) + "-" + changeNumStyle(newDate.getDate());
        return datas < getTime(0) || datas > getTime(1);
    }
}

function confirm(record) {
    Modal.confirm({
        title: '删除口袋',
        content: '确定要删除该条口袋名单？',
        cancelText: '取消',
        okText: '确认',
        maskClosable: true,
        onOk: () => {
            ModalOnOk(record);
        }
    });
}

function ModalOnOk(record) {
    console.log(record);
}

export default BagList;
