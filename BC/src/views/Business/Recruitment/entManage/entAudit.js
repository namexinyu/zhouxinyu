import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Modal,
    Table,
    Button,
    message,
    DatePicker
} from 'antd';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import CommonAction from 'ACTION/Business/Common';
import {browserHistory} from "react-router";
import EnterpriseAction from 'ACTION/Business/Recruit/Enterprise';
import {checkEnt} from 'SERVICE/Business/Recruitment/Enterprise';
import {AuditStatusNew, AuditStatusNewColor} from 'CONFIG/EnumerateLib/Mapping_Order';
import {Gender} from "CONFIG/EnumerateLib/Mapping_Recruit";

const {getCheckList} = EnterpriseAction;

const {getLaborSimpleList, getRecruitSimpleList} = CommonAction;
const FormItem = Form.Item;
const STATE_NAME = 'state_business_recruitment_ent_audit';

const SearchForm = Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => props.setParams('queryParams', fields)
})(({handleFormSubmit, handleFormReset, form, common}) => {
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 16}};

    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            form.validateFields((err, fieldsValue) => {
                console.log(err, fieldsValue);
                if (err) return;
                handleFormSubmit(fieldsValue);
            });
        }}>
            <Row type="flex" justify="space-between">
                <Col span={6}>
                    <FormItem {...formItemLayout} label="企业简称">
                        {getFieldDecorator('EntShortName')(<Input placeholder='请输入' maxLength="50"/>)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="创建日期">
                        {getFieldDecorator('Date')(
                            <DatePicker.RangePicker style={{width: '100%'}} allowClear={false}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={4} offset={8} style={{display: 'inline-flex', justifyContent: 'space-around'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
});

export default class EntAudit extends React.PureComponent {
    state = {
        AuditModal: {}
    };

    setParams = (field, state) => {
        if (typeof field === 'object') {
            setParams(STATE_NAME, field);
        } else {
            let s = state;
            if (typeof state === 'object') s = {...this.props[field], ...state};
            setParams(STATE_NAME, {[field]: s});
        }
    };

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.queryTableList();
        }
        getLaborSimpleList();
        getRecruitSimpleList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam || this.props.auditStatus !== nextProps.auditStatus) {
            this.queryTableList(nextProps);
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = [];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v || '';
            }
            return pre;
        }, {});
        if (query.Date && query.Date instanceof Array) {
            query.CreateTimeBegin = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.CreateTimeEnd = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
            delete query.Date;
        }
        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1]) || Number.isNaN(data[1])) delete query[data[0]];
        });
        return query;
    }

    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        let orderParam = {}; // 排序
        getCheckList({
            ...this.obtainQueryParam(props), ...orderParam,
            auditStatus: props.auditStatus,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    handleChangeAuditStatus = (e) => {
        this.setParams({auditStatus: Number(e.target.name)});
    };

    handleTabRowClick = (record, index, event) => {
        event.preventDefault();
        switch (event.target.name) {
            case 'edit-all':
                browserHistory.push({
                    pathname: '/bc/recruitment/ent-edit',
                    query: {id: record.RecruitTmpAuditID, entName: record.EntShortName, type: 2}
                });
                break;
            case 'audit':
                this.setState({AuditModal: {Visible: true, RecruitTmpAuditID: record.RecruitTmpAuditID}});
                break;
        }
    };

    handleAuditModalOperate = (type) => (e) => {
        switch (type) {
            case 'AuditStatus':
                this.setState(preState => ({AuditModal: {...preState.AuditModal, AuditStatus: e}}));
                break;
            case 'AuditRemark':
                e.persist();
                this.setState(preState => ({AuditModal: {...preState.AuditModal, AuditRemark: e.target.value}}));
                break;
            case 'ok':
                this.setState(preState => ({AuditModal: {...preState.AuditModal, ConfirmLoading: true}}));
                let AuditModal = this.state.AuditModal;
                checkEnt({
                    AuditRemark: AuditModal.AuditRemark,
                    AuditStatus: Number(AuditModal.AuditStatus || '3'),
                    RecruitTmpAuditID: AuditModal.RecruitTmpAuditID
                }).then(res => {
                    message.success('审核完成');
                    this.queryTableList();
                    this.setState({AuditModal: {}});
                }).catch(err => {
                    message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '审核失败');
                    this.setState(preState => ({AuditModal: {...preState.AuditModal, ConfirmLoading: false}}));
                });
                break;
            case 'cancel':
                this.setState({AuditModal: {}});
                break;
        }
    };

    render() {
        const setParams = this.setParams;
        const {RecordCount, RecordList, RecordListLoading, queryParams, common, pageParam, auditStatus, ToAuditCount, TotalCount, RejectedCount} = this.props;
        const {AuditModal} = this.state;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>审核企业</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Modal title="企业审核" visible={AuditModal.Visible}
                           maskClosable={false}
                           onCancel={this.handleAuditModalOperate('cancel')}
                           onOk={this.handleAuditModalOperate('ok')}
                           confirmLoading={AuditModal.ConfirmLoading}>
                        <div style={{display: 'flex'}}>
                            <label style={{flex: '0 1 80px', textAlign: 'right', alignSelf: 'center'}}>审核状态：</label>
                            <Select onChange={this.handleAuditModalOperate('AuditStatus')} style={{width: 150}}
                                    value={AuditModal.AuditStatus || '3'}>
                                <Select.Option value='3'>通过</Select.Option>
                                <Select.Option value='2'>拒绝</Select.Option>
                            </Select>
                        </div>
                        <div style={{display: 'flex', marginTop: 8}}>
                            <label style={{flex: '0 1 80px', textAlign: 'right'}}>备注：</label>
                            <Input.TextArea style={{width: '50%'}} placeholder="输入备注"
                                            value={AuditModal.AuditRemark} name='Remark'
                                            onChange={this.handleAuditModalOperate('AuditRemark')}/>
                        </div>
                    </Modal>
                    <Card bordered={false}>
                        <SearchForm
                            queryParams={queryParams}
                            setParams={setParams}
                            common={common}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>

                        <Row className="mt-16 mb-16">
                            <Button type={auditStatus === 0 ? 'primary' : ''} name='0'
                                    onClick={this.handleChangeAuditStatus}>{`全部企业(${TotalCount || 0})`}</Button>
                            <Button type={auditStatus === 1 ? 'primary' : ''} className="ml-8" name='1'
                                    onClick={this.handleChangeAuditStatus}>{`待审核(${ToAuditCount || 0})`}</Button>
                            <Button type={auditStatus === 2 ? 'primary' : ''} className="ml-8" name='2'
                                    onClick={this.handleChangeAuditStatus}>{`已拒绝(${RejectedCount || 0})`}</Button>
                        </Row>

                        <Table
                            rowKey={'RecruitTmpAuditID'} bordered={true} size='small'
                            onRowClick={this.handleTabRowClick}
                            pagination={{
                                total: RecordCount,
                                pageSize: pageParam.pageSize,
                                current: pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                pageSizeOptions: ['10', '50', '100', '200'],
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            columns={[
                                {title: '创建时间', dataIndex: 'CreateTime', width: 150},
                                {title: '企业简称', dataIndex: 'PositionName', width: 150},
                                {title: '综合薪资', dataIndex: 'SalaryStr', render: text => <pre>{text}</pre>},
                                // {
                                //     title: '补贴', dataIndex: 'SubsidyList',
                                //     render: (text, record) => text && text.map(item =>
                                //         <div key={item.RecruitSubsidyID}>
                                //             {Gender[item.Gender]}:{item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                //         </div>
                                //     )
                                // },
                                // {
                                //     title: '收费', dataIndex: 'EnrollFeeInfo',
                                //     render: text => text && text.length ? text.map((item, index) =>
                                //         <div
                                //             key={index}>{Gender[item.Gender]} {item.ChargeAmount / 100}元</div>
                                //     ) : '无'
                                // },
                                // {title: '年龄|性别', dataIndex: 'GenderRatioStr', render: text => <pre>{text}</pre>},
                                {
                                    title: '标签', dataIndex: 'Tags',
                                    render: text => text && text instanceof Array && text.length ?
                                        text.reduce((pre, cur, index) => cur ? pre + (index === 0 ? '' : ',') + cur.TagName : pre, '') : ''
                                },
                                {
                                    title: '审核状态', dataIndex: 'AuditStatus',
                                    render: text => <span
                                        className={AuditStatusNewColor[text]}>{AuditStatusNew[text]}</span>
                                },
                                {title: '备注', dataIndex: 'Remark'},
                                {
                                    title: '操作', dataIndex: 'xx',
                                    render: (text, record) => record.AuditStatus === 1 ?
                                        <a name="audit">审核</a> : <a name="edit-all">重新编辑</a>
                                }
                            ]}
                            dataSource={RecordList} loading={RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                setParams(change);
                            }}/>
                    </Card>
                </div>
            </div>
        );
    }
}