import React from 'react';
import moment from 'moment';
import { getAuthority } from 'CONFIG/DGAuthority';
import { Link } from 'react-router';
import TestResult from 'ACTION/Assistant/TestResult';
import setParams from 'ACTION/setParams';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
import zhuangYuan from 'IMAGE/zhuangyuan.png';
import bangyan from 'IMAGE/bangyan.png';
import tanhua from 'IMAGE/tanhua.png';
import {
  Button,
  Row,
  Col,
  Table,
  Form,
  Input,
  DatePicker,
  Cascader
} from 'antd';

const { getMemberTestList, GetBrokerDepartList } = TestResult;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const STATE_NAME = 'state_ac_MemberTestResult';

const rank = {
  1: '状元',
  2: '榜眼',
  3: '探花'
};

class MemberTest extends React.PureComponent {
  constructor(props) {
    super(props);
    const { DGList } = getAuthority();
    this.state = {
      page: (this.props.MemTestListInfo.pageParams.RecordIndex / this.props.MemTestListInfo.pageParams.RecordSize) + 1,
      pageSize: 40,
      RecordIndex: 0,
      querdata: {},
      DGList,
      DepartID: 0,
      GroupID: 0
    };
  }

  componentDidMount () {
    GetBrokerDepartList();
    this.getResultList();
  }

  getResultList = (pageParams = this.props.MemTestListInfo.pageParams) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const pageQueryParams = this.props.MemTestListInfo.pageQueryParams;
        const queryParams = {
          ...pageQueryParams,
          BrokerName: values.BrokerName,
          QueryDate: moment(values.QueryDate).format('YYYY-MM-DD'),
          DepartID: values.team[0] || 0,
          GroupID: (values.team[0] === -9999 ? -9999 : values.team[1]) || 0
        };
        setParams(STATE_NAME, queryParams);
        getMemberTestList({ ...queryParams, ...pageParams });
      }
    });
  }

  // 搜索
  _handleSearch = () => {
    this.setState({ page: 1 }, () => {
      setParams(STATE_NAME, {
        pageParams: {
          RecordIndex: (this.state.page - 1) * this.state.pageSize,
          RecordSize: this.state.pageSize
        }
      });
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const pageQueryParams = this.props.MemTestListInfo.pageQueryParams;
        setParams(STATE_NAME, {
          pageQueryParams: {
            ...pageQueryParams,
            BrokerName: values.BrokerName,
            QueryDate: values.QueryDate,
            DepartID: values.team[0] || 0,
            GroupID: (values.team[0] === -9999 ? -9999 : values.team[1]) || 0
          }
        });
      }
    });
  }

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

  componentWillReceiveProps (nextProps) {
    // 翻页
    if (this.props.MemTestListInfo.pageParams !== nextProps.MemTestListInfo.pageParams) {
      this.getResultList(nextProps.MemTestListInfo.pageParams);
    }
  }

  // 重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const pageQueryParams = this.props.MemTestListInfo.pageQueryParams;
        setParams(STATE_NAME, {
          pageQueryParams: {
            ...pageQueryParams,
            BrokerName: '',
            QueryDate: moment(new Date()),
            DepartID: '',
            GroupID: ''
          }
        });
      }
    });
  }

  getGroupId = (DepartList) => {
    return DepartList.map((item, index) => {
      return {
        value: item.DepartID,
        label: item.DepartName,
        children: item.GroupList && item.GroupList.map(item => {
          return {
            value: item.GroupID,
            label: item.GroupName
          };
        })
      };
    });
  }

  render () {
    const {
      MemTestListInfo: {
        memberTestList,
        RecordCount,
        isFetching,
        pageQueryParams,
        DepartList
      }
    } = this.props;
    const groupAll = [{ DepartID: -9999, DepartName: '全部' }];
    const groupId = groupAll.concat(DepartList);
    const {
      page,
      pageSize
    } = this.state;

    const QueryDate = moment(this.props.form.getFieldValue('QueryDate')).format('YYYY-MM-DD');
    const columns = [
      {
        title: '排名',
        dataIndex: 'Rank',
        width: 80,
        render: (text, recoder) => {
          if (recoder.Rank < 4) {
            return (
              <div>
                {recoder.Rank === 1 && <img style={{ width: 30, verticalAlign: 'middle' }} src={zhuangYuan} />}
                {recoder.Rank === 2 && <img style={{ width: 30, verticalAlign: 'middle' }} src={bangyan} />}
                {recoder.Rank === 3 && <img style={{ width: 30, verticalAlign: 'middle' }} src={tanhua} />}
                <span style={{ marginLeft: 5 }}>{rank[text]}</span>
              </div>
            );
          } else {
            return (<div>{text}</div>);
          }
        }
      },
      {
        title: '经纪人',
        dataIndex: 'BrokerName',
        width: '11%'
      },
      {
        title: '经纪人编号',
        dataIndex: 'BrokerAccount',
        width: '11%'
      },
      {
        title: '部门',
        dataIndex: 'DepartName',
        width: '11%'
      },
      {
        title: '队',
        dataIndex: 'GroupName',
        width: '11%'
      },
      {
        title: '今日答题量(达标量20)',
        dataIndex: 'TodayCount',
        width: 160,
        render: (text, recoder) => {
          return (
            <div style={recoder.TodayCount >= 20 ? { color: '#00FF00' } : { color: '#FF0000' }}>{text}</div>
          );
        }
      },
      {
        title: '累计会员覆盖率',
        dataIndex: 'TodayPercent',
        width: 130,
        render: (text) => {
          return (<div>{`${text}%`}</div>);
        }
      },
      {
        title: '今日答题记录',
        width: 120,
        render: (record) => {
          return (
            <Link to={{ pathname: `/ac/result/member/detail/${record.BrokerID}/${QueryDate}` }}>查看</Link>
          );
        }
      }
    ];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };

    return (
      <div
        style={{ width: '100%' }}
      >
        <div className="ivy-page-title">
          <h1>会员考试结果统计</h1>
        </div>
        <Row>
          <Col span={24} style={{
            padding: "24px"
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "24px"
            }}>
              <Form>
                <Row>
                  <Col span={20}>
                    <Col span={6}>
                      <FormItem
                        {...formItemLayout}
                        label='考试时间'
                      >
                        {getFieldDecorator('QueryDate',
                          {
                            initialValue: pageQueryParams.QueryDate || {}
                          }
                        )(
                          <DatePicker placeholder='请选择考试时间' />
                        )}
                      </FormItem>
                    </Col>
                    <Col
                      id='orgId'
                      span={6}
                    >
                      <FormItem
                        {...formItemLayout}
                        label='部门/组：'
                      >
                        {getFieldDecorator('team', {
                          initialValue: [pageQueryParams.DepartID, pageQueryParams.GroupID]
                        })(
                          <Cascader
                            allowClear={true}
                            placeholder={'选择部门/组'}
                            changeOnSelect
                            options={this.getGroupId(groupId) || []}
                          >
                          </Cascader>
                        )}
                      </FormItem>
                    </Col>
                    <Col
                      id='orgId'
                      span={6}
                    >
                      <FormItem
                        {...formItemLayout}
                        label='姓名：'
                      >
                        {getFieldDecorator('BrokerName', {
                          initialValue: pageQueryParams.BrokerName || ''
                        })(
                          <Input placeholder='请输入姓名' />
                        )}
                      </FormItem>
                    </Col>
                  </Col>
                  <div
                    style={{ textAlign: 'right' }}
                  >
                    <Button
                      style={{ marginRight: 10 }}
                      type='primary'
                      title='点击查询'
                      onClick={this._handleSearch}
                    >
                      搜索
                  </Button>
                    <Button
                      style={{ marginRight: 10 }}
                      title='重置'
                      onClick={this.handleReset}
                    >
                      重置
                  </Button>
                  </div>
                </Row>
              </Form>
              <Table
                columns={columns}
                rowKey={(item, index) => index}
                dataSource={memberTestList}
                // dataSource={data}
                bordered={true}
                loading={isFetching}
                onChange={this._handleChange}
                pagination={{
                  total: RecordCount,
                  current: page,
                  pageSize: pageSize,
                  pageSizeOptions: ['40', '80', '120'],
                  showTotal: (total, range) => {
                    return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                  },
                  showSizeChanger: true,
                  showQuickJumper: true
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(MemberTest);
