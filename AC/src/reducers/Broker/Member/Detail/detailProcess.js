import merge from 'REDUCER/merge';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberContactRecord from 'ACTION/Broker/MemberDetail/getMemberContactRecord';
import getMemberScheduleMessageList from 'ACTION/Broker/MemberDetail/getMemberScheduleMessageList';
import getMemberEstimateApplyList from 'ACTION/Broker/MemberDetail/getMemberEstimateApplyList';
import modifyMemberApply from 'ACTION/Broker/MemberDetail/modifyMemberApply';
import getMemberApplyInfo from 'ACTION/Broker/MemberDetail/getMemberApplyInfo';
import getMemberPreSignInfo from 'ACTION/Broker/MemberDetail/getMemberPreSignInfo';
import getMemberAskInfo from 'ACTION/Broker/MemberDetail/getMemberAskInfo';
import createMemberApply from 'ACTION/Broker/MemberDetail/createMemberApply';
import helpMemberApply from 'ACTION/Broker/MemberDetail/helpMemberApply';
import insertPreSign from 'ACTION/Broker/MemberDetail/insertPreSign';
import updatePreSign from 'ACTION/Broker/MemberDetail/updatePreSign';
import renewMemberApply from 'ACTION/Broker/MemberDetail/renewMemberApply';
import createDispatchOrder from 'ACTION/Broker/MemberDetail/createDispatchOrder';
import closeMemberApply from 'ACTION/Broker/MemberDetail/closeMemberApply';
import replyFeedback from 'ACTION/Broker/MemberDetail/replyFeedback';
import patchProcessDemands from 'ACTION/Broker/MemberDetail/patchProcessDemands';
import getPickupLocationList from 'ACTION/Broker/MemberDetail/getPickupLocationList';
import answerKA from 'ACTION/Broker/MemberDetail/answerKA';
import brokerCall from 'ACTION/Broker/MemberDetail/brokerCallBack';
import moment from 'moment';

const STATE_NAME = 'state_broker_member_detail_process';

function InitialState() {
    let now = new Date();
    let sd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 183, 0, 0, 0);
    let ed = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    return {
        pickupLocationList: [],
        contactIndex: 0,
        contactPageSize: 20,
        contactStartTime: sd,
        contactEndTime: ed,
        contactList: [],
        contactListCount: 0,
        pageSize: 20,
        page: 1,
        scheduleList: [],
        currentProcessItem: '',
        currentProcessStep: '',
        currentEstimateApply: '',
        estimateApplyList: [],
        answerKAContent: {},
        applyContactContent: {},
        applyRecruitId: '',
        applyRecruitName: {},
        applyStoreId: '',
        applyStoreName: {
            value: '0'
        },
        ApplyData: undefined, // 预签到信息
        PreSignInfo: null,
        applySignTime: {},
        updateContactContent: {},
        updateRecruitId: '',
        updateRecruitName: {},
        updateStoreId: '',
        updateStoreName: {
            value: '0'
        },
        updateSignTime: {},
        pickupLocation: {},
        sendLocation: {},
        sendLocationId: '',
        buddyNumber: {
            value: '0'
        },
        closeReason: {},
        applyConfirmContact: {},
        normalContactContent: {},
        sendBusConfirmContact: {},
        showApplyConfirm: false,
        showCloseConfirm: false,
        showSendBusConfirm: false,
        getMemberContactRecordFetch: {
            status: 'close',
            response: ''
        },
        getMemberScheduleMessageListFetch: {
            status: 'close',
            response: ''
        },
        getMemberEstimateApplyListFetch: {
            status: 'close',
            response: ''
        },
        modifyMemberApplyFetch: {
            status: 'close',
            response: ''
        },
        getMemberApplyInfoFetch: {
            status: 'close',
            response: ''
        },
        getMemberPreSignInfoFetch: {
            status: 'close',
            response: ''
        },
        createMemberApplyFetch: {
            status: 'close',
            response: ''
        },
        helpMemberApplyFetch: {
            status: 'close',
            response: ''
        },
        renewMemberApplyFetch: {
            status: 'close',
            response: ''
        },
        createDispatchOrderFetch: {
            status: 'close',
            response: ''
        },
        closeMemberApplyFetch: {
            status: 'close',
            response: ''
        },
        replyFeedbackFetch: {
            status: 'close',
            response: ''
        },
        patchProcessDemandsFetch: {
          status: 'close',
          response: ''
        },
        getPickupLocationListFetch: {
            status: 'close',
            response: ''
        },
        answerKAFetch: {
            status: 'close',
            response: ''
        },
        getMemberAskInfoFetch: {
            status: 'close',
            response: ''
        },
        insertPreSignFetch: {
            status: 'close',
            response: ''
        },
        updatePreSignFetch: {
            status: 'close',
            response: ''
        },
        brokerCallFetch: {
          status: 'close',
          response: ''
        }
    };
}

const Reducer = {
    initialState: new InitialState(),
    reducers: {
        [resetState]: merge((payload, state) => {
            if (payload.stateName === STATE_NAME) {
                let temp = Object.assign(new InitialState(), {resetCount: (typeof state.resetCount === 'number' ? state.resetCount + 1 : 0)});
                return temp;
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
        [getMemberContactRecord]: merge((payload, state) => {
            return {
                getMemberContactRecordFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberContactRecord.success]: merge((payload, state) => {
            return {
                getMemberContactRecordFetch: {
                    status: 'success',
                    response: payload
                },
                // contactList: payload.Data.InteractList || [],
                // contactListCount: (payload.Data && payload.Data.RecordCount) ? payload.Data.RecordCount : 0
                contactList: payload.Data.RecordList || [],
                contactListCount: (payload.Data && payload.Data.RecordCount) ? payload.Data.RecordCount : 0
            };
        }),
        [getMemberContactRecord.error]: merge((payload, state) => {
            return {
                getMemberContactRecordFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getMemberScheduleMessageList]: merge((payload, state) => {
            return {
                getMemberScheduleMessageListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberScheduleMessageList.success]: merge((payload, state) => {
            return {
                getMemberScheduleMessageListFetch: {
                    status: 'success',
                    response: payload
                },
                scheduleList: (payload.Data && payload.Data.ScheduleList) || []
            };
        }),
        [getMemberScheduleMessageList.error]: merge((payload, state) => {
            return {
                getMemberScheduleMessageListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getMemberEstimateApplyList]: merge((payload, state) => {
            return {
                getMemberEstimateApplyListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberEstimateApplyList.success]: merge((payload, state) => {
            let obj = {
                getMemberEstimateApplyListFetch: {
                    status: 'success',
                    response: payload
                },
                estimateApplyList: (payload.Data && payload.Data.RecordList) || []
            };
            let temp = {};
            if (payload.Data && payload.Data.RecordList && payload.Data.RecordList.length) {
                let currentEstimateApply = payload.Data.RecordList[0];
                let c = new Date(currentEstimateApply.EstimatedTime);
                temp = {
                    currentEstimateApply: currentEstimateApply,
                    updateContactContent: {
                        value: ''
                    },
                    updateRecruitId: currentEstimateApply.RecruitID,
                    updateRecruitName: {
                        value: {
                            text: currentEstimateApply.RecruitName,
                            value: currentEstimateApply.RecruitID.toString()
                        }
                    },
                    updateStoreId: currentEstimateApply.StoreID,
                    updateStoreName: {
                        value: {
                            text: currentEstimateApply.StoreName,
                            value: currentEstimateApply.StoreID.toString()
                        }
                    },
                    updateSignTime: {
                        value: moment(c.Format('yyyy-MM-dd'))
                    }
                };
            }

            return Object.assign({}, obj, temp);
        }),
        [getMemberEstimateApplyList.error]: merge((payload, state) => {
            return {
                getMemberEstimateApplyListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [modifyMemberApply]: merge((payload, state) => {
            return {
                modifyMemberApplyFetch: {
                    status: 'pending'
                }
            };
        }),
        [modifyMemberApply.success]: merge((payload, state) => {
            return {
                modifyMemberApplyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [modifyMemberApply.error]: merge((payload, state) => {
            return {
                modifyMemberApplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [getMemberApplyInfo]: merge((payload, state) => {
            return {
                getMemberApplyInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberApplyInfo.success]: merge((payload, state) => {
            let r_r;
            if ((payload.Data || {}).Checked) {
                r_r = (payload.Data || {}).Record;
            }
            return {
                getMemberApplyInfoFetch: {
                    status: 'success',
                    response: payload
                },
                ApplyData: r_r
            };
        }),
        [getMemberApplyInfo.error]: merge((payload, state) => {
            return {
                getMemberApplyInfoFetch: {
                    status: 'error',
                    response: payload
                },
                ApplyData: undefined
            };
        }),
        // 华丽的请求三连ACTION分割线
        [getMemberPreSignInfo]: merge((payload, state) => {
            return {
                getMemberPreSignInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberPreSignInfo.success]: merge((payload, state) => {
            return {
                getMemberPreSignInfoFetch: {
                    status: 'success',
                    response: payload
                },
                PreSignInfo: ((payload.Data || {}).UserPreOrder || [])[0] || null
            };
        }),
        [getMemberPreSignInfo.error]: merge((payload, state) => {
            return {
                getMemberPreSignInfoFetch: {
                    status: 'error',
                    response: payload
                },
                PreSignInfo: null
            };
        }),
        // 华丽的请求三连ACTION分割线
        [getMemberAskInfo]: merge((payload, state) => {
            return {
                getMemberAskInfoFetch: {
                    status: 'pending'
                }
            };
        }),
        [getMemberAskInfo.success]: merge((payload, state) => {
            return {
                getMemberAskInfoFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [getMemberAskInfo.error]: merge((payload, state) => {
            return {
                getMemberAskInfoFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        // 华丽的请求三连ACTION分割线
        [createMemberApply]: merge((payload, state) => {
            return {
                createMemberApplyFetch: {
                    status: 'pending'
                }
            };
        }),
        [createMemberApply.success]: merge((payload, state) => {
            return {
                createMemberApplyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [createMemberApply.error]: merge((payload, state) => {
            return {
                createMemberApplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [helpMemberApply]: merge((payload, state) => {
            return {
                helpMemberApplyFetch: {
                    status: 'pending'
                }
            };
        }),
        [helpMemberApply.success]: merge((payload, state) => {
            return {
                helpMemberApplyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [helpMemberApply.error]: merge((payload, state) => {
            return {
                helpMemberApplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [insertPreSign]: merge((payload, state) => {
            return {
                insertPreSignFetch: {
                    status: 'pending'
                }
            };
        }),
        [insertPreSign.success]: merge((payload, state) => {
            return {
                insertPreSignFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [insertPreSign.error]: merge((payload, state) => {
            return {
                insertPreSignFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [updatePreSign]: merge((payload, state) => {
            return {
                updatePreSignFetch: {
                    status: 'pending'
                }
            };
        }),
        [updatePreSign.success]: merge((payload, state) => {
            return {
                updatePreSignFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [updatePreSign.error]: merge((payload, state) => {
            return {
                updatePreSignFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [renewMemberApply]: merge((payload, state) => {
            return {
                renewMemberApplyFetch: {
                    status: 'pending'
                }
            };
        }),
        [renewMemberApply.success]: merge((payload, state) => {
            return {
                renewMemberApplyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [renewMemberApply.error]: merge((payload, state) => {
            return {
                renewMemberApplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [createDispatchOrder]: merge((payload, state) => {
            return {
                createDispatchOrderFetch: {
                    status: 'pending'
                }
            };
        }),
        [createDispatchOrder.success]: merge((payload, state) => {
            return {
                createDispatchOrderFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [createDispatchOrder.error]: merge((payload, state) => {
            return {
                createDispatchOrderFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [closeMemberApply]: merge((payload, state) => {
            return {
                closeMemberApplyFetch: {
                    status: 'pending'
                }
            };
        }),
        [closeMemberApply.success]: merge((payload, state) => {
            return {
                closeMemberApplyFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [closeMemberApply.error]: merge((payload, state) => {
            return {
                closeMemberApplyFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [replyFeedback]: merge((payload, state) => {
            return {
                replyFeedbackFetch: {
                    status: 'pending'
                }
            };
        }),
        [replyFeedback.success]: merge((payload, state) => {
            return {
                replyFeedbackFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [replyFeedback.error]: merge((payload, state) => {
            return {
                replyFeedbackFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [patchProcessDemands]: merge((payload, state) => {
            return {
                patchProcessDemandsFetch: {
                    status: 'pending'
                }
            };
        }),
        [patchProcessDemands.success]: merge((payload, state) => {
            return {
                patchProcessDemandsFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [patchProcessDemands.error]: merge((payload, state) => {
            return {
                patchProcessDemandsFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [getPickupLocationList]: merge((payload, state) => {
            return {
                getPickupLocationListFetch: {
                    status: 'pending'
                }
            };
        }),
        [getPickupLocationList.success]: merge((payload, state) => {
            return {
                getPickupLocationListFetch: {
                    status: 'success',
                    response: payload
                },
                pickupLocationList: payload.Data.RecordList || []
            };
        }),
        [getPickupLocationList.error]: merge((payload, state) => {
            return {
                getPickupLocationListFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [answerKA]: merge((payload, state) => {
            return {
                answerKAFetch: {
                    status: 'pending'
                }
            };
        }),
        [answerKA.success]: merge((payload, state) => {
            console.log(payload, "5555555555555555555");
            return {
                answerKAFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [answerKA.error]: merge((payload, state) => {
            return {
                answerKAFetch: {
                    status: 'error',
                    response: payload
                }
            };
        }),
        [brokerCall]: merge((payload, state) => {
            return {
                brokerCallFetch: {
                    status: 'pending'
                }
            };
        }),
        [brokerCall.success]: merge((payload, state) => {
            return {
                brokerCallFetch: {
                    status: 'success',
                    response: payload
                }
            };
        }),
        [brokerCall.error]: merge((payload, state) => {
            return {
                brokerCallFetch: {
                    status: 'error',
                    response: payload
                }
            };
        })
    }
};
export default Reducer;
