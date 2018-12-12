import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Alert,
    Table,
    Icon,
    Button,
    DatePicker,
    InputNumber,
    message,
    Radio,
    Select,
    Modal,
    Tabs
} from 'antd';
export default class Interview extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            add: false
        };
    }
    render() {
        const columns = [{
            title: '  导入时间',
            dataIndex: 'CreatTime'
        }, {
            title: '金额',
            dataIndex: 'Amount',
            render: (text) => <span>{parseFloat((+text || 0) / 100).toFixed(2)}</span>
        }, {
            title: '操作人',
            dataIndex: 'LoginName'
        }];
        console.log(this.props.RecordList, "555555555555555");
        return (
            <div>
                <Modal
                    title="导入记录" visible={this.props.visible}
                    onCancel={() => this.props.RecordModal(false)}
                    footer={false}
                    onOk={() => this.props.RecordModal(false)}>
                    <Table
                        pagination={false}
                        columns={columns}
                        dataSource={this.props.RecordList} />
                    <Button style={{margin: "2% 0 0 86%"}} onClick={() => this.props.RecordModal(false)} type="primary">知道了</Button>
                </Modal>
            </div>
        );
    }
}