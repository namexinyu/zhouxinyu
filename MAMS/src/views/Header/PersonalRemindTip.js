import 'SCSS/document/personal-remind-modal-tip.scss';
import React from 'react';
import setParams from 'ACTION/setParams';
import { browserHistory } from 'react-router';
import AlarmAction from 'ACTION/Broker/Header/Alarm';
import { Button } from 'antd';
const {
    reminderMarkAsRead
} = AlarmAction;

function isSameArray(array1, array2, key) {
    if (array1.length !== array2.length) {
        return false;
    } else {
        for (let i = 0; i < array1.length; i++) {
            if (key) {
                if (array1[i][key] !== array2[i][key]) {
                    return false;
                }
            } else {
                if (array1[i] !== array2[i]) {
                    return false;
                }
            }
        }
    }
    return true;
}

class PersonalRemindTip extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date().getTime()
        };
        window.remindTipComponent = this;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tipList.length) {
            if (!window.brokerPersonalRemindInterval || !isSameArray(nextProps.tipList, this.props.tipList, 'RemindID')) {
                window.brokerPersonalRemindInterval = setInterval(() => {
                    let now = new Date().getTime();
                    let temp = nextProps.autoClose;
                    let count = 0;
                    for (let key in temp) {
                        if (now - temp[key] >= 180000) {
                            count++;
                        }
                    }
                    if (count >= nextProps.tipList.length) {
                        clearInterval(window.brokerPersonalRemindInterval);
                    }
                    window.remindTipComponent.setState({
                        currentDate: now
                    });
                }, 1000);
            }
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    handleSetKnow(item) {
        reminderMarkAsRead({
            ReminderIDList: [item.RemindID]
        });
        let temp = this.props.autoClose;
        temp[item.RemindID] = 0;
        setParams('state_broker_timingTask', {
            newPersonalRemindAutoClose: temp
        });
    }

    handleGoMemberDetail(item) {
        // TODO 跳转详情页
        browserHistory.push({
            pathname: '/broker/member/detail/' + item.UserID,
            query: {
                memberName: item.UserName
            }
        });
        let temp = this.props.autoClose;
        temp[item.RemindID] = 0;
        setParams('state_broker_timingTask', {
            newPersonalRemindAutoClose: temp
        });
    }

    render() {
        let list = this.props.tipList || [];
        return (
            <div className="personal-remind-modal-tip">
                {
                    list.map((item, i) => {
                        return (
                            <div
                                className={'tip-item' + (((this.state.currentDate - this.props.autoClose[item.RemindID]) / 1000) >= 180 ? ' hidden' : '')}
                                key={i}>
                                <div className="left">
                                    <h5 className="text-center color-white">{item.UserName}</h5>
                                    <p className="auto-close-time">{180 - ((Math.floor((this.state.currentDate - this.props.autoClose[item.RemindID]) / 1000) < 0) ? 0 : Math.floor((this.state.currentDate - this.props.autoClose[item.RemindID]) / 1000))}秒</p>
                                </div>
                                <div className="middle">
                                    <p>{item.RemindInfo}</p>
                                </div>
                                <div className="right" style={{lineHeight: 0}}>
                                    <Button type="" htmlType="button" style={{marginTop: '8px'}}
                                        onClick={() => this.handleSetKnow(item)}>知道了
                                    </Button>
                                    <Button type="primary" htmlType="button"
                                        onClick={() => this.handleGoMemberDetail(item)}>去联系
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                }

            </div>
        );
    }
}

export default PersonalRemindTip;