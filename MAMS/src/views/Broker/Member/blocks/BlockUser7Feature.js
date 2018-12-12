import React from 'react';

import setParams from 'ACTION/setParams';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

import {
  Button,
  message,
  Form,
  Input,
  Select,
  Card
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const gridStyle = {
  width: '25%',
  textAlign: 'center',
  padding: '0',
  height: '100px'
};

class BlockUserFeature extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleSaveInfo = () => {
    console.log(this.props.impressionInfo);
    const {
      RealName,
      CaseLevel,
      BirthYear,
      Province,
      Education,
      MaritalStatus,
      WorkYear,
      NativeAddress,
      Disadvantage,
      Advantage,
      Preference,
      Wycas,
      User7FeatureID
    } = this.props.impressionInfo;

    if (BirthYear.value != '' && (!(/^\d{4}$/.test(BirthYear.value))) || +BirthYear.value > new Date().getFullYear()) {
      message.warn('请输入有效出生年');
      return;
    }

    MemberDetailService.updateSevenFeature({
      BrokerID: this.props.brokerId,
      User7FeatureID,
      RealName: RealName.value || '',
      CaseLevel: +CaseLevel.value,
      BirthYear: BirthYear.value || '',
      Province: +Province.value,
      Education: +Education.value,
      MaritalStatus: +MaritalStatus.value,
      WorkYear: +WorkYear.value,
      NativeAddress: NativeAddress.value || '',
      Disadvantage: Disadvantage.value || '',
      Advantage: Advantage.value || '',
      Preference: Preference.value || '',
      Wycas: Wycas.value && !!Wycas.value.length ? Wycas.value.map(item => +item) : []
    }).then((res) => {
      if (res.Code === 0) {
        message.success('保存成功');
      } else {
        message.error(res.Data.Desc || '保存失败，请稍后重试');
      }
    }).catch((err) => {
      message.error(err.Desc || '保存失败，请稍后重试');
    });
  }

  getSelectDataList = (type) => {
    const { impressionConfigList } = this.props;
    return impressionConfigList.length ? ((impressionConfigList.filter(item => item.Type === type)[0] || {}).NVList || []) : [];
  }

  render() {
    const {
      form: {
        getFieldDecorator
      },
      impressionInfo,
      impressionConfigList
    } = this.props;

    const ProvinceList = this.getSelectDataList('province');
    const EducationList = this.getSelectDataList('education');
    const MaritalStatusList = this.getSelectDataList('marital');
    const WorkYearList = this.getSelectDataList('workyear');
    const WycasList = this.getSelectDataList('wycas');
    

    return (
      <div style={{
        padding: "10px",
        background: "#fff"
      }}>
        <Form layout="inline">
          <Card title="会员印象卡" extra={<Button onClick={this.handleSaveInfo} type="primary">保存</Button>}>
            <div>
              <FormItem label="目标会员">
                {getFieldDecorator('CaseLevel')(
                  <Select size="default" style={{ minWidth: 100 }}>
                    <Option value="-1">请选择</Option>
                    <Option value="1">AA</Option>
                    <Option value="2">AB</Option>
                    <Option value="3">Z</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem label="姓名">
                {getFieldDecorator('RealName')(
                  <Input style={{ width: 100 }} />
                )}
              </FormItem>

              <FormItem label="出生年">
                {getFieldDecorator('BirthYear')(
                  <Input type="number" style={{ width: 100 }} />
                )}
              </FormItem>

              <FormItem label="籍贯">
                {getFieldDecorator('Province')(
                  <Select size="default" style={{ minWidth: 100 }}>
                    <Option value="0">请选择</Option>
                    {
                      ProvinceList.map((item, i) => {
                        return (
                          <Option key={i} value={`${item.Value}`}>{item.Name}</Option>
                        );
                      })
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem label="学历">
                {getFieldDecorator('Education')(
                  <Select size="default" style={{ minWidth: 100 }}>
                    <Option value="0">请选择</Option>
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

              <FormItem label="婚否">
                {getFieldDecorator('MaritalStatus')(
                  <Select size="default" style={{ minWidth: 100 }}>
                    <Option value="0">请选择</Option>
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

              <FormItem label="纹烟残案">
                {getFieldDecorator('Wycas')(
                  <Select
                    mode="multiple"
                    style={{ minWidth: 150 }}
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

              <FormItem label="出道年">
                {getFieldDecorator('WorkYear')(
                  <Select size="default" style={{ minWidth: 100 }}>
                    <Option value="0">请选择</Option>
                    {
                      WorkYearList.map((item, i) => {
                        return (
                          <Option key={i} value={`${item.Value}`}>{item.Name}</Option>
                        );
                      })
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem label="人在哪">
                {getFieldDecorator('NativeAddress')(
                  <Input style={{ width: 100 }} />
                )}
              </FormItem>

              <FormItem label="优点">
                {getFieldDecorator('Advantage')(
                  <Input style={{ width: 100 }} />
                )}
              </FormItem>

              <FormItem label="缺点">
                {getFieldDecorator('Disadvantage')(
                  <Input style={{ width: 100 }} />
                )}
              </FormItem>

              <FormItem label="爱好">
                {getFieldDecorator('Preference')(
                  <Input style={{ width: 100 }} />
                )}
              </FormItem>
            </div>
          </Card>
        </Form>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      RealName,
      CaseLevel,
      BirthYear,
      Province,
      Education,
      MaritalStatus,
      WorkYear,
      NativeAddress,
      Disadvantage,
      Advantage,
      Preference,
      Wycas
    } = props.impressionInfo;

    return {
      RealName,
      CaseLevel,
      BirthYear,
      Province,
      Education,
      MaritalStatus,
      WorkYear,
      NativeAddress,
      Disadvantage,
      Advantage,
      Preference,
      Wycas
    };
  },
  onFieldsChange(props, fields) {
    setParams('state_broker_member_detail_info', {
      impressionInfo: {
        ...props.impressionInfo,
        ...fields
      }
    });
  }
})(BlockUserFeature);
