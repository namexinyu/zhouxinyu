import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Modal,
    Switch,
    Table,
    Button,
    Select,
    Alert,
    Icon,
    DatePicker,
    Input,
    message,
    Radio,
    Checkbox,
    Menu,
    Dropdown
} from 'antd';
import Condition from './Condition';
import JumpAction from 'ACTION/Business/WorkBoard/JumpAction';

import Quote from "./Quote";
import resetQueryParams from 'ACTION/resetQueryParams';
import setParams from 'ACTION/setParams';
import DailyRecruitAction from 'ACTION/Business/Recruit/DailyRecruit';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import CommonAction from 'ACTION/Business/Common';

import sendMessage from 'UTIL/sendMessage';
import sendNotify from 'UTIL/sendNotify';

import {
    getRecruitCondition,
    getEntAddress,
    setRecruitCondition,
    setRecruitStatus,
    setShowOrder,
    setRecruitConditionItem,
    getLaborOrderByRecruitTmpID,
    getQuoteListByRecruitTmpID,
    getStandardSubsidy,
    setStandardSubsidy,
    setLaborOrderStatus,
    cancelQuote,
    getCancelQuoteEffectCount,
    queryCancelQuoteResult,
    setRecruitQuotes,
    getMasterPush
} from 'SERVICE/Business/Recruitment/DailyRecruit';
import moment from 'moment';
import 'LESS/Business/DailyRecruit/recruit-table.less';
import Subsidies from "../entManage/entBasic/Subsidies";
import LabourCosts from "../entManage/entBasic/LabourCosts";
import EnrollFees from '../entManage/entBasic/EnrollFees';
import { relative } from 'path';

const {getRecruitSimpleList, getGiftInfoList} = CommonAction;
const {getRecruitInfoList, getCurrentRecruitCount} = DailyRecruitAction;
const FormItem = Form.Item;
const STATE_NAME = 'state_business_recruitment_daily';
const modalConfirm = Modal.confirm;
const modalInfo = Modal.info;
const Dates = { "2017": "2018-02-01", "2018": "2019-01-21", "2019": "2020-01-10", "2020": "2021-01-28", "2021": "2022-01-17", "2022": "2023-01-07", "2023": "2024-01-26", "2024": "2025-01-14" };
const Datelist = { "2017": "2018-02-15", "2018": "2019-02-04", "2019": "2020-01-24", "2020": "2021-02-11", "2021": "2022-02-02", "2022": "2023-01-21", "2023": "2024-02-09", "2024": "2025-01-28" };
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
                <Col span={5}>
                    <FormItem {...formItemLayout} label="招聘日期">
                        {getFieldDecorator('RecruitDate')(
                            <DatePicker style={{width: '100%'}} allowClear={false}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="企业简称">
                        {getFieldDecorator('Recruit')(
                            <AutoCompleteInput
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={common.RecruitSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="招聘状态">
                        {getFieldDecorator('RecruitStatus')(
                            <Select>
                                <Select.Option value='-9999'>全部</Select.Option>
                                <Select.Option value='1'>开启</Select.Option>
                                <Select.Option value='0'>关闭</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="设置补贴">
                        {getFieldDecorator('HasSubsidy')(
                            <Select>
                                <Select.Option value='-9999'>全部</Select.Option>
                                <Select.Option value='1'>已设置</Select.Option>
                                <Select.Option value='0'>未设置</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="关联报价">
                        {getFieldDecorator('AcceptLaborOrderType')(
                            <Select>
                                <Select.Option value='-9999'>全部</Select.Option>
                                <Select.Option value='0'>待关联</Select.Option>
                                <Select.Option value='1'>已关联</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="是否周薪薪">
                        {getFieldDecorator('PayType')(
                            <Select>
                                <Select.Option value='-9999'>全部</Select.Option>
                                <Select.Option value='0'>按月</Select.Option>
                                <Select.Option value='1'>周薪薪</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="企业类别">
                        {getFieldDecorator('RecruitType')(
                            <Select>
                                <Select.Option value='-9999'>全部</Select.Option>
                                <Select.Option value='1'>A类</Select.Option>
                                <Select.Option value='2'>B类</Select.Option>
                                <Select.Option value='3'>C类</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...formItemLayout} label="是否主推">
                        {getFieldDecorator('MasterPush')(
                            <Select placeholder={"全部"} >
                                <Select.Option value='-9999'>全部</Select.Option>
                                <Select.Option value='1'>是</Select.Option>
                                <Select.Option value='0'>否</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={4} offset={20} style={{ textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
});
const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 18}};

const ConditionInfoConfig = {
    IDCardTypeOpt: [
        {label: '不限', value: 7},
        {label: '有磁', value: 1},
        {label: '无磁', value: 2},
        {label: '临时身份证', value: 4}
    ],
    QualificationOpt: [
        {label: '不限', value: 31},
        {label: '小学', value: 1},
        {label: '初中', value: 2},
        {label: '高中', value: 4},
        {label: '大专', value: 8},
        {label: '本科及以上', value: 16}
    ],
    TattooOpt: [
        {label: '不限', value: 31},
        {label: '全身无纹身', value: 16},
        {label: '手部无纹身', value: 1},
        {label: '手臂无纹身', value: 2},
        {label: '上身无纹身', value: 4},
        {label: '无攻击性纹身', value: 8}
    ],
    SmokeScarOpt: [
        {label: '不限', value: 15},
        {label: '全身无烟疤', value: 8},
        {label: '手部无烟疤', value: 1},
        {label: '手臂无烟疤', value: 2},
        {label: '上身无烟疤', value: 4}
    ]
};
let ConditionInfoConfigObj = Object.entries(ConditionInfoConfig).reduce((pre, cur) => {
    pre[cur[0]] = cur[1].reduce((childP, childC) => {
        childP[childC.value] = childC.label;
        return childP;
    }, {});
    return pre;
}, {});

function decodeCheckBox(value, operateKey) {
    operateKey = operateKey + 'Opt';
    if (value === 0) {
        return [];
    }
    if (value === ConditionInfoConfig[operateKey][0].value) {
        let res = [];
        let list = ConditionInfoConfig[operateKey];
        for (let i = 0; i < list.length; i++) {
            res.push(list[i].value);
        }
        return res;
    } else {
        let len = ConditionInfoConfig[operateKey].length;
        let sList = ConditionInfoConfig[operateKey];
        for (let i = 1; i <= len; i++) {
            let list = recursion(sList, i);
            for (let j = 0; j < list.length; j++) {
                let ca = list[j];
                let sum = 0;
                let res = [];
                for (let k = 0; k < ca.length; k++) {
                    sum = sum + ca[k].value;
                    res.push(ca[k].value);
                }
                if (sum === value) {
                    return res;
                }
            }
        }
        return [];
    }
}

function recursion(arr, num) {
    let r = [];
    (function f(t, a, n) {
        if (n === 0) return r.push(t);
        for (let i = 0, l = a.length; i <= l - n; i++) {
            f(t.concat(a[i]), a.slice(i + 1), n - 1);
        }
    })([], arr, num);
    return r;
}

const InitialState = () => ({
    ConditionModal: {},
    ConditionRecord: {},
    QuoteModal: {},
    ConditionItemModal: {},
    ShowTypeModal: {},
    QuoteConfirmModal: {},
    rowRecord: {}
});

export default class DailyRecruit extends React.PureComponent {

    constructor(props) {
        super(props);

        const tableColumns = [
            {title: '序号', dataIndex: 'rowKey', width: 70},
            {
                title: '是否招聘', dataIndex: 'RecruitStatus', width: 100,
                render: (text, record) => {
                    let disabled = !record.Date || moment(record.Date, "YYYY-MM-DD").valueOf() < moment().subtract(1, 'd').valueOf();
                    let checked = text === 1;
                    return (
                        <Switch
                            className={disabled && checked ? 'switch-disabled-checked' : ''}
                            disabled={disabled}
                            checked={checked} onClick={this.handleRecruitStatus(record)}/>);
                }
            },
            {
                title: '是否主推', dataIndex: 'MasterPush', width: 100,
                render: (text, record) => {
                    return (
                        <Switch
                            checked={text}
                            disabled={record.RecruitStatus == 1 ? false : true}
                            onClick={this.handlegetMasterPush(record)}/>);
                }
            },
            {title: '企业简称', dataIndex: 'RecruitName', width: 150},
            {title: '企业类别', dataIndex: 'RecruitTypeStr'},
            {title: '已关联报价', dataIndex: 'AcceptLaborOrderCount'},
            {title: '未关联报价', dataIndex: 'UnOperLaborOrderCount'},
            {
                title: '综合薪资', dataIndex: 'SalaryStr',
                render: text => <a className='td-modify' name="Salary">{text || '--'}</a>
            }, {
                title: '工价', dataIndex: 'LabourCostListStr',
                render: text => <a className='td-modify' name="LabourCostList">{text || '--'}</a>
            },
            {
                title: '补贴', dataIndex: 'SubsidyList',
                render: (text, record) => {
                    let result = (text || []).reduce((pre, cur, index) => {
                        if (index) pre += '\n';
                        pre += `${cur.Gender === 1 ? '男' : cur.Gender === 2 ? '女' : '男女不限'}: ${cur.SubsidyDay}天返${cur.SubsidyAmount / 100}元`;
                        return pre;
                    }, '');
                    return <a className='td-modify' name="SubsidyList">{result || '--'}</a>;
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
                title: '收费',
                dataIndex: 'EnrollFeeList',
                render: (text, record) => {
                    let result = (text || []).reduce((pre, cur, index) => {
                        if (index) pre += '\n';
                        pre += `${cur.Gender === 1 ? '男' : cur.Gender === 2 ? '女' : '男女不限'}:${cur.Fee / 100}元`;
                        return pre;
                    }, '');
                    return <a className='td-modify' name="EnrollFeeList">{result || '--'}</a>;
                }
            },
            {
                title: '集合时间', dataIndex: 'GatherInfo',
                render: text => <a className='td-modify' name="GatherInfo">{text || '--'}</a>
            },
            {
                title: '名额', dataIndex: 'WantNumber',
                render: (text, record) => {
                    return (
                        <a name="WantNumber" style={{
                            color: (text * 1.2) > 0 && (text * 1.2) <= record.PickUpNumber ? 'red' : 'inherit'
                        }}>{text === 0 ? '不限' : text}</a>
                    );
                }
            },
            {
                title: '备注', dataIndex: 'Remark',
                render: text => <a className='td-modify' name="Remark">{text || '--'}</a>
            },
            {
                title: '性别比例', dataIndex: 'MaleScaleStr',
                render: text => <a className='td-modify' name="MaleScale">{text || '--'}</a>
            },
            {
                title: '年龄', dataIndex: 'x',
                render: (text, record) => {
                    let Male = record.MaleMinAge || record.MaleMaxAge ? `${record.MaleMinAge || 0}~${record.MaleMaxAge || 0}` : undefined;
                    let FeMale = record.FeMaleMinAge || record.FeMaleMaxAge ? `${record.FeMaleMinAge || 0}~${record.FeMaleMaxAge || 0}` : undefined;
                    let result = Male && FeMale ? `男${Male}\n女${FeMale}` : Male ? Male : FeMale;
                    return <a className='td-modify' name="Age">{result || '--'}</a>;
                }
            },
            {
                title: '民族', dataIndex: 'NationInfo',
                render: text => <a className='td-modify' name="NationInfo">{text || '--'}</a>
            },
            {
                title: '身份证', dataIndex: 'IDCardType',
                render: text => {
                    let key = 'IDCardType';
                    let result = '--';
                    if (text) {
                        let obj = ConditionInfoConfigObj[`${key}Opt`];
                        result = decodeCheckBox(text, key).reduce((pre, cur, index) => `${pre}${index === 0 ? '' : ','}${obj[cur]}`, '');
                        if (result.indexOf('不限') >= 0) result = '不限';
                    }
                    return <a className='td-modify' name={key}>{result}</a>;
                }
            },
            {
                title: '纹身', dataIndex: 'Tattoo',
                render: text => {
                    let key = 'Tattoo';
                    let result = '--';
                    if (text) {
                        let obj = ConditionInfoConfigObj[`${key}Opt`];
                        result = decodeCheckBox(text, key).reduce((pre, cur, index) => `${pre}${index === 0 ? '' : ','}${obj[cur]}`, '');
                        if (result.indexOf('不限') >= 0) result = '不限';
                    }
                    return <a className='td-modify' name={key}>{result}</a>;
                }
            },
            {
                title: '烟疤', dataIndex: 'SmokeScar',
                render: text => {
                    let key = 'SmokeScar';
                    let result = '--';
                    if (text) {
                        let obj = ConditionInfoConfigObj[`${key}Opt`];
                        result = decodeCheckBox(text, key).reduce((pre, cur, index) => `${pre}${index === 0 ? '' : ','}${obj[cur]}`, '');
                        if (result.indexOf('不限') >= 0) result = '不限';
                    }
                    return <a className='td-modify' name={key}>{result}</a>;
                }
            },
            {
                title: '操作', dataIndex: 'xxx',
                render: text => {
                    return (
                        [<div key={1}><a name="config">配置价格</a></div>,
                            <div key={2}><a name="condition">录用条件</a></div>,
                            <div key={3}><a name="ShowType">设置价格顺序</a></div>]
                    );
                }
            }
        ];

        this.state = {
            ConditionModal: {},
            ConditionRecord: {},
            QuoteModal: {},
            ConditionItemModal: {},
            ShowTypeModal: {},
            QuoteConfirmModal: {},
            rowRecord: {},
            MustDays: {},
            Checkbox: [],
            preState: true,
            dropdownMenuVisible: false,
            // defaultColumns: tableColumns.filter((item, i) => !(i === 0 || i === 1 || i === 2 || i === tableColumns.length - 1)).map(item => item.title),
            selectableColumns: tableColumns.map((item, i) => {
                return {
                    ...item,
                    key: i
                };
            }),
            columns: tableColumns.map((item, i) => {
                return {
                    ...item,
                    key: i
                };
            })
        };
    }

   

    // state = InitialState();

    setParams = (field, state) => {
        if (typeof field === 'object') {
            setParams(STATE_NAME, field);
        } else {
            let s = state;
            if (typeof state === 'object') s = {...this.props[field], ...state};
            setParams(STATE_NAME, {[field]: s});
        }
    };
    Checkbox = (data) => {
        this.setState({
            Checkbox: data
        });
    }
    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            if (this.props.location.query && this.props.location.query.RecruitType) {
                // let RecruitType = this.props.location.query.RecruitType;
                // JumpAction(STATE_NAME, RecruitType);
            } else {
                this.queryTableList();
            }
        }
        getRecruitSimpleList();
        getGiftInfoList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let numberQuery = ['RecruitStatus', 'HasSubsidy', 'AcceptLaborOrderType', 'PayType', "MasterPush"];
        let query = Object.entries(props.queryParams).reduce((pre, cur) => {
            if (cur[1]) {
                let v = cur[1].value;
                pre[cur[0]] = numberQuery.includes(cur[0]) ? Number(v) : v || '';
            }
            return pre;
        }, {});
        if (query.RecruitDate) {
            query.Date = query.RecruitDate.format('YYYY-MM-DD');
            delete query.RecruitDate;
        }
        if (query.Recruit) {
            query.RecruitName = query.Recruit.text;
            query.RecruitTmpID = query.Recruit.data ? query.Recruit.data.RecruitTmpID : null;
            if (query.RecruitTmpID) delete query.RecruitName;
            delete query.Recruit;
        }

        Object.entries(query).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1]) || Number.isNaN(data[1])) delete query[data[0]];
        });

        console.log('obtainQueryParam', query);
        

        if (query.RecruitType) {
            query.RecruitType = +query.RecruitType;
        }
        if (query.MasterPush) {
            query.MasterPush = query.MasterPush * 1;
        }
        // if (props.RecruitType > 0) query.RecruitType = props.RecruitType;
        return query;
    }

    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        console.log("4444444444444444444444", props);
        getRecruitInfoList({
            QueryParams: Object.entries(this.obtainQueryParam(props)).map(item => ({Key: item[0], Value: item[1]})),
            OrderParams: [],
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
        getCurrentRecruitCount({Date: props.queryParams.RecruitDate.value ? props.queryParams.RecruitDate.value.format('YYYY-MM-DD') : ''});
    }

    // handleRecruitTypeClick = (e) => {
    //     e.preventDefault();
    //     setParams(STATE_NAME, {
    //         RecruitType: Number(e.target.value),
    //         pageParam: {...this.props.pageParam, currentPage: 1}
    //     });
    // };

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    handleTabRowClick = (record, index, event) => {
        event.preventDefault();
        let FieldName = event.target.name;
        this.setState({
            rowRecord: record
        });
        switch (FieldName) {
            case 'config':
            case 'Salary':
            case 'LabourCostList':
            case 'SubsidyList':
            case 'EnrollFeeList':
                this.getQuoteInfo(record);
                break;
            case 'GatherInfo':
            case 'Remark':
                this.setState({
                    ConditionItemModal: {
                        Visible: true, record, FieldName, Value: record[FieldName],
                        title: FieldName === 'GatherInfo' ? '集合时间' : FieldName === 'Remark' ? '备注' : ''
                    }
                });
                break;
            case 'condition':
            case 'MaleScale':
            case 'Age':
            case 'NationInfo':
            case 'IDCardType':
            case 'Tattoo':
            case 'SmokeScar':
            case 'WantNumber':
                this.getConditionInfo(record, FieldName);
                break;
            case 'ShowType':
                this.setState({
                    ShowTypeModal: {
                        Visible: true, ShowType: record.ShowType,
                        SubsidyRemark: record.SubsidyRemark,
                        RecruitID: record.RecruitID,
                        LabourCostType: record.LabourCostList && record.LabourCostList.reduce((pre, cur) => pre + cur.SubsidyUnitPay, 0) > 0 ? 1 : 0,
                        SubsidyList: (record.SubsidyList || []).map(item => ({
                            ...item,
                            SubsidyAmount: (item.SubsidyAmount || 0) / 100
                        })),
                        EnrollFeeList: (record.EnrollFeeList || []).map(item => ({
                            ...item,
                            Fee: (item.Fee || 0) / 100
                        })),
                        LabourCostList: (record.LabourCostList || []).map(item => ({
                            ...item,
                            SubsidyUnitPay: (item.SubsidyUnitPay || 0) / 100,
                            UnitPay: (item.UnitPay || 0) / 100
                        }))
                    }
                });
                break;
        }
    };

    getConditionInfo = async (record, FieldName) => {
        let param = {RecruitTmpID: record.RecruitTmpID, RecruitDate: record.Date};
        try {
            let a = await getRecruitCondition(param);
            let EntAddress = '';
            try {
                let b = await getEntAddress(param);
                EntAddress = b.Data ? b.Data.EntAddress || '' : '';
            } catch (ignore) {
            }
            console.log(a.Data, "ffffffffffffffffffff");
            this.setState({
                ConditionModal: {Visible: true, ...a.Data, ...param, FieldName, EntAddress, TipsCheckboxs: a.Data.Tips !== "" ? ["A"] : []},
                ConditionRecord: record
            });
        } catch (err) {
            message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
        }
    };

    getQuoteInfo = async (record) => {
        getGiftInfoList();
        let param = {Date: record.Date, RecruitTmpID: record.RecruitTmpID};
        try {
            let a = await getLaborOrderByRecruitTmpID(param);
            let b = await getQuoteListByRecruitTmpID(param);
            let c = await getStandardSubsidy({RecruitDate: record.Date, RecruitTmpID: record.RecruitTmpID});
            let LabourCostList = (record.LabourCostList || []).map(item => ({
                ...item,
                SubsidyUnitPay: (item.SubsidyUnitPay || 0) / 100,
                UnitPay: (item.UnitPay || 0) / 100
            }));

            let LaborOrderList = a.Data ? a.Data.RecordList || [] : [];
            let QuoteList = b.Data ? b.Data.RecordList || [] : [];

            let isFirstEffect = false;
            for (let item of QuoteList) {
                if (!isFirstEffect) {
                    if (item.AuditStatus === 3) {
                        item.isFirstEffect = true;
                        isFirstEffect = true; // 生效的最新一条
                        continue;
                    }
                }
                if (item.AuditStatus !== 3) {
                    item.invalid = true;
                    continue;
                }
                // 收费不为0，赠品不为空
                if (item.EnrollFeeList && item.EnrollFeeList.length && item.GiftID) {
                    item.invalid = true;
                }
            }

            let GiftInfo = {};
            let gift = this.props.common.GiftInfoListObj[record.GiftID];
            if (gift && gift.GiftID) {
                GiftInfo = {data: gift, text: gift.GiftName, value: gift.GiftID.toString()};
            }
            this.setState({
                QuoteModal: {
                    LaborOrderList, QuoteList, Visible: true,
                    params: {
                        Salary: {value: {start: (record.MinSalary || 0) / 100, end: (record.MaxSalary || 0) / 100}},
                        SubsidyList: {
                            value: (record.SubsidyList || []).map(item => ({
                                ...item,
                                SubsidyAmount: (item.SubsidyAmount || 0) / 100
                            }))
                        },
                        EnrollFeeList: {
                            value: (record.EnrollFeeList || []).map(item => ({
                                ...item,
                                Fee: (item.Fee || 0) / 100
                            }))
                        },
                        LabourCostList: {value: LabourCostList},
                        SubsidyRemark: {value: record.SubsidyRemark},
                        UserfulSubsidyRemark: {
                            value: record.SubsidyRemark || "出名单必须在职，旷工无补贴，请假则补贴延后"
                        },
                        SubsidyType: {
                            value: `${(record.SubsidyList || []).length ? (record.SubsidyList[0].SubsidyType || 1) : 1}`
                        },
                        MustDays: {value: record.MustDays || ""}
                    },
                    GiftInfo, StandardSubsidy: c.Data || {}, // 建议补贴
                    LabourCostType: LabourCostList.reduce((pre, cur) => pre + cur.SubsidyUnitPay, 0) > 0 ? 1 : 0,
                    recordParam: param,
                    PayType: record.PayType
                },
                Checkbox: record.MustDays > 0 || record.SubsidyRemark !== "" ? ["A"] : [] 
            });
        } catch (err) {
            message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
        }
    };

    handleRecruitStatus = (record) => (value) => {
        if (record.RecruitStatus == 1) {
            getMasterPush({RecruitID: record.RecruitID, MasterPush: value ? 1 : 0});
        }
        this.setParams({RecordListLoading: true});
        setRecruitStatus({RecruitID: record.RecruitID, RecruitStatus: value ? 1 : 0})
            .then(res => {
                if (res.Code == 0) {
                    message.success('修改成功');
                    this.queryTableList();
                }
                if (record.RecruitType === 1 && !value) {// 如果关闭
                    if (moment().format('YYYY-MM-DD') === record.Date) {// 今日操作今日
                        sendNotify({
                            key: `${record.RecruitTmpID}-${record.Date}-RecruitStatus`,
                            newMsg: JSON.stringify({
                                Title: {
                                  RecruitName: record.RecruitName,
                                  DayType: 1
                                },
                                Content: [{
                                    key: '招聘状态：',
                                    value: value ? '开启' : '关闭'
                                }]
                            }),
                            oldMsg: JSON.stringify({
                              Title: {
                                  RecruitName: record.RecruitName,
                                  DayType: 1
                                },
                                Content: [{
                                    key: '招聘状态：',
                                    value: value ? '关闭' : '开启'
                                }]
                            })
                          });
                    }
            
                    if (moment().add(1, 'days').format('YYYY-MM-DD') === record.Date) {// 今日操作明日
                        if ((Date.now() > new Date(`${moment().format('YYYY-MM-DD')} 14:00`).getTime() && Date.now() < new Date(`${moment().format('YYYY-MM-DD')} 23:59`).getTime())) {// 今日操作明日的非第一次和14~23:59
                            sendNotify({
                                key: `${record.RecruitTmpID}-${record.Date}-RecruitStatus`,
                                newMsg: JSON.stringify({
                                    Title: {
                                      RecruitName: record.RecruitName,
                                      DayType: 2
                                    },
                                    Content: [{
                                        key: '招聘状态：',
                                        value: value ? '开启' : '关闭'
                                    }]
                                }),
                                oldMsg: JSON.stringify({
                                  Title: {
                                      RecruitName: record.RecruitName,
                                      DayType: 2
                                    },
                                    Content: [{
                                        key: '招聘状态：',
                                        value: value ? '关闭' : '开启'
                                    }]
                                })
                              });
                        }
                        
                    }
                }

            })
            .catch(err => {
                console.log("caoniama");
                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '修改失败');
                this.setParams({RecordListLoading: false});
            });
        
    };
    handlegetMasterPush = (record) => (value) => {
        if (record.RecruitStatus == 1) {
            getMasterPush({RecruitID: record.RecruitID, MasterPush: value ? 1 : 0})
            .then(res => {
                message.success('修改成功');
                this.queryTableList();
            })
            .catch(err => {
                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
            });
        }
    };

    handleConditionSetParams = (values) => {
        this.setState(preState => ({ConditionModal: {...preState.ConditionModal, ...values}}));
    };

    handleModalClose = (modal) => () => {
        let modalName = modal + 'Modal';
        if (modal === 'Condition') {
            this.refs.condition.resetFields();
        }
        this.setState({[modalName]: InitialState()[modalName]});
    };

    handleConditionModalConfirm = () => {
        let param = {...this.state.ConditionModal};
        console.log(this.state.ConditionModal);
        console.log(this.state.ConditionRecord);
        const { ConditionRecord } = this.state;
        console.log(param, "aaaaaaaaaa");
        delete param.Visible;
        delete param.RecruitID;
        let err = Condition.validate(param);
        if (err) {
            message.error(err);
        } else {
            this.setState(preState => ({ConditionModal: {...preState.ConditionModal, ConfirmLoading: true}}));
            setRecruitCondition({
                ...param,
                WantNumber: (param.WantNumber === 0 || param.WantNumber === '不限') ? 0 : +param.WantNumber,
                Tips: param.TipsCheckboxs && param.TipsCheckboxs.length > 0 ? param.Tips : ""
            })
                .then(res => {
                    message.success('修改成功');
                    this.handleModalClose('Condition')();
                    this.queryTableList();

                    if (ConditionRecord.RecruitStatus === 1 && ConditionRecord.RecruitType === 1) {// 招聘开启状态&&A类企业
                        const [oldContent, newContent] = this.getConditionalContent(ConditionRecord, param);
                        console.log('oldContent', oldContent);
                        console.log('newContent', newContent);
                    
                        if (newContent.length) {
                            if (moment().format('YYYY-MM-DD') === ConditionRecord.Date) {// 今日操作今日
                                sendNotify({
                                    key: `${ConditionRecord.RecruitTmpID}-${ConditionRecord.Date}-WantNumber`,
                                    newMsg: JSON.stringify({
                                        Title: {
                                        RecruitName: ConditionRecord.RecruitName,
                                        DayType: 1
                                        },
                                        Content: newContent
                                    }),
                                    oldMsg: JSON.stringify({
                                    Title: {
                                        RecruitName: ConditionRecord.RecruitName,
                                        DayType: 1
                                        },
                                        Content: oldContent
                                    })
                                });
                            }
                    
                            if (moment().add(1, 'days').format('YYYY-MM-DD') === ConditionRecord.Date) {// 今日操作明日
                                if ((Date.now() > new Date(`${moment().format('YYYY-MM-DD')} 14:00`).getTime() && Date.now() < new Date(`${moment().format('YYYY-MM-DD')} 23:59`).getTime())) {// 今日操作明日的非第一次和14~23:59
                                    sendNotify({
                                        key: `${ConditionRecord.RecruitTmpID}-${ConditionRecord.Date}-WantNumber`,
                                        newMsg: JSON.stringify({
                                            Title: {
                                            RecruitName: ConditionRecord.RecruitName,
                                            DayType: 2
                                            },
                                            Content: newContent
                                        }),
                                        oldMsg: JSON.stringify({
                                        Title: {
                                            RecruitName: ConditionRecord.RecruitName,
                                            DayType: 2
                                            },
                                            Content: oldContent
                                        })
                                    });
                                }
                            }
                        }
                    }

                })
                .catch(err => {
                    this.setState(preState => ({ConditionModal: {...preState.ConditionModal, ConfirmLoading: false}}));
                    message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '修改失败');
                });
        }
    };

    getConditionalContent(oldConditional, newConditional) {
        const oldContent = [];
        const newContent = [];
        const {
            MaleScale: oldMaleScale,
            FemaleScale: oldFemaleScale,
            MaleScaleStr,
            MaleMinAge: oldMaleMinAge,
            MaleMaxAge: oldMaleMaxAge,
            FeMaleMinAge: oldFeMaleMinAge,
            FeMaleMaxAge: oldFeMaleMaxAge,
            NationInfo: oldNationInfo,
            WantNumber: oldWantNumber
        } = oldConditional;

        const {
            MaleScale: newMaleScale,
            FemaleScale: newFemaleScale,
            MaleMinAge: newMaleMinAge,
            MaleMaxAge: newMaleMaxAge,
            FeMaleMinAge: newFeMaleMinAge,
            FeMaleMaxAge: newFeMaleMaxAge,
            NationInfo: newNationInfo,
            WantNumber: newWantNumber
        } = newConditional;

        // if (oldMaleScale !== newMaleScale || oldFemaleScale !== newFemaleScale) {// 性别改变
        //     oldContent.push({
        //         key: '性别比例：',
        //         value: MaleScaleStr || ''
        //     });
        //     newContent.push({
        //         key: '性别比例：',
        //         value: newMaleScale === 0 && newFemaleScale === 0
        //             ? '男女不限' 
        //             : (newMaleScale === 0 && newFemaleScale !== 0
        //                 ? '只招女性'
        //                 : (newMaleScale !== 0 && newFemaleScale === 0 
        //                     ? '只招男性' : `${newMaleScale}男${newFemaleScale}女`))
        //     });
        // }

        // if (oldMaleMinAge !== newMaleMinAge || oldMaleMaxAge !== newMaleMaxAge || oldFeMaleMinAge !== newFeMaleMinAge || oldFeMaleMaxAge !== newFeMaleMaxAge) { // 年龄改变
        //     oldContent.push({
        //         key: '年龄：',
        //         value: this.joinGenderAge(oldMaleMinAge, oldMaleMaxAge, oldFeMaleMinAge, oldFeMaleMaxAge) || ''
        //     });
        //     newContent.push({
        //         key: '年龄：',
        //         value: this.joinGenderAge(newMaleMinAge, newMaleMaxAge, newFeMaleMinAge, newFeMaleMaxAge) || ''
        //     });
        // }

        // if (oldNationInfo !== newNationInfo) { // 民族改变
        //     oldContent.push({
        //         key: '民族：',
        //         value: oldNationInfo
        //     });
        //     newContent.push({
        //         key: '民族：',
        //         value: newNationInfo
        //     });
        // }

        if (oldWantNumber !== newWantNumber) {
            oldContent.push({
                key: '名额：',
                value: oldWantNumber === 0 ? '不限' : `${oldWantNumber}人`
            });
            newContent.push({
                key: '名额：',
                value: (newWantNumber === '不限' || +newWantNumber === 0) ? '不限' : `${newWantNumber}人`
            });
        }

        return [oldContent, newContent];

    }

    joinGenderAge(MaleMinAge, MaleMaxAge, FeMaleMinAge, FeMaleMaxAge) {
        const Male = MaleMinAge || MaleMaxAge ? `${MaleMinAge || 0}~${MaleMaxAge || 0}` : undefined;
        const FeMale = FeMaleMinAge || FeMaleMaxAge ? `${FeMaleMinAge || 0}~${FeMaleMaxAge || 0}` : undefined;
        return Male && FeMale ? `男${Male}，女${FeMale}` : Male ? Male : FeMale;
    }

    handleQuoteModalConfirm = () => {
        let quoteState = this.state.QuoteModal;
        let recordParam = quoteState.recordParam;
        this.refs.quote.validateFields((err, fieldsValue) => {
            console.log(err);
            if (err && (!!Object.keys(err).filter(key => key !== 'SubsidyList').length || (err.SubsidyList && !!err.SubsidyList.errors.filter(item => !(item.errType && item.errType === 'warning')).length))) {
                return;
            }
            // if (err) return;
            let reqParam = Quote.obtainQueryParams(fieldsValue, quoteState.LabourCostType);
            if (reqParam.MustDays == "") {
                reqParam.MustDays = 0;
            }
            if (quoteState.params.SubsidyType.value == "1") {
                if (this.state.Checkbox.length > 0) {
                } else {
                    reqParam.SubsidyRemark = "";
                }
            }
            if (reqParam.EnrollFeeList.length || reqParam.SubsidyList.length || reqParam.LabourCostList.length) {
                this.handleSetRecruitQuotes(reqParam, recordParam, quoteState);
            } else {
                if (quoteState.PayType === 1) { // ZXX
                    modalConfirm({
                        title: '补贴、收费和工价都未设置，是否确认提交', okText: '确认提交',
                        content: '补贴、收费或工价信息必须有一个不为空。请务必核实后再提交。',
                        onOk: () => {
                            this.handleSetRecruitQuotes(reqParam, recordParam, quoteState);
                        }
                    });
                } else { // WD
                    modalInfo({
                        title: '补贴、收费和工价都未设置，是否确认提交', okText: '我知道了',
                        content: '补贴、收费或工价信息必须有一个不为空。请务必核实后再提交。'
                    });
                }
            }
        });
    };

    handleSetRecruitQuotes = async (reqParam, recordParam, quoteState) => {
        if (quoteState.GiftInfo) {
            let data = quoteState.GiftInfo.data;
            if (data) {
                reqParam.GiftInfo = {
                    GiftName: data.GiftName ? data.GiftName : quoteState.GiftInfo.text,
                    HoldCash: data.HoldCash || 0,
                    GiftID: data.GiftID || 0
                };
            } else {
                reqParam.GiftInfo = {
                    GiftName: quoteState.GiftInfo.text, HoldCash: 0, GiftID: 0
                };
            }
        }
        if (quoteState.StandardSubsidy) {
            reqParam.StandardID = quoteState.StandardSubsidy.StandardID;
        }

        try {
            await setRecruitQuotes({
                ...reqParam,
                RecruitDate: recordParam.Date,
                RecruitTmpID: recordParam.RecruitTmpID
            });
            message.success('修改成功');
            this.handleModalClose('Quote')();
            this.queryTableList();
        } catch (err) {
            if (err.Code === 50005) {
                message.error('基准价过期，请重新提交');
                try {
                    let res = await getStandardSubsidy({
                        RecruitDate: recordParam.Date,
                        RecruitTmpID: recordParam.RecruitTmpID
                    });
                    this.setState(preState => ({
                        QuoteModal: {...preState.QuoteModal, StandardSubsidy: res.Data || {}}
                    }));
                } catch (err) {
                    message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
                }
            } else {
                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
            }
        }
    };

    sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    handleQuoteConfirmModalConfirm = async () => {
        this.setState(preState => ({QuoteConfirmModal: {...preState.QuoteConfirmModal, ConfirmLoading: true}}));
        let recordParam = this.state.QuoteModal.recordParam;
        try {
            await cancelQuote(this.state.QuoteConfirmModal.param);
            let start = new Date().getTime();
            try {
                while (new Date().getTime() - start < 5000) {
                    let a = await queryCancelQuoteResult({RecruitAuditFlowID: this.state.QuoteConfirmModal.param.RecruitAuditFlowID});
                    if (a.Data && a.Data.Result === 1) break;
                    await this.sleep(1000);
                }
            } catch (ignore) {
            }
            message.success('操作成功');
            this.handleModalClose('QuoteConfirm')();
            let b = await getQuoteListByRecruitTmpID(recordParam);
            let QuoteList = b.Data ? b.Data.RecordList || [] : [];

            let isFirstEffect = false;
            for (let item of QuoteList) {
                if (!isFirstEffect) {
                    if (item.AuditStatus === 3) {
                        item.isFirstEffect = true;
                        isFirstEffect = true; // 生效的最新一条
                        continue;
                    }
                }
                if (item.AuditStatus !== 3) {
                    item.invalid = true;
                    continue;
                }
                // 收费不为0，赠品不为空
                if (item.EnrollFeeList && item.EnrollFeeList.length && item.GiftID) {
                    item.invalid = true;
                }
            }
            this.setState(preState => ({QuoteModal: {...preState.QuoteModal, QuoteList}}));
        } catch (err) {
            message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
        }
    };

    handleConditionItemModalConfirm = () => {
        let ConditionItemModal = this.state.ConditionItemModal;
        if (!ConditionItemModal.FieldName) {
            this.handleModalClose('ConditionItem')();
            return;
        }
        if (!ConditionItemModal.Value) {
            message.error('请输入' + ConditionItemModal.title);
            return;
        }
        this.setState(preState => ({ConditionItemModal: {...preState.ConditionItemModal, ConfirmLoading: true}}));
        let param = {
            ItemKey: ConditionItemModal.FieldName,
            ItemValue: ConditionItemModal.Value,
            RecruitDate: ConditionItemModal.record.Date,
            RecruitTmpID: ConditionItemModal.record.RecruitTmpID
        };
        setRecruitConditionItem(param)
            .then(res => {
                message.success('修改成功');
                this.handleModalClose('ConditionItem')();
                this.queryTableList();

                // const { rowRecord } = this.state;

                // if (rowRecord.RecruitStatus === 1) {
                //     if (ConditionItemModal.title === '集合时间' && param.ItemValue !== rowRecord.GatherInfo) {
                //         if (moment().format('YYYY-MM-DD') === rowRecord.Date) {// 今日操作今日
                //             sendMessage({
                //                 newMsg: JSON.stringify({
                //                     Title: {
                //                         RecruitName: rowRecord.RecruitName,
                //                         DayType: 1
                //                     },
                //                     Content: [{
                //                         key: '集合时间：',
                //                         value: param.ItemValue
                //                     }]
                //                 }),
                //                 oldMsg: JSON.stringify({
                //                     Title: {
                //                         RecruitName: rowRecord.RecruitName,
                //                         DayType: 1
                //                     },
                //                     Content: [{
                //                         key: '集合时间：',
                //                         value: rowRecord.GatherInfo
                //                     }]
                //                 })
                //             });
                //         }
                
                //         if (moment().add(1, 'days').format('YYYY-MM-DD') === rowRecord.Date) {// 今日操作明日
                //             if ((Date.now() > new Date(`${moment().format('YYYY-MM-DD')} 14:00`).getTime() && Date.now() < new Date(`${moment().format('YYYY-MM-DD')} 23:59`).getTime())) {// 今日操作明日的非第一次和14~23:59
                //                 sendMessage({
                //                     newMsg: JSON.stringify({
                //                         Title: {
                //                             RecruitName: rowRecord.RecruitName,
                //                             DayType: 2
                //                         },
                //                         Content: [{
                //                             key: '集合时间：',
                //                             value: param.ItemValue
                //                         }]
                //                     }),
                //                     oldMsg: JSON.stringify({
                //                         Title: {
                //                             RecruitName: rowRecord.RecruitName,
                //                             DayType: 2
                //                         },
                //                         Content: [{
                //                             key: '集合时间：',
                //                             value: rowRecord.GatherInfo
                //                         }]
                //                     })
                //                 });
                //             }
                //         }
                //     }
                // }
                
                

            })
            .catch(err => {
                this.setState(preState => ({
                    ConditionItemModal: {
                        ...preState.ConditionItemModal,
                        ConfirmLoading: false
                    }
                }));
                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '修改失败');
            });
    };

    handleConditionItemModalInput = (e) => {
        e.persist();
        this.setState(preState => {
            return {ConditionItemModal: {...preState.ConditionItemModal, [e.target.name]: e.target.value}};
        });
    };

    handleQuoteModalSetParams = (params) => {
        this.setState(preState => ({
            QuoteModal: {...preState.QuoteModal, ...params}
        }));
    };
    QuoteModalSetParams = (params) => {
        let preState = true;
        if (params.SubsidyList && params.SubsidyList.value) {
            (params.SubsidyList.value || []).map((item) => {
                if (moment().add("day", item.SubsidyDay) < moment("2019-02-05") && moment().add("day", item.SubsidyDay) > moment("2019-01-21")) {
                    preState = false;
                    this.setState(preState => ({
                        Checkbox: ["A"],
                        QuoteModal: {
                            ...preState.QuoteModal,
                                params: {
                                    ...params,
                                    UserfulSubsidyRemark: {
                                        value: "宝宝，年前可能拿不到补贴哦。\n出名单必须在职，旷工无补贴，请假则补贴延后"
                                    }
                                }}
                    }));
                } else {
                    if (preState == true) {
                        this.setState(preState => ({
                            Checkbox: [],
                            QuoteModal: {
                                ...preState.QuoteModal,
                                    params: {
                                        ...params,
                                        UserfulSubsidyRemark: {
                                            value: "出名单必须在职，旷工无补贴，请假则补贴延后"
                                        }
                                    }}
                        }));
                    }
                }
            });
        }
    }
    handleQuoteOperate = (record, index, event) => {
        event.preventDefault();
        let name = event.target.name;
        if (name)
            switch (name) {
                case 'set-standard':
                    this.setStandardSubsidy(record.LaborOrderID);
                    break;
                case 'set-accept':
                case 'set-reject':
                    this.setLaborOrderStatus(record.LaborOrderID, name === 'set-accept' ? 1 : 2);
                    break;
                case 'cancel-quote':
                    let recordParam = this.state.QuoteModal.recordParam;
                    let param = {RecruitAuditFlowID: record.RecruitAuditFlowID, RecruitDate: recordParam.Date};
                    getCancelQuoteEffectCount({
                        RecruitAuditFlowID: record.RecruitAuditFlowID,
                        RecruitDate: recordParam.Date
                    }).then(res => {
                        this.setState({
                            QuoteConfirmModal: {
                                Visible: true, param,
                                EffectCount: res.Data && res.Data.EffectCount ? res.Data.EffectCount : 0
                            }
                        });
                    }).catch(err => {
                        message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
                    });
                    break;
            }
    };

    setLaborOrderStatus = async (LaborOrderID, LaborOrderStatus) => {
        let recordParam = this.state.QuoteModal.recordParam;
        try {
            let d = await setLaborOrderStatus({LaborOrderID, LaborOrderStatus});
            let a = await getLaborOrderByRecruitTmpID(recordParam);
            this.setState(preState => ({
                QuoteModal: {
                    ...preState.QuoteModal,
                    LaborOrderList: a.Data ? a.Data.RecordList : []
                }
            }));
        } catch (err) {
            message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
        }
    };

    setStandardSubsidy = async (LaborOrderID) => {
        let recordParam = this.state.QuoteModal.recordParam;
        try {
            let c = await setStandardSubsidy({...recordParam, LaborOrderID});
            this.setState(preState => ({QuoteModal: {...preState.QuoteModal, StandardSubsidy: c.Data || {}}}));
            let a = await getLaborOrderByRecruitTmpID(recordParam);
            this.setState(preState => ({
                QuoteModal: {
                    ...preState.QuoteModal,
                    LaborOrderList: a.Data ? a.Data.RecordList : []
                }
            }));
        } catch (err) {
            message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
        }
    };

    handleShowTypeChange = (e) => {
        this.setState(preState => {
            return {
                ShowTypeModal: {...preState.ShowTypeModal, ShowType: e.target.name}
            };
        });
    };

    handleShowTypeModalConfirm = () => {
        let {ShowType, RecruitID} = this.state.ShowTypeModal;
        ShowType = Number.parseInt(ShowType, 10);
        if (!ShowType || Number.isNaN(ShowType)) {
            message.error('请设置价格顺序');
            return;
        }
        this.setState(preState => ({ShowTypeModal: {...preState.ShowTypeModal, ConfirmLoading: true}}));
        setShowOrder({RecruitID, ShowType})
            .then(res => {
                message.success('修改成功');
                this.handleModalClose('ShowType')();
                this.queryTableList();
            })
            .catch(err => {
                this.setState(preState => ({
                    ConditionItemModal: {...preState.ConditionItemModal, ConfirmLoading: false}
                }));
                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '修改失败');
            });
    };

    handleDropdownVisible = (visible) => {
        this.setState({
            dropdownMenuVisible: !this.state.dropdownMenuVisible
        });
    }

    handleSelectColumns = (e, index) => {
        const checked = e.target.checked;
        const value = e.target.value;
        
        if (checked) {
            setParams(STATE_NAME, {
                defaultColumns: this.props.defaultColumns.concat(value)
            });
            // this.setState({
            //     defaultColumns: this.state.defaultColumns.concat(value),
            //     columns: [...this.state.columns].concat(this.state.selectableColumns[index]).sort((prev, next) => {
            //         return (prev.key > next.key) ? 1 : ((next.key > prev.key) ? -1 : 0);
            //     })
            // });
        } else {
            setParams(STATE_NAME, {
                defaultColumns: this.props.defaultColumns.filter(item => item !== value)
            });
            // this.setState({
            //     defaultColumns: this.state.defaultColumns.filter(item => item !== value),
            //     columns: this.state.columns.filter(item => item.title !== value)
            // });
        }
    }

    render() {
        const setParams = this.setParams;
        const {RecordCount, RecordList, RecordListLoading, queryParams, pageParam, common, RecruitType, TypeACount, TypeBCount, TypeCCount, defaultColumns} = this.props;
        const {ConditionItemModal, QuoteModal, QuoteConfirmModal, ConditionModal, ShowTypeModal, selectableColumns, dropdownMenuVisible } = this.state;
        const disabledOperate = QuoteModal.recordParam && QuoteModal.recordParam.Date ? moment().isAfter(QuoteModal.recordParam.Date, 'day') : false;
        console.log(this.state.Checkbox, "rrrrrrrrrrrrrrrrrrrrrrrr");
        const menu = (
            <Menu>
              {selectableColumns.map((item, i) => {
                return i % 2 === 0 ? (
                    <Menu.Item key={i}>
                        <Checkbox checked={defaultColumns.indexOf(item.title) !== -1} value={`${item.title}`} onChange={(e) => this.handleSelectColumns(e, i)}>{item.title}</Checkbox>
                        {(selectableColumns.length - 1) < i + 1 ? '' : <Checkbox checked={defaultColumns.indexOf(selectableColumns[i + 1].title) !== -1} value={`${selectableColumns[i + 1].title}`} onChange={(e) => this.handleSelectColumns(e, i + 1)}>{selectableColumns[i + 1].title}</Checkbox>}
                    </Menu.Item>

                ) : '';
              })}
            </Menu>
          );

          const customColumns = this.state.columns.filter(item => defaultColumns.indexOf(item.title) !== -1).sort((prev, next) => {
                return (prev.key > next.key) ? 1 : ((next.key > prev.key) ? -1 : 0);
          });
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>每日招聘</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <Modal title={`修改${ConditionItemModal.title || ''}`} visible={ConditionItemModal.Visible}
                               maskClosable={false}
                               onOk={this.handleConditionItemModalConfirm}
                               onCancel={this.handleModalClose('ConditionItem')}
                               confirmLoading={ConditionItemModal.ConfirmLoading}>
                            <div style={{display: 'flex', marginTop: 8}}>
                                <label style={{flex: '0 1 80px', textAlign: 'right'}}>
                                    {ConditionItemModal.title}：
                                </label>
                                <Input.TextArea style={{width: '50%'}} maxLength="100"
                                                placeholder={`请输入${ConditionItemModal.title || ''}`}
                                                value={ConditionItemModal.Value || ''} name='Value'
                                                onChange={this.handleConditionItemModalInput}/>
                            </div>
                        </Modal>
                        <Modal
                            width='80%' title="配置招聘价格" visible={QuoteModal.Visible}
                            maskClosable={false} 
                            onOk={this.handleQuoteModalConfirm}
                            onCancel={this.handleModalClose('Quote')}
                            confirmLoading={QuoteModal.ConfirmLoading}>
                            <Quote
                                QuoteCheckbox={this.Checkbox}
                                Checkboxs={this.state.Checkbox}
                                ref='quote'
                                params={QuoteModal.params || {}}
                                recordParam={QuoteModal.recordParam || {}}
                                handleTabRowClick={this.handleQuoteOperate}
                                setParams={this.handleQuoteModalSetParams}
                                QuoteModalSetParams={this.QuoteModalSetParams}
                                GiftID={QuoteModal.GiftID} GiftInfo={QuoteModal.GiftInfo}
                                LaborOrderList={QuoteModal.LaborOrderList || []}
                                QuoteList={QuoteModal.QuoteList || []}
                                GiftInfoList={common.GiftInfoList}
                                disabled={disabledOperate}
                                LabourCostType={QuoteModal.LabourCostType}
                                StandardSubsidy={QuoteModal.StandardSubsidy}
                                GiftInfoListObj={common.GiftInfoListObj}
                                PayType={QuoteModal.PayType}
                            />
                        </Modal>

                        <Modal
                            title="提示" visible={QuoteConfirmModal.Visible}
                            maskClosable={false}
                            onOk={this.handleQuoteConfirmModalConfirm}
                            onCancel={this.handleModalClose('QuoteConfirm')}
                            confirmLoading={QuoteConfirmModal.ConfirmLoading}>
                            <div><Icon className='color-primary'/>是否确认作废该报价？</div>
                            <span>作废后将影响已经绑定该报价的面试名单。该报价已绑定<label
                                className='color-red'>{QuoteConfirmModal.EffectCount}</label>个面试名单。</span>
                        </Modal>
                        <Modal
                            width='80%' title="配置录用条件" visible={ConditionModal.Visible}
                            maskClosable={false}
                            onOk={this.handleConditionModalConfirm}
                            onCancel={this.handleModalClose('Condition')}
                            confirmLoading={ConditionModal.ConfirmLoading}>
                            <div style={{height: 450, overflow: 'scroll'}}>
                                <Condition
                                    ref="condition"
                                    {...ConditionInfoConfig}
                                    decodeCheckBox={decodeCheckBox}
                                    conditionInfo={ConditionModal}
                                    setParams={this.handleConditionSetParams}
                                />
                            </div>
                        </Modal>

                        <Modal
                            width='80%' title="设置价格顺序" visible={ShowTypeModal.Visible}
                            maskClosable={false}
                            onOk={this.handleShowTypeModalConfirm}
                            onCancel={this.handleModalClose('ShowType')}
                            confirmLoading={ShowTypeModal.ConfirmLoading}>
                            <Row>
                                <Col span={24}>
                                    <Form.Item {...formItemLayout} colon={false}
                                               label={<Radio name='1' checked={ShowTypeModal.ShowType == 1}
                                                             onChange={this.handleShowTypeChange}
                                                             disabled={!(ShowTypeModal.LabourCostList && ShowTypeModal.LabourCostList.length)}>
                                                   {ShowTypeModal.LabourCostType === 0 ? '最终工价:' : '基本工价+补贴工价:'}</Radio>}>
                                        <LabourCosts
                                            value={ShowTypeModal.LabourCostList}
                                            disabled LabourCostType={ShowTypeModal.LabourCostType}/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item {...formItemLayout} colon={false}
                                               label={<Radio name='3' checked={ShowTypeModal.ShowType == 3}
                                                             onChange={this.handleShowTypeChange}
                                                             disabled={!(ShowTypeModal.EnrollFeeList && ShowTypeModal.EnrollFeeList.length)}>收费:</Radio>}>
                                        <EnrollFees disabled value={ShowTypeModal.EnrollFeeList}/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item {...formItemLayout} colon={false}
                                               label={<Radio name='2' checked={ShowTypeModal.ShowType == 2}
                                                             onChange={this.handleShowTypeChange}
                                                             disabled={!(ShowTypeModal.SubsidyList && ShowTypeModal.SubsidyList.length)}>补贴:</Radio>}>
                                        <Subsidies disabled value={ShowTypeModal.SubsidyList}/>
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label=" " colon={false}>
                                        <Input.TextArea autosize={{minRows: 4, maxRows: 8}}
                                                        maxLength="100" disabled value={ShowTypeModal.SubsidyRemark}
                                                        placeholder="补贴备注，例如需要打卡多少天"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Modal>
                        <SearchForm
                            queryParams={queryParams}
                            setParams={setParams}
                            common={common}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Row className="mt-10 mb-10" type="flex" align="middle">
                            <Col span={18}>
                                <Alert type="info"
                                   message={`正在招聘中：${this.props.RecruitingCount || 0}个，未开启招聘：${this.props.UnopenCount || 0 }个，${this.props.NotLinkedCount || 0 }个劳务报价未关联，${this.props.UnsetSubsidyCount || 0 }个未设置补贴！！`}/>
                            </Col>
                             <Col span={6} style={{textAlign: 'right'}}>
                                <div id="dropdown-menu">
                                    <Dropdown overlay={menu} trigger={['click']} onVisibleChange={this.handleDropdownVisible} visible={dropdownMenuVisible}>
                                        <Button style={{ marginLeft: 8 }}>
                                            自定义表格模板 <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                </div>
                            </Col>
                        </Row>
                        {/* <div className="mt-16 mb-16">
                            <Button className="mr-16" type="primary" size="large"
                                    value="-9999" ghost={RecruitType !== -9999}
                                    onClick={this.handleRecruitTypeClick}>全部({RecordCount})</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value="1" ghost={RecruitType !== 1}
                                    onClick={this.handleRecruitTypeClick}>A类({TypeACount || 0})</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value="2" ghost={RecruitType !== 2}
                                    onClick={this.handleRecruitTypeClick}>B类({TypeBCount || 0})</Button>
                            <Button className="mr-16" type="primary" size="large"
                                    value="3" ghost={RecruitType !== 3}
                                    onClick={this.handleRecruitTypeClick}>C类({TypeCCount || 0})</Button>
                        </div> */}
                        <Table
                            className='recruit-table'
                            rowKey={'RecruitID'} bordered={true} size='small'
                            onRowClick={this.handleTabRowClick}
                            pagination={{
                                // total: RecruitType === 1 ? TypeACount : RecruitType === 2 ? TypeBCount : RecruitType === 3 ? TypeCCount : RecordCount,
                                total: RecordCount,
                                pageSize: pageParam.pageSize,
                                current: pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                pageSizeOptions: ['10', '50', '100', '200'],
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            columns={customColumns}
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
};