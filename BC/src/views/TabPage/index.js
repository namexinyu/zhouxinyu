import React from 'react';
import {Tabs, Menu, Dropdown, Icon} from 'antd';
import doTabPage from 'ACTION/TabPage/doTabPage';
import {browserHistory} from 'react-router';
import tabClose from 'ACTION/tabClose';
import EventEmitter from 'UTIL/EventEmitter';

const TabPane = Tabs.TabPane;

class TabPage extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentTab.id !== nextProps.currentTab.id) {
            browserHistory.push({
                pathname: nextProps.currentTab.route,
                query: nextProps.currentTab.query,
                state: {
                    clickTab: !nextProps.currentTab.needRefresh
                }
            });
        }
    }

    editTab(key) {
        const foundTab = this.props.tabList.filter(item => item.id === key)[0];
        if (foundTab) {
            doTabPage(foundTab, 'close');
            EventEmitter.emit('tab-close', foundTab);
            if (foundTab.close && foundTab.close.STATE_NAME) {
                tabClose(foundTab.close.STATE_NAME, {
                    fieldName: foundTab.close.field,
                    selfClose: this.props.currentTab.id === foundTab.id
                }); 
            }
        }

        // let tabs = this.props.tabList;
        // for (let tab of tabs) {
        //     if (tab.id === key) {
        //         doTabPage(tab, 'close');
        //         if (tab.close && tab.close.STATE_NAME) {
        //             tabClose(tab.close.STATE_NAME, {
        //                 fieldName: tab.close.field,
        //                 selfClose: this.props.currentTab.id === tab.id
        //             });
        //         }
        //         break;
        //     }
        // }
    }

    clickTab(key) {
        if (this.props.currentTab.id === key) {
            return;
        }
        const clickedTab = this.props.tabList.filter(item => item.id === key)[0];
        if (clickedTab) {
            doTabPage(clickedTab, 'click');
            EventEmitter.emit('tab-click', clickedTab);
        }
        // if (this.props.currentTab.id === key) {
        //     return false;
        // }
        // let tabs = this.props.tabList;
        // for (let i = 0; i < tabs.length; i++) {
        //     if (tabs[i].id === key) {
        //         doTabPage(tabs[i], 'click');
        //         break;
        //     }
        // }
    }

    handleClickMenu(item) {
        let curID = this.props.currentTab.id;

        if (item.key === '1') {
            doTabPage(this.props.currentTab, 'closeOther');
            for (let tab of this.props.tabList) {
                if (curID === tab.id) continue;
                if (tab.close && tab.close.STATE_NAME) {
                    tabClose(tab.close.STATE_NAME, {
                        fieldName: tab.close.field,
                        selfClose: curID === tab.id
                    });
                }
            }
        }
        if (item.key === '2') {
            doTabPage({}, 'closeAll');
            for (let tab of this.props.tabList) {
                if (tab.close && tab.close.STATE_NAME) {
                    tabClose(tab.close.STATE_NAME, {
                        fieldName: tab.close.field,
                        selfClose: curID === tab.id
                    });
                }
            }
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
                    tabBarStyle={{marginBottom: 0}}
                    style={{
                        position: 'relative'
                    }}
                    className="ivy-tab-page">
                    {
                        tabList.map((item, i) => {
                            return (<TabPane tab={item.name} key={item.id}/>);
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
