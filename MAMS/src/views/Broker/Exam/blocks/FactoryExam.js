import React, {Component} from 'react';
import {
  Row,
  Col,
  Card,
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
const {TextArea} = Input;
const FormItem = Form.Item;

let Timer;
let notifyTimer;
let timeout;

class FactoryExamModal extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      RecordListLoading: false,
      leftTime: 60,
      disableInput: false,
      disabledAnswer: false,
      bShowNext: false,
      InnerTestID: 0,
      Address: '',
      Industry: '',
      Profit: '',
      SalaryDate: '',
      SalaryHighLevel: '',
      SalaryLowLevel: '',
      Scale: '',
      Eat: '',
      examSource: [],
      bVisable: false
    };
  }
  componentDidMount() {
    setInterval(() => {
      if (this.state.leftTime < 1) {
        this.setState({
          disableInput: true,
          disabledAnswer: true
        });
      }
    }, 1000);

  }

  setNotifyTime = () => {
    if (this.state.leftNotifyTime > 0) {
      this.setState({leftNotifyTime: (this.state.leftNotifyTime - 1)});
    } else {
      clearInterval(notifyTimer);
      this.setState({bShowNotification: false});
      this.getExamDetail({BrokerID: BrokerID});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.bVisable && this.state.bVisable != nextProps.ModalVisible) {
      this.initData();
      this.setState({bShowNext: false, bShowNotification: true, bJieshu: false, leftNotifyTime: 5});
      clearInterval(notifyTimer);
      notifyTimer = setInterval(this.setNotifyTime, 1000);
      clearTimeout(timeout);
    }
    this.state.bVisable = nextProps.ModalVisible;
  }

  getExamDetail(params) {
    this.initData();
    this.setState({RecordListLoading: true});
    return HttpRequest.post({
      url: env.api_url + '/BK_Exam/BK_Ent_GetQuestion',
      params: params
    }, {
      successDo: (res) => {
        if (res.Code == 0) {
          let data = res.Data;
          let td = {
            CurrentTestID: data.CurrentTestID,
            EndFlag: data.EndFlag,
            EntID: data.EntID,
            EntName: data.EntName,
            InnerTestID: data.InnerTestID,
            TimeLeft: data.TimeLeft,
            opration: ''
          };
          this.setState({
            RecordListLoading: false,
            CurrentTestID: data.CurrentTestID,
            bJieshu: data.EndFlag,
            EntID: data.EntID,
            EntName: data.EntName,
            InnerTestID: data.InnerTestID,
            leftTime: data.TimeLeft,
            examSource: [td]
          });
        } else {
          this.setState({RecordListLoading: false});
        }
        this.initData();
        clearInterval(Timer);
        Timer = setInterval(this.handleTime, 1000);
        this.setState({ disableInput: false, disabledAnswer: false, bShowNext: false, RecordListLoading: false });
      },
      errorDo: (res) => {
        message.error(res.Desc);
        this.setState({RecordListLoading: false});
      }
    });
  }

  postExam(params) {
    // this.setState({ RecordListLoading: true, disabledAnswer: true});
    if (this.state.leftTime < 1) {
      clearInterval(Timer);
    }
    return HttpRequest.post({
      url: env.api_url + '/BK_Exam/BK_Ent_ReplyAnswer',
      params: params
    }, {
      successDo: (res) => {
        if (res && !this.state.bJieshu) {
          this.handleNext();
        }
      },
      errorDo: (res) => {
        this.setState({ RecordListLoading: false });
      }
    });
  }

  sendCloseModal(params) {
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

  saveIndustry = (obj) => {
    let value = obj;
    this.setState({Industry: value});
  }

  saveProfit = (obj) => {
    let value = obj;
    this.setState({Profit: value});
  }

  saveSalaryDate = (obj) => {
    let value = obj;
    this.setState({SalaryDate: value});
  }

  saveScale = (obj) => {
    let value = obj;
    this.setState({Scale: value});
  }

  saveEat = (obj) => {
    let value = obj;
    this.setState({Eat: value});
  }

  saveLive = (obj) => {
    let value = obj;
    this.setState({Live: value});
  }

  saveWork = (obj) => {
    let value = obj;
    this.setState({Work: value});
  }

  saveStand = (obj) => {
    let value = obj;
    this.setState({Stand: value});
  }

  saveGirls = (obj) => {
    let value = obj;
    this.setState({Girls: value});
  }

  saveCleanClothes = (obj) => {
    let value = obj;
    this.setState({CleanClothes: value});
  }

  saveSalaryHighLevel = (obj) => {
    let value = obj;
    this.setState({SalaryHighLevel: value});
  }

  saveSalaryLowLevel = (obj) => {
    let value = obj;
    this.setState({SalaryLowLevel: value});
  }

  saveManagement = (obj) => {
    let value = obj;
    this.setState({Management: value});
  }

  saveAround = (obj) => {
    let value = obj;
    this.setState({Around: value});
  }

  handleTime = () => {
    if (this.state.leftTime > 0) {
      this.setState({leftTime: this.state.leftTime - 1});
    }
  }

  submitExam = () => {
    let params = {
      BrokerID: Number.parseInt(this.state.BrokerID, 10),
      EntID: Number.parseInt(this.state.EntID, 10),
      EntName: this.state.EntName,
      InnerTestID: Number.parseInt(this.state.InnerTestID, 10)
    };
    if (this.state.Address) params.Address = this.state.Address;
    if (this.state.Around) params.Around = Number.parseInt(this.state.Around, 10);
    if (this.state.CleanClothes) params.CleanClothes = Number.parseInt(this.state.CleanClothes, 10);
    if (this.state.Eat) params.Eat = Number.parseInt(this.state.Eat, 10);
    if (this.state.Girls) params.Girls = Number.parseInt(this.state.Girls, 10);
    if (this.state.Industry) params.Industry = this.state.Industry;
    if (this.state.Live) params.Live = Number.parseInt(this.state.Live, 10);
    if (this.state.Management) params.Management = Number.parseInt(this.state.Management, 10);
    if (this.state.SalaryDate) params.SalaryDate = Number.parseInt(this.state.SalaryDate, 10);
    if (this.state.SalaryHighLevel) params.SalaryHighLevel = Number.parseInt(this.state.SalaryHighLevel, 10);
    if (this.state.SalaryLowLevel) params.SalaryLowLevel = Number.parseInt(this.state.SalaryLowLevel, 10);
    if (this.state.Scale) params.Scale = Number.parseInt(this.state.Scale, 10);
    if (this.state.Stand) params.Stand = Number.parseInt(this.state.Stand, 10);
    if (this.state.Work) params.Work = Number.parseInt(this.state.Work, 10);
    this.postExam(params);
  }

  initData() {
    this.setState({
      Address: '',
      Around: '',
      CleanClothes: '',
      Eat: '',
      Girls: '',
      Industry: '',
      Live: '',
      Management: '',
      SalaryDate: '',
      SalaryHighLevel: '',
      SalaryLowLevel: '',
      Scale: '',
      Stand: '',
      Work: ''
    });
  }

  handleNext = (e) => {
    this.getExamDetail({BrokerID: BrokerID});
  }

  handleEnd = (e) => {
    this.submitExam();
    this.props.hideModal();
    message.success('请继续加油，希望你的成绩更上一层楼^_^。');
  }

  closeModal() {
    if (this.props.bPopup) {
      this.sendCloseModal({BrokerID: BrokerID, CurrExamType: 2});
    }
    this.props.hideModal();
    clearInterval(Timer);
  }

  render() {
    return (
        <Modal
            title="企业基本信息考试"
            visible={this.props.ModalVisible}
            footer={null}
            maskClosable={false}
            width='100%'
            height='100%'
            onCancel={() => this.closeModal()}
        >
          <Alert
              style={{display: (this.state.bShowNotification ? '' : 'none')}}
              message="考试须知："
              description={<span>考试即将开始，请注意关闭手机及其他通讯设备。(<span style={{color: 'red'}}>{this.state.leftNotifyTime}</span>秒)</span>}
              type="warning"
              showIcon/>
          <span style={{display: (this.state.bShowNotification ? 'none' : '')}}>
					<Table
              rowKey={(record, index) => index}
              bordered={true}
              pagination={false}
              columns={[
                {
                  title: '题号',
                  dataIndex: 'CurrentTestID',
                  width: 50
                },
                {
                  title: '企业名称',
                  dataIndex: 'EntName'
                },
                {
                  title: '行业',
                  dataIndex: 'Industry',
                  width: '15%',
                  render: (text, record) => (
                      <Input
                          disabled={this.state.disableInput}
                          value={this.state.Industry}
                          maxLength="16"
                          onChange={(e) => {
                            this.setState({Industry: e.target.value || ''});
                          }}/>
                  )
                },
                {
                  title: '区域',
                  dataIndex: 'Address',
                  width: '15%',
                  render: (text, record) => (
                      <span>
										<Input disabled={this.state.disableInput}
                           value={this.state.Address}
                           maxLength="64"
                           onChange={(e) => {
                             this.setState({Address: e.target.value || ''});
                           }}/>
									</span>
                  )
                },
                {
                  title: '规模',
                  dataIndex: 'Scale',
                  width: '15%',
                  render: (text, record) => (
                      <Select
                          value={this.state.Scale}
                          onChange={this.saveScale}
                          style={{width: '100%'}}
                          disabled={this.state.disableInput}>
                        <Select.Option value={'62'}>3000人以下</Select.Option>
                        <Select.Option value={'63'}>5000人左右</Select.Option>
                        <Select.Option value={'64'}>8000～10000+</Select.Option>
                        <Select.Option value={'65'}>20000左右</Select.Option>
                        <Select.Option value={'66'}>30000左右</Select.Option>
                        <Select.Option value={'67'}>40000以上</Select.Option>
                      </Select>
                  )
                },
                {
                  title: '发薪日',
                  dataIndex: 'SalaryDate',
                  width: 150,
                  render: (text, record) => (
                      <span>
                        <InputNumber
                            disabled={this.state.disableInput}
                            value={this.state.SalaryDate}
                            min={1}
                            max={31}
                            style={{width: '80%'}}
                            onChange={this.saveSalaryDate}/>
                            日
                        </span>
                  )
                },
                {
                  title: '倒计时',
                  dataIndex: 'DJS',
                  width: 70,
                  render: (text, record) => <span style={{color: 'red'}}>{this.state.leftTime}</span>
                }
              ]}
              dataSource={this.state.examSource} loading={this.state.RecordListLoading}
          />
					<Table
              style={{marginTop: 20}}
              rowKey={(record, index) => index}
              bordered={true}
              pagination={false}
              columns={[
                {
                  title: '吃',
                  dataIndex: 'Eat',
                  width: '10%',
                  render: (text, record) => (
                      <Select
                          value={this.state.Eat}
                          style={{width: '100%'}}
                          disabled={this.state.disabledAnswer}
                          onChange={this.saveEat}>
                        <Select.Option value={'80'}>好</Select.Option>
                        <Select.Option value={'81'}>一般</Select.Option>
                      </Select>

                  )
                },
                {
                  title: '住',
                  dataIndex: 'Live',
                  width: '10%',
                  render: (text, record) => (
                      <Select
                          value={this.state.Live}
                          style={{width: '100%'}}
                          disabled={this.state.disabledAnswer}
                          onChange={this.saveLive}>
                        <Select.Option value={'85'}>好</Select.Option>
                        <Select.Option value={'86'}>一般</Select.Option>
                      </Select>
                  )
                },
                {
                  title: '活',
                  dataIndex: 'Work',
                  width: '10%',
                  render: (text, record) => (
                      <Select
                          value={this.state.Work}
                          style={{width: '100%'}}
                          disabled={this.state.disabledAnswer}
                          onChange={this.saveWork}>
                        <Select.Option value={'90'}>很累</Select.Option>
                        <Select.Option value={'91'}>偏累</Select.Option>
                        <Select.Option value={'92'}>一般</Select.Option>
                        <Select.Option value={'93'}>轻松</Select.Option>
                      </Select>

                  )
                },
                {
                  title: '站/坐',
                  dataIndex: 'Stand',
                  width: '10%',
                  render: (text, record) => (
                      <Select
                          value={this.state.Stand}
                          style={{width: '100%'}}
                          disabled={this.state.disabledAnswer}
                          onChange={this.saveStand}>
                        <Select.Option value={'95'}>全站</Select.Option>
                        <Select.Option value={'96'}>站多坐少</Select.Option>
                        <Select.Option value={'97'}>坐多站少</Select.Option>
                        <Select.Option value={'98'}>全坐</Select.Option>
                      </Select>

                  )
                },
                {
                  title: '妹子',
                  dataIndex: 'Girls',
                  width: '10%',
                  render: (text, record) => (
                      <Select
                          value={this.state.Girls}
                          style={{width: '100%'}}
                          disabled={this.state.disabledAnswer}
                          onChange={this.saveGirls}>
                        <Select.Option value={'100'}>多</Select.Option>
                        <Select.Option value={'101'}>少</Select.Option>
                      </Select>

                  )
                },
                {
                  title: '无尘服',
                  dataIndex: 'CleanClothes',
                  width: '10%',
                  render: (text, record) => (
                      <Select
                          value={this.state.CleanClothes}
                          style={{width: '100%'}}
                          disabled={this.state.disabledAnswer}
                          onChange={this.saveCleanClothes}>
                        <Select.Option value={'105'}>必须穿</Select.Option>
                        <Select.Option value={'106'}>部分穿</Select.Option>
                        <Select.Option value={'23'}>不穿</Select.Option>
                      </Select>

                  )
                },
                {
                  title: '工资',
                  dataIndex: 'Salary',
                  render: (text, record) => (
                      <div style={{width: '100%'}}>
                        <InputNumber
                            disabled={this.state.disabledAnswer}
                            value={this.state.SalaryHighLevel}
                            style={{width: '42%', marginRight: 10}}
                            min={0}
                            onChange={this.saveSalaryHighLevel}/>
                        ~
                        <InputNumber
                            disabled={this.state.disabledAnswer}
                            value={this.state.SalaryLowLevel}
                            style={{width: '42%', marginLeft: 10}}
                            min={0}
                            onChange={this.saveSalaryLowLevel}/>
                      </div>
                  )
                },
                {
                  title: '管理',
                  dataIndex: 'Management',
                  width: '10%',
                  render: (text, record) => (
                      <Select
                          value={this.state.Management}
                          style={{width: '100%'}}
                          disabled={this.state.disabledAnswer}
                          onChange={this.saveManagement}>
                        <Select.Option value={'110'}>严</Select.Option>
                        <Select.Option value={'111'}>偏严</Select.Option>
                        <Select.Option value={'112'}>偏松</Select.Option>
                        <Select.Option value={'113'}>松</Select.Option>
                      </Select>

                  )
                },
                {
                  title: '周边',
                  dataIndex: 'Around',
                  width: '10%',
                  render: (text, record) => (
                      <Select
                          value={this.state.Around}
                          style={{width: '100%'}}
                          disabled={this.state.disabledAnswer}
                          onChange={this.saveAround}>
                        <Select.Option value={'115'}>热闹</Select.Option>
                        <Select.Option value={'116'}>偏僻</Select.Option>
                      </Select>

                  )
                }
              ]}
              dataSource={this.state.examSource} loading={this.state.RecordListLoading}
          />
					<Row style={{marginTop: '20px'}}>
						<Col className="mb-24" span={24} style={{textAlign: 'right'}}>
							<Button className="ml-8" onClick={this.submitExam}
                      style={{display: (!this.state.bJieshu ? '' : 'none')}}
              >提交</Button>
							<Button className="ml-8" onClick={this.handleEnd}
                      style={{display: (this.state.bJieshu ? '' : 'none'), marginTop: '20'}}>
                结束</Button>
						</Col>
					</Row>
				</span>
        </Modal>
    );
  }
};

export default FactoryExamModal;