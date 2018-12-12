import merge from 'REDUCER/merge';
import setParams from 'ACTION/setParams';

const STATE_NAME = 'state_broker_header_calculator';

function InitialState() {
  return {
    HighFanFei: {
      monthSalary: '',
      triMonthSalary: '',
      fanfei: '',
      deductionSalary: '',
      handonSalary: ''
    },
    HighHourPay: {
      hourPay: '',
      monthSalary: '',
      triMonthSalary: '',
      fanfei: 0,
      deductionSalary: 0,
      handonSalary: ''
    },
    PKWinner: ''
  };
}

export default {
  initialState: new InitialState(),
  reducers: {
    [setParams]: merge((payload, state) => {
      if (payload.stateName === STATE_NAME) {
        return payload.params;
      }
      return {};
    })
  }
};