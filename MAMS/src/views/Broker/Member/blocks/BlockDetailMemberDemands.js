import React from 'react';

import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';

import getMemberDemandsInfo from 'ACTION/Broker/MemberDetail/getMemberDemandsInfo';
import getMemberAskInfo from 'ACTION/Broker/MemberDetail/getMemberAskInfo';

import {
  Button,
  Icon,
  Row,
  Col,
  Modal,
  message,
  Table,
  Card,
  Form,
  Input,
  Collapse,
  DatePicker,
  Cascader,
  Badge
} from 'antd';

const { Column, ColumnGroup } = Table;

const STATE_NAME_PROCESS = 'state_broker_member_detail_process';

const MsgTypeMap = {
  1: '一键导航',
  2: '注册',
  3: '报名',
  4: '关注',
  5: '提问',
  6: '反馈',
  7: '求助',
  8: '划转'
};

class BlockDetailMemberDemands extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showTableSpin: false,
            askId: '',
            askContent: ''
        };
    }

    componentWillMount() {
      const { brokerId, userId } = this.props;

      getMemberDemandsInfo({
        BrokerID: brokerId,
        UserID: userId,
        RecordIndex: 0,
        RecordSize: 900000
      });
    }

    componentWillReceiveProps(nextProps) {
      const { processInfo: { getMemberAskInfoFetch } } = nextProps;


      if (getMemberAskInfoFetch.status === 'success') {// 获取提问详情成功
        setFetchStatus(STATE_NAME_PROCESS, 'getMemberAskInfoFetch', 'close');

        if (getMemberAskInfoFetch.response.Data.UserAsk == null || !getMemberAskInfoFetch.response.Data.UserAsk.length) {
          message.error('没有查询到提问内容');
          return;
        }

        const askContent = (getMemberAskInfoFetch.response.Data.UserAsk || []).filter(item => item.AskID === this.state.askId)[0];
        setParams(STATE_NAME_PROCESS, {
          currentProcessItem: {
            Content: this.state.askContent,
            ...askContent
          },
          showKAAnswer: true
        });
      }

      if (getMemberAskInfoFetch.status === 'error') {// 获取提问详情成功
        setFetchStatus(STATE_NAME_PROCESS, 'getMemberAskInfoFetch', 'close');

        Modal.error({
            title: window.errorTitle.normal,
            content: nextProps.getMemberAskInfoFetch.response.Desc
        });
      }

    }

    handleReply = (record) => {
      const { userId, brokerId } = this.props;

      this.setState({
        askId: record.MsgFlowID,
        askContent: record.Content
      });

      getMemberAskInfo({
        BrokerID: brokerId,
        UserID: userId
      });
    }

    render() {
        const { demandsInfo: { demandsList, recordCount } } = this.props;
        const { showTableSpin } = this.state;

        const cardTitleNode = (
          <span>会员需求<Badge overflowCount={999} count={recordCount} /></span>
        );
        return (
            <Card bordered={false} title={cardTitleNode} bodyStyle={{ padding: '10px' }}>
                <Table
                    scroll={{ y: 240 }}
                    rowKey='MsgFlowID'
                    dataSource={demandsList}
                    pagination={false}
                    loading={showTableSpin}
                    size="small"
                    bordered>
                      <Column
                          title="序号"
                          dataIndex="index"
                          width={50}
                          render={(text, record, index) => {
                            return index + 1;
                          }}
                      />
                      <Column
                          title="产生时间"
                          dataIndex="CreateTime"
                          width={150}
                      />
                      <Column
                          title="需求类型"
                          dataIndex="MsgType"
                          width={80}
                          render={(text, record, index) => {
                            return MsgTypeMap[text];
                          }}
                      />
                      <Column
                          title="详情"
                          dataIndex="Content"
                          render={(text, record, index) => {
                            if (record.MsgType === 5) {// 提问
                              return (
                                <div>
                                  <span>{text}</span>
                                  <Button
                                    style={{ marginLeft: '10px' }}
                                    type="primary"
                                    onClick={() => this.handleReply(record)}
                                    htmlType="button">
                                    回复
                                  </Button>
                                </div>
                              );
                            } else {
                              return text;
                            }
                          }}
                      />
                </Table>
            </Card>

        );
    }
}

export default BlockDetailMemberDemands;
