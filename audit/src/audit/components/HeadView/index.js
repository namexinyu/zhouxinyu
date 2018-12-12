import React from 'react';
import {Icon, Badge} from 'antd';
import './index.less';

class HeadView extends React.Component {

    render() {
        const {collapsed, onTriggerClick, handleLogout, accountInfo} = this.props;
        return (
            <div className='main-layout-header'>
                <div className='header-right'>
                    <i className='iconfont icon-wo mr-24'/>
                    <pre className='account-info'>
                        {`您好，${accountInfo.Name || ''}\n${accountInfo.SPName ? accountInfo.SPName + '，' : ''}${accountInfo.RoleName || ''}`}</pre>
                    <div className='line ml-24 mr-24'/>
                    <i className='iconfont icon-Logout' onClick={handleLogout}/>
                </div>
            </div>
        );
    }
}

export default HeadView;
