import React from 'react';
import moment from 'moment';
import setParams from 'ACTION/setParams';
import Mapping_CallType from 'CONFIG/EnumerateLib/Mapping_CallType';
import Mapping_NeedTodoType from 'CONFIG/EnumerateLib/Mapping_NeedTodoType';
import MemberDetailAction from 'ACTION/Assistant/MemberDetailAction';
import { Card, Table, DatePicker, message, Button } from 'antd';
const { Column, ColumnGroup } = Table;
const {
    getMemberContactRecord
} = MemberDetailAction;
const STATE_NAME = 'state_ac_memberDetail';
class BlockContactRecord extends React.PureComponent {
    handleInputChange(e, paramKey) {
        let temp = {};
        if (paramKey === 'contactStartTime' || paramKey === 'contactEndTime') {
            temp[paramKey] = e ? new Date(e.format('YYYY-MM-DD 00:00:00')) : null;
        } else {
            temp[paramKey] = e.target.value;
        }
        setParams(STATE_NAME, temp);
    }
    handleDoSearchContactList() {
        let st = this.props.contactStartTime;
        let et = this.props.contactEndTime;
        let now = new Date();
        if (st > et) {
            message.warning('开始时间不能大于结束时间');
            return false;
        }
        if (et >= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)) {
            message.warning('结束时间不能超过今天');
            return false;
        }
        getMemberContactRecord({
            BrokerID: this.props.brokerId,
            UserID: this.props.userId,
            RecordIndex: 0,
            RecordSize: 20,
            StartTime: new Date(st).Format('yyyy-MM-dd hh:mm:ss'),
            EndTime: new Date(et.getFullYear(), et.getMonth(), et.getDate() + 1, 0, 0, 0).Format('yyyy-MM-dd hh:mm:ss')
        });
    }
    render() {
        let contactList = this.props.contactRecord;
        return (
            <Card bordered={false} bodyStyle={{ padding: '10px' }}
                title={<div><span>联系记录</span>
                    <div className="float-right">
                        <DatePicker allowClear={false} placeholder="开始时间" style={{ width: '120px' }}
                            value={this.props.contactStartTime ? moment(this.props.contactStartTime.Format('yyyy-MM-dd')) : null}
                            onChange={(e) => this.handleInputChange(e, 'contactStartTime')}
                            disabledDate={function (current) {
                                return current && current.valueOf() > Date.now();
                            }} />
                        <DatePicker allowClear={false} placeholder="结束时间" className="ml-8"
                            style={{ width: '120px' }}
                            value={this.props.contactEndTime ? moment(this.props.contactEndTime.Format('yyyy-MM-dd')) : null}
                            onChange={(e) => this.handleInputChange(e, 'contactEndTime')}
                            disabledDate={function (current) {
                                return current && current.valueOf() > Date.now();
                            }} />
                        <Button htmlType="button" size="small" type="primary" className="ml-8"
                            onClick={() => this.handleDoSearchContactList()}>搜索</Button>
                    </div>
                </div>}>
                <Table scroll={{ y: 340 }} rowKey={record => (record.CallRecordID.toString())}
                    dataSource={contactList}
                    pagination={false}
                    // showHeader={false}
                    size="small">
                    <Column
                        title="联系时间"
                        dataIndex="Time"
                        render={(text, record, index) => {
                            return (new Date(record.Time).Format('yyyy-MM-dd hh:mm'));
                        }}
                        width={150}
                    />
                    <Column
                        title="联系类型"
                        dataIndex="ContactType"
                        render={(text, record, index) => {
                            return (
                                Mapping_CallType[record.ContactType] || '-'
                            );
                        }}
                        width={100}
                    />
                    <Column
                        title="手机号"
                        dataIndex="Phone"
                        width={100}
                    />
                    <Column
                        title="联系内容"
                        dataIndex="Content"
                        width={150}
                    />
                    <Column
                        title="经纪人"
                        dataIndex="BrokerNickname"
                        width={100}
                    />
                </Table>
            </Card>
        );
    }
}

export default BlockContactRecord;