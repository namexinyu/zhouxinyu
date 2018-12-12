import React from 'react';
import {Tabs, Menu, Dropdown, Icon} from 'antd';
import doTabPage from 'ACTION/TabPage/doTabPage';
import {browserHistory} from 'react-router';

const TabPane = Tabs.TabPane;

class TabPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentTab.route !== nextProps.currentTab.route) {
            browserHistory.push({
                pathname: nextProps.currentTab.route,
                state: {
                    clickTab: true
                }
            });
        }
    }

    editTab(key) {
        // doTabPage(this.props.currentTab, 'close');
        let tabs = this.props.tabList;
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].id === key) {
                doTabPage(tabs[i], 'close');
                break;
            }
        }
    }

    clickTab(key) {
        if (this.props.currentTab.id === key) {
            return false;
        }
        doTabPage({
            id: key,
            route: key
        }, 'click');
    }

    handleClickMenu(item) {
        if (item.key === '1') {
            doTabPage(this.props.currentTab, 'closeOther');
        }
        if (item.key === '2') {
            doTabPage({}, 'closeAll');
        }
    }

    render() {
        let tabList = this.props.tabList || [];
        const menu = (
            <Menu onClick={this.handleClickMenu.bind(this)}>
                <Menu.Item key="1">关闭其他</Menu.Item>
                <Menu.Item key="2">关闭全部</Menu.Item>
            </Menu>
        );
        return (
            <div style={{display: 'relative', width: '100%'}}>
                <Tabs
                    activeKey={this.props.currentTab.id}
                    type="editable-card"
                    hideAdd={true}
                    onEdit={this.editTab.bind(this)}
                    onTabClick={this.clickTab.bind(this)}
                    tabBarStyle={{ marginBottom: 0 }}
                    className="ivy-tab-page">
                    {
                        tabList.map((item, i) => {
                            return (<TabPane tab={item.name} key={item.route}>{this.props.children}</TabPane>);
                        })
                    }
                </Tabs>
                <div style={{
                    display: 'inline-block',
                    position: 'absolute',
                    right: 0,
                    top: '4px',
                    color: '#999',
                    zIndex: 2,
                    fontSize: '14px'
                }}>
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" href="javascript:void(0)">
                            more <Icon type="down"/>
                        </a>
                    </Dropdown>
                </div>
            </div>


        );
    }
}

export default TabPage;


// import React from 'react';
// import createPureComponent from 'UTIL/createPureComponent';
// import TabContainer from './TabContainer';
//
// export default createPureComponent(({state_tabPage, children}) => {
//     return (
//         <div>
//             <TabContainer {...state_tabPage}/>
//         </div>
//     );
// });


// import React from 'react';
// import {browserHistory} from 'react-router';
// import doTabPage from 'ACTION/TabPage/doTabPage';
// import resetState from 'ACTION/resetState';
//
// class TabPage extends React.PureComponent {
//     constructor(props) {
//         super(props);
//         this.state = {
//             toggleOperate: false
//         };
//     }
//
//     componentWillReceiveProps(nextProps) {
//         if (this.props.currentTab.route !== nextProps.currentTab.route) {
//             browserHistory.push({
//                 pathname: nextProps.currentTab.route,
//                 state: {
//                     clickTab: true
//                 }
//             });
//         }
//     }
//
//     shouldComponentUpdate() {
//         return true;
//     }
//
//     handleClickTab(item) {
//         if (this.props.currentTab.id === item.id) {
//             return false;
//         }
//         doTabPage(item, 'click');
//     }
//
//     handleCloseTab(item) {
//         doTabPage(item, 'close');
//     }
//
//     handleToggleOperate() {
//         this.setState({
//             toggleOperate: !this.state.toggleOperate
//         });
//     }
//
//     handleCloseCurrentTab() {
//         doTabPage(this.props.currentTab, 'close');
//     }
//
//     handleCloseAllTabs() {
//         doTabPage('', 'closeAll');
//     }
//
//     handleCloseOtherTabs() {
//         doTabPage(this.props.currentTab, 'closeOther');
//     }
//
//     render() {
//         let tabList = this.props.tabList;
//         let currentTab = this.props.currentTab;
//         return (
//             <div className="ivy-tabpage">
//                 <div className="tab-group">
//                     {
//                         tabList.map((item, i) => {
//                             return (
//                                 <div className={'tab-item' + (item.id === currentTab.id ? ' active' : '')}>
//                                     <span className="tab-text"
//                                           onClick={() => this.handleClickTab(item)}>{item.name}</span>
//                                     <i className="iconfont icon-guanbi1 icon-close-tab"
//                                        onClick={() => this.handleCloseTab(item)}></i>
//                                 </div>
//                             );
//                         })
//                     }
//                 </div>
//                 <div className="tab-operate" onClick={() => this.handleToggleOperate()}>
//                     <i className={'iconfont more-operate ' + (this.state.toggleOperate ? 'icon-arrow-up' : 'icon-arrow-down')}></i>
//                     {
//                         this.state.toggleOperate && <div className="operate-item">
//                             <ul class="list-group ">
//                                 <li class="list-group-item list-group-item-action list-group-item-light"
//                                     onClick={() => this.handleCloseCurrentTab()}>关闭标签
//                                 </li>
//                                 <li class="list-group-item list-group-item-action list-group-item-light"
//                                     onClick={() => this.handleCloseAllTabs()}>关闭全部标签
//                                 </li>
//                                 <li class="list-group-item list-group-item-action list-group-item-light"
//                                     onClick={() => this.handleCloseOtherTabs()}>关闭其他标签
//                                 </li>
//                             </ul>
//                         </div>
//                     }
//                 </div>
//             </div>
//         );
//     }
// }
//
// export default TabPage;