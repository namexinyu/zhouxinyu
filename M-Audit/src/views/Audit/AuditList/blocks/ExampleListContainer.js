import React from 'react';
import { Card, Row, Col, Button, Icon, Form, Input, Modal, Select, message, Table } from 'antd';
import CommonAction from 'ACTION/Common';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetState from 'ACTION/resetState';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

const {
    getExamplePictureRecords,
    editExamplePicture
} = AuditOperateAction;
const {
    getEnterpriseSimpleList
} = CommonAction;
const FormItem = Form.Item;
const Option = Select.Option;
const { Column, ColumnGroup } = Table;

class ExampleListContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editVisiable: false,
            showTableSpin: false
        };
    }
    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getEnterpriseSimpleList();
            this.getExamplePictureRecords(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.page !== this.props.page || nextProps.pageSize !== this.props.pageSize) {
            this.getExamplePictureRecords(nextProps);
        }
        if (nextProps.editExamplePictureFetch.status === 'success') {
            setFetchStatus('state_audit_example_list', 'editExamplePictureFetch', 'close');
            message.success('编辑成功');
            this.setState({
                editVisiable: false
            });
            this.getExamplePictureRecords(nextProps);
        }
        if (nextProps.editExamplePictureFetch.status === 'error') {
            setFetchStatus('state_audit_example_list', 'editExamplePictureFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.editExamplePictureFetch.response.Desc
            });
        }
        if (nextProps.getExamplePictureRecordsFetch.status === 'success') {
            setFetchStatus('state_audit_example_list', 'getExamplePictureRecordsFetch', 'close');
        }
        if (nextProps.getExamplePictureRecordsFetch.status === 'error') {
            setFetchStatus('state_audit_example_list', 'getExamplePictureRecordsFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.getExamplePictureRecordsFetch.response.Desc
            });
        }
    }
    getExamplePictureRecords(props) {
        getExamplePictureRecords({
            EntID: props.searchEntId && props.searchEntId.value && props.searchEntId.value.value ? parseInt(props.searchEntId.value.value, 10) : -9999,
            RecordIndex: (props.page - 1) * props.pageSize,
            RecordSize: props.pageSize
        });
    }
    handleTableChange(pagination, filters, sorter) {
        let page = pagination.current;
        let pageSize = pagination.pageSize;
        setParams('state_audit_example_list', {
            page: page,
            pageSize: pageSize
        });
    }
    handleCreateExample() {
        this.setState({
            editVisiable: true
        });
        setParams('state_audit_example_list', {
            currentExampleInfo: ''
        });
    }
    handleEditExample(record) {
        setParams('state_audit_example_list', {
            currentExampleInfo: record,
            editEntId: {
                value: {
                    value: record.EntID.toString(),
                    text: record.EntName
                }
            }
        });
        getClient(uploadRule.auditExamplePic).then((client) => {
            if (record.CardPicSamplePath) {
                setParams('state_audit_example_list', {
                    editWorkerCardPic: [{
                        status: 'done',
                        uid: record.CardPicSamplePath,
                        name: record.CardPicSamplePath,
                        url: client.signatureUrl(record.CardPicSamplePath),
                        response: {
                            name: record.CardPicSamplePath
                        }
                    }]
                });
            } else {
                setParams('state_audit_example_list', {
                    editWorkerCardPic: []
                });
            }
            if (record.CheckinPicSamplePath) {
                setParams('state_audit_example_list', {
                    editAttendancePic: [{
                        status: 'done',
                        uid: record.CheckinPicSamplePath,
                        name: record.CheckinPicSamplePath,
                        url: client.signatureUrl(record.CheckinPicSamplePath),
                        response: {
                            name: record.CheckinPicSamplePath
                        }
                    }]
                });
            } else {
                setParams('state_audit_example_list', {
                    editAttendancePic: []
                });
            }
        });
        this.setState({
            editVisiable: true
        });
    }
    handleUploadChange(id, fileList) {
        setParams('state_audit_example_list', {
            [id]: fileList
        });
    }
    handleSearch() {
        this.props.form.validateFieldsAndScroll(['searchEntId'], (errors, values) => {
            if (!errors) {
                if (this.props.page === 1) {
                    this.getExamplePictureRecords(this.props);
                } else {
                    setParams('state_audit_example_list', {
                        page: 1
                    });
                }
            }
        });
    }
    handleModalOk() {
        this.props.form.validateFieldsAndScroll(['editEntId'], (errors, values) => {
            if (!errors) {
                if (!this.props.editAttendancePic || !this.props.editAttendancePic[0] || !this.props.editAttendancePic[0].response) {
                    message.error('请上传考勤样例');
                    return false;
                }
                if (!this.props.editWorkerCardPic || !this.props.editWorkerCardPic[0] || !this.props.editWorkerCardPic[0].response) {
                    message.error('请上传工牌样例');
                    return false;
                }
                editExamplePicture({
                    CardPicSamplePath: this.props.editWorkerCardPic[0].response.name || '',
                    CheckinPicSamplePath: this.props.editAttendancePic[0].response.name || '',
                    EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId') || '',
                    EntID: this.props.editEntId.value && this.props.editEntId.value.value ? parseInt(this.props.editEntId.value.value, 10) : '',
                    EntSampleID: this.props.currentExampleInfo ? this.props.currentExampleInfo.EntSampleID : 0
                });
            }
        });
    }
    handleModalCancel() {
        this.setState({
            editVisiable: false
        });
        setParams('state_audit_example_list', {
            currentExampleInfo: ''
        });
    }
    render() {
        const { editWorkerCardPic, editAttendancePic, recordCount, pageSize, page, recordList } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { EnterpriseSimpleList } = this.props.commonState;
        const { showTableSpin } = this.state;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>样例设置</h1>
                </div>
                <Card bordered={false}>
                    <Row>
                        <Col span={24}>
                            <FormItem label="" style={{ float: 'right', textAlign: 'right' }}>
                                {getFieldDecorator('searchEntId', {
                                    rules: []
                                })(<AutoCompleteSelect allowClear={true} className="w-100" placeholder="请选择要查询的企业"
                                    optionsData={{ valueKey: 'EntID', textKey: 'EntName', dataArray: EnterpriseSimpleList }} />)}
                                <Button htmlType="button" type="primary" onClick={this.handleSearch.bind(this)} className="ml-8">查询</Button>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="mt-8">
                        <Button htmlType="button" type="primary" onClick={this.handleCreateExample.bind(this)}>新建样例</Button>
                    </Row>
                    <Row className="mt-24">
                        <Table rowKey={record => record.EntSampleID.toString()}
                            dataSource={recordList}
                            pagination={{
                                total: recordCount,
                                defaultPageSize: pageSize,
                                defaultCurrent: page,
                                current: page,
                                pageSize: pageSize,
                                showTotal: (total, range) => {
                                    return ('共' + Math.ceil(total / range[1]) + '页/' + total + '条数据');
                                },
                                showSizeChanger: true,
                                showQuickJumper: true
                            }}
                            loading={showTableSpin}
                            onChange={this.handleTableChange.bind(this)}>
                            <Column
                                title="企业"
                                dataIndex="EntName"
                            />
                            <Column
                                title="操作"
                                dataIndex="operate"
                                render={(text, record, index) => {
                                    return (
                                        <a href="javascript:void(0)" onClick={() => this.handleEditExample(record)}>编辑/修改</a>
                                    );
                                }}
                            />
                        </Table>
                    </Row>
                </Card>
                <Modal
                    title="编辑工牌样例"
                    visible={this.state.editVisiable}
                    onOk={this.handleModalOk.bind(this)}
                    onCancel={this.handleModalCancel.bind(this)}
                >
                    <Row gutter={40}>
                        <Col>
                            <FormItem {...{
                                labelCol: { span: 4 },
                                wrapperCol: { span: 20 }
                            }} label="企业名称">
                                {getFieldDecorator('editEntId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '企业必选'
                                        }
                                    ]
                                })(<AutoCompleteSelect allowClear={true} placeholder={' '}
                                    optionsData={{ valueKey: 'EntID', textKey: 'EntName', dataArray: EnterpriseSimpleList }} />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={40}>
                        <Col span={6} offset={3}>
                            <AliyunUpload id={'editWorkerCardPic'} accept="image/jpeg,image/png" oss={uploadRule.auditExamplePic}
                                listType="picture-card" defaultFileList={editWorkerCardPic} maxNum={1} uploadChange={this.handleUploadChange.bind(this)} />
                            <p>工牌样例</p>
                        </Col>
                        <Col span={6} offset={3}>
                            <AliyunUpload id={'editAttendancePic'} accept="image/jpeg,image/png" oss={uploadRule.auditExamplePic}
                                listType="picture-card" defaultFileList={editAttendancePic} maxNum={1} uploadChange={this.handleUploadChange.bind(this)} />
                            <p>考勤样例</p>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields: (props) => {
        return {
            searchEntId: props.searchEntId,
            editEntId: props.editEntId
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_audit_example_list', fields);
    }
})(ExampleListContainer);