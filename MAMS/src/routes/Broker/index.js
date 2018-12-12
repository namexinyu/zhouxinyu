import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import broker_board from './board';
import broker_career from './career';
import broker_resource from './resource';
import broker_assistance from './assistance';
import broker_member from './member';
import broker_recruit from './recruit';
import broker_track from './track';
import broker_remind from './remind';
// import broker_remindHistory from './remind-history';
import broker_callback from './callback';
import broker_alarmInfo from './alarm-info';
import broker_systemInfo from './system-info';
import broker_need_do from "./need-to-do";
import broker_salary_calculator from './salary-calculator';
import broker_have_done from "./have-done";
import broker_finance from './finance';
// 临时，主管划转会员页面
import broker_manager_transfer from "./manager-transfer";
import broker_transfer_apply from "./transferApply";
import broker_question_reply from "./question-reply";
import event_entry from "./event-entry";
import broker_Message from "./Message";
import broker_exam from "./exam";

export default {
    path: '',
    component: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/App')));
    }),
    childRoutes: [
        broker_board,
        broker_career,
        broker_resource,
        broker_assistance,
        broker_member,
        broker_recruit,
        broker_track,
        broker_remind,
        broker_finance,
        broker_transfer_apply,
        broker_manager_transfer, // 临时
        // broker_remindHistory,
        broker_callback,
        broker_alarmInfo,
        broker_systemInfo,
        broker_need_do,
        broker_salary_calculator,
        broker_have_done,
        broker_question_reply,
        event_entry,
        broker_Message,
        broker_exam
    ]
};