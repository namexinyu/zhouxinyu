import React from 'react';
import { Tabs, Menu, Dropdown, Icon } from 'antd';
import doTabPage from 'ACTION/TabPage/doTabPage';
import { browserHistory } from 'react-router';

const TabPane = Tabs.TabPane;

class TabPage extends React.Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate() {
        return true;
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.currentTab.route !== nextProps.currentTab.route) {
            browserHistory.push({
                pathname: nextProps.currentTab.route,
                state: {
                    clickTab: nextProps.currentTab.needRefresh ? false : true
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
        console.log(key, this.props.tabList, '----------------');
        let tabs = this.props.tabList;
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].id === key) {
                doTabPage(tabs[i], 'click');
                break;
            }
        }
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
            <div style={{ display: 'relative', width: '100%' }}>
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
                            return (<TabPane tab={item.name} key={item.route}></TabPane>);
                        })
                    }

                </Tabs>
                <div style={{ display: 'inline-block', position: 'absolute', right: 0, top: '4px', color: '#999', zIndex: 2, fontSize: '14px' }}>
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" href="javascript:void(0)">
                            more <Icon type="down" />
                        </a>
                    </Dropdown>
                </div>
            </div>

        );
    }
}

export default TabPage;
