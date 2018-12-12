import React from 'react';
import getMemberWorkHistory from 'ACTION/Broker/MemberDetail/getMemberWorkHistory';
import { Button, Icon, Row, Col, Modal, message, Table, Select, Card, Form, Input, Collapse, DatePicker, Cascader } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const { Column, ColumnGroup } = Table;
class BlockWork extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDetail: false,
            showTableSpin: false
        };
    }

    handleCollapseChange(e) {
        this.setState({
            showDetail: !!(e.length && e.length > 0)
        });
        if (e.length && e.length > 0) {
            getMemberWorkHistory({
                UserID: this.props.userId
            });
        }
    }

    render() {
        let historyList = this.props.historyList;
        const { showTableSpin } = this.state;
        return (
            <Collapse onChange={this.handleCollapseChange.bind(this)}>
                <Panel header={
                    <div>
                        <span>工作经历</span>
                        <div className="float-right">
                            <span className="color-primary mr-16">查看</span>
                        </div>
                    </div>
                } key="1">
                    <Table scroll={{ y: 240 }} rowKey={record => record.CareerId.toString()}
                        dataSource={historyList}
                        pagination={false}
                        loading={showTableSpin}
                        size="middle"
                        bordered>
                        <Column
                            title="时间段"
                            dataIndex="EntryDate"
                            render={(text, record, index) => {
                                return ((record.EntryDate || '') + '——' + (record.LeaveDate || '至今'));
                            }}
                            width="200"
                        />
                        <Column
                            title="企业"
                            dataIndex="TradeType"
                            render={(text, record, index) => {
                                return (record.IsWoda ? record.RecruitInfo.RecruitName : record.ThirdpartCareer.Name);
                            }}
                            width="200"
                        />
                        <Column
                            title="服务商"
                            dataIndex="Amount"
                            render={(text, record, index) => {
                                return (record.IsWoda ? '我打' : record.ThirdpartCareer.Agent);
                            }}
                            width="100"
                        />
                        <Column
                            title="工资"
                            dataIndex="FlowStatus"
                            render={(text, record, index) => {
                                return (record.IsWoda ? (record.RecruitInfo.RecruitSalary)
                                    : ((record.ThirdpartCareer.Salary / 100).FormatMoney({ fixed: 2 })));
                            }}
                            width="100"
                        />
                        <Column
                            title="补贴详情"
                            dataIndex="Balance"
                            render={(text, record, index) => {
                                return (record.IsWoda ? (record.RecruitInfo.Subsidy / 100).FormatMoney({ fixed: 2 }) : '');
                            }}
                        />
                    </Table>
                </Panel>
            </Collapse>
            // <div className="container-fluid">
            //     <div className="card">
            //         <div className="card-header">工作经历 <span className="float-right"
            //                                                 onClick={() => this.handleSeeAccount()}>查看</span></div>
            //         <div className={'card-body pt-0 pl-0 pr-0 pb-0' + (this.state.showDetail ? '' : ' d-none')}>
            //             <table className="table table-bordered table-hover mt-0 mb-0">
            //                 <thead>
            //                 <tr>
            //                     <td>时间段</td>
            //                     <td>企业</td>
            //                     <td>服务商</td>
            //                     <td>大致工资</td>
            //                     <td>补贴详情</td>
            //                 </tr>
            //                 </thead>
            //                 <tbody>
            //                 {
            //                     historyList.map((item, i) => {
            //                         return (
            //                             <tr key={i}>
            //                                 <td>{item.EntryDate + '——' + item.LeaveDate}</td>
            //                                 <td>{item.IsWoda ? item.RecruitInfo.RecruitName : item.ThirdpartCareer.Name}</td>
            //                                 <td>{item.IsWoda ? '我打' : item.ThirdpartCareer.Agent}</td>
            //                                 <td>{item.IsWoda ? ((item.RecruitInfo.MinWage / 100).FormatMoney({fixed: 2}) + '——' + (item.RecruitInfo.MaxWage / 100).FormatMoney({fixed: 2})) : ((item.ThirdpartCareer.Salary / 100).FormatMoney({fixed: 2}))}</td>
            //                                 <td>{item.IsWoda ? (item.RecruitInfo.Subsidy / 100).FormatMoney({fixed: 2}) : ''}</td>
            //                             </tr>
            //                         );
            //                     })
            //                 }

            //                 </tbody>
            //             </table>
            //         </div>
            //     </div>
            // </div>
        );
    }
}

export default BlockWork;