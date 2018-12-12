import board from './board'; 
import operate from './operate';
import list from './list';
import report from './report';
export default function () {
    return {
        path: '/',
        indexPage: { // 首页，
            path: ''
        },
        children: [
            ...board,
            ...operate,
            ...list,
            ...report
        ],
        onLastClose: { // 有些特殊页面，当最后一个关闭，需要跳转到指定页面
            '/basicData/company/edit': '/basicData/company',
            '/bAccountManager/agencyAccount/AgencyAccountDetail': '/bAccountManager/agencyAccount',
            '/bAccountManager/entryAndExit/EntryAndExitApply': '/bAccountManager/entryAndExit'
        }
    };
};