import React from 'react';
import {Card, Row, Col, Button, Table, Alert, message} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import 'LESS/pages/interview-report-view.less';
// 业务相关
import BrokerAction from 'ACTION/Assistant/BrokerAction';
import {getAuthority} from 'CONFIG/DGAuthority';
import QueryListTable from 'COMPONENT/QueryListPage/QueryListTable';


class SignInterviewCount extends React.PureComponent {
    constructor(props) {
        super(props);
        const auth = getAuthority();
        const eDepartment = {...((auth || {}).eDepartment || {})};
        if (eDepartment[-9999]) delete eDepartment[-9999];
        this.formItems = [
            // {
            //     name: 'Date',
            //     label: "统计日期",
            //     itemType: 'DatePicker'
            // },
            {
                name: 'DepartID',
                label: "部门",
                itemType: 'Select',
                noAll: true,
                rules: [{pattern: /^\d{1,}$/, message: '必须选择一个部门'}],
                type: 'enum',
                enum: eDepartment
            }
        ];
        if (auth.eDepartment && Object.keys(auth.eDepartment).length > 0 && props.list.queryParams.DepartID && props.list.queryParams.DepartID.value == -9999) {
            setParams(props.list.state_name, {queryParams: Object.assign({}, props.list.queryParams, {DepartID: {value: Object.keys(auth.eDepartment)[0] + ''}})});
        }
    }

    // componentWillMount() {
    //     this.doQuery(this.props.list);
    // }

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
    }


    doQuery(d) {
        let data = d || this.props.list;
        let d_d = data.queryParams.Date.value;
        let param = {
            // Date: d_d && moment(d_d).isValid() ? moment(d_d).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
            DepartID: data.queryParams.DepartID.value - 0
        };
        param.EmployeeID = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
        BrokerAction.GetSignInterviewCount(param);
    }

    render() {
        let data = this.props.list;
        return (
            <div className="interview-report-view">
                <div className="ivy-page-title">
                    <h1>实时数据</h1>
                </div>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <SearchFrom handleSearch={() => this.doQuery(data)}
                                    queryParams={data.queryParams}
                                    state_name={data.state_name}
                                    formItems={this.formItems}/>
                        <div className="alert-container">
                            <div className="alert-div">
                                <div className="line-1">昨日预接站</div>
                                <div className="line-2 color-warning">
                                    {data.PreCheckinAddrCountYesterday != undefined ? data.PreCheckinAddrCountYesterday : '--'}</div>
                                <div className="line-3">总数</div>
                            </div>
                            <div className="alert-div">
                                <div className="line-1">昨日面试</div>
                                <div className="line-2 color-success">
                                    {data.InterviewCountYesterday != undefined ? data.InterviewCountYesterday : '--'}</div>
                                <div className="line-3">总数</div>
                            </div>
                            <div className="alert-div">
                                <div className="line-1">今日预接站</div>
                                <div className="line-2 color-warning">
                                    {data.PreCheckinAddrCountToday != undefined ? data.PreCheckinAddrCountToday : '--'}</div>
                                <div className="line-3">总数</div>
                            </div>
                            <div className="alert-div">
                                <div className="line-1">今日面试</div>
                                <div className="line-2 color-success">
                                    {data.InterviewCountToday != undefined ? data.InterviewCountToday : '--'}</div>
                                <div className="line-3">总数</div>
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
        for (let i = 0; i < list.length; i++) {
            const g_g = list[i];
            const g_g_dl = g_g.GroupDetailList || [];
            const g_g_dl_l = g_g_dl.length;
            d_d_r2[i * 7] = '段位';
            d_d_r2[i * 7 + 1] = '工号';
            d_d_r2[i * 7 + 2] = '经纪人';
            d_d_r2[i * 7 + 3] = '面试';
            for (let n = 0; n < len; n++) {
                let d_d_rx = d_d_t[n];
                const g_g_r = g_g_dl_l >= n ? g_g_dl[n] || {} : {};
                d_d_rx[i * 7] = g_g_r.RankName;
                // d_d_rx[i * 7 + 1] = g_g_r.BrokerAccount;
                d_d_rx[i * 7 + 1] = g_g_r.BrokerNickName ? g_g_r.BrokerNickName + '(' + g_g_r.BrokerAccount + ')' : '';
                d_d_rx[i * 7 + 2] = g_g_r.InterviewCountYesterday;
                d_d_rx[i * 7 + 3] = g_g_r.PreCheckinAddrCountYesterday;
                d_d_rx[i * 7 + 4] = g_g_r.NotInterviewCountToday;
                d_d_rx[i * 7 + 5] = g_g_r.InterviewCountToday;
                d_d_rx[i * 7 + 6] = g_g_r.PreCheckinAddrCountToday;
            }
        }
        d_d_t = d_d_t.map((a_a) => {
            return a_a.reduce((t, v, i) => {
                t[i + ''] = v;
                return t;
            }, {});
        });
        // d_d_t.splice(0, 0, f_t_t(d_d_r1, f_e_e, 'color-yellow'));
        // d_d_t.splice(0, 0, f_t_t(d_d_r2));
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
            d_d_r1[i * 7] = '总计';
            // d_d_r1[i * 7 + 1] = '';
            d_d_r1[i * 7 + 1] = '';
            d_d_r1[i * 7 + 2] = list[i].InterviewCountYesterday;
            d_d_r1[i * 7 + 3] = list[i].PreCheckinAddrCountYesterday;
            d_d_r1[i * 7 + 4] = list[i].NotInterviewCountToday;
            d_d_r1[i * 7 + 5] = list[i].InterviewCountToday;
            d_d_r1[i * 7 + 6] = list[i].PreCheckinAddrCountToday;
            d_d_r2[i * 7] = '段位';
            // d_d_r2[i * 7 + 1] = '工号';
            d_d_r2[i * 7 + 1] = '经纪人';
            d_d_r2[i * 7 + 2] = '面试Y';
            d_d_r2[i * 7 + 3] = '御接Y';
            d_d_r2[i * 7 + 4] = '未到T';
            d_d_r2[i * 7 + 5] = '面试T';
            d_d_r2[i * 7 + 6] = '预接T';
        }
        const r_r = d_d_Arr.map((v, i) => {
            const i_4_0 = i * 7;
            const i_4_1 = i * 7 + 1;
            const i_4_2 = i * 7 + 2;
            const i_4_3 = i * 7 + 3;
            const i_4_4 = i * 7 + 4;
            const i_4_5 = i * 7 + 5;
            const i_4_6 = i * 7 + 6;
            // const i_4_7 = i * 7 + 7;
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
                        title: d_d_r2[i_4_0],
                        children: [{
                            dataIndex: i_4_0,
                            width: 65,
                            key: i_4_0 + '',
                            className: 'text-center',
                            title: d_d_r1[i_4_0]
                        }]
                    },
                    {
                        title: d_d_r2[i_4_1],
                        children: [{
                            dataIndex: i_4_1,
                            width: 110,
                            key: i_4_1 + '',
                            className: 'text-center',
                            title: d_d_r1[i_4_1]
                        }]
                    },
                    {
                        title: d_d_r2[i_4_2],
                        children: [{
                            dataIndex: i_4_2,
                            width: 45,
                            key: i_4_2 + '',
                            className: 'text-center',
                            title: d_d_r1[i_4_2]
                        }]
                    },
                    {
                        title: d_d_r2[i_4_3],
                        children: [{
                            dataIndex: i_4_3,
                            width: 45,
                            key: i_4_3 + '',
                            className: 'text-center',
                            title: d_d_r1[i_4_3]
                        }]
                    },
                    {
                        title: d_d_r2[i_4_4],
                        children: [{
                            dataIndex: i_4_4,
                            width: 45,
                            key: i_4_4 + '',
                            className: 'text-center',
                            title: d_d_r1[i_4_4]
                        }]
                    },
                    {
                        title: d_d_r2[i_4_5],
                        children: [{
                            dataIndex: i_4_5,
                            width: 45,
                            key: i_4_5 + '',
                            className: 'text-center',
                            title: d_d_r1[i_4_5]
                        }]
                    },
                    {
                        title: d_d_r2[i_4_6],
                        children: [{
                            dataIndex: i_4_6,
                            width: 45,
                            key: i_4_6 + '',
                            className: 'text-center',
                            title: d_d_r1[i_4_6]
                        }]
                    }
                    // {
                    //     title: d_d_r2[i_4_7],
                    //     children: [{dataIndex: i_4_7, key: i_4_7 + '', className: 'text-center', title: d_d_r1[i_4_7]}]
                    // }
                ]
            };
        });
        console.log('tableColumn', r_r);
        return r_r;
    }
}

export default SignInterviewCount;