import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import setParams from 'ACTION/setParams';
import getPouredResouceList from "ACTION/Broker/NeedToDo/getPouredResource";

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const brokerId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginId');

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

class PouredResource extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.pouredPageQueryParams.RecordIndex / this.props.pouredPageQueryParams.RecordSize) + 1,
      pageSize: 20
    };
  }

  componentWillMount() {
    this.fetchPouredResourceList(this.props.pouredPageQueryParams);
  }

  fetchPouredResourceList = (queryParams = {}) => {
    const {
      RecordIndex,
      RecordSize
    } = queryParams;

    getPouredResouceList({
      BrokerID: brokerId,
      RecordSize,
      RecordIndex
    });
  }

  handleTableChange = ({ current, pageSize }) => {
    const {
        pouredPageQueryParams
    } = this.props;

    this.setState({
      page: current,
      pageSize: pageSize
    });

    setParams(STATE_NAME, {
      pouredPageQueryParams: {
        ...pouredPageQueryParams,
        RecordIndex: (current - 1) * pageSize,
        RecordSize: pageSize
      }
    });

    this.fetchPouredResourceList({
      ...pouredPageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }
  
  render() {
    const {
      pouredResourceRecordCount,
      pouredResourceList
    } = this.props;

    const {
      page,
      pageSize
    } = this.state;

    return (
      <div style={{backgroundColor: '#fff', padding: 18}}>
        <Row>
          <Col span={24}>
            <Row className="mt-8">
                <Col span={24}>
                    <Table
                        rowKey={(record, index) => index}
                        dataSource={pouredResourceList}
                        pagination={{
                            total: pouredResourceRecordCount,
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
                            render={(text, record, index) => {
                                return (index + 1) + pageSize * (page - 1);
                            }}
                        />
                        <Column
                            title="会员姓名"
                            dataIndex="RealName"
                            render={(text, record) => {
                              return <Link to={`/broker/member/detail/${record.UserID}?memberName=${record.RealName}&FillInFlag=1`}>{record.RealName}</Link>;
                            }}
                        />
                        <Column
                            title="灌入时间"
                            dataIndex="FillInTime"
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

export default Form.create()(PouredResource);
