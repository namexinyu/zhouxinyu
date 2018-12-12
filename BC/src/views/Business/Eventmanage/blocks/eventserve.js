import React from 'react';
import {Row, Col, Button, Table, Form, Input, Icon, DatePicker, Popconfirm, message, Modal, Select} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import {browserHistory} from 'react-router';
import getDayService from 'ACTION/Common/Management/eventserve';
import EventManagement from 'SERVICE/Business/Management/eventmanagement';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const { Column } = Table;


const STATE_NAME = 'state_mams_eventserve';

 class Eventserve extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: (this.props.dayServiceInfo.pageQueryParams.RecordIndex / this.props.dayServiceInfo.pageQueryParams.RecordSize) + 1,
            pageSize: 40
        };
    }
    skip=(a)=> {
        browserHistory.push({
            pathname: '/broker/event-management/detail',
            state: a
        });
    }
  startParams=()=> {
    // let params = this.props.query;
     let go = {
      
     };
     // eventquery(go);
   }
    componentWillMount() {
        this.startParams();
        this.fetchDailyService(this.props.dayServiceInfo.pageQueryParams);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.question == this.props.question) {
            this.setState({
                flag: true
            });
        }else{
            this.setState({
                flag: false
            });
        }
    }

    fetchDailyService = (queryParams = {}) => {
        const {
            UserName = {},
            ExpectedDate,
            RecordIndex,
            RecordSize
        } = queryParams;
    
        getDayService({
            QueryStartDate: ExpectedDate.value && ExpectedDate.value.length && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
            QueryEndDate: ExpectedDate.value && ExpectedDate.value.length && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
            DiplomatName: UserName.value || '',
            RecordIndex,
            RecordSize
        });
      }

    handleSearch=(e)=> {
        e.preventDefault();

        const {
            dayServiceInfo: {
              pageQueryParams
            }
          } = this.props;
      
          this.setState({
            page: 1,
            pageSize: pageQueryParams.RecordSize
          });
      
          setParams(STATE_NAME, {
            pageQueryParams: {
              ...pageQueryParams,
              RecordIndex: 0,
              RecordSize: pageQueryParams.RecordSize
            }
          });
      
          this.fetchDailyService({
              ...pageQueryParams,
              RecordIndex: 0,
              RecordSize: pageQueryParams.RecordSize
          });
        
    }

    handleTableChange = ({current, pageSize }) => {

        const {
          dayServiceInfo: {
            pageQueryParams
          }
        } = this.props;
    
        this.setState({
          page: current,
          pageSize: pageSize
        });
    
        setParams(STATE_NAME, {
          pageQueryParams: {
            ...pageQueryParams,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
          }
        });
    
        this.fetchDailyService({
            ...pageQueryParams,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        });
      }

    hideModal=()=> {
        this.startParams();
        this.setState({
            visible: false
        });
        message.success('修改成功！');
    }
    maby=(e)=>{
      this.setState({
        modify: e.target.value,
        length: e.target.value['length']
      });
    }
    again=()=> {
        this.props.form.resetFields();
    }
    againd=(a)=> {
       console.log(a);
    }

    handleExport = () => {
        const {
            UserName = {},
            ExpectedDate
        } = this.props.dayServiceInfo.pageQueryParams;

        EventManagement.exportDayService({
            QueryStartDate: ExpectedDate.value && ExpectedDate.value.length && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
            QueryEndDate: ExpectedDate.value && ExpectedDate.value.length && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
            DiplomatName: UserName.value || ''
        }).then((res) => {
            if (res.Code === 0) {
                message.success('导出成功');
                window.open(res.Data.Url, '_blank');
            } else {
                message.error(res.Desc || '出错了，请稍后尝试');
            }
        }).catch((err) => {
            message.error(err.Desc || '出错了，请稍后尝试');
        });
    }

    render() {
        const {
            form: {
                getFieldDecorator
            },
            dayServiceInfo: {
                dayServiceList,
                RecordCount
            }
        } = this.props;

        const {
            page,
            pageSize
        } = this.state;

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
            <div style={{padding: '15px'}}>
               <div style={{background: 'white', padding: '10px'}} className='question'>
               <Form>
                    <Row gutter={24}>
                    <Col span={8} >
                        <FormItem label="姓名" {...formItemLayout}>
                           {getFieldDecorator("UserName", {
                            rules: []
                            })(
                                <Input size="large" placeholder=""/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} >
                        <FormItem label="发布时间" {...formItemLayout}>
                           {getFieldDecorator("ExpectedDate", {
                            })(
                                <RangePicker style={{width: "100%"}}/> 
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <Button type="default" size='large' className="ml-20" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                        <Button type="default" size='large' className="ml-20" onClick={this.again}>重置</Button>
                        <Button type="default" size='large' style={{float: 'right'}} onClick={this.handleExport}>导出</Button>
                    </Col>
                    </Row>
                </Form>
                    <Row>
                       <Table
                            bordered={true}
                            rowKey={(record, index) => index}
                            dataSource={dayServiceList}
                            onChange={this.handleTableChange}
                            pagination={{
                                total: RecordCount,
                                defaultPageSize: pageSize,
                                defaultCurrent: page,
                                current: page,
                                pageSize: pageSize,
                                pageSizeOptions: ['40', '80', '120'],
                                showTotal: (total, range) => {
                                    return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                },
                                showSizeChanger: true,
                                showQuickJumper: true
                            }}
                        >
                            {/* <Column
                                title="日期"
                                dataIndex="Date"
                            /> */}
                            <Column
                                title="姓名"
                                dataIndex="DiplomatName"
                            />
                            <Column
                                title="事件分配数量"
                                dataIndex="DayDistribution"
                            />
                            <Column
                                title="事件完成数量"
                                dataIndex="DayDown"
                            />
                            <Column
                                title="用户体验官处理数量"
                                dataIndex="DayOtherDeal"
                            />
                            <Column
                                title="未评价数量"
                                dataIndex="DayNotEva"
                            />
                            <Column
                                title="点赞数量/百分比（%）"
                                dataIndex="DayGood"
                                render={(text, record) => {
                                    return `${text}(${record.DayGoodPercent}%)`;
                                }}
                            />
                            <Column
                                title="一般数量/百分比（%）"
                                dataIndex="DayGeneral"
                                render={(text, record) => {
                                    return `${text}(${record.DayGeneralPercent}%)`;
                                }}
                            />
                            <Column
                                title="差评数量/百分比（%）"
                                dataIndex="DayBad"
                                render={(text, record) => {
                                    return `${text}(${record.DayBadPercent}%)`;
                                }}
                            />
                            <Column
                                title="扣钱数量/百分比（%）"
                                dataIndex="DayForfeit"
                                render={(text, record) => {
                                    return `${text}(${record.DayForfeitPercent}%)`;
                                }}
                            />
                            <Column
                                title="平均处理时长（分钟）"
                                dataIndex="DayDonePerMin"
                                render={(text) => {
                                    return `${text}分钟`;
                                }}
                            />
                        </Table>
                    </Row>
               </div>
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
        const {
          UserName,
          ExpectedDate
        } = props.dayServiceInfo.pageQueryParams;
    
        return {
          UserName,
          ExpectedDate
        };
      },
      onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
          pageQueryParams: Object.assign({}, props.dayServiceInfo.pageQueryParams, fields)
        });
      }
})(Eventserve);
