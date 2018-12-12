import React from 'react';
import Mapping_CallType from 'CONFIG/EnumerateLib/Mapping_CallType';
import Mapping_NeedTodoType from 'CONFIG/EnumerateLib/Mapping_NeedTodoType';
import { Card, Table } from 'antd';
const { Column, ColumnGroup } = Table;

class BlockWait extends React.PureComponent {
    render() {
        let scheduleList = this.props.waitRecord;
        return (
            <Card bordered={false} bodyStyle={{ padding: '10px' }}
            >
                <Table scroll={{ y: 400 }} rowKey={record => (record.SourceKeyID.toString() + record.MsgFlowID.toString())}
                    dataSource={scheduleList}
                    pagination={false}
                    size="middle"
                    bordered={true}>
                    <Column
                        title="生成时间"
                        dataIndex="Time"
                        render={(text, record, index) => {
                            return (
                                new Date(record.Time).Format('yyyy-MM-dd hh:mm')
                            );
                        }}
                        width={180}
                    />
                    <Column
                        title="手机"
                        dataIndex="Phone"
                        width={100}
                    />
                    <Column
                        title="类型"
                        dataIndex="Type"
                        render={(text, record, index) => {
                            return (
                                Mapping_NeedTodoType.type[record.Type]
                            );
                        }}
                        width={100}
                    />
                    <Column
                        title="说明"
                        dataIndex="Content"
                        render={(text, record, index) => {
                            return (
                                record.Content
                            );
                        }}
                    />
                </Table>
            </Card>
        );
    }
}

export default BlockWait;