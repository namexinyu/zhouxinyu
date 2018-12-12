import React from 'react';
import {Row, Col, Form, DatePicker, Button, Select, Table, Input, Popconfirm} from 'antd';

const HubManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") !== -1;
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
// import getRecruitNameList from "ACTION/ExpCenter/Recruit/getRecruitNameList";
import setParams from 'ACTION/setParams';

const STATE_NAME = 'state_ec_preCount';
const FormItem = Form.Item;
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import getPreCount from 'ACTION/ExpCenter/PreCount';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

const Option = Select.Option;
import "LESS/pages/pre-count.less";

const {
    GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;

class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {

    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            let Parms = {...this.props.Parms};
            if (values.HubIDName === "all" || !values.HubIDName) {
                Parms.HubIDList = this.props.HubIDListALL;
            } else {
                Parms.HubIDList = [Number(values.HubIDName)];
            }
            if (values.RecruitID && values.RecruitID.value) {
                Parms.RecruitID = Number(values.RecruitID.value);
            } else {
                Parms.RecruitID = -9999;
            }
            setParams(STATE_NAME, {Parms: Object.assign({}, Parms)});
            getPreCount(Parms);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    onChange() {

    }

    // To generate mock Form.Item
    getFields() {
        const {getFieldDecorator} = this.props.form;
        let recruitNameList = this.props.recruitNameList;
        return (
            <Row>
                <Col span={8}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="预接站企业">
                        {getFieldDecorator('RecruitID')(<AutoCompleteSelect allowClear={true} optionsData={{
                            valueKey: 'RecruitTmpID',
                            textKey: 'RecruitName',
                            dataArray: recruitNameList
                        }}/>)}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="体验中心">
                        {getFieldDecorator('HubIDName')(
                            <Select
                                style={{width: "100%", display: HubManager ? "block" : "none"}}
                                size="large"
                                placeholder="全部体验中心"
                            >
                                <Option value="all">全部体验中心</Option>
                                {
                                    (this.props.HubList || []).map((item, index) => {
                                        return (
                                            <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                        );
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8} style={{textAlign: 'right', paddingRight: "10px", marginBottom: "20px"}}>
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

class EditableTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '预接站企业',
            dataIndex: 'RecruitName',
            width: '20%',
            render: (text, record) => {
                const {RecruitName} = record;
                return (
                    <div>
                        {RecruitName}
                    </div>
                );
            }
        }, {
            title: '体验中心',
            dataIndex: 'HubName',
            width: '20%',
            render: (text, record) => {
                const {HubName} = record;
                return (
                    <div>
                        {HubName}
                    </div>
                );
            }
        }, {
            title: '预签到人数',
            dataIndex: 'PreSignNum',
            width: '20%',
            render: (text, record) => {
                const {PreSignNum} = record;
                return (
                    <div>
                        {PreSignNum}
                    </div>
                );
            }
        },
           /* {
                title: '' +
                '未签到人数',
                dataIndex: 'NotReceivedNum',
                width: '20%',
                render: (text, record) => {
                    const {NotReceivedNum} = record;
                    return (
                        <div>
                            {NotReceivedNum}
                        </div>
                    );
                }
            },*/
            {
                title: '已签到人数',
                dataIndex: 'ReceivedNum',
                width: '20%',
                render: (text, record) => {
                    const {ReceivedNum} = record;
                    return (
                        <div>
                            {ReceivedNum}
                        </div>
                    );
                }
            }];
    }

    render() {
        return <Table bordered dataSource={this.props.contentList ? this.props.contentList : []}
                      columns={this.columns}/>;
    }
}

class EditableTableTwo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '预接站企业',
            dataIndex: 'RecruitName',
            width: '20%',
            render: (text, record) => {
                const {RecruitName} = record;
                return (
                    <div>
                        {RecruitName}
                    </div>
                );
            }
        }, {
            title: '体验中心',
            dataIndex: 'HubName',
            width: '20%',
            render: (text, record) => {
                const {HubName} = record;
                return (
                    <div>
                        {HubName}
                    </div>
                );
            }
        }, {
            title: '预签到人数',
            dataIndex: 'PreSignNum',
            width: '20%',
            render: (text, record) => {
                const {PreSignNum} = record;
                return (
                    <div>
                        {PreSignNum}
                    </div>
                );
            }
        }];
    }

    render() {
        return <Table bordered dataSource={this.props.contentList ? this.props.contentList : []}
                      columns={this.columns}/>;
    }
}


export default class SystemMsg extends React.PureComponent {
    constructor(props) {
        super(props);


        this.HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.state = {
            actives: true
        };

        this.changeTabTime = this.changeTabTime.bind(this);
    }

    componentWillMount() {
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        getPreCount({
            HubIDList: this.HubIDListALL,
            PreCheckinDate: getTime(0),
            RecruitID: -9999
        });
        GetMAMSRecruitFilterList();
        // getRecruitNameList();
        setParams(STATE_NAME, {
            Parms: Object.assign({}, this.props.Parms, {
                HubIDList: this.HubIDListALL,
                PreCheckinDate: getTime(0)
            })
        });
    }

    changeTabTime(tag) {
        let Parms = {...this.props.Parms};
        Parms.PreCheckinDate = (tag === "today" ? getTime(0) : getTime(1));
        this.setState({
            actives: tag === "today" ? true : false
        });
        setParams(STATE_NAME, {Parms: Object.assign({}, Parms)});
        getPreCount(Parms);
    }

    render() {
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">预接统计</div>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-2">
                            <WrappedAdvancedSearchForm HubIDListALL={this.HubIDListALL} Parms={this.props.Parms}
                                                       HubList={this.HubList}
                                                       recruitNameList={this.props.allRecruitList.recruitFilterList}/>
                            <div className="pre-count-tab-time">
                                <a href="javascript:;" className={this.state.actives ? "active" : ""} onClick={() => {
                                    this.changeTabTime("today");
                                }}>今日接站</a>
                                <a href="javascript:;" className={!this.state.actives ? "active" : ""} onClick={() => {
                                    this.changeTabTime("tomorrow");
                                }}>明日面试</a>
                            </div>
                            {this.state.actives && <div className="pre-count-board">
                                <p className="pre-p-title">
                                    <span>预签到人数</span>
                                    {/* <span>未签到人数</span>*/}
                                    <span >已签到人数</span></p>
                                <p>
                                    <span style={{color: "blue"}}>{this.props.PreSignTotalNum}</span>
                                    {/* <span style={{color: "red"}}>{this.props.NotReceivedTotalNum}</span>*/}
                                    <span style={{color: "green"}}>{this.props.ReceivedTotalNum}</span>
                                </p>
                            </div>}
                            {!this.state.actives && <div className="pre-count-board">
                                <p className="pre-p-title">
                                    <span>预签到人数</span>
                                    {/* <span>未签到人数</span>*/}
                                    {/* <span>已签到人数</span>*/}
                                </p>
                                <p>
                                    <span style={{color: "blue"}}>{this.props.PreSignTotalNum}</span>
                                    {/* <span style={{color: "red"}}>{this.props.NotReceivedTotalNum}</span>*/}
                                    {/* <span style={{color: "green"}}>{this.props.ReceivedTotalNum}</span>*/}
                                </p>
                            </div>}
                            {this.state.actives && <EditableTable contentList={this.props.RecordList}></EditableTable>}
                            {!this.state.actives &&
                            <EditableTableTwo contentList={this.props.RecordList}></EditableTableTwo>}
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}

function getTime(time) {
    let nowdate = new Date();
    nowdate.setDate(nowdate.getDate() + time);
    return nowdate.getFullYear() + "-" + changeNumStyle(+nowdate.getMonth() + 1) + "-" + changeNumStyle(nowdate.getDate());
}

// function getTime2(time) {
//     return time.getFullYear() + "-" + changeNumStyle(+time.getMonth() + 1) + "-" + changeNumStyle(time.getDate());
// }
function changeNumStyle(num) {
    return num <= 9 ? '0' + num : num;
}