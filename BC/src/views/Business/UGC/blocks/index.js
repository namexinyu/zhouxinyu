import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Modal,
    Select,
    Table,
    Button,
    Spin,
    Switch,
    DatePicker,
    Input,
    message
} from 'antd';
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import UGCAction from 'ACTION/Business/UGC';
import UGCAudit from './UGCAudit';
import {getUGCCurrentInfo, updateUGCInfo} from 'SERVICE/Business/UGC';
import {UGCType, UGCAuditType} from "CONFIG/EnumerateLib/Mapping_UGC";
import ossConfig from 'CONFIG/ossConfig';

const IMG_PATH = ossConfig.getImgPath();

const {getUGCList} = UGCAction;
const info = Modal.info;
const FormItem = Form.Item;
const STATE_NAME = 'state_business_ugc';
const UGCSelect = Object.entries(UGCType).map(item =>
    <Select.Option key={item[0]} value={item[0].toString()}>{item[1].label}</Select.Option>);

const AuditStatus = {
    1: {label: '待审核', color: 'color-orange'},
    2: {label: '审核通过', color: 'color-green'},
    3: {label: '审核不通过', color: 'color-red'}
};

const AuditStatusSelect = Object.entries(AuditStatus).map(item =>
    <Select.Option key={item[0]} value={item[0].toString()}>{item[1].label}</Select.Option>);

const SearchForm = Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => props.setParams('queryParams', fields)
})(({handleFormSubmit, handleFormReset, form}) => {
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
                    <FormItem {...formItemLayout} label="开始日期">
                        {getFieldDecorator('CreateTimeStart')(
                            <DatePicker style={{width: '100%'}} allowClear={false}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="结束日期">
                        {getFieldDecorator('CreateTimeEnd')(
                            <DatePicker style={{width: '100%'}} allowClear={false}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="申请人">
                        {getFieldDecorator('UserName')(
                            <Input placeholder='请输入' maxLength="20"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="UGC类型">
                        {getFieldDecorator('UGCType')(
                            <Select>
                                <Select.Option value='0'>全部</Select.Option>
                                {UGCSelect}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="企业简称">
                        {getFieldDecorator('EnterpriseName')(
                            <Input placeholder='请输入' maxLength="64"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="审核状态">
                        {getFieldDecorator('AuditStatus')(
                            <Select>
                                <Select.Option value={'0'}>全部</Select.Option>
                                {AuditStatusSelect}
                            </Select>
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

export default class Ent extends React.PureComponent {
    state = {AuditModal: {}};

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
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['AuditStatus', 'UGCType'];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v || '';
            }
            return pre;
        }, {});
        query.CreateTimeStart = query.CreateTimeStart ? query.CreateTimeStart.format('YYYY-MM-DD') : '';
        query.CreateTimeEnd = query.CreateTimeEnd ? query.CreateTimeEnd.format('YYYY-MM-DD') : '';
        return query;
    }

    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        let orderParam = {}; // 排序
        if (props.orderParam && Object.keys(props.orderParam).length) {
            let orderKey = Object.keys(props.orderParam)[0];
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 2 : 1;
        }
        if (orderParam.OrderByAuditTime) orderParam.OrderByCreateTime = 1;
        if (orderParam.OrderByCreateTime) orderParam.OrderByAuditTime = 1;
        getUGCList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    handleTabRowClick = (record, index, event) => {
        event.preventDefault();
        let name = event.target.name;
        if (name === 'audit') {
            let ugc = UGCType[record.UGCType];
            if (ugc) {
                let type = ugc.type;
                if (type !== UGCAuditType.TYPE_IMG) {
                    getUGCCurrentInfo({UserUGCID: record.UserUGCID})
                        .then(res => this.showUGC(record, type, res.Data))
                        .catch(err => message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败'));
                } else {
                    this.showUGC(record, type);
                }
            } else {
                message.error('数据错误');
            }
        } else if (name && name.indexOf('-img')) {
            let i = Number(name.split('-')[0]);
            let path = record.UGCPicPath.split('|')[i];
            if (path) info({content: <img src={IMG_PATH + path} style={{maxWidth: '85%', maxHeight: '85%'}}/>});
        }
    };

    showUGC = (record, type, newData) => {
        let params = {};
        params.UGCType = {value: record.UGCType.toString()};
        if (record.AuditStatus === 1) {
            params.ModifyContent = {value: ''};
            params.AuditStatus = {value: '2'};
            params.Remark = {value: ''};
        } else {
            params.ModifyContent = {value: record.ModifyContent};
            params.AuditStatus = {value: record.AuditStatus.toString()};
            params.Remark = {value: record.Remark};
        }
        this.setState({
            AuditModal: {Visible: true, record, type, params, newData}
        });
    };

    handleAuditModalOk = () => {
        let ugcAudit = this.refs.ugcAudit;
        ugcAudit.validateFields((err, fieldsValue) => {
            console.log(err, fieldsValue);
            if (err) return;
            let values = {
                ...fieldsValue,
                isMust: this.state.AuditModal.params.isMust,
                UGCType: this.state.AuditModal.params.UGCType.value
            };
            let param = UGCAudit.obtainQueryParams(values);

            this.setState(preState => ({AuditModal: {...preState.AuditModal, ConfirmLoading: true}}));
            updateUGCInfo({...param, UserUGCID: this.state.AuditModal.record.UserUGCID}).then(res => {
                this.queryTableList();
                this.handleAuditModalCancel();
            }).catch(err => {
                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
                this.setState(preState => ({AuditModal: {...preState.AuditModal, ConfirmLoading: false}}));
            });
        });
    };

    handleAuditModalCancel = () => {
        this.setState({AuditModal: {}});
    };

    handleSetUGCParams = (params) => {
        if (params.target) {
            params.preventDefault();
            params = {[params.target.name]: params.target.checked};
        }
        this.setState(preState => ({
            AuditModal: {
                ...preState.AuditModal,
                params: {...preState.AuditModal.params, ...params}
            }
        }));
    };

    render() {
        const setParams = this.setParams;
        const {RecordCount, RecordList, RecordListLoading, queryParams, pageParam, orderParam} = this.props;
        const {AuditModal} = this.state;

        return (
            <div>
                <div className="ivy-page-title">
                    <h1>UGC审核</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <Modal title="UGC审核" width='80%'
                               visible={AuditModal.Visible}
                               footer={AuditModal.record && AuditModal.record.AuditStatus === 1 ? undefined : null}
                               maskClosable={false}
                               onCancel={this.handleAuditModalCancel}
                               onOk={this.handleAuditModalOk}
                               confirmLoading={AuditModal.ConfirmLoading}>
                            <UGCAudit
                                ref='ugcAudit'
                                setParams={this.handleSetUGCParams}
                                params={AuditModal.params}
                                AuditModal={AuditModal}
                            />
                        </Modal>
                        <SearchForm
                            queryParams={queryParams}
                            setParams={setParams}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Table
                            rowKey={'UserUGCID'} bordered={true} size='small' scroll={{x: 1500}}
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
                                {
                                    title: '上传时间', dataIndex: 'CreateTime',
                                    fixed: 'left', width: 150,
                                    sorter: true, key: 'OrderByCreateTime',
                                    sortOrder: orderParam.OrderByCreateTime
                                },
                                {title: '申请人', dataIndex: 'UserName', fixed: 'left', width: 120},
                                {title: '企业简称', dataIndex: 'EnterpriseName'},
                                {
                                    title: '图片',
                                    dataIndex: 'UGCPicPath',
                                    render: text => text ? <div style={{display: 'flex'}}>
                                        {text.split('|').map((path, index) =>
                                            <div style={{padding: 5, cursor: 'pointer'}} key={index}>
                                                <img name={index + '-img'}
                                                     style={{width: 50, height: 50}}
                                                     src={IMG_PATH + path}/>
                                            </div>
                                        )}
                                    </div> : ''
                                },
                                {title: '纠错内容', dataIndex: 'SubmitContent'},
                                {
                                    title: '类型', dataIndex: 'UGCType',
                                    render: text => UGCType[text] ?
                                        <span>{UGCType[text].label}</span> : text
                                },
                                {
                                    title: '审核状态',
                                    dataIndex: 'AuditStatus',
                                    render: text => AuditStatus[text] ?
                                        <span
                                            className={AuditStatus[text].color}>{AuditStatus[text].label}</span> : text
                                },
                                {title: '审核人', dataIndex: 'EmployeeName'},
                                {
                                    title: '审核时间', dataIndex: 'AuditTime',
                                    sorter: true, key: 'OrderByAuditTime',
                                    sortOrder: orderParam.OrderByAuditTime
                                },
                                {title: '备注', dataIndex: 'Remark'},
                                {
                                    title: '操作', dataIndex: 'xx',
                                    render: (text, record) => <a name="audit">
                                        {record.AuditStatus === 1 ? '审核' : '查看'}</a>
                                }
                            ]}
                            dataSource={RecordList} loading={RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                if (sorter.columnKey) change.orderParam = {[sorter.columnKey]: sorter.order};
                                setParams(change);
                            }}/>
                    </Card>
                </div>
            </div>
        );
    }
}