import QueryListPage from 'COMPONENT/QueryListPage/index';
import React from 'react';
import {Icon, Row, Col, Form, Button, message} from 'antd';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import moment from 'moment';
import {DataTransfer, paramTransfer} from 'UTIL/base/CommonUtils';
// 业务相关
import BrokerAction from 'ACTION/Assistant/BrokerAction';
import {getAuthority} from 'CONFIG/DGAuthority';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import setParams from "ACTION/setParams";
const FormItem = Form.Item;
import BrokerService from 'SERVICE/Assistant/BrokerService';

export default class PerformancePK extends QueryListPage {
    constructor(props) {
       const auth = getAuthority();
        const formItemsList = [
            {
                name: 'Date',
                label: "日期",
                itemType: 'MonthPicker',
                placeholder: '选择日期',
                format: 'YYYY-MM',
                allowClear: false,
                initValue: moment()
            },
            {
                name: 'Team',
                label: "部门/组",
                itemType: 'Cascader',
                options: auth.DGList,
                placeholder: '选择部门/组',
                initValue: [-9999]
            },
            {name: 'NickName', label: "经纪人", itemType: 'Input', initValue: ''}
        ];
        super(props, formItemsList);
        this.title = "红绿榜PK";
        this.derive = true;
        this.rowClassName = (record, index) => record.IsPass === 1 ? 'bg-success' : 'bg-danger';
        // this.titleAddOn = 'refresh';
    }

    doMount() {

        // ActionMAMSRecruitment.GetMAMSRecruitFilterList();
    }

    handleConcatOrderParam(d) {
        return {Order: d.orderParams};
    }

    handleCreateParam(d) {
        let param = this.transferParam(d);
        // 日期
        param.Date = param.Date && moment(param.Date).isValid() ? moment(param.Date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        param.EmployeeID = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
        param.Order = d.orderParams;
        return param;
        // this.oriParamJson = JSON.stringify(param);
    }
   
    fast(param, a, b) {
        let DepartID = 0;
        let GroupID = 0;
        let go = {
            RecordIndex: param['RecordIndex'],
            RecordSize: param['RecordSize'],
            Date: param['Date'] ? moment(param['Date']).format('YYYY-MM') + '-01' : '',
            DepartID: a || DepartID,
            GroupID: b || GroupID,
            NickName: param['NickName'],
            EmployeeID: param['EmployeeID'],
            Order: param['Order']
        };
        BrokerAction.GetPerformancePKList(go);
    }
    sendQuery(param) {
        let DepartID = 0;
        let GroupID = 0;
        if(!(param['Team'] && param['Team'][0] == -9999)) {
            DepartID = param['Team'][0];
            GroupID = param['Team'][1];
            this.fast(param, DepartID, GroupID);
            return true;
        }
        this.fast(param);
    }

    //
    // goToMemberDetail(record) {
    //     this.handleGoPage('/ac/member/detail/' + record.BrokerID + '/' + record.UserID);
    // }

    handleTableChange(pagination, filters, sorter) {
        if (sorter) {
            if (sorter.columnKey == 'EntryCount') {
                let s_s = sorter.order == 'ascend' ? 0 : 1;
                if (this.props.list.orderParams != s_s) {
                    setParams(this.props.list.state_name, {orderParams: s_s});
                }
            }
        }
    }

    handleExport = () => {
        const {
            RecordIndex,
            RecordSize,
            Order,
            NickName,
            EmployeeID,
            Date,
            Team
        } = this.handleCreateParam(this.props.list);

        const [departmentId, groupId] = Team;

        BrokerService.ExportPKList({
            RecordIndex,
            RecordSize,
            Date: Date ? moment(Date).format('YYYY-MM') + '-01' : '',
            DepartID: (departmentId === -9999 && departmentId == null) ? 0 : departmentId,
            GroupID: groupId == null ? 0 : groupId,
            NickName,
            EmployeeID,
            Order
        }).then((res) => {
            if (res.Code === 0) {
                message.success('导出成功');
                window.open(res.Data, '_blank');
            } else {
                message.error(res.Desc || '导出失败，请稍后尝试');
            }
        }).catch((err) => {
            message.error(err.Desc || '导出失败，请稍后尝试');
        });
    }

    renderCustomComponent() {
        console.log('renderCustomComponent');
        return (
            <div className="mb-10">
                <Row>
                    <Col span={6}>
                        <Button className="ant-btn ml-8" htmlType="submit" type="primary" onClick={this.handleExport}>导出</Button>
                    </Col>
                </Row>
            </div>
        );
    }

    tableColumns(orderParams) {
        return [
            {
                title: '序号', key: 'seqNo', width: 42, dataIndex: 'key'
            },
            {title: '部门', dataIndex: 'DepartName'},
            {title: '队名', dataIndex: 'GroupName'},
            {title: '工号', dataIndex: 'BrokerAccount'},
            // {title: '粉丝数', dataIndex: 'PreCheckinRecruitName'},
            {title: '经纪人', dataIndex: 'BrokerNickName'},
            {title: '本月段位', dataIndex: 'RankName'},
            {
                title: '入职总数', dataIndex: 'EntryCount'
            },
            {
                title: '排名', dataIndex: 'Rank'
            },
            {title: '实际达标数', dataIndex: 'TodayPassCnt'},
            {title: '达标数', dataIndex: 'PassLevel'}
        ];
    }
}
