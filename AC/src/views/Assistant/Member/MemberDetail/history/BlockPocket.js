import React from 'react';
import {Card, Row, Col, Form, Input } from 'antd';
const FormItem = Form.Item;

const trackStatusMap = {
    '1': '未结案',
    '2': '3天内无法联系',
    '3': '已入职',
    '4': '放弃',
    '5': '急需找工作',
    '6': '已有工作',
    '7': '学生',
    '8': '年后来面试'
};

class BlockPocket extends React.PureComponent {
    render() {
        const pocketItem = this.props.lastPocket || {};
        return (
            <Card title="口袋属性" bordered={false} bodyStyle={{ padding: '10px' }}>
                <Row>
                    <Col span={8}>
                        <FormItem label="预计入职日期" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                            {pocketItem.ExpectedDays || '-'}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="报名企业" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {pocketItem.PositionName || '-'}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="追踪状态" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                            {pocketItem.CaseStatus ? trackStatusMap[pocketItem.CaseStatus] : '-'}
                        </FormItem>
                    </Col>
                </Row>
            </Card>
        );
    }
}
export default BlockPocket;