import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import MemberDetailBox from './blocks/MemberDetailBox';

export default createPureComponent(({store_broker, state_common_simple_recruit, store_mams, state_common_store_list, state_tabPage, location, router}) => {
    return (
        <div className="">
            <MemberDetailBox detailInfo={{...store_broker.state_broker_member_detail_info}}
                             accountInfo={{...store_broker.state_broker_member_detail_account}}
                             followedList={{...store_broker.state_broker_member_detail_follow_list}}
                             processInfo={store_broker.state_broker_member_detail_process}
                             recommendList={{...store_broker.state_broker_member_detail_recommend_list}}
                             workList={{...store_broker.state_broker_member_detail_work_list}}
                             detailOperate={{...store_broker.state_broker_detail_member_operate}}
                             statusRecord={{...store_broker.state_broker_member_detail_status_record}}
                             recruitList={{...state_common_simple_recruit}}
                             allRecruitList={{...store_mams.state_mams_recruitFilterList}}
                             storeList={{...state_common_store_list}}
                             factoryCheckin={store_broker.state_broker_md_factory}
                             tabList={state_tabPage.tabList}
                             MemberList={{...store_broker.state_broker_memberList}}
                             entry={store_broker.state_broker_entry}
                             pocketInfo={{...store_broker.state_broker_detail_pocket}}
                             alarmClock={{...store_broker.state_broker_member_detail_alarm_clock}}
                             memberTags={{...store_broker.state_broker_member_detail_tags}}
                             brokerInfo={{...store_broker.state_broker_information}}
                             interviewList={{...store_broker.state_broker_member_detail_interview_record}}
                             enrollData={{...store_broker.state_broker_member_detail_enroll_record}}
                             demandsInfo={{...store_broker.state_broker_member_detail_demands_info}}
                             location={{...location}} router={{...router}}/>
        </div>
    );
});
