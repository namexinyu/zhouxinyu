import React from 'react';
import getMemberWorkHistory from 'ACTION/Broker/MemberDetail/getMemberWorkHistory';

import {
  Button,
  Icon,
  Row,
  Col,
  Modal,
  message,
  Table,
  Select,
  Card,
  Form,
  Input,
  Collapse,
  DatePicker,
  Cascader,
  Radio,
  Tabs
} from 'antd';

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
    componentWillMount() {
        getMemberWorkHistory({
            UserID: this.props.userId
        });
    }

    render() {
        let historyList = this.props.historyList;
        const { showTableSpin } = this.state;
        return (
            <Card bordered={false} title={cardTitleNode} bodyStyle={{ padding: '10px' }}>
                <Table scroll={{ y: 240 }} rowKey={record => record.CareerId.toString()}
                    dataSource={historyList}
                    pagination={false}
                    loading={showTableSpin}
                    size="small"
                    bordered>
                    <Column
                        title="企业名称"
                        dataIndex="TradeType"
                        render={(text, record, index) => {
                            return (record.IsWoda ? record.RecruitInfo.RecruitName : record.ThirdpartCareer.Name);
                        }}
                        width="150"
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
                        title="手机号"
                        dataIndex="Phone"
                        width={100}
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
                        title="在职时间段"
                        dataIndex="EntryDate"
                        render={(text, record, index) => {
                            return ((record.EntryDate || '') + '——' + (record.LeaveDate || '至今'));
                        }}
                        width="200"
                    />
                </Table>
            </Card>

        );
    }
}

export default BlockWork;
