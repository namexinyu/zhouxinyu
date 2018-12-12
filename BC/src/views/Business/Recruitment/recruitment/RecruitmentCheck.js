import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Select,
    Table,
    Button,
    Input,
    DatePicker,
    message,
    Pagination,
    Alert
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import RecruitmentCheckAction from 'ACTION/Business/Recruit/RecruitmentCheckAction';
import CommonAction from 'ACTION/Business/Common';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import moment from 'moment';
import SetStatusModal from './SetStatusModal';
import sendNotify from 'UTIL/sendNotify';


const STATE_NAME = 'state_business_recruitmentcheck';

const {
    getList,
    setCheckStatus
} = RecruitmentCheckAction;

const {
    getRecruitSimpleList,
    getGiftInfoList
} = CommonAction;

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class RecruitmentCeck extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            auditRecord: {}
        };
    }

    componentWillMount() { 
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            // getLaborSimpleList(); 
            getRecruitSimpleList(); 
            getGiftInfoList();
            this.queryTableList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
        if (nextProps.setCheckStatusFetch.status === 'success') { 
            setFetchStatus(STATE_NAME, 'setCheckStatusFetch', 'close');
            message.success('设置成功');
            setParams(STATE_NAME, {ModalItems: {
                Visible: false,
                confirmLoading: false,
                LaborID: ''
            }});
            this.queryTableList(nextProps);

            // 发送消息
            console.log(this.state.auditRecord);
            const {
                auditRecord
            } = this.state;
            const newMsgContent = this.getAuditContent(auditRecord);

            if (newMsgContent.length && auditRecord.RecruitType === 1) {
                if (moment().format('YYYY-MM-DD') === auditRecord.RealDate) {// 今日操作今日
                    sendNotify({
                        key: `${auditRecord.RecruitTmpID}-${auditRecord.RealDate}-AuditInfo`,
                        newMsg: JSON.stringify({
                            Title: {
                              RecruitName: auditRecord.RecruitName,
                              DayType: 1
                            },
                            Content: newMsgContent
                        }),
                        oldMsg: JSON.stringify({
                          Title: {
                              RecruitName: auditRecord.RecruitName,
                              DayType: 1
                            },
                            Content: []
                        })
                      });
                }
        
                if (moment().add(1, 'days').format('YYYY-MM-DD') === auditRecord.RealDate) {// 今日操作明日
                    if ((Date.now() > new Date(`${moment().format('YYYY-MM-DD')} 14:00`).getTime() && Date.now() < new Date(`${moment().format('YYYY-MM-DD')} 23:59`).getTime())) {// 今日操作明日的非第一次和14~23:59
                        sendNotify({
                            key: `${auditRecord.RecruitTmpID}-${auditRecord.RealDate}-AuditInfo`,
                            newMsg: JSON.stringify({
                                Title: {
                                  RecruitName: auditRecord.RecruitName,
                                  DayType: 2
                                },
                                Content: newMsgContent
                            }),
                            oldMsg: JSON.stringify({
                              Title: {
                                  RecruitName: auditRecord.RecruitName,
                                  DayType: 2
                                },
                                Content: []
                            })
                          });
                    }
                }
            }

        } else if (nextProps.setCheckStatusFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setCheckStatusFetch', 'close');
            message.error('设置失败');
            setParams(STATE_NAME, {ModalItems: {
                Visible: false,
                confirmLoading: false,
                LaborID: ''
            }});
        }
    }

    getAuditContent(auditRecord) {
        const newContent = [];
        const {
            EnrollFeeList,
            LabourCostList,
            SubsidyList
        } = auditRecord;

        if (EnrollFeeList != null) { // 收费
            newContent.push({
                key: '会员收费：',
                value: EnrollFeeList.map(item => {
                    return `${item.Gender === 1 ? '男收' : item.Gender === 2 ? '女收' : '男女不限 收'}：${item.Fee / 100}元`;
                }).join('，')
            });
        }

        if (LabourCostList != null) { // 工价
            newContent.push({
                key: '工价：',
                value: LabourCostList.map(item => {
                    return `${item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : ''}${(item.SubsidyUnitPay + item.UnitPay) / 100}元/${['月', '天', '时'][item.ValuateUnit]}`;
                }).join('，')
            });
        }

        if (SubsidyList != null) {
            newContent.push({
                key: '会员补贴：',
                value: SubsidyList.map(item => {
                    return `${item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}：${item.SubsidyDay}天返${item.SubsidyAmount / 100}元`;
                }).join('，') + `${SubsidyList[0].SubsidyType === 2 ? '（工作日）' : '（在职日）'}`
            });
        }

        return newContent;
    }

    queryTableList(Props) {
        if(!Props) Props = this.props;
        let query = {
            newDate: Props.Date,
            RecruitTmpID: Props.EnterpriseName.value && Props.EnterpriseName.value.value ? Number(Props.EnterpriseName.value.value) : null,
            AuditStatus: Props.CheckStatus
        };
        if (query.RecruitTmpID === null)
            delete query.RecruitTmpID;
        if (query.newDate && query.newDate.value) {
            query.Date = query.newDate.value.format('YYYY-MM-DD');
        }else{
            query.Date = '';
        }
        delete query.newDate;
        let pageParam = Props.pageParam;

        getList({
            ...query, 
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormSubmit() {
        setParams(STATE_NAME, {
            selectedRowKeys: [], 
            pageParam: {
                ...this.props.pageParam,
                currentPage: 1
            }
        });
    }

    handleFormReset() {
        setParams(STATE_NAME, {
            Date: {value: moment()},
            EnterpriseName: ''
        });
    }

  

    handleCheckStatusClick = (e) => {
        e.preventDefault();
        setParams(STATE_NAME, {
            CheckStatus: Number(e.target.value),
            pageParam: {...this.props.pageParam, currentPage: 1}
        });
    };

    showSetStatusModal() {
        setParams(STATE_NAME, {
            ModalItems: {
                ...this.props.ModalItems,
                Visible: true,
                Remark: '',
                AuditResult: 3
            }
        });
    }

    changeStatus(text, value) {
        if (text === 'status') {
            setParams(STATE_NAME, {
                ModalItems: {
                    ...this.props.ModalItems,
                    AuditResult: value
                }
            });
        }
        if (text === 'Remark') {
            setParams(STATE_NAME, {
                ModalItems: {
                    ...this.props.ModalItems,
                    Remark: value
                }
            });
        }
    }

    handleModalSubmit() {
        setParams(STATE_NAME, {
            ModalItems: {
                ...this.props.ModalItems,
                confirmLoading: true
            }
        });
        let arr = [];
    
        let query = {
            RecruitAuditFlowID: this.props.RecruitAuditFlowID,
            AuditResult: this.props.ModalItems.AuditResult,
            Remark: this.props.ModalItems.Remark
        };
        if (query.AuditResult === 3) {
            query.Remark = '';
        }
        setCheckStatus(query);
     
    }

    handleModalCancel() {
        setParams(STATE_NAME, {
            ModalItems: {
                Visible: false,
                confirmLoading: false,
                Remark: '',
                AuditResult: 3
            }
        });
    }

    renderSearchForm() {

        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 16}};

        return (
            <Form onSubmit={(e) => {
                e.preventDefault();
                this.props.form.validateFields((err, fieldsValue) => {
                    console.log(err, fieldsValue);
                    if (err) return;
                    this.handleFormSubmit(fieldsValue);
                });
            }}>
                <Row type="flex" justify="start">
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="招聘日期">
                            {getFieldDecorator('Date')(
                                <DatePicker style={{width: '100%'}} 
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="面试企业">
                            {getFieldDecorator('EnterpriseName')(
                                <AutoCompleteInput
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={this.props.RecruitSimpleList}/>
                            )}
                        </FormItem>
                    </Col>                  
                </Row>

                <Row>
                    <Col className="mb-24" span={23} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button className="ml-8" onClick={this.handleFormReset}>重置</Button>
                    </Col>  
                </Row>
                <Row>
                    <Col className="mb-24" span={16}>
  
                            <Button className="mr-16" type="primary" size="large"
                                    value={0}
                                    ghost={this.props.CheckStatus !== 0}
                                    onClick={this.handleCheckStatusClick}>全部({this.props.TotalCount})</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value={1}
                                    ghost={this.props.CheckStatus !== 1}
                                    onClick={this.handleCheckStatusClick}>待审核({this.props.UnAuditCount})</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value={3}
                                    ghost={this.props.CheckStatus !== 3}
                                    onClick={this.handleCheckStatusClick}>审核通过({this.props.ExpireCount})</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value={2}
                                    ghost={this.props.CheckStatus !== 2}
                                    onClick={this.handleCheckStatusClick}>审核不通过({this.props.RejectCount})</Button>
                     
                    </Col>
                </Row>
            </Form>
        );  
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>招聘报价审核</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        {this.renderSearchForm()}
                        <Table
                            rowKey={(record, index) => index}
                            bordered={true}
                            pagination={false}
                            
                            columns={[{
                                title: '招聘日期',
                                dataIndex: 'Date',
                                render: (text, record, index) => {
                                    const obj = {
                                        children: text,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                            }, {
                                title: '企业简称',
                                dataIndex: 'RecruitName',
                                render: (text, record, index) => {
                                    const obj = {
                                        children: text,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                            }, {
                                title: '企业类别',
                                dataIndex: 'RecruitType',
                                render: (text, record, index) => {
                                    const obj = {
                                        children: (text === 1 ? 'A' : text === 2 ? 'B' : 'C'),
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }   
                                
                            }, {
                                title: '劳务公司/客户经理',
                                dataIndex: 'LaborAndManager'
                                
                            }, {
                                title: '劳务收费',
                                dataIndex: 'LaborCost',
                                render: (text, record) => text && text.map((item, index) =>
                                    <div key={'LaborCost' + index}>
                                        {item.Gender === 1 ? '男收' : item.Gender === 2 ? '女收' : '男女不限 收'}:
                                        {item.ChargeAmount / 100}元
                                    </div>
                                )
                            }, {
                                title: '劳务报价',
                                dataIndex: 'LaborPrice',
                                render: (text, record) => text && text.map((item, index) =>
                                    <div key={'LaborPrice' + index}>
                                        {item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}:
                                        {item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                    </div>
                                )
                            }, {
                                title: '建议补贴',
                                dataIndex: 'SuggestSubsidyList',
                                render: (text, record, index) => {
                                    let a = text && text.map((item, index) =>
                                    <div key={'SuggestSubsidyList' + index}>
                                        {item.Gender === 1 ? '男补' : item.Gender === 2 ? '女补' : '补'}:
                                        {item.SubsidyAmount / 100}元
                                    </div>
                                );
                                    const obj = {
                                        children: a,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                            }, {
                                title: '会员补贴',
                                dataIndex: 'SubsidyList',
                                render: (text, record, index) => {
                                    let a = text && text.map((item, index) =>
                                    <div key={'SubsidyList' + index}>
                                        {item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}:
                                        {item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                    </div>
                                );
                                    const obj = {
                                        children: a,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                            }, {
                                title: '补贴类型', key: 'SubsidyType',
                                render: (text, record) => {
                                    const type = record.SubsidyList && !!record.SubsidyList.length ? record.SubsidyList[0].SubsidyType : 0;
                                    const SubsidyTypeMap = {
                                        1: '在职日',
                                        2: '工作日'
                                    };
                                    return (
                                        <span style={{color: type === 2 ? 'red' : 'inherit'}}>{SubsidyTypeMap[type] || ''}</span>
                                    );
                                }
                            }, {
                                title: '会员收费',
                                dataIndex: 'EnrollFeeList',
                                render: (text, record, index) => {
                                    let a = text && text.map((item, index) =>
                                    <div key={'EnrollFeeList' + index}>
                                        {item.Gender === 1 ? '男收' : item.Gender === 2 ? '女收' : '男女不限 收'}:
                                        {item.Fee / 100}元
                                    </div>
                                );
                                    const obj = {
                                        children: a,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                            }, {
                                title: '工价',
                                dataIndex: 'LabourCostList',
                                render: (text, record, index) => {
                                    let per = ['月', '天', '时'];
                                    let tmp = text && text.map((item, index) =>
                                    <div key={'LabourCostList' + index}>
                                        {item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : ''}
                                        {(item.SubsidyUnitPay + item.UnitPay) / 100}元/
                                        {per[item.ValuateUnit]}
                                    </div>
                                );
                                    const obj = {
                                        children: tmp,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                            }, {
                                title: '赠品',
                                dataIndex: 'GiftID',
                               
                                render: (text, record, index) => {
                                    let gift = this.props.GiftInfoListObj[text] ? this.props.GiftInfoListObj[text].GiftName + '，押金' + (this.props.GiftInfoListObj[text].HoldCash / 100) + '元' : '无';
                                    const obj = {
                                        children: gift,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                            }, {
                                title: '审核状态',
                                dataIndex: 'AuditStatus',
                                render: (text, record, index) => {
                                    let a = text === 1 ? <span className='color-orange' >待审核</span> : text === 2 ? <span className='color-red' >审核拒绝</span> : <span className='color-green' >审核通过</span>;
                                    const obj = {
                                        children: a,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                                    
                            }, {
                                title: '审核备注',
                                dataIndex: 'Remark',
                                render: (text, record, index) => {
                                    const obj = {
                                        children: text,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                            }, {
                                title: '操作',
                                dataIndex: 'RecruitAuditFlowID',
                                render: (text, record, index) => {
                                    let a = <span>
                                    {record.AuditStatus === 1 ? <a href='javascript:;' onClick = {(e) => {
                                        console.log('action', record);
                                        console.log(this.props.RecordList);
                                        
                                        setParams(STATE_NAME, {RecruitAuditFlowID: text});
                                        this.showSetStatusModal();
                                        this.setState({
                                            auditRecord: record
                                        });
                                        }}>审核</a> : ''}
                                </span>;
                                    const obj = {
                                        children: a,
                                        props: {}
                                      };
                                      if (record.RowSpan > 1) {
                                        obj.props.rowSpan = record.RowSpan;
                                      } else if (record.RowSpan === 0) {
                                        obj.props.rowSpan = 0;
                                      }
                                      return obj;
                                }
                            }
                            
                            
                           ]}
                           
                            dataSource={this.props.RecordList} 
                            loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                if (sorter.columnKey) change.orderParam = {[sorter.columnKey]: sorter.order};
                                setParams(STATE_NAME, change);
                            }}/>
                            <Pagination showQuickJumper showSizeChanger size='small'
                                    style={{float: 'right', margin: '16px 0'}}
                                    current={this.props.pageParam.currentPage}
                                    pageSizeOptions={['10', '50', '100', '200']}
                                    pageSize={this.props.pageParam.pageSize}
                                    total={this.props.CheckStatus === 1 ? this.props.UnAuditCount : this.props.CheckStatus === 2 ? this.props.RejectCount : this.props.CheckStatus === 3 ? this.props.ExpireCount : this.props.RecordCount}
                                    showTotal={(total, range) => `第${range[0]}-${range[1]}条 共${total}条`}
                                    onChange={(page, pageSize) => {
                                        let currentPage = page < 1 ? 1 : page;
                                        let change = {pageParam: {currentPage, pageSize: pageSize}};
                                        setParams(STATE_NAME, change);
                                    }}
                                    onShowSizeChange={(current, size) => {
                                        let change = {pageParam: {currentPage: current, pageSize: size}};
                                        setParams(STATE_NAME, change);
                                    }}
                        />
                    </Card>
                </div>
                <SetStatusModal 
                    ModalItem={this.props.ModalItems}
                    handleModalCancel={this.handleModalCancel.bind(this)}
                    handleModalSubmit={this.handleModalSubmit.bind(this)} 
                    changeStatus={this.changeStatus.bind(this)}/>
            </div>
        );
    }
}

const getFormProps = (props) => {
    let result = {};
    for (let key in props) {
        if (key === 'Date' || key === 'EnterpriseName') {
            result[key] = props[key];
        }
    }
    return result;
};

export default Form.create({
    mapPropsToFields(props) {
        return getFormProps(props);
    },
    // onValuesChange(props, values) {
    //     setParams(STATE_NAME, values);
    // },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(RecruitmentCeck);