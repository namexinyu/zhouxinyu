import React from 'react';
import {Modal, Row, Col, Button, Table, message} from 'antd';
import setParams from "ACTION/setParams";
import PerformanceAction from 'ACTION/Broker/Performance/PerformanceAction';
import moment from 'moment';
import resetState from "ACTION/resetState";
import {browserHistory} from 'react-router';
import 'LESS/pages/performance-detail-modal.less';

export default class PerformanceDetailModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.goToMemberDetail = this.goToMemberDetail.bind(this);
        const {
            listZxxMD,
            listZxx90,
            listZxx150,
            listZxxLz,
            listWD
        } = props;
        this.tableColumns = {
            listZxxMD: [
                {
                    title: '序号', key: 'seqNo',
                    render: (text, record, index) => {
                        const pageParam = listZxxMD.pageParam;
                        return pageParam.pageSize * (pageParam.currentPage - 1) + index + 1;
                    }
                },
                {
                    title: '姓名', dataIndex: 'RealName',
                    className: 'color-primary td-name',
                    onCellClick: this.goToMemberDetail
                },
                {
                    title: '面试日期', key: 'CheckinTime',
                    render: (text, record) => {
                        const t_t = record.CheckinTime;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {
                    title: '入职日期', key: 'HireDate',
                    render: (text, record) => {
                        const t_t = record.HireDate;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {
                    title: '离职日期', key: 'LeaveDate',
                    render: (text, record) => {
                        const t_t = record.LeaveDate;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                }
            ],
            listZxx90: [
                {
                    title: '序号', key: 'seqNo',
                    render: (text, record, index) => {
                        const pageParam = listZxx90.pageParam;
                        return pageParam.pageSize * (pageParam.currentPage - 1) + index + 1;
                    }
                },
                {
                    title: '姓名', dataIndex: 'RealName',
                    className: 'color-primary td-name',
                    onCellClick: this.goToMemberDetail
                },
                {
                    title: '面试日期', key: 'CheckinTime',
                    render: (text, record) => {
                        const t_t = record.CheckinTime;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {
                    title: '入职日期', key: 'HireDate',
                    render: (text, record) => {
                        const t_t = record.HireDate;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {
                    title: '是否离职', key: 'IsLeave',
                    render: (text, record) => {
                        const t_t = record.LeaveDate;
                        return t_t && moment(t_t).isValid() ? '是' : '否';
                    }
                },
                {
                    title: '离职日期', key: 'LeaveDate',
                    render: (text, record) => {
                        const t_t = record.LeaveDate;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {title: '开始核算日期', dataIndex: 'HireDate90'},
                {title: '结束核算日期', dataIndex: 'LeaveDate90'},
                {title: '本月在职天数', dataIndex: 'HireDay90'},
                {title: '备注', dataIndex: 'Remark'}
            ],
            listZxx150: [
                {
                    title: '序号', key: 'seqNo',
                    render: (text, record, index) => {
                        const pageParam = listZxx150.pageParam;
                        return pageParam.pageSize * (pageParam.currentPage - 1) + index + 1;
                    }
                },
                {
                    title: '姓名', dataIndex: 'RealName',
                    className: 'color-primary td-name',
                    onCellClick: this.goToMemberDetail
                },
                {
                    title: '面试日期', key: 'CheckinTime',
                    render: (text, record) => {
                        const t_t = record.CheckinTime;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {
                    title: '入职日期', key: 'HireDate',
                    render: (text, record) => {
                        const t_t = record.HireDate;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {
                    title: '是否离职', key: 'IsLeave',
                    render: (text, record) => {
                        const t_t = record.LeaveDate;
                        return t_t && moment(t_t).isValid() ? '是' : '否';
                    }
                },
                {
                    title: '离职日期', key: 'LeaveDate',
                    render: (text, record) => {
                        const t_t = record.LeaveDate;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {title: '开始核算日期', dataIndex: 'HireDate150'},
                {title: '结束核算日期', dataIndex: 'LeaveDate150'},
                {title: '本月在职天数', dataIndex: 'HireDay150'},
                {title: '备注', dataIndex: 'Remark'}
            ],
            listZxxLz: [
                {
                    title: '序号', key: 'seqNo',
                    render: (text, record, index) => {
                        const pageParam = listZxxLz.pageParam;
                        return pageParam.pageSize * (pageParam.currentPage - 1) + index + 1;
                    }
                },
                {
                    title: '姓名', dataIndex: 'RealName',
                    className: 'color-primary td-name',
                    onCellClick: this.goToMemberDetail
                },
                {
                    title: '面试日期', key: 'CheckinTime',
                    render: (text, record) => {
                        const t_t = record.CheckinTime;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {
                    title: '入职日期', key: 'HireDate',
                    render: (text, record) => {
                        const t_t = record.HireDate;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                },
                {
                    title: '离职日期', key: 'LeaveDate',
                    render: (text, record) => {
                        const t_t = record.LeaveDate;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                }
            ],
            listWD: [
                {
                    title: '序号', key: 'seqNo',
                    render: (text, record, index) => {
                        const pageParam = listWD.pageParam;
                        return pageParam.pageSize * (pageParam.currentPage - 1) + index + 1;
                    }
                },
                {
                    title: '姓名', dataIndex: 'RealName',
                    className: 'color-primary td-name',
                    onCellClick: this.goToMemberDetail
                },
                {
                    title: '面试日期', key: 'CheckinTime',
                    render: (text, record) => {
                        const t_t = record.CheckinTime;
                        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                    }
                }
            ]
        };
    }

    componentWillMount() {
        this.doQuery();
    }

    handleClickTab(tabName) {
        if (tabName == this.props.CurrentTab) return;
        setParams(this.props.state_name, {CurrentTab: tabName}, {
            [tabName]: Object.assign({}, this.props[tabName], {
                pageParam: {
                    currentPage: 1,
                    pageSize: 10
                }
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        const CurrentTab = nextProps.CurrentTab || 'listZxxMD';
        // 翻页
        if ((nextProps.CurrentTab != this.props.CurrentTab) ||
            (nextProps[CurrentTab].pageParam !== this.props[CurrentTab].pageParam)) {
            this.doQuery(CurrentTab, nextProps[CurrentTab].pageParam);
        }
    }

    doQuery(tab, pageParam) {
        tab = tab || (this.props.CurrentTab || 'listZxxMD');
        pageParam = pageParam || this.props[tab].pageParam;
        const param = Object.assign({}, this.props.Param, {
            RecordIndex: pageParam.pageSize * (pageParam.currentPage - 1),
            RecordSize: pageParam.pageSize
        });
        switch (tab) {
            case "listZxxMD":
                PerformanceAction.GetPerformanceDetailZxxMD(param);
                break;
            case "listZxx90":
                PerformanceAction.GetPerformanceDetailZxx90(param);
                break;
            case "listZxx150":
                PerformanceAction.GetPerformanceDetailZxx150(param);
                break;
            case "listZxxLz":
                PerformanceAction.GetPerformanceDetailZxxLz(param);
                break;
            case "listWD":
                PerformanceAction.GetPerformanceDetailWD(param);
                break;
            default:
                return;
        }
    }

    goToMemberDetail(record) {
        if (!record.BrokerID || !record.UserID) {
            message.destroy();
            message.info('缺少经纪人帐号或用户帐号');
            return;
        }
        if(record.CanNotQry == 1) {
            message.info('已不是你的会员，无法查看详情页');
            return;
        }
        browserHistory.push({
            pathname: '/broker/member/detail/' + record.UserID,
            query: {
                memberName: record.RealName
            }
        });
        resetState(this.props.state_name);
    }

    handleCloseModal() {
        resetState(this.props.state_name);
    }

    render() {
        const state_name = this.props.state_name;
        const CurrentTab = this.props.CurrentTab || 'listZxxMD';
        const tableColumns = this.tableColumns[CurrentTab];
        const data = this.props[CurrentTab];
        console.log('CurrentTab', CurrentTab, this.props[CurrentTab]);
        return (
            <Modal visible={true}
                   className="performance-detail-modal"
                   width={1024}
                   footer={null}
                   onOk={() => this.handleCloseModal()}
                   onCancel={() => this.handleCloseModal()}
                   title="绩效详情">
                <Row className="mt-16 mb-16">
                    <Col offset={2} span={4} className="text-center">
                        <Button type={CurrentTab == 'listZxxMD' ? 'primary' : 'default'}
                                onClick={() => this.handleClickTab('listZxxMD')}>周薪薪绩效名单</Button></Col>
                    <Col span={4} className="text-center">
                        <Button type={CurrentTab == 'listZxx90' ? 'primary' : 'default'}
                                onClick={() => this.handleClickTab('listZxx90')}>{'<=90天总天数'}</Button></Col>
                    <Col span={4} className="text-center">
                        <Button type={CurrentTab == 'listZxx150' ? 'primary' : 'default'}
                                onClick={() => this.handleClickTab('listZxx150')}>{'90<在职<=150天总数'}</Button></Col>
                    <Col span={4} className="text-center">
                        <Button type={CurrentTab == 'listZxxLz' ? 'primary' : 'default'}
                                onClick={() => this.handleClickTab('listZxxLz')}>周薪薪本月已离职</Button></Col>
                    <Col span={4} className="text-center">
                        <Button type={CurrentTab == 'listWD' ? 'primary' : 'default'}
                                onClick={() => this.handleClickTab('listWD')}>我打绩效名单</Button></Col>
                </Row>
                <Table columns={tableColumns}
                       rowKey={(record, index) => index}
                       bordered={true}
                       dataSource={data.RecordList}
                       pagination={{
                           total: data.RecordCount,
                           pageSize: data.pageParam.pageSize,
                           current: data.pageParam.currentPage,
                           onChange: (page, pageSize) => {
                               setParams(state_name, {
                                   [CurrentTab]: Object.assign({}, data, {
                                       pageParam: {
                                           currentPage: page,
                                           pageSize: pageSize
                                       }
                                   })
                               });
                           },
                           onShowSizeChange: (current, size) => {
                               setParams(state_name, {
                                   [CurrentTab]: Object.assign({}, data, {
                                       pageParam: {
                                           currentPage: current,
                                           pageSize: size
                                       }
                                   })
                               });
                           },
                           showSizeChanger: true,
                           showQuickJumper: true,
                           showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                       }}>
                </Table>
            </Modal>);

    }


}