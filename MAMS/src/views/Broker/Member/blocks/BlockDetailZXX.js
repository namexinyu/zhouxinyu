import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import hex_md5 from 'UTIL/MD5/hex_md5';
import Calendar from 'react-calendar';

import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

import {
  Button,
  Icon,
  Row,
  Col,
  Modal,
  message,
  Table,
  Select,
  Card,
  Form,
  Input,
  Collapse,
  DatePicker,
  Cascader,
  Tag,
  Radio,
  Tabs,
  Steps
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const { Column, ColumnGroup } = Table;
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Step = Steps.Step;


class BlockDetailZXX extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cardsInfo: {},
            newCardsInfo: {},
            attendanceModalVisible: false,
            cardAuditStatusMap: {
              0: '无记录',
              1: '未审核',
              2: '审核通过',
              3: '审核未通过'
            },
            attendanceData: {
              page: 1,
              pageSize: 20,
              rows: [],
              rowsMap: {},
              total: 0
            },
            currentDateAttendance: {},
            weekSalaryData: {
              page: 1,
              pageSize: 20,
              rows: [],
              total: 0
            },
            monthSalaryData: {
              page: 1,
              pageSize: 20,
              rows: [],
              total: 0
            },
            oldAttendanceColumns: [
              {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => {
                  return (index + 1) + this.state.attendanceData.pageSize * (this.state.attendanceData.page - 1);
                }
              },
              {
                title: '企业',
                dataIndex: 'EnterpriseName'
              },
              {
                title: '姓名',
                dataIndex: 'MemberName'
              },
              {
                title: '工号',
                dataIndex: 'WorkCardNum'
              },
              {
                title: '上班日期',
                dataIndex: 'CreatedDate'
              },
              {
                title: '上班打卡时间',
                dataIndex: 'ToWorkTime'
              },
              {
                title: '打卡定位',
                dataIndex: 'Address'
              },
              {
                title: '下班打卡时间',
                dataIndex: 'OffWorkTime'
              },
              {
                title: '打卡定位',
                dataIndex: 'Address2'
              }
            ],
            newAttendanceColumns: [
              {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => {
                  return (index + 1) + this.state.attendanceData.pageSize * (this.state.attendanceData.page - 1);
                }
              },
              {
                title: '企业',
                dataIndex: 'EntName'
              },
              {
                title: '姓名',
                dataIndex: 'RealName'
              },
              {
                title: '工号',
                dataIndex: 'WorkCardNo'
              },
              {
                title: '上班日期',
                dataIndex: 'ClockDt'
              },
              {
                title: '上班打卡时间',
                dataIndex: 'ClockInTm'
              },
              {
                title: '打卡定位',
                dataIndex: 'ClockInAddr'
              },
              {
                title: '下班打卡时间',
                dataIndex: 'ClockOutTm'
              },
              {
                title: '打卡定位',
                dataIndex: 'ClockOutAddr'
              }
            ],
            oldWeekSalaryColumns: [
              {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => {
                  return (index + 1) + this.state.weekSalaryData.pageSize * (this.state.weekSalaryData.page - 1);
                }
              },
              {
                title: '姓名',
                dataIndex: 'MemberName'
              },
              {
                title: '企业',
                dataIndex: 'EnterpriseName'
              },
              {
                title: '工号',
                dataIndex: 'WorkCardNum'
              },
              {
                title: '开始时间',
                dataIndex: 'BeginDate'
              },
              {
                title: '截止时间',
                dataIndex: 'EndDate'
              },
              {
                title: '是否在职',
                dataIndex: 'IsOnJob'
              },
              {
                title: '打卡天数',
                dataIndex: 'WorkDays'
              },
              {
                title: '周薪薪实发周薪',
                dataIndex: 'Salary'
              },
              {
                title: '审核状态',
                dataIndex: 'AuditStatus'
              },
              {
                title: '审核备注',
                dataIndex: 'AuditRemark'
              }
            ],
            newWeekSalaryColumns: [
              {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => {
                  return (index + 1) + this.state.weekSalaryData.pageSize * (this.state.weekSalaryData.page - 1);
                }
              },
              {
                title: '姓名',
                dataIndex: 'RealName'
              },
              {
                title: '企业',
                dataIndex: 'EntShortName'
              },
              {
                title: '工号',
                dataIndex: 'WorkCardNo'
              },
              {
                title: '开始时间',
                dataIndex: 'BeginDt'
              },
              {
                title: '截止时间',
                dataIndex: 'EndDt'
              },
              {
                title: '是否在职',
                dataIndex: 'WorkSts',
                render: (text, record) => {
                  const WorkStatusMap = {
                    1: '在职',
                    2: '离职',
                    3: '转正',
                    4: '未处理',
                    5: '未知',
                    6: '自离'
                  };
                  return WorkStatusMap[text] || '';
                }
              },
              {
                title: '打卡天数',
                dataIndex: 'ClockDays'
              },
              {
                title: '周薪薪实发周薪',
                dataIndex: 'AdvancePayAmt',
                render: (text) => {
                  return parseFloat((+text || 0) / 100).toFixed(2);
                }
              },
              {
                title: '审核状态',
                dataIndex: 'AuditStatus'
              },
              {
                title: '审核备注',
                dataIndex: 'AuditRemark'
              }
            ],
            oldMonthSalaryColumns: [
              {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => {
                  return (index + 1) + this.state.monthSalaryData.pageSize * (this.state.monthSalaryData.page - 1);
                }
              },
              {
                title: '企业',
                dataIndex: 'EnterpriseName'
              },
              {
                title: '姓名',
                dataIndex: 'MemberName'
              },
              {
                title: '工号',
                dataIndex: 'WorkCardNum'
              },
              {
                title: '月份',
                dataIndex: 'Month'
              },
              {
                title: '结算开始日期',
                dataIndex: 'BeginDate'
              },
              {
                title: '结算截止日期',
                dataIndex: 'EndDate'
              },
              {
                title: '出勤时长',
                dataIndex: 'WorkHours'
              },
              {
                title: '实发工资',
                dataIndex: 'TotalAmount'
              },
              {
                title: '已支生活费',
                dataIndex: 'AdvanceLivingAmount'
              },
              {
                title: '理论剩余工资',
                dataIndex: 'IdealSurplusWage'
              },
              {
                title: '实际剩余工资',
                dataIndex: 'DiffAmount'
              },
              {
                title: '是否在职',
                dataIndex: 'IsOnJob'
              },
              {
                title: '审核状态',
                dataIndex: 'AuditStatus'
              },
              {
                title: '审核备注',
                dataIndex: 'AuditRemark'
              }
            ],
            newMonthSalaryColumns: [
              {
                title: '序号',
                dataIndex: 'index',
                render: (text, record, index) => {
                  return (index + 1) + this.state.monthSalaryData.pageSize * (this.state.monthSalaryData.page - 1);
                }
              },
              {
                title: '企业',
                dataIndex: 'EntName'
              },
              {
                title: '姓名',
                dataIndex: 'RealName'
              },
              {
                title: '工号',
                dataIndex: 'WorkCardNo'
              },
              {
                title: '月份',
                dataIndex: 'BillRelatedMo'
              },
              {
                title: '结算开始日期',
                dataIndex: 'BeginDt'
              },
              {
                title: '结算截止日期',
                dataIndex: 'EndDt'
              },
              {
                title: '实发工资',
                dataIndex: 'TrgtSpMonthlyPaidSalary',
                render: (text) => {
                  return parseFloat((+text || 0) / 100).toFixed(2);
                }
              },
              {
                title: '已支生活费',
                dataIndex: 'WeeklyPaidAmt',
                render: (text) => {
                  return parseFloat((+text || 0) / 100).toFixed(2);
                }
              },
              {
                title: '理论剩余工资',
                dataIndex: 'IdealSurplusWage',
                render: (text) => {
                  return parseFloat((+text || 0) / 100).toFixed(2);
                }
              },
              {
                title: '实际剩余工资',
                dataIndex: 'DiffAmount',
                render: (text) => {
                  return parseFloat((+text || 0) / 100).toFixed(2);
                }
              },
              {
                title: '是否在职',
                dataIndex: 'WorkSts',
                render: (text) => {
                  const WorkStatusMap = {
                    1: '在职',
                    2: '离职',
                    3: '转正',
                    4: '未处理',
                    5: '未知',
                    6: '自离'
                  };
                  return WorkStatusMap[text] || '';
                }
              },
              {
                title: '审核状态',
                dataIndex: 'TrgtSpAuditSts'
              },
              {
                title: '审核备注',
                dataIndex: 'AuditRemark'
              }
            ],
            attendanceColumnsType: 'old',
            weekSalaryColumnsType: 'old',
            monthSalaryColumnsType: 'old',
            cardInfoType: 'old'

        };
    }

    componentWillMount() {
      this.getOldZXXDataByType(this.props.tabName);
    }

    componentDidUpdate(prevProps) {
      if ((prevProps.tabName !== this.props.tabName) || (prevProps.recordType !== this.props.recordType)) {
        this.props.recordType === 'old' ? this.getOldZXXDataByType(this.props.tabName) : this.getNewZXXDataByType(this.props.tabName);
      }
    }

    handleTabChange = (key) => {
      this.props.onChange(key, this.props.recordType);
    }

    getOldZXXDataByType(type, page = 1, pageSize = 20) {
      const { userInfo } = this.props;
      const timestamp = Math.round(new Date().getTime() / 1000);

      switch (type) {
        case 'cards-tab':
          MemberDetailService.getMemberZxxCardsInfo({
            action: 'GetMemberCardStatus',
            IDCardNum: userInfo.IDCardNum,
            Timespan: timestamp,
            Sign: hex_md5(timestamp + '_@wobao20161209*')
          }).then((res) => {
            if (res.Code === 200) {
              this.setState({
                cardsInfo: {
                  BankCard: res.BankCard,
                  IDCard: res.IDCard,
                  WorkCard: res.WorkCard
                },
                cardInfoType: 'old'
              });
            } else {
              this.setState({
                cardsInfo: {},
                cardInfoType: 'old'
              });
              res.Message.indexOf('用户信息不存在') === -1 && message.error(res.Message || '获取周薪薪数据失败，请稍后尝试');
            }
          }).catch((err) => {
            console.log(err);
            this.setState({
              cardsInfo: {},
              cardInfoType: 'old'
            });
            err.Message.indexOf('用户信息不存在') === -1 && message.error(err.Message || '获取周薪薪数据失败，请稍后尝试');
          });
          break;
        case 'attendance-tab':
          MemberDetailService.getMemberZxxRecordData({
            action: "GetAttendanceList",
            q: Math.floor(Math.random() * 9999) + Math.random(),
            Page: 1,
            MemberName: userInfo.Name,
            MemberMobile: userInfo.Phone,
            IDCardNum: userInfo.IDCardNum,
            Timespan: timestamp,
            Sign: hex_md5(timestamp + '_@wobao20161209*')
          }).then((res) => {
            if (res.Code === 200) {
              this.setState({
                attendanceData: {
                  total: res.total,
                  rows: res.rows || [],
                  rowsMap: (res.rows || []).reduce((wrap, cur) => {
                    wrap[cur.CreatedDate] = {
                      ...cur,
                      attendanceStatus: cur.ToWorkTime !== '' && cur.OffWorkTime !== '' ? '卡' : (cur.ToWorkTime !== '' ? '上' : (cur.OffWorkTime !== '' ? '下' : ''))
                    };
                    return wrap;
                  }, {}),
                  page,
                  pageSize
                },
                attendanceColumnsType: 'old'
              });
            } else {
              this.setState({
                attendanceData: {
                  total: 0,
                  rows: [],
                  rowsMap: {},
                  page,
                  pageSize
                },
                attendanceColumnsType: 'old'
              });
              res.Message.indexOf('用户信息不存在') === -1 && message.error(res.Message || '获取周薪薪数据失败，请稍后尝试');
            }
          }).catch((err) => {
            console.log(err);
            this.setState({
              attendanceData: {
                total: 0,
                rows: [],
                rowsMap: {},
                page,
                pageSize
              },
              attendanceColumnsType: 'old'
            });
            err.Message.indexOf('用户信息不存在') === -1 && message.error(err.Message || '获取周薪薪数据失败，请稍后尝试');
          });
          break;
        case 'week-salary-tab':
          MemberDetailService.getMemberZxxRecordData({
            action: "GetWeekWageList",
            q: Math.floor(Math.random() * 9999) + Math.random(),
            Page: 1,
            MemberName: userInfo.Name,
            MemberMobile: userInfo.Phone,
            IDCardNum: userInfo.IDCardNum,
            Timespan: timestamp,
            Sign: hex_md5(timestamp + '_@wobao20161209*')
          }).then((res) => {
            if (res.Code === 200) {
              this.setState({
                weekSalaryData: {
                  total: res.total,
                  rows: res.rows || [],
                  page,
                  pageSize
                },
                weekSalaryColumnsType: 'old'
              });
            } else {
              this.setState({
                weekSalaryData: {
                  total: 0,
                  rows: [],
                  page,
                  pageSize
                },
                weekSalaryColumnsType: 'old'
              });
            }
          }).catch((err) => {
            console.log(err);
            this.setState({
              weekSalaryData: {
                total: 0,
                rows: [],
                page,
                pageSize
              },
              weekSalaryColumnsType: 'old'
            });
          });
          break;
        case 'month-salary-tab':
          MemberDetailService.getMemberZxxRecordData({
            action: "GetMonthWageList",
            q: Math.floor(Math.random() * 9999) + Math.random(),
            Page: 1,
            MemberName: userInfo.Name,
            MemberMobile: userInfo.Phone,
            IDCardNum: userInfo.IDCardNum,
            Timespan: timestamp,
            Sign: hex_md5(timestamp + '_@wobao20161209*')
          }).then((res) => {
            if (res.Code === 200) {
              this.setState({
                monthSalaryData: {
                  total: res.total,
                  rows: res.rows || [],
                  page,
                  pageSize
                },
                monthSalaryColumnsType: 'old'
              });
            } else {
              this.setState({
                monthSalaryData: {
                  total: 0,
                  rows: [],
                  page,
                  pageSize
                },
                monthSalaryColumnsType: 'old'
              });
            }
          }).catch((err) => {
            console.log(err);
            this.setState({
              monthSalaryData: {
                total: 0,
                rows: [],
                page,
                pageSize
              },
              monthSalaryColumnsType: 'old'
            });
          });
          break;
      }
    }

    handleTableChange = (pagination, tabName, columnsType) => {
      if (columnsType === 'old') {
        this.getOldZXXDataByType(tabName, pagination.current, pagination.pageSize);
      } else {
        this.getNewZXXDataByType(tabName, pagination.current, pagination.pageSize);
      }
    }

    getNewZXXDataByType = (type, page = 1, pageSize = 20) => {
      const {
        userInfo
      } = this.props;

      const {
        attendanceData,
        weekSalaryData,
        monthSalaryData
      } = this.state;

      switch (type) {
        case 'cards-tab':
          MemberDetailService.getNewZxxTriCardData({
            IdCardNum: userInfo.IDCardNum
          }).then((res) => {
            if (res.Code === 0) {
              this.setState({
                newCardsInfo: res.Data || {},
                cardInfoType: 'new'
              });
            } else {
              this.setState({
                newCardsInfo: {},
                cardInfoType: 'new'
              });
              res.Desc.indexOf('输入参数错误') === -1 && message.error(res.Desc || '获取周薪薪数据失败，请稍后尝试');
            }
          }).catch((err) => {
            console.log(err);
            err.Desc.indexOf('输入参数错误') === -1 && message.error(err.Desc || '获取周薪薪数据失败，请稍后尝试');
            this.setState({
              newCardsInfo: {},
              cardInfoType: 'new'
            });
          });
          break;
        case 'attendance-tab':
          MemberDetailService.getNewZxxCheckInData({
            IDCardNum: userInfo.IDCardNum,
            RecordIndex: (page - 1) * pageSize,
            RecordSize: attendanceData.pageSize
          }).then((res) => {
            if (res.Code === 0) {
              this.setState({
                attendanceData: {
                  page,
                  pageSize,
                  rowsMap: ((res.Data || {}).RecordList || []).reduce((wrap, cur) => {
                    wrap[cur.ClockDt] = {
                      ...cur,
                      attendanceStatus: cur.ClockInTm !== '' && cur.ClockOutTm !== '' ? '卡' : (cur.ClockInTm !== '' ? '上' : (cur.ClockOutTm !== '' ? '下' : ''))
                    };
                    return wrap;
                  }, {}),
                  total: (res.Data || {}).RecordCount || 0,
                  rows: (res.Data || {}).RecordList || []
                },
                attendanceColumnsType: 'new'
              });
            } else {
              this.setState({
                attendanceData: {
                  page: 1,
                  pageSize: 20,
                  total: 0,
                  rows: [],
                  rowsMap: {}
                },
                attendanceColumnsType: 'new'
              });
              res.Desc.indexOf('输入参数错误') === -1 && message.error(res.Desc || '获取周薪薪数据失败，请稍后尝试');
            }
          }).catch((err) => {
            console.log(err);
            this.setState({
              attendanceData: {
                page: 1,
                pageSize: 20,
                total: 0,
                rows: [],
                rowsMap: {}
              },
              attendanceColumnsType: 'new'
            });
            err.Desc.indexOf('输入参数错误') === -1 && message.error(err.Desc || '获取周薪薪数据失败，请稍后尝试');
          });
          break;
        case 'week-salary-tab':
          MemberDetailService.getNewZxxWeekSalaryData({
            IDCardNum: userInfo.IDCardNum,
            RecordIndex: (page - 1) * pageSize,
            RecordSize: weekSalaryData.pageSize
          }).then((res) => {
            if (res.Code === 0) {
              this.setState({
                weekSalaryData: {
                  page,
                  pageSize,
                  total: (res.Data || {}).RecordCount || 0,
                  rows: (res.Data || {}).RecordList || []
                },
                weekSalaryColumnsType: 'new'
              });
            } else {
              this.setState({
                weekSalaryData: {
                  page: 1,
                  pageSize: 20,
                  total: 0,
                  rows: []
                },
                weekSalaryColumnsType: 'new'
              });
            }
          }).catch((err) => {
            console.log(err);
            this.setState({
              weekSalaryData: {
                page: 1,
                pageSize: 20,
                total: 0,
                rows: []
              },
              weekSalaryColumnsType: 'new'
            });
          });
          break;
        case 'month-salary-tab':
          MemberDetailService.getNewZxxMonthSalaryData({
            IDCardNum: userInfo.IDCardNum,
            RecordIndex: (page - 1) * pageSize,
            RecordSize: monthSalaryData.pageSize
          }).then((res) => {
            if (res.Code === 0) {
              this.setState({
                monthSalaryData: {
                  page,
                  pageSize,
                  total: (res.Data || {}).RecordCount || 0,
                  rows: (res.Data || {}).RecordList || []
                },
                monthSalaryColumnsType: 'new'
              });
            } else {
              this.setState({
                monthSalaryData: {
                  page: 1,
                  pageSize: 20,
                  total: 0,
                  rows: []
                },
                monthSalaryColumnsType: 'new'
              });
            }
          }).catch((err) => {
            console.log(err);
            this.setState({
              monthSalaryData: {
                page: 1,
                pageSize: 20,
                total: 0,
                rows: []
              },
              monthSalaryColumnsType: 'new'
            });
          });
          break;
      }
    }

    handleSwitchZXXType = (e) => {
      const value = e.target.value;
      this.props.onChange(this.props.tabName, value);
    }

    handleHideModal = () => {
      this.setState({
        attendanceModalVisible: false
      });
    }

    renderDayContent = ({date, view}) => {
      const {
        attendanceData: {
          rowsMap
        },
        attendanceColumnsType
      } = this.state;

      const currentForamtDate = moment(date).format('YYYY-MM-DD');
      const currentDateAttendance = rowsMap[currentForamtDate];

      if (attendanceColumnsType === 'old') {
        return (
          <div className="day-item">
            <div className="flex flex--between day-item__hd">
              <div>
                <span>{date.getDate()}</span>
                <span className="day-status">{currentDateAttendance ? currentDateAttendance.attendanceStatus : ''}</span>
              </div>
            </div>
            <div className="day-enterprise mt-8">{currentDateAttendance ? currentDateAttendance.EnterpriseName : ''}</div>
          </div>
        );
      } else {
        return (
          <div className="day-item">
            <div className="flex flex--between day-item__hd">
              <div>
                <span>{date.getDate()}</span>
                <span className="day-status">{currentDateAttendance ? currentDateAttendance.attendanceStatus : ''}</span>
              </div>
              <span className="day-amount">{currentDateAttendance ? parseFloat(currentDateAttendance.Amount / 100).toFixed(2) : ''}</span>
            </div>
            <div className="day-enterprise mt-8">{currentDateAttendance ? currentDateAttendance.EntName : ''}</div>
          </div>
        );  
      }

    }

    handleOnClickDay = (value) => {
      const {
        attendanceData: {
          rowsMap
        }
      } = this.state;

      const currentForamtDate = moment(value).format('YYYY-MM-DD');
      const currentDateAttendance = rowsMap[currentForamtDate];

      if(currentDateAttendance) {
        this.setState({
          attendanceModalVisible: true,
          currentDateAttendance
        });
      }
    }

    getAttendanceSteps = (currentDateAttendance, attendanceColumnsType) => {
      return {
        to: {
          title: currentDateAttendance.attendanceStatus === '卡' || currentDateAttendance.attendanceStatus === '上' ? <div>已打卡<span>（{moment(attendanceColumnsType === 'old' ? currentDateAttendance.ToWorkTime : currentDateAttendance.ClockInTm).format('YYYY.MM.DD HH:mm')}）</span></div> : <div>缺卡</div>,
          desc: (attendanceColumnsType === 'old' ? currentDateAttendance.Address : currentDateAttendance.ClockInAddr) !== '' ? <div><Icon type="environment" className="mr-5" />{attendanceColumnsType === 'old' ? currentDateAttendance.Address : currentDateAttendance.ClockInAddr}</div> : ''
        },
        off: {
          title: currentDateAttendance.attendanceStatus === '卡' || currentDateAttendance.attendanceStatus === '下' ? <div>已打卡<span>（{moment(attendanceColumnsType === 'old' ? currentDateAttendance.OffWorkTime : currentDateAttendance.ClockOutTm).format('YYYY.MM.DD HH:mm')}）</span></div> : <div>缺卡</div>,
          desc: (attendanceColumnsType === 'old' ? currentDateAttendance.Address2 : currentDateAttendance.ClockOutAddr) !== '' ? <div><Icon type="environment" className="mr-5" />{attendanceColumnsType === 'old' ? currentDateAttendance.Address2 : currentDateAttendance.ClockOutAddr}</div> : ''
        }
      };
    }

    render() {
        const {
          tabName,
          recordType
        } = this.props;
        const {
          cardsInfo,
          newCardsInfo,
          attendanceData,
          weekSalaryData,
          monthSalaryData,
          attendanceColumnsType,
          weekSalaryColumnsType,
          monthSalaryColumnsType,
          cardInfoType,
          oldAttendanceColumns,
          newAttendanceColumns,
          oldWeekSalaryColumns,
          newWeekSalaryColumns,
          oldMonthSalaryColumns,
          newMonthSalaryColumns,
          cardAuditStatusMap,
          attendanceModalVisible,
          currentDateAttendance
        } = this.state;

        const extraButton = (
          <div>
            <RadioGroup onChange={this.handleSwitchZXXType} value={recordType} className="custom-radio-group">
              <RadioButton value="old">
                <i className={classnames('icon', {
                  'icon-zxx': recordType === 'new',
                  'icon-zxx-active': recordType === 'old'
                })}></i>
              </RadioButton>
              <RadioButton value="new">
                <i className={classnames('icon', {
                  'icon-oldbro': recordType === 'old',
                  'icon-oldbro-active': recordType === 'new'
                })}></i>
              </RadioButton>
            </RadioGroup>
          </div>
        );

        const attendanceModalTitle = (
          <div className="flex attendance-modal-title">
            <div>
              <Icon type="clock-circle" />  
            </div>
            <div className="ml-16">
              <h3>{attendanceColumnsType === 'old' ? (currentDateAttendance.EnterpriseName || '') : (currentDateAttendance.EntName || '')}</h3>
              <div className="mt-14">
                <p>{attendanceColumnsType === 'old' ? (currentDateAttendance.WorkCardNum !== '' ? `工号：${currentDateAttendance.WorkCardNum}` : '') : (currentDateAttendance.WorkCardNo !== '' ? `工号：${currentDateAttendance.WorkCardNo}` : '')}</p>
                <p>{Object.keys(currentDateAttendance).length ? (attendanceColumnsType === 'old' ? moment(currentDateAttendance.CreatedDate).format('M月DD日') : moment(currentDateAttendance.ClockDt).format('M月DD日')) : ''}打卡<span>{currentDateAttendance.attendanceStatus === '卡' ? 2 : (currentDateAttendance.attendanceStatus === '上' || currentDateAttendance.attendanceStatus === '下' ? 1 : 0)}</span>次</p>
                <p>工时共计<span>{currentDateAttendance.attendanceStatus === '卡' ? (attendanceColumnsType === 'old' ? moment(currentDateAttendance.OffWorkTime).diff(currentDateAttendance.ToWorkTime, 'hours', true).toFixed(1) : moment(currentDateAttendance.ClockOutTm).diff(currentDateAttendance.ClockInTm, 'hours', true).toFixed(1)) : 0}</span>时</p>
                {attendanceColumnsType === 'new' ? <p>金额为<span>{parseFloat(currentDateAttendance.Amount / 100).toFixed(2)}</span>元 </p> : ''}
              </div>
            </div>
          </div>
        );

        const attendanceDetailSteps = this.getAttendanceSteps(currentDateAttendance, attendanceColumnsType);


        return (
          <Card bordered={false} bodyStyle={{ padding: '10px' }} className="card-tab-container">
            <div className="card-container" >
              <Tabs type="card" activeKey={tabName} onChange={this.handleTabChange} tabBarExtraContent={extraButton}>
                <TabPane tab="三卡" key="cards-tab">
                  <div style={{ background: '#ECECEC', padding: '16px' }}>
                    {/* <Row gutter={16}>
                      <Col span={8}>
                        <Card bodyStyle={{ padding: 0 }} className="member-card-info">
                          <div>
                            <img className="img-fluid" src="http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/mams_idcard.png" />
                          </div>
                          {cardInfoType === 'old' ? (
                            <div className="member-card-info__bd flex flex--center">
                              {Object.keys(cardsInfo).length && !!cardsInfo.IDCard && cardsInfo.IDCard.Flag ? (
                                <Icon type="check-circle-o" className="icon-passed" />
                              ) : (
                                <Icon type="close-circle-o" className="icon-unpassed" />
                              )}
                              <span>{Object.keys(cardsInfo).length && !!cardsInfo.IDCard && cardsInfo.IDCard.Flag ? '审核通过' : '审核未通过'}</span>
                            </div>
                          ) : (
                            <div className="member-card-info__bd flex flex--center">
                              {Object.keys(newCardsInfo).length && newCardsInfo.IDCardStatus === 2 ? (
                                <Icon type="check-circle-o" className="icon-passed" />
                              ) : (
                                Object.keys(newCardsInfo).length && newCardsInfo.IDCardStatus !== 0 ? (
                                  <Icon type="close-circle-o" className="icon-unpassed" />
                                ) : ''
                              )}
                              <span>{Object.keys(newCardsInfo).length ? cardAuditStatusMap[newCardsInfo.IDCardStatus] : '无记录'}</span>
                            </div>
                          )}
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card bodyStyle={{ padding: 0 }} className="member-card-info">
                          <div>
                            <img className="img-fluid" src="http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/mams_bankcard.png" />
                          </div>
                          {cardInfoType === 'old' ? (
                            <div className="member-card-info__bd flex flex--center">
                              {Object.keys(cardsInfo).length && !!cardsInfo.BankCard && cardsInfo.BankCard.Flag ? (
                                <Icon type="check-circle-o" className="icon-passed" />
                              ) : (
                                <Icon type="close-circle-o" className="icon-unpassed" />
                              )}
                              <span>{Object.keys(cardsInfo).length && !!cardsInfo.BankCard && cardsInfo.BankCard.Flag ? '审核通过' : '审核未通过'}</span>
                            </div>
                          ) : (
                            <div className="member-card-info__bd flex flex--center">
                              {Object.keys(newCardsInfo).length && newCardsInfo.BankCardStatus === 2 ? (
                                <Icon type="check-circle-o" className="icon-passed" />
                              ) : (
                                Object.keys(newCardsInfo).length && newCardsInfo.BankCardStatus !== 0 ? (
                                  <Icon type="close-circle-o" className="icon-unpassed" />
                                ) : ''
                              )}
                              <span>{Object.keys(newCardsInfo).length ? cardAuditStatusMap[newCardsInfo.BankCardStatus] : '无记录'}</span>
                            </div>
                          )}
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card bodyStyle={{ padding: 0 }} className="member-card-info">
                          <div>
                            <img className="img-fluid" src="http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/mams_workcard.png" />
                          </div>
                          {cardInfoType === 'old' ? (
                            <div className="member-card-info__bd flex flex--center">
                              {Object.keys(cardsInfo).length && !!cardsInfo.WorkCard && cardsInfo.WorkCard.Flag ? (
                                <Icon type="check-circle-o" className="icon-passed" />
                              ) : (
                                <Icon type="close-circle-o" className="icon-unpassed" />
                              )}
                              <span>{Object.keys(cardsInfo).length && !!cardsInfo.WorkCard && cardsInfo.WorkCard.Flag ? '审核通过' : '审核未通过'}</span>
                            </div>
                          ) : (
                            <div className="member-card-info__bd flex flex--center">
                              {Object.keys(newCardsInfo).length && newCardsInfo.WorkCardStatus === 2 ? (
                                <Icon type="check-circle-o" className="icon-passed" />
                              ) : (
                                Object.keys(newCardsInfo).length && newCardsInfo.WorkCardStatus !== 0 ? (
                                  <Icon type="close-circle-o" className="icon-unpassed" />
                                ) : ''
                              )}
                              <span>{Object.keys(newCardsInfo).length ? cardAuditStatusMap[newCardsInfo.WorkCardStatus] : '无记录'}</span>
                            </div>
                          )}
                        </Card>
                      </Col>
                    </Row>
                     */}
                    <Row gutter={16}>
                      <Col span={8}>
                        <Card bodyStyle={{ padding: 0 }}>
                          <div className="flex flex--center member-card-info">
                            {cardInfoType === 'old' ? (
                              <div className="flex flex--y-center">
                                {Object.keys(cardsInfo).length && !!cardsInfo.IDCard && cardsInfo.IDCard.Flag ? (
                                  <Icon type="check-circle-o" />
                                ) : (
                                  <Icon type="close-circle-o" />
                                )}
                                <div>
                                  <div className={classnames('text-status', {
                                    'text-status--fail': !(Object.keys(cardsInfo).length && !!cardsInfo.IDCard && cardsInfo.IDCard.Flag),
                                    'text-status--success': Object.keys(cardsInfo).length && !!cardsInfo.IDCard && cardsInfo.IDCard.Flag
                                  })}>{Object.keys(cardsInfo).length && !!cardsInfo.IDCard && cardsInfo.IDCard.Flag ? '审核通过' : '审核未通过'}</div>
                                  <div>身份证</div>
                                </div>
                              </div>
                              
                            ) : (
                              <div className="flex flex--y-center">
                                {Object.keys(newCardsInfo).length && newCardsInfo.IDCardStatus === 2 ? <Icon type="check-circle-o" /> : ''}
                                {Object.keys(newCardsInfo).length && newCardsInfo.IDCardStatus === 3 ? <Icon type="close-circle-o" /> : ''}
                                {Object.keys(newCardsInfo).length && (newCardsInfo.IDCardStatus !== 3 && newCardsInfo.IDCardStatus !== 2) ? <Icon type="exclamation-circle-o" /> : ''}
                                <div>
                                  <div className="text-status" className={classnames('text-status', {
                                    'text-status--fail': Object.keys(newCardsInfo).length && newCardsInfo.IDCardStatus === 3,
                                    'text-status--success': Object.keys(newCardsInfo).length && newCardsInfo.IDCardStatus === 2,
                                    'text-status--before': Object.keys(newCardsInfo).length && newCardsInfo.IDCardStatus !== 3 && newCardsInfo.IDCardStatus !== 2
                                  })}>{Object.keys(newCardsInfo).length ? cardAuditStatusMap[newCardsInfo.IDCardStatus] : '无记录'}</div>
                                  <div>身份证</div>
                                </div>
                              </div>
                            )}
                            <div>
                              <img className="img-fluid" src="http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/imgs/mams_idcard.png" />
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card bodyStyle={{ padding: 0 }}>
                          <div className="flex flex--center member-card-info">
                            {cardInfoType === 'old' ? (
                              <div className="flex flex--y-center">
                                {Object.keys(cardsInfo).length && !!cardsInfo.BankCard && cardsInfo.BankCard.Flag ? (
                                  <Icon type="check-circle-o" />
                                ) : (
                                  <Icon type="close-circle-o" />
                                )}
                                <div>
                                  <div className={classnames('text-status', {
                                    'text-status--fail': !(Object.keys(cardsInfo).length && !!cardsInfo.BankCard && cardsInfo.BankCard.Flag),
                                    'text-status--success': Object.keys(cardsInfo).length && !!cardsInfo.BankCard && cardsInfo.BankCard.Flag
                                  })}>{Object.keys(cardsInfo).length && !!cardsInfo.BankCard && cardsInfo.BankCard.Flag ? '审核通过' : '审核未通过'}</div>
                                  <div>银行卡</div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex--y-center">
                                {Object.keys(newCardsInfo).length && newCardsInfo.BankCardStatus === 2 ? <Icon type="check-circle-o" /> : ''}
                                {Object.keys(newCardsInfo).length && newCardsInfo.BankCardStatus === 3 ? <Icon type="close-circle-o" /> : ''}
                                {Object.keys(newCardsInfo).length && (newCardsInfo.BankCardStatus !== 3 && newCardsInfo.BankCardStatus !== 2) ? <Icon type="exclamation-circle-o" /> : ''}
                                <div>
                                  <div className="text-status" className={classnames('text-status', {
                                    'text-status--fail': Object.keys(newCardsInfo).length && newCardsInfo.BankCardStatus === 3,
                                    'text-status--success': Object.keys(newCardsInfo).length && newCardsInfo.BankCardStatus === 2,
                                    'text-status--before': Object.keys(newCardsInfo).length && newCardsInfo.BankCardStatus !== 3 && newCardsInfo.BankCardStatus !== 2
                                  })}>{Object.keys(newCardsInfo).length ? cardAuditStatusMap[newCardsInfo.BankCardStatus] : '无记录'}</div>
                                  <div>银行卡</div>
                                </div>
                              </div>
                            )}
                            <div>
                              <img className="img-fluid" src="http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/imgs/mams_bankcard.png" />
                            </div>
                          </div> 
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card bodyStyle={{ padding: 0 }}>
                          <div className="flex flex--center member-card-info">
                            {cardInfoType === 'old' ? (
                              <div className="flex flex--y-center">
                                {Object.keys(cardsInfo).length && !!cardsInfo.WorkCard && cardsInfo.WorkCard.Flag ? (
                                  <Icon type="check-circle-o" />
                                ) : (
                                  <Icon type="close-circle-o" />
                                )}
                                <div>
                                  <div className={classnames('text-status', {
                                    'text-status--fail': !(Object.keys(cardsInfo).length && !!cardsInfo.WorkCard && cardsInfo.WorkCard.Flag),
                                    'text-status--success': Object.keys(cardsInfo).length && !!cardsInfo.WorkCard && cardsInfo.WorkCard.Flag
                                  })}>{Object.keys(cardsInfo).length && !!cardsInfo.WorkCard && cardsInfo.WorkCard.Flag ? '审核通过' : '审核未通过'}</div>
                                  <div>工牌</div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex--y-center">
                                {Object.keys(newCardsInfo).length && newCardsInfo.WorkCardStatus === 2 ? <Icon type="check-circle-o" /> : ''}
                                {Object.keys(newCardsInfo).length && newCardsInfo.WorkCardStatus === 3 ? <Icon type="close-circle-o" /> : ''}
                                {Object.keys(newCardsInfo).length && (newCardsInfo.WorkCardStatus !== 3 && newCardsInfo.WorkCardStatus !== 2) ? <Icon type="exclamation-circle-o" /> : ''}
                                <div>
                                  <div className="text-status" className={classnames('text-status', {
                                    'text-status--fail': Object.keys(newCardsInfo).length && newCardsInfo.WorkCardStatus === 3,
                                    'text-status--success': Object.keys(newCardsInfo).length && newCardsInfo.WorkCardStatus === 2,
                                    'text-status--before': Object.keys(newCardsInfo).length && newCardsInfo.WorkCardStatus !== 3 && newCardsInfo.WorkCardStatus !== 2
                                  })}>{Object.keys(newCardsInfo).length ? cardAuditStatusMap[newCardsInfo.WorkCardStatus] : '无记录'}</div>
                                  <div>工牌</div>
                                </div>
                              </div>
                            )}
                            <div>
                              <img className="img-fluid" src="http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/imgs/mams_workcard.png" />
                            </div>
                          </div> 
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tab="打卡记录" key="attendance-tab">
                  <div>
                    <div className="attendance-calendar-wrapper">
                      <Calendar
                        className="attendance-calendar"
                        maxDate={new Date(moment().endOf('month').format('YYYY-MM-DD'))}
                        value={new Date()}
                        calendarType="US"
                        minDetail="month"
                        maxDetail="month"
                        nextLabel={<Icon type="caret-right" />}
                        prevLabel={<Icon type="caret-left" />}
                        tileContent={this.renderDayContent}
                        onClickDay={this.handleOnClickDay}
                      />
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="周薪记录" key="week-salary-tab">
                  <Table
                      rowKey={(record, index) => `${index}`}
                      dataSource={weekSalaryData.rows}
                      onChange={(pagination) => this.handleTableChange(pagination, 'week-salary-tab', weekSalaryColumnsType)}
                      pagination={{
                        total: weekSalaryData.total,
                        current: weekSalaryData.page,
                        pageSize: weekSalaryData.pageSize,
                        showTotal: (total, range) => {
                            return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                        },
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '40', '80']
                      }}
                      columns={weekSalaryColumnsType === 'old' ? oldWeekSalaryColumns : newWeekSalaryColumns}
                      bordered>
                  </Table>
                </TabPane>
                <TabPane tab="月薪记录" key="month-salary-tab">
                  <Table
                      rowKey={(record, index) => `${index}`}
                      dataSource={monthSalaryData.rows}
                      onChange={(pagination) => this.handleTableChange(pagination, 'month-salary-tab', monthSalaryColumnsType)}
                      pagination={{
                        total: monthSalaryData.total,
                        current: monthSalaryData.page,
                        pageSize: monthSalaryData.pageSize,
                        showTotal: (total, range) => {
                            return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                        },
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '40', '80']
                      }}
                      columns={monthSalaryColumnsType === 'old' ? oldMonthSalaryColumns : newMonthSalaryColumns}
                      bordered>
                  </Table>
                </TabPane>
              </Tabs>

              <Modal
                width={290}
                className="attendance-modal"
                wrapClassName="vertical-center-modal"
                footer={null}
                visible={attendanceModalVisible}
                title={attendanceModalTitle}
                onCancel={this.handleHideModal}
              >
                <Steps direction="vertical" className="attendance-modal-detail">
                  <Step status="wait" title={attendanceDetailSteps.to.title} description={attendanceDetailSteps.to.desc} icon={<span>上</span>} />
                  <Step className="mt-20" status="wait" title={attendanceDetailSteps.off.title} description={attendanceDetailSteps.off.desc} icon={<span>下</span>} />
                </Steps>
              </Modal>
            </div>
          </Card>
        );
    }
}

export default BlockDetailZXX;
