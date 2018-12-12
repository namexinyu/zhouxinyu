import React from 'react';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import {browserHistory} from 'react-router';
import {Layout, Menu, Icon} from 'antd';
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
        let role = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role');
        // 临时代码，填充基础权限
        if (!role || role.length == 0) role = ['Broker'];
        array.map((item, i) => {
            if (this.judgeRole(item.role, role)) {
                // if (true) {
                if (item.sub.length) {
                    let sList = item.sub;
                    let sItems = this.translateHtml(sList);
                    result.push(
                        <SubMenu key={'sub_' + item.id}
                                 title={<span>{item.icon ?
                                     <Icon type={item.icon}/> : ''}<span>{item.name}</span></span>}>
                            {sItems}
                        </SubMenu>
                    );
                } else {
                    result.push(
                        <Menu.Item key={item.route}>
                            {item.icon ? <Icon type={item.icon}/> : ''}
                            <span>{item.name}</span>
                            {item.extraType === 'need' && this.props.waitCount > 0 && (
                                <span style={{
                                    backgroundColor: '#f04134',
                                    verticalAlign: 'middle',
                                    color: '#fff',
                                    padding: '0 6px 1px 6px',
                                    borderRadius: 8,
                                    marginLeft: 6,
                                    fontSize: 16
                                }}>{this.props.waitCount}</span>        
                            )}
                        </Menu.Item>
                    );
                }
            }
        });
        return result;
    }

    handleClickItem(obj) {
        setParams(STATE_NAME, {
            selectedKeys: [obj.key]
        });
        browserHistory.push({
            pathname: obj.key
        });
    }

    onCollapse = (e, c_c) => {
        setParams(STATE_NAME, {collapsed: c_c != undefined ? c_c : !this.props.collapsed});
    };

    render() {
        let navList = this.props.navList || [];
        let navItems = this.translateHtml(navList);
        let abStyle = {
            // position: 'absolute',
            // left: 0,
            // top: 0,
            // overflow: 'hidden',
            overflowY: 'auto',
            maxHeight: '100%',
            height: '100%'
        };
        return (
            <Sider width={150}
                   style={abStyle}
                // onMouseEnter={() => this.onCollapse(null, false)}
                // onMouseLeave={() => this.onCollapse(null, true)}
                //    onMouseOut={() => this.onCollapse(null, true)}
                // collapsible
                //    collapsed={this.props.collapsed}
                // onCollapse={this.onCollapse}
                //    collapsedWidth={60}
            >
                <Menu
                    openKeys={this.props.openKeys}
                    selectedKeys={this.props.selectedKeys}
                    mode="inline" theme="dark"
                    onOpenChange={(openKeys) => {
                        setParams(STATE_NAME, {openKeys});
                    }}
                    onClick={this.handleClickItem}>
                    {navItems}
                </Menu>
            </Sider>
            /* <div style={{position: 'relative', backgroundColor: '#404040', zIndex: 3, width: '150px', minWidth: '150px'}}>

            </div>*/
        );
    }
}

export default PageSide;
