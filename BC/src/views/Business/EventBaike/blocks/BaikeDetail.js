/* global tinymce */
import React from 'react';
import {browserHistory } from 'react-router';

import { CONFIG } from 'mams-com';
const { AppSessionStorage } = CONFIG;

import setParams from 'ACTION/setParams';
import doTabPage from 'ACTION/TabPage/doTabPage';

import BaikeService from 'SERVICE/Business/Baike/index';

const {
  getDocDetail,
  deleteDoc
} = BaikeService;

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Card,
  Input,
  Modal,
  Icon,
  message,
  Radio,
  Tabs,
  Checkbox
} from 'antd';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const TabPane = Tabs.TabPane;

const STATE_NAME = 'state_business_bake';

class BaikeDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      detail: {}
    };
  }

  componentWillMount() {
    getDocDetail({
      DocID: +(this.props.location.query.id || 0)
    }).then((res) => {
      if (res.Code === 0) {
        this.setState({
          detail: res.Data || {}
        });
      } else {
        message.error(res.Desc || '出错了，请稍后尝试');
      }
    }).catch((err) => {
      message.error(err.Desc || '出错了，请稍后尝试');
    });
  }

  handleEdit = () => {
    browserHistory.push({
      pathname: '/bc/event-management/baike/edit',
      query: {
        id: this.state.detail.DocID || 0
      }
    });
  }

  handleRemove = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除该条百科吗？',
      onOk: () => {
        deleteDoc({
          DocID: this.state.detail.DocID || 0
        }).then((res) => {
          if (res.Code === 0) {
            message.success('删除成功！');
            this.handleTabClose();
          } else {
            message.error(res.Desc || '出错了，请稍后尝试');
          }
        }).catch((err) => {
          message.error(err.Desc || '出错了，请稍后尝试');
        });
      }
    });
  }

  handleTabClose = () => {
    doTabPage({
      id: this.props.location.pathname + this.props.location.search
    }, 'close');
  }
  
  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    const {
      detail
    } = this.state;

    const extraButtons = (
      <div>
        <Button type="primary" icon="edit" onClick={this.handleEdit}>编辑</Button>
        <Button type="danger" icon="delete" className="ml-10" onClick={this.handleRemove}>删除</Button>
      </div>
    );

    return (
      <div>
        <div style={{padding: 24 }}>
          <Row style={{
            backgroundColor: '#fff'
          }}>
            <Col span={24}>
              <div>
                <Row>
                  <Col span={24}>
                    <div>
                      <Card title={detail.Title || ''} extra={extraButtons} className="baike-card">
                        <div className="card-cnt-wrap">
                          <div dangerouslySetInnerHTML={{__html: (detail.Content || '')}}></div>
                        </div>
                      </Card>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          
        </div>
      </div>
    );
  } 
}

export default Form.create()(BaikeDetail);