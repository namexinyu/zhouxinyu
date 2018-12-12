import React from 'react';
import {
    Row,
    Col,
    Card,
    Select,
    Form,
    Modal,
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
import {browserHistory} from "react-router";
import EnterpriseAction from 'ACTION/Business/Recruit/Enterprise';
import EntBasic from './entBasic';
import EnterpriseMapModal from './entBasic/EnterpriseMapModal';
import RecruitTagModal from './entBasic/RecruitTagModal';
import {editEnt, getEntInfo, setEntStatus} from 'SERVICE/Business/Recruitment/Enterprise';
import {CONFIG} from "mams-com";
import CommonAction from 'ACTION/Business/Common';
import {Gender} from "CONFIG/EnumerateLib/Mapping_Recruit";
import 'LESS/Business/DailyRecruit/recruit-table.less';

const {getEntTagList} = CommonAction;

const {getEntList} = EnterpriseAction;
const FormItem = Form.Item;
const STATE_NAME = 'state_business_recruitment_ent';

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
                    <FormItem {...formItemLayout} label="创建日期">
                        {getFieldDecorator('Date')(
                            <DatePicker.RangePicker style={{width: '100%'}} allowClear={false}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="企业简称">
                        {getFieldDecorator('EntShortName')(<Input placeholder='请输入' maxLength="50"/>)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="企业类别">
                        {getFieldDecorator('EntType')(
                            <Select>
                                <Select.Option value="-9999">全部</Select.Option>
                                <Select.Option value="1">A类</Select.Option>
                                <Select.Option value="2">B类</Select.Option>
                                <Select.Option value="3">C类</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>

                <Col span={4} offset={2} style={{display: 'inline-flex', justifyContent: 'space-around'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
});

const tagMax = 3;

export default class Ent extends React.PureComponent {
    state = {
        EntModalVisible: false, EntModalLoading: false, EntConfirmModalLoading: false,
        showMap: false, showAddTag: false,
        poi: {},
        entBasicState: {}
    };

    getEntTagObjList = (RecruitTagConfIDs, EntTagListObj) => {
        if (RecruitTagConfIDs) {
            return RecruitTagConfIDs.split(',').reduce((pre, cur) => {
                pre.push({TagID: Number(cur), TagName: EntTagListObj[cur]});
                return pre;
            }, []);
        }
        return [];
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
        getEntTagList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
    }

    handleTableOperate = (e) => {
        switch (e.target.name) {
            case 'newEnt':
                browserHistory.push({pathname: '/bc/recruitment/ent-new'});
                // this.setState({EntModalVisible: true, entBasicState: {}});
                break;
            case 'auditEnt':
                browserHistory.push({pathname: '/bc/recruitment/ent-audit'});
                break;
        }
    };

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['EntType'];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v || '';
            }
            return pre;
        }, {});
        if (query.Date && query.Date instanceof Array) {
            query.StartDate = query.Date[0] ? query.Date[0].format('YYYY-MM-DD') : null;
            query.EndDate = query.Date[1] ? query.Date[1].format('YYYY-MM-DD') : null;
        }
        delete query.Date;
        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1]) || Number.isNaN(data[1])) delete query[data[0]];
        });
        return query;
    }

    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        let orderParam = {}; // 排序
        getEntList({
            ...this.obtainQueryParam(props), ...orderParam,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    handleTabRowClick = (record, index, event) => {
        event.preventDefault();
        switch (event.target.name) {
            case 'edit':
                getEntInfo({EntShortID: Number(record.EntShortID)}).then(res => {
                    this.handleEntInfo(res.Data);
                }).catch(err => {
                    message.error(err.Desc);
                });
                break;
            case 'edit-all':
                browserHistory.push({
                    pathname: '/bc/recruitment/ent-edit',
                    query: {id: record.EntShortID, entName: record.EntShortName}
                });
                break;
            case 'copy':
                browserHistory.push({
                    pathname: '/bc/recruitment/ent-edit',
                    query: {id: record.EntShortID, entName: record.EntShortName, type: 1}
                });
                break;
        }
    };

    handleEntInfo(entInfo) {
        let GenderRatio = (entInfo.GenderRatio || '').split(':').reduce((pre, cur, index) => {
            if (index === 0) pre.male = cur;
            if (index === 1) pre.female = cur;
            return pre;
        }, {});
        let LabourCostList = (entInfo.LabourCostList || []).map(item => ({
            ...item,
            SubsidyUnitPay: (item.SubsidyUnitPay || 0) / 100,
            UnitPay: (item.UnitPay || 0) / 100
        }));

        let entBasicState = {
            EntShortName: {value: entInfo.EntShortName || ''},
            PayType: {value: entInfo.PayType.toString()},
            ZXXType: {value: entInfo.ZXXType.toString()},
            Salary: {value: {start: (entInfo.MinSalary || 0) / 100, end: (entInfo.MaxSalary || 0) / 100}},
            SubsidyList: {
                value: (entInfo.SubsidyList || []).map(item => ({
                    ...item,
                    SubsidyAmount: (item.SubsidyAmount || 0) / 100
                }))
            },
            SubsidyRemark: {value: entInfo.SubsidyRemark || ''},
            EnrollFeeList: {
                value: (entInfo.EnrollFeeList || []).map(item => ({
                    ...item,
                    Fee: (item.Fee || 0) / 100
                }))
            },
            LabourCostList: {value: LabourCostList},
            LabourCostType: LabourCostList.reduce((pre, cur) => pre + cur.SubsidyUnitPay, 0) > 0 ? 1 : 0,
            RecruitAge: {
                value: {
                    MaleMinAge: entInfo.MaleMinAge,
                    MaleMaxAge: entInfo.MaleMaxAge,
                    FeMaleMinAge: entInfo.FeMaleMinAge,
                    FeMaleMaxAge: entInfo.FeMaleMaxAge
                }
            },
            GenderRatio: {value: GenderRatio},
            WarmTip: {value: entInfo.WarmTip},
            RecruitTagConfIDs: {value: this.getEntTagObjList(entInfo.RecruitTagConfIDs, this.props.common.EntTagListObj)},
            RecruitTagStr: entInfo.RecruitTagConfIDs,
            AreaCode: {value: CONFIG.getPCA.getPCACode(entInfo.AreaCode)},
            Address: {value: entInfo.Address},
            Longlat: {value: entInfo.Longlat},
            ClockRadius: {value: entInfo.ClockRadius},
            EntShortID: entInfo.EntShortID
        };

        this.setState({
            entBasicState, poi: {
                longlat: entBasicState.Longlat.value,
                // clockLonglat: clockLonglat.value,
                clockRadius: entBasicState.ClockRadius.value
            }, EntModalVisible: true
        });
    }

    // --------- start entModal
    handleEntModalConfirm = () => {
        let enterprise = this.refs.entBasic;
        enterprise.validateFields((err, fieldsValue) => {
            console.log(err, fieldsValue);
            if (err) return;

            if (!this.state.entBasicState.EntShortID) {// 新建
                // console.log(fieldsValue);
                if ((fieldsValue.EntShortName.indexOf('周薪薪') !== -1 && fieldsValue.PayType == 0) || (fieldsValue.EntShortName.indexOf('周薪薪') === -1 && fieldsValue.PayType == 1)) {
                    Modal.confirm({
                        title: `你的企业名称里${fieldsValue.EntShortName.indexOf('周薪薪') === -1 ? '没有' : '含有'}周薪薪，确定按照${fieldsValue.PayType == 0 ? '月薪' : '周薪'}的方式发放薪水吗？`,
                        content: '',
                        onOk: () => {
                            let param = EntBasic.obtainQueryParams(fieldsValue, this.state.entBasicState.LabourCostType || 0);
                            param.EntShortID = this.state.entBasicState.EntShortID || 0;
                            this.setState({EntConfirmModalLoading: true});
                            editEnt(param).then(res => {
                                this.queryTableList();
                                this.handleEntModalClose();
                            }).catch(err => {
                                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '新建失败');
                                this.setState({EntConfirmModalLoading: false});
                            });
                        }
                    });
                    return;
                }
            }

            let param = EntBasic.obtainQueryParams(fieldsValue, this.state.entBasicState.LabourCostType || 0);
            param.EntShortID = this.state.entBasicState.EntShortID || 0;
            this.setState({EntModalLoading: true});
            editEnt(param).then(res => {
                this.queryTableList();
                this.handleEntModalClose();
            }).catch(err => {
                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '新建失败');
                this.setState({EntModalLoading: false});
            });
        });
    };

    handleEntModalClose = () => {
        this.setState({EntModalVisible: false, EntModalLoading: false, entBasicState: {}, poi: {}});
    };

    handleSeeMap = () => {
        this.setState({showMap: true});
    };

    closeMapCall = (type, poi) => {
        if (type === 'cancel') {
            this.setState({showMap: false});
        }
        if (type === 'ok') {
            let Longlat = {value: poi.longlat};
            let ClockRadius = {value: poi.clockRadius};
            this.setState(preState => ({
                showMap: false,
                entBasicState: {...preState.entBasicState, Longlat, ClockRadius}
            }));
        }
    };

    handleTagAdd = () => {
        getEntTagList();
        this.setState({showAddTag: true});
    };

    handleTagSelect = (selectTags) => {
        let RecruitTagConfIDs = {value: selectTags};
        this.setState(preState => ({
            showAddTag: false,
            entBasicState: {...preState.entBasicState, RecruitTagConfIDs}
        }));
    };

    handleTagMax = (value) => {
        let result = Object.values(value).filter(item => item === true).length < tagMax;
        if (!result) message.warn(`最多设置${tagMax}个标签`);
        return result;
    };

    handleTagModalClose = () => {
        this.setState({showAddTag: false});
    };


    handleSetEntBasicParams = (params) => {
        this.setState(preState => ({
            entBasicState: {...preState.entBasicState, ...params}
        }));
    };

    // --------- end entModal

    handleEntForbid = (record) => (value) => {
        this.setParams({RecordListLoading: true});
        setEntStatus({EntShortID: record.EntShortID, Forbidden: value ? 0 : 1})
            .then(res => {
                message.success('修改成功');
                this.queryTableList();
            })
            .catch(err => {
                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '修改失败');
                this.setParams({RecordListLoading: false});
            });

    };

    render() {
        const setParams = this.setParams;
        const {RecordCount, RecordList, RecordListLoading, queryParams, pageParam, common} = this.props;

        const {EntModalVisible, EntModalLoading, showMap, poi, showAddTag, entBasicState} = this.state;

        return (
            <div>
                <div className="ivy-page-title">
                    <h1>企业管理</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <Modal
                            width='90%' title="企业信息" visible={EntModalVisible} maskClosable={false}
                            onOk={this.handleEntModalConfirm}
                            onCancel={this.handleEntModalClose}
                            confirmLoading={EntModalLoading}>
                            <Spin spinning={EntModalLoading}>
                                {EntModalVisible &&
                                <EntBasic type='modal' ref='entBasic' tagMax={tagMax}
                                          handleSeeMap={this.handleSeeMap}
                                          handleTagAdd={this.handleTagAdd}
                                          setParams={this.handleSetEntBasicParams}
                                          params={entBasicState}
                                          LabourCostType={entBasicState.LabourCostType || 0}
                                          isEdit={!!entBasicState.EntShortID}
                                          poi={poi}/>}
                            </Spin>
                        </Modal>

                        {showMap && <EnterpriseMapModal enableEdit={true}
                                                        closeCall={this.closeMapCall}
                                                        initPoi={poi}/>}
                        {showAddTag && <RecruitTagModal tagList={common.EntTagList}
                                                        initTags={entBasicState.RecruitTagConfIDs ? entBasicState.RecruitTagConfIDs.value : undefined}
                                                        handleTagMax={this.handleTagMax}
                                                        handleTagSelect={this.handleTagSelect}
                                                        handleModalClose={this.handleTagModalClose}
                        />}

                        <SearchForm
                            queryParams={queryParams}
                            setParams={setParams}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Row className="mb-16">
                            <Button className="mr-16" name='newEnt'
                                    onClick={this.handleTableOperate}>新建企业</Button>
                            <Button className="mr-16" name='auditEnt'
                                    onClick={this.handleTableOperate}>企业审核</Button>
                        </Row>
                        <Table
                            className='recruit-table'
                            rowKey={'EntShortID'} bordered={true} size='small'
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
                                    title: '显示', dataIndex: 'xx',
                                    render: (text, record) =>
                                        <Switch checked={record.Forbidden === 0}
                                                onChange={this.handleEntForbid(record)}/>
                                },
                                {title: '企业简称', dataIndex: 'EntShortName', width: 150},
                                {title: '综合薪资', dataIndex: 'SalaryStr', render: text => <pre>{text}</pre>},
                                // {
                                //     title: '补贴', dataIndex: 'SubsidyList',
                                //     render: text => text && text.map((item, index) =>
                                //         <div key={index}>
                                //             {Gender[item.Gender]}:{item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                //         </div>
                                //     )
                                // },
                                // {
                                //     title: '收费', dataIndex: 'EnrollFeeList',
                                //     render: text => text && text.length ? text.map((item, index) =>
                                //         <div key={index}>{Gender[item.Gender]} {item.Fee / 100}元</div>
                                //     ) : '无'
                                // },
                                // {title: '年龄|性别', dataIndex: 'GenderRatioStr', render: text => <pre>{text}</pre>},
                                {
                                    title: '标签', dataIndex: 'RecruitTagConfIDs',
                                    render: text => text ? text.split(',').reduce((pre, cur, index) => pre + (index === 0 ? '' : ',') + (common.EntTagListObj[cur] || cur), '') : ''
                                },
                                {title: '温馨提示', dataIndex: 'WarmTip'},
                                {title: '最近修改时间', dataIndex: 'ModifyTime', width: 150},
                                {
                                    title: '操作', dataIndex: 'xxx', width: 150,
                                    render: (text, record) => {
                                        return (
                                            <div>
                                                <a name="edit-all"> 编辑 </a>|<a
                                                name="copy"> 复制 </a>
                                            </div>
                                        );
                                    }
                                }
                            ]}
                            dataSource={RecordList}
                            loading={RecordListLoading}
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