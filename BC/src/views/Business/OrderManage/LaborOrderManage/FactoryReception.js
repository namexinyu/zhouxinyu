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
    Alert
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import FactoryReceptionAction from 'ACTION/Business/OrderManage/FactoryReceptionAction';
import CommonAction from 'ACTION/Business/Common';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import moment from 'moment';
import FactoryReceptionService from '../../../../services/Business/OrderManage/FactoryReceptionService';
import SetLaborModal from './SetLaborModal';
import FactoryReceptionModal from './FactoryReceptionModal';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';

const STATE_NAME = 'state_business_factory';

const {
    getList,
    setLabor,
    exportList,
    updateInfo
} = FactoryReceptionAction;

const {
    getLaborSimpleList,
    getRecruitSimpleList
} = CommonAction;

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class FactoryReception extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() { 
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getLaborSimpleList(); 
            getRecruitSimpleList(); 
            this.queryTableList();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
        if (nextProps.setLaborFetch.status === 'success') { 
            setFetchStatus(STATE_NAME, 'setLaborFetch', 'close');
            message.success('设置成功');
            resetState(STATE_NAME, {ModalItems: {
                Visible: false,
                confirmLoading: false,
                LaborID: ''
            }});
            this.queryTableList(nextProps);
        } else if (nextProps.setLaborFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setLaborFetch', 'close');
            message.error('设置失败');
            resetState(STATE_NAME, {ModalItems: {
                Visible: false,
                confirmLoading: false,
                LaborID: ''
            }});
        }
        if (nextProps.updateInfoFetch.status === 'success') { 
            setFetchStatus(STATE_NAME, 'updateInfoFetch', 'close');
            message.success('更新信息成功');
            this.handleFactoryModalCancel();
            this.queryTableList(nextProps);
        } else if (nextProps.updateInfoFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'updateInfoFetch', 'close');
            message.error('更新信息失败');
            this.handleFactoryModalCancel();
        }
        if (nextProps.exportListFetch.status === 'success') { 
            setFetchStatus(STATE_NAME, 'exportListFetch', 'close');
            message.success('导出成功');
            window.open(nextProps.exportListFetch.response.Data.URL);
        } else if (nextProps.exportListFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'exportListFetch', 'close');
            message.error('导出失败');
        }
    }

    queryTableList(Props) {
        if(!Props) Props = this.props;
        let query = {
            Date: Props.CheckInDate,
            UserName: Props.UserName.value,
            MobileNumber: Props.MobileNumber.value,
            IDCardNumber: Props.IDCardNumber.value,
            EnterpriseName: Props.EnterpriseName.value && Props.EnterpriseName.value.text ? Props.EnterpriseName.value.text : '',
            ProcessStatus: Number(Props.ProcessStatus.value)
        };
        if (query.Date && query.Date.value) {
            query.CheckInDate = query.Date.value.format('YYYY-MM-DD');
            delete query.Date;
        }else{
            delete query.Date;
        }
        if (!query.EnterpriseName) delete query.EnterpriseName;
        let pageParam = Props.pageParam;

        let orderParam = {};
        if (Props.orderParam && Object.keys(Props.orderParam).length) {
            let orderKey = Object.keys(Props.orderParam)[0];
            orderParam[orderKey] = Props.orderParam[orderKey] === 'ascend' ? 1 : 2;
        }
        getList({
            ...query, ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFactoryFormSubmit() {
        setParams(STATE_NAME, {
            selectedRowKeys: [], 
            pageParam: {
                ...this.props.pageParam,
                currentPage: 1
            }
        });
    }

    handleSetLabor() {
        setParams(STATE_NAME, {
            ModalItems: {
                Visible: true,
                confirmLoading: false,
                LaborID: ''
            }
        });
        
    }

    handleExportList() {
        let Props = this.props;
        let query = {
            Date: Props.CheckInDate,
            UserName: Props.UserName.value,
            MobileNumber: Props.MobileNumber.value,
            IDCardNumber: Props.IDCardNumber.value,
            EnterpriseName: Props.EnterpriseName.value && Props.EnterpriseName.value.text ? Props.EnterpriseName.value.text : '',
            ProcessStatus: Number(Props.ProcessStatus.value)
        };
        if (query.Date && query.Date.value) {
            query.CheckInDate = query.Date.value.format('YYYY-MM-DD');
            delete query.Date;
        }else{
            delete query.Date;
        }

        let orderParam = {};
        if (this.props.orderParam && Object.keys(this.props.orderParam).length) {
            let orderKey = Object.keys(this.props.orderParam)[0];
            orderParam[orderKey] = this.props.orderParam[orderKey] === 'ascend' ? 1 : 2;
        }
        exportList({
            ...query, ...orderParam
        });
    }

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        let FactoryEntrancePickIDs = [];
        for (let row of selectedRows) {
            FactoryEntrancePickIDs.push(row.FactoryEntrancePickID);
        }
        setParams(STATE_NAME, {
            selectedRowKeys,
            FactoryEntrancePickIDs
        });
    }

    handleModalCancel() {
        setParams(STATE_NAME, {
            ModalItems: {
                Visible: false,
                confirmLoading: false,
                LaborID: ''
            }
        });
    }

    handleModalSubmit(value) {
        setParams(STATE_NAME, {
            ModalItems: {
                ...this.props.ModalItems,
                confirmLoading: true
            }
        });
        let arr = [];
    
        let query = {
            FactoryEntrancePickIDs: this.props.FactoryEntrancePickIDs,
            LaborID: value
        };
        setLabor(query);
        /*
        setParams(STATE_NAME, {
            ModalItems: {
                ...this.props.ModalItems,
                Visible: true
            }
        });
        */
    }

    handleTableRowClick(record) {
        getClient(uploadRule.idCardPic).then((client) => {
                setParams(STATE_NAME, {FactoryModalItems: {
                    Visible: true,
                    record: {...record, 
                        idCard1: record.IDCardPicPathFront ? client.signatureUrl(record.IDCardPicPathFront) : '',
                        idCard2: record.IDCardPicPathBack ? client.signatureUrl(record.IDCardPicPathBack) : ''
                    }
            }});
        }, (client) => {
            setParams(STATE_NAME, {FactoryModalItems: {
                Visible: true,
                record: {...record, 
                    idCard1: '',
                    idCard2: ''
                }
        }});
    });
        /*
        setParams(STATE_NAME, 
            {FactoryModalItems: {
                Visible: true,
                record: record
            }});
        */
    }

    handleFormReset= () => {
        setParams(STATE_NAME, {
            CheckInDate: {value: moment()},
            UserName: '',
            MobileNumber: '',
            IDCardNumber: '',
            EnterpriseName: '',
            ProcessStatus: {value: '0'}
        });
        // resetQueryParams(STATE_NAME);
    };

    handleFactoryModalCancel() {
        setParams(STATE_NAME, 
            {FactoryModalItems: {
                Visible: false,
                record: {}
            }});
    }

    handleFactoryModalSubmit(Fields) {
        let query = {
            Date: Fields.CheckInDate,
            FactoryEntrancePickID: this.props.FactoryModalItems.record.FactoryEntrancePickID,
            InterviewStatus: Number.parseInt(Fields.InterviewStatus, 10),
            IDCardNum: Fields.IDCardNum,
            LaborID: Number.parseInt(Fields.Labor.value, 10),
            ProcessRemark: Fields.ProcessRemark,
            ProcessStatus: Number.parseInt(Fields.ProcessStatus, 10),
            RecruitTmpID: Number(Fields.Enterprise.value)
        };
        if (query.Date) {
            query.CheckInDate = query.Date.format('YYYY-MM-DD');
            delete query.Date;
        }

        updateInfo({
            ...query
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
                    this.handleFactoryFormSubmit(fieldsValue);
                });
            }}>
                <Row type="flex" justify="start">
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="面试日期">
                            {getFieldDecorator('CheckInDate')(
                                <DatePicker style={{width: '100%'}} 
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="会员姓名">
                        {getFieldDecorator('UserName')(
                            <Input placeholder="请输入会员姓名" maxLength="50"/>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="手机号码">
                            {getFieldDecorator('MobileNumber')(
                                <Input placeholder="请输入手机号码" maxLength="45"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="身份证号码">
                            {getFieldDecorator('IDCardNumber')(
                                <Input placeholder="请输入身份证号码" maxLength="32"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="面试企业">
                            {getFieldDecorator('EnterpriseName')(
                                <AutoCompleteInput maxLength="50"
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={this.props.RecruitSimpleList}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="处理状态">
                            {getFieldDecorator('ProcessStatus')(
                                <Select>
                                    <Select.Option value="0">全部</Select.Option>
                                    <Select.Option value="1">未处理</Select.Option>
                                    <Select.Option value="2">处理中</Select.Option>
                                    <Select.Option value="3">已处理</Select.Option>
                                    <Select.Option value="4">已废弃</Select.Option>
                                </Select>
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
                                // ghost={this.props.LaborOrderSettleStatus !== 0}
                                disabled={Object.keys(this.props.FactoryEntrancePickIDs).length < 1}
                                onClick={this.handleSetLabor.bind(this)}>设置劳务</Button>
                        <Button className="mr-16" type="primary" size="large"
                                value={1}
                                // ghost={this.props.LaborOrderSettleStatus !== 1}
                                disabled={this.props.RecordCount < 1}
                                onClick={this.handleExportList.bind(this)}>导出名单</Button>
                    </Col>
                </Row>
            </Form>
        );  
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>厂门口接站</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        {this.renderSearchForm()}
                        <Table
                            rowKey={(record, index) => index}
                            bordered={true}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.pageParam.pageSize,
                                current: this.props.pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            rowSelection={{
                                onChange: this.handleTableRowSelection,
                                selectedRowKeys: this.props.selectedRowKeys
                            }}
                            onRowClick={(record) => this.handleTableRowClick(record)}
                            columns={[{
                                title: '会员姓名',
                                dataIndex: 'UserName'
                               
                            }, {
                                title: '手机号码',
                                dataIndex: 'MobileNumber',
                                render: (text, record) => <span>{text.replace(/(\d{3})\d{4}/, '$1****')}</span>
                            }, {
                                title: '身份证号码',
                                dataIndex: 'IDCardNum',
                                render: (text, record) => <span>{text.replace(/(\d{4})\d{10}/, '$1**********')}</span>
                            }, {
                                title: '劳务名称',
                                dataIndex: 'LaborName'
                            }, {
                                title: '企业简称',
                                dataIndex: 'EnterpriseName'
                            }, {
                                title: '面试日期',
                                dataIndex: 'CheckInDate'
                            }, {
                                title: '预计到达时间',
                                dataIndex: 'PreCheckInTime'
                            }, {
                                title: '处理状态',
                                dataIndex: 'ProcessStatus',
                                render: (text, record) => <span>
                                        {text === 1 ? <span className='color-red' >未处理</span> : text === 2 ? <span className='color-orange' >处理中</span> : text === 3 ? <span className='color-green' >已处理</span> : <span className='color-gray' >已作废</span>}
                                        </span>
                            }, {
                                title: '处理说明',
                                dataIndex: 'ProcessRemark'
                            }, {
                                title: '提交人',
                                dataIndex: 'BrokerName'
                            }, {
                                title: '创建时间',
                                dataIndex: 'CreateTime',
                                sorter: true,
                                key: 'OrderByCreateTime',
                                sortOrder: this.props.orderParam.OrderByCreateTime
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
                    </Card>
                </div>
                <SetLaborModal 
                    ModalItem={this.props.ModalItems}
                    LaborSimpleList={this.props.LaborSimpleList}
                    handleModalCancel={this.handleModalCancel.bind(this)}
                    handleModalSubmit={this.handleModalSubmit.bind(this)} 
                    setParams={setParams}/>
                <FactoryReceptionModal 
                    ModalItem={this.props.FactoryModalItems}
                    LaborSimpleList={this.props.LaborSimpleList}
                    RecruitSimpleList={this.props.RecruitSimpleList}
                    handleModalCancel={this.handleFactoryModalCancel.bind(this)}
                    handleFactoryModalSubmit={this.handleFactoryModalSubmit.bind(this)} 
                    />
            </div>
        );
    }
}

const getFormProps = (props) => {
    let result = {};
    let test = ['CheckInDate', 'UserName', 'MobileNumber', 'IDCardNumber', 'EnterpriseName', 'ProcessStatus'];
    for (let key in test) {
        result[test[key]] = props[test[key]];

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
})(FactoryReception);