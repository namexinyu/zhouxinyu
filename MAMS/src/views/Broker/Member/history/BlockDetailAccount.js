import React from 'react';
import getMemberAccountRecord from 'ACTION/Broker/MemberDetail/getMemberAccountRecord';
import { Button, Icon, Row, Col, Modal, message, Table, Select, Card, Form, Input, Collapse, DatePicker, Cascader } from 'antd';
import getEnumMap from 'CONFIG/getEnumMap';

const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const { Column, ColumnGroup } = Table;

class BlockDetailAccount extends React.PureComponent {
    constructor(props) {
        super(props);
        this.tradeTypeList = getEnumMap.getEnumMapByName('TradeType');
        this.state = {
            showTableSpin: false,
            showDetail: false
        };
    }

    handleCollapseChange(e) {
        this.setState({
            showDetail: !!(e.length && e.length > 0)
        });
        if (e.length && e.length > 0) {
            getMemberAccountRecord({
                UserID: this.props.userId
            });
        }
    }
    render() {
        let recordList = this.props.recordList;
        const { showTableSpin } = this.state;
        return (
            <Collapse onChange={this.handleCollapseChange.bind(this)}>
                <Panel header={
                    <div>
                        <span>账户查看</span>
                        <div className="float-right">
                            <span className="color-primary mr-16">查看</span>
                        </div>
                    </div>
                } key="1">
                    <p className="mb-16"><span>
                        <span>当前余额：{(this.props.totalAmount / 100).FormatMoney({ fixed: 2 })}元</span><span
                            className="ml-8">银行卡：{this.props.bankCardNum}张</span>
                        <span className="ml-8 color-warning">每天只能提现1次</span>
                    </span></p>
                    <Table
                        scroll={{ y: 240 }}
                        rowKey={record => record.AccountFlowID.toString()}
                        dataSource={recordList}
                        pagination={false}
                        loading={showTableSpin}
                        size="middle"
                        bordered>
                        <Column
                            title="交易时间"
                            dataIndex="Time"
                            width="150"
                        />
                        <Column
                            title="交易类型"
                            dataIndex="TradeType"
                            width="100"
                        />
                        <Column
                            title="交易金额"
                            dataIndex="Amount"
                            render={(text, record, index) => {
                                return ((record.Amount / 100).FormatMoney({ fixed: 2 }));
                            }}
                        />
                        <Column
                            title="交易进度"
                            dataIndex="FlowStatus"
                            render={(text, record, index) => {
                                return (record.FlowStatus === 1 ? '成功' : (record.FlowStatus === 2 ? '失败' : '处理中'));
                            }}
                            width="100"
                        />
                        <Column
                            title="交易后余额"
                            dataIndex="Balance"
                            render={(text, record, index) => {
                                return ((record.Balance / 100).FormatMoney({ fixed: 2 }));
                            }}
                            width="200"
                        />
                    </Table>
                </Panel>
            </Collapse>
        );
    }
}

export default BlockDetailAccount;