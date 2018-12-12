import React from 'react';
import {Modal, Row, Col, Button, Table, message, Form} from 'antd';
import setParams from "ACTION/setParams";
import BrokerAction from 'ACTION/Assistant/BrokerAction';
import moment from 'moment';
import resetState from "ACTION/resetState";
import {browserHistory} from 'react-router';
import SearchFrom from "COMPONENT/SearchForm/index";
import 'LESS/pages/performance-detail-modal.less';

const FormItem = Form.Item;
export default class PerformanceQueryModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formItems = [
            {name: 'SettleMonth', label: '绩效日期', itemType: 'Text', value: props.Param.SettleMonth},
            {name: 'RealName', label: "姓名", itemType: 'Input', rules: [{required: true, message: '请输入姓名后查询'}]}
        ];
        this.ePayType = {
            0: '我打',
            1: '周薪薪'
        };
        this.goToMemberDetail = this.goToMemberDetail.bind(this);
    }

    componentWillMount() {
        // this.handleSearch();
    }

    componentWillReceiveProps(nextProps) {
        let nextData = nextProps.list;
        let curData = this.props.list;
        // 翻页
        if (nextData.pageParam != curData.pageParam) {
            this.doQuery(nextData);
        }
    }

    handleCloseModal = () => {
        resetState(this.props.state_name);
    };

    handleSearch() {
        let list = this.props.list;
        let pageParam = list.pageParam;
        if (pageParam.currentPage === 1) {
            this.doQuery();
        } else {
            let _pageParam = Object.assign({}, pageParam, {currentPage: 1});
            setParams(this.props.state_name, {listBJS: Object.assign({}, this.props.list, {pageParam: _pageParam})});
        }
    }

    doQuery(data) {
        let list = data || this.props.list;
        let pageParam = list.pageParam;
        const param = Object.assign({}, this.props.Param);
        // const param = Object.assign(this.props.Param, {
        //     RecordIndex: pageParam.pageSize * (pageParam.currentPage - 1),
        //     RecordSize: pageParam.pageSize
        // });
        param.RealName = (this.props.queryParams.RealName || {}).value || '';
        BrokerAction.GetPerformanceDetailBJS(param);
    }

    render() {
        let data = this.props.list;
        const state_name = this.props.state_name;
        console.log('performance query modal', this.props);
        return (
            <Modal visible={true}
                   className="performance-detail-modal"
                   width={1024}
                   footer={null}
                   onOk={this.handleCloseModal}
                   onCancel={this.handleCloseModal}
                   title="绩效查询">
                <div>
                    <SearchFrom handleSearch={() => this.handleSearch()}
                                state_name={state_name}
                                queryParams={this.props.queryParams}
                                formItems={this.formItems}>
                    </SearchFrom>
                    <Table columns={this.tableColumns(data.orderParams)}
                           rowKey={(record, index) => index}
                           bordered={true}
                           dataSource={data.RecordList}
                           loading={data.RecordListLoading}
                           onChange={this.handleTableChange}
                           pagination={false}
                    >
                    </Table>
                </div>
            </Modal>
        );
    }

    /* pagination={{
                           total: data.RecordCount,
                           pageSize: data.pageParam.pageSize,
                           current: data.pageParam.currentPage,
                           onChange: (page, pageSize) => {
                               // console.log('QueryListPage Table onChange');
                               setParams(state_name, {
                                   listBJS: Object.assign({}, data, {
                                       pageParam: {currentPage: page, pageSize: pageSize}
                                   })
                               });
                           },
                           onShowSizeChange: (current, size) => {
                               // console.log('QueryListPage Table onChange');
                               setParams(state_name, {
                                   listBJS: Object.assign({}, data, {
                                       pageParam: {currentPage: current, pageSize: size}
                                   })
                               });
                           },
                           showSizeChanger: true,
                           showQuickJumper: true,
                           showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                       }}*/


    goToMemberDetail(record) {
        if (!record.BrokerID || !record.UserID) {
            message.destroy();
            message.info('缺少经纪人帐号或用户帐号');
            return;
        }
        resetState(this.props.state_name);
        browserHistory.push({pathname: '/ac/member/detail/' + record.BrokerID + '/' + record.UserID});
    }

    tableColumns() {
        let list = this.props.list;
        return [
            {
                title: '序号', key: 'seqNo',
                render: (text, record, index) => {
                    const pageParam = list.pageParam;
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
            /*  {
                  title: '是否离职', key: 'IsLeave',
                  render: (text, record) => {
                      const t_t = record.LeaveDate;
                      return t_t && moment(t_t).isValid() ? '是' : '否';
                  }
              },*/
            {
                title: '离职日期', key: 'LeaveDate',
                render: (text, record) => {
                    const t_t = record.LeaveDate;
                    return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
                }
            },
            // {title: '开始核算日期', dataIndex: 'HireDate150'},
            // {title: '结束核算日期', dataIndex: 'LeaveDate150'},
            // {title: '本月在职天数', dataIndex: 'HireDay150'},
            {
                title: '绩效类型', key: 'PerformanceType',
                render: (text, record) => {
                    if (record.Effective === 1) {
                        return this.ePayType[record.Type] || '';
                    }
                    return '不计算';
                }
            },
            {title: '备注', dataIndex: 'Remark'}
        ];
    }
}
