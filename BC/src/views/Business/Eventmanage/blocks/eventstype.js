import React from 'react';
import {Row, Col, Button, Table, Form, Input, Icon, DatePicker, Popconfirm, message, Modal, Select} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import {browserHistory} from 'react-router';
import getDayEvent from 'ACTION/Common/Management/eventstype';
import EventTypeDetailModal from './EventTypeDetailModal';
import EventManagement from 'SERVICE/Business/Management/eventmanagement';

import { EventTypeMap } from "UTIL/constant";

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const { Column } = Table;

const {
    getEventTypeDetail,
    exportEventType
} = EventManagement;

const STATE_NAME = 'state_mams_eventstype';

 class Eventstype extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            detailModalVisible: false,
            eventTypeDetailData: [],
            page: (this.props.dayEventInfo.pageQueryParams.RecordIndex / this.props.dayEventInfo.pageQueryParams.RecordSize) + 1,
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
        this.fetchDailyEvent(this.props.dayEventInfo.pageQueryParams);
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

    componentDidUpdate(prevProps) {
        const antTbody = document.querySelector('.event-type-table .ant-table-tbody');
        // console.log(this.props.dayEventInfo.dayEventList);
        // console.log(this.props.dayEventInfo.dayEventTotal);
        

        if (this.props.dayEventInfo.dayEventList.length && antTbody.childNodes.length && !document.querySelector('.stats-row')) {
          const statsElement = `<tr class="stats-row">
            <td>${this.props.dayEventInfo.dayEventTotal.EventTypeName}</td>
            <td>${this.props.dayEventInfo.dayEventTotal.EventTotalCount}</td>
            <td>${this.props.dayEventInfo.dayEventTotal.EventTotalPercent.toFixed(2)}%</td>
            <td></td>
          </tr>`;
          antTbody.insertAdjacentHTML('beforeend', statsElement);
        }
    
        if (document.querySelector('.stats-row')) {
          if (!this.props.dayEventInfo.dayEventList.length) {
            document.querySelector('.stats-row').innerHTML = '';
          } else {
            const {
                dayEventInfo: {
                    dayEventTotal
              }
            } = this.props;
    
            if (document.querySelector('.stats-row').innerHTML === '') {
              document.querySelector('.stats-row').innerHTML = `
                <td>${this.props.dayEventInfo.dayEventTotal.EventTypeName}</td>
                <td>${this.props.dayEventInfo.dayEventTotal.EventTotalCount}</td>
                <td>${this.props.dayEventInfo.dayEventTotal.EventTotalPercent.toFixed(2)}%</td>
                <td></td>
              `;
            } else {
                console.log(this.props.dayEventInfo.dayEventTotal);
                
                document.querySelector('.stats-row').innerHTML = `
                    <td>${this.props.dayEventInfo.dayEventTotal.EventTypeName}</td>
                    <td>${this.props.dayEventInfo.dayEventTotal.EventTotalCount}</td>
                    <td>${this.props.dayEventInfo.dayEventTotal.EventTotalPercent.toFixed(2)}%</td>
                    <td></td>
                `;
            //   if (JSON.stringify(prevProps.dayEventInfo.dayEventTotal) !== JSON.stringify(this.props.dayEventInfo.dayEventTotal)) {
            //     document.querySelector('.stats-row').innerHTML = `
            //         <td>${dayEventTotal.EventTypeName}</td>
            //         <td>${dayEventTotal.EventTotalCount}</td>
            //         <td>${dayEventTotal.EventTotalPercent.toFixed(2)}%</td>
            //         <td></td>
            //     `;
            //   }
            }
          }
        }
      }

    fetchDailyEvent = (queryParams = {}) => {
        const {
            EventType = {},
            ExpectedDate,
            RecordIndex,
            RecordSize
        } = queryParams;
    
        getDayEvent({
            QueryStartDate: ExpectedDate.value && ExpectedDate.value.length && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
            QueryEndDate: ExpectedDate.value && ExpectedDate.value.length && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
            EventType: EventType.value != null ? +EventType.value : 0,
            RecordIndex,
            RecordSize
        });
      }

    handleSearch=(e)=> {
        e.preventDefault();

        const {
            dayEventInfo: {
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
      
          this.fetchDailyEvent({
              ...pageQueryParams,
              RecordIndex: 0,
              RecordSize: pageQueryParams.RecordSize
          });
        
    }

    handleTableChange = ({current, pageSize }) => {

        const {
          dayEventInfo: {
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
    
        this.fetchDailyEvent({
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

    handleShowDetailModal = (record) => {
        const {
            ExpectedDate
        } = this.props.dayEventInfo.pageQueryParams;

        getEventTypeDetail({
            EventType: record.EventType,
            QueryStartDate: (ExpectedDate.value || []).length ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
            QueryEndDate: (ExpectedDate.value || []).length ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : ''
        }).then((res) => {
            if (res.Code === 0) {
                this.setState({
                    detailModalVisible: true,
                    eventTypeDetailData: ((res.Data || {}).DepartEvents || []).map((item, index) => {
                        return {
                            key: index + 1,
                            ...item,
                            children: (item.GroupEvents || []).map((cur, i) => {
                                return {
                                    ...cur,
                                    key: Math.random(),
                                    DepartName: cur.GroupName
                                };
                            })
                        };
                    })
                });
            } else {
              message.error(res.Desc || '出错了，请稍后尝试');
            }
        }).catch((err) => {
              message.error(err.Desc || '出错了，请稍后尝试');
        });
    }

    handleHideDetailModal = () => {
        this.setState({
            detailModalVisible: false,
            eventTypeDetailData: []
        });
    }

    handleExport = () => {
        const {
            EventType = {},
            ExpectedDate
        } = this.props.dayEventInfo.pageQueryParams;

        exportEventType({
            QueryStartDate: ExpectedDate.value && ExpectedDate.value.length && moment(ExpectedDate.value[0]).isValid() ? moment(ExpectedDate.value[0]).format('YYYY-MM-DD') : '',
            QueryEndDate: ExpectedDate.value && ExpectedDate.value.length && moment(ExpectedDate.value[1]).isValid() ? moment(ExpectedDate.value[1]).format('YYYY-MM-DD') : '',
            EventType: EventType.value != null ? +EventType.value : 0
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
            dayEventInfo: {
                dayEventList,
                RecordCount
            }
        } = this.props;

        const {
            detailModalVisible,
            eventTypeDetailData,
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
               <Form
                    onSubmit={this.handleSearch}
                    >
                    <Row gutter={24}>
                        <Col span={6} >
                            
                            <FormItem label="事件分类" {...formItemLayout}>
                                {getFieldDecorator('EventType')(
                                    <Select
                                        placeholder="请选择"
                                        size="default"
                                    >
                                    <Option key="0" value="0">全部</Option>
                                    {
                                        Object.keys(EventTypeMap).filter(k => +k !== 8).map((key) => {
                                            return (
                                            <Option key={key} value={key}>{EventTypeMap[key]}</Option>
                                            );
                                        })
                                    }
                                    <Option key={8} value="8">其他</Option>

                                        
                                </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} >
                            <FormItem label="日期区间" {...formItemLayout}>
                            {getFieldDecorator("ExpectedDate", {
                                })(
                                    <RangePicker style={{width: "100%"}}/> 
                                )}
                            </FormItem>
                        </Col>

                        <Col span={12}>
                            <div className="flex flex--around">
                                <div>
                                    <Button type="primary" size='large' htmlType="submit">搜索</Button>
                                    <Button className="ml-16" type="default" size='large' onClick={this.again}>重置</Button>
                                </div>
                                <div>
                                    <Button type="default" size='large' onClick={this.handleExport}>导出</Button>
                                </div>
                            </div>
                            
                        </Col>
                    
                    </Row>
                    
                </Form>
                    <Row>
                       <Table
                            bordered={true}
                            className="event-type-table"
                            rowKey={(record, index) => index}
                            dataSource={dayEventList}
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
                                title="事件分类"
                                dataIndex="EventType"
                                render={(text, record) => {
                                    return EventTypeMap[text] || '待分类';
                                }}
                            />
                            <Column
                                title="事件数量"
                                dataIndex="EventCount"
                            />
                            <Column
                                title="事件占比"
                                dataIndex="EventPercent"
                                render={(text, record) => {
                                    return text === '' ? '' : `${text}%`;
                                }}
                            />
                            <Column
                                title="操作"
                                key="action"
                                render={(text, record) => {
                                    return (
                                        <a onClick={() => this.handleShowDetailModal(record)}>详情</a>
                                    );
                                }}
                            />
                        </Table>
                    </Row>

                    <EventTypeDetailModal
                        visible={detailModalVisible}
                        detailData={eventTypeDetailData}
                        onCancel={this.handleHideDetailModal}
                    />
               </div>
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
        const {
          EventType,
          ExpectedDate
        } = props.dayEventInfo.pageQueryParams;
    
        return {
          EventType,
          ExpectedDate
        };
      },
      onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
          pageQueryParams: Object.assign({}, props.dayEventInfo.pageQueryParams, fields)
        });
      }
})(Eventstype);
