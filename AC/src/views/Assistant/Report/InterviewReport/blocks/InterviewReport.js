import React from 'react';
import {Card, Row, Col, Button, Table, Alert, message} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import 'LESS/pages/interview-report-view.less';
// 业务相关
import ReportAction from 'ACTION/Assistant/ReportAction';
import {getAuthority} from 'CONFIG/DGAuthority';
import QueryListTable from 'COMPONENT/QueryListPage/QueryListTable';


class InterviewReport extends React.PureComponent {
    constructor(props) {
        super(props);
        const auth = getAuthority();
        this.formItems = [
            {
                name: 'Date',
                label: "统计日期",
                itemType: 'DatePicker'
            },
            {
                name: 'DepartID',
                label: "部门",
                itemType: 'Select',
                noAll: true,
                // rules: [{pattern: /^\d{1,}$/, message: '必须选择一个部门'}],
                type: 'enum',
                enum: auth && auth.eDepartment ? auth.eDepartment : {}
            }
        ];
        // if (auth.eDepartment && Object.keys(auth.eDepartment).length > 0 && props.list.queryParams.DepartID && props.list.queryParams.DepartID.value == -9999) {
        //     setParams(props.list.state_name, {queryParams: Object.assign({}, props.list.queryParams, {DepartID: {value: Object.keys(auth.eDepartment)[0] + ''}})});
        // }
    }

    componentWillMount() {
        this.doQuery(this.props.list);
    }

    componentWillReceiveProps(nextProps) {
        // 翻页
        // if (nextProps.list.pageParam !== this.props.list.pageParam) {
        //     this.doQuery(nextProps.list);
        // }
        const nextDepartID = nextProps.list.queryParams.DepartID.value;
        const curDepartID = this.props.list.queryParams.DepartID.value;
        // if (nextDepartID != -9999 && curDepartID == -9999) {
        //     this.doQuery(nextProps.list);
        // }
    }


    doQuery(d) {
        let data = d || this.props.list;
        let d_d = data.queryParams.Date.value;
        let param = {
            Date: d_d && moment(d_d).isValid() ? moment(d_d).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            // DepartID: data.queryParams.DepartID.value == -9999 ? 0 : data.queryParams.DepartID.value - 0
            DepartID: data.queryParams.DepartID.value - 0
        };
        param.EmployeeID = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
        ReportAction.RptGetInterviewList(param);
    }

    render() {
        let data = this.props.list;
        return (
            <div className="interview-report-view">
                <div className="ivy-page-title">
                    <h1>每日面试统计</h1>
                </div>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <SearchFrom handleSearch={() => this.doQuery(data)}
                                    queryParams={data.queryParams}
                                    state_name={data.state_name}
                                    formItems={this.formItems}/>
                        <div className="alert-container">
                            <div className="alert-div">
                                <div className="line-1">总计</div>
                                <div className="line-2 color-success">
                                    {data.InterviewTotal != null && data.InterviewTotal != undefined ? data.InterviewTotal : '--'}</div>
                                <div className="line-3">总共完成的面试数</div>
                            </div>
                            <div className="alert-div">
                                <div className="line-1">人数</div>
                                <div className="line-2 color-danger">{data.BrokerTotal ? data.BrokerTotal : '--'}</div>
                                <div className="line-3">部门经纪人数</div>
                            </div>
                            <div className="alert-div">
                                <div className="line-1">人均</div>
                                <div className="line-2 color-success">
                                    {data.BrokerTotal ? (data.InterviewTotal / data.BrokerTotal).FormatMoney({fixed: 2}) : '--'}</div>
                                <div className="line-3">平均面试数</div>
                            </div>
                        </div>
                        {/* dataSource={this.tableData(data.GroupList)}*/}
                        <QueryListTable columns={this.tableColumns(data.RecordList)}
                                        rowKey={(record, index) => index}
                                        bordered={true}
                                        loading={data.RecordListLoading}
                                        dataSource={this.tableData(data.RecordList)}
                                        scroll={{x: (data.RecordList.length * 400) > 1600 ? (data.RecordList.length * 400) : 1600}}
                                        pagination={false}
                        ></QueryListTable>
                    </div>
                </div>
            </div>);
    }

    tableData(list = []) {
        let d_d_e = ['--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--'];
        let d_d_r2 = [].concat(d_d_e);
        let f_e_e = (t, c_c) => {
            return (<div className={c_c}>{t}</div>);
        };
        let f_t_t = (r, f, c_c) => {
            return r.reduce((t, v, i) => {
                t[i + ''] = f ? f(v, c_c) : v;
                return t;
            }, {});
        };
        // if (list.length > 4) list = list.slice(0, 4);
        const len = Math.max(...list.map((v) => (v.GroupDetailList || []).length));
        let d_d_t = Array.from({length: len}).map(() => [].concat(d_d_e));
        // console.log('tableData ', len, list.map((v) => (v.GroupDetailList || []).length));
        for (let i = 0; i < list.length; i++) {
            const g_g = list[i];
            const g_g_dl = g_g.GroupDetailList || [];
            const g_g_dl_l = g_g_dl.length;
            d_d_r2[i * 4] = '段位';
            d_d_r2[i * 4 + 1] = '工号';
            d_d_r2[i * 4 + 2] = '经纪人';
            d_d_r2[i * 4 + 3] = '面试';
            for (let n = 0; n < len; n++) {
                let d_d_rx = d_d_t[n];
                const g_g_r = g_g_dl_l >= n ? g_g_dl[n] || {} : {};
                d_d_rx[i * 4] = g_g_r.RankName;
                d_d_rx[i * 4 + 1] = g_g_r.BrokerAccount;
                d_d_rx[i * 4 + 2] = g_g_r.BrokerNickName;
                d_d_rx[i * 4 + 3] = g_g_r.InterviewCount !== 0 ? g_g_r.InterviewCount : f_e_e(g_g_r.InterviewCount, 'td-div rbg-red');
            }
        }
        // d_d_t.splice(0, 0, f_t_t(d_d_r1, f_e_e, 'color-yellow'));
        // d_d_t.splice(0, 0, f_t_t(d_d_r2));
        d_d_t = d_d_t.map((a_a) => {
            return a_a.reduce((t, v, i) => {
                t[i + ''] = v;
                return t;
            }, {});
        });
        return d_d_t;
    }

    tableColumns(list = []) {
        // let d_d_Arr = ['abc', 'abc', 'abc', 'abc'];
        // let d_d_r1 = ['123', '123', '123', '123', '123', '123', '123', '123', '123', '123', '123', '123'];
        let d_d_Arr = ['--', '--', '--', '--'];
        let d_d_e = ['--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--'];
        let d_d_r1 = [].concat(d_d_e);
        let d_d_r2 = [].concat(d_d_e);
        let f_e_e = (t, c_c) => {
            return (<div className={c_c}>{t}</div>);
        };
        for (let i = 0; i < list.length; i++) {
            d_d_Arr[i] = list[i].GroupName;
            d_d_r1[i * 4] = '总计';
            d_d_r1[i * 4 + 1] = f_e_e(list[i].GroupInterviewTotal, 'rc-orange');
            d_d_r1[i * 4 + 2] = '人均';
            d_d_r1[i * 4 + 3] = f_e_e(list[i].GroupBrokerTotal ? (list[i].GroupInterviewTotal / list[i].GroupBrokerTotal).FormatMoney({fixed: 2}) : 0, 'rc-orange');
            d_d_r2[i * 4] = '段位';
            d_d_r2[i * 4 + 1] = '工号';
            d_d_r2[i * 4 + 2] = '经纪人';
            d_d_r2[i * 4 + 3] = '面试';
        }
        const r_r = d_d_Arr.map((v, i) => {
            const i_4_0 = i * 4;
            const i_4_1 = i * 4 + 1;
            const i_4_2 = i * 4 + 2;
            const i_4_3 = i * 4 + 3;
            return {
                title: v,
                // children: [
                //     {dataIndex: i_4_0, key: i_4_0 + '', title: d_d_r1[i_4_0]},
                //     {dataIndex: i_4_1, key: i_4_1 + '', title: d_d_r1[i_4_1]},
                //     {dataIndex: i_4_2, key: i_4_2 + '', title: d_d_r1[i_4_2]},
                //     {dataIndex: i_4_3, key: i_4_3 + '', title: d_d_r1[i_4_3]}
                // ]
                children: [
                    {
                        title: d_d_r1[i_4_0],
                        children: [{dataIndex: i_4_0, width: 100, key: i_4_0 + '', title: d_d_r2[i_4_0]}]
                    },
                    {
                        title: d_d_r1[i_4_1],
                        children: [{dataIndex: i_4_1, width: 100, key: i_4_1 + '', title: d_d_r2[i_4_1]}]
                    },
                    {
                        title: d_d_r1[i_4_2],
                        children: [{dataIndex: i_4_2, width: 100, key: i_4_2 + '', title: d_d_r2[i_4_2]}]
                    },
                    {
                        title: d_d_r1[i_4_3],
                        children: [{dataIndex: i_4_3, width: 100, key: i_4_3 + '', title: d_d_r2[i_4_3]}]
                    }
                ]
            };
        });
        console.log('tableColumn', r_r);
        return r_r;
    }
}

export default InterviewReport;