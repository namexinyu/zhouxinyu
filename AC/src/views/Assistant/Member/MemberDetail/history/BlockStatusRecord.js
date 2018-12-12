import React from 'react';
import { Card, Table } from 'antd';
const { Column, ColumnGroup } = Table;
import Mapping_CallType from 'CONFIG/EnumerateLib/Mapping_CallType';
import Mapping_User from 'CONFIG/EnumerateLib/Mapping_User';
const closeReason = {
    0: '',
    1: '无意愿找工作',
    2: '一直不接电话',
    3: '停机/空号'
};
class BlockStatusRecord extends React.PureComponent {
    sortFollowedList(array, key) {
        let a = array;
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (new Date(array[i][key]).getTime() < new Date(array[j][key]).getTime()) {
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }
        }
        return array;
    }
    render() {
        let list = this.sortFollowedList(this.props.statusRecord, 'ModifyTime');
        return (
            <Card bordered={false} title="服务记录" bodyStyle={{ padding: '10px' }}>
                <Table
                    scroll={{ y: 240 }}
                    rowKey={record => (record.RecordID.toString() + record.Type.toString() + record.ModifyTime.toString())}
                    dataSource={list}
                    pagination={false}
                    size="small"
                    bordered>
                    <Column
                        title="类型"
                        dataIndex="Type"
                        render={(text, record, index) => {
                            return (Mapping_User.eBrokerStatus[record.Type]);
                        }}
                        width={60}
                    />
                    <Column
                        title="企业"
                        dataIndex="RecruitName"
                        width={150}
                    />
                    <Column
                        title="手机号"
                        dataIndex="Phone"
                        width={100}
                    />
                    <Column
                        title="当前状态"
                        dataIndex="CurrentStatus"
                        render={(text, record, index) => {
                            return (Mapping_User.eBrokerStatus_CurrentStatus[record.Type][record.CurrentStatus] + (record.Type === 2 && record.CurrentStatus === 2 ? (closeReason[record.CloseReason] ? '(' + closeReason[record.CloseReason] + ')' : '') : '')
                                + (record.Type === 3 && record.DispatchContent ? (Mapping_User.eBrokerStatus_DispatchContent[record.DispatchContent] ? '(' + Mapping_User.eBrokerStatus_DispatchContent[record.DispatchContent] + ')' : '') : ''));
                        }}
                        width={100}
                    />
                    <Column
                        title="更新时间"
                        dataIndex="ModifyTime"
                        render={(text, record, index) => {
                            return (new Date(record.ModifyTime).Format('MM-dd hh:mm'));
                        }}
                        width={100}
                    />
                </Table>
            </Card>
        );
    }
}

export default BlockStatusRecord;