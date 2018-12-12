import React from 'react';
import setParams from 'ACTION/setParams';
import "LESS/pages/index.less";
import {
  Modal,
  Form,
  Button,
  Table
} from 'antd';


class BlockPersonPostModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSendLocation: false,
      visible: true
    };
  }

  factorColumns = [{
    title: '姓名',
    dataIndex: 'real_name'
  }, {
    title: '出生年',
    dataIndex: 'birth_year'
  }, {
    title: '籍贯',
    dataIndex: 'province'
  }, {
    title: '学历',
    dataIndex: 'education'
  }, {
    title: '婚否',
    dataIndex: 'maritial_status'
  }, {
    title: '纹烟残案',
    dataIndex: 'wycas'
  }, {
    title: '出道年',
    dataIndex: 'work_year'
  }];

  dataSource = [{
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
    address1: '100'
  }, {
    key: '562',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
    address1: '100'
  }, {
    key: '342',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
    address1: '100'
  }, {
    key: '12',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
    address1: '100'
  }];


  entryColumns = [{
    title: '序号',
    dataIndex: 'top'
  }, {
    title: '企业',
    dataIndex: 'ent_name'
  }, {
    title: '入职数',
    dataIndex: 'entry_cnt'
  }, {
    title: '总入职数',
    dataIndex: 'entry_total',
    render: (value, row, index) => {
      const obj = {
        children: <span>{value}</span>,
        props: {}
      };
      if (index === 0) {
        obj.props.rowSpan = this.dataSource.length + 1;
        return obj;
      } else {
        obj.props.rowSpan = 0;
        return obj;
      }
    }
  }];

  recommendColumns = [{
    title: '序号',
    dataIndex: 'top'
  }, {
    title: '企业',
    dataIndex: 'ent_name'
  }, {
    title: '推荐数',
    dataIndex: 'pre_check_cnt'
  }, {
    title: '总推荐数',
    dataIndex: 'pre_check_total',
    render: (value, row, index) => {
      const obj = {
        children: <span>{value}</span>,
        props: {}
      };
      if (index === 0) {
        obj.props.rowSpan = this.dataSource.length + 1;
        return obj;
      } else {
        obj.props.rowSpan = 0;
        return obj;
      }
    }
  }];

  handleCancel = () => {
    setParams('state_broker_member_person_post_info', {
      personPostModal: false,
      signPersonPostModal: false
    });
  }

  render () {
    return (
      <div>
        <Modal
          width='30%'
          title='匹配信息'
          visible={this.props.personModal}
          onCancel={this.props.personPostModalCancel}
          footer={[
            <Button key="back" onClick={this.props.personPostModalCancel} type='primary'>我知道了</Button>
          ]}
        >
          <div>
            <Table
              columns={this.factorColumns}
              dataSource={this.props.personInfo.userFeature ? this.props.personInfo.userFeature : []}
              bordered={true}
              pagination={false}
            />
          </div>
          <div style={{ margin: '10px 0' }}>
            <div style={{ marginBottom: '10px' }}>前60天该类会员入职统计：</div>
            <Table
              columns={this.entryColumns}
              dataSource={this.props.personInfo.userTopList ? this.props.personInfo.userTopList : []}
              bordered={true}
              pagination={false}
            />
          </div>
          <div style={{ margin: '10px 0' }}>
            <div style={{ marginBottom: '10px' }}>前60天绩效前30名经纪人的推荐：</div>
            <Table
              columns={this.recommendColumns}
              dataSource={this.props.personInfo.userPreTopList ? this.props.personInfo.userPreTopList : []}
              bordered={true}
              pagination={false}
            />
          </div>
        </Modal>
      </div >
    );
  }
}

export default Form.create({
  mapPropsToFields (props) {
    return {
      // normalContactContent: props.normalContactContent,
      // sendLocation: props.sendLocation,
      // pickupLocation: props.pickupLocation,
      // closeReason: props.closeReason,
      // applyConfirmContact: props.applyConfirmContact,
      // sendBusConfirmContact: props.sendBusConfirmContact,
      // answerKAContent: props.answerKAContent,
      // editPocketRemark: props.editPocketRemark,
      // editPocketUserID: props.editPocketUserID,
      // editPocketDate: props.editPocketDate,
      // editPocketRecruit: props.editPocketRecruit
    };
  },
  onFieldsChange (props, fields) {
    // setParams(STATE_NAME, fields);
  }
})(BlockPersonPostModal);
