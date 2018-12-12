import React from 'react';
import {browserHistory } from 'react-router';

import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";

import setParams from 'ACTION/setParams';
import doTabPage from 'ACTION/TabPage/doTabPage';

import Wikis from 'SERVICE/Wiki/index';

const {
  getDocDetail
} = Wikis;

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

class EventWikiDetails extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      detail: {}
    };
  }

  componentDidMount() {
    let DocID = this.props.location.pathname.split("/");
    let ID = DocID[DocID.length - 1] * 1 ;
    getDocDetail({
      DocID: ID
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



  handleTabClose = () => {
    doTabPage({
      id: this.props.location.pathname
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

export default Form.create({})(EventWikiDetails);