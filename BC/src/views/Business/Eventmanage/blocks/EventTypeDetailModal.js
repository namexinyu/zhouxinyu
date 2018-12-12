import React from 'react';

import {
  Button,
  Row,
  Col,
  message,
  Table,
  Form,
  Input,
  Modal,
  Cascader,
  Upload,
  Select
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const { Column } = Table;

class EventTypeDetailModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  handleOnCancel = (e) => {
    this.props.onCancel();
  }
  
  render() {
    const {
      form: {
        getFieldDecorator
      },
      detailData = [],
      visible
    } = this.props;

    console.log('detailData', detailData);
    

    const columns = [{
      title: '区名',
      dataIndex: 'DepartName',
      key: 'DepartName'
    }, {
      title: '数量',
      dataIndex: 'EventCount',
      key: 'EventCount'
    }, {
      title: '占比',
      dataIndex: 'EventPercent',
      key: 'EventPercent',
      render: (text) => {
        return text === '' ? '' : `${text}%`;
      }
    }];

    return (
      <Modal
        title="详情"
        visible={visible}
        footer={null}
        onCancel={this.handleOnCancel}
      >
        <Table
          bordered={true}
          dataSource={detailData}
          pagination={false}
          columns={columns}
        />

      </Modal>
    );
  }
}

export default Form.create({})(EventTypeDetailModal);
