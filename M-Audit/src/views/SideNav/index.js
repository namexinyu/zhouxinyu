import React from 'react';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import {browserHistory} from 'react-router';
import {Layout, Menu} from 'antd';
import setParams from 'ACTION/setParams';

const {Sider} = Layout;
const SubMenu = Menu.SubMenu;
const STATE_NAME = 'state_sideNav';

class PageSide extends React.PureComponent {
    judgeRole(roleList, navRoleList) {
        let rl = roleList ? roleList : [];
        let nrl = navRoleList ? navRoleList : [];
        for (let i = 0; i < rl.length; i++) {
            for (let j = 0; j < nrl.length; j++) {
                if (rl[i] === nrl[j]) {
                    return true;
                }
            }
        }
        return false;
    }

    translateHtml(array) {
        let result = [];
        let role = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role') || ['AuditSupervisor', 'Audit'];
        array.map((item, i) => {
            if (this.judgeRole(item.role, role)) {
                // if (true) {
                if (item.sub.length) {
                    let sList = item.sub;
                    let sItems = this.translateHtml(sList);
                    result.push(
                        <SubMenu key={'sub_' + item.id} title={<span>{item.name}</span>}>
                            {sItems}
                        </SubMenu>
                    );
                } else {
                    result.push(
                        <Menu.Item key={item.route}>
                            <span>{item.name}</span>
                        </Menu.Item>
                    );
                }
            }
        });
        return result;
    }

    handleClickItem(obj) {
        setParams(STATE_NAME, {
            selectedKeys: obj.key != '/audit/board' ? [obj.key] : []
        });
        browserHistory.push({
            pathname: obj.key
        });
    }

    render() {

        let navList = this.props.navList || [];
        let navItems = this.translateHtml(navList);
        return (
            <Sider>
                <Menu
                    openKeys={this.props.openKeys}
                    selectedKeys={this.props.selectedKeys}
                    mode="inline" theme="dark"
                    inlineCollapsed={false}
                    onOpenChange={(openKeys) => {
                        setParams(STATE_NAME, {openKeys});
                    }}
                    onClick={this.handleClickItem}>
                    {navItems}
                </Menu>
            </Sider>
        );
    }
}

export default PageSide;


// import React from 'react';
// import setParams from 'ACTION/setParams';
// import {browserHistory} from 'react-router';
// import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
// import App from "../App";
//
// class SideNav extends React.PureComponent {
//     shouldComponentUpdate() {
//         return true;
//     }
//
//     handleClickNav(item) {
//         if (item.sub.length) {
//             setParams('state_sideNav', {
//                 parentNav: item.id === this.props.parentNav.id ? '' : item
//             });
//         }
//
//         if (!item.sub.length && this.props.currentNav.id !== item.id) {
//             setParams('state_sideNav', {
//                 currentNav: item
//             });
//         }
//         if (this.props.location.pathname !== item.route && !item.sub.length) {
//             browserHistory.push({
//                 pathname: item.route
//             });
//         }
//     }
//
//     judgeRole(roleList, navRoleList) {
//         let rl = roleList ? roleList : [];
//         let nrl = navRoleList ? navRoleList : [];
//         for (let i = 0; i < rl.length; i++) {
//             for (let j = 0; j < nrl.length; j++) {
//                 if (rl[i] === nrl[j]) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }
//
//     render() {
//         let parentNav = this.props.parentNav;
//         let currentNav = this.props.currentNav;
//         let navList = this.props.navList || [];
//         let navItems = [];
//         // let role = this.props.user.Role;
//         let role = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role');
//         navList.map((item, i) => {
//             if (this.judgeRole(item.role, role)) {
//                 navItems.push(<li
//                     className={'list-group-item list-group-item-action list-group-item-dark' + (currentNav.id === item.id ? '' : '')}
//                     onClick={() => this.handleClickNav(item)}>{item.name}</li>);
//                 if (item.sub.length) {
//                     let sItems = [];
//                     item.sub.map((sitem, j) => {
//                         if (this.judgeRole(sitem.role, role)) {
//                             sItems.push(<li
//                                 className={'list-group-item list-group-item-action list-group-item-secondary' + (currentNav.id === sitem.id ? '' : '')}
//                                 onClick={() => this.handleClickNav(sitem)}>{sitem.name}</li>);
//                         }
//                     });
//                     if (sItems.length) {
//                         navItems.push(
//                             <div className={'w-100 ' + (parentNav.id === item.id ? 'd-block' : 'd-none')}>
//                                 {sItems}
//                             </div>
//                         );
//                     }
//                 }
//             }
//         });
//         return (
//             <div className="container-fluid ivy-sidenav">
//                 <div className="row">
//                     <ul className="list-group w-100">
//                         {navItems}
//                     </ul>
//                 </div>
//             </div>
//         );
//     }
// }
//
// export default SideNav;