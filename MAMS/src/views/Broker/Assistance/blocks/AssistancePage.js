import React from 'react';
import {Menu, Icon} from 'antd';
import AssistanceList from './AssistanceList';
import AssistanceListMy from './AssistanceListMy';
import setParams from "ACTION/setParams";
// import GetDepartmentFilterList from "ACTION/Common/Department/GetDepartmentFilterList";
import GetMAMSEmployeeFilterList from "ACTION/Common/Employee/GetMAMSEmployeeFilterList";
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';

export default class AssistancePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.PlatformObj = mams[CurrentPlatformCode];
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.init();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleRefresh() {
        let page = this.props.assistanceList;
        if (page.currentTab == 'my') {
            let data = this.props.assistanceListMy;
            setParams(data.state_name, {needRefresh: true});
        } else if (page.currentTab == 'all') {
            let data = this.props.assistanceList;
            setParams(data.state_name, {needRefresh: true});
        }
        this.init(true);
    }

    init(reload = false) {
        // if (reload || this.props.departmentFilterList.length == 0) {
        //     GetDepartmentFilterList();
        // }
        if (reload || this.props.employeeFilterList.length == 0) {
            GetMAMSEmployeeFilterList();
        }
    }

    handleClickMenu(e) {
        let page = this.props.assistanceList;
        setParams(page.state_name, {currentTab: e.key});
    }

    render() {
        let page = this.props.assistanceList;
        return (
            <div className='assistance-page-view'>
                <div className="ivy-page-title">
                    <h1>我的施令</h1>
                    <div className="float-right">
                        <Icon type="reload" className="ml-8" style={{fontSize: '16px'}}
                              onClick={() => this.handleRefresh()}/>
                    </div>
                </div>
                {this.PlatformObj && this.PlatformObj.acceptAssistance && this.PlatformObj.buildAssistance ? (
                    <Menu onClick={this.handleClickMenu.bind(this)}
                          selectedKeys={[page.currentTab]}
                          mode="horizontal">
                        <Menu.Item key="all">部门委托</Menu.Item>
                        <Menu.Item key="my">我的施令</Menu.Item>
                    </Menu>
                ) : ''}
                <div className="container-fluid">
                    {/* departmentFilterList={this.props.departmentFilterList}*/}
                    {this.PlatformObj && this.PlatformObj.acceptAssistance && page.currentTab == 'all' ? (
                        <AssistanceList employeeFilterList={this.props.employeeFilterList}
                                        location={this.props.location}
                                        detail={this.props.assistanceDetail}
                                        replyList={this.props.assistanceReplyList}
                            // assistanceNew={this.props.assistanceNew}
                                        list={this.props.assistanceList}></AssistanceList>) : ''}
                    {this.PlatformObj && this.PlatformObj.buildAssistance && page.currentTab == 'my' ? (
                        <AssistanceListMy employeeFilterList={this.props.employeeFilterList}
                                          recruitNameList={this.props.recruitNameList}
                                          location={this.props.location}
                                          assistanceNew={this.props.assistanceNew}
                                          detail={this.props.assistanceDetail}
                                          replyList={this.props.assistanceReplyList}
                                          list={this.props.assistanceListMy}></AssistanceListMy>) : ''}
                </div>

            </div>
        );
    }
}