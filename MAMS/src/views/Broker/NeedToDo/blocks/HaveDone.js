import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import {browserHistory} from 'react-router';

import setParams from 'ACTION/setParams';
import alreadyInfoList from "ACTION/Broker/NeedToDo/NeedAready";

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  Modal,
  DatePicker,
  message
} from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;

const STATE_NAME = 'state_need_to_do_data';

class HaveDone extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.donePageQueryParams.RecordIndex / this.props.donePageQueryParams.RecordSize) + 1,
      pageSize: 20
    };
  }

  componentWillMount() {
    this.fetchAlreadyInfoList(this.props.donePageQueryParams);
  }

  fetchAlreadyInfoList = (queryParams = {}) => {
    const {
      Name, 
      Mobile,
      CreatedTime,
      RecordIndex,
      RecordSize
    } = queryParams;

    alreadyInfoList({
      UserName: Name.value || '',
      Phone: Mobile.value || '',
      StarTime: CreatedTime.value && moment(CreatedTime.value[0]).isValid() ? moment(CreatedTime.value[0]).format('YYYY-MM-DD') : '',
      EndTime: CreatedTime.value && moment(CreatedTime.value[1]).isValid() ? moment(CreatedTime.value[1]).format('YYYY-MM-DD') : '',
      RecordSize,
      RecordIndex
    });
  }

  handleSearch = () => {
    const {
        donePageQueryParams
    } = this.props;

    this.setState({
      page: 1,
      pageSize: donePageQueryParams.RecordSize
    });

    setParams(STATE_NAME, {
      donePageQueryParams: {
        ...donePageQueryParams,
        RecordIndex: 0,
        RecordSize: donePageQueryParams.RecordSize
      }
    });

    this.fetchAlreadyInfoList({
      ...donePageQueryParams,
      RecordIndex: 0,
      RecordSize: donePageQueryParams.RecordSize
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({
        Name: '', 
        Mobile: '',
        CreatedTime: [moment(new Date(new Date().getTime() - 7776000000)), moment()]
      });
  }

  handleTableChange = ({ current, pageSize }) => {
    const {
        donePageQueryParams
    } = this.props;

    this.setState({
      page: current,
      pageSize: pageSize
    });

    setParams(STATE_NAME, {
      donePageQueryParams: {
        ...donePageQueryParams,
        RecordIndex: (current - 1) * pageSize,
        RecordSize: pageSize
      }
    });

    this.fetchAlreadyInfoList({
      ...donePageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleClickUser(record, index, event) {
    if (record.UserID) {
        browserHistory.push({
            pathname: '/broker/member/detail/' + record.UserID,
            query: {
                memberName: record.Name
            }
        });
    }
}
  
  render() {
    const {
      form: { getFieldDecorator },
      alreadyInfoRecordCount,
      alreadyInfoList
    } = this.props;

    const {
      page,
      pageSize
    } = this.state;    

    return (
      <div style={{backgroundColor: '#fff', padding: 18}}>
        <Row>
          <Col span={24}>
            <Row>
                <Col span={24}>
                    <div>
                        <Form>
                            <Row gutter={8}>
                                <Col span={6}>
                                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="创建时间">
                                        {getFieldDecorator('CreatedTime')(
                                            <RangePicker style={{width: "100%"}}/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="会员姓名">
                                        {getFieldDecorator('Name')(
                                            <Input autoComplete="off" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="会员电话">
                                        {getFieldDecorator('Mobile', {
                                            rules: [
                                                {
                                                    pattern: /^1[2-9][0-9]\d{8}$/,
                                                    message: '请输入正确的11位手机号'
                                                }
                                            ]
                                        })(
                                            <Input type="tel" maxLength="11" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <div style={{paddingLeft: 24}}>
                                        <Button type="primary" size="large" onClick={this.handleSearch}>搜索</Button>
                                        <Button style={{ marginLeft: 16 }} size="large" onClick={this.handleReset}>重置</Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>
            </Row>

            <Row className="mt-8">
                <Col span={24}>
                    <Table
                        rowKey={(record, index) => index}
                        onRowClick={this.handleClickUser}
                        dataSource={alreadyInfoList}
                        pagination={{
                            total: alreadyInfoRecordCount,
                            defaultPageSize: pageSize,
                            defaultCurrent: page,
                            current: page,
                            pageSize: pageSize,
                            pageSizeOptions: ['20', '40', '80'],
                            showTotal: (total, range) => {
                            return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                            },
                            showSizeChanger: true,
                            showQuickJumper: true
                        }}
                        bordered={true}
                        onChange={this.handleTableChange}
                    >
                        <Column
                            title="序号"
                            dataIndex="seqNo"
                            width={42}
                            render={(text, record, index) => {
                                return (index + 1) + pageSize * (page - 1);
                            }}
                        />
                        <Column
                            title="创建时间"
                            dataIndex="Retime"
                            render={(text) => {
                                return new Date(text).Format('yyyy-MM-dd hh:mm');
                            }}
                        />
                        <Column
                            title="会员姓名"
                            dataIndex="Name"
                            render={(text, record) => {
                                return <Link to={`/broker/member/detail/${record.UserID}?memberName=${record.Name}`}>{record.Name}</Link>;
                            }}
                        />
                        <Column
                            title="需求类型"
                            dataIndex="ReType"
                            render={(text) => {
                                const ReTypeMap = {
                                    1: '一键导航',
                                    2: '注册',
                                    3: '报名',
                                    4: '关注',
                                    5: '提问',
                                    6: '反馈',
                                    7: '求助',
                                    8: '划转'
                                };
                                return ReTypeMap[text] || '';
                            }}
                        />
                        <Column
                            title="需求说明"
                            dataIndex="ReContent"
                        />
                    </Table>
                </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      Name,
      Mobile,
      CreatedTime
    } = props.donePageQueryParams;

    return {
      Name,
      Mobile,
      CreatedTime
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      donePageQueryParams: Object.assign({}, props.donePageQueryParams, fields)
    });
  }
})(HaveDone);
