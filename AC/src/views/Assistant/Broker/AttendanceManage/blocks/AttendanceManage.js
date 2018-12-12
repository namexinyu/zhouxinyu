import React from 'react';
import {Card, Row, Col, Button, Table, Alert, message, Form, Select, Radio, Modal, Icon, notification} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
// 业务相关
import 'LESS/pages/attendance-manage-view.less';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import BrokerAction from 'ACTION/Assistant/BrokerAction';
import CommonAction from 'ACTION/Assistant/CommonAction';
import {getAuthority} from 'CONFIG/DGAuthority';
import BrokerService from 'SERVICE/Assistant/BrokerService';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class AttendanceManage extends React.PureComponent {
    constructor(props) {
        super(props);
        const auth = getAuthority();
        console.log('hello hahha', auth);
        this.auth = auth;
        this.formItems = [
            {
                name: 'Date',
                label: "排班日期",
                allowClear: false,
                itemType: 'DatePicker'
            }, {
                name: 'DepartID',
                label: '部门',
                itemType: 'Select',
                type: 'enum',
                noAll: false,
                enum: this.auth.eAuthDepartment,
                initValue: -9999

            }, {name: 'HubName', label: "门店", itemType: 'Input', initValue: ''}
        ];
        this.IsManager = auth.IsManager || auth.IsBoss;
        let data = props.list;
        let d_d_v = data.queryParams.Date.value;
        let d_d = d_d_v && moment(d_d_v).isValid() ? moment(d_d_v) : moment();
        this.c_c_d_e = ['--', '--', '--', '--', '--', '--', '--'];
        this.c_c_d = [].concat(this.c_c_d_e);
        [0, 1, 2, 3, 4, 5, 6].forEach((v) => {
            this.c_c_d[v] = d_d.weekday(v).format('YYYY-MM-DD');
        });
        if (auth.eAuthDepartment && Object.keys(auth.eAuthDepartment).length > 0 && props.list.queryParams.DepartID && props.list.queryParams.DepartID.value == -9999) {
           
        }   
    }

    componentWillMount() {
        CommonAction.GetHubList();
        CommonAction.GetBrokerSimpleList();
        this.doQuery(this.props.list);
    }

    componentWillReceiveProps(nextProps) {
        // 翻页
        // if (nextProps.list.pageParam !== this.props.list.pageParam) {
        //     this.doQuery(nextProps.list);
        // }
        const nextDepartID = nextProps.list.queryParams.DepartID.value;
        const curDepartID = this.props.list.queryParams.DepartID.value;
        if (nextDepartID != -9999 && curDepartID == -9999) {
            this.doQuery(nextProps.list);
        }
        const nextCreateStatus = nextProps.list.CreateAttendanceDataFetch.status;
        const curCreateStatus = this.props.list.CreateAttendanceDataFetch.status;
        if (nextCreateStatus == 'success' && curCreateStatus != 'success') {
            message.destroy();
            message.info('编辑成功');
            if (this.oriParam) {
                BrokerAction.GetAttendanceList(this.oriParam);
            }
        } else if (nextCreateStatus == 'error' && curCreateStatus != 'error') {
            const { list: {CreateAttendanceDataFetch: { response } } } = nextProps;

            if (response.Code === 99999) {// 经纪人名下的会员数超过3000不允许修改排班
                message.info(response.Desc.split('|').filter(item => item.trim()).join('，') + '资源总数超过3000，不能安排排班', 5);
                if (this.oriParam) {
                    BrokerAction.GetAttendanceList(this.oriParam);
                }
            } else {
                message.destroy();
                message.error('编辑失败');
            }
        }
    }

    doQuery(d) {
        let data = d || this.props.list;
        let d_d_v = data.queryParams.Date.value;
        let d_d = d_d_v && moment(d_d_v).isValid() ? moment(d_d_v) : moment();
        let d_d_b = d_d.weekday(0).format('YYYY-MM-DD');
        let d_d_e = d_d.weekday(6).format('YYYY-MM-DD');
        this.c_c_d = [].concat(this.c_c_d_e);
        [0, 1, 2, 3, 4, 5, 6].forEach((v) => {
            this.c_c_d[v] = d_d.weekday(v).format('YYYY-MM-DD');
        });
        let DepartID = data.queryParams.DepartID.value - 0;
        DepartID = DepartID == -9999 ? 0 : DepartID;
        let param = {
            StartDate: d_d_b,
            StopDate: d_d_e,
            BrokerDepartID: DepartID,
            HubName: data.queryParams.HubName.value
        };
        this.oriParam = Object.assign({}, param);
        // param.EmployeeID = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
        BrokerAction.GetAttendanceList(param);
    }

    handleSetParam(param, value, type) {
        let data = this.props.list;
        setParams(data.state_name, {[type]: Object.assign({}, data[type], {[param]: value})});
    }

    handleSaveChangeData() {
        let data = this.props.list;
        let res = [];
        if (!this.c_c_d) return;
        data.RecordList.forEach((v) => {
            if (v.NewData && v.HubID) {
                for (let d_k of this.c_c_d) {
                    let b_r_l = (v[d_k] || []).length;
                    for (let b_i = 0; b_i < b_r_l; b_i++) {
                        const b_b = v[d_k][b_i];
                        if (b_b.BrokerID != undefined && b_b.BrokerID != null) {
                            res.push({HubID: v.HubID, BrokerID: b_b.BrokerID, Date: d_k});
                        }
                    }
                }
            } else if (v.HubID) {
                (v.ColumnList || []).forEach((r_d) => {
                    (r_d.BrokerList || []).forEach((b_d) => {
                        if (b_d.NewBroker && b_d.BrokerID && r_d.Date) {
                            res.push({HubID: v.HubID, BrokerID: b_d.BrokerID, Date: r_d.Date});
                        }
                    });
                });
            }
        });
        // console.log('CreateAttendanceData', res);
        if (res.length > 0) {
            BrokerAction.CreateAttendanceData({RecordList: res});
        } else {
            if (this.oriParam) {
                BrokerAction.GetAttendanceList(this.oriParam);
            }
        }
    }

    handleCancelChangeData() {
        if (this.oriParam) {
            BrokerAction.GetAttendanceList(this.oriParam);
        }
    }

    handleChangeData() {
        // this.handleNewData();
        let data = this.props.list;
        let d_d = {
            NewData: true,
            HubID: undefined
        };
        if (this.c_c_d) {
            this.c_c_d.forEach(v => {
                d_d[v] = [];
            });
            setParams(data.state_name, {Editing: true, RecordList: data.RecordList.concat([d_d])});
        }
    }

    handleExportData() {

    }

    render() {
        let data = this.props.list;
        let {HubSimpleList, BrokerSimpleList} = this.props.common;
        // console.log('HubSimpleList', HubSimpleList);
        // console.log(this.IsManager, this.c_c_d);
        return (
            <div className="attendance-manage-view">
                <div className="ivy-page-title">
                    <h1>门店排班</h1>
                </div>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <SearchFrom handleSearch={() => this.doQuery(data)}
                                    queryParams={data.queryParams}
                                    state_name={data.state_name}
                                    formItems={this.formItems}/>
                        {this.IsManager && this.c_c_d && this.c_c_d['1'] ? (
                            <Row className="mb-16">
                                <Button className={!data.Editing ? "display-none" : "mr-8 bg-success border-success"}
                                        type="primary"
                                        onClick={() => this.handleSaveChangeData()}>保存</Button>
                                <Button className={!data.Editing ? "display-none" : "mr-8"}
                                        type="warning"
                                        onClick={() => this.handleCancelChangeData()}>取消</Button>
                                <Button className={data.Editing ? "display-none" : "mr-8"}
                                        type="primary"
                                        onClick={() => this.handleChangeData()}>修改排班</Button>
                                {/* <Button className={data.Editing ? "display-none" : "mr-8"}*/}
                                {/* onClick={() => this.handleExportData()}>导出排班</Button>*/}
                            </Row>
                        ) : ''}
                        <Table columns={this.tableColumns()}
                               rowKey={(record, index) => index}
                               bordered={true}
                               loading={data.RecordListLoading}
                               dataSource={this.tableData()}
                               pagination={false}></Table>
                    </div>
                </div>
            </div>);
    }

    tableData() {
        let data = this.props.list;
        let list = data.RecordList;
        let {HubSimpleList, BrokerSimpleList} = this.props.common;
        let d_d = [];
        // console.log('RecordList', list);
        list.forEach((h) => {
            if (!h.NewData) {
                let i_i = {
                    HubID: h.HubID,
                    HubName: h.HubName
                };
                let l_l = (h.ColumnList || []).length;
                for (let i = 0; i < l_l; i++) {
                    let r_r = h.ColumnList[i];
                    if (this.c_c_d.indexOf(r_r.Date) != -1) {
                        i_i[r_r.Date] = r_r.BrokerList;
                    }
                }
                d_d.push(i_i);
            } else {
                d_d.push(h);
            }
        });
        // if (data.AddData) {
        //     d_d.push(data.AddData);
        // }
        // d_d.push(Object.assign({}, data.AddData, {NewData: false, EmptyData: true}));
        // console.log('tableData', d_d);
        return d_d;
    }

    tableColumns() {
        const w_w = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
        let data = this.props.list;
        let list = data.RecordList;
        let {HubSimpleList, BrokerSimpleList} = this.props.common;
        let DepartBrokerList = [...BrokerSimpleList];
        if (this.oriParam && this.oriParam.BrokerDepartID) {
            DepartBrokerList = DepartBrokerList.filter((v) => v.BrokerDepartID == this.oriParam.BrokerDepartID);
        }
        return [{
            key: 'HubID',
            title: '门店',
            width: '200px',
            render: (record) => {
                if (record.NewData) {
                    return (
                        <Select className="w-100"
                                value={record.HubID ? record.HubID + '' : undefined}
                                onChange={(value) => {
                                    if (data.RecordList.some((v) => v.HubID + '' == value + '')) {
                                        message.destroy();
                                        message.info('该门店已存在本次排班');
                                        return;
                                    }
                                    record.HubID = value - 0;
                                    this.handleChangeData();
                                }}>
                            {HubSimpleList.map((v, i) => {
                                return <Option key={i} value={v.HubID + ''}>{v.HubName}</Option>;
                            })}
                        </Select>);
                }
                return record.HubName;
            }
        }].concat(this.c_c_d.map((v, i) => ({
            title: v,
            children: [{
                key: v,
                title: w_w[i],
                width: 220,
                render: (record) => {
                    if (record.NewData) {
                        let l_l_1 = [];
                        let l_l_2 = [];
                        for (let n_i in record[v]) {
                            let n_n = record[v][n_i];
                            if (n_n.BrokerID) {
                                l_l_1.push(<div className="at-broker-tag" key={n_i}>
                                    <span className="broker-text">{n_n.BrokerTmpName}</span>
                                    <span className="close-text" onClick={() => {
                                        record[v].splice(n_i, 1);
                                        setParams(data.state_name, {tmpObj: {}});
                                    }}><Icon type="close"></Icon></span>
                                </div>);
                            } else {
                                l_l_2.push(
                                    <div key={n_i} className="mb-8">
                                        <AutoCompleteSelect
                                            allowClear={true}
                                            placeholder="选择经纪人"
                                            onChange={(value) => {
                                                if (value && value.value) {
                                                    if (record[v].some((v) => v.BrokerID == value.value)) {
                                                        message.destroy();
                                                        message.info('该经纪人已在本次排班中。');
                                                        return;
                                                    }
                                                    record[v].splice(n_i, 1);
                                                    record[v].push({
                                                        BrokerID: value.value - 0,
                                                        BrokerTmpName: value.text
                                                    });
                                                    setParams(data.state_name, {tmpObj: {}});
                                                }
                                            }}
                                            optionsData={{
                                                valueKey: "BrokerID",
                                                textKey: "BrokerTmpName",
                                                dataArray: DepartBrokerList
                                            }}>
                                        </AutoCompleteSelect>
                                    </div>);
                            }
                        }
                        return (
                            <div>
                                {l_l_1.concat(l_l_2)}
                                <Button type="primary"
                                        className={record.HubID != undefined ? "" : "display-none"}
                                        disabled={record[v].some((v_v) => v_v.BrokerID == undefined)}
                                        onClick={() => {
                                            record[v].push({BrokerID: undefined});
                                            setParams(data.state_name, {tmpObj: {}});
                                        }}>
                                    +
                                </Button>
                            </div>);
                    }
                    // console.log('record[v]', v, record[v]);
                    let b_b_t = [];
                    if (record[v]) {
                        let b_b_1 = [];
                        let b_b_2 = [];
                        let b_b_3 = [];
                        record[v].forEach((b_b, i) => {
                            if (!b_b.NewBroker) {
                                b_b_1.push(
                                    <div className="at-broker-tag-grey" key={i}
                                         onClick={() => {
                                             if (!data.Editing) return;
                                             Modal.confirm({
                                                 title: '要删除' + moment(v).format('YYYY年MM月DD日') + b_b.BrokerName + '(' + b_b.BrokerAccount + ')' + '的排班吗？',
                                                 visible: true,
                                                 onOk: () => {
                                                     BrokerService.DeleteAttendanceData({RecordID: [b_b.RecordID]}).then((res) => {
                                                         if (res && !res.error) {
                                                             message.info('删除成功');
                                                             let l_l_r = data.RecordList.find((l_l_f) => l_l_f.HubID == record.HubID) || {};
                                                             let l_l_d = (l_l_r.ColumnList || []).find((l_l_s) => l_l_s.Date == v) || {};
                                                             l_l_d.BrokerList = (l_l_d.BrokerList || []).filter((l_l_b) => l_l_b.RecordID != b_b.RecordID);
                                                             // record[v].splice(i, 1);
                                                             setParams(data.state_name, {
                                                                 tmpObj: {}
                                                             });
                                                         }
                                                     });
                                                 }
                                             });
                                         }}>
                                            <span className="broker-text">
                                                {b_b.BrokerName + '(' + b_b.BrokerAccount + ')'}</span>
                                        <span className="close-text">{data.Editing ?
                                            <Icon type="close"></Icon> : ''}</span>
                                    </div>);
                            } else {
                                if (data.Editing && b_b.BrokerID) {
                                    b_b_2.push(
                                        <div className="at-broker-tag" key={i}
                                             onClick={() => {
                                                 let l_l_r = data.RecordList.find((l_l_f) => l_l_f.HubID == record.HubID) || {};
                                                 let l_l_d = (l_l_r.ColumnList || []).find((l_l_s) => l_l_s.Date == v) || {};
                                                 l_l_d.BrokerList = (l_l_d.BrokerList || []).filter((l_l_b) => l_l_b.BrokerID != b_b.BrokerID);
                                                 setParams(data.state_name, {
                                                     tmpObj: {}
                                                 });
                                             }}>
                                            <span className="broker-text">
                                                {b_b.BrokerTmpName}</span>
                                            <span className="close-text"><Icon type="close"></Icon></span>
                                        </div>);
                                }
                                if (data.Editing && b_b.BrokerID == undefined) {
                                    b_b_3.push(
                                        <div key={i} className="mb-8">
                                            <AutoCompleteSelect
                                                allowClear={true}
                                                placeholder="选择经纪人"
                                                onChange={(value) => {
                                                    if (value && value.value) {
                                                        if (record[v].some((v) => v.BrokerID == value.value)) {
                                                            message.destroy();
                                                            message.info('该经纪人已在本次排班中。');
                                                            return;
                                                        }
                                                        let l_l_r = data.RecordList.find((l_l_f) => l_l_f.HubID == record.HubID) || {};
                                                        let l_l_d = (l_l_r.ColumnList || []).find((l_l_s) => l_l_s.Date == v) || {};
                                                        l_l_d.BrokerList = (l_l_d.BrokerList || []).filter((l_l_b) => l_l_b.BrokerID != undefined);
                                                        l_l_d.BrokerList.push({
                                                            NewBroker: true,
                                                            BrokerID: value.value - 0,
                                                            BrokerTmpName: value.text
                                                        });
                                                        setParams(data.state_name, {tmpObj: {}});
                                                    }
                                                }}
                                                optionsData={{
                                                    valueKey: "BrokerID",
                                                    textKey: "BrokerTmpName",
                                                    dataArray: DepartBrokerList
                                                }}>
                                            </AutoCompleteSelect>
                                        </div>);
                                }
                            }
                        });
                        b_b_t = [...b_b_1, ...b_b_2, ...b_b_3];
                    }
                    if (data.Editing) {
                        b_b_t.push(<Button type="primary" key={9999}
                                           className={data.Editing ? "" : "display-none"}
                                           disabled={(record[v] || []).some((v_v) => v_v.BrokerID == undefined)}
                                           onClick={() => {
                                               let l_l_r = data.RecordList.find((l_l_f) => l_l_f.HubID == record.HubID) || {};
                                               l_l_r.ColumnList = l_l_r.ColumnList || [];
                                               if (!l_l_r.ColumnList.find((l_l_s) => l_l_s.Date == v)) {
                                                   l_l_r.ColumnList.push({Date: v, BrokerList: []});
                                               }
                                               let l_l_d = l_l_r.ColumnList.find((l_l_s) => l_l_s.Date == v);
                                               l_l_d.BrokerList = l_l_d.BrokerList || [];
                                               l_l_d.BrokerList.push({
                                                   NewBroker: true,
                                                   BrokerID: undefined,
                                                   BrokerTmpName: undefined
                                               });
                                               setParams(data.state_name, {tmpObj: {}});
                                           }}>
                            +
                        </Button>);
                    }
                    return (
                        <div>
                            {b_b_t}
                        </div>
                    );
                }
            }]
        })));
    }
}

export default AttendanceManage;
