import React from 'react';
import {Form, Row, Col, Modal, message} from 'antd';
import TodayInterview from 'SERVICE/Broker/TodayInterview';
import moment from 'moment';
import image_label from 'IMAGE/label_blue.png';

const FormItem = Form.Item;
export default class InterviewCountdownModal extends React.Component {
    state = {
        Data: undefined
    };
    eCountdownStatus = {
        0: '未开启',
        1: '进行中',
        2: '倒计时结束',
        3: '补贴申请中',
        4: '补贴已到余额',
        5: '补贴作废',
        6: '补贴结束',
        7: '会员自己隐藏',
        8: '180天后无效'
    };
    ePayType = {
        0: '我打',
        1: '周薪薪'
    };

    componentWillMount() {
        let record = this.props.record;
        if (record) {
            let param = {
                InterviewID: record.InterviewID,
                UUID: record.UUID
            };
            TodayInterview.getInterviewCountdown(param).then(
                (res) => {
                    if (res && res.Data) {
                        this.setState({
                            Data: res.Data
                        });
                    }
                },
                (err) => {
                    message.destroy();
                    message.info('查询倒计时失败' + ((err && err.Desc) ? (':' + err.Desc) : ''));
                }
            );
        } else {
            if (this.props.onModalClose) this.props.onModalClose();
        }
    }


    getCountdownDate(d_d) {
        // d_d = '2018-4-4 10:00:00';
        if (d_d && moment(d_d).isValid()) {
            let hours = moment(d_d).diff(moment(), 'hours');
            // let text = '倒计时中 ' + Math.floor(hours / 24) + ' 天 ' + (hours % 24) + ' 小时';
            return <div>
                倒计时中&nbsp;&nbsp;
                <span className="color-orange">{Math.floor(hours / 24)}</span>&nbsp;&nbsp;天&nbsp;&nbsp;
                <span className="color-orange">{hours % 24}</span> &nbsp;&nbsp;小时</div>;
        } else {
            return '进行中';
        }
    }

    transferContentInfo(data = {CountdownStatus: 0}) {
        let titleRightContent = '';
        let mainContent = '';
        let subContent = '';
        switch (data.CountdownStatus) {
            //     0: '未开启',
            //     1: '进行中',
            //     2: '倒计时结束',
            //     3: '补贴申请中',
            //     4: '补贴已到余额',
            //     5: '补贴作废',
            //     6: '补贴结束',
            //     7: '180天后无效'
            case 1:// 进行中
                titleRightContent = (
                    <span className="color-orange"> {((data.Amount || 0) / 100).FormatMoney({fixed: 0})}元</span>);
                mainContent = this.getCountdownDate(data.RemindDate);
                subContent = '工作至倒计时结束，即可领取补贴';
                break;
            case 2:
                titleRightContent = '';
                mainContent = (
                    <span className="color-orange">{((data.Amount || 0) / 100).FormatMoney({fixed: 0})}元</span>);
                subContent = '倒计时结束，请尽快领取补贴';
                break;
            case 3:
                titleRightContent = '';
                mainContent = (
                    <span className="color-orange">{((data.Amount || 0) / 100).FormatMoney({fixed: 0})}元</span>);
                subContent = (<span className="color-blue">补贴审核中</span>);
                break;
            case 4:
                titleRightContent = '';
                mainContent = (
                    <span className="color-orange">{((data.Amount || 0) / 100).FormatMoney({fixed: 0})}元</span>);
                subContent = (<span className="color-blue">补贴已发放</span>);
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                titleRightContent = '';
                mainContent = (
                    <span className="color-orange">{((data.Amount || 0) / 100).FormatMoney({fixed: 0})}元</span>);
                subContent = (<span className="color-blue">{this.eCountdownStatus[data.CountdownStatus]}</span>);
                break;
            case 0:// 未开启 // 无补贴
            default:
                if (data.Amount) {
                    mainContent = '补贴未开启';
                } else {
                    mainContent = '当前没有补贴';
                }
                titleRightContent = '';
                subContent = '';
                break;
        }
        return {titleRightContent, mainContent, subContent};
    }

    render() {
        let {Amount, CountdownStatus, PayType, RecruitName, RemindDate} = this.state.Data || {};
        // CountdownStatus = 1;
        const {LaborCheckinTime, CheckinRecruitName} = this.props.record;
        const interviewStyle = {
            marginBottom: '4px',
            fontSize: '14px',
            lineHeight: '22px'
        };
        const recruitStyle = {
            fontSize: '14px',
            lineHeight: '14px',
            background: 'url(' + image_label + ') no-repeat',
            backgroundSize: '100% 100%',
            color: '#ffffff',
            padding: '5px 14px 5px 8px'
        };
        const titleRightStyle = {
            textAlign: 'right',
            fontSize: '24px',
            lineHeight: '50px'
        };
        const contentLine1Style = {
            fontSize: '24px',
            lineHeight: '36px',
            marginBottom: '8px'
        };
        const contentLine2Style = {
            fontSize: '14px',
            lineHeight: '22px',
            color: '#666666'
        };
        const {titleRightContent, mainContent, subContent} = this.transferContentInfo(this.state.Data);
        console.log(this.state.Data);
        const {
            SubsidyType = 0,
            SubsidyStruct = {}
        } = this.state.Data || {};
        
        return (
            <Modal visible={true}
                   title="补贴信息"
                   width={480}
                   onOk={() => this.props.onModalClose()}
                   footer={false}
                   onCancel={() => this.props.onModalClose()}>
                <div className="pl-8 pr-8">
                    <Row>
                        <Col span={12}>
                            <div style={interviewStyle}>
                                面试日期:&nbsp;
                                {LaborCheckinTime && moment(LaborCheckinTime).isValid() ? moment(LaborCheckinTime).format('YYYY.MM.DD') : ''}</div>
                            <span style={recruitStyle}>{CheckinRecruitName}</span>
                        </Col>
                        <Col span={12}>
                            <div style={titleRightStyle}>
                                {titleRightContent}
                            </div>
                        </Col>
                    </Row>
                    {SubsidyType !== 2 ? (
                        <Row className="mt-24 mb-16">
                            <Col span={24} className="text-center">
                                <div style={contentLine1Style}>{mainContent}</div>
                                <div style={contentLine2Style}>&nbsp;{subContent}</div>
                            </Col>
                        </Row>
                    ) : (
                        <div style={{textAlign: 'center', padding: '14px 0'}}>
                            <div><span style={{color: 'red', fontSize: '24px'}}>{SubsidyStruct.AllWorkDay}</span>个工作日 <span>{this.state.Data.Amount}</span>元</div>
                            <div>还剩<span style={{color: 'red', fontSize: '24px'}}>{SubsidyStruct.LastWorkDay}</span>个工作日</div>
                        </div>
                    )}
                    
                    
                </div>
            </Modal>
        );
    }
}