import React from 'react';
import classnames from 'classnames';

import setParams from "ACTION/setParams";

import {
  Row,
  Col,
  Form,
  Input
} from 'antd';

class SalaryCalculator extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  handleHFFMonthSalaryChange = (e) => {
    const { HighFanFei, HighHourPay } = this.props;
    const monthSalary = e.target.value;
    const triMonthSalary = (+monthSalary * 3).toFixed(2);
    const deductionSalary = (+monthSalary / 2).toFixed(2);
    
    const handonSalary = (+triMonthSalary + (+HighFanFei.fanfei) - (+deductionSalary)).toFixed(2);

    setParams('state_broker_header_calculator', {
      HighFanFei: {
        ...HighFanFei,
        monthSalary,
        triMonthSalary,
        deductionSalary,
        handonSalary
      },
      PKWinner: this.getPKWinner(+monthSalary, +HighHourPay.hourPay, +handonSalary, +HighHourPay.handonSalary)
    });
  }

  handleFanFeiChange = (e) => {
    const { HighFanFei, HighHourPay } = this.props;
    const fanfei = e.target.value;
    const handonSalary = ((+HighFanFei.triMonthSalary) + (+fanfei) - (+HighFanFei.deductionSalary)).toFixed(2);

    setParams('state_broker_header_calculator', {
      HighFanFei: {
        ...HighFanFei,
        fanfei: fanfei,
        handonSalary: handonSalary
      },
      PKWinner: this.getPKWinner(+HighFanFei.monthSalary, +HighHourPay.hourPay, +handonSalary, +HighHourPay.handonSalary)
    });
  }

  handleHourPayChange = (e) => {
    const hourPay = e.target.value;
    const monthSalary = (+hourPay * 260).toFixed(2);
    const triMonthSalary = (+hourPay * 260 * 3).toFixed(2);
    const { HighFanFei, HighHourPay } = this.props;

    setParams('state_broker_header_calculator', {
      HighHourPay: {
        ...HighHourPay,
        hourPay: hourPay,
        monthSalary: monthSalary,
        triMonthSalary: triMonthSalary,
        handonSalary: triMonthSalary
      },
      PKWinner: this.getPKWinner(+HighFanFei.monthSalary, +hourPay, +HighFanFei.handonSalary, +triMonthSalary)
    });
  }

  getPKWinner(HFFMonthSalary, HHPHourPay, HFFHandonSalary, HHPHandonSalary) {
    if (HFFMonthSalary === '' || HHPHourPay === '') {
      return '';
    }
    return HFFHandonSalary < HHPHandonSalary ? 'HighHourPay' : 'HighFanFei';
  }

  render() {
    const {
      HighFanFei,
      HighHourPay,
      PKWinner
    } = this.props;
    
    return (
      <div>
        <div className="ivy-page-title flex flex--between">
          <h1>薪资计算</h1>
        </div>
        <div style={{
          width: "100%",
          padding: "57px 70px 0",
          height: "100%"
        }} className="flex flex--center">
          <Row>
            <Col span={24}>
              <div className="salary-pk-card">
                <div className="salary-pk-card__hd">
                  <img className="pk-brand-img img-fluid" src="//woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/img/salary-pk.png" />
                  <h1>高返费、高工价都按上六休一，每天10小时，共260小时计算。</h1>
                </div>
                <div className="salary-pk-card__bd flex mt-20">
                  <div className="salary-pk-card__bd--left flex__item mr-8">
                    <div className="salary-pk-panel">
                      <div className="salary-pk-panel__hd">
                        <h3>高返费</h3>
                      </div>
                      <div className="salary-pk-panel__bd">
                        <div className="salary-item flex">
                          <div className="salary-item-label flex flex--center">
                            <span>月工资</span>
                          </div>
                          <div className="salary-item-control flex flex--center">
                            <Input type="number" value={HighFanFei.monthSalary} onChange={this.handleHFFMonthSalaryChange} className="salary-item-input" />
                            <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                        <div className="salary-item flex">
                          <div className="salary-item-label flex flex--center">
                            <span>三个月</span>
                          </div>
                          <div className="salary-item-control flex flex--center">
                            <Input readOnly value={HighFanFei.triMonthSalary} className="salary-item-input" />
                            <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                        <div className="salary-item flex">
                          <div className="salary-item-label flex flex--center">
                            <span>返   费</span>
                          </div>
                          <div className="salary-item-control flex flex--center">
                            <Input type="number" value={HighFanFei.fanfei} onChange={this.handleFanFeiChange} className="salary-item-input" />
                            <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                        <div className="salary-item flex">
                          <div className="salary-item-label flex flex--center">
                            <span>扣工资</span>
                          </div>
                          <div className="salary-item-control flex flex--center">
                            <Input readOnly value={HighFanFei.deductionSalary} className="salary-item-input" />
                            <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                        <div className="salary-item flex">
                          <div className="salary-item-label flex flex--center">
                            <span>到   手</span>
                          </div>
                          <div className="salary-item-control flex flex--center">
                            <Input readOnly value={HighFanFei.handonSalary} className="salary-item-input" />
                            <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className={classnames('salary-pk-card__bd--right flex__item', {
                    'salary-pk-winner': PKWinner === 'HighHourPay'
                  })}>
                    <div className="salary-pk-panel">
                      <div className="salary-pk-panel__hd flex flex--y-center">
                        <h3>高工价</h3>
                        <div className=" ml-20">
                          <Input type="number" value={HighHourPay.hourPay} onChange={this.handleHourPayChange} className="salary-item-input" />
                          <span className="salary-item-input-suffix">元/时</span>
                        </div>
                      </div>
                      <div className="salary-pk-panel__bd">
                        <div className="salary-item flex">
                          <div className="salary-item-control flex flex--y-center">
                            <Input readOnly value={HighHourPay.monthSalary} className="salary-item-input" />
                            <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                        <div className="salary-item flex">
                          <div className="salary-item-control flex flex--y-center">
                              <Input readOnly value={HighHourPay.triMonthSalary} className="salary-item-input" />
                              <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                        <div className="salary-item flex">
                          <div className="salary-item-control flex flex--y-center">
                              <Input readOnly value={HighHourPay.fanfei} className="salary-item-input" />
                              <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                        <div className="salary-item flex">
                          <div className="salary-item-control flex flex--y-center">
                            <Input readOnly value={HighHourPay.deductionSalary} className="salary-item-input" />
                            <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                        <div className="salary-item flex">
                          <div className="salary-item-control flex flex--y-center">
                            <Input readOnly value={HighHourPay.handonSalary} className="salary-item-input" />
                            <span className="salary-item-input-suffix">元</span>
                          </div>
                        </div>
                      </div>
                      <img className="pk-winner-img" src="//woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/img/salary-pk-winner.png" />
                    </div>
                    <div className="pk-winner-banner mt-10">
                      <span className="mr-5">高工价</span>
                      完胜
                      <span className="ml-5 mr-5">{HighHourPay.handonSalary - HighFanFei.handonSalary}</span>
                      元！
                      <i className="icon-winner-star" ></i>
                    </div>
                  </div>
                </div>
                <div className="salary-pk-card__ft">
                  <div className="flex flex--center">
                    <img width="40px" height="40px" src="//woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/img/salary-pk-warn.png" />
                    <div className="ml-20">
                      <p>高返费：不准请假、旷工、迟到、早退、与领导吵架。</p>
                      <p>如有一项不满足，高返费将作废。</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Form.create()(SalaryCalculator);