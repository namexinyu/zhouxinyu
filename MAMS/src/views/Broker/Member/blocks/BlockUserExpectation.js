import React from 'react';
import moment from 'moment';

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
  DatePicker
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class BlockUserExpectation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clickOnSalary: false,
      clickOnEat: false,
      clickOnLive: false,
      clickOnWork: false,
      clickOnAround: false,
      clickOnManage: false
    };
  }

  handleClick2Edit = (type) => {
    if (this.state[`clickOn${type}`]) {
      return;
    }

    this.setState({
      [`clickOn${type}`]: true
    }, () => {
      this[`${type}Input`].focus();
    });
  }

  handleBlurSaveInfo = (type) => {
    const value = this.props.expectationInfo[type].value;

    this.setState({
      [`clickOn${type}`]: false
    });

    MemberDetailService.updateSevenFeature({
      BrokerID: this.props.brokerId,
      User7FeatureID: this.props.expectationInfo.User7FeatureID,
      [type]: value,
      DreamDate: moment().format('YYYY-MM-DD')
    }).then((res) => {
      if (res.Code === 0) {
        message.success('保存期望值成功');
        setParams('state_broker_member_detail_info', {
          expectationInfo: {
            ...this.props.expectationInfo,
            DreamDate: moment().format('YYYY-MM-DD')
          }
        });
      } else {
        message.error(res.Data.Desc || '保存失败，请稍后重试');
      }
    }).catch((err) => {
      message.error(err.Desc || '保存失败，请稍后重试');
    });
  }

  render() {
    const {
      form: {
        getFieldDecorator
      },
      expectationInfo
    } = this.props;

    const {
      clickOnSalary,
      clickOnEat,
      clickOnLive,
      clickOnWork,
      clickOnAround,
      clickOnManage
    } = this.state;
    

    return (
      <div style={{
        background: "#fff"
      }} className="mt-8">
        <div className="punch-card flex punch-card__expectation">
          <div className="punch-card__hd flex flex--center">
            <h3>期望值</h3>
          </div>
          <div className="punch-card__bd flex__item flex flex--column flex--x-center">
            <Card className="punch-card__grid" noHovering={true}>
              <Card.Grid>
                <div className="punch-card__grid--item flex flex--column">
                  <div className="punch-card__grid--item-hd">
                    <span>工资</span>
                  </div>
                  <div className="punch-card__grid--item-bd flex__item flex flex--center" onClick={() => this.handleClick2Edit('Salary')}>
                    {!clickOnSalary ? (
                      <p className="expectation-text flex flex--column flex--x-center">
                        <span>{expectationInfo.Salary.value.slice(0, 5)}</span>
                        <span>{expectationInfo.Salary.value.slice(5)}</span>
                      </p>
                    ) : (
                      <FormItem>
                        {getFieldDecorator('Salary')(
                          <Input maxLength="10" onBlur={() => this.handleBlurSaveInfo('Salary')} ref={(input) => { this.SalaryInput = input; }} style={{ width: '100%' }} />
                        )}
                      </FormItem>
                    )}
                  </div>
                </div>
              </Card.Grid>

              <Card.Grid>
                <div className="punch-card__grid--item flex flex--column">
                  <div className="punch-card__grid--item-hd">
                    <span>吃</span>
                  </div>
                  <div className="punch-card__grid--item-bd flex__item flex flex--center" onClick={() => this.handleClick2Edit('Eat')}>
                    {!clickOnEat ? (
                      <p className="expectation-text flex flex--column flex--x-center">
                        <span>{expectationInfo.Eat.value.slice(0, 5)}</span>
                        <span>{expectationInfo.Eat.value.slice(5)}</span>
                      </p>
                    ) : (
                      <FormItem>
                        {getFieldDecorator('Eat')(
                          <Input maxLength="10" onBlur={() => this.handleBlurSaveInfo('Eat')} ref={(input) => { this.EatInput = input; }} style={{ width: '100%' }} />
                        )}
                      </FormItem>
                    )}
                  </div>
                </div>
              </Card.Grid>

              <Card.Grid>
                <div className="punch-card__grid--item flex flex--column">
                  <div className="punch-card__grid--item-hd">
                    <span>住</span>
                  </div>
                  <div className="punch-card__grid--item-bd flex__item flex flex--center" onClick={() => this.handleClick2Edit('Live')}>
                    {!clickOnLive ? (
                      <p className="expectation-text flex flex--column flex--x-center">
                        <span>{expectationInfo.Live.value.slice(0, 5)}</span>
                        <span>{expectationInfo.Live.value.slice(5)}</span>
                      </p>
                    ) : (
                      <FormItem>
                        {getFieldDecorator('Live')(
                          <Input maxLength="10" onBlur={() => this.handleBlurSaveInfo('Live')} ref={(input) => { this.LiveInput = input; }} style={{ width: '100%' }} />
                        )}
                      </FormItem>
                    )}
                  </div>
                </div>
              </Card.Grid>

              <Card.Grid>
                <div className="punch-card__grid--item flex flex--column">
                  <div className="punch-card__grid--item-hd">
                    <span>活</span>
                  </div>
                  <div className="punch-card__grid--item-bd flex__item flex flex--center" onClick={() => this.handleClick2Edit('Work')}>
                    {!clickOnWork ? (
                      <p className="expectation-text flex flex--column flex--x-center">
                        <span>{expectationInfo.Work.value.slice(0, 5)}</span>
                        <span>{expectationInfo.Work.value.slice(5)}</span>
                      </p>
                    ) : (
                      <FormItem>
                        {getFieldDecorator('Work')(
                          <Input maxLength="10" onBlur={() => this.handleBlurSaveInfo('Work')} ref={(input) => { this.WorkInput = input; }} style={{ width: '100%' }} />
                        )}
                      </FormItem>
                    )}
                  </div>
                </div>
              </Card.Grid>

              <Card.Grid>
                <div className="punch-card__grid--item flex flex--column">
                  <div className="punch-card__grid--item-hd">
                    <span>周边</span>
                  </div>
                  <div className="punch-card__grid--item-bd flex__item flex flex--center" onClick={() => this.handleClick2Edit('Around')}>
                    {!clickOnAround ? (
                      <p className="expectation-text flex flex--column flex--x-center">
                        <span>{expectationInfo.Around.value.slice(0, 5)}</span>
                        <span>{expectationInfo.Around.value.slice(5)}</span>
                      </p>
                    ) : (
                      <FormItem>
                        {getFieldDecorator('Around')(
                          <Input maxLength="10" onBlur={() => this.handleBlurSaveInfo('Around')} ref={(input) => { this.AroundInput = input; }} style={{ width: '100%' }} />
                        )}
                      </FormItem>
                    )}
                  </div>
                </div>
              </Card.Grid>

              <Card.Grid>
                <div className="punch-card__grid--item flex flex--column">
                  <div className="punch-card__grid--item-hd">
                    <span>管理</span>
                  </div>
                  <div className="punch-card__grid--item-bd flex__item flex flex--center" onClick={() => this.handleClick2Edit('Manage')}>
                    {!clickOnManage ? (
                      <p className="expectation-text flex flex--column flex--x-center">
                        <span>{expectationInfo.Manage.value.slice(0, 5)}</span>
                        <span>{expectationInfo.Manage.value.slice(5)}</span>
                      </p>
                    ) : (
                      <FormItem>
                        {getFieldDecorator('Manage')(
                          <Input maxLength="10" onBlur={() => this.handleBlurSaveInfo('Manage')} ref={(input) => { this.ManageInput = input; }} style={{ width: '100%' }} />
                        )}
                      </FormItem>
                    )}
                  </div>
                </div>
              </Card.Grid>

              <Card.Grid>
                <div className="punch-card__grid--item flex flex--column">
                  <div className="punch-card__grid--item-hd">
                    <span>做梦日期</span>
                  </div>
                  <div className="punch-card__grid--item-bd flex__item flex flex--center">
                    <p>{expectationInfo.DreamDate}</p>
                  </div>
                </div>
              </Card.Grid>
            </Card>

          </div>
        </div>

      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      Salary,
      Eat,
      Live,
      Work,
      Around,
      Manage
    } = props.expectationInfo;

    return {
      Salary,
      Eat,
      Live,
      Work,
      Around,
      Manage
    };
  },
  onFieldsChange(props, fields) {
    setParams('state_broker_member_detail_info', {
      expectationInfo: {
        ...props.expectationInfo,
        ...fields
      }
    });
  }
})(BlockUserExpectation);
