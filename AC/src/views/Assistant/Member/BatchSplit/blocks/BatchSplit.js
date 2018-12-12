import React from 'react';
import moment from 'moment';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

import setParams from 'ACTION/setParams';
// import BelongingSplitAction from 'ACTION/Assistant/BelongingSplitAction';

import BelongingSplitService from 'SERVICE/Assistant/BelongingSplitService';

// const {
//   getCertMember
// } = BelongingSplitAction;

const {
  SplitAccount,
  getCertMember,
  getBrokerNicknameByAccount
} = BelongingSplitService;

const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  message,
  DatePicker,
  Icon
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;

const STATE_NAME = 'state_ac_belonging_split';

class BatchSplit extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      splitButtonLoading: false,
      interviewEndOpen: false,
      registerEndOpen: false
    };
  }

  componentWillMount() {
  }

  handleSplit = () => {
    console.log(this.props.batchSplitInfo);
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        const {
          BeSplitBrokerAccount,
          InterviewStartDate,
          InterviewEndDate,
          RegisterStartDate,
          RegisterEndDate,
          SplitBrokerAccountBody
        } = values;

        if ((!InterviewStartDate && InterviewEndDate) || (InterviewStartDate && !InterviewEndDate)) {
          message.error('请选择完整的面试起止日期');
          return;
        }

        if ((!RegisterStartDate && RegisterEndDate) || (RegisterStartDate && !RegisterEndDate)) {
          message.error('请选择完整的注册起止日期');
          return;
        }

        const bothZeroCountItems = SplitBrokerAccountBody.filter(item => +item.certMemberCount === 0 && +item.unCertMemberCount === 0);
        if (bothZeroCountItems.length) {
          message.error(`分配工号${bothZeroCountItems[0].account}的已认证和未认证拆分会员数不能同时为0`);
          return;
        }

        const {
          batchSplitInfo: {
            CertMemberInfo: {
              CertUserNums,
              UnCertUserNums
            }
          }
        } = this.props;

        if (CertUserNums === 0 && UnCertUserNums === 0) {
          message.error('该账号无会员可分配');
          return;
        }

        this.setState({
          splitButtonLoading: true
        });
        
        const postData = {
          OperatorID: employeeId,
          SrcBrokerAccount: BeSplitBrokerAccount,
          Dstination: SplitBrokerAccountBody.map(item => {
            return {
              BrokerAccount: item.account,
              CertCount: +item.certMemberCount,
              UnCertCount: +item.unCertMemberCount
            };
          })
        };

        if (InterviewStartDate && InterviewEndDate) {
          postData.NotInInterviewTimeBegin = InterviewStartDate.format('YYYY-MM-DD');
          postData.NotInInterviewTimeEnd = InterviewEndDate.format('YYYY-MM-DD');
        }

        if (RegisterStartDate && RegisterEndDate) {
          postData.NotInRegisterTimeBegin = RegisterStartDate.format('YYYY-MM-DD');
          postData.NotInRegisterTimeEnd = RegisterEndDate.format('YYYY-MM-DD');
        }

        SplitAccount(postData).then((res) => {
          this.setState({
            splitButtonLoading: false
          });
          if (res.Code === 0) {
            message.success('拆分账号成功！');
            setParams(STATE_NAME, {
              BatchSplitParams: {
                BeSplitBrokerAccount: '',
                CertMemberCount: '',
                UnCertMemberCount: '',
                SplitBrokerAccountBody: [{
                  account: ''
                }]
              },
              CertMemberInfo: {
                CertUserNums: 0,
                UnCertUserNums: 0
              }
            });
            this.props.form.setFieldsValue({
              BeSplitBrokerAccount: '',
              CertMemberCount: '',
              UnCertMemberCount: '',
              SplitBrokerAccountBody: [{
                account: '',
                certMemberCount: '0',
                unCertMemberCount: '0'
              }]
            });
          } else {
            message.error(res.Data.Desc || '操作失败，请稍后重试');
          }
        }).catch((err) => {
          this.setState({
            splitButtonLoading: false
          });
          message.error(err.Desc || '操作失败，请稍后重试');
        });
      }
    });

  }

  handleInputChange = (e, key) => {
    setParams(STATE_NAME, {
      BatchSplitParams: {
        ...this.props.batchSplitInfo.BatchSplitParams,
        [key]: `${e.target.value}`
      }
    });
  }

  handleArrayInputChange = (e, index, type) => {
    const SplitBrokerAccountBody = [...this.props.batchSplitInfo.BatchSplitParams.SplitBrokerAccountBody];

    setParams(STATE_NAME, {
      BatchSplitParams: {
        ...this.props.batchSplitInfo.BatchSplitParams,
        SplitBrokerAccountBody: SplitBrokerAccountBody.map((item, i) => {
          return {
            ...item,
            [type]: i === index ? e.target.value : item[type]
          };
        })
      }
    });
  }

  handleRemoveInput = (index) => {
    const SplitBrokerAccountBody = [...this.props.batchSplitInfo.BatchSplitParams.SplitBrokerAccountBody];
    SplitBrokerAccountBody.splice(index, 1);

    setParams(STATE_NAME, {
      BatchSplitParams: {
        ...this.props.batchSplitInfo.BatchSplitParams,
        SplitBrokerAccountBody: [...SplitBrokerAccountBody]
      }
    });

    this.props.form.setFieldsValue({
      SplitBrokerAccountBody: [...SplitBrokerAccountBody]
    });
  }

  handleAddInput = () => {
    setParams(STATE_NAME, {
      BatchSplitParams: {
        ...this.props.batchSplitInfo.BatchSplitParams,
        SplitBrokerAccountBody: this.props.batchSplitInfo.BatchSplitParams.SplitBrokerAccountBody.concat([{
          account: '',
          nickName: '',
          certMemberCount: '0',
          unCertMemberCount: '0'
        }])
      }
    });
  }

  disabledStartDate = (current, field) => {
    const endValue = this.props.batchSplitInfo.BatchSplitParams[field];
    if (!current) {
      return false;
    } else {
      if (!endValue) {
        return current && current.valueOf() > Date.now();
      } else {
        return current.valueOf() > endValue.valueOf() || current.valueOf() > Date.now();
      }
    }
  }

  disabledEndDate = (current, field) => {
    const startValue = this.props.batchSplitInfo.BatchSplitParams[field];
    if (!current) {
      return false;
    } else {
      if (!startValue) {
        return current && current.valueOf() > Date.now();
      } else {
        return current.valueOf() <= startValue.valueOf() || current.valueOf() > Date.now();
      }
    }
  }

  onDateChange = (field, value) => {
    setParams(STATE_NAME, {
      BatchSplitParams: {
        ...this.props.batchSplitInfo.BatchSplitParams,
        [field]: value
      }
    });
  }

  handleOnInterviewStartChange = (value) => {
    this.onDateChange('InterviewStartDate', value);
    const {
      form: {
        getFieldError
      },
      batchSplitInfo: {
        BatchSplitParams: {
          InterviewEndDate,
          RegisterStartDate,
          RegisterEndDate,
          BeSplitBrokerAccount
        }
      }
    } = this.props;

    if (BeSplitBrokerAccount && !getFieldError('BeSplitBrokerAccount')) {
      const postData = {
        BrokerAccount: BeSplitBrokerAccount
      };

      if (value && InterviewEndDate) {
        postData.NotInInterviewTimeBegin = value.format('YYYY-MM-DD');
        postData.NotInInterviewTimeEnd = InterviewEndDate.format('YYYY-MM-DD');
      }

      if (RegisterStartDate && RegisterEndDate) {
        postData.NotInRegisterTimeBegin = RegisterStartDate.format('YYYY-MM-DD');
        postData.NotInRegisterTimeEnd = RegisterEndDate.format('YYYY-MM-DD');
      }

      getCertMember(postData).then((res) => {
        if (res.Code === 0) {
          setParams(STATE_NAME, {
            CertMemberInfo: {
              CertUserNums: (res.Data || {}).CertUserNums || 0,
              UnCertUserNums: (res.Data || {}).UnCertUserNums || 0
            }
          });
        } else {
          message.error(res.Desc || '出错了，请稍后重试');
        }
      }, (error) => {
        message.error(error.Desc || '出错了，请稍后重试');
      });
    }
    
  }

  handleOnInterviewEndChange = (value) => {
    this.onDateChange('InterviewEndDate', value);

    const {
      form: {
        getFieldError
      },
      batchSplitInfo: {
        BatchSplitParams: {
          InterviewStartDate,
          RegisterStartDate,
          RegisterEndDate,
          BeSplitBrokerAccount
        }
      }
    } = this.props;

    if (BeSplitBrokerAccount && !getFieldError('BeSplitBrokerAccount')) {
      const postData = {
        BrokerAccount: BeSplitBrokerAccount
      };

      if (value && InterviewStartDate) {
        postData.NotInInterviewTimeBegin = InterviewStartDate.format('YYYY-MM-DD');
        postData.NotInInterviewTimeEnd = value.format('YYYY-MM-DD');
      }

      if (RegisterStartDate && RegisterEndDate) {
        postData.NotInRegisterTimeBegin = RegisterStartDate.format('YYYY-MM-DD');
        postData.NotInRegisterTimeEnd = RegisterEndDate.format('YYYY-MM-DD');
      }

      getCertMember(postData).then((res) => {
        if (res.Code === 0) {
          setParams(STATE_NAME, {
            CertMemberInfo: {
              CertUserNums: (res.Data || {}).CertUserNums || 0,
              UnCertUserNums: (res.Data || {}).UnCertUserNums || 0
            }
          });
        } else {
          message.error(res.Desc || '出错了，请稍后重试');
        }
      }, (error) => {
        message.error(error.Desc || '出错了，请稍后重试');
      });
    }
    
  }

  handleOnRegisterStartChange = (value) => {
    this.onDateChange('RegisterStartDate', value);

    const {
      form: {
        getFieldError
      },
      batchSplitInfo: {
        BatchSplitParams: {
          InterviewStartDate,
          InterviewEndDate,
          RegisterEndDate,
          BeSplitBrokerAccount
        }
      }
    } = this.props;

    if (BeSplitBrokerAccount && !getFieldError('BeSplitBrokerAccount')) {
      const postData = {
        BrokerAccount: BeSplitBrokerAccount
      };

      if (InterviewStartDate && InterviewEndDate) {
        postData.NotInInterviewTimeBegin = InterviewStartDate.format('YYYY-MM-DD');
        postData.NotInInterviewTimeEnd = InterviewEndDate.format('YYYY-MM-DD');
      }

      if (value && RegisterEndDate) {
        postData.NotInRegisterTimeBegin = value.format('YYYY-MM-DD');
        postData.NotInRegisterTimeEnd = RegisterEndDate.format('YYYY-MM-DD');
      }

      getCertMember(postData).then((res) => {
        if (res.Code === 0) {
          setParams(STATE_NAME, {
            CertMemberInfo: {
              CertUserNums: (res.Data || {}).CertUserNums || 0,
              UnCertUserNums: (res.Data || {}).UnCertUserNums || 0
            }
          });
        } else {
          message.error(res.Desc || '出错了，请稍后重试');
        }
      }, (error) => {
        message.error(error.Desc || '出错了，请稍后重试');
      });
    }
  }

  handleOnRegisterEndChange = (value) => {
    this.onDateChange('RegisterEndDate', value);

    const {
      form: {
        getFieldError
      },
      batchSplitInfo: {
        BatchSplitParams: {
          InterviewStartDate,
          InterviewEndDate,
          RegisterStartDate,
          BeSplitBrokerAccount
        }
      }
    } = this.props;

    if (BeSplitBrokerAccount && !getFieldError('BeSplitBrokerAccount')) {
      const postData = {
        BrokerAccount: BeSplitBrokerAccount
      };

      if (InterviewStartDate && InterviewEndDate) {
        postData.NotInInterviewTimeBegin = InterviewStartDate.format('YYYY-MM-DD');
        postData.NotInInterviewTimeEnd = InterviewEndDate.format('YYYY-MM-DD');
      }

      if (value && RegisterStartDate) {
        postData.NotInRegisterTimeBegin = RegisterStartDate.format('YYYY-MM-DD');
        postData.NotInRegisterTimeEnd = value.format('YYYY-MM-DD');
      }

      getCertMember(postData).then((res) => {
        if (res.Code === 0) {
          setParams(STATE_NAME, {
            CertMemberInfo: {
              CertUserNums: (res.Data || {}).CertUserNums || 0,
              UnCertUserNums: (res.Data || {}).UnCertUserNums || 0
            }
          });
        } else {
          message.error(res.Desc || '出错了，请稍后重试');
        }
      }, (error) => {
        message.error(error.Desc || '出错了，请稍后重试');
      });
    }
  }

  handleInterviewStartOpenChange = (open) => {
    if (!open) {
      this.setState({ interviewEndOpen: true });
    }
  }

  handleInterviewEndOpenChange = (open) => {
    this.setState({ interviewEndOpen: open });
  }

  handleRegisterStartOpenChange = (open) => {
    if (!open) {
      this.setState({ registerEndOpen: true });
    }
  }

  handleRegisterEndOpenChange = (open) => {
    this.setState({ registerEndOpen: open });
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue
      },
      batchSplitInfo: {
        CertMemberInfo: {
          CertUserNums,
          UnCertUserNums
        },
        BatchSplitParams
      }
    } = this.props;

    const {
      splitButtonLoading,
      interviewEndOpen,
      registerEndOpen
    } = this.state;

    getFieldDecorator('SplitBrokerAccountBody', { initialValue: BatchSplitParams.SplitBrokerAccountBody });

    return (
      <div>
        <div className="ivy-page-title">
          <h1>会员归属批量拆分</h1>
        </div>
        <Row>
          <Col span={24} style={{
            padding: "24px"
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "24px"
            }}>
              <Row style={{maxWidth: 1015}}>
                <Col span={24}>
                  <div>
                    <Form>
                      <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 8 }} label="被拆分工号">
                        <div className="flex flex--y-center">
                          {getFieldDecorator('BeSplitBrokerAccount', {
                            initialValue: BatchSplitParams.BeSplitBrokerAccount,
                            rules: [
                              {
                                required: true,
                                validator: (rule, value, cb) => {
                                  if (value.trim() !== '') {
                                    getBrokerNicknameByAccount({
                                      BrokerAccount: value
                                    }).then((res) => {
                                      if (res.Code === 0) {
                                        const nickName = (res.Data || {}).NickName || '';
                                        const interviewSDate = getFieldValue('InterviewStartDate') || '';
                                        const interviewEDate = getFieldValue('InterviewEndDate') || '';
                                        const registerSDate = getFieldValue('RegisterStartDate') || '';
                                        const registerEDate = getFieldValue('RegisterEndDate') || '';

                                        const postData = {
                                          BrokerAccount: value
                                        };

                                        if (interviewSDate && interviewEDate) {
                                          postData.NotInInterviewTimeBegin = interviewSDate.format('YYYY-MM-DD');
                                          postData.NotInInterviewTimeEnd = interviewEDate.format('YYYY-MM-DD');
                                        }

                                        if (registerSDate && registerEDate) {
                                          postData.NotInRegisterTimeBegin = registerSDate.format('YYYY-MM-DD');
                                          postData.NotInRegisterTimeEnd = registerEDate.format('YYYY-MM-DD');
                                        }
                                        
                                        getCertMember(postData).then((resp) => {
                                          if (resp.Code === 0) {
                                            cb();
                                            setParams(STATE_NAME, {
                                              BatchSplitParams: {
                                                ...BatchSplitParams,
                                                BeSplitBrokerAccount: value,
                                                BeSplitBrokerNickname: nickName
                                              },
                                              CertMemberInfo: {
                                                CertUserNums: (resp.Data || {}).CertUserNums || 0,
                                                UnCertUserNums: (resp.Data || {}).UnCertUserNums || 0
                                              }
                                            });
                                          } else {
                                            cb(resp.Desc);
                                          }
                                        }, (error) => {
                                          cb(error.Desc);
                                        });

                                      } else {
                                        cb(res.Desc);
                                      }
                                    }, (err) => {
                                      cb(err.Desc);
                                    });
                                  } else {
                                    cb('被拆分工号不能为空');
                                  }
                                }
                              }
                            ]
                          })(
                            <Input
                              type="text"
                              minLength="4"
                              maxLength="6"
                              autoComplete="off"
                              onChange={(e) => this.handleInputChange(e, 'BeSplitBrokerAccount')}
                            />
                          )}
                          <span className="ml-10" style={{flexShrink: 0}}>{BatchSplitParams.BeSplitBrokerNickname}</span>
                        </div>
                        
                      </FormItem>

                      <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 14 }} label="不拆分范围">
                        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="面试日期" className="form-item__zeromb">
                          <div className="flex flex--y-center">
                            <FormItem>
                              {getFieldDecorator('InterviewStartDate', {
                                initialValue: BatchSplitParams.InterviewStartDate
                              })(
                                <DatePicker
                                  onChange={this.handleOnInterviewStartChange}
                                  onOpenChange={this.handleInterviewStartOpenChange}
                                  disabledDate={(current) => {
                                    return this.disabledStartDate(current, 'InterviewEndDate');
                                  }}
                                  placeholder="开始日期"
                                />
                              )}
                            </FormItem>
                            <FormItem style={{marginLeft: 8}}>
                              {getFieldDecorator('InterviewEndDate', {
                                initialValue: BatchSplitParams.InterviewEndDate
                              })(
                                <DatePicker
                                  onChange={this.handleOnInterviewEndChange}
                                  onOpenChange={this.handleInterviewEndOpenChange}
                                  open={interviewEndOpen}
                                  disabledDate={(current) => {
                                    return this.disabledEndDate(current, 'InterviewStartDate');
                                  }}
                                  placeholder="结束日期"
                                />
                              )}
                            </FormItem>
                          </div>
                        </FormItem>

                        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="注册日期" className="form-item__zeromb">
                          <div className="flex flex--y-center">
                            <FormItem>
                              {getFieldDecorator('RegisterStartDate', {
                                initialValue: BatchSplitParams.RegisterStartDate
                              })(
                                <DatePicker
                                  onChange={this.handleOnRegisterStartChange}
                                  onOpenChange={this.handleRegisterStartOpenChange}
                                  disabledDate={(current) => {
                                    return this.disabledStartDate(current, 'RegisterEndDate');
                                  }}
                                  placeholder="开始日期"
                                />
                              )}
                            </FormItem>
                            <FormItem style={{marginLeft: 8}}>
                              {getFieldDecorator('RegisterEndDate', {
                                initialValue: BatchSplitParams.RegisterEndDate
                              })(
                                <DatePicker
                                  onChange={this.handleOnRegisterEndChange}
                                  onOpenChange={this.handleRegisterEndOpenChange}
                                  open={registerEndOpen}
                                  disabledDate={(current) => {
                                    return this.disabledEndDate(current, 'RegisterStartDate');
                                  }}
                                  placeholder="结束日期"
                                />
                              )}
                            </FormItem>
                          </div>
                        </FormItem>
                      </FormItem>

                      <FormItem labelCol={{ span: 2 }} wrapperCol={{ span: 14 }} label="会员数">
                        <div className="flex flex--around">
                          <span style={{fontWeight: '600'}}>{(+CertUserNums) + (+UnCertUserNums)}</span>
                          <span>=</span>
                          <span style={{ width: 200 }}>
                            <FormItem labelCol={{ span: 14 }} wrapperCol={{ span: 10 }} label="已认证会员数">
                              <div style={{fontWeight: '600'}}>{CertUserNums}</div>
                            </FormItem>
                          </span>
                          <span>+</span>
                          <span style={{ width: 200 }}>
                            <FormItem labelCol={{ span: 14 }} wrapperCol={{ span: 10 }} label="未认证会员数">
                              <div style={{fontWeight: '600'}}>{UnCertUserNums}</div>
                            </FormItem>
                          </span>
                        </div>
                      </FormItem>

                      {BatchSplitParams.SplitBrokerAccountBody.map((item, index) => (
                        <div key={index}>
                          <Row>
                            <Col span={5}>
                              <FormItem labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="分配工号">
                                <div className="flex flex--y-center">
                                  {getFieldDecorator(`SplitBrokerAccountBody[${index}].account`, {
                                    initialValue: item.account,
                                    rules: [
                                      {
                                        required: true,
                                        validator: (rule, value, cb) => {
                                          if (value.trim() !== '') {
                                            getBrokerNicknameByAccount({
                                              BrokerAccount: value
                                            }).then((res) => {
                                              if (res.Code === 0) {
                                                cb();

                                                const nickName = (res.Data || {}).NickName || '';
                                                const splitbrokeraccountbody = [...this.props.batchSplitInfo.BatchSplitParams.SplitBrokerAccountBody];
                                                setParams(STATE_NAME, {
                                                  BatchSplitParams: {
                                                    ...this.props.batchSplitInfo.BatchSplitParams,
                                                    SplitBrokerAccountBody: splitbrokeraccountbody.map((item, i) => {
                                                      return {
                                                        ...item,
                                                        nickName: i === index ? nickName : item.nickName
                                                      };
                                                    })
                                                  }
                                                });

                                              } else {
                                                cb(res.Desc);
                                              }
                                            }, (err) => {
                                              cb(err.Desc);
                                            });
                                          } else {
                                            cb('被分配工号不能为空');
                                          }
                                        }
                                      }
                                    ]
                                  })(
                                    <Input autoComplete="off" style={{ width: 80 }} onChange={(e) => this.handleArrayInputChange(e, index, 'account')} />
                                  )}
                                  <span className="ml-10" style={{flexShrink: 0}}>{item.nickName}</span>
                                </div>
                              </FormItem>
                            </Col>
                            <Col span={5} style={{marginLeft: 12}}>
                              <FormItem labelCol={{ span: 13 }} wrapperCol={{ span: 10 }} label="拆分已认证会员数" colon={false}>
                                {getFieldDecorator(`SplitBrokerAccountBody[${index}].certMemberCount`, {
                                  initialValue: item.certMemberCount,
                                  rules: [
                                    {
                                      validator: (rule, value, cb) => {
                                        const {
                                          batchSplitInfo: {
                                            CertMemberInfo: {
                                              CertUserNums
                                            }
                                          }
                                        } = this.props;

                                        const splitAccountBody = getFieldValue('SplitBrokerAccountBody') || [];

                                        if (splitAccountBody.reduce((initValue, cur) => initValue + (+cur.certMemberCount), 0) > CertUserNums) {
                                          cb('拆分已认证会员总数不能大于已认证的会员数');
                                        }
    
                                        if (+value < 0) {
                                          cb('拆分已认证会员数不能为负数');
                                        }

                                        if (value == '') {
                                          cb('会员数不能为空');
                                        }

                                        cb();
                                      }
                                    }
                                  ]
                                })(
                                  <Input type="number" autoComplete="off" style={{ width: 80 }} onChange={(e) => this.handleArrayInputChange(e, index, 'certMemberCount')} />
                                )}
                              </FormItem>
                            </Col>
                            <Col span={5} style={{marginLeft: 68}}>
                              <FormItem labelCol={{ span: 13 }} wrapperCol={{ span: 10 }} label="拆分未认证会员数" colon={false}>
                                {getFieldDecorator(`SplitBrokerAccountBody[${index}].unCertMemberCount`, {
                                  initialValue: item.unCertMemberCount,
                                  rules: [
                                    {
                                      validator: (rule, value, cb) => {
                                        const {
                                          batchSplitInfo: {
                                            CertMemberInfo: {
                                              UnCertUserNums
                                            }
                                          }
                                        } = this.props;
                                  
                                        const splitAccountBody = getFieldValue('SplitBrokerAccountBody') || [];

                                        if (splitAccountBody.reduce((initValue, cur) => initValue + (+cur.unCertMemberCount), 0) > UnCertUserNums) {
                                          cb('拆分未认证会员总数不能大于未认证的会员数');
                                        }
    
                                        if (+value < 0) {
                                          cb('拆分未认证会员数不能为负数');
                                        }

                                        if (value == '') {
                                          cb('会员数不能为空');
                                        }

                                        cb();
                                      }
                                    }
                                  ]
                                })(
                                  <Input type="number" autoComplete="off" onChange={(e) => this.handleArrayInputChange(e, index, 'unCertMemberCount')} />
                                )}
                              </FormItem>
                            </Col>
                            <Col span={2} style={{paddingTop: 5}}>
                              {(BatchSplitParams.SplitBrokerAccountBody.length > 1) && (
                                <Icon
                                  type="minus-circle-o"
                                  className="ml-10"
                                  style={{ color: '#f04134', fontSize: '18px', cursor: 'pointer' }}
                                  onClick={() => this.handleRemoveInput(index)}
                                />
                              )}
                              {(index === BatchSplitParams.SplitBrokerAccountBody.length - 1) && (
                                <Icon
                                  type="plus"
                                  className="ml-10"
                                  style={{ color: '#0e77ca', fontSize: '18px', cursor: 'pointer' }}
                                  onClick={this.handleAddInput}
                                />
                              )}
                            </Col>
                          </Row>
                        </div>
                      ))}

                      <FormItem>
                        <div>
                          <Button type="primary" onClick={this.handleSplit} disabled={splitButtonLoading}>{splitButtonLoading ? '正在分配中...' : '分配'}</Button>
                        </div>
                      </FormItem>
                     
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(BatchSplit);