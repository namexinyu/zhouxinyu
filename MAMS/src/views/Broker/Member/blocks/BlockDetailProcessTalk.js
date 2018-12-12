import React from 'react';
import {browserHistory} from 'react-router';

import Mapping_CallType from 'CONFIG/EnumerateLib/Mapping_CallType';
import Mapping_NeedTodoType from 'CONFIG/EnumerateLib/Mapping_NeedTodoType';

import setParams from 'ACTION/setParams';
import openDialog from 'ACTION/Dialog/openDialog';
import getMemberContactRecord from 'ACTION/Broker/MemberDetail/getMemberContactRecord';
import getMemberScheduleMessageList from 'ACTION/Broker/MemberDetail/getMemberScheduleMessageList';
import getRecruitSimpleList from 'ACTION/Common/getRecruitSimpleList';
import getMemberEstimateApplyList from 'ACTION/Broker/MemberDetail/getMemberEstimateApplyList';
import createDispatchOrder from 'ACTION/Broker/MemberDetail/createDispatchOrder';
import setFetchStatus from "ACTION/setFetchStatus";
import closeMemberApply from 'ACTION/Broker/MemberDetail/closeMemberApply';
import replyFeedback from 'ACTION/Broker/MemberDetail/replyFeedback';
import renewMemberApply from 'ACTION/Broker/MemberDetail/renewMemberApply';
import getMemberStatusRecord from 'ACTION/Broker/MemberDetail/getMemberStatusRecord';
import answerKA from 'ACTION/Broker/MemberDetail/answerKA';
import resetState from 'ACTION/resetState';

import { callTypeMap } from 'UTIL/constant/constant';
import formatDate from 'UTIL/base/formatDate';

import moment from 'moment';

import {
    Button,
    Icon,
    Row,
    Col,
    Modal,
    message,
    Table,
    Select,
    Card,
    Form,
    Input,
    Collapse,
    DatePicker,
    Cascader,
    Tag
} from 'antd';

const {TextArea} = Input;
const FormItem = Form.Item;
const {Option} = Select;
const Panel = Collapse.Panel;
const {Column, ColumnGroup} = Table;

let cardBodyStyle = {
    height: '240px',
    overflowY: 'auto',
    overflowX: 'hidden'
};
const STATE_NAME = 'state_broker_member_detail_process';

class BlockDetailProcess extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showSendLocation: false
        };
    }

    componentWillMount() {
        resetState(STATE_NAME);
        // 获取联系记录
        let now = new Date();
        let sd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 183, 0, 0, 0);
        let ed = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        getMemberContactRecord({
            BrokerID: this.props.brokerId,
            UserID: this.props.userId,
            RecordIndex: this.props.contactIndex,
            RecordSize: this.props.contactPageSize,
            StartTime: new Date(sd).Format('yyyy-MM-dd hh:mm:ss'),
            EndTime: new Date(ed.getFullYear(), ed.getMonth(), ed.getDate() + 1, 0, 0, 0).Format('yyyy-MM-dd hh:mm:ss')
        });
    }

    shouldComponentUpdate() {
        return true;
    }

    getMemberContactRecord(props) {
        getMemberContactRecord({
            BrokerID: props.brokerId,
            UserID: props.userId,
            RecordIndex: (props.page - 1) * props.contactPageSize,
            RecordSize: props.contactPageSize,
            StartTime: new Date(props.contactStartTime).Format('yyyy-MM-dd hh:mm:ss'),
            EndTime: new Date(props.contactEndTime.getFullYear(), props.contactEndTime.getMonth(), props.contactEndTime.getDate() + 1, 0, 0, 0).Format('yyyy-MM-dd hh:mm:ss')
        });
    }

    handleInputChange(e, paramKey) {
        let temp = {};
        if (paramKey === 'contactStartTime' || paramKey === 'contactEndTime') {
            temp[paramKey] = e ? new Date(e.format('YYYY-MM-DD')) : null;
        } else {
            temp[paramKey] = e.target.value;
        }
        setParams(STATE_NAME, temp);
    }

    handleDoSearchContactList() {
        let st = this.props.contactStartTime;
        let et = this.props.contactEndTime;
        let now = new Date();
        
        if (new Date(formatDate(st)).getTime() > new Date(formatDate(et)).getTime()) {
            message.warning('开始时间不能大于结束时间');
            return false;
        }
        if (et >= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)) {
            message.warning('结束时间不能超过今天');
            return false;
        }
        this.getMemberContactRecord(this.props);
    }

    handleTableChange = (pagination) => {
      setParams(STATE_NAME, {
        page: pagination.current,
        pageSize: pagination.pageSize
      });
      getMemberContactRecord({
          BrokerID: this.props.brokerId,
          UserID: this.props.userId,
          RecordIndex: (pagination.current - 1) * pagination.pageSize,
          RecordSize: pagination.pageSize,
          StartTime: new Date(this.props.contactStartTime).Format('yyyy-MM-dd hh:mm:ss'),
          EndTime: new Date(this.props.contactEndTime.getFullYear(), this.props.contactEndTime.getMonth(), this.props.contactEndTime.getDate() + 1, 0, 0, 0).Format('yyyy-MM-dd hh:mm:ss')
      });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {contactList, contactListCount, page, pageSize} = this.props;
        return (
            <div>
                <Row gutter={20}>
                    <Col span={24}>
                        <Card bordered={false} bodyStyle={{padding: '10px'}}
                              title={<div><span>联系记录</span>
                                  <div className="float-right">
                                      <DatePicker allowClear={false} placeholder="开始时间" style={{width: '120px'}}
                                                  value={this.props.contactStartTime ? moment(this.props.contactStartTime.Format('yyyy-MM-dd')) : null}
                                                  onChange={(e) => this.handleInputChange(e, 'contactStartTime')}
                                                  disabledDate={function (current) {
                                                      return current && current.valueOf() > Date.now();
                                                  }}/>
                                      <DatePicker allowClear={false} placeholder="结束时间" className="ml-8"
                                                  style={{width: '120px'}}
                                                  value={this.props.contactEndTime ? moment(this.props.contactEndTime.Format('yyyy-MM-dd')) : null}
                                                  onChange={(e) => this.handleInputChange(e, 'contactEndTime')}
                                                  disabledDate={function (current) {
                                                      return current && current.valueOf() > Date.now();
                                                  }}/>
                                      <Button htmlType="button" size="small" type="primary" className="ml-8"
                                              onClick={() => this.handleDoSearchContactList()}>搜索</Button>
                                  </div>
                              </div>}>
                            <Table scroll={{y: 340}} rowKey={(text, record, index) => index}
                                   dataSource={contactList} bordered={true}
                                   size="small"
                                   onChange={this.handleTableChange}
                                   pagination={{
                                        total: contactListCount,
                                        current: page,
                                        pageSize: pageSize,
                                        showTotal: (total, range) => {
                                            return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                        },
                                        showQuickJumper: true,
                                        showSizeChanger: true,
                                        pageSizeOptions: ['20', '40', '80']
                                   }}>
                                <Column
                                    title="联系时间"
                                    dataIndex="CreateTime"
                                    render={(text, record, index) => {
                                        return (new Date(record.CreateTime).Format('yyyy-MM-dd hh:mm'));
                                    }}
                                    width={150}
                                />
                                <Column
                                    title="填写人"
                                    width={90}
                                    dataIndex="EmployeeName"
                                />
                                <Column
                                    title="联系内容"
                                    dataIndex="Content"
                                />
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockDetailProcess);
