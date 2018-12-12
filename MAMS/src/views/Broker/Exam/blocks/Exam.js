import React from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Select,
  Table,
  Tabs,
  Icon,
  Tooltip,
  message,
  Alert
} from 'antd';
import 'LESS/Broker/work-board.less';
import { browserHistory } from 'react-router';
import setParams from 'ACTION/setParams';
import LaborTestModal from './LaborTest';
import GetUnFamiliar from 'ACTION/Broker/Exam/exam';
import { Link } from 'react-router';
const STATE_NAME_ACCOUNT = 'state_broker_header_accountInfo';
const STATE_NAME = 'state_ac_GetUnFamiliarList';
const TabPane = Tabs.TabPane;
const {
  getExamList
} = GetUnFamiliar;

class Exam extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      page: (this.props.accountInfo.pageParams.RecordIndex / this.props.accountInfo.pageParams.RecordSize) + 1,
      pageSize: 20,
      RecordIndex: 0,
      timer: '',
      ModalExamVisible: false,
      ModalFactoryVisible: false,
      bPopup: false,
      color: false,
      activeKey: '1',
      tab: [{
        key: '1',
        tab: '今日不熟悉'
      }, {
        key: '2',
        tab: '历史不熟悉'
      }]
    };
  }

  componentDidMount () {
    this.getExamList();
    setInterval(() => {
      this.systemTime();
    }, 1000);
  }

  systemTime = () => {
    const dateTime = new Date();
    const hh = dateTime.getHours();
    const mm = dateTime.getMinutes();
    const ss = dateTime.getSeconds();

    if (hh == 0 && mm == 0 && ss == 0) {
      this.getExamList();
    }
  }

  getExamList = (pageParams = this.props.accountInfo.pageParams) => {
    const queryParams = {
      QueryType: Number(this.props.accountInfo.QueryType)
    };
    // setParams(STATE_NAME, { QueryType: this.state.activeKey });
    getExamList({ ...queryParams, ...pageParams });
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.accountInfo.pageParams !== nextProps.accountInfo.pageParams) {
      this.getExamList(nextProps.accountInfo.pageParams);
    }
  }

  showLaborExam () {
    // this.setState({ModalExamVisible: true}); 
    setParams(STATE_NAME_ACCOUNT, { ModalExamVisible: true, bPopup: false });
  }

  hideLaborExam () {
    setParams(STATE_NAME_ACCOUNT, { ModalExamVisible: false });
    // this.setState({ModalExamVisible: false}); 
  }

  showFactoryExam () {
    setParams(STATE_NAME_ACCOUNT, { ModalFactoryVisible: true, bPopup: false });
    // this.setState({ModalFactoryVisible: true}); 
  }

  hideFactoryExam () {
    setParams(STATE_NAME_ACCOUNT, { ModalFactoryVisible: false });
    // this.setState({ModalFactoryVisible: false}); 
  }

  showLaborTest () {
    // this.setState({ModalExamVisible: true}); 
    setParams(STATE_NAME, { ModalExamTestVisible: true, bPopup: false });
  }

  hideLaborTest () {
    setParams(STATE_NAME, { ModalExamTestVisible: false });
    // this.setState({ModalExamVisible: false}); 
  }

  handleGoExam (RecruitType) {
    if (RecruitType === 1) {
      this.showLaborExam();
    } else if (RecruitType === 2) {
      this.showFactoryExam();
    } else if (RecruitType === 3) {
      this.showLaborTest();
    }
  }

  callback = (tabKey) => {
    setParams(STATE_NAME, { QueryType: tabKey });
    setTimeout(() => {
      this.getExamList();
    }, 500);
  };

  _handleChange = ({ current, pageSize }) => {
    this.setState({
      page: current,
      pageSize: pageSize
    });

    setParams(STATE_NAME, {
      pageParams: {
        RecordIndex: (current - 1) * pageSize,
        RecordSize: pageSize
      }
    });
  }

  changeColor = () => {
    this.setState({
      color: true
    });
  }

  handleClickUser (record) {
    if (record.UserID) {
      browserHistory.push({
        pathname: '/broker/member/detail/' + record.UserID,
        query: {
          memberName: record.UserName
        }
      });
    }
  }

  render () {
    const { accountInfo } = this.props;
    const { GetUnFamiliarList, UnFamiliarNumber, ExamedNumber, isFetching, QueryType, RecordCount } = accountInfo;
    const {
      page,
      pageSize
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>考试测验</h1>
        </div>
        <div style={{ margin: '10%' }}>
          <Col xs={10} md={10}>
            <Col xs={24} md={24}>
              <div className="work-item-container">
                <div className="work-item" onClick={() => {
                  this.handleGoExam(1);
                }}>
                  <span className="work-item-title">会员信息考试</span>

                </div>
              </div>

            </Col>
            <Col xs={24} md={24}>
              <div className="work-item-container">
                <div className="work-item" onClick={() => {
                  this.handleGoExam(3);
                }}>
                  <span className="work-item-title">会员信息练习</span>

                </div>
              </div>

            </Col>
            <Col xs={24} md={24}>
              <div className="work-item-container">
                <div className="work-item" onClick={() => {
                  this.handleGoExam(2);
                }}>
                  <span className="work-item-title">企业信息考试</span>

                </div>
              </div>

            </Col>
          </Col>
          <Col xs={13} md={13}>
            <div style={{ background: '#fff' }}>
              <Tabs activeKey={QueryType} onChange={this.callback}>
                {this.state.tab.map(item => {
                  return <TabPane tab={item.tab} key={item.key} />;
                })}
              </Tabs>
            </div>
            <div style={{ padding: '10px 10px', background: '#fff', marginTop: '10px' }}>
              <div style={{ margin: '10px 0' }}>
                <Tooltip placement="topLeft" title="考试分数 < 60分" arrowPointAtCenter>
                  <Icon type="question-circle" />
                </Tooltip>
                {
                  QueryType == 1 &&
                  <span>
                    <span style={{ marginLeft: '10px' }}>今日不熟悉：{UnFamiliarNumber}人</span>
                    <span style={{ marginLeft: '50px' }}>今日考试共计：{ExamedNumber}人</span>
                  </span>
                }
                {
                  QueryType == 2 &&
                  <sapn>
                    <span style={{ marginLeft: '10px' }}>历史不熟悉：{UnFamiliarNumber}人</span>
                    <span style={{ marginLeft: '50px' }}>历史考试共计：{ExamedNumber}人</span>
                  </sapn>
                }

              </div>
              <Table
                rowKey={(item, index) => index}
                columns={[{
                  title: '序号',
                  dataIndex: 'Index'
                }, {
                  title: '会员姓名',
                  dataIndex: 'UserName',
                  render: (text, record) => {
                    return (
                      <a onClick={() => { this.handleClickUser(record); }}>{record.UserName}</a>
                    );
                  }
                }]}
                dataSource={GetUnFamiliarList}
                onChange={this._handleChange}
                loading={isFetching}
                bordered={true}
                pagination={{
                  size: 'small',
                  total: RecordCount,
                  current: page,
                  pageSize: pageSize,
                  pageSizeOptions: ['20', '40', '80', '120'],
                  showTotal: (total, range) => {
                    return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                  },
                  showSizeChanger: true,
                  showQuickJumper: true
                }}
              />
            </div>
          </Col>
        </div>
        <LaborTestModal
          ModalVisible={accountInfo.ModalExamTestVisible}
          hideModal={this.hideLaborTest.bind(this)}
        />
      </div>
    );
  }
}


export default Form.create({
  mapPropsToFields (props) {

  },

  onFieldsChange (props, fields) {

  }
})(Exam);