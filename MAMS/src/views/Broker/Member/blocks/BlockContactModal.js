import {
  Button,
  message,
  Form,
  Input,
  Select,
  Card,
  Row,
  Modal,
  InputNumber,
  AutoComplete
} from 'antd';
import React from 'react';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';
import getSevenFeature from 'ACTION/Broker/MemberDetail/getSevenFeature';
import getPersonPostInfo from 'ACTION/Broker/MemberDetail/getPersonPostInfo';
class BlockContactModal extends React.Component {
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
  componentDidMount () {
    this.getFullYear();
  }
  handleOk = (e) => {
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      let parme = {
        BrokerID: this.props.brokerId,
        User7FeatureID: this.props.impressionInfo.User7FeatureID
      };
      let { CaseLevel, WorkYear, Wycas, MaritalStatus, Education, Province, BirthYear, RealName } = fieldsValue;
      if (CaseLevel !== undefined) {
        parme.CaseLevel = CaseLevel * 1;
      }
      if (WorkYear !== undefined) {
        parme.WorkYearStr = WorkYear;
      }
      if (Wycas !== undefined) {
        parme.Wycas = [];
        Wycas.map((item) => {
          parme.Wycas.push(item * 1);
        });
      }
      if (MaritalStatus !== undefined) {
        parme.MaritalStatus = MaritalStatus * 1;
      }
      if (Education !== undefined) {
        parme.Education = Education * 1;
      }
      if (Province !== undefined) {
        parme.Province = Province * 1;
      }
      if (BirthYear !== undefined) {
        parme.BirthYear = BirthYear + "";
      }
      if (RealName !== undefined) {
        parme.RealName = RealName;
      }
      MemberDetailService.updateSevenFeature(parme).then((data) => {
        if (data.Code == 0) {
          getSevenFeature({
            BrokerID: this.props.brokerId,
            UserID: +this.props.memberId
          });
          this.props.form.resetFields();
          message.success("保存会员印象成功");
          this.props.getBlockContactModal(false);
          getPersonPostInfo({
            call_type: 2,
            user_id: this.props.memberId,
            recruit_tmp_id: Number(this.props.pocketInfo.lastestEnrollRecord.RecruitTmpID)
          });
        }
      }).catch((err) => {
        message.error(err.Desc);
      });

    });
  }
  getSelectDataList = (type) => {
    const { impressionConfigList } = this.props;
    return impressionConfigList.length ? ((impressionConfigList.filter(item => item.Type === type)[0] || {}).NVList || []) : [];
  }
  handleCancel = (e) => {
    this.props.getBlockContactModal(false);
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
    const ProvinceList = this.getSelectDataList('province');
    const EducationList = this.getSelectDataList('education');
    const MaritalStatusList = this.getSelectDataList('marital');
    const WorkYearList = this.getSelectDataList('workyear');
    const WycasList = this.getSelectDataList('wycas');
    const FormItem = Form.Item;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Modal
        width="70%"
        footer={false}
        visible={this.props.BlockContactModal}
        okText="保存"
        onOk={this.handleOk}
        onCancel={this.handleCancel} >
        <div style={{
          background: "#fff"
        }}>
          <h3 style={{ textAlign: "center", margin: "0 0 20px 0" }}>请梳理会员7要素</h3>
          <div className="punch-card flex punch-card__impression">
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
                          <Select size="default" style={{ width: '100%' }} placeholder="请选择">
                            <Option value="1">AA</Option>
                            <Option value="2">AB</Option>
                            <Option value="3">Z</Option>
                          </Select>)}
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
                        {getFieldDecorator('RealName', {
                          initialValue: this.props.impressionInfo.RealName.value || ''
                        })(
                          <Input autoComplete="off" style={{ width: '100%', textAlign: 'center' }} />
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
                        {getFieldDecorator('BirthYear', {
                          rules: [
                            {
                              validator: function (rule, value, cb) {
                                if ((value != '' && value != null) && (!(/^\d{4}$/.test(value))) || +value > new Date().getFullYear() || value < 1970) {
                                  cb('请输入有效出生年');
                                }
                                cb();
                              }
                            }
                          ]
                        })(
                          <InputNumber style={{ width: '100%' }} min={0} formatter={this.handleFormatYear} maxLength={4} />
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
                          <Select
                            style={{ width: "100%" }}
                            filterOption={this._filterOption}
                            showSearch={true}
                          >

                            {
                              (ProvinceList || []).map((item, i) => {
                                return (
                                  <Option key={item.Value}
                                    value={`${item.Value}`}>{item.Name}</Option>
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
                      <span>学历</span>
                    </div>
                    <div className="punch-card__grid--item-bd">
                      <FormItem>
                        {getFieldDecorator('Education')(
                          <Select size="default" style={{ width: '100%' }} placeholder="请选择">
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
                          <Select size="default" style={{ width: '100%' }} placeholder="请选择">
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
                      <span>纹烟残案</span>
                    </div>
                    <div className="punch-card__grid--item-bd">
                      <FormItem>
                        {getFieldDecorator('Wycas')(
                          <Select
                            mode="multiple"
                            style={{ width: '100%' }}
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
                        {getFieldDecorator('WorkYear')(
                          <Select
                            filterOption={this._filterOption}
                            showSearch={true}
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
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0 0 0" }}>
          <Button style={{ margin: "0 30px 0 0" }} type="primary" onClick={this.handleOk}>保存</Button>
          <Button onClick={this.handleCancel}>取消</Button>
        </div>
      </Modal>
    );
  }
}
export default Form.create({
  // mapPropsToFields(props) {
  // },
  // onFieldsChange(props, fields) {
  // }
})(BlockContactModal);;