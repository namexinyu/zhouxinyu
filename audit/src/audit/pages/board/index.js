import React from 'react';
import {Card, Row, Col, Button, message} from 'antd';

export default class extends React.Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>今日审核任务</h1>
                </div>
                <Card bordered={false}>
                    <Row>
                        <Col span={6} offset={2} className="mb-40">
                            <Card>
                                <Row className="text-center w-100">
                                    <h3 style={{fontSize: '24px'}} className="text-center">未审核身份证</h3>
                                    <h1 style={{fontSize: '30px', fontWeight: 'blod'}}
                                        className="color-primary text-center">{this.props.unAuditIdCardCount}</h1>
                                    {/* onClick={() => this.handleGo('/audit/operate/idCard')}*/}
                                    <Button type="primary" size="large" htmlType="button"
                                            className="d-inline-block w-50 mt-24"
                                            onClick={() => this.handleBtnClick('/audit/operate/idCard', this.props.unAuditIdCardCount, '暂无待审核身份证')}>审核</Button>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={6} offset={2} className="mb-40">
                            <Card>
                                <Row className="text-center w-100">
                                    <h3 style={{fontSize: '24px'}} className="text-center">未审核银行卡</h3>
                                    <h1 style={{fontSize: '30px', fontWeight: 'blod'}}
                                        className="color-primary text-center">{this.props.unAuditBankCardCount}</h1>
                                    <Button type="primary" size="large" htmlType="button"
                                            className="d-inline-block w-50 mt-24"
                                            onClick={() => this.handleBtnClick('/audit/operate/bankCard', this.props.unAuditBankCardCount, '暂无待审核银行卡')}>审核</Button>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={6} offset={2} className="mb-40">
                            <Card>
                                <Row className="text-center w-100">
                                    <h3 style={{fontSize: '24px'}} className="text-center">未审核工牌</h3>
                                    <h1 style={{fontSize: '30px', fontWeight: 'blod'}}
                                        className="color-primary text-center">{this.props.unAuditWorkerCardCount}</h1>
                                    <Button type="primary" size="large" htmlType="button"
                                            className="d-inline-block w-50 mt-24"
                                            onClick={() => this.handleBtnClick('/audit/operate/workerCard', this.props.unAuditWorkerCardCount, '暂无待审核工牌')}>审核</Button>
                                </Row>
                            </Card>
                        </Col>
                        
                    </Row>
                </Card>
            </div>
        );
    }
}