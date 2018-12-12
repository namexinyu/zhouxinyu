import React from 'react';
import {browserHistory} from 'react-router';
import {Card, Row, Col, Button, message} from 'antd';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';

const {
    getIdCardUnAuditCount,
    getBankCardUnAuditCount,
    getAttendanceUnAuditCount,
    getWorkerCardUnAuditCount
} = AuditOperateAction;

class BoardContainer extends React.PureComponent {
    componentWillMount() {
        getIdCardUnAuditCount();
        getBankCardUnAuditCount();
        getAttendanceUnAuditCount();
        getWorkerCardUnAuditCount();
    }

    handleGo(path) {
        browserHistory.push({
            pathname: path
        });
    }

    handleBtnClick(path, count, msg) {
        if (count) this.handleGo(path);
        else {
            message.destroy();
            message.info(msg);
        }
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>今日审核任务</h1>
                </div>
                <Card bordered={false}>
                    <Row>
                        <Col span={6} offset={4} className="mb-40">
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
                        <Col span={6} offset={4} className="mb-40">
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
                        <Col span={6} offset={4} className="mb-40">
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
                        <Col span={6} offset={4} className="mb-40">
                            <Card>
                                <Row className="text-center w-100">
                                    <h3 style={{fontSize: '24px'}} className="text-center">未审核考勤</h3>
                                    <h1 style={{fontSize: '30px', fontWeight: 'blod'}}
                                        className="color-primary text-center">{this.props.unAuditAttendanceCount}</h1>
                                    <Button type="primary" size="large" htmlType="button"
                                            className="d-inline-block w-50 mt-24"
                                            onClick={() => this.handleBtnClick('/audit/operate/attendance', this.props.unAuditAttendanceCount, '暂无待审核考勤')}>审核</Button>
                                </Row>
                            </Card>
                        </Col>
                        {/* <Col span={8} className="mb-40">
                            <Card>
                                <Row className="text-center w-100">
                                    <h3 style={{ fontSize: '24px' }} className="text-center">错误重审</h3>
                                    <h1 style={{ fontSize: '30px', fontWeight: 'blod' }} className="color-primary text-center">60</h1>
                                    <Button type="danger" size="large" htmlType="button" className="d-inline-block w-50 mt-8" onClick={() => this.handleGo('/audit/operate/review')}>重审</Button>
                                </Row>
                            </Card>
                        </Col> */}
                    </Row>
                </Card>
            </div>
        );
    }
}

export default BoardContainer;