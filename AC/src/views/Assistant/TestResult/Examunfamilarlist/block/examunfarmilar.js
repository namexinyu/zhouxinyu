import React from 'react';
import {
  Row,
  Col,
  Cascader,
  Form,
  Table,
  Tabs,
  Icon,
  Input,
  Button,
  Tooltip
} from 'antd';
import setParams from 'ACTION/setParams';
import TestResult from 'ACTION/Assistant/TestResult';
import { Link } from 'react-router';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const STATE_NAME = 'state_ac_GetUnFamiliarList';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const {
  getExamList,
  GetBrokerDepartList
} = TestResult;

class Exam extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      page: (this.props.accountInfo.pageParams.RecordIndex / this.props.accountInfo.pageParams.RecordSize) + 1,
      // page: (40 / 40) + 1,
      pageSize: 40,
      RecordIndex: 0,
      DepartID: 0,
      GroupID: 0,
      ModalExamVisible: false,
      ModalFactoryVisible: false,
      Id: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
      tab: [{
        key: '1',
        tab: '今日不熟悉'
      }, {
        key: '2',
        tab: '历史不熟悉'
      }]
    };
  }

  componentWillMount () {
    // console.log(this.props, "props999");
    GetBrokerDepartList();
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

  getExamList = (pageParams = this.props.accountInfo.pageParams) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const pageQueryParams = this.props.accountInfo.pageQueryParams;
        const queryParams = {
          ...pageQueryParams,
          EmployeeID: this.state.Id,
          QueryType: Number(this.props.accountInfo.pageQueryParams.QueryType),
          Search: values.Search,
          DepartID: values.team && values.team[0] || 0,
          GroupID: values.team && (values.team[0] === -9999 ? -9999 : values.team[1]) || 0
        };
        setParams(STATE_NAME, queryParams);
        getExamList({ ...queryParams, ...pageParams });
      }
    });
  }

  _tabCallback = activeKey => {
    const pageQueryParams = this.props.accountInfo.pageQueryParams;
    setParams(STATE_NAME, { pageQueryParams: { ...pageQueryParams, QueryType: activeKey } });
    setTimeout(() => {
      this.getExamList();
    }, 500);
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
        const pageQueryParams = this.props.accountInfo.pageQueryParams;
        setParams(STATE_NAME, {
          pageQueryParams: {
            ...pageQueryParams,
            Search: values.Search,
            DepartID: values.team && values.team[0] || 0,
            GroupID: values.team && (values.team[0] === -9999 ? -9999 : values.team[1]) || 0
          }
        });
      }
    });
  }

  // 重置
  handleReset = () => {
    this.props.form.resetFields();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const pageQueryParams = this.props.accountInfo.pageQueryParams;
        setParams(STATE_NAME, {
          pageQueryParams: {
            ...pageQueryParams,
            Search: '',
            DepartID: '',
            GroupID: ''
          }
        });
      }
    });
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.accountInfo.pageParams !== nextProps.accountInfo.pageParams) {
      this.getExamList(nextProps.accountInfo.pageParams);
    }
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

  render () {
    const { accountInfo } = this.props;
    const { GetUnFamiliarList, UnFamiliarNumber, ExamedNumber, DepartList, isFetching, pageQueryParams, RecordCount } = accountInfo;
    const groupAll = [{ DepartID: -9999, DepartName: '全部' }];
    const groupId = groupAll.concat(DepartList);
    const { page, pageSize } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    return (
      <div style={{ width: '100%' }}>

        <div className="ivy-page-title">
          <h1>不熟悉会员列表</h1>
        </div>
        <Row>
          <Col span={24} style={{
            padding: "24px"
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "24px 0"
            }}>
              <Col xs={24} md={24} style={{ background: '#fff' }}>
                <Form>
                  <Row>
                    <Col span={18}>
                      <Col
                        id='orgId'
                        span={6}
                      >
                        <FormItem
                          {...formItemLayout}
                          label='部门/组：'
                        >
                          {getFieldDecorator('team', {
                            // initialValue: pageQueryParams.DepartID && pageQueryParams.GroupID ? [pageQueryParams.DepartID, pageQueryParams.GroupID] : pageQueryParams.DepartID
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
                        span={6}
                      >
                        <FormItem
                          {...formItemLayout}
                          label='经纪人：'
                        >
                          {getFieldDecorator('Search', {
                            // initialValue: pageQueryParams.Search || ''
                          })(
                            <Input placeholder='请输入昵称活工号' />
                          )}
                        </FormItem>
                      </Col>
                      <Col span={6} style={{ textAlign: 'right' }}>
                        <Button
                          style={{ marginRight: '10px' }}
                          type='primary'
                          title='点击查询'
                          onClick={this._handleSearch}
                        >
                          搜索
                  </Button>
                        <Button
                          title='重置'
                          onClick={this.handleReset}
                        >
                          重置
                  </Button>
                      </Col>
                    </Col>
                  </Row>
                </Form>
                <Col xs={13} md={13} style={{ padding: '0 20px 20px 20px' }}>
                  <div style={{ background: '#fff', marginTop: '10px' }}>
                    <Tabs activeKey={pageQueryParams.QueryType} onChange={this._tabCallback}>
                      {this.state.tab.map(item => {
                        return <TabPane tab={item.tab} key={item.key} />;
                      })}
                    </Tabs>
                  </div>
                  <div style={{
                    padding: '10px 10px',
                    background: '#fff',
                    marginTop: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                  }}>
                    <div style={{ margin: '10px 0' }}>
                      <Tooltip placement="topLeft" title="考试分数 < 60分" arrowPointAtCenter>
                        <Icon type="question-circle" />
                      </Tooltip>
                      {
                        pageQueryParams.QueryType == 1 &&
                        <span>
                          <span style={{ marginLeft: '10px' }}>今日不熟悉：{UnFamiliarNumber}人</span>
                          <span style={{ marginLeft: '50px' }}>今日考试共计：{ExamedNumber}人</span>
                        </span>
                      }
                      {
                        pageQueryParams.QueryType == 2 &&
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
                            <Link to={`/ac/member/detail/${record.BrokerID}/${record.UserID}`}>
                              <span>{record.UserName}</span>
                            </Link>
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
              </Col>
            </div>
          </Col>
        </Row>
      </div >
    );
  }
}


export default Form.create({
  mapPropsToFields (props) {

  },

  onFieldsChange (props, fields) {

  }
})(Exam);