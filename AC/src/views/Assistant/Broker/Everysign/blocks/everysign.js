import React from 'react';
import {Row, Col, Button, Table, Form, Input, DatePicker, Select, Cascader, message} from 'antd';
import setParams from "ACTION/setParams";
import moment from 'moment';
import {browserHistory} from 'react-router';
import {getAuthority} from 'CONFIG/DGAuthority';
import everysignTo from "ACTION/Common/Assistance/Everysign";
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import EverysignService from 'SERVICE/Assistant/EverysignService';

// import answers from "ACTION/Broker/Question/answer";
// import "LESS/pages/question.less";

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;

 class Everysign extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_ac_everysign';
        this.auth = getAuthority();
        this.ID = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
        this.state = {
            flag: false,
            columns: [{
                title: '工号',
                dataIndex: 'BrokerAccount',
                width: 45,
                fixed: 'left',
                render: (text, record) => text
              }, {
                title: '昵称',
                width: 60,
                dataIndex: 'BrokerNickName',
                fixed: 'left'
              }, {
                title: '部门',  
                width: 80,
                dataIndex: 'DepartName',
                fixed: 'left'
              }, {
                title: '队名',
                fixed: 'left',
                width: 80,
                dataIndex: 'GroupName'
              }, {
                title: '段位',
                width: 45,
                dataIndex: 'RankName',
                fixed: 'left'
              }, {
                title: '达标数',
                fixed: 'left',
                width: 65,
                dataIndex: 'DailyEntryCount'
              }, {
                title: '面试总数',
                width: 70,
                fixed: 'left',
                dataIndex: 'TotalInterviewCount'
              }, {
                title: '排名',
                width: 45,
                fixed: 'left',
                dataIndex: 'InterviewCountRank'
              }, 
              {
                title: '日期', 
                children: [
                  {
                    title: '1',
                    key: '1',
                    render: (text, record) =><div style={record['DayRecordList'][0] ? record['DayRecordList'][0]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][0] ? record['DayRecordList'][0]['InterviewCount'] : ''}</div>
                  }, {
                    title: '2',
                    key: '2',
                    render: (text, record) =><div style={record['DayRecordList'][1] ? record['DayRecordList'][1]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][1] ? record['DayRecordList'][1]['InterviewCount'] : ''}</div>
                  }, {
                    title: '3',
                    key: '3',
                    render: (text, record) =><div style={record['DayRecordList'][2] ? record['DayRecordList'][2]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][2] ? record['DayRecordList'][2]['InterviewCount'] : ''}</div>
                  }, {
                    title: '4',
                    key: '4',
                    render: (text, record) =><div style={record['DayRecordList'][3] ? record['DayRecordList'][3]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][3] ? record['DayRecordList'][3]['InterviewCount'] : ''}</div>
                  }, {
                    title: '5',
                    key: '5',
                    render: (text, record) =><div style={record['DayRecordList'][4] ? record['DayRecordList'][4]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][4] ? record['DayRecordList'][4]['InterviewCount'] : ''}</div>
                  }, {
                    title: '6',
                    key: '6',
                    render: (text, record) =><div style={record['DayRecordList'][5] ? record['DayRecordList'][5]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][5] ? record['DayRecordList'][5]['InterviewCount'] : ''}</div>
                  }, {
                    title: '7',
                    key: '7',
                    render: (text, record) =><div style={record['DayRecordList'][6] ? record['DayRecordList'][6]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][6] ? record['DayRecordList'][6]['InterviewCount'] : ''}</div>
                  }, {
                    title: '8',
                    key: '8',
                    render: (text, record) =><div style={record['DayRecordList'][7] ? record['DayRecordList'][7]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][7] ? record['DayRecordList'][7]['InterviewCount'] : ''}</div>
                  }, {
                    title: '9',
                    key: '9',
                    render: (text, record) =><div style={record['DayRecordList'][8] ? record['DayRecordList'][8]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][8] ? record['DayRecordList'][8]['InterviewCount'] : ''}</div>
                  }, {
                    title: '10',
                    key: '10',
                    render: (text, record) =><div style={record['DayRecordList'][9] ? record['DayRecordList'][9]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][9] ? record['DayRecordList'][9]['InterviewCount'] : ''}</div>
                  }, {
                    title: '11',
                    key: '11',
                    render: (text, record) =><div style={record['DayRecordList'][10] ? record['DayRecordList'][10]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][10] ? record['DayRecordList'][10]['InterviewCount'] : ''}</div>
                  }, {
                    title: '12',
                    key: '12',
                    render: (text, record) =><div style={record['DayRecordList'][11] ? record['DayRecordList'][11]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][11] ? record['DayRecordList'][11]['InterviewCount'] : ''}</div>
                  }, {
                    title: '13',
                    key: '13',
                    render: (text, record) =><div style={record['DayRecordList'][12] ? record['DayRecordList'][12]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][12] ? record['DayRecordList'][12]['InterviewCount'] : ''}</div>
                  }, {
                    title: '14',
                    key: '14',
                    render: (text, record) =><div style={record['DayRecordList'][13] ? record['DayRecordList'][13]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][13] ? record['DayRecordList'][13]['InterviewCount'] : ''}</div>
                  }, {
                    title: '15',
                    key: '15',
                    render: (text, record) =><div style={record['DayRecordList'][14] ? record['DayRecordList'][14]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][14] ? record['DayRecordList'][14]['InterviewCount'] : ''}</div>
                  }, {
                    title: '16',
                    key: '16',
                    render: (text, record) =><div style={record['DayRecordList'][15] ? record['DayRecordList'][15]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][15] ? record['DayRecordList'][15]['InterviewCount'] : ''}</div>
                  }, {
                    title: '17',
                    key: '17',
                    render: (text, record) =><div style={record['DayRecordList'][16] ? record['DayRecordList'][16]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][16] ? record['DayRecordList'][16]['InterviewCount'] : ''}</div>
                  }, {
                    title: '18',
                    key: '18',
                    render: (text, record) =><div style={record['DayRecordList'][17] ? record['DayRecordList'][17]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][17] ? record['DayRecordList'][17]['InterviewCount'] : ''}</div>
                  }, {
                    title: '19',
                    key: '19',
                    render: (text, record) =><div style={record['DayRecordList'][18] ? record['DayRecordList'][18]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][18] ? record['DayRecordList'][18]['InterviewCount'] : ''}</div>
                  }, {
                    title: '20',
                    key: '20',
                    render: (text, record) =><div style={record['DayRecordList'][19] ? record['DayRecordList'][19]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][19] ? record['DayRecordList'][19]['InterviewCount'] : ''}</div>
                  }, {
                    title: '21',
                    key: '21',
                    render: (text, record) =><div style={record['DayRecordList'][20] ? record['DayRecordList'][20]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][20] ? record['DayRecordList'][20]['InterviewCount'] : ''}</div>
                  }, {
                    title: '22',
                    key: '22',
                    render: (text, record) =><div style={record['DayRecordList'][21] ? record['DayRecordList'][21]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][21] ? record['DayRecordList'][21]['InterviewCount'] : ''}</div>
                  }, {
                    title: '23',
                    key: '23',
                    render: (text, record) =><div style={record['DayRecordList'][22] ? record['DayRecordList'][22]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][22] ? record['DayRecordList'][22]['InterviewCount'] : ''}</div>
                  }, {
                    title: '24',
                    key: '24',
                    render: (text, record) =><div style={record['DayRecordList'][23] ? record['DayRecordList'][23]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][23] ? record['DayRecordList'][23]['InterviewCount'] : ''}</div>
                  }, {
                    title: '25',
                    key: '25',
                    render: (text, record) =><div style={record['DayRecordList'][24] ? record['DayRecordList'][24]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][24] ? record['DayRecordList'][24]['InterviewCount'] : ''}</div>
                  }, {
                    title: '26',
                    key: '26',
                    render: (text, record) =><div style={record['DayRecordList'][25] ? record['DayRecordList'][25]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][25] ? record['DayRecordList'][25]['InterviewCount'] : ''}</div>
                  }, {
                    title: '27',
                    key: '27',
                    render: (text, record) =><div style={record['DayRecordList'][26] ? record['DayRecordList'][26]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][26] ? record['DayRecordList'][26]['InterviewCount'] : ''}</div>
                  }, {
                    title: '28',
                    key: '28',
                    render: (text, record) =><div style={record['DayRecordList'][27] ? record['DayRecordList'][27]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][27] ? record['DayRecordList'][27]['InterviewCount'] : ''}</div>
                  }, {
                    title: '29',
                    key: '29',
                    render: (text, record) =><div style={record['DayRecordList'][28] ? record['DayRecordList'][28]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][28] ? record['DayRecordList'][28]['InterviewCount'] : ''}</div>
                  }, {
                    title: '30',
                    key: '30',
                    render: (text, record) =><div style={record['DayRecordList'][29] ? record['DayRecordList'][29]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][29] ? record['DayRecordList'][29]['InterviewCount'] : ''}</div>
                  }, {
                    title: '31',
                    key: '31',
                    render: (text, record) =><div style={record['DayRecordList'][30] ? record['DayRecordList'][30]['IsPassed'] == 0 ? {color: 'red'} : {} : {}}>{record['DayRecordList'][30] ? record['DayRecordList'][30]['InterviewCount'] : ''}</div>
                  }
                ]
              }
              
            ]
        };
    }
  
  startParams=(a)=> {
    let params = a || this.props.everysign;
        let go = {
          Date: params['Date'],
          DepartID: params['DepartID'],
          EmployeeID: this.ID,
          GroupID: params['GroupID'],
          RecordIndex: (params['currentPage'] - 1) * params['pageSize'],	
          RecordSize: params['pageSize']
        };
        everysignTo(go);
   }
    componentWillMount() {
        this.startParams();
        setParams(this.STATE_NAME, {EmployeeID: this.ID});
    }
    componentDidMount() {
      this.props.form.setFieldsValue({
        date: moment(this.props.everysign['Date'], 'YYYY-MM')
      });
    }
   
    componentWillReceiveProps(nextProps) {
        if((this.props.everysign.Date !== nextProps.everysign.Date) || (this.props.everysign.DepartID !== nextProps.everysign.DepartID) || (this.props.everysign.GroupID !== nextProps.everysign.GroupID) || (this.props.everysign.currentPage !== nextProps.everysign.currentPage) || (this.props.everysign.pageSize !== nextProps.everysign.pageSize)) {
             this.startParams(nextProps.everysign);
        }else{
            if(this.state.flag == true) {
                this.startParams(nextProps.everysign);
                this.setState({
                    flag: false
                });
            }
        }
    }
    handleSearch=(e)=> {
        e.preventDefault(); 
        this.props.form.validateFields((err, values) => {
            if(!err) {
                setParams(this.STATE_NAME, {
                    currentPage: 1,
                    Date: values['date'] ? moment(values['date']['_d']).format('YYYY-MM') : '',
                    DepartID: values['team'] ? values['team'][0] == -9999 ? 0 : values['team'][0] : 0,
                    GroupID: values['team'] ? values['team'][1] : 0
                });
                this.setState({
                   flag: true
                });
            }
        });
    }
    again=()=> {
        this.props.form.resetFields();
        this.props.form.setFieldsValue({
          date: moment(new Date(), 'YYYY-MM')
        });
    }

    handleExport = () => {
      const {
        Date,
        DepartID,
        EmployeeID,
        GroupID,
        pageSize,
        currentPage
      } = this.props.everysign;
      
  
      EverysignService.exportEverysign({
        EmployeeID,
        Date,
        DepartID,
        GroupID: GroupID == null ? 0 : GroupID,
        RecordSize: pageSize,
        RecordIndex: (currentPage - 1) * pageSize
      }).then((res) => {
        if (res.Code === 0) {
          message.success('导出成功');
          window.open(res.Data, '_blank');
        } else {
          message.error(res.Desc || '导出失败，请稍后尝试');
        }
      }).catch((err) => {
        message.error(err.Desc || '导出失败，请稍后尝试');
      });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const param = this.props.everysign;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 }
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 }
            }
          };
          const firstLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
              }
          };
        return (
            <div>
             <div className="ivy-page-title" style={{position: 'relative'}}>
                    <h1>经纪人每日面试统计数</h1>
                    {/* <span className="i-refresh" onClick={() => this.handleRefresh()}>
                        <Button type="primary" size="large">导出</Button>
                    </span> */}
                </div>
                <div style={{padding: '15px'}}>
                <div style={{background: 'white', padding: '10px'}} className='question'>
               <Form
                    onSubmit={this.handleSearch}
                    >
                    <Row gutter={24}>
                    <Col span={6}>
                        <FormItem label="日期" {...firstLayout}>
                           {getFieldDecorator("date", {
                            rules: []
                            })(
                                <MonthPicker placeholder="请选择" />
                            )}
                        </FormItem>
                    </Col>
                   
                    <Col span={6}>
                        <FormItem label="部门/组" {...formItemLayout}>
                           {getFieldDecorator("team", {
                            rules: []
                            })(
                              <Cascader
                                allowClear={true}
                                placeholder={'选择部门/组'}
                                changeOnSelect
                                options={this.auth.DGList || []}
                                >
                              </Cascader>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7} offset={3}>
                        <Button type="primary" size='large' style={{marginRight: '10px'}} htmlType="submit">搜索</Button>
                        <Button type="default" size='large' onClick={this.again}>重置</Button>
                        <Button style={{float: 'right'}} type="primary" onClick={this.handleExport}>导出</Button>

                    </Col>
                    </Row>
                </Form>
                    <Row>
                       <Table columns={this.state.columns}
                                bordered={true}
                                dataSource={this.props.everysign.RecordList}
                                pagination={{
                                  total: param['RecordCount'],
                                  pageSize: param['pageSize'],
                                  current: param['currentPage'],
                                  onChange: (page, pageSize) => {
                                      setParams(this.STATE_NAME, {currentPage: page});
                                  },
                                  onShowSizeChange: (current, size) => setParams(this.STATE_NAME, {pageSize: size, currentPage: current}),
                                  showSizeChanger: true,
                                  showQuickJumper: true,
                                  pageSizeOptions: ['40', '80', '120'],
                                  showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                          }}
                         scroll={{ x: 1900}}
                        >
                        </Table>
                    </Row>
               </div>
                </div>
            </div>
        );
    }
}
export default Form.create()(Everysign);
