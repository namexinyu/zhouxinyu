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
    if (!EventEmitter._event['tab-close']) {
      EventEmitter.on('tab-close', (data) => {
        if (data.id === this.props.location.pathname) {// 关闭了添加页面
          setParams(STATE_NAME, {
            BaikeAddPageParams: {
              CategoryInput: {
                value: ''
              },
              TitleInput: {
                value: ''
              },
              EditorAddingContent: ''
            }
          });
        }
      });
    }
  }

  componentWillUnmount() {
  }

  handleSubmit = () => {
    const isEdit = this.props.router.params.type === 'edit';

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

        addDoc({
          Category: CategoryInput,
          Title: TitleInput,
          EmployeeID: employeeId,
          Content: editorContent
        }).then((res) => {
          if (res.Code === 0) {
            message.success('事件百科添加成功');
            this.handleCancel();
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
    this.clearData();
  }

  handleTabClose = () => {
    doTabPage({
      id: this.props.location.pathname
    }, 'close');
  }

  clearData() {
    setParams(STATE_NAME, {
      BaikeAddPageParams: {
        CategoryInput: {
          value: ''
        },
        TitleInput: {
          value: ''
        },
        EditorAddingContent: ''
      }
    });
  }

  handleEditorChange = (content) => {
    console.log('handleEditorChange', content);
    setParams(STATE_NAME, {
      BaikeAddPageParams: {
        ...this.props.baikeInfo.BaikeAddPageParams,
        EditorAddingContent: content        
      }
    });
  }
  
  render() {
    const {
      form: { getFieldDecorator },
      baikeInfo: {
        BaikeAddPageParams: {
          EditorAddingContent
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
                              content={EditorAddingContent}
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
    } = props.baikeInfo.BaikeAddPageParams;

    return {
      CategoryInput,
      TitleInput
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      BaikeAddPageParams: Object.assign({}, props.baikeInfo.BaikeAddPageParams, fields)
    });
  }
})(BaikeEdit);