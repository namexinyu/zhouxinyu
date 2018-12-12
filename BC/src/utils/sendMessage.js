import { roleList } from 'UTIL/constant';
import { message } from 'antd';
import CommonService from 'SERVICE/Business/Common/index';

const loginSession = JSON.parse(sessionStorage.getItem('mams_session_login_info'));

export default ({ newMsg = '', oldMsg = '' }) => {
    CommonService.sendMessage({
        BaseNotifyInfo: {
            CanFindEmployeeID: loginSession.employeeId,
            FromEmployeeID: loginSession.employeeId,
            FromEmployeeName: loginSession.accountName,
            NewContext: newMsg,
            NotifyType: 2,
            OldContext: oldMsg,
            OverdueTime: 0,
            PicsPath: [],
            WhoGetTheNotify: roleList.map(item => {
                return {
                    EmployeeID: 0,
                    EmployeeType: item,
                    PushToWhichApp: item === 'Broker' ? 2 : 0
                };
            })
        }
  }).catch((err) => {
    message.error(err.Desc || '发送消息失败');
  });
};