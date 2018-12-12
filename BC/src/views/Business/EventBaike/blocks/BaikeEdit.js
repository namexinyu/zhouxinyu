/* global tinymce */
import React from 'react';
import {browserHistory } from 'react-router';

import TinyEditor from './TinyEditor';
import FooterToolbar from 'COMPONENT/FooterToolbar';

import { CONFIG } from 'mams-com';
const { AppSessionStorage } = CONFIG;

import EventEmitter from 'UTIL/EventEmitter';

import setParams from 'ACTION/setParams';
import doTabPage from 'ACTION/TabPage/doTabPage';
import tabClose from 'ACTION/tabClose';

import BaikeService from 'SERVICE/Business/Baike/index';

const {
  addDoc,
  updateDoc,
  getDocDetail
} = BaikeService;

const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  Modal,
  Dropdown,
  DatePicker,
  Tooltip,
  Menu,
  Icon,
  message,
  Radio,
  AutoComplete,
  Tabs,
  Pagination,
  Checkbox
} from 'antd';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;

const STATE_NAME = 'state_business_bake';

class BaikeEdit extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      EditorContent: ''
    };
  }

  componentWillMount() {
    // console.log(EventEmitter);
    // if (!EventEmitter._event['tab-click']) {
    //   console.log('fetch request');
    //   EventEmitter.on('tab-click', (data) => {
    //     console.log('i know you clicked the tab');
    //     console.log(this.props);
    //     console.log(data);
    //   });
    // }

    // if (!EventEmitter._event['tab-close']) {
    //   EventEmitter.on('tab-close', (data) => {
    //     console.log('i know you closed the tab');
    //     console.log(this.props);
    //     console.log(data);
    //     if (data.id === this.props.location.pathname) {// 关闭了添加页面

    //     }
    //   });
    // }

    // if (this.props.baikeInfo.BaikeUpdatePageParams.needFetch) {
      
    // }

    getDocDetail({
      DocID: +(this.props.location.query.id || 0)
    }).then((res) => {
      if (res.Code === 0) {
        const data = res.Data || {};
        setParams(STATE_NAME, {
          BaikeUpdatePageParams: {
            CategoryInput: {
              value: data.Category || ''
            },
            TitleInput: {
              value: data.Title || ''
            },
            EditorUpdateContent: data.Content || ''
          }
        });
      } else {
        message.error(res.Desc || '出错了，请稍后尝试');
      }
    }).catch((err) => {
      console.log(err);
      message.error(err.Desc || '出错了，请稍后尝试');
    });
    
    
  }

  componentWillUnmount() {
    // EventEmitter.off('tab-click');
  }

  handleSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        const {
          CategoryInput,
          TitleInput
        } = values;

        const editorContent = tinymce.activeEditor.getContent();
        
        if (editorContent.trim() === '') {
          message.warn('详细内容不能为空');
          return;
        }

        updateDoc({
          DocID: +(this.props.location.query.id || 0),
          Category: CategoryInput,
          Title: TitleInput,
          EmployeeID: employeeId,
          Content: editorContent
        }).then((res) => {
          if (res.Code === 0) {
            message.success('事件百科编辑成功');
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

  handleCancel = () => {
    this.handleTabClose();
  }

  handleTabClose = () => {
    doTabPage({
      id: this.props.location.pathname + this.props.location.search
    }, 'close');
  }

  handleEditorChange = (content) => {
    console.log('handleEditorChange', content);
    // setParams(STATE_NAME, {
    //   EditorUpdateContent: content
    // });
  }
  
  render() {
    const {
      form: { getFieldDecorator },
      baikeInfo: {
        BaikeUpdatePageParams: {
          EditorUpdateContent
        }
      }
    } = this.props;

    const footerButtons = (
      <div>
        <Button type="primary" onClick={this.handleSubmit}>提交</Button>
        <Button onClick={this.handleCancel}>取消</Button>
      </div>
    );

    return (
      <div>
        <div style={{padding: '24px 24px 80px'}}>
          <Row style={{
            backgroundColor: '#fff',
            padding: 20
          }}>
            <Col span={24}>
              <div>
                <Row>
                  <Col span={24}>
                    <div>
                      <Form>
                        <Row gutter={8}>
                          <Col span={24}>
                            <FormItem>
                              {getFieldDecorator("CategoryInput")(
                                <Input placeholder="请输入分类" maxLength="100" />
                              )}
                            </FormItem>
                          </Col>
                          <Col span={24}>
                            <FormItem>
                              {getFieldDecorator("TitleInput")(
                                <Input placeholder="标题" maxLength="99" />
                              )}
                            </FormItem>
                          </Col>

                          <Col span={24}>
                            <TinyEditor
                              content={EditorUpdateContent}
                              onChange={this.handleEditorChange}
                            />
                          </Col>
                        </Row>
                      </Form>
                      
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <FooterToolbar extra={footerButtons}>
          </FooterToolbar>
        </div>
      </div>
    );
  } 
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      CategoryInput,
      TitleInput
    } = props.baikeInfo.BaikeUpdatePageParams;

    return {
      CategoryInput,
      TitleInput
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      BaikeUpdatePageParams: Object.assign({}, props.baikeInfo.BaikeUpdatePageParams, fields)
    });
  }
})(BaikeEdit);