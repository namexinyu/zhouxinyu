import React from 'react';
import { Card, Table } from 'antd';
const { Column, ColumnGroup } = Table;
class BlockWorkFollow extends React.PureComponent {
    render() {
        let historyList = this.props.workFollowRecord;
        return (
            <Card bordered={false} title='工作记录' bodyStyle={{ padding: '10px' }}>
                <Table scroll={{ y: 240 }} rowKey={record => record.CareerId.toString()}
                    dataSource={historyList}
                    pagination={false}
                    size="small"
                    bordered>
                    <Column
                        title="企业名称"
                        dataIndex="TradeType"
                        render={(text, record, index) => {
                            return (record.IsWoda ? record.RecruitInfo.RecruitName : record.ThirdpartCareer.Name);
                        }}
                        width={150}
                    />
                    <Column
                        title="工资"
                        dataIndex="FlowStatus"
                        render={(text, record, index) => {
                            return (record.IsWoda ? (record.RecruitInfo.RecruitSalary)
                                : ((record.ThirdpartCareer.Salary / 100).FormatMoney({ fixed: 2 })));
                        }}
                        width={100}
                    />
                    <Column
                        title="服务商"
                        dataIndex="Amount"
                        render={(text, record, index) => {
                            return (record.IsWoda ? '我打' : record.ThirdpartCareer.Agent);
                        }}
                        width={100}
                    />
                    <Column
                        title="在职时间段"
                        dataIndex="EntryDate"
                        render={(text, record, index) => {
                            return ((record.EntryDate || '') + '——' + (record.LeaveDate || '至今'));
                        }}
                        width={200}
                    />
                </Table>
            </Card>

        );
    }
}

export default BlockWorkFollow;