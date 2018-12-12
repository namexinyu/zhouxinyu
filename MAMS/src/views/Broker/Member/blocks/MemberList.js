import React from 'react';
import {browserHistory} from 'react-router';
import Pagination from 'COMPONENT/Pagination';
import ObjectToArray from 'UTIL/base/ObjectToArray';
import setParams from 'ACTION/setParams';
import resetState from 'ACTION/resetState';
import setFetchStatus from 'ACTION/setFetchStatus';
import openDialog from 'ACTION/Dialog/openDialog';
import getMemberList from 'ACTION/Broker/Member/getMemberList';
import resetMemberListQueryParams from 'ACTION/Broker/Member/resetMemberListQueryParams';
import filterObj from 'CONFIG/EnumerateLib/Mapping_Array_memberList';
import Mapping_User from 'CONFIG/EnumerateLib/Mapping_User';
import helpMemberRegister from "ACTION/Broker/Member/helpMemberRegister";
import {Button, Icon, Row, Col, Modal, message, Table, Select, Card, Form, Input, DatePicker} from 'antd';
import {DataTransfer, paramTransfer} from 'UTIL/base/CommonUtils';
import {RegexRule, Constant} from 'UTIL/constant/index';

const FormItem = Form.Item;
const {Option} = Select;
const {Column, ColumnGroup} = Table;
const STATE_NAME = 'state_broker_memberList';

class MemberList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            showTableSpin: false
        };
        this.eAbnormalType = {
            1: '禁言',
            2: '黑名单'
        };
    }

    componentWillMount() {
        // 判断是否返回、tab页切换，如果不是则执行下面代码
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            // 获取会员列表
            this.doGetMemberList(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.page !== this.props.page || nextProps.pageSize !== this.props.pageSize || nextProps.orderParams !== this.props.orderParams || nextProps.resetCount !== this.props.resetCount) {
            this.doGetMemberList(nextProps);
        }
        if (nextProps.getMemberListFetch.status === 'pending') {
            this.setState({
                showTableSpin: true
            });
        }
        if (nextProps.getMemberListFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'getMemberListFetch', 'close');
            this.setState({
                showTableSpin: false
            });
        }
        if (nextProps.getMemberListFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'getMemberListFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.getMemberListFetch.response.Desc
            });
            this.setState({
                showTableSpin: false
            });
        }
        if (nextProps.helpMemberRegisterFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'helpMemberRegisterFetch', 'close');
            message.success('注册成功');
            this.doGetMemberList(nextProps);
            this.setState({
                modalVisible: false,
                showTableSpin: false
            });
        }
        if (nextProps.helpMemberRegisterFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'helpMemberRegisterFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.helpMemberRegisterFetch.response.Desc
            });
        }
    }

    handleShowModal() {
        this.setState({
            modalVisible: true
        });
        setParams(STATE_NAME, {
            registerName: {},
            registerMobile: {}
        });
    }

    handleCloseModal(item) {
        if (item === 1) {
            setParams(STATE_NAME, {
                registerMobile: '',
                registerName: ''
            });
        }
        if (item === 2) {
            setParams(STATE_NAME, {
                abnormalName: '',
                abnormalMobile: '',
                abnormalReason: ''
            });
        }
        if (item === 3) {
            setParams(STATE_NAME, {
                banPostReason: '',
                banPostName: '',
                banPostMobile: ''
            });
        }
        this.setState({
            showModal: 0
        });
    }

    handleQueryParamsChange(e, paramKey) {
        let temp = {};
        temp[paramKey] = e.target.value;
        if (paramKey === 'IsWeekPay' && e.target.value !== -9999) {
            temp.WorkState = 1;
        }
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, this.props.queryParams, temp)
        });
    }

    handleParamsChange(e, paramKey) {
        let temp = {};
        temp[paramKey] = e.target.value;
        setParams(STATE_NAME, temp);
    }

    handleResetQuery() {
        this.props.form.resetFields();
        setParams(STATE_NAME, {
            q_Name: {},
            q_Phone: {},
            q_QQ: {},
            q_WeChat: {},
            q_InviteName: {},
            q_RegStartDate: {},
            q_RegStopDate: {},
            q_Status: {
                value: '-9999'
            },
            q_Source: {
                value: '-9999'
            },
            q_WorkState: {
                value: '-9999'
            },
            q_TimeInterval: {
                value: '-9999'
            },
            q_IsCert: {
                value: '-9999'
            },
            q_IsWeekPay: {
                value: '-9999'
            },
            q_IsPreOrder: {
                value: '-9999'
            },
            LastContactStartDate: "",
            LastContactStopDate: ""
        });
    }

    handleDoSearch() {
        if (this.props.page === 1) {
            this.doGetMemberList(this.props);
        } else {
            setParams(STATE_NAME, {
                page: 1
            });
        }
    }

    handleRefreshPage() {
        resetState(STATE_NAME);
    }

    doGetMemberList(props) {
        let op = [];
        let qp = [];
        let LastContactStartDate = "";
        let LastContactStopDate = "";
        for (let k in props.orderParams) {
            if (props.orderParams[k] !== '') {
                op.push({
                    Key: k,
                    Order: props.orderParams[k]
                });
            }
        }
        for (let kk in props.queryParams) {
            if (props['q_' + kk] && props['q_' + kk].value && props['q_' + kk].value !== '') {
                if (kk === 'RegStartDate' || kk === 'RegStopDate') {
                    qp.push({
                        Key: kk,
                        Value: props['q_' + kk].value ? props['q_' + kk].value.format('YYYY-MM-DD') : ''
                    });
                } else {
                    qp.push({
                        Key: kk,
                        Value: props['q_' + kk].value.toString().trim()
                    });
                }

            }
        }
        if (props.LastContactStartDate.value && props.LastContactStartDate.value !== "") {
            qp.push({
                Key: props.LastContactStartDate.name,
                value: props.LastContactStartDate.value.format('YYYY-MM-DD')
            });
        }
        if (props.LastContactStopDate.value && props.LastContactStopDate.value !== "") {
            qp.push({
                Key: props.LastContactStopDate.name,
                value: props.LastContactStopDate.value.format('YYYY-MM-DD')
            });
        }
        getMemberList({
            OrderParams: op,
            QueryParams: qp,
            RecordIndex: props.pageSize * (props.page - 1),
            RecordSize: props.pageSize
        });
    }

    handleTableChange(pagination, filters, sorter) {
        let orderParam = {};
        if (sorter) {
            if (sorter.columnKey == 'FeedbackRecord') {
                orderParam.ContactTime = sorter.order == 'descend' ? 1 : 0;
            } else if (sorter.columnKey == 'RegDate') {
                orderParam.RegDate = sorter.order == 'descend' ? 1 : 0;
            }
        }
        let page = pagination.current;
        let pageSize = pagination.pageSize;
        setParams(STATE_NAME, {
            page: page,
            pageSize: pageSize,
            orderParams: orderParam
        });
    }

    goToMemberDetail(record, index, event) {
        browserHistory.push({
            pathname: '/broker/member/detail/' + record.UserID,
            query: {
                memberName: record.Name || record.CallName || record.NickName
            }
        });
    }

    handleModalOk() {
        this.props.form.validateFieldsAndScroll(['registerName', 'registerMobile'], (errors, values) => {
            if (!errors) {
                helpMemberRegister({
                    Name: this.props.registerName.value,
                    Phone: this.props.registerMobile.value
                });
            }
        });
    }

    handleModalCancel() {
        this.setState({
            modalVisible: false
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {recordList, recordCount, pageSize, page, orderParams} = this.props;
        const {showTableSpin, modalVisible} = this.state;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>会员管理</h1>
                    <div className="float-right">
                        <Button htmlType="button" type="primary" onClick={() => this.handleShowModal()}>代注册</Button>
                        <i className="iconfont icon-shuaxin ml-8" style={{fontSize: '20px'}}
                           onClick={() => this.handleRefreshPage()}></i>
                    </div>
                </div>
                <div className="container-fluid">
                    <div>
                        <Card bordered={false} noHovering={true} bodyStyle={{padding: '10px'}}>
                            <Form>
                                <Row type="flex" justify="start">
                                    <Col span={6}>
                                        <FormItem label="姓名" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                            {getFieldDecorator('q_Name', {
                                                rules: []
                                            })(
                                                <Input type="text" placeholder="会员姓名"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="手机" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                            {getFieldDecorator('q_Phone', {
                                                rules: [
                                                    {
                                                        pattern: /^1[0-9][0-9]\d{8}$/,
                                                        message: '请输入正确的11位手机号'
                                                    }
                                                ]
                                            })(
                                                <Input type="tel" placeholder="手机号码或历史手机号"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4}>
                                        <FormItem label="QQ" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                            {getFieldDecorator('q_QQ', {
                                                rules: []
                                            })(
                                                <Input type="tel" placeholder="QQ号码"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4}>
                                        <FormItem label="微信" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                            {getFieldDecorator('q_WeChat', {
                                                rules: []
                                            })(
                                                <Input type="text" placeholder="微信号码"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={4}>
                                        <FormItem label="来源" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                            {getFieldDecorator('q_Source', {
                                                rules: []
                                            })(
                                                <Select placeholder="请选择来源" className="w-100">
                                                    {
                                                        filterObj.Source.map((item, i) => {
                                                            return (<Option value={item.value.toString()}
                                                                            key={i}>{item.text}</Option>);
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                
                                   
                                    {/* <Col span={4}>
                                    <FormItem label="联系间隔" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                        {getFieldDecorator('q_TimeInterval', {
                                            rules: []
                                        })(
                                            <Select placeholder="请选择联系间隔" className="w-100">
                                                {
                                                    filterObj.TimeInterval.map((item, i) => {
                                                        return (<Option value={item.value.toString()}
                                                                        key={i}>{item.text}</Option>);
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col> */}
                                    {/* <Col span={4}>
                                    <FormItem label="是否认证" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                        {getFieldDecorator('q_IsCert', {
                                            rules: []
                                        })(
                                            <Select placeholder="请选择认证情况" className="w-100">
                                                {
                                                    filterObj.IsCert.map((item, i) => {
                                                        return (<Option value={item.value.toString()}
                                                                        key={i}>{item.text}</Option>);
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col> */}
                                    {/* <Col span={4}>
                                    <FormItem label="推荐人" labelCol={{span: 8}} wrapperCol={{span: 16}}>
                                        {getFieldDecorator('q_InviteName', {
                                            rules: []
                                        })(
                                            <Input type="text" placeholder="推荐人姓名"/>
                                        )}
                                    </FormItem>
                                </Col>*/}
                                    <Col span={6}>
                                        <FormItem label="注册日期" labelCol={{span: 8}} wrapperCol={{span: 16}}>

                                            {getFieldDecorator('q_RegStartDate', {
                                                rules: []
                                            })(
                                                <DatePicker className="w-50" placeholder="起始日期"/>
                                            )}
                                            {getFieldDecorator('q_RegStopDate', {
                                                rules: []
                                            })(
                                                <DatePicker className="w-50" placeholder="结束日期"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="联系时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                                        <div style={{display: "flex"}}>
                                            {getFieldDecorator('LastContactStartDate')(<DatePicker className="w-50" placeholder="起始日期"/>)}
                                            {getFieldDecorator('LastContactStopDate')(<DatePicker className="w-50" placeholder="结束日期"/>)} 
                                        </div>
                                        </FormItem>
                                    </Col>
                                    <Col span={8} offset={4} className="text-right">
                                        <Button type="primary" htmlType="button"
                                                onClick={() => this.handleDoSearch()}>搜索</Button>
                                        <Button className="ml-8" onClick={() => this.handleResetQuery()}>重置</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                        <Card className="mt-24" bodyStyle={{padding: '10px'}}>
                            <Table rowKey={record => record.UserID.toString()}
                                   dataSource={recordList}
                                   rowClassName={() => 'cursor-pointer'}
                                   pagination={{
                                       total: recordCount,
                                       defaultPageSize: pageSize,
                                       defaultCurrent: page,
                                       current: page,
                                       pageSize: pageSize,
                                       pageSizeOptions: Constant.pageSizeOptions,
                                       showTotal: (total, range) => {
                                           // return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                           return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                       },
                                       showSizeChanger: true,
                                       showQuickJumper: true
                                   }}
                                   size="middle"
                                   bordered={true}
                                    onRowClick={this.goToMemberDetail.bind(this)}
                                   loading={showTableSpin}
                                   onChange={this.handleTableChange.bind(this)}>
                                <Column
                                    title="序号"
                                    dataIndex="seqNo"
                                    width={42}
                                    render={(text, record, index) => {
                                      return (index + 1) + pageSize * (page - 1);
                                    }}
                                />
                                <Column
                                    title="会员姓名"
                                    dataIndex="Name"
                                    render={(text, record, index) => {
                                        let abnormalReason = '';
                                        if (record.AbnormalInfo && record.AbnormalInfo.length > 0) {
                                            abnormalReason = record.AbnormalInfo.map((item) => {
                                                return (this.eAbnormalType[item.Type] ? ('【' + this.eAbnormalType[item.Type] + '】') : '') + item.Reason;
                                            }).join(',');
                                        } 
                                        return (
                                            <div className="cursor-pointer">
                                            <span onClick={() => this.goToMemberDetail(record)}
                                                  className="color-primary">
                                                {record.Name || record.CallName || record.NickName || ''}</span>
                                                {record.IDCardCert &&
                                                <span className="iconfont icon-iconheji color-warning ml-8"
                                                      style={{fontSize: '18px'}}/>}
                                                {record.IsWeekPay && <span
                                                    className="iconfont icon-zhou color-primary ml-8"
                                                    style={{fontSize: '18px'}}/>}
                                                {(record.IsAbnormal) && <span
                                                    title={abnormalReason}
                                                    className="iconfont icon-zhixingyichang color-grey ml-8"
                                                    style={{fontSize: '18px'}}/>}
                                            </div>

                                        );
                                    }}
                                    width={100}
                                />
                                <Column
                                    title="手机号"
                                    dataIndex="Phone"
                                    width={120}
                                    render={(text, record, index) => {
                                        return DataTransfer.phone(record.Phone);
                                    }}/>
                                <Column
                                    title="性别"
                                    dataIndex="Gender"
                                    width={60}
                                    render={(text, record, index) => {
                                        return (
                                            Mapping_User.eGender[record.Gender]
                                        );
                                    }}
                                />
                                <Column
                                    title="QQ"
                                    dataIndex="QQ"
                                    width={120}/>
                                <Column
                                    title="微信"
                                    dataIndex="WeChat"
                                    width={120}/>
                                <Column 
                                    title="联系时间"
                                    dataIndex="LastContactDate"
                                    />

                                <Column
                                    title="最近联系记录"
                                    sorter={true}
                                    sortOrder={orderParams['ContactTime'] != undefined ? (orderParams['ContactTime'] == 0 ? "ascend" : "descend") : ''}
                                    dataIndex="FeedbackRecord"
                                    width={300}
                                />
                                <Column
                                    title="推荐人"
                                    dataIndex="MemberInviteNames"
                                    render = {(text, record, index) => {
                                      return text.RealName ? text.RealName : (text.CallName ? text.CallName : text.NickName);
                                    }}
                                />
                                <Column
                                    title="来源"
                                    datIndex="eRegSource"
                                    render={(text, record, index) => {
                                        return (
                                            Mapping_User.eRegSource[record.Source]
                                        );
                                    }}
                                />
                                {/* <Column
                                title="最近联系时间"
                                dataIndex="ContactTime"
                                render={(text, record, index) => {
                                    return (new Date(record.ContactTime).Format('yyyy-MM-dd hh:mm'));
                                }}
                            /> */}
                                <Column
                                    title="注册日期"
                                    dataIndex="RegDate"
                                    sorter={true}
                                    sortOrder={orderParams['RegDate'] != undefined ? (orderParams['RegDate'] == 0 ? "ascend" : "descend") : ''}
                                    render={(text, record, index) => {
                                        return (
                                            record.RegDate.substr(0, 10)
                                        );
                                    }}
                                />
                            </Table>
                        </Card>
                    </div>
                </div>
                <Modal
                    title="代注册"
                    visible={modalVisible}
                    onOk={this.handleModalOk.bind(this)}
                    onCancel={this.handleModalCancel.bind(this)}>
                    <Row>
                        <Col span={24}>
                            <FormItem label="会员姓名" labelCol={{span: 5}} wrapperCol={{span: 16}}>
                                {getFieldDecorator('registerName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '会员姓名必填'
                                        },
                                        {
                                            pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                            message: '姓名必须为中文或英文字符'
                                        }
                                    ]
                                })(<Input maxLength="6" type="text" placeholder="请输入会员姓名"/>)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="手机号码" labelCol={{span: 5}} wrapperCol={{span: 16}}>
                                {getFieldDecorator('registerMobile', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '手机号码必填'
                                        },
                                        {
                                            pattern: /^1[0-9][0-9]\d{8}$/,
                                            message: '请输入正确的11位手机号'
                                        }
                                    ]
                                })(<Input maxLength="11" type="tel" placeholder="请输入手机号"/>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            q_Name: props.q_Name,
            q_Phone: props.q_Phone,
            q_QQ: props.q_QQ,
            q_WeChat: props.q_WeChat,
            q_InviteName: props.q_InviteName,
            q_RegStartDate: props.q_RegStartDate,
            q_RegStopDate: props.q_RegStopDate,
            q_Status: props.q_Status,
            q_Source: props.q_Source,
            q_WorkState: props.q_WorkState,
            q_TimeInterval: props.q_TimeInterval,
            q_IsCert: props.q_IsCert,
            q_IsWeekPay: props.q_IsWeekPay,
            q_IsPreOrder: props.q_IsPreOrder,
            registerName: props.registerName,
            registerMobile: props.registerMobile,
            LastContactStartDate: props.LastContactStartDate,
            LastContactStopDate: props.LastContactStopDate
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(MemberList);
