import 'LESS/framework.less';
import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import {message} from 'antd';
import PageHeader from 'VIEW/Header/index';
import PageSide from 'VIEW/SideNav/index';
import TabPage from 'VIEW/TabPage/index';
import {Layout, Breadcrumb} from 'antd';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import {withRouter, browserHistory} from 'react-router'; // v2.4 新增的 HoC
import env from 'CONFIG/envs';
import moment from 'moment';

moment.locale('zh-cn');


const {Content} = Layout;

class PageComponent extends React.PureComponent {
    render() {
        console.log(this.props);
        return (
            <div className="ivy-page ivy-scroll-box">
                {this.props}
            </div>
        );
    }
}

export default createPureComponent(({children, location, state_dialog, state_sideNav, state_tabPage, state_ec_headerInfoList}) => {
    // console.log(1111, location);
    //  登录信息及权限校验逻辑
    let storage = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE;
    let EmployeeID = storage.getItem('employeeId');
    // 临时代码，替换原的EmployeeID为employeeId
    if (EmployeeID == null || EmployeeID == undefined) {
        const oriEmployeeID = storage.getItem('EmployeeID');
        EmployeeID = oriEmployeeID;
        storage.removeItem('EmployeeID');
        storage.putItem('employeeId', oriEmployeeID);
    }
    let Token = storage.getItem('Token') || storage.getItem('token');
    let HubList = storage.getItem('HubList');
    if ((EmployeeID == null || EmployeeID == undefined)
        || (Token == null || Token == undefined)
        || (HubList == null || HubList == undefined || HubList.length == 0)) {
        const MAMS_URL = env.mams_url;
        window.location = MAMS_URL + "/login/index";
    }
    return (
        <Layout style={{height: '100vh'}}>
            <PageHeader {...state_ec_headerInfoList}/>
            <Layout>
                <PageSide {...state_sideNav}/>
                <Content>
                    <TabPage {...state_tabPage} />
                    <PageComponent {...children} />
                </Content>
            </Layout>
        </Layout>
    );
});
// export default createPureComponent(({children, location, state_dialog, state_sideNav, state_login, state_tabPage, store_broker}) => {
//     return (
//         <div className="container-fluid">
//             <div className="row sf-header">
//                 <Headers {...store_broker.state_broker_timingTask}
//                         brokerInfo={{...store_broker.state_broker_information}}
//                         loginInfo={{...state_login}} location={{...location}}
//                         accountInfo={store_broker.state_broker_header_accountInfo}/>
//             </div>
//             <div className="row ivy-main">
//                 <div className="ivy-sidenav ivy-scroll-box bg-dark">
//                     <SideNav {...state_sideNav} user={state_login} location={{...location}}/>
//                 </div>
//                 <div className="ivy-content container-fluid">
//                     <div className="row ivy-tab-box">
//                         <TabPage {...state_tabPage} />
//                     </div>
//                     <div className="row ivy-page-box">
//                         <PageComponent {...children} />
//                     </div>
//                 </div>
//             </div>
//             <Dialogs items={state_dialog.dialogs}/>
//         </div>
//     );
// });

