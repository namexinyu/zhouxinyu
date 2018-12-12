import React from 'react';
import 'LESS/Business/OrderManage/interview-namelist.less';
import {
    Row,
    Col,
    Tabs,
    Card,
    Form,
    Badge,
    Input,
    Alert,
    Table,
    Icon,
    Button,
    DatePicker,
    message,
    Radio,
    Select,
    Modal,
    Popconfirm
} from 'antd';
import setParams from 'ACTION/setParams';
import SearchForm from './SearchForm';
import BindSubsidyModal from './BindSubsidyModal';
import resetState from 'ACTION/resetState';
import TagSelect from 'COMPONENT/TagSelect';
import CommonAction from 'ACTION/Business/Common';
import InterviewNameListAction from 'ACTION/Business/OrderManage/InterviewNameListAction';
import resetQueryParams from 'ACTION/resetQueryParams';
import {
    JFFInterviewStatus
} from 'CONFIG/EnumerateLib/Mapping_Order';
import setFetchStatus from 'ACTION/setFetchStatus';
import moment from 'moment';
import {CONFIG} from 'mams-com';
const {AppSessionStorage} = CONFIG;
const TabPane = Tabs.TabPane;
const {
    getInterviewList,
    BindSubsidy,
    ListSubsidy
} = InterviewNameListAction;
const {
    getRecruitSimpleList,
    getLaborSimpleList
} = CommonAction;
const STATE_NAME = 'state_business_interview_namelist';

class InterviewNameList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.queryDate = props.queryParams.Date.value.format('YYYY-MM-DD');
        this.employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
    }

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
        getRecruitSimpleList();
        getLaborSimpleList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam || this.props.tagParam !== nextProps.tagParam
        // || this.props.tabKey !== nextProps.tabKey
        ) {
            console.log('start search');
            
            this.queryTableList(nextProps);
        }

        if (nextProps.BindSubsidyFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'BindSubsidyFetch', 'close');
            let RecordList = nextProps.BindSubsidyFetch.response.Data.RecordList;
            let info = '绑定成功';
            if (RecordList && RecordList instanceof Array) {
                let successCount = 0;
                let failureCount = 0;
                for (let data of RecordList) {
                    if (data.Result === 1) {
                        successCount++;
                    } else {
                        failureCount++;
                    }
                }
                info = `${successCount}个名单绑定成功，${failureCount}个名单绑定失败`;
            }
            message.info(info);
            setParams(STATE_NAME, {
                selectedRowKeys: [],
                selectedRowTotal: 0,
                selectedRowBind: 0,
                selectedRowUnBind: 0,
                bindSubsidyRecruitTmp: {}
            });

            this.handleModalVisible(nextProps.BindSubsidyModalItem.Visible ? 'BindSubsidyModal' : 'ConfirmSubsidyModal');
            this.queryTableList(nextProps);
        } else if (nextProps.BindSubsidyFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'BindSubsidyFetch', 'close');
            message.error(nextProps.BindSubsidyFetch.response && nextProps.BindSubsidyFetch.response.Desc ? nextProps.BindSubsidyFetch.response.Desc : '绑定失败');
            this.setParams(nextProps.BindSubsidyModalItem.confirmLoading ? 'BindSubsidyModalItem' : 'ConfirmSubsidyModalItem', {confirmLoading: false});
        }

        if (nextProps.ListSubsidyFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'ListSubsidyFetch', 'close');
            this.setParams('BindSubsidyModalItem', {
                Visible: true,
                RecruitList: nextProps.ListSubsidyFetch.response.Data.Recruit || []
            });
        } else if (nextProps.ListSubsidyFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'ListSubsidyFetch', 'close');
        }
    }

    callback = (tabKey) => {
        setParams(STATE_NAME, {tabKey, pageParam: {...this.props.pageParam, currentPage: 1}});
    };

    handleModalVisible(modalName, Visible) {
        if (modalName === 'BindSubsidyModal' || modalName === 'ConfirmSubsidyModal') {
            if (Visible === true) {
                this.setParams(modalName + 'Item', {Visible});
            } else {
                resetState(STATE_NAME, modalName + 'Item');
            }
        }
    }

    handleBindSubsidyModalSubmit = () => {
        this.setParams('BindSubsidyModalItem', {
            confirmLoading: true
        });
        BindSubsidy({
            InterviewID: this.props.BindSubsidyModalItem.InterviewID,
            CurrRecruit: 2,
            RecruitID: this.props.BindSubsidyModalItem.selectedRecruit.RecruitID,
            BindSubsidyRemark: this.props.BindSubsidyModalItem.Remark || ''
        });
    };

    handleConfirmSubsidyModalSubmit = () => {
        this.setParams('ConfirmSubsidyModalItem', {
            confirmLoading: true
        });
        BindSubsidy({
            InterviewID: this.props.ConfirmSubsidyModalItem.InterviewID,
            CurrRecruit: 1
        });
    };

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        let selectedRowBind = 0;
        let selectedRowUnBind = 0;
        let bindSubsidyRecruitTmp = {};
        for (let row of selectedRows) {
            row.BindRecruitSubsidy === 2 ? selectedRowBind++ : selectedRowUnBind++;
            bindSubsidyRecruitTmp[row.RecruitTmpID] = row.RecruitTmpID;
        }
        setParams(STATE_NAME, {
            selectedRowKeys, selectedRows,
            selectedRowBind, selectedRowUnBind,
            bindSubsidyRecruitTmp
        });
    };

    handleTableRowClick = (record, index, event) => {
        const bindEnable = moment().isSame(this.queryDate, 'day');
        if (bindEnable || this.employeeId === 1 || true) {
            ListSubsidy({
                Date: this.props.queryParams.Date.value.format('YYYY-MM-DD'),
                RecruitTmpID: record.RecruitTmpID
            });
            this.setParams('BindSubsidyModalItem', {InterviewID: [record.InterviewID]});
        }
    };

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['PayType', 'BindRecruitSubsidy', 'SettleStatus'];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v;
            }
            return pre;
        }, {});
        if (query.Date) {
            query.InterviewTime = query.Date.format('YYYY-MM-DD');
            delete query.Date;
        }
        if (query.Recruit) {
            query.PositionName = query.Recruit.text;
            query.RecruitTmpID = query.Recruit.data ? query.Recruit.data.RecruitTmpID : null;
            if (query.RecruitTmpID) delete query.PositionName;
            delete query.Recruit;
        }

        if (query.Labor) {
            query.ShortName = query.Labor.text;
            query.LaborID = query.Labor.data ? query.Labor.data.LaborID : null;
            if (query.LaborID) delete query.ShortName;
            delete query.Labor;
        }

        if (props.tagParam) query.JFFInterviewStatus = [...props.tagParam];
        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1]) || Number.isNaN(data[1])) delete query[data[0]];
        });
        
        return query;
    }

    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        let orderParam = {};
        if (this.props.orderParam && Object.keys(this.props.orderParam).length) {
            let orderKey = Object.keys(this.props.orderParam)[0];
            orderParam[orderKey] = props.orderParam[orderKey] === 'ascend' ? 1 : 2;
        }
        const pageQueryParams = this.obtainQueryParam(props);
        getInterviewList({
            ...pageQueryParams, ...orderParam,
            IsAbnormal: pageQueryParams.BindRecruitSubsidy === -1 ? 2 : 0,
            BindRecruitSubsidy: pageQueryParams.BindRecruitSubsidy != null ? (pageQueryParams.BindRecruitSubsidy === -1 ? 0 : pageQueryParams.BindRecruitSubsidy) : 0,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => {
        this.queryDate = fieldsValue.Date.format('YYYY-MM-DD');
        this.setParams({
            selectedRowKeys: [],
            selectedRowBind: 0,
            selectedRowUnBind: 0,
            bindSubsidyRecruitTmp: {},
            pageParam: {
                ...this.props.pageParam,
                currentPage: 1
            }
        });
    };

    handleConfirmBindCurrentOrder = () => {
        const {
            selectedRowKeys,
            RecordList
        } = this.props;

        const selectedRowRecord = RecordList.filter(item => selectedRowKeys.indexOf(item.InterviewID) !== -1);

        const usefulRowRecord = selectedRowRecord.filter((item) => {
            return item.PayType !== 1 && (item.LaborOrder && item.LaborOrder.LaborOrderSubsidys && item.LaborOrder.LaborOrderSubsidys.length)
                && (item.Recruit && item.Recruit.RecruitSubsidys && item.Recruit.RecruitSubsidys.length);
        });
        
        if (usefulRowRecord.length) {
            // const usefulLaborOrderList = usefulRowRecord.map(item => item.LaborOrder);
            // const usefulRecruit = usefulRowRecord.map(item => item.Recruit);

            const exceptionItems = usefulRowRecord.filter(item => {
                const LaborOrder = item.LaborOrder;
                const Recruit = item.Recruit;
                const computedLaborOrderSubsidys = LaborOrder.LaborOrderSubsidys.reduce((wrap, cur, index) => {
                    if (cur.Gender === 0) {
                        return wrap.concat([
                            {
                                ...cur,
                                Gender: 1
                            },
                            {
                                ...cur,
                                Gender: 2
                            }
                        ]);
                    }
                    return wrap.concat(cur);
                }, []).reduce((wrap, cur, index) => {
                    if (wrap.filter(item => item.Gender === cur.Gender).length) {
                        const findedItem = wrap.filter(item => item.Gender === cur.Gender)[0];
                        return wrap.filter(item => item.Gender !== cur.Gender).concat({
                            ...findedItem,
                            SubsidyAmount: findedItem.SubsidyAmount + cur.SubsidyAmount,
                            SubsidyDay: Math.max(findedItem.SubsidyDay, cur.SubsidyDay)
                        });
                    }
                    return wrap.concat(cur);
                }, []);

                const MaleSubsidyList = computedLaborOrderSubsidys.filter(item => item.Gender === 1);
                const FemaleSubsidyList = computedLaborOrderSubsidys.filter(item => item.Gender === 2);

                let maleExpections = [];
                let femaleExpections = [];

                if (MaleSubsidyList.length) {
                    // 男性有效劳务报价最低补贴天数
                    const minMaleSubsidyDay = Math.min(...MaleSubsidyList.map(item => item.SubsidyDay));

                    // 男性有效劳务报价最高金额
                    const maxMaleSubsidyAmount = Math.max(...MaleSubsidyList.map(item => item.SubsidyAmount));

                    maleExpections = (Recruit.RecruitSubsidys || []).filter(item => item.Gender !== 2).filter(item => (item.SubsidyDay <= minMaleSubsidyDay) || (item.SubsidyAmount >= (maxMaleSubsidyAmount / 100)));
                }

                if (FemaleSubsidyList.length) {

                    // 男性有效劳务报价最低补贴天数
                    const minFemaleSubsidyDay = Math.min(...FemaleSubsidyList.map(item => item.SubsidyDay));

                    // 男性有效劳务报价最高金额
                    const maxFemaleSubsidyAmount = Math.max(...FemaleSubsidyList.map(item => item.SubsidyAmount));

                    femaleExpections = (Recruit.RecruitSubsidys || []).filter(item => item.Gender !== 2).filter(item => (item.SubsidyDay <= minFemaleSubsidyDay) || (item.SubsidyAmount >= (maxFemaleSubsidyAmount / 100)));
                }

                return !!maleExpections.length || !!femaleExpections.length;
            });

            if (exceptionItems.length) {
                Modal.warning({
                    title: '绑定异常提示',
                    content: (<div>本次绑定会员报价时，有<span className="color-red">{exceptionItems.length}</span>个异常绑定！</div>),
                    okText: '知道了',
                    onOk: () => {
                        this.props.selectedRowKeys.length && this.setParams('ConfirmSubsidyModalItem', {
                            Visible: true,
                            InterviewID: this.props.selectedRowKeys
                        });
                        
                    }
                });
            }
            
        } else {
            this.props.selectedRowKeys.length && this.setParams('ConfirmSubsidyModalItem', {
                Visible: true,
                InterviewID: this.props.selectedRowKeys
            });
        }
    }

    render() {
        const {tabKey, bindSubsidyRecruitTmp, ConfirmSubsidyModalItem, BindSubsidyModalItem} = this.props;
        const isAll = tabKey === 'tab1';
        const bindEnable = moment().isSame(this.queryDate, 'day') || this.employeeId === 1 || true;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>面试名单</h1>
                </div>
                {false && <Tabs activeKey={tabKey} onChange={this.callback} className="page-view-tabs">
                    <TabPane key="tab1"
                             tab={
                                 <div className="page-view-tabs-pane">
                                     <span>全部</span>
                                 </div>}>
                    </TabPane>
                    <TabPane key="tab2"
                             tab={
                                 <div>
                                     <span>漏绑报价</span>
                                     <Badge count={this.props.UnbindSubsidyCount || 0} style={{marginTop: -24}}/>
                                 </div>}>
                    </TabPane>
                </Tabs>
                }
                <BindSubsidyModal
                    Date={this.props.queryParams.Date.value}
                    BindSubsidyModalItem={BindSubsidyModalItem}
                    setParams={this.setParams}
                    handleModalSubmit={this.handleBindSubsidyModalSubmit}
                    handleModalCancel={() => this.handleModalVisible('BindSubsidyModal')}/>
                <Modal
                    title="确认报价" visible={ConfirmSubsidyModalItem.Visible}
                    onCancel={() => this.handleModalVisible('ConfirmSubsidyModal')}
                    confirmLoading={ConfirmSubsidyModalItem.confirmLoading}
                    onOk={this.handleConfirmSubsidyModalSubmit}>
                    <div>
                        是否要直接给选中订单绑定当前报价？
                    </div>
                </Modal>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <SearchForm
                            queryParams={this.props.queryParams}
                            setParams={this.setParams}
                            common={this.props.common}
                            tabKey={this.props.tabKey}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>

                        {isAll && <Row>
                            <Col span={2} className="mb-24">
                                <label>面试状态：</label>
                            </Col>
                            <Col>
                                <TagSelect
                                    value={this.props.tagParam}
                                    onChange={(value) => {
                                       
                                        let tagParam = value;
                                        // if (value && value.length && value.length < 5) tagParam = [...value[value.length - 1]];
                                
                                        this.setParams({
                                            tagParam: [...tagParam],
                                            selectedRowKeys: [],
                                            selectedRowBind: 0,
                                            selectedRowUnBind: 0,
                                            bindSubsidyRecruitTmp: {}
                                        });
                                        this.queryDate = this.props.queryParams.Date.value.format('YYYY-MM-DD');
                                    }}>
                                    <TagSelect.Option value={0}>未处理</TagSelect.Option>
                                    <TagSelect.Option value={2}>面试通过</TagSelect.Option>
                                    <TagSelect.Option value={3}>面试未通过</TagSelect.Option>
                                    <TagSelect.Option value={4}>放弃面试</TagSelect.Option>
                                    <TagSelect.Option value={1}>未面试</TagSelect.Option>
                                </TagSelect>
                            </Col>
                        </Row>}

                        <Row className="mb-16">
                            <Col>
                                <Button
                                    type="primary" size="large" className="ml-16"
                                    onClick={() => {
                                        this.props.selectedRowKeys.length && ListSubsidy({
                                            Date: this.props.queryParams.Date.value.format('YYYY-MM-DD'),
                                            RecruitTmpID: Object.values(this.props.bindSubsidyRecruitTmp)[0]
                                        });
                                        this.setParams('BindSubsidyModalItem', {InterviewID: this.props.selectedRowKeys});
                                    }}
                                    disabled={Object.keys(bindSubsidyRecruitTmp).length !== 1}>
                                    绑定会员报价</Button>

                                <Button
                                    type="primary" size="large" className="ml-16"
                                    onClick={this.handleConfirmBindCurrentOrder}
                                    disabled={!(this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0) || this.props.selectedRowBind}>
                                    确认当前报价</Button>
                            </Col>
                        </Row>

                        {isAll && <Row>
                            <Alert
                                type="info" showIcon className="mb-16"
                                message={(
                                    <p>已选择&nbsp;&nbsp;
                                        <a style={{fontWeight: 600}}>{this.props.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                        已手动绑定 <span style={{fontWeight: 600}}>{this.props.selectedRowBind}</span>个，
                                        未手动绑定 <span style={{fontWeight: 600}}>{this.props.selectedRowUnBind}</span>个
                                        <a onClick={() => this.setParams({
                                            selectedRowKeys: [],
                                            selectedRowBind: 0,
                                            selectedRowUnBind: 0,
                                            bindSubsidyRecruitTmp: {}
                                        })}
                                           style={{marginLeft: 24}}>清空</a>
                                    </p>
                                )}/>
                        </Row>}

                        <Table
                            rowKey={'InterviewID'} bordered={true} size='small'
                            rowSelection={bindEnable ? {
                                onChange: this.handleTableRowSelection,
                                selectedRowKeys: this.props.selectedRowKeys
                            } : undefined}
                            onRowClick={this.handleTableRowClick}
                            pagination={{
                                total: this.props.RecordCount,
                                pageSize: this.props.pageParam.pageSize,
                                current: this.props.pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                pageSizeOptions: ['100', '200', '500', '1000'],
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            columns={[
                                {title: '会员姓名', dataIndex: 'RealName'},
                                {title: '手机号码', dataIndex: 'Mobile'},
                                {title: '面试企业', dataIndex: 'PositionName'},
                                {title: '劳务公司', dataIndex: 'ShortName'},
                                {title: '劳务报价', dataIndex: 'LaborOrder',
                                    render: (text, record) => {
                                        if (text && text.LaborOrderSubsidys)
                                         return text.LaborOrderSubsidys.map((item, index) =>
                                                    <div key={'LaborOrder' + index}>
                                                        {item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}:
                                                        {item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                                    </div>
                                                );
                                    }
                                },
                                {
                                    title: '会员报价', dataIndex: 'Recruit',
                                    render: (text, record) => {
                                        let RecruitSubsidys1 = '';
                                        let RecruitSubsidys2 = '';
                                        let RecruitSubsidys3 = '';
                                        if (text && text.RecruitID && text.RecruitSubsidys && text.RecruitSubsidys.length) {
          
                                            let RecruitSubsidys = text.RecruitSubsidys;
                                          
                                            return (
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}><div>
                                                {RecruitSubsidys && RecruitSubsidys.map((item, index) =>
                                                    <div key={'RecruitSubsidys' + index} className={record.BindRecruitSubsidy === 1 ? 'color-red' : 'color-green'}>
                                                    {item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}{item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                                    </div>
                                                )}</div>
                                                {bindEnable && <Icon type="down-circle-o" className="ml-8"/>}
                                                </div>
                                            );
                                        } else if (text && text.RecruitID && text.EnrollFees && text.EnrollFees.length) {
                                            let EnrollFees = text.EnrollFees;
                                            return (
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}><div>
                                                {EnrollFees && EnrollFees.map((item, index) =>
                                                    <div key={'EnrollFeeList' + index} className={record.BindRecruitSubsidy === 1 ? 'color-red' : 'color-green'}>
                                                        {item.Gender === 1 ? '男收' : item.Gender === 2 ? '女收' : '男女不限 收'}
                                                        {item.ChargeAmount / 100}元
                                                    </div>
                                                )}</div>
                                                {bindEnable && <Icon type="down-circle-o" className="ml-8"/>}
                                                </div>
                                            );
                                        }else{
                                            return (
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                 <div className={record.BindRecruitSubsidy === 1 ? 'color-red' : ''}>
                                                    
                                                    </div>
                                                {bindEnable && <Icon type="down-circle-o" className="ml-8"/>}
                                                </div>
                                            );
                                        }

                                    }
                                },
                                {
                                    title: '补贴类型', key: 'SubsidyType',
                                    render: (text, record) => {
                                        const Recruit = record.Recruit || {};
                                        const SubsidyTypeMap = {
                                            1: '在职日',
                                            2: '工作日'
                                        };
                                        return (
                                            <span style={{color: Recruit.SubsidyType === 2 ? 'red' : 'inherit'}}>{SubsidyTypeMap[Recruit.SubsidyType || 0] || ''}</span>
                                        );
                                    }
                                },
                                {
                                    title: '手动绑定', dataIndex: 'BindRecruitSubsidy',
                                    render: (text, record) => {
                                        return text === 2 ? <span className='color-green'>已手动绑定{record.IsAbnormal === 2 ? <span className="color-red">（异常）</span> : ''}</span> : '';
                                    }
                                },
                                {title: '备注', dataIndex: 'BindSubsidyRemark'},
                                {
                                    title: '面试状态',
                                    dataIndex: 'JFFInterviewStatus',
                                    render: text => JFFInterviewStatus[text]
                                },
                                {title: '状态说明', dataIndex: 'JFFInterviewReason'},
                                {
                                    title: '结算状态', dataIndex: 'SettleStatus',
                                    render: text => text === 1 ? <span className='color-orange' >待结算</span> : text === 2 ? <span className='color-green' >已结算</span> : <span className='color-orange' >结算中</span>
                                },
                                {title: '经纪人', dataIndex: 'BrokerAccount'},
                                {
                                    title: '签到日期', dataIndex: 'CheckInTime',
                                    sorter: true,
                                    key: 'OrderByCheckInTime',
                                    sortOrder: this.props.orderParam.OrderByCheckInTime
                                }
                            ]}
                            dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {
                                    pageParam: {currentPage, pageSize: pagination.pageSize},
                                    selectedRowKeys: [],
                                    selectedRowBind: 0,
                                    selectedRowUnBind: 0,
                                    bindSubsidyRecruitTmp: {}
                                };
                                if (sorter.columnKey) {
                                    change.orderParam = {[sorter.columnKey]: sorter.order};
                                }
                                this.setParams(change);
                                this.queryDate = this.props.queryParams.Date.value.format('YYYY-MM-DD');
                            }}/>
                    </Card>
                </div>
            </div>
        );
    }
}

export default InterviewNameList;