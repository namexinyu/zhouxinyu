import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getBrokerLevel from 'ACTION/Broker/TimingTask/getBrokerLevel';
import getNewPersonalRemindList from 'ACTION/Broker/TimingTask/getNewPersonalRemindList';
import getRemindCount from 'ACTION/Broker/TimingTask/getRemindCount';
import getResourceCount from 'ACTION/Broker/TimingTask/getResourceCount';
import getSystemMessageCount from 'ACTION/Broker/TimingTask/getSystemMessageCount';
import getWaitCount from 'ACTION/Broker/TimingTask/getWaitCount';
import getMessages from 'ACTION/Broker/TimingTask/getMessages';
import getPersonalRemindCount from 'ACTION/Broker/TimingTask/getPersonalRemindCount';
import getExamCount from 'ACTION/Broker/TimingTask/getExamCount';
import messagemodal from 'ACTION/Common/Message/messagemodal';

const STATE_NAME = 'state_broker_timingTask';

function InitialState() {
    return {
        systemMessageCount: 0,
        personalRemindCount: 0,
        newPersonalRemindList: [],
        newPersonalRemindAutoClose: {},
        waitCount: 0,
        messageBuffer: [],
        messageModalVisible: false,
        remindCount: 0,
        resourceCount: 0,
        isPass: false,
        rankName: '',
        rankLevel: '',
        todayGoal: undefined,
        entryCount: '',
        CanExam: 0,
        ExamType: 0,
        getBrokerLevelFetch: {
            status: 'close',
            response: ''
        },
        getNewPersonalRemindList: {
            status: 'close',
            response: ''
        },
        getExamCountFetch: {
            status: 'close',
            response: ''
        },
        getResourceCount: {
            status: 'close',
            response: ''
        },
        getSystemMessageCount: {
            status: 'close',
            response: ''
        },
        getWaitCount: {
            status: 'close',
            response: ''
        },
        getMessagesFetch: {
            status: 'close',
            response: ''
        },
        getPersonalRemindCount: {
            status: 'close',
            response: ''
        },
        getExamCount: {
            status: 'close',
            response: ''
        },
        Messagestatus: true,
        messagemodalFetch: {
            status: 'close',
            response: ''
        },
        messagemodal: [],
        totalSize: 0
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return new InitialState();
            }
            return {};
        }),
        [setParams]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                return payload.params;
            }
            return {};
        }),
        [setFetchStatus]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME && state.hasOwnProperty(payload.fetchName)) {
                state[payload.fetchName].status = payload.status;
                return state;
            }
            return {};
        }),
        // 获取段位
        [getBrokerLevel]: merge((payload, state) => {
            return {
                getBrokerLevelFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getBrokerLevel.success]: merge((payload, state) => {
            return {
                getBrokerLevelFetch: {
                    status: 'success',
                    response: payload
                },
                rankLevel: payload.Data.RankLevel,
                rankName: payload.Data.RankName,
                todayGoal: payload.Data.TodayGoal,
                lowLevel: payload.Data.LowLevel,
                isPass: payload.Data.IsPass,
                entryCount: payload.Data.EntryCount
            };
        }),
        [getBrokerLevel.error]: merge((payload, state) => {
            return {
                getBrokerLevelFetch: {
                    status: 'error',
                    response: payload
                },
                rankLevel: '',
                rankName: '',
                isPass: false,
                entryCount: ''
            };
        }),
        // 获取自定义提醒前三列表
        [getNewPersonalRemindList]: merge((payload, state) => {
            return {
                getNewPersonalRemindListFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getNewPersonalRemindList.success]: merge((payload, state) => {
            let remindList = payload.Data.RemindList || [];
            let oldAutoClose = state.newPersonalRemindAutoClose;
            let newAutoClose = {};
            for (let i = 0; i < remindList.length; i++) {
                let remindId = remindList[i].RemindID;
                newAutoClose[remindId] = oldAutoClose.hasOwnProperty(remindId) ? oldAutoClose[remindId] : new Date().getTime();
            }
            return {
                getNewPersonalRemindListFetch: {
                    status: 'success',
                    response: payload
                },
                newPersonalRemindList: remindList,
                newPersonalRemindAutoClose: newAutoClose
            };
        }),
        [getNewPersonalRemindList.error]: merge((payload, state) => {
            return {
                getNewPersonalRemindListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 获取提醒数量
        [getRemindCount]: merge((payload, state) => {
            return {
                getRemindCountFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getRemindCount.success]: merge((payload, state) => {
            return {
                getRemindCountFetch: {
                    status: 'success',
                    response: payload
                },
                remindCount: payload.Data.RemindCount
            };
        }),
        [getRemindCount.error]: merge((payload, state) => {
            return {
                getRemindCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 获取资源数量
        [getResourceCount]: merge((payload, state) => {
            return {
                getResourceCountFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getResourceCount.success]: merge((payload, state) => {
            return {
                getResourceCountFetch: {
                    status: 'success',
                    response: payload
                },
                resourceCount: payload.Data.ResourceCount
            };
        }),
        [getResourceCount.error]: merge((payload, state) => {
            return {
                getResourceCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 获取系统消息数量
        [getSystemMessageCount]: merge((payload, state) => {
            return {
                getSystemMessageCountFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getSystemMessageCount.success]: merge((payload, state) => {
            return {
                getSystemMessageCountFetch: {
                    status: 'success',
                    response: payload
                },
                systemMessageCount: payload.Data.MsgCount
            };
        }),
        [getSystemMessageCount.error]: merge((payload, state) => {
            return {
                getSystemMessageCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 获取待办数量
        [getWaitCount]: merge((payload, state) => {
            return {
                getWaitCountFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getWaitCount.success]: merge((payload, state) => {
            return {
                getWaitCountFetch: {
                    status: 'success',
                    response: payload
                },
                waitCount: payload.Data.WaitCount
            };
        }),
        [getWaitCount.error]: merge((payload, state) => {
            return {
                getWaitCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 获取消息
        [getMessages]: merge((payload, state) => {
            return {
                getMessagesFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getMessages.success]: merge((payload, state) => {
            const incomingMessage = (payload.Data || {}).NotifyInfo || [];
            // console.log('getMessages.success', state);
            return {
                getMessagesFetch: {
                    status: 'success',
                    response: payload
                },
                messageBuffer: state.messageBuffer.concat(incomingMessage),
                messageModalVisible: !!state.messageBuffer.concat(incomingMessage).length
            };
        }),
        [getMessages.error]: merge((payload, state) => {
            return {
                getMessagesFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 获取考试信息
        [getExamCount]: merge((payload, state) => {
            return {
                getExamCountFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getExamCount.success]: merge((payload, state) => {
            return {
                getExamCountFetch: {
                    status: 'success',
                    response: payload
                },
                CanExam: payload.Data.CanExam,
                ExamType: payload.Data.ExamType         
            };
        }),
        [getExamCount.error]: merge((payload, state) => {
            return {
                getExamCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 获取自定义提醒数量
        [getPersonalRemindCount]: merge((payload, state) => {
            return {
                getPersonalRemindCountFetch: {
                    status: 'pending',
                    response: ''
                }
            };
        }),
        [getPersonalRemindCount.success]: merge((payload, state) => {
            return {
                getPersonalRemindCountFetch: {
                    status: 'success',
                    response: payload
                },
                personalRemindCount: payload.Data.RemindCount
            };
        }),
        [getPersonalRemindCount.error]: merge((payload, state) => {
            return {
                getPersonalRemindCountFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 获取弹窗数据
        [messagemodal]: merge((payload, state) => {
            return {
                messagemodalFetch: {
                    status: 'pending',
                    response: ''
                },
                Messagestatus: true
            };
        }),
        [messagemodal.success]: merge((payload, state) => {
            return {
                messagemodalFetch: {
                    status: 'success',
                    response: payload
                }
                // messagemodal: payload['Data']['NotifyInfo'] ? this.InitialState().messagemodal.concat(payload['Data']['NotifyInfo']) : this.InitialState().messagemodal,
                // totalSize: payload['Data'] ? payload['Data']['RecordCount'] : 0,
                // Messagestatus: false
            };
        }),
        [messagemodal.error]: merge((payload, state) => {
            return {
                messagemodalFetch: {
                    status: 'error',
                    response: payload
                },
                Messagestatus: false
            };
        })
    }
};
export default Reducer;