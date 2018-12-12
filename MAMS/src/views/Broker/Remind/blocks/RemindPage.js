import React from 'react';
import setParams from 'ACTION/setParams';
import {browserHistory} from 'react-router';
import 'SCSS/pages/broker/remind-view.scss';
import RemindUnRead from './RemindUnRead';
import RemindHistory from './RemindHistory';

import getBirthDayRemindList from 'ACTION/Broker/Remind/getBirthDayRemindList';

export default class RemindPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_remindUnRead';
        this.STATE_NAME_BIRTH = 'state_broker_birthdayRemind';
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.init();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.birth.currentPage !== nextProps.birth.currentPage) {
            this.doQueryBirth(nextProps.birth);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    init() {
        this.doQueryBirth(this.props.birth);
    }

    handleSetShowTag(val) {
        setParams(this.STATE_NAME, {'showTag': val});
    }

    handleCallRefresh() {
        this.doQueryBirth(this.props.birth, true);
        setParams(this.STATE_NAME, {'needRefresh': true});
    }

    doQueryBirth(data, reload = false) {
        let RecordIndex = data.pageSize * (data.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME_BIRTH, {currentPage: 1});
        }
        getBirthDayRemindList({
            BrokerID: 7,
            OrderParams: data.orderParams,
            // QueryParams: [],
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        });
    }

    handleSelectedPageBirth(page) {

        setParams(this.STATE_NAME_BIRTH, {
            currentPage: page
        });
    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    render() {
        let pageData = this.props.remindUnread;
        let birth = this.props.birth;
        return (
            <div className='remind-view page-container'>
                <div className="ivy-page-title">
                    <h1 className="title-text">提醒事项</h1>
                    <span className="refresh-icon" onClick={this.handleCallRefresh.bind(this)}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                    <button className='title-btn btn btn-sm btn-outline-primary title-btn'
                            onClick={() => this.handleGoPage('/broker/broad')}>返回
                    </button>
                    {/* <button className='title-btn btn btn-sm btn-outline-primary title-btn'*/}
                    {/* onClick={() => this.handleGoPage('/broker/remind-history')}>已读历史*/}
                    {/* </button>*/}
                </div>
                <div className='page-body'>
                    <div className='row mt-3'>
                        <div className='col-sm-9 col-lg-9'>
                            <form className='btn-form'>
                                <div className="form-group row">
                                    <div className='col-2'>
                                        <button type="button" onClick={() => this.handleSetShowTag('unread')}
                                                className={`btn btn-block ${pageData.showTag == 'unread' ? 'btn-success' : 'btn-default'}`}>
                                            未读
                                        </button>
                                        {this.props.remindCount > 0 &&
                                        <span className="badge badge-pill badge-danger">{this.props.remindCount}</span>}
                                    </div>
                                    <div className='col-2'>
                                        <button type="button" onClick={() => this.handleSetShowTag('history')}
                                                className={`btn btn-block ${pageData.showTag == 'history' ? 'btn-success' : 'btn-default'}`}>
                                            已读
                                        </button>
                                    </div>

                                </div>
                            </form>
                            <RemindUnRead remindUnread={this.props.remindUnread}
                                          remindHistory={this.props.remindHistory}
                                          birth={this.props.birth}
                                          location={this.props.location}/>
                            <RemindHistory remindUnread={this.props.remindUnread}
                                           remindHistory={this.props.remindHistory}
                                           birth={this.props.birth}
                                           location={this.props.location}/>
                        </div>
                        <div className='col-sm-3 col-lg-3'>
                            <div className='content-chunk' style={{minHeight: '240px', padding: '10px 0'}}>
                                <table className='birth-table table table-sm' style={{marginTop: '0'}}>
                                    <thead>
                                    <tr>
                                        <td colSpan={2} style={{borderTop: 'none'}}>今日生日提醒</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {birth.birthdayRemindList.map((item, index) => (<tr key={index}>
                                        <td>{item.MemberName}</td>
                                        <td>{item.Age}岁</td>
                                    </tr>))}
                                    </tbody>
                                </table>
                                <div className='clear birth-page-div' style={{minHeight: '34px'}}>
                                    <div className='float-left'>
                                        第{birth.currentPage}页/共{Math.ceil(birth.totalSize / birth.pageSize)}页
                                    </div>
                                    <div className='float-right'>
                                        <button className='btn btn-sm btn-warning mr-3'
                                                disabled={birth.currentPage <= 1}
                                                onClick={() => this.handleSelectedPageBirth(birth.currentPage - 1)}>上一页
                                        </button>
                                        <button className='btn btn-sm btn-warning'
                                                disabled={birth.currentPage >= Math.ceil(birth.totalSize / birth.pageSize)}
                                                onClick={() => this.handleSelectedPageBirth(birth.currentPage + 1)}>下一页
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}