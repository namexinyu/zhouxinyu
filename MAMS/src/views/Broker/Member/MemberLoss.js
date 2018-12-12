import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LossList from './blocks/LossList';
import PageTitle from 'COMPONENT/PageTitle';
import resetState from 'ACTION/resetState';
import getLossList from 'ACTION/Broker/Member/getLossList';

class MemberLoss extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    handleCallRefresh = () => {
        resetState("state_broker_member_lossList");
        getLossList();
    };

    componentWillMount() {
        // 判断是否返回、tab页切换，如果不是则执行下面代码
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getLossList();
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <PageTitle title="转走概况" callRefresh={this.handleCallRefresh}/>
                </div>
                <div className="row">
                    <LossList {...this.props.store_broker.state_broker_member_lossList}/>
                </div>
            </div>
        );
    }
}

export default MemberLoss;