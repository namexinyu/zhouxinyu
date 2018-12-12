import 'LESS/framework.less';
import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PageHeader from 'VIEW/Header/index';
import PageSide from 'VIEW/SideNav/index';
import TabPage from 'VIEW/TabPage/index';
import { Layout, Breadcrumb } from 'antd';
import moment from 'moment';
moment.locale('zh-cn');

const { Content } = Layout;

class PageComponent extends React.PureComponent {
    render() {
        return (
            <div className="ivy-page ivy-scroll-box">
                {this.props}
            </div>
        );
    }
}

export default createPureComponent(({ children, location, state_dialog, state_sideNav, state_finance_header_accountInfo, state_tabPage }) => {
    return (
        <Layout style={{ height: '100vh' }}>
            <PageHeader {...state_finance_header_accountInfo} />
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
