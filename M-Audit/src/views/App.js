import 'LESS/framework.less';
import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PageHeader from 'VIEW/Header/index';
import PageSide from 'VIEW/SideNav/index';
import TabPage from 'VIEW/TabPage/index';
import { Layout, Breadcrumb } from 'antd';
import CommonAction from 'ACTION/Common';

const {
    getRecruitSimpleList,
    getLaborBossSimpleList,
    getLaborSimpleList,
    getEmployeeList,
    getEnterpriseSimpleList,
    getCommonEnumMapping
} = CommonAction;

const { Content } = Layout;

class PageComponent extends React.PureComponent {
    componentWillMount() {
        
    }
    render() {
        return (
            <div className="ivy-page ivy-scroll-box">
                {this.props}
            </div>
        );
    }
}

export default createPureComponent(({ children, location, state_dialog, state_sideNav, state_tabPage, state_header_accountInfo }) => {
    return (
        <Layout style={{ height: '100vh' }}>
            <PageHeader accountInfo={state_header_accountInfo} />
            <Layout>
                <PageSide {...state_sideNav} />
                <Content style={{ position: 'relative' }}>
                    <TabPage {...state_tabPage} />
                    <PageComponent {...children} />
                </Content>
            </Layout>
        </Layout>
    );
});
