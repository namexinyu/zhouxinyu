import React, { Component } from 'react';
import {
  Row,
  Col,
  DatePicker,
  Form,
  Select,
  Table,
  Button,
  InputNumber,
  Modal,
  Input,
  Alert,
  message
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';
import moment from 'moment';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

const BrokerID = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginId');
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
let Timer;
let notifyTimer;
let timeout;
const Province = [
  { valueKey: 34, text: '河南/豫' },
  { valueKey: 46, text: '陕西/陕' },
  { valueKey: 41, text: '甘肃/甘' },
  { valueKey: 37, text: '山西/晋' },
  { valueKey: 45, text: '安徽/皖' },
  { valueKey: 25, text: '江苏/苏' },
  { valueKey: 29, text: '山东/鲁' },
  { valueKey: 18, text: '四川/川' },
  { valueKey: 19, text: '湖北/鄂' },
  { valueKey: 17, text: '云南/滇' },
  { valueKey: 28, text: '北京/京' },
  { valueKey: 14, text: '天津/津' },
  { valueKey: 39, text: '河北/冀' },
  { valueKey: 43, text: '内蒙古/蒙' },
  { valueKey: 16, text: '辽宁/辽' },
  { valueKey: 44, text: '吉林/吉' },
  { valueKey: 31, text: '黑龙江/黑' },
  { valueKey: 40, text: '上海/沪' },
  { valueKey: 32, text: '浙江/浙' },
  { valueKey: 38, text: '福建/闽' },
  { valueKey: 33, text: '江西/赣' },
  { valueKey: 26, text: '湖南/湘' },
  { valueKey: 15, text: '广东/粤' },
  { valueKey: 35, text: '广西/桂' },
  { valueKey: 22, text: '海南/琼' },
  { valueKey: 27, text: '重庆/渝' },
  { valueKey: 24, text: '贵州/黔' },
  { valueKey: 20, text: '西藏/藏' },
  { valueKey: 36, text: '青海/青' },
  { valueKey: 21, text: '宁夏/宁' },
  { valueKey: 30, text: '新疆/新' },
  { valueKey: 23, text: '台湾/台' },
  { valueKey: 42, text: '香港/港' },
  { valueKey: 47, text: '澳门/澳' }
];

class LaborExamModal extends React.PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      bVisable: false,
      RecordListLoading: false,
      leftTime: 60,
      disableInput: false,
      bShowNext: false,
      bJieshu: false,
      bShowNotification: false,
      Age: '',
      InnerTestID: 0,
      Birth: '',
      Education: '',
      ExperienceYear: '',
      Married: '',
      Origin: { text: '', value: '' },
      Wycas: [],
      Expect: '',
      Advantage: '',
      Shortcomings: '',
      Where: '',
      examSource: [],
      fullyear: []
    };

  }

  componentWillMount () {
    this.getFullYear();
  }

  getFullYear = () => {
    const fullyear = [];
    const year = new Date().getFullYear();
    const beginYear = year - 60;
    for (var i = beginYear; i <= year; i++) {
      fullyear.push(i);
    }

    fullyear.sort((year, beginYear) => {
      return beginYear - year;
    });

    this.setState({
      fullyear: fullyear
    });
  }
  setNotifyTime = () => {
    if (this.state.leftNotifyTime > 0) {
      this.setState({ leftNotifyTime: (this.state.leftNotifyTime - 1) });
    } else {
      clearInterval(notifyTimer);
      this.setState({ bShowNotification: false });
      this.getExamDetail({ BrokerID: BrokerID });
    }
  }

  componentWillReceiveProps (nextProps) {

    if (!this.state.bVisable && this.state.bVisable != nextProps.ModalVisible) {
      this.initData();
      this.setState({ bShowNext: false, bShowNotification: true, bJieshu: false, leftNotifyTime: 5 });
      clearInterval(notifyTimer);
      notifyTimer = setInterval(this.setNotifyTime, 1000);
      clearTimeout(timeout);
    }
    this.state.bVisable = nextProps.ModalVisible;
  }

  getExamDetail (params) {
    this.initData();
    this.setState({ RecordListLoading: true });
    return HttpRequest.post({
      url: env.api_url + '/BK_Exam/BK_User_GetQuestion',
      params: params
    }, {
        successDo: (res) => {
          if (res.Code == 0) {
            let data = res.Data;
            let td = {
              ContactDate: data.ContactDate,
              CurrentTestID: data.CurrentTestID,
              RealName: data.RealName,
              Year: data.Year,
              Jiguan: data.CurrentTestID,
              Hunfou: data.CurrentTestID,
              Xueli: data.CurrentTestID,
              WYCAS: data.CurrentTestID,
              DGZY: data.CurrentTestID,
              DJS: data.CurrentTestID,
              opration: data.CurrentTestID,
              UUID: data.UUID,
              Mobile: data.Mobile
            };
            this.setState({
              RecordListLoading: false,
              InnerTestID: data.InnerTestID,
              leftTime: data.TimeLeft,
              UserID: data.UserID,
              bJieshu: data.EndFlag,
              examSource: [td]
            });
            clearInterval(Timer);
            Timer = setInterval(this.handleTime, 1000);
            this.setState({ disableInput: false, bShowNext: false, RecordListLoading: false });
          } else {
            this.setState({ RecordListLoading: false });
            clearInterval(Timer);
          }

        },
        errorDo: (res) => {
          /*
          let data = res;
          let td = {
                      ContactDate: '1998-11-11',
                      CurrentTestID: 2,
                      RealName: 'data.RealName',
                      Year: 2,
                      Jiguan: 2,
                      Hunfou: 2,
                      Xueli: 2,
                      WYCAS: 2,
                      DGZY: 2,
                      DJS: 2,
                      opration: 2               
              };
          this.setState({
              RecordListLoading: false,                    
              InnerTestID: 2,
              leftTime: 60,
              bJieshu: 1,
              examSource: [td]
          });
          this.initData();
          clearInterval(Timer);
          Timer = setInterval(this.handleTime, 1000);
          this.setState({disableInput: false, bShowNext: false, RecordListLoading: false});
          */
        }
      });
  }

  postExam (params) {
    this.setState({ RecordListLoading: true });
    clearInterval(Timer);
    return HttpRequest.post({
      url: env.api_url + '/BK_Exam/BK_User_ReplyAnswer',
      params: params
    }, {
        successDo: (res) => {
          this.setState({ disableInput: true, bShowNext: true, RecordListLoading: false });
        },
        errorDo: (res) => {
          this.setState({ disableInput: true, bShowNext: true, RecordListLoading: false });
        }
      });
  }

  sendCloseModal (params) {
    return HttpRequest.post({
      url: env.api_url + '/BK_Exam/BK_User_CloseExam',
      params: params
    }, {
        successDo: (res) => {
        },
        errorDo: (res) => {
        }
      });
  }

  postOther (params) {
    this.setState({ RecordListLoading: true });
    return HttpRequest.post({
      url: env.api_url + '/BK_Exam/BK_User_ReplyOtherInfo',
      params: params
    }, {
        successDo: (res) => {
          // this.setState({disableInput: false, bShowNext: false, RecordListLoading: false});
        },
        errorDo: (res) => {
          // this.setState({disableInput: false, bShowNext: false, RecordListLoading: false});
        }
      });
  }

  saveYear = (value) => {
    if (value && Number.isInteger(value)) {
      let age = Number.parseInt(moment(new Date()).format('YYYY'), 10) - Number.parseInt(value, 10);
      this.setState({ Birth: value, Age: '(' + age + ')' });
    } else {
      this.setState({ Birth: '', Age: '' });
    }
  }

  saveJiguan = (obj) => {
    let value = obj;
    this.setState({ Origin: value });
  }

  saveXueli = (obj) => {
    let value = obj;
    this.setState({ Education: value });
  }

  saveHunfou = (obj) => {
    let value = obj;
    this.setState({ Married: value });
  }

  handleWYCAS = (obj) => {
    let value = obj;
    this.setState({ Wycas: value });
  }

  handleDGZY = (obj) => {
    let value = obj;
    this.setState({ ExperienceYear: value });
  }

  handleTime = () => {
    if (this.state.leftTime > 0) {
      this.setState({ leftTime: (this.state.leftTime - 1) });
    } else {
      clearInterval(Timer);
      this.submitExam();
      let menuObj = document.getElementsByClassName('ant-select-dropdown--multiple')[0];
      let classList = menuObj.getAttribute('class');
      if (classList.indexOf('ant-select-dropdown-hidden')) {
        classList = classList + ' ant-select-dropdown-hidden';
        menuObj.setAttribute('class', classList);
      }
    }
  }

  submitExam = (text, record) => {
    let Wycas = this.state.Wycas.map((item) => Number.parseInt(item, 10));
    let params = {
      UUID: record.UUID,
      InnerTestID: this.state.InnerTestID,
      UserID: this.state.UserID
    };
    if (this.state.Birth) params.Birth = Number.parseInt(this.state.Birth, 10);
    if (this.state.Education) params.Education = Number.parseInt(this.state.Education, 10);
    if (this.state.Married) params.Married = Number.parseInt(this.state.Married, 10);
    if (this.state.ExperienceYear) params.ExperienceYear = Number.parseInt(this.state.ExperienceYear, 10);
    if (this.state.Origin.value) params.Origin = Number.parseInt(this.state.Origin.value, 10);
    if (this.state.Wycas && this.state.Wycas.length) params.Wycas = Wycas;
    /*
    let params = {
        Birth: ,
        Education: this.state.Education.value,
        Experience: Number.parseInt(this.state.Experience, 10), 
        InnerTestID: this.state.InnerTestID,
        UserID: this.state.UserID,
        Married: Number.parseInt(this.state.Married, 10),
        Origin: Number.parseInt(this.state.Origin.value, 10),
        Wycas: Wycas
    };
    */
    this.postExam(params);
  }

  initData () {
    this.setState({
      Birth: '',
      Age: '',
      Education: '',
      ExperienceYear: '',
      Married: '',
      Origin: '',
      Wycas: [],
      Expect: '',
      Advantage: '',
      Shortcomings: '',
      Where: ''
    });
  }

  handleNext = (e) => {
    let params = {
      ExperienceYear: this.state.ExperienceYear,
      Advantage: this.state.Advantage,
      Shortcomings: this.state.Shortcomings,
      Where: this.state.Where,
      InnerTestID: this.state.InnerTestID,
      UserID: this.state.UserID
    };
    this.postOther(params);
    this.getExamDetail({ BrokerID: BrokerID });
  }

  handleEnd = (e) => {
    let params = {
      Expect: this.state.Expect,
      Advantage: this.state.Advantage,
      Shortcomings: this.state.Shortcomings,
      Where: this.state.Where,
      InnerTestID: this.state.InnerTestID,
      UserID: this.state.UserID
    };
    this.postOther(params);
    this.props.hideModal();
    message.success('请继续加油，希望你的成绩更上一层楼^_^。');
  }

  closeModal () {
    // console.log('this.props.bPopup', this.props.bPopup);
    if (this.props.bPopup) {
      this.sendCloseModal({ BrokerID: BrokerID, CurrExamType: 1 });
    }
    this.props.hideModal();
  }

  handleChangeTmpReply = (e) => {
    this.setState({
      ExperienceYear: e.target.value
    });
  }

  _filterOption = (input, option) => {
    return option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  render () {
    return (
      <Modal
        title="会员信息考试"
        visible={this.props.ModalVisible}
        footer={null}
        maskClosable={false}
        width='100%'
        height={800}
        onCancel={() => this.closeModal()}
      >
        <Alert
          style={{ display: (this.state.bShowNotification ? '' : 'none') }}
          message="考试须知："
          description={<span>考试即将开始，请注意关闭手机及其他通讯设备。(<span style={{ color: 'red' }}>{this.state.leftNotifyTime}</span>秒)</span>}
          type="warning"
          showIcon />
        <span style={{ display: (this.state.bShowNotification ? 'none' : '') }}>
          <Table
            rowKey={(record, index) => index}
            bordered={true}
            pagination={false}
            columns={[{
              title: '编号',
              dataIndex: 'CurrentTestID',
              width: 50
            }, {
              title: '联系日期',
              dataIndex: 'ContactDate',
              width: 100,
              render: (text, record) => moment(text).format("YYYY-MM-DD")
            }, {
              title: '姓名',
              dataIndex: 'RealName'
            }, {
              title: '手机号码',
              dataIndex: 'Mobile'
            }, {
              title: '出生年',
              dataIndex: 'Year',
              width: 100,
              render: (text, record) => (
                <span>
                  <InputNumber disabled={this.state.disableInput} value={this.state.Birth} style={{ width: '100%' }} min={1900} max={2050} onChange={this.saveYear} className="input-number--normal" />
                  <span>{this.state.Age}</span>
                </span>
              )
            }, {
              title: '籍贯',
              dataIndex: 'Jiguan',
              render: (text, record) => (
                <AutoCompleteInput
                  style={{width: 90}}
                  disabled={this.state.disableInput}
                  maxLength="50"
                  value={this.state.Origin.text}
                  textKey="text"
                  valueKey="valueKey"
                  dataSource={Province}
                  onChange={this.saveJiguan}
                />
              )
            }, {
              title: '学历',
              dataIndex: 'Xueli',
              render: (text, record) => (
                <Select
                  ref='xueli'
                  value={this.state.Education}
                  style={{ width: 88 }}
                  onChange={this.saveXueli}
                  disabled={this.state.disableInput}>
                  <Select.Option value={'1'}>小学</Select.Option>
                  <Select.Option value={'2'}>初中</Select.Option>
                  <Select.Option value={'3'}>高中</Select.Option>
                  <Select.Option value={'4'}>中专</Select.Option>
                  <Select.Option value={'5'}>大专</Select.Option>
                  <Select.Option value={'6'}>本科</Select.Option>
                  <Select.Option value={'7'}>本科以上</Select.Option>
                </Select>
              )
            }, {
              title: '婚否',
              dataIndex: 'Hunfou',
              render: (text, record) => (
                <Select
                  value={this.state.Married}
                  style={{ width: 60 }}
                  disabled={this.state.disableInput}
                  onChange={this.saveHunfou}>
                  <Select.Option value={'8'}>未婚</Select.Option>
                  <Select.Option value={'9'}>已婚</Select.Option>
                  <Select.Option value={'10'}>离异</Select.Option>
                </Select>

              )
            }, {
              title: '纹烟残案少',
              dataIndex: 'WYCAS',
              render: (text, record) => (
                <Select
                  value={this.state.Wycas}
                  mode="tags"
                  style={{ width: 170 }}
                  placeholder="可多选"
                  disabled={this.state.disableInput}
                  onChange={this.handleWYCAS}
                >
                  {/* <Select.Option value={'73'}>无纹烟残案/无</Select.Option>
                  <Select.Option value={'49'}>纹身/纹</Select.Option>
                  <Select.Option value={'51'}>烟疤/烟</Select.Option>
                  <Select.Option value={'53'}>残疾/残</Select.Option>
                  <Select.Option value={'55'}>案底/案</Select.Option>
                  <Select.Option value={'74'}>汉族/汉</Select.Option>
                  <Select.Option value={'59'}>回族/回</Select.Option>
                  <Select.Option value={'60'}>维族/维</Select.Option>
                  <Select.Option value={'57'}>彝族/彝</Select.Option>
                  <Select.Option value={'58'}>藏族/藏</Select.Option>
                  <Select.Option value={'61'}>其他少数民族/少</Select.Option> */}
                  <Select.Option value="49">有纹身</Select.Option>
                  <Select.Option value="50">无纹身</Select.Option>
                  <Select.Option value="51">有烟疤</Select.Option>
                  <Select.Option value="52">无烟疤</Select.Option>
                  <Select.Option value="53">有残疾</Select.Option>
                  <Select.Option value="54">无残疾</Select.Option>
                  <Select.Option value="55">有案底</Select.Option>
                  <Select.Option value="56">无案底</Select.Option>
                  <Select.Option value="57">彝族</Select.Option>
                  <Select.Option value="58">藏族</Select.Option>
                  <Select.Option value="59">回族</Select.Option>
                  <Select.Option value="60">维族</Select.Option>
                  <Select.Option value="61">非四大民族</Select.Option>
                  <Select.Option value="73">无</Select.Option>
                  <Select.Option value="74">汉族</Select.Option>
                </Select>
              )
            }, {
              title: '出道年',
              dataIndex: 'DGZY',
              render: (text, record) => (
                <Select
                  value={this.state.ExperienceYear}
                  style={{ width: '100%', minWidth: 65 }}
                  filterOption={this._filterOption}
                  showSearch={true}
                  onChange={this.handleDGZY}
                  disabled={this.state.disableInput}
                >
                  {
                    (this.state.fullyear || []).map((item, i) => {
                      return (
                        <Option key={i}
                          value={item.toString()}>{item}</Option>
                      );
                    })
                  }
                </Select>
              )
            }, {
              title: '倒计时(秒)',
              dataIndex: 'DJS',
              width: 100,
              render: (text, record) => <span style={{ color: 'red' }}>{this.state.leftTime}</span>
            }, {
              title: '操作',
              dataIndex: 'opration',
              width: 60,
              render: (text, record) => <Button className="ml-8" disabled={this.state.disableInput} onClick={() => this.submitExam(text, record)}>提交</Button>
            }

            ]}
            dataSource={this.state.examSource} loading={this.state.RecordListLoading}
          />
          <br />
          <Form style={{ display: (this.state.bShowNext ? '' : 'none') }}>
            <FormItem label="现在在哪" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
              <TextArea style={{ minHeight: 32 }}
                maxLength={256}
                placeholder="*例如：江苏昆山。"
                rows={4}
                value={this.state.Where}
                onChange={(e) => {
                  this.setState({ Where: e.target.value || '' });
                }} />
            </FormItem>
            <FormItem label="优点" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
              <TextArea style={{ minHeight: 32 }}
                maxLength={256}
                placeholder="*例如：老实、肯吃苦、能穿无尘服、稳定、能侃、听媳妇的话、会存钱、有房车贷、听话。"
                rows={4}
                value={this.state.Advantage}
                onChange={(e) => {
                  this.setState({ Advantage: e.target.value || '' });
                }} />
            </FormItem>
            <FormItem label="缺点" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
              <TextArea style={{ minHeight: 32 }}
                maxLength={256}
                placeholder="*例如：不老实、打零工、打架、喝酒、赌博、爱借钱、爱抱团、没脑子、老换女友、满嘴跑火车、放鸽子、老换厂、不稳定。"
                rows={4}
                value={this.state.Shortcomings}
                onChange={(e) => {
                  this.setState({ Shortcomings: e.target.value || '' });
                }} />
            </FormItem>
            <FormItem label="偏好" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
              <TextArea style={{ minHeight: 32 }}
                maxLength={256}
                placeholder="*例如：想赚多、需要租房、喜欢抱团、看重厂区环境、看重吃、看重住、希望妹子多。"
                rows={4}
                value={this.state.Expect}
                onChange={(e) => {
                  this.setState({ Expect: e.target.value || '' });
                }} />
            </FormItem>
            <Row>
              <Col className="mb-24" span={24} style={{ textAlign: 'right' }}>
                <Button className="ml-8" onClick={this.handleNext} style={{ display: (this.state.bJieshu ? 'none' : '') }}>下一题</Button>
                <Button className="ml-8" onClick={this.handleEnd} style={{ display: (this.state.bJieshu ? '' : 'none') }}>结束</Button>
              </Col>
            </Row>
          </Form>
        </span>
      </Modal >
    );
  }
};

export default LaborExamModal;