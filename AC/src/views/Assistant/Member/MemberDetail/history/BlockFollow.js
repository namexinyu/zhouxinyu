import React from 'react';
import { Card, Table, Tag } from 'antd';
const { Column, ColumnGroup } = Table;

class BlockFollow extends React.PureComponent {
    render() {
        let list = this.props.followRecord;
        return (
            <Card bordered={false} bodyStyle={{ padding: '10px' }}>
                <Table scroll={{ y: 400 }} rowKey={record => (record.FollowedTime.toString() + record.RecruitDetail.RecruitID.toString())}
                    dataSource={list}
                    pagination={false}
                    size="middle"
                    bordered>
                    <Column
                        title="关注时间"
                        dataIndex="FollowedTime"
                        render={(text, record, index) => {
                            return (new Date(record.FollowedTime).Format('yyyy-MM-dd hh:mm'));
                        }}
                        width={150}
                    />
                    <Column
                        title="企业名称"
                        dataIndex="RecruitName"
                        render={(text, record, index) => {
                            return (record.RecruitDetail.RecruitName);
                        }}
                        width={200}
                    />
                    <Column
                        title="工资"
                        dataIndex="RecruitSalary"
                        render={(text, record, index) => {
                            return (record.RecruitDetail.SalaryInfo.RecruitSalary);
                        }}
                        width={100}
                    />
                    <Column
                        title="补贴"
                        dataIndex="FlowStatus"
                        render={(text, record, index) => {
                            let items = [];
                            let list = record.RecruitDetail.SalaryInfo.RecruitSubsidy || [];
                            list.map((item, i) => {
                                items.push(
                                    <p>
                                        <span>满</span>
                                        <span>{item.SubsidyDay}</span>
                                        <span>天</span>
                                        <span>{(item.SubsidyAmount / 100).FormatMoney({ fixed: 2 })}</span>
                                        <span>元</span>
                                    </p>
                                );
                            });
                            return items;
                        }}
                        width={200}
                    />
                    <Column
                        title="企业标签"
                        dataIndex="RecruitTags"
                        render={(text, record, index) => {
                            let items = [];
                            record.RecruitDetail.RecruitTags.map((sitem, i) => {
                                items.push(<Tag color="cyan" key={sitem.RecruitTagID.toString()} className="mb-8">{sitem.Description}</Tag>);
                            });
                            return items;
                        }}
                    />
                </Table>
            </Card>
        );
    }
}

export default BlockFollow;