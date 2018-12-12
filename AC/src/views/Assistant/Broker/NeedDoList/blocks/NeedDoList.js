import React from 'react';
import {Form, Row, Col, Button, Input, Alert, Select, Table, DatePicker, message} from 'antd';
import setParams from "ACTION/setParams";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
import SearchFrom from "COMPONENT/SearchForm/index";
import {browserHistory} from 'react-router';
// 业务相关
import BrokerAction from 'ACTION/Assistant/BrokerAction';
import BoardAction from 'ACTION/Assistant/BoardAction';
import {getAuthority} from 'CONFIG/DGAuthority';

const Option = Select.Option;

export default class NeedDoList extends React.PureComponent {
    constructor(props) {
        super(props);
        // 1	一键来接 2	明日预签到 3	报名 4	关注 5	提问 6	反馈 7	被推荐 8	提醒打卡
        this.eMsgType = {
            1: '一键来接',
            2: '明日预签到',
            3: '报名',
            4: '关注',
            5: '提问',
            6: '反馈',
            7: '被推荐',
            8: '提醒打卡'
        };
        this.eWorkStatus = {
            1: '工作中',
            2: '休息中'
        };
        this.auth = getAuthority();
        this.formItems = [
            {name: 'MsgType', label: "待办类型", itemType: 'Checkbox', enum: this.eMsgType, colSpan: 4, offset: 0},
            {name: 'CreateDate', label: "日期", itemType: 'DatePicker', placeholder: '选择日期'},
            {name: 'BrokerAccount', label: "经纪人", itemType: 'Input', placeholder: '输入工号'},
            {
                name: 'WorkStatus',
                label: "工作状态",
                itemType: 'Select',
                type: 'enum',
                enum: this.eWorkStatus
            }
        ];
        if (this.auth.ShowDG) this.formItems.splice(2, 0, {
            name: 'DG',
            label: "部门/组",
            itemType: 'Cascader',
            options: this.auth.DGList,
            placeholder: '选择部门/组'
        });
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.doQuery(this.props.list);
        }

    }

    componentWillReceiveProps(nextProps) {
        let nextData = nextProps.list;
        let curData = this.props.list;
        // 翻页
        if (nextData.pageParam != curData.pageParam) {
            this.doQuery(nextData);
        }
    }

    handleSearch() {
        let data = this.props.list;
        if (data.pageParam.currentPage == 1) {
            this.doQuery(data);
        } else {
            let pageParam = {...data.pageParam};
            pageParam.currentPage = 1;
            setParams(data.state_name, {pageParam});
        }
    }

    doQuery(d) {
        let data = d || this.props.list;
        let param = {};
        Object.keys(data.queryParams).map((key) => {
            if (['WorkStatus'].indexOf(key) != -1) {
                param[key] = data.queryParams[key].value - 0;
            } else {
                param[key] = data.queryParams[key].value;
            }
        });
        // DG
        if (param.DG && param.DG.length > 0) {
            param.BrokerDepartID = param.DG[0];
            if (param.DG.length == 2) param.GroupID = param.DG[1];
            else param.GroupID = -9999;
        } else {
            param.GroupID = -9999;
            param.BrokerDepartID = -9999;
        }
        delete param.DG;
        param.CreateDate = param.CreateDate && moment(param.CreateDate).isValid() ? moment(param.CreateDate).format("YYYY-MM-DD") : '';
        param.MsgType = param.MsgType.map((item) => item - 0);
        let p = {
            RecordIndex: data.pageParam.pageSize * (data.pageParam.currentPage - 1),
            RecordSize: data.pageParam.pageSize,
            EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
            QueryParams: Object.keys(param).reduce((list, key) => {
                if (key == 'MsgType') {
                    if (param[key].length > 0 && param[key].length < 8) {
                        param[key].forEach((item) => {
                            list.push({Key: key, Value: item});
                        });
                    }
                } else if (['GroupID', 'BrokerDepartID', 'WorkStatus'].indexOf(key) != -1) {
                    if (param[key] != -9999) {
                        list.push({Key: key, Value: param[key]});
                    }
                } else if (param[key]) {
                    list.push({Key: key, Value: param[key]});
                }
                return list;
            }, []),
            OrderParams: [{Key: 'CreateTime', Order: 1}]
        };
        BrokerAction.GetNeedDoAllList(p);
    }

    handleRowClick(record) {
        browserHistory.push({
            pathname: '/ac/broker/need-do-detail',
            query: {BrokerID: record.BrokerID}
        });
    }

    render() {
        let data = this.props.list;
        return (
            <div className='callback-entry-view'>
                <div className="ivy-page-title" style={{position: 'relative'}}>
                    <h1>待办列表</h1>
                    <span className="i-refresh" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-20">
                            <SearchFrom handleSearch={() => this.handleSearch()}
                                        dataSource={{DGList: this.props.DGList}}
                                        state_name={data.state_name}
                                        queryParams={data.queryParams}
                                        formItems={this.formItems}></SearchFrom>
                            <Table columns={this.tableColumns()}
                                   rowKey={(record, index) => index}
                                   dataSource={data.RecordList}
                                   loading={data.RecordListLoading}
                                   onRowClick={this.handleRowClick}
                                   pagination={{
                                       total: data.RecordCount,
                                       pageSize: data.pageParam.pageSize,
                                       current: data.pageParam.currentPage,
                                       onChange: (page, pageSize) => setParams(data.state_name, {
                                           pageParam: {currentPage: page, pageSize: pageSize}
                                       }),
                                       onShowSizeChange: (current, size) => setParams(data.state_name, {
                                           pageParam: {currentPage: current, pageSize: size}
                                       }),
                                       showSizeChanger: true,
                                       showQuickJumper: true,
                                       showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                                   }}></Table>
                        </div>
                    </div>
                </Row>
            </div>
        );
    }

    tableColumns() {
        const data = this.props.list;
        return [
            {
                title: '经纪人', dataIndex: 'BrokerName'
            },
            {title: '工号', dataIndex: 'BrokerAccount'},
            {title: '未处理待办', dataIndex: 'UnHandleNum'},
            {title: '已处理待办', dataIndex: 'HandleNum'},
            {
                title: '工作状态', key: 'WorkStatus', render: (text, record) => {
                return (<div>{this.eWorkStatus[record.WorkStatus] || ''}</div>);
            }
            },
            {title: '段位', dataIndex: 'RankName'},
            {
                title: '生成时间', key: 'CreateTime',
                render: (text, record) => record.CreateTime && moment(record.CreateTime).isValid() ? moment(record.CreateTime).format('MM/DD HH:mm') : ''
            }

        ];
    }
}