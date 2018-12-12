import React from 'react';
import {Row, Col, Button, Table, Form, Input, Icon, DatePicker, Popconfirm, message, Modal, Select} from 'antd';
import setParams from "ACTION/setParams";
import moment from 'moment';
import {browserHistory, Link } from 'react-router';
import getQueryEvents from 'ACTION/Common/Management/eventquery';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import EventManagementService from 'SERVICE/Business/Management/eventmanagement';
import {CONFIG} from 'mams-com';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import PatchTransformModal from './PatchTransformModal';

const FormItem = Form.Item;
const { TextArea } = Input;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const { Column } = Table;

const { GetMAMSRecruitFilterList } = ActionMAMSRecruitment;
const { getQueryOnDuty } = EventManagementService;
const {AppSessionStorage} = CONFIG;
const STATE_NAME = 'state_mams_eventquery';

import { EventTypeMap, EventDealStatusMap } from "UTIL/constant";

// const DealStatusMap = {
//     2: '待处理',
//     3: '处理中',
//     4: '处理完毕',
//     5: '结案',
//     6: '补充资料',
//     7: '补充资料完毕',
//     8: '申诉',
//     9: '申诉待处理',
//     10: '申诉拒绝',
//     11: '退回',
//     12: '退回待处理',
//     13: '直接拒绝'
// };

const EventNatureMap = {
    1: '用户体验',
    2: '经纪人利益',
    3: '其他'
};

 class Eventquery extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            page: (this.props.queryEventInfo.pageQueryParams.RecordIndex / this.props.queryEventInfo.pageQueryParams.RecordSize) + 1,
            pageSize: 40,
            patchModalVisible: false,
            selectedRecords: [],
            selectedRowKeys: [],
            availableProcessors: []
        };
    }
    skip=(a)=> {
        browserHistory.push({
            pathname: '/bc/event-management/querydetail',
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
        this.fetchQueryEvents(this.props.queryEventInfo.pageQueryParams);
        GetMAMSRecruitFilterList();
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

    fetchQueryEvents = (queryParams = {}) => {
        const {
            UserName = {},
            RecruitTmpID = {},
            InterviewDate = {},
            ReleaseDate = {},
            EventPublisher = {},
            EventProcessor = {},
            EventID = {},
            EventType = {},
            EventNature = {},
            UserMobile = {},
            SatisfactionType = {},
            DealStatus = {},
            RecordIndex,
            RecordSize
        } = queryParams;
    
        getQueryEvents({
            BrokerName: EventPublisher.value || '',
            DealStatus: DealStatus.value ? [+DealStatus.value] : [],
            DiplomatID: 0,
            DiplomatName: EventProcessor.value || '',
            EventID: EventID.value ? +EventID.value : 0,
            EventSubType: 0,
            EventType: EventType.value ? +EventType.value : 0,
            EventNature: EventNature.value ? +EventNature.value : 0,
            Mobile: UserMobile.value || '',
            InterviewDate: InterviewDate.value && moment(InterviewDate.value).isValid() ? moment(InterviewDate.value).format('YYYY-MM-DD') : '',
            QueryStartDate: ReleaseDate.value && ReleaseDate.value.length && moment(ReleaseDate.value[0]).isValid() ? moment(ReleaseDate.value[0]).format('YYYY-MM-DD') : '',
            QueryEndDate: ReleaseDate.value && ReleaseDate.value.length && moment(ReleaseDate.value[1]).isValid() ? moment(ReleaseDate.value[1]).format('YYYY-MM-DD') : '',
            RecruitTmpID: RecruitTmpID.value ? +RecruitTmpID.value.value : 0,
            Satisfaction: SatisfactionType.value ? +SatisfactionType.value : 0,
            UserName: UserName.value || '',
            RecordIndex,
            RecordSize
        });
      }

    handleSearch=()=> {
        const {
            queryEventInfo: {
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
      
          this.fetchQueryEvents({
              ...pageQueryParams,
              RecordIndex: 0,
              RecordSize: pageQueryParams.RecordSize
          });
        
    }

    handleTableChange = ({current, pageSize }) => {
        const {
          queryEventInfo: {
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
    
        this.fetchQueryEvents({
            ...pageQueryParams,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        });
      }

    handleShowTransformModal = () => {
        getQueryOnDuty({
            DutyStatus: 1
        }).then((res) => {
            if (res.Code === 0) {
              this.setState({
                  patchModalVisible: true,
                  availableProcessors: (res.Data || {}).RecordList || []
              });
            } else {
                message.error(res.Data.Desc || '请求数据出错了');
            }
        }).catch((err) => {
            message.error(err.Desc || '请求数据出错了');
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

    handlePatchTransform = () => {
        setTimeout(() => {
            this.setState({
                patchModalVisible: false,
                selectedRecords: [],
                selectedRowKeys: []
            });
        }, 100);
        this.fetchQueryEvents(this.props.queryEventInfo.pageQueryParams);
        
        
    }

    handleCancelTransform = () => {
        this.setState({
            patchModalVisible: false
        });
    }
    render() {
        const {
            form: {
                getFieldDecorator
            },
            queryEventInfo: {
                queryEventsList,
                RecordCount
            }
        } = this.props;

        const {
            page,
            pageSize,
            patchModalVisible,
            selectedRecords,
            selectedRowKeys,
            availableProcessors
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
                    <Col span={8}>
                        <FormItem label="会员姓名" {...formItemLayout}>
                           {getFieldDecorator("UserName")(
                                <Input placeholder=""/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="手机号" {...formItemLayout}>
                            {getFieldDecorator('UserMobile', {
                              rules: [
                                // {
                                //   pattern: /^1[0-9][0-9]\d{8}$/,
                                //   message: '请输入正确的11位手机号'
                                // }
                              ]
                            })(
                              <Input type="tel" maxLength="11" placeholder="请输入手机号码"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="企业名称" {...formItemLayout}>
                            {getFieldDecorator('RecruitTmpID')(
                              <AutoCompleteSelect allowClear={true} optionsData={{
                                valueKey: 'RecruitTmpID',
                                textKey: 'RecruitName',
                                dataArray: this.props.allRecruitList
                              }}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="面试时间" {...formItemLayout}>
                           {getFieldDecorator("InterviewDate", {
                            rules: []
                            })(
                                <DatePicker style={{width: '100%'}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="发布时间" {...formItemLayout}>
                           {getFieldDecorator("ReleaseDate")(
                                <RangePicker style={{width: '100%'}} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="事件发布者" {...formItemLayout}>
                           {getFieldDecorator("EventPublisher", {
                            rules: []
                            })(
                                <Input placeholder=""/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="事件处理者" {...formItemLayout}>
                           {getFieldDecorator("EventProcessor", {
                            rules: []
                            })(
                                <Input placeholder=""/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="流水号" {...firstLayout} >
                           {getFieldDecorator("EventID")(
                                <Input placeholder="" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="事件分类" {...formItemLayout}>
                            {getFieldDecorator('EventType')(
                                <Select
                                    placeholder="请选择"
                                    size="default"
                                >
                                    <Option key="0" value="0">全部</Option>
                                    {
                                        Object.keys(EventTypeMap).map((key) => {
                                            return (
                                                <Option key={key} value={key}>{EventTypeMap[key]}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="事件性质" {...formItemLayout}>
                            {getFieldDecorator('EventNature')(
                                <Select
                                    placeholder="请选择"
                                    size="default"
                                >
                                    <Option key="0" value="0">全部</Option>
                                    {
                                        Object.keys(EventNatureMap).map((key) => {
                                            return (
                                                <Option key={key} value={key}>{EventNatureMap[key]}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="满意度" {...formItemLayout}>
                            {getFieldDecorator('SatisfactionType')(
                                <Select
                                    placeholder="请选择"
                                    size="default"
                                >
                                    <Option value="0">全部</Option>
                                    <Option value="1">点赞</Option>
                                    <Option value="2">差评</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="当前状态" {...formItemLayout}>
                            {getFieldDecorator('DealStatus')(
                                <Select
                                    placeholder="请选择"
                                    size="default"
                                >
                                    <Option key="0" value="0">全部</Option>
                                    {
                                        Object.keys(EventDealStatusMap).map((key) => {
                                            return (
                                                <Option key={key} value={key}>{EventDealStatusMap[key]}</Option>
                                            );
                                        })
                                    }

                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24} push={10}>
                        <Button type="default" size='large' style={{margin: '0 30px 0 0'}} htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                        <Button type="default" size='large' onClick={this.again}>重置</Button>
                    </Col>
                    <Col span={24} push={18}>
                        <Button disabled={!selectedRecords.length} onClick={this.handleShowTransformModal} type="default" size='large' style={{margin: '0 30px 20px 0'}} htmlType="submit">批量转移</Button>
                        {/* <Button type="default" size='large' onClick={this.again}>导出</Button> */}
                    </Col>
                    </Row>
                </Form>
                    <Row>
                       <Table
                            bordered={true}
                            dataSource={queryEventsList}
                            onChange={this.handleTableChange}
                            rowSelection={{
                                onChange: (selectedRowKeys, selectedRows) => {
                                    this.setState({
                                        selectedRecords: selectedRows,
                                        selectedRowKeys
                                    });
                                },
                                selectedRowKeys: selectedRowKeys,
                                getCheckboxProps: (record) => {
                                    return {
                                        disabled: record.DealStatus === 10 || record.DealStatus === 5
                                    };
                                }
                            }}
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
                            
                            <Column
                                title="流水号"
                                dataIndex="EventID"
                            />
                            <Column
                                title="事件分类"
                                dataIndex="EventType"
                                render={(text, record) => {
                                    return EventTypeMap[text] || '';
                                }}
                            />
                            <Column
                                title="事件性质"
                                dataIndex="EventNature"
                                render={(text, record) => {
                                    return EventNatureMap[text] || '';
                                }}
                            />
                            <Column
                                title="会员姓名"
                                dataIndex="UserName"
                            />
                            <Column
                                title="手机号"
                                dataIndex="Mobile"
                            />
                            <Column
                                title="面试时间"
                                dataIndex="InterviewDate"
                            />
                            <Column
                                title="企业名称"
                                dataIndex="RecruitName"
                            />
                            <Column
                                title="事件发布者"
                                dataIndex="BrokerName"
                            />
                            <Column
                                title="发布时间"
                                dataIndex="CreateTime"
                            />
                            <Column
                                title="事件处理者"
                                dataIndex="DiplomatName"
                            />
                             <Column
                                title="处理时长"
                                dataIndex="DealDuringMin"
                                render={(text, record) => {
                                    return (text === '' || text == null || text === '0.00') ? '' : `${text}分钟`;
                                }}
                            />
                            <Column
                                title="最后更新时间"
                                dataIndex="ModifyTime"
                            />
                            <Column
                                title="问题描述"
                                dataIndex="QuestionRemark"
                            />
                            <Column
                                title="满意度"
                                dataIndex="Satisfaction"
                                render={(text, record) => {
                                    return text === 1 ? '点赞' : (text === 2 ? '差评' : '');
                                }}
                            />
                            <Column
                                title="当前状态"
                                dataIndex="DealStatus"
                                render={(text, record) => {
                                    return EventDealStatusMap[text] || '';
                                }}
                            />
                            <Column
                                title="操作"
                                key="action"
                                render={(text, record) => {
                                    return (
                                        <Link to={{pathname: '/bc/event-management/querydetail', state: record}}>详情</Link>
                                    );
                                }}
                            />
                        </Table>
                    </Row>
                    <PatchTransformModal
                        visible={patchModalVisible}
                        onOk={this.handlePatchTransform}
                        onCancel={this.handleCancelTransform}
                        transformItems={selectedRecords}
                        availableProcessors={availableProcessors}
                    />
               </div>
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
        const {
            UserName,
            RecruitTmpID,
            InterviewDate,
            ReleaseDate,
            EventPublisher,
            EventProcessor,
            SatisfactionType,
            DealStatus,
            EventID,
            EventType,
            EventNature,
            UserMobile
        } = props.queryEventInfo.pageQueryParams;
    
        return {
            UserName,
            RecruitTmpID,
            InterviewDate,
            ReleaseDate,
            EventPublisher,
            EventProcessor,
            SatisfactionType,
            DealStatus,
            EventID,
            EventType,
            EventNature,
            UserMobile
        };
      },
      onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
          pageQueryParams: Object.assign({}, props.queryEventInfo.pageQueryParams, fields)
        });
      }
})(Eventquery);
