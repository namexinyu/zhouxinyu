import React from 'react';

import setParams from 'ACTION/setParams';
import getMemberInterviewRecord from 'ACTION/Broker/MemberDetail/getMemberInterviewRecord';
import getMemberEnrollRecord from 'ACTION/Broker/MemberDetail/getMemberEnrollRecord';

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
  Radio,
  Tabs
} from 'antd';

const { Column, ColumnGroup } = Table;
const TabPane = Tabs.TabPane;

const STATE_NAME_ENROLL = 'state_broker_member_detail_enroll_record';
const STATE_NAME_INTERVIEW = 'state_broker_member_detail_interview_record';

const interviewStatusMap = {
  0: '未处理',
  1: '未面试',
  2: '通过',
  3: '未通过',
  4: '放弃'
};

class BlockCardTabRecords extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTableSpin: false,
            activeTabName: 'interview-tab'
        };
    }

    componentWillMount() {
      this.getTableDataByType(this.state.activeTabName);
    }

    handleTabChange = (key) => {
      this.getTableDataByType(key);
    }

    getTableDataByType(type) {
      const { userId, brokerId } = this.props;

      switch (type) {
        case 'enroll-tab':
          getMemberEnrollRecord({
            BrokerID: brokerId,
            UserID: userId,
            CaseStatus: 0,
            PageInfo: {
              Count: 20,
              Offset: 0
            }
          });
          break;
        case 'interview-tab':
          getMemberInterviewRecord({
            UserID: userId,
            PageInfo: {
              Count: 20,
              Offset: 0
            }
          });
          break;
      }
    }

    handleEnrollTableChange = (pagination) => {
      const { brokerId, userId } = this.props;

      setParams(STATE_NAME_ENROLL, {
        page: pagination.current,
        pageSize: pagination.pageSize
      });

      getMemberEnrollRecord({
        BrokerID: brokerId,
        UserID: userId,
        CaseStatus: 0,
        PageInfo: {
          Count: pagination.pageSize,
          Offset: (pagination.current - 1) * pagination.pageSize
        }
      });
    }

    handleInterviewTablePage = (pagination) => {
      const { userId } = this.props;

      setParams(STATE_NAME_INTERVIEW, {
        page: pagination.current,
        pageSize: pagination.pageSize
      });

      getMemberInterviewRecord({
        UserID: userId,
        PageInfo: {
          Count: pagination.pageSize,
          Offset: (pagination.current - 1) * pagination.pageSize
        }
      });
    }

    render() {
        const {
          enrollData: {
            enrollRecordTotal,
            enrollRecordList = [],
            page: enrollPage,
            pageSize: enrollPageSize
          },
          interviewData: {
            interviewRecordTotal,
            interviewRecordList = [],
            page: interviewPage,
            pageSize: interviewPageSize
          }
        } = this.props;

        const { showTableSpin } = this.state;

        return (
            <Card bordered={false} bodyStyle={{ padding: '10px' }} className="card-tab-container">
              <div className="card-container" >
                <Tabs type="card" defaultActiveKey={this.state.activeTabName} onChange={this.handleTabChange}>
                  <TabPane tab="面试记录" key="interview-tab">
                    <Table scroll={{ y: 240 }}
                        rowKey='UserOrderSettleID'
                        dataSource={interviewRecordList}
                        onChange={this.handleInterviewTablePage}
                        pagination={{
                          total: interviewRecordTotal,
                          current: interviewPage,
                          pageSize: interviewPageSize,
                          showTotal: (total, range) => {
                              return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                          },
                          showQuickJumper: true,
                          showSizeChanger: true,
                          pageSizeOptions: ['20', '40', '80']
                        }}
                        loading={showTableSpin}
                        size="small"
                        bordered>
                        <Column
                            title="面试企业"
                            dataIndex="PositionName"
                        />
                        <Column
                            title="客服处理"
                            dataIndex="ServiceInterviewStatus"
                            width={80}
                            render={(text, record, index) => {
                              return interviewStatusMap[text];
                            }}
                        />
                        <Column
                            title="面试时间"
                            width={150}
                            dataIndex="CheckInTime"
                        />
                    </Table>
                  </TabPane>
                  <TabPane tab="报名记录" key="enroll-tab">
                    <Table scroll={{ y: 240 }}
                        dataSource={enrollRecordList}
                        rowKey='UserRecruitBasicID'
                        onChange={this.handleEnrollTableChange}
                        pagination={{
                          total: enrollRecordTotal,
                          current: enrollPage,
                          pageSize: enrollPageSize,
                          showTotal: (total, range) => {
                              return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                          },
                          showQuickJumper: true,
                          showSizeChanger: true,
                          pageSizeOptions: ['20', '40', '80']
                        }}
                        loading={showTableSpin}
                        size="small"
                        bordered>
                        <Column
                            title="报名企业"
                            dataIndex="PositionName"
                        />
                        <Column
                            title="报名时间"
                            width={150}
                            dataIndex="CreateTime"
                        />
                    </Table>
                  </TabPane>
                </Tabs>
              </div>
            </Card>

        );
    }
}

export default BlockCardTabRecords;
