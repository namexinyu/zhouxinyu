import React from 'react';
import { Row, Form, Col, Input, Button, Icon, Select, Cascader, DatePicker, Table, Switch, Modal, Radio, message } from 'antd';
import { browserHistory } from 'react-router';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from 'ACTION/resetQueryParams';
import LaborAction from 'ACTION/Business/Labor/LaborAction';
import translateParamPost from 'ACTION/translateParamPost';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';

const {
    getLaborBossCheckList,
    checkLaborBoss
} = LaborAction;

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { Column, ColumnGroup } = Table;
const RadioGroup = Radio.Group;

class OwnerCheck extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkVisible: false,
            showTableSpin: false,
            checkValue: 1
        };
    }
    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.getLaborBossCheckList(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.page !== this.props.page || nextProps.pageSize !== this.props.pageSize || nextProps.o_createTimeOrder !== this.props.o_createTimeOrder || nextProps.o_modifyTimeOrder !== this.props.o_modifyTimeOrder || nextProps.laborBossStatus !== this.props.laborBossStatus) {
            this.getLaborBossCheckList(nextProps);
        }
        if (nextProps.getLaborBossCheckListFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_boss_check', 'getLaborBossCheckListFetch', 'close');
            this.setState({
                showTableSpin: false
            });
        }
        if (nextProps.getLaborBossCheckListFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_boss_check', 'getLaborBossCheckListFetch', 'close');
            this.setState({
                showTableSpin: false
            });
            message.error(nextProps.getLaborBossCheckListFetch.response.Desc);
        }
        if (nextProps.checkLaborBossFetch.status === 'success') {
            setFetchStatus('state_servicer_labor_boss_check', 'checkLaborBossFetch', 'close');
            message.success('审核操作成功');
            this.setState({
                checkVisible: false,
                checkValue: 1
            });
            this.getLaborBossCheckList(nextProps);
        }
        if (nextProps.checkLaborBossFetch.status === 'error') {
            setFetchStatus('state_servicer_labor_boss_check', 'checkLaborBossFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.checkLaborBossFetch.response.Desc
            });
        }
    }
    getLaborBossCheckList(props) {
        getLaborBossCheckList(Object.assign(
            {
                RecordIndex: (props.page - 1) * props.pageSize,
                RecordSize: props.pageSize,
                LBossStatus: props.laborBossStatus
            },
            translateParamPost.query({
                CreateTime: props.q_laborBossCreateTime.value ? props.q_laborBossCreateTime.value.format('YYYY-MM-DD') : '',
                LBossName: props.q_laborBossName.value || '',
                MobileNum: props.q_laborBossMobile.value || ''
            }),
        ));
    }
    handleSearch() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                if (this.props.page === 1) {
                    this.getLaborBossCheckList(this.props);
                } else {
                    setParams('state_servicer_labor_boss_check', {
                        page: 1
                    });
                }
            }
        });
    }
    handleReset() {
        resetQueryParams('state_servicer_labor_boss_check');
    }
    handleTableChange(pagination, filters, sorter) {
        if (sorter) {
            if (sorter.columnKey) {
                setParams('state_servicer_labor_boss_check', {
                    page: 1,
                    [sorter.columnKey]: (sorter.columnKey ? sorter.order : false)
                });
            } else {
                setParams('state_servicer_labor_boss_check', {
                    page: 1,
                    o_createTimeOrder: false,
                    o_modifyTimeOrder: false
                });

            }

        }
        let page = pagination.current;
        let pageSize = pagination.pageSize;
        setParams('state_servicer_labor_boss_check', {
            page: page,
            pageSize: pageSize
        });
    }
    handleChangeStatus(value) {
        if (this.props.laborBossStatus !== value) {
            setParams('state_servicer_labor_boss_check', {
                page: 1,
                laborBossStatus: value
            });
        }
    }
    handleCheck(record) {
        getClient(uploadRule.laborBossCertPicture).then((client) => {
            let laborBossIdCardPositive = record.IDCardPhoto1Url;
            let laborBossIdCardOpposite = record.IDCardPhoto2Url;
            if (record.IDCardPhoto1Url) {
                setParams('state_servicer_labor_boss_check', {
                    laborBossIdCardPositive: [{
                        status: 'done',
                        uid: laborBossIdCardPositive,
                        name: laborBossIdCardPositive,
                        url: client.signatureUrl(laborBossIdCardPositive),
                        response: {
                            name: laborBossIdCardPositive
                        }
                    }]
                });
            } else {
                setParams('state_servicer_labor_boss_check', {
                    laborBossIdCardPositive: []
                });
            }
            if (record.IDCardPhoto2Url) {
                setParams('state_servicer_labor_boss_check', {
                    laborBossIdCardOpposite: [{
                        status: 'done',
                        uid: laborBossIdCardOpposite,
                        name: laborBossIdCardOpposite,
                        url: client.signatureUrl(laborBossIdCardOpposite),
                        response: {
                            name: laborBossIdCardOpposite
                        }
                    }]
                });
            } else {
                setParams('state_servicer_labor_boss_check', {
                    laborBossIdCardOpposite: []
                });
            }
        });
        setParams('state_servicer_labor_boss_check', {
            currentLaborBoss: record,
            noPassReason: ''

        });
        this.setState({
            checkVisible: true,
            checkValue: 1
        });
    }
    handleReEdit(record) {
        browserHistory.push({
            pathname: '/bc/servicer/owner/edit/' + record.LBossID,
            query: {
                checkId: record.LBAuditID,
                cooperStatus: record.CooperStatus,
                laborBossIdCard: record.IDCardNum,
                laborBossIdCardPositive: encodeURIComponent(record.IDCardPhoto1Url),
                laborBossIdCardOpposite: encodeURIComponent(record.IDCardPhoto2Url),
                laborBossName: encodeURIComponent(record.LBossName),
                laborBossMobile: record.MobileNum
            }
        });
    }
    handleOk() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) return;
            checkLaborBoss({
                AuditResult: this.state.checkValue === 1 ? 3 : (this.state.checkValue === 2 ? 2 : ''),
                Desc: this.props.noPassReason.value,
                LBAuditID: this.props.currentLaborBoss.LBAuditID,
                LBossID: this.props.currentLaborBoss.LBossID
            });
        });

    }
    handleCloseCheck() {
        this.setState({
            checkVisible: false
        });
    }
    handleCheckChange(e) {
        this.setState({
            checkValue: e.target.value
        });
    }
    handleSeeLog() {
        browserHistory.push({
            pathname: '/bc/log/4'
        });
    }
    render() {
        const { recordList, recordCount, pageSize, page, laborBossStatus, currentLaborBoss, laborBossIdCardPositive, laborBossIdCardOpposite } = this.props;
        const { showTableSpin, checkVisible, checkValue } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>大老板审核</h1>
                </div>
                <Row>
                    <div className="container-fluid mt-24">
                        <div className="container bg-white">
                            <Form
                                className="ant-advanced-search-form"
                            >
                                <Row gutter={40}>
                                    <Col span={8} key={1}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="姓名">
                                            {getFieldDecorator('q_laborBossName', {
                                                rules: [
                                                    {
                                                        pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                                        message: '姓名为中文或英文'
                                                    }
                                                ]
                                            })(<Input placeholder="请输入大老板姓名" type="text" />)}
                                        </FormItem>

                                    </Col>
                                    <Col span={8} key={2}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="联系电话">
                                            {getFieldDecorator('q_laborBossMobile', {
                                                rules: [
                                                    {
                                                        pattern: /^1[3-9][0-9]\d{8}$/,
                                                        message: '请输入11位手机号'
                                                    }
                                                ]
                                            })(<Input placeholder="请输入大老板联系电话" type="tel" />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8} key={3}>
                                        <FormItem {...{
                                            labelCol: { span: 5 },
                                            wrapperCol: { span: 19 }
                                        }} label="创建时间">
                                            {getFieldDecorator('q_laborBossCreateTime', {
                                                rules: []
                                            })(<DatePicker />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'right' }}>
                                        <Button type="primary" htmlType="button" onClick={this.handleSearch.bind(this)}>查询</Button>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset.bind(this)}>重置</Button>
                                    </Col>
                                </Row>
                            </Form>
                            <Row className="mt-24">
                                <Button type={laborBossStatus === 0 ? 'primary' : 'default'} htmlType="button" onClick={() => this.handleChangeStatus(0)}>全部大老板({this.props.recordCount})</Button>
                                <Button type={laborBossStatus === 1 ? 'primary' : 'default'} htmlType="button" className="ml-8" onClick={() => this.handleChangeStatus(1)}>待审核({this.props.AuditCount})</Button>
                                <Button type={laborBossStatus === 2 ? 'primary' : 'default'} htmlType="button" className="ml-8" onClick={() => this.handleChangeStatus(2)}>已拒绝({this.props.RejectCount})</Button>
                            </Row>
                            <Row className="mt-24">
                                <div className="float-right text-right">
                                    <Button htmlType="button" onClick={this.handleSeeLog}>查看日志</Button>
                                </div>
                            </Row>
                            <Row className="mt-24">
                                <Table rowKey={record => record.LBAuditID.toString()}
                                    dataSource={recordList}
                                    pagination={{
                                        total: recordCount,
                                        defaultPageSize: pageSize,
                                        defaultCurrent: page,
                                        current: page,
                                        pageSize: pageSize,
                                        showTotal: (total, range) => {
                                            return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                        },
                                        showSizeChanger: true,
                                        showQuickJumper: true
                                    }}
                                    loading={showTableSpin}
                                    onChange={this.handleTableChange.bind(this)}>
                                    <Column
                                        title="创建时间"
                                        dataIndex="CreateTime"
                                    />
                                    <Column
                                        title="姓名"
                                        dataIndex="LBossName"
                                    />
                                    <Column
                                        title="联系电话"
                                        dataIndex="MobileNum"
                                    />
                                    <Column
                                        title="身份证号"
                                        dataIndex="IDCardNum"
                                    />
                                    <Column
                                        title="审核状态"
                                        dataIndex="AuditStatus"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {record.AuditStatus === 1 ? '待审核' : (record.AuditStatus === 2 ? '已拒绝' : '-')}
                                                </div>
                                            );
                                        }}
                                    />
                                    <Column
                                        title="备注"
                                        dataIndex="AuditRemark"
                                    />
                                    <Column
                                        title="操作"
                                        dataIndex="operate"
                                        render={(text, record, index) => {
                                            return (
                                                <div>
                                                    {record.AuditStatus === 1 && <a href="javascript:void(0)" onClick={() => this.handleCheck(record)}>审核</a>}
                                                    {(record.AuditStatus === 2) && <a href="javascript:void(0)" onClick={() => this.handleReEdit(record)}>重新编辑</a>}
                                                </div>
                                            );
                                        }}
                                    />
                                </Table>
                            </Row>
                        </div>
                    </div>
                </Row>
                <Modal
                    title="审核"
                    visible={checkVisible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCloseCheck.bind(this)}
                >
                    <Row>
                        <p>姓名：{currentLaborBoss.LBossName}</p>
                        <p>联系电话：{currentLaborBoss.MobileNum}</p>
                        <p>身份证号：{currentLaborBoss.IDCardNum}</p>
                    </Row>
                    <Row className="mt-24">
                        <Col span={6} key={1}>
                            <AliyunUpload id={'laborBossIdCardPositive'} accept="image/jpeg,image/png" disabled={true}
                                listType="picture-card" defaultFileList={laborBossIdCardPositive} maxNum={1} />
                            <p>身份证正面</p>
                        </Col>
                        <Col span={6} key={2}>
                            <AliyunUpload id={'laborBossIdCardOpposite'} accept="image/jpeg,image/png" disabled={true}
                                listType="picture-card" defaultFileList={laborBossIdCardOpposite} maxNum={1} />
                            <p>身份证反面</p>
                        </Col>
                    </Row>
                    <Row className="mt-24">
                        <RadioGroup onChange={this.handleCheckChange.bind(this)} value={checkValue}>
                            <Radio value={1}>审核通过</Radio>
                            <Radio value={2}>审核不通过</Radio>
                        </RadioGroup>
                    </Row>
                    {checkValue === 2 && <Row className="mt-24">
                        <Col span={24} key={1}>
                            <FormItem {...{
                                labelCol: { span: 4 },
                                wrapperCol: { span: 19 }
                            }} label="拒绝原因">
                                {getFieldDecorator('noPassReason', {
                                    rules: [
                                        {
                                            required: checkValue === 2 ? true : false,
                                            message: '拒绝原因必填'
                                        },
                                        {
                                            min: 5,
                                            message: '原因不能少于5个字'
                                        }
                                    ]
                                })(<Input placeholder="请输入拒绝原因，至少5个字" type="text" />)}
                            </FormItem>
                        </Col>
                    </Row>}
                </Modal>
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields: (props) => {
        return {
            q_laborBossName: props.q_laborBossName,
            q_laborBossMobile: props.q_laborBossMobile,
            q_laborBossCreateTime: props.q_laborBossCreateTime,
            noPassReason: props.noPassReason
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_servicer_labor_boss_check', fields);
    }

})(OwnerCheck);