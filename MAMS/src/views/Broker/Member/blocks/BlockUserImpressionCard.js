import React from 'react';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import setParams from 'ACTION/setParams';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

import {
  Button,
  message,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  InputNumber,
  AutoComplete
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const ProvinceList = [
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

class BlockUserImpressionCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clickRemark: false,
      clickPainPoint: false,
      clickSolution: false,
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
  componentDidMount () {
    this.getFullYear();
  }
  getSelectDataList = (type) => {
    const { impressionConfigList } = this.props;
    return impressionConfigList.length ? ((impressionConfigList.filter(item => item.Type === type)[0] || {}).NVList || []) : [];
  }

  handleClick2Edit = (type) => {
    this.setState({
      [`click${type}`]: true
    }, () => {
      this[`${type}Input`].focus();
    });
  }

  getPropertyValue = (type) => {
    const {
      impressionInfo
    } = this.props;

    let result = null;
    const rawValue = impressionInfo[type];

    switch (type) {
      case 'CaseLevel':
      case 'Province':
      case 'Education':
      case 'MaritalStatus':
      case 'WorkYearStr':
        result = +rawValue.value;
        break;

      case 'RealName':
      case 'BirthYear':
      case 'Remark':
      case 'PainPoint':
      case 'Solution':
        result = `${rawValue.value == null ? '' : rawValue.value}`;
        break;

      case 'Wycas':
        result = rawValue && !!rawValue.value.length ? rawValue.value.map(item => +item) : [];
        break;
    }

    return result;
  }

  handleBlurSaveInfo = (type) => {
    console.log(this.props.impressionInfo[type]);

    const value = this.props.impressionInfo[type].value;
    if (type === 'Remark' || type === 'PainPoint' || type === 'Solution') {
      this.setState({
        [`click${type}`]: false
      });
    }

    if (type === 'BirthYear' && (value != '' && value != null) && (!(/^\d{4}$/.test(value))) || +value > new Date().getFullYear()) {
      message.warn('请输入有效出生年');
      return;
    }

    MemberDetailService.updateSevenFeature({
      BrokerID: this.props.brokerId,
      User7FeatureID: this.props.impressionInfo.User7FeatureID,
      [type]: this.getPropertyValue(type)
    }).then((res) => {
      if (res.Code === 0) {
        message.success('保存会员印象成功');
      } else {
        message.error(res.Data.Desc || '保存失败，请稍后重试');
      }
    }).catch((err) => {
      message.error(err.Desc || '保存失败，请稍后重试');
    });
  }

  handleSelectInfo = (type, value) => {
    // if (type === 'Province') {
    //   const provinceList = this.getSelectDataList('province');
    //   if (!provinceList.filter(item => item.Value == value).length) {
    //     message.warn('请选择有效的籍贯');
    //     return;
    //   }
    // }
    if (type == "WorkYearStr") {
      value = value;
    } else {
      value = +value;
    }
    MemberDetailService.updateSevenFeature({
      BrokerID: this.props.brokerId,
      User7FeatureID: this.props.impressionInfo.User7FeatureID,
      [type]: value
    }).then((res) => {
      if (res.Code === 0) {
        message.success('保存会员印象成功');
      } else {
        message.error(res.Data.Desc || '保存失败，请稍后重试');
      }
    }).catch((err) => {
      message.error(err.Desc || '保存失败，请稍后重试');
    });
  }

  handleMultiSelectInfo = (type, value) => {
    MemberDetailService.updateSevenFeature({
      BrokerID: this.props.brokerId,
      User7FeatureID: this.props.impressionInfo.User7FeatureID,
      [type]: value.map(item => +item)
    }).then((res) => {
      if (res.Code === 0) {
        message.success('保存会员印象成功');
      } else {
        message.error(res.Data.Desc || '保存失败，请稍后重试');
      }
    }).catch((err) => {
      message.error(err.Desc || '保存失败，请稍后重试');
    });
  }

  handleFormatYear = (value) => {
    return `${value}`.replace(/\D/, '');
  }
  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
  handleDGZY = (obj) => {
    let value = obj;
    this.setState({ ExperienceYear: value });
  }
  handleChangeTmpReply = (e) => {
    this.setState({
      ExperienceYear: e.target.value
    });
  }
  render () {
    const {
      form: {
        getFieldDecorator
      },
      impressionInfo
    } = this.props;

    const {
      clickRemark,
      clickPainPoint,
      clickSolution
    } = this.state;

    // const ProvinceList = this.getSelectDataList('province');
    const EducationList = this.getSelectDataList('education');
    const MaritalStatusList = this.getSelectDataList('marital');
    const WorkYearList = this.getSelectDataList('workyear');
    const WycasList = this.getSelectDataList('wycas');

    return (
      <div style={{
        background: "#fff"
      }}>
        <div className="punch-card flex punch-card__impression">
          <div className="punch-card__hd flex flex--center">
            <h3>会员印象卡</h3>
          </div>
          <div className="punch-card__bd flex__item flex flex--column flex--x-center ml-8" style={{ paddingRight: 8, overflow: 'hidden' }}>
            <Card className="punch-card__grid" noHovering={true}>
              <Card.Grid>
                <div className="punch-card__grid--item">
                  <div className="punch-card__grid--item-hd">
                    <span>目标会员</span>
                  </div>
                  <div className="punch-card__grid--item-bd">
                    <FormItem>
                      {getFieldDecorator('CaseLevel')(
                        <Select size="default" style={{ width: '100%' }} onChange={(value) => this.handleSelectInfo('CaseLevel', value)} placeholder="请选择">
                          <Option value="1">AA</Option>
                          <Option value="2">AB</Option>
                          <Option value="3">Z</Option>
                        </Select>
                      )}
                    </FormItem>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid>
                <div className="punch-card__grid--item">
                  <div className="punch-card__grid--item-hd">
                    <span>姓名</span>
                  </div>
                  <div className="punch-card__grid--item-bd">
                    <FormItem>
                      {getFieldDecorator('RealName')(
                        <Input autoComplete="off" style={{ width: '100%', textAlign: 'center' }} onBlur={() => this.handleBlurSaveInfo('RealName')} />
                      )}
                    </FormItem>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid>
                <div className="punch-card__grid--item">
                  <div className="punch-card__grid--item-hd">
                    <span>出生年</span>
                  </div>
                  <div className="punch-card__grid--item-bd">
                    <FormItem>
                      {getFieldDecorator('BirthYear')(
                        <InputNumber style={{ width: '100%' }} min={0} formatter={this.handleFormatYear} onBlur={() => this.handleBlurSaveInfo('BirthYear')} maxLength={4} />
                      )}
                    </FormItem>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid>
                <div className="punch-card__grid--item">
                  <div className="punch-card__grid--item-hd">
                    <span>籍贯</span>
                  </div>
                  <div className="punch-card__grid--item-bd">
                    <FormItem>
                      {getFieldDecorator('Province')(
                        <AutoComplete
                          dataSource={ProvinceList}
                          placeholder=""
                          filterOption={(inputValue, option) => {
                            return option.props.children.indexOf(inputValue) !== -1;
                          }}
                          onSelect={(value) => this.handleSelectInfo('Province', value)}
                        >
                          {ProvinceList.map((item, i) => (
                            <Option key={item.valueKey} value={`${item.valueKey}`}>{item.text}</Option>
                            // <Option key={item.Value} value={`${item.Value}`}>{item.Name}</Option>
                          ))}
                        </AutoComplete>
                      )}
                    </FormItem>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid>
                <div className="punch-card__grid--item">
                  <div className="punch-card__grid--item-hd">
                    <span>学历</span>
                  </div>
                  <div className="punch-card__grid--item-bd">
                    <FormItem>
                      {getFieldDecorator('Education')(
                        <Select size="default" style={{ width: '100%' }} onChange={(value) => this.handleSelectInfo('Education', value)} placeholder="请选择">
                          {
                            EducationList.map((item, i) => {
                              return (
                                <Option key={i} value={`${item.Value}`}>{item.Name}</Option>
                              );
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid>
                <div className="punch-card__grid--item">
                  <div className="punch-card__grid--item-hd">
                    <span>婚否</span>
                  </div>
                  <div className="punch-card__grid--item-bd">
                    <FormItem>
                      {getFieldDecorator('MaritalStatus')(
                        <Select size="default" style={{ width: '100%' }} onChange={(value) => this.handleSelectInfo('MaritalStatus', value)} placeholder="请选择">
                          {
                            MaritalStatusList.map((item, i) => {
                              return (
                                <Option key={i} value={`${item.Value}`}>{item.Name}</Option>
                              );
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid>
                <div className="punch-card__grid--item">
                  <div className="punch-card__grid--item-hd">
                    <span>纹烟残案少</span>
                  </div>
                  <div className="punch-card__grid--item-bd">
                    <FormItem>
                      {getFieldDecorator('Wycas')(
                        <Select
                          mode="multiple"
                          style={{ width: '100%' }}
                          onChange={(value) => this.handleMultiSelectInfo('Wycas', value)}
                        >
                          {
                            WycasList.map((item, i) => {
                              return (
                                <Option key={i} value={`${item.Value}`}>{item.Name}</Option>
                              );
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  </div>
                </div>
              </Card.Grid>
              <Card.Grid>
                <div className="punch-card__grid--item">
                  <div className="punch-card__grid--item-hd">
                    <span>出道年</span>
                  </div>
                  <div className="punch-card__grid--item-bd">
                    <FormItem>
                      {getFieldDecorator('WorkYearStr')(
                        <Select
                          value={this.state.ExperienceYear}
                          filterOption={this._filterOption}
                          showSearch={true}
                          onChange={(value) => this.handleSelectInfo('WorkYearStr', value)}
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
                      )}
                    </FormItem>
                  </div>
                </div>
              </Card.Grid>
            </Card>

            <Row className="mt-8" style={{
              border: '1px solid #e9e9e9',
              padding: '2px 8px'
            }}>
              <Col span={24}>
                <FormItem label="情况说明" className="flexible-form-item">
                  {!clickRemark ? (
                    <p className="text-ellipsis" style={{ height: 31 }} onClick={() => this.handleClick2Edit('Remark')}>{impressionInfo.Remark.value}</p>
                  ) : (
                      getFieldDecorator('Remark')(
                        <Input maxLength="60" ref={(input) => { this.RemarkInput = input; }} onBlur={() => this.handleBlurSaveInfo('Remark')} />
                      )
                    )}
                </FormItem>
              </Col>
            </Row>


            <Row className="mt-8" style={{
              border: '1px solid #e9e9e9',
              padding: '2px 8px'
            }}>
              <Col span={24}>
                <FormItem label="用户痛点" className="flexible-form-item">
                  {!clickPainPoint ? (
                    <p className="text-ellipsis" style={{ height: 31 }} onClick={() => this.handleClick2Edit('PainPoint')}>{impressionInfo.PainPoint.value}</p>
                  ) : (
                      getFieldDecorator('PainPoint')(
                        <Input maxLength="60" ref={(input) => { this.PainPointInput = input; }} onBlur={() => this.handleBlurSaveInfo('PainPoint')} />
                      )
                    )}
                </FormItem>
              </Col>
            </Row>

            <Row className="mt-8" style={{
              border: '1px solid #e9e9e9',
              padding: '2px 8px'
            }}>
              <Col span={24}>
                <FormItem label="解决方案" className="flexible-form-item">
                  {!clickSolution ? (
                    <p className="text-ellipsis" style={{ height: 31 }} onClick={() => this.handleClick2Edit('Solution')}>{impressionInfo.Solution.value}</p>
                  ) : (
                      getFieldDecorator('Solution')(
                        <Input maxLength="60" ref={(input) => { this.SolutionInput = input; }} onBlur={() => this.handleBlurSaveInfo('Solution')} />
                      )
                    )}
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields (props) {
    const {
      RealName,
      CaseLevel,
      BirthYear,
      Province,
      Education,
      MaritalStatus,
      WorkYearStr,
      NativeAddress,
      Disadvantage,
      Advantage,
      Preference,
      Remark,
      PainPoint,
      Solution,
      Wycas
    } = props.impressionInfo;

    return {
      RealName,
      CaseLevel,
      BirthYear,
      Province,
      Education,
      MaritalStatus,
      WorkYearStr,
      NativeAddress,
      Disadvantage,
      Advantage,
      Preference,
      Remark,
      PainPoint,
      Solution,
      Wycas
    };
  },
  onFieldsChange (props, fields) {
    setParams('state_broker_member_detail_info', {
      impressionInfo: {
        ...props.impressionInfo,
        ...fields
      }
    });
  }
})(BlockUserImpressionCard);
