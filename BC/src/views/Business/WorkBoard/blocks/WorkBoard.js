import React from 'react';
import 'LESS/Business/WorkBoard/work-board.less';
import {Row, Col, Card} from 'antd';
import WorkerType from './WorkerType';
import WorkerCount from './WorkerCount';
import WorkerRank from './WorkerRank';
import WorkBoardAction from 'ACTION/Business/WorkBoard';
import {browserHistory} from "react-router";
import {
    ComplainStatus
} from 'CONFIG/EnumerateLib/Mapping_Order';

const {
    getPendingCount,
    getLabourScale,
    getTomorrowOffer,
    getTransport,
    getTypeCount
} = WorkBoardAction;

class WorkBoard extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getPendingCount();
            getLabourScale();
            getTomorrowOffer();
            getTransport();
            getTypeCount();
        }
    }

    handleGoRecruit(RecruitType) {
        browserHistory.push({
            pathname: '/bc/recruitment/daily',
            query: {RecruitType}
        });
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>工作面板</h1>
                </div>
                <div className="container-fluid work-board-content pt-24 pb-24">
                    <div className="model-title">
                        <span className="model-title-icon"/><span>待处理</span>
                    </div>
                    <Row>
                        <Col xs={12} md={8}>
                            <div className="work-item-container">
                                <div className="work-item" onClick={() => {
                                    browserHistory.push({
                                        pathname: '/bc/order-manage/user',
                                        query: {JFFInterviewStatus: 1}
                                    });
                                }}>
                                    <span className="work-item-title">会员面试</span>
                                    <span className="work-item-value">{this.props.PendingCount.InterviewAmount}</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={8} style={{display: 'none'}}>
                            <div className="work-item-container">
                                <div className="work-item" onClick={() => {
                                    browserHistory.push({
                                        pathname: '/bc/order-manage/complain',
                                        query: {AuditStatus: ComplainStatus.AUDIT_STATUS_WAIT.value}
                                    });
                                }}>
                                    <span className="work-item-title">申诉订单</span>
                                    <span className="work-item-value">{this.props.PendingCount.AppealAmount}</span>
                                </div>
                            </div>
                        </Col>
                       {/* <Col xs={12} md={8}>
                            <div className="work-item-container">
                                <div className="work-item" onClick={() => {
                                    browserHistory.push({
                                        pathname: '/bc/recruitment/price',
                                        query: {AuditStatus: '0'}
                                    });
                                }}>
                                    <span className="work-item-title">劳务报价</span>
                                    <span className="work-item-value">{this.props.PendingCount.OfferAmount}</span>
                                </div>
                            </div>
                        </Col> */}
                        <Col xs={12} md={8}>
                            <div className="work-item-container">
                                <div className="work-item" onClick={() => {
                                    browserHistory.push({
                                        pathname: '/bc/order-manage/labor',
                                        query: {LaborOrderStatus: 2}
                                    });
                                }}>
                                    <span className="work-item-title">延期订单</span>
                                    <span className="work-item-value">{this.props.PendingCount.DelayAmount}</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="work-item-container">
                                <div className="work-item" onClick={() => {
                                    browserHistory.push({
                                        pathname: '/bc/servicer/company',
                                        query: {accountStatus: '3'}
                                    });
                                }}>
                                    <span className="work-item-title">劳务催款</span>
                                    <span className="work-item-value">{this.props.PendingCount.UrgeAmount}</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="work-item-container">
                                <div className="work-item" onClick={() => {
                                    browserHistory.push({
                                        pathname: '/bc/assistance'
                                    });
                                }}>
                                    <span className="work-item-title">部门委托</span>
                                    <span className="work-item-value">{this.props.PendingCount.EntrustAmount}</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="model-title">
                        <span className="model-title-icon"/>
                        <span>
                            明日报价 {this.props.TomorrowOffer.Arecruit + this.props.TomorrowOffer.Brecruit + this.props.TomorrowOffer.Crecruit
                        + '/' + (this.props.TomorrowOffer.Atype + this.props.TomorrowOffer.Btype + this.props.TomorrowOffer.Ctype)}
                        </span>
                    </div>
                    <Row>
                        <Col xs={12} md={8}>
                            <div className="work-item-container">
                                <div className="work-item" onClick={() => this.handleGoRecruit(1)}>
                                    <span className="work-item-title">A类企业</span>
                                    <span
                                        className="work-item-value">{this.props.TomorrowOffer.Arecruit + '/' + this.props.TomorrowOffer.Atype}</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="work-item-container">
                                <div className="work-item" onClick={() => this.handleGoRecruit(2)}>
                                    <span className="work-item-title">B类企业</span>
                                    <span
                                        className="work-item-value">{this.props.TomorrowOffer.Brecruit + '/' + this.props.TomorrowOffer.Btype}</span>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="work-item-container">
                                <div className="work-item" onClick={() => this.handleGoRecruit(3)}>
                                    <span className="work-item-title">C类企业</span>
                                    <span
                                        className="work-item-value">{this.props.TomorrowOffer.Crecruit + '/' + this.props.TomorrowOffer.Ctype}</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {/* <div className="model-title">
                        <span className="model-title-icon" /><span>报表统计</span>
                    </div>
                    <Row>
                        <Col xs={22} md={24}>
                            <Card bordered={false} title="企业类型统计">
                                <WorkerType TypeCount={this.props.TypeCount} />
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={32}>
                        <Col xs={22} md={14} className="mt-30">
                            <Card bordered={false} title="输送人数">
                                <WorkerCount Transport={this.props.Transport} />
                            </Card>
                        </Col>
                        <Col xs={22} md={10} className="mt-30">
                            <Card bordered={false} title="劳务排名(送人)">
                                <WorkerRank LabourScale={this.props.LabourScale} />
                            </Card>
                        </Col>
                    </Row>*/}
                </div>
            </div>
        );
    }
}

export default WorkBoard;