import React from 'react';
import {Card, Table} from 'antd';
import ResourceAction from 'ACTION/Broker/Header/Resource';
import {browserHistory} from "react-router";
import Mapping_User from "CONFIG/EnumerateLib/Mapping_User";
import moment from 'moment';

const {GetNoHandleList} = ResourceAction;

class ResourceNoHandle extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            GetNoHandleList();
        }
    }

    handleTableRowKey(record, index, event) {
        record.UserID && browserHistory.push({
            pathname: '/broker/member/detail/' + record.UserID,
            query: {memberName: record.Name || ''}
        });
    }

    render() {
        return (
            <Card bordered={false}>
                <Table
                    rowKey={(record, index) => index} bordered={true} pagination={false}
                    onRowClick={this.handleTableRowKey}
                    columns={[
                        {
                            title: '序号', key: 'seqNo', width: 42,
                            render: (text, record, index) => {
                                // if (record.rowSpan > 1) console.log(record.rowSpan, record.Name);
                                const obj = {
                                    children: (<span>{index + 1}</span>),
                                    props: {
                                        rowSpan: record.rowSpan
                                    }
                                };
                                return obj;
                            }
                        },
                        {
                            title: '会员姓名', dataIndex: 'Name',
                            render: (text, record) => {
                                if (record.rowSpan > 1) console.log(record.rowSpan, record.Name);
                                const obj = {
                                    children: (<span>
                                            {record.Name}
                                        {record.CertStatus === 1 ?
                                            <i className="iconfont icon-iconheji color-warning"/> : ''}
                                                </span>),
                                    props: {
                                        rowSpan: record.rowSpan
                                    }
                                };
                                return obj;
                            }

                        },
                        {title: '手机号码', dataIndex: 'Phone'},
                        {
                            title: '资源来源', dataIndex: 'GetSource', render: text => Mapping_User.eRegSource[text]
                        },
                        {
                            title: '注册时间', dataIndex: 'RegTime',
                            render: text => text ? moment(text).format('YYYY-MM-DD HH:mm') : ''
                        },
                        {
                            title: '获取时间', dataIndex: 'GetTime',
                            render: text => text ? moment(text).format('YYYY-MM-DD HH:mm') : ''
                        }
                    ]}
                    dataSource={this.transferTableData(this.props.noHandleDataList)}
                    loading={this.props.noHandleDataListLoading}/>
            </Card>
        );
    }

    transferTableData = (list = []) => {
        let r_r = [];
        for (let v of list) {
            if (!v.AccountList) continue;
            let len = v.AccountList.length;
            for (let i_i in v.AccountList) {
                let a = v.AccountList[i_i];
                if (len > 1) {
                    if (i_i == 0) a.rowSpan = len;
                    else a.rowSpan = 0;
                } else {
                    a.rowSpan = 1;
                }
                a.Name = v.Name;
                a.CertStatus = v.CertStatus;
                r_r.push(a);
            }
        }
        return r_r;
    }
}

export default ResourceNoHandle;