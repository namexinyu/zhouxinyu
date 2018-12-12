import {
    Form,
    Row,
    Col,
    Button,
    Checkbox,
    Input,
    Cascader,
    Select,
    Icon,
    DatePicker,
    message,
    Radio,
    InputNumber,
    Tooltip,
    Table
} from 'antd';
import React from 'react';
import setParams from "ACTION/setParams";
import SettlementForm from "./SettlementForm";
import Settlement from 'ACTION/Finance/Settlement/Settlement';
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import CommonAction from 'ACTION/Finance/Common';
import Export from 'SERVICE/Finance/Settlement/Settlement';
const {
    SettlementReportExport // 经纪人用于输入会员手机号匹配招工标签
} = Settlement;
import moment from 'moment';
const {
    getRecruitSimpleList,
    getLaborSimpleList
} = CommonAction;
const STATE_NAME = "SettlementForm";
const PassInterviewInCheckIn = <span>通过率=通过数÷分配人数</span>;
const JoinRecruitInCheckIn = <span>入职率=入职人数÷分配人数</span>;
const WaitSettlementNumber = <span>业务处理为【通过】，结算状态为【待结算】</span>;
const HadSettlementNumber = <span>【已收】＞0的会员数</span>;
const HadSettlementInJoin = <span>利润率=在职人数÷ 通过人数</span>;
const AllOkInFromLabor = <span>面试通过的会员订单价之和</span>;
const RealInFromLabor = <span>面试名单中的【已收】</span>;
const RealOutToUser = <span>面试名单中的【会员已收】</span>;
const FromLaborCutOutToUser = <span>实收-实付</span>;
const WaitSettlement = <span>不包括劳务报价为【0】的订单</span>;
const handleTableOperate = <span>数据量较大，一次性导出时，请尽量选择1 个月及一个月以内的数据。</span>;
const ICON = <Icon style={{ margin: "-10px 0 0 5px", fontSize: "1px", color: "#108ee9a1"}} type="exclamation-circle-o" />;
export default class AssistancePage extends React.PureComponent {
    constructor(props) {      
        super(props);
    }
    componentWillMount() {
        
    }

    componentDidMount() {
        getLaborSimpleList();
        getRecruitSimpleList();
        this.onChange();
    }
    componentWillReceiveProps(nextProps) {

    }
    onChange = (page, pageSize) => {
        console.log(page, pageSize, "444444444444444444");
        setParams(STATE_NAME, {
            pageSize: pageSize || 10,
            page: page || 0
          });
        let { large, ShortName, PositionName, CheckInTimeBegin, CheckInTimeEnd, type, CheckInTimeEnds, CheckInTimeBegins} = this.props.SettlementForm.queryParams;
        let params = {};
        params.RecordIndex = (page - 1) * pageSize || 0 ;
        params.RecordSize = pageSize || 10;
        if (large.value == 1) {
            let HM = moment().format("YYYY:MM");
            let MM = HM.split(":")[1];
            let CheckInTimeEnd = moment().format("YYYY") + "-" + (MM * 1 + 1) + "-01";
            params.CheckInTimeBegin = moment().format("YYYY-MM") + "-01";
            params.CheckInTimeEnd = CheckInTimeEnd;
        } else if (large.value == 3) {
            let item = CheckInTimeEnds.value;
            if (type.value == "1") {
                params.CheckInTimeBegin = item + "-01-01";
                params.CheckInTimeEnd = item + "-04-01";
            } else if (type.value == "2") {
                params.CheckInTimeBegin = item + "-04-01";
                params.CheckInTimeEnd = item + "-07-01";
            } else if (type.value == "3") {
                params.CheckInTimeBegin = item + "-07-01";
                params.CheckInTimeEnd = item + "-10-01";
            } else if (type.value == "4") {
                params.CheckInTimeBegin = item + "-10-01";
                params.CheckInTimeEnd = item + "-12-31";
            } else {
                let HM = moment().format("YYYY:MM");
                let MM = HM.split(":")[1];
                let CheckInTimeEnd = CheckInTimeEnds.value + "-" + (MM * 1 + 1) + "-01";
                params.CheckInTimeBegin = moment().format("YYYY-MM") + "-01";
                params.CheckInTimeEnd = CheckInTimeEnd;
            }
        } else if (large.value == 2) {
            if (CheckInTimeBegin.value && CheckInTimeEnd.value) {
                params.CheckInTimeBegin = CheckInTimeBegin.value.format("YYYY-MM") + "-01";
                params.CheckInTimeEnd = CheckInTimeEnd.value.format("YYYY-MM") + "-01";
            }
        } else if (large.value == 4 && CheckInTimeBegins.value) {
            params.CheckInTimeBegin = CheckInTimeBegins.value + "-01-01";
            params.CheckInTimeEnd = CheckInTimeBegins.value + "-12-30";
        }
        if (ShortName.value) {
            params.ShortName = ShortName.value;
        }
        if (PositionName.value) {
            params.PositionName = PositionName.value;
        }
        Settlement.getSettlementReport(params);
    }
    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }
    handleTableOperate = (e) => {
        let { large, ShortName, PositionName, CheckInTimeBegin, CheckInTimeEnd, type, CheckInTimeEnds, CheckInTimeBegins} = this.props.SettlementForm.queryParams;
        let params = {};
        if (large.value == 1) {
            let HM = moment().format("YYYY:MM");
            let MM = HM.split(":")[1];
            let CheckInTimeEnd = moment().format("YYYY") + "-" + (MM * 1 + 1) + "-01";
            params.CheckInTimeBegin = moment().format("YYYY-MM") + "-01";
            params.CheckInTimeEnd = CheckInTimeEnd;
        } else if (large.value == 3) {
            let item = CheckInTimeEnds.value;
            if (type.value == "1") {
                params.CheckInTimeBegin = item + "-01-01";
                params.CheckInTimeEnd = item + "-04-01";
            } else if (type.value == "2") {
                params.CheckInTimeBegin = item + "-04-01";
                params.CheckInTimeEnd = item + "-07-01";
            } else if (type.value == "3") {
                params.CheckInTimeBegin = item + "-07-01";
                params.CheckInTimeEnd = item + "-10-01";
            } else if (type.value == "4") {
                params.CheckInTimeBegin = item + "-10-01";
                params.CheckInTimeEnd = item + "-12-31";
            } else {
                let HM = moment().format("YYYY:MM");
                let MM = HM.split(":")[1];
                let CheckInTimeEnd = CheckInTimeEnds.value + "-" + (MM * 1 + 1) + "-01";
                params.CheckInTimeBegin = moment().format("YYYY-MM") + "-01";
                params.CheckInTimeEnd = CheckInTimeEnd;
            }
        } else if (large.value == 2) {
            if (CheckInTimeBegin.value && CheckInTimeEnd.value) {
                params.CheckInTimeBegin = CheckInTimeBegin.value.format("YYYY-MM") + "-01";
                params.CheckInTimeEnd = CheckInTimeEnd.value.format("YYYY-MM") + "-01";
            }
        } else if (large.value == 4 && CheckInTimeBegins.value) {
            params.CheckInTimeBegin = CheckInTimeBegins.value + "-01-01";
            params.CheckInTimeEnd = CheckInTimeBegins.value + "-12-30";
        }
        if (ShortName.value) {
            params.ShortName = ShortName.value;
        }
        if (PositionName.value) {
            params.PositionName = PositionName.value;
        }
        Export.SettlementReportExport(params).then((data) => {
            if (data.Code == 0) {
                message.success("导出成功");
                window.open(data.Data.FileUrl);
            } else {
                message.error("导出失败");
            }
           
        }).catch(() => {
            message.error("导出失败");
        });
    };
    columns = [{
        title: '企业',
        dataIndex: 'PositionName',
        render: (value, record, index) => {
            const obj = {
              children: value,
              props: {}
            };
            if (index == 0) {
                let size = 0;
                let indexs = 0;
                this.props.SettlementForm.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.PositionName === item.PositionName) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size; 
            } else if (index > 0 && record.PositionName !== this.props.SettlementForm.RecordList[index - 1].PositionName) {
                let size = 0;
                let indexs = 0;
                this.props.SettlementForm.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.PositionName === item.PositionName) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size; 
            } else {
              obj.props.rowSpan = 0;
            }
            return obj;
        }
      }, {
        title: '签到人数',
        dataIndex: 'RecruitCheckInNumber',
        render: (value, record, index) => {
            const obj = {
              children: value,
              props: {}
            };
            if (index == 0) {
                let size = 0;
                let indexs = 0;
                this.props.SettlementForm.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.PositionName === item.PositionName) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size; 
            } else if (index > 0 && record.PositionName !== this.props.SettlementForm.RecordList[index - 1].PositionName) {
                let size = 0;
                let indexs = 0;
                this.props.SettlementForm.RecordList.map((item, index) => {
                    if (index - indexs > 1) {
                    } else {
                        if (record.PositionName === item.PositionName) {
                            size += 1;
                        }
                        indexs = index;
                    }
                });
                obj.props.rowSpan = size; 
            } else {
              obj.props.rowSpan = 0;
            }
            return obj;
        }
      }, {
        title: '劳务公司',
        dataIndex: 'ShortName'
      }, {
        title: '面试',
        children: [{
            title: '分配人数',
            dataIndex: 'LaborCheckInNumber',
            key: 'LaborCheckInNumber'
        }, {
            title: '分配比率',
            dataIndex: 'LaborNumberInRecruit',
            key: 'LaborNumberInRecruit'
        }]
      }, {
        title: '业务处理',
        children: [{
            title: '通过人数',
            dataIndex: 'PassInterviewNumber',
            key: 'PassInterviewNumber'
        }, {
            title: <Tooltip placement="bottom" title={PassInterviewInCheckIn}>
            <span>通过率</span>{ICON}
          </Tooltip>,
            dataIndex: 'PassInterviewInCheckIn',
            key: 'PassInterviewInCheckIn'
        }]
      }, {
        title: '客服回访',
        children: [{
            title: '入职人数',
            dataIndex: 'JoinRecruitNumber',
            key: 'JoinRecruitNumber'
        }, {
            title: <Tooltip placement="bottom" title={JoinRecruitInCheckIn}>
            入职率{ICON}
          </Tooltip>,
            dataIndex: 'JoinRecruitInCheckIn',
            key: 'JoinRecruitInCheckIn'
        }]
      }, {
        title: <Tooltip placement="bottom" title={WaitSettlement}> 
        结算{ICON}
      </Tooltip>,
        children: [{
            title: <Tooltip placement="bottom" title={WaitSettlementNumber}>
            未结算人数{ICON}
          </Tooltip>,
            dataIndex: 'WaitSettlementNumber',
            key: 'WaitSettlementNumber'
        }, {
            title: <Tooltip placement="bottom" title={HadSettlementNumber}>
            在职人数{ICON}
          </Tooltip>,
            dataIndex: 'HadSettlementNumber',
            key: 'HadSettlementNumber'
        }, {
            title: <Tooltip placement="bottom" title={HadSettlementInJoin}>
            利润率{ICON}
          </Tooltip>,
            dataIndex: 'HadSettlementInJoin',
            key: 'HadSettlementInJoin'
        }]
      }, {
        title: <Tooltip placement="bottom" title={AllOkInFromLabor}>
        预收 {ICON}
      </Tooltip>,
        dataIndex: 'AllOkInFromLabor',
        key: 'AllOkInFromLabor'
      }, {
        title: <Tooltip placement="bottom" title={RealInFromLabor}>
        实收 {ICON}
      </Tooltip>,
        dataIndex: 'RealInFromLabor',   
        key: 'RealInFromLabor'
      }, {
        title: <Tooltip placement="bottom" title={RealOutToUser}>  
        实付{ICON}
      </Tooltip>,
        dataIndex: 'RealOutToUser',
        key: 'RealOutToUser'
      }, {
        title: <Tooltip placement="bottom" title={FromLaborCutOutToUser}>
        盈亏 {ICON}
      </Tooltip>,
        dataIndex: 'FromLaborCutOutToUser',
        key: 'FromLaborCutOutToUser'
      }];
      
    render() {
        let {RecordCount, pageSize, page} = this.props.SettlementForm;
        return (
            <div className="recruitment-info-view">
                
                <div className="ivy-page-title" style={{position: 'relative'}}>
                    <h1>结算报表</h1> 
                </div>
                <div style={{background: "#fff", margin: "20px", padding: "20px"}} className='assistance-page-view'>
                    <SettlementForm 
                        SettlementForm={this.props.SettlementForm}
                        common={this.props.common}
                        queryParams={this.props.SettlementForm.queryParams}
                        />
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "0 0 15px"}}>
                        <div>
                            <span style={{width: "20px", 
                                height: "20px", 
                                borderRadius: "50%", 
                                display: "inline-block",
                                border: "1px solid",
                                textAlign: "center",
                                lineHeight: "17px",
                                color: "#fff",
                                background: "#108ee9a1",
                                fontWeight: "900",
                                margin: "0 10px 0 0"
                                }}>i</span>
                                <span>报表仅统计我打企业，数据截止到昨日。</span>
                        </div>
                        <div>
                            <Button onClick={this.handleTableOperate} >导出</Button>
                            <Tooltip placement="bottom" title={handleTableOperate}>
                                {ICON}
                            </Tooltip>
                        </div>
                    </div>
                    <Table
                        pagination={{
                            total: RecordCount,
                            defaultPageSize: pageSize,
                            defaultCurrent: page,
                            current: page,
                            pageSize: pageSize,
                            pageSizeOptions: ['10', '50', '100', "200"],
                            onChange: (page, pageSize) => this.onChange(page, pageSize),
                            onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize),
                            showTotal: (total, range) => {
                              return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                            },
                            showSizeChanger: true,
                            showQuickJumper: true
                          }}
                        bordered
                        rowKey="SPBossID"
                        columns={this.columns}
                        dataSource={this.props.SettlementForm.RecordList} />
                </div>
            </div>
            
        );
    }
}
