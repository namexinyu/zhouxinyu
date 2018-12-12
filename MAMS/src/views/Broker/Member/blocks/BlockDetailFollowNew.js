import React from 'react';
import getMemberFollowedRecruitList from 'ACTION/Broker/MemberDetail/getMemberFollowedRecruitList';
import { Button, Icon, Row, Col, Modal, message, Table, Select, Card, Form, Input, Collapse, DatePicker, Cascader, Tag } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const { Column, ColumnGroup } = Table;

class BlockDetailFollow extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTableSpin: false,
            showDetail: false
        };
    }
    componentWillMount() {
        getMemberFollowedRecruitList({
            UserID: this.props.userId
        });
    }
    render() {
        let list = this.props.followedList;
        const { showTableSpin } = this.state;
        return (
            <Card bordered={false} bodyStyle={{ padding: '10px' }}>
                <Table scroll={{ y: 400 }} 
                    rowKey={(record, index) => index}
                    dataSource={list}
                    pagination={false}
                    loading={showTableSpin}
                    size="middle"
                    bordered>
                    <Column
                        title="关注时间"
                        dataIndex="FollowedTime"
                        render={(text, record, index) => {
                            return (new Date(record.FollowedTime).Format('yyyy-MM-dd hh:mm'));
                        }}
                        width="150"
                    />
                    <Column
                        title="企业名称"
                        dataIndex="RecruitName"
                        render={(text, record, index) => {
                            return ((record.RecruitDetail || {}).RecruitName || '');
                        }}
                        width="200"
                    />
                    <Column
                        title="工资"
                        dataIndex="RecruitSalary"
                        render={(text, record, index) => {
                            return (((record.RecruitDetail || {}).SalaryInfo || {}).RecruitSalary || '');
                        }}
                        width="100"
                    />
                    <Column
                        title="补贴"
                        dataIndex="FlowStatus"
                        render={(text, record, index) => {
                            let items = [];
                            let list = ((record.RecruitDetail || {}).SalaryInfo || {}).RecruitSubsidy || [];
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
                        width="200"
                    />
                    <Column
                        title="企业标签"
                        dataIndex="RecruitTags"
                        render={(text, record, index) => {
                            let items = [];
                            ((record.RecruitDetail || {}).RecruitTags || []).map((sitem, i) => {
                                items.push(<Tag color="cyan" className="mb-8">{sitem.Description}</Tag>);
                            });
                            return items;
                        }}
                    />
                </Table>
            </Card>
            // <Collapse onChange={this.handleCollapseChange.bind(this)}>
            //     <Panel header={
            //         <div>
            //             <span>关注列表</span>
            //             <div className="float-right">
            //                 <span className="color-primary mr-16">查看</span>
            //             </div>
            //         </div>
            //     } key="1">
            //         <Table scroll={{ y: 240 }} rowKey={record => (record.FollowedTime.toString() + record.RecruitDetail.RecruitID.toString())}
            //             dataSource={list}
            //             pagination={false}
            //             loading={showTableSpin}
            //             size="middle"
            //             bordered>
            //             <Column
            //                 title="关注时间"
            //                 dataIndex="FollowedTime"
            //                 render={(text, record, index) => {
            //                     return (new Date(record.FollowedTime).Format('yyyy-MM-dd hh:mm'));
            //                 }}
            //                 width="150"
            //             />
            //             <Column
            //                 title="企业名称"
            //                 dataIndex="RecruitName"
            //                 render={(text, record, index) => {
            //                     return (record.RecruitDetail.RecruitName);
            //                 }}
            //                 width="200"
            //             />
            //             <Column
            //                 title="工资"
            //                 dataIndex="RecruitSalary"
            //                 render={(text, record, index) => {
            //                     return (record.RecruitDetail.SalaryInfo.RecruitSalary);
            //                 }}
            //                 width="100"
            //             />
            //             <Column
            //                 title="补贴"
            //                 dataIndex="FlowStatus"
            //                 render={(text, record, index) => {
            //                     let items = [];
            //                     let list = record.RecruitDetail.SalaryInfo.RecruitSubsidy || [];
            //                     list.map((item, i) => {
            //                         items.push(
            //                             <p>
            //                                 <span>满</span>
            //                                 <span>{item.SubsidyDay}</span>
            //                                 <span>天</span>
            //                                 <span>{(item.SubsidyAmount / 100).FormatMoney({ fixed: 2 })}</span>
            //                                 <span>元</span>
            //                             </p>
            //                         );
            //                     });
            //                     return items;
            //                 }}
            //                 width="200"
            //             />
            //             <Column
            //                 title="企业标签"
            //                 dataIndex="RecruitTags"
            //                 render={(text, record, index) => {
            //                     let items = [];
            //                     record.RecruitDetail.RecruitTags.map((sitem, i) => {
            //                         items.push(<Tag color="cyan" className="mb-8">{sitem.Description}</Tag>);
            //                     });
            //                     return items;
            //                 }}
            //             />
            //         </Table>
            //     </Panel>
            // </Collapse>
        );
    }
}

export default BlockDetailFollow;