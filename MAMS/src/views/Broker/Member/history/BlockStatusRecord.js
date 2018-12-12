import React from 'react';
import { browserHistory } from 'react-router';
import getMemberStatusRecord from 'ACTION/Broker/MemberDetail/getMemberStatusRecord';
import Mapping_CallType from 'CONFIG/EnumerateLib/Mapping_CallType';
import Mapping_User from 'CONFIG/EnumerateLib/Mapping_User';
import { Button, Icon, Row, Col, Modal, message, Table, Select, Card, Form, Input, Collapse, DatePicker, Cascader } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const { Column, ColumnGroup } = Table;

const closeReason = {
    0: '',
    1: '无意愿找工作',
    2: '一直不接电话',
    3: '停机/空号'
};
class BlockStatusRecord extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTableSpin: false,
            showDetail: true
        };
    }

    componentWillMount() {
        let location = browserHistory.getCurrentLocation();
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            getMemberStatusRecord({
                UserID: this.props.userId
            });
        }
    }

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
    handleCollapseChange(e) {
        this.setState({
            showDetail: !!(e.length && e.length > 0)
        });
        if (e.length && e.length > 0) {
            getMemberStatusRecord({
                UserID: this.props.userId
            });
        }
    }
    render() {
        let list = this.sortFollowedList(this.props.followedList, 'ModifyTime');
        const { showTableSpin } = this.state;
        return (

            <Collapse onChange={this.handleCollapseChange.bind(this)}>
                <Panel header={
                    <div>
                        <span>会员历程</span>
                        <div className="float-right">
                            <span className="color-primary mr-16">查看</span>
                        </div>
                    </div>
                } key="1">
                    <Row>
                        <Table
                            scroll={{ y: 240 }}
                            rowKey={record => (record.RecordID.toString() + record.Type.toString() + record.ModifyTime.toString())}
                            dataSource={list}
                            pagination={false}
                            loading={showTableSpin}
                            size="middle"
                            bordered>
                            <Column
                                title="更新时间"
                                dataIndex="ModifyTime"
                                render={(text, record, index) => {
                                    return (new Date(record.ModifyTime).Format('yyyy-MM-dd hh:mm'));
                                }}
                                width={150}
                            />
                            <Column
                                title="类型"
                                dataIndex="Type"
                                render={(text, record, index) => {
                                    return (Mapping_User.eBrokerStatus[record.Type]);
                                }}
                                width={100}
                            />
                            <Column
                                title="企业"
                                dataIndex="RecruitName"
                            />
                            <Column
                                title="当前状态"
                                dataIndex="CurrentStatus"
                                render={(text, record, index) => {
                                    return (Mapping_User.eBrokerStatus_CurrentStatus[record.Type][record.CurrentStatus] + (record.Type === 2 && record.CurrentStatus === 2 ? (closeReason[record.CloseReason] ? '(' + closeReason[record.CloseReason] + ')' : '') : '')
                                        + (record.Type === 3 && record.DispatchContent ? (Mapping_User.eBrokerStatus_DispatchContent[record.DispatchContent] ? '(' + Mapping_User.eBrokerStatus_DispatchContent[record.DispatchContent] + ')' : '') : ''));
                                }}
                                width={150}
                            />
                            <Column
                                title="操作"
                                dataIndex="operate"
                                width="100"
                            />
                        </Table>
                    </Row>
                </Panel>
            </Collapse>
        );
    }
}

export default BlockStatusRecord;