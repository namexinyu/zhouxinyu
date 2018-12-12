import React from 'react';
import {
    Row,
    Form,
    Col,
    Input,
    Radio,
    Table,
    InputNumber,
    Select,
    Checkbox
} from 'antd';
import 'ASSET/less/Business/ent/ent-form.less';
import RecommendSalary from '../entManage/entBasic/RecommendSalary';
import Subsidies from '../entManage/entBasic/Subsidies';
import EnrollFees from '../entManage/entBasic/EnrollFees';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import LabourCosts from "../entManage/entBasic/LabourCosts";
import {Gender} from "CONFIG/EnumerateLib/Mapping_Recruit";

const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 18}};
const formItemLayout3 = {labelCol: {span: 3}, wrapperCol: {span: 21}};
const LaborOrderTable = (disabled) => [
    {title: '招聘日期', dataIndex: 'Date'},
    {title: '劳务公司', dataIndex: 'LaborName'},
    {
        title: '收费', dataIndex: 'LaborChargeList',
        render: (text, record) => text && text.length ? text.map((item, index) =>
            <div key={index}>{Gender[item.Gender]}:{item.ChargeAmount / 100}元</div>
        ) : 0
    }, {
        title: '返费', dataIndex: 'LaborSubsidyList',
        render: (text, record) => text && text.map(item =>
            <div key={item.LaborOrderSubsidyID}>
                {Gender[item.Gender]}:{item.SubsidyDay}天返{item.SubsidyAmount / 100}元
            </div>
        )
    }, {
        title: '报价状态', dataIndex: 'AcceptStatus',
        render: (text) => (text === 0 ? '待确认' : text === 1 ? '生效' : text === 2 ? '作废' : '-')
    },
    {title: '备注', dataIndex: 'Remark'},
    {title: '提交时间', dataIndex: 'CreateTime'},
    {
        title: '操作', dataIndex: 'xx',
        render: (text, record) => {
            if (record.AcceptStatus === 1) { // 生效
                if (record.IsStandard) {
                    return <a>当前基准价</a>;
                } else {
                    return !disabled && record.LaborSubsidyList && record.LaborSubsidyList.length ?
                        <a name="set-standard">选为基准</a> : '';
                }
            } else {
                return disabled || record.AcceptStatus === 2 ? '' :
                    <div><a name="set-accept">通过</a>|<a name="set-reject">拒绝</a></div>;
            }
        }
    }
];

const QuoteLisTable = (GiftInfoListObj, disabled) => [
    {title: '招聘日期', dataIndex: 'Date'},
    {
        title: '会员收费', dataIndex: 'EnrollFeeList',
        render: (text, record) => text && text.length ? text.map((item, index) =>
            <div key={index}>{Gender[item.Gender]}:{item.Fee / 100}元</div>
        ) : 0
    }, {
        title: '会员补贴',
        dataIndex: 'SubsidyList',
        render: (text, record) => text && text.map(item =>
            <div key={item.RecruitSubsidyID}>
                {Gender[item.Gender]}:{item.SubsidyDay}天返{item.SubsidyAmount / 100}元
            </div>
        )
    }, {
        title: '补贴类型',
        key: 'SubsidyType',
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
        title: '赠品', dataIndex: 'GiftID',
        render: text => GiftInfoListObj[text] ? GiftInfoListObj[text].GiftName : ''
    }, {
        title: '补贴状态',
        dataIndex: 'AuditStatus',
        render: (text) => (text === 1 ? '未审核' : text === 2 ? '失效' : text === 3 ? '生效' : '-')
    },
    {title: '提交时间', dataIndex: 'CreateTime'},
    {
        title: '操作', dataIndex: 'xx',
        render: (text, record, index) => disabled ? '' :
            <a name={record.isFirstEffect || record.invalid ? '' : 'cancel-quote'}>
                {record.isFirstEffect || record.invalid ? '--' : '作废'}
            </a>
    }
];

const Quote = Form.create({
    mapPropsToFields: props => ({...props.params}),
    onFieldsChange: (props, fields) => {
        const { SubsidyType } = fields;
        if (SubsidyType) {
            props.setParams({
                params: {
                    ...props.params,
                    ...fields
                }
            });
        } else {
            props.setParams({params: {...props.params, ...fields}});
        }
    }
})(({form, GiftInfoListObj, LaborOrderList, QuoteList, GiftInfoList, GiftInfo, Checkboxs, QuoteCheckbox, StandardSubsidy, LabourCostType, setParams, handleTabRowClick, disabled, params, PayType, QuoteModalSetParams}) => {
    const {getFieldDecorator} = form;
    
    return <div>
        <Form className='ent-form'>
            <Row>
                <Col span={12}>
                    <Form.Item {...formItemLayout} label="综合薪资">
                        {getFieldDecorator('Salary', {
                            initialValue: {start: 0, end: 0},
                            rules: [
                                {required: true, message: '综合薪资必填'},
                                {
                                    validator: (rule, value, cb) => value.start === 0 || value.end === 0 ? cb(true) : cb(),
                                    message: '综合薪资必填'
                                }, {
                                    validator: (rule, value, cb) => value.start > value.end ? cb(true) : cb(),
                                    message: '金额无效'
                                }
                            ]
                        })(<RecommendSalary disabled={disabled}/>)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item {...formItemLayout} label="赠品">
                        <Row>
                            <Col span={12}>
                                <AutoCompleteInput
                                    disabled={disabled}
                                    value={GiftInfo}
                                    onChange={(value) => {
                                        setParams({GiftInfo: value});
                                    }}
                                    maxLength="64"
                                    textKey="GiftName" valueKey="GiftID"
                                    dataSource={GiftInfoList}/>
                            </Col>
                            <Col span={1}>/</Col>
                            <Col span={11}>
                                <InputNumber
                                    disabled={disabled}
                                    value={GiftInfo && GiftInfo.data ? (GiftInfo.data.HoldCash || 0) / 100 : 0}
                                    onChange={(value) => {
                                        setParams({
                                            GiftInfo: {
                                                text: GiftInfo ? GiftInfo.text : '',
                                                data: {HoldCash: value * 100}
                                            }
                                        });
                                    }}
                                />元
                            </Col>
                        </Row>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item {...formItemLayout3} label="工价">
                        <Radio.Group
                            disabled={disabled}
                            onChange={(e) => setParams({[e.target.name]: e.target.value})}
                            name='LabourCostType'
                            value={LabourCostType}>
                            <Radio value={0}>最终工价</Radio>
                            <Radio value={1}>基本工价+补贴工价</Radio>
                        </Radio.Group>
                        {getFieldDecorator('LabourCostList', {
                            initialValue: []
                        })(<LabourCosts
                            disabled={disabled}
                            LabourCostType={LabourCostType}/>)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item {...formItemLayout} label="补贴">
                        {getFieldDecorator('SubsidyList', {
                            initialValue: [],
                            rules: [
                                {
                                    validator: (rule, value, cb) => {
                                        if (Subsidies.SubsidyAmountInvalid(value, 10000)) {
                                            cb('补贴价格不可>10000元');
                                        }

                                        if (LaborOrderList && LaborOrderList.length && PayType !== 1) {
                                            const usefulLaborOrderList = LaborOrderList.filter(item => item.AcceptStatus === 1).filter(item => item.LaborSubsidyList && item.LaborSubsidyList.length);

                                            if (usefulLaborOrderList.length) {
                                                const mergedLaborOrderList = usefulLaborOrderList.map(order => {
                                                    return {
                                                        ...order,
                                                        LaborSubsidyList: (order.LaborSubsidyList || []).reduce((wrap, cur, index) => {
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
                                                        }, [])
                                                        
                                                    };
                                                });

                                                const MaleSubsidyList = mergedLaborOrderList.map(item => item.LaborSubsidyList).reduce((wrap, cur) => {
                                                    return wrap.concat(...cur);
                                                }, []).filter(item => item.Gender === 1);

                                                const FemaleSubsidyList = mergedLaborOrderList.map(item => item.LaborSubsidyList).reduce((wrap, cur) => {
                                                    return wrap.concat(...cur);
                                                }, []).filter(item => item.Gender === 2);

                                                let subsidyCheckMsg = null;

                                                if (MaleSubsidyList.length) {
                                                    // 男性有效劳务报价最高补贴天数
                                                    const maxMaleSubsidyDay = Math.max(...MaleSubsidyList.map(item => item.SubsidyDay));

                                                    // 男性有效劳务报价最低补贴天数
                                                    const minMaleSubsidyDay = Math.min(...MaleSubsidyList.map(item => item.SubsidyDay));

                                                    // 男性有效劳务报价最高金额
                                                    const maxMaleSubsidyAmount = Math.max(...MaleSubsidyList.map(item => item.SubsidyAmount));

                                                    // 男性有效劳务报价最低金额
                                                    const minMaleSubsidyAmount = Math.min(...MaleSubsidyList.map(item => item.SubsidyAmount));

                                                    (value || []).filter(item => item.Gender !== 2).forEach(item => {
                                                        if (item.SubsidyDay <= maxMaleSubsidyDay) {
                                                            subsidyCheckMsg = {
                                                                message: `确认当前补贴天数？${item.SubsidyAmount >= (maxMaleSubsidyAmount / 100) ? '请核实补贴金额' : (item.SubsidyAmount >= (minMaleSubsidyAmount / 100) ? '确认当前补贴金额？' : '')}`,
                                                                errType: item.SubsidyAmount >= (maxMaleSubsidyAmount / 100) ? 'error' : 'warning'
                                                            };
                                                        }

                                                        if (item.SubsidyDay <= minMaleSubsidyDay) {
                                                            subsidyCheckMsg = {
                                                                message: `请核实补贴天数${item.SubsidyAmount >= (maxMaleSubsidyAmount / 100) ? '，请核实补贴金额' : (item.SubsidyAmount >= (minMaleSubsidyAmount / 100) ? '，确认当前补贴金额？' : '')}`,
                                                                errType: 'error'
                                                            };
                                                        }

                                                        if (item.SubsidyAmount >= (minMaleSubsidyAmount / 100)) {
                                                            subsidyCheckMsg = {
                                                                message: `确认当前补贴金额？${item.SubsidyDay <= minMaleSubsidyDay ? '请核实补贴天数' : (item.SubsidyDay <= maxMaleSubsidyDay ? '确认当前补贴天数？' : '')}`,
                                                                errType: item.SubsidyDay <= minMaleSubsidyDay ? 'error' : 'warning'
                                                            };
                                                        }

                                                        if (item.SubsidyAmount >= (maxMaleSubsidyAmount / 100)) {
                                                            subsidyCheckMsg = {
                                                                message: `请核实补贴金额${item.SubsidyDay <= minMaleSubsidyDay ? '，请核实补贴天数' : (item.SubsidyDay <= maxMaleSubsidyDay ? '，确认当前补贴天数？' : '')}`,
                                                                errType: 'error'
                                                            };
                                                        }
                                                    });
                                                }

                                                if (FemaleSubsidyList.length) {
                                                    // 男性有效劳务报价最高补贴天数
                                                    const maxFemaleSubsidyDay = Math.max(...FemaleSubsidyList.map(item => item.SubsidyDay));

                                                    // 男性有效劳务报价最低补贴天数
                                                    const minFemaleSubsidyDay = Math.min(...FemaleSubsidyList.map(item => item.SubsidyDay));

                                                    // 男性有效劳务报价最高金额
                                                    const maxFemaleSubsidyAmount = Math.max(...FemaleSubsidyList.map(item => item.SubsidyAmount));

                                                    // 男性有效劳务报价最低金额
                                                    const minFemaleSubsidyAmount = Math.min(...FemaleSubsidyList.map(item => item.SubsidyAmount));

                                                    (value || []).filter(item => item.Gender !== 1).forEach(item => {
                                                        if (item.SubsidyDay <= maxFemaleSubsidyDay) {
                                                            subsidyCheckMsg = {
                                                                message: `确认当前补贴天数？${item.SubsidyAmount >= (maxFemaleSubsidyAmount / 100) ? '请核实补贴金额' : (item.SubsidyAmount >= (minFemaleSubsidyAmount / 100) ? '确认当前补贴金额？' : '')}`,
                                                                errType: item.SubsidyAmount >= (maxFemaleSubsidyAmount / 100) ? 'error' : 'warning'
                                                            };
                                                        }

                                                        if (item.SubsidyDay <= minFemaleSubsidyDay) {
                                                            subsidyCheckMsg = {
                                                                message: `请核实补贴天数${item.SubsidyAmount >= (maxFemaleSubsidyAmount / 100) ? '，请核实补贴金额' : (item.SubsidyAmount >= (minFemaleSubsidyAmount / 100) ? '，确认当前补贴金额？' : '')}`,
                                                                errType: 'error'
                                                            };
                                                        }

                                                        if (item.SubsidyAmount >= (minFemaleSubsidyAmount / 100)) {
                                                            subsidyCheckMsg = {
                                                                message: `确认当前补贴金额？${item.SubsidyDay <= minFemaleSubsidyDay ? '请核实补贴天数' : (item.SubsidyDay <= maxFemaleSubsidyDay ? '确认当前补贴天数？' : '')}`,
                                                                errType: item.SubsidyDay <= minFemaleSubsidyDay ? 'error' : 'warning'
                                                            };
                                                        }

                                                        if (item.SubsidyAmount >= (maxFemaleSubsidyAmount / 100)) {
                                                            subsidyCheckMsg = {
                                                                message: `请核实补贴金额${item.SubsidyDay <= minFemaleSubsidyDay ? '，请核实补贴天数' : (item.SubsidyDay <= maxFemaleSubsidyDay ? '，确认当前补贴天数？' : '')}`,
                                                                errType: 'error'
                                                            };
                                                        }
                                                    });
                                                }

                                                if (!subsidyCheckMsg) {
                                                    const computedValue = (value || []).reduce((wrap, cur) => {
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
                                                    }, []);
    
                                                    const hasMaleSubsidy = computedValue.some(item => item.Gender === 1);
                                                    const hasFemaleSubsidy = computedValue.some(item => item.Gender === 2);

                                                    if ((hasMaleSubsidy && !MaleSubsidyList.length) || (hasFemaleSubsidy && !FemaleSubsidyList.length)) {
                                                        subsidyCheckMsg = {
                                                            message: '请核实补贴性别设置是否有误',
                                                            errType: 'error'
                                                        };
                                                    }
                                                }

                                                subsidyCheckMsg && cb(subsidyCheckMsg);

                                            }
                                        }

                                        cb();
                                    }
                                }
                                // {validator: (rule, value, cb) => cb(Subsidies.SubsidyAmountInvalid(value, 10000) ? '补贴价格不可>10000元' : undefined)}
                            ]
                        })(<Subsidies QuoteModalSetParams={QuoteModalSetParams} params={params} disabled={disabled}/>)}
                    </Form.Item>
                    {StandardSubsidy && StandardSubsidy.StandardID && StandardSubsidy.SuggestSubsidyList && StandardSubsidy.SuggestSubsidyList.length &&
                    <Form.Item {...formItemLayout} label=" " colon={false}>
                        <span className="color-red">
                                建议补贴：{StandardSubsidy.SuggestSubsidyList.reduce((pre, cur, index) =>
                                `${pre}${index > 0 ? ',' : ''}${cur.Gender === 1 ? '男补' : cur.Gender === 2 ? '女补' : '男女不限'}${(cur.SubsidyAmount || 0) / 100}元`,
                            '')}
                            </span>
                    </Form.Item>
                    }
                    <Form.Item {...formItemLayout} label="补贴类型">
                        <div>
                            {getFieldDecorator('SubsidyType', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择补贴类型'
                                    }
                                ]
                            })(
                                <Select
                                  placeholder="请选择"
                                  size="default"
                                  style={{ width: 120 }}
                                >
                                    <Select.Option value="1">在职日</Select.Option>
                                    <Select.Option value="2">工作日</Select.Option>
                                </Select>
                            )}
                        </div>
                       
                    </Form.Item>
                    <Form.Item style={{marginLeft: "-5%"}}>
                        {
                            ((params || {}).SubsidyType || {}).value * 1 == 1 ? <div style={{ marginLeft: "20%"}}>
                                <Checkbox.Group value={Checkboxs} onChange={(checkedValues) => {
                                    QuoteCheckbox(checkedValues);
                                }}>
                                    <Col><Checkbox value="A">温馨提示:</Checkbox></Col>
                                </Checkbox.Group>
                            </div> : ""
                        }
                       
                        <div style={{marginLeft: "30%"}}>
                            {   
                            ((params || {}).SubsidyType || {}).value * 1 == 1 ? <span><span>出勤打卡必须满 </span>{getFieldDecorator('MustDays')(<InputNumber disabled={Checkboxs.length > 0 ? false : true} type="Number" min={0} max={999999} />)}<span> 天，否则无补贴。</span></span> : ""
                            }
                            {getFieldDecorator('UserfulSubsidyRemark', {
                                rules: [
                                    {
                                        validator: function (rule, value, cb) {
                                            if (!!value && !!value.length && ((params || {}).SubsidyType || {}).value == 2 && value.length > 52) {
                                                cb('温馨提示最多52个字');
                                            }
                                            cb();
                                        }
                                    }
                                ]
                            })(<Input.TextArea disabled={((params || {}).SubsidyType || {}).value * 1 !== 1 ? false : Checkboxs.length > 0 ? false : true} style={{margin: "4px 0 0 0", display: "inline", width: "50%"}} autosize={{minRows: 4, maxRows: 8}}
                                            maxLength="52"
                                            placeholder=""/>)}<span style={{display: "inline"}}>（*注：温馨提示会在会员倒计时旁显示。）</span>
                        </div>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item {...formItemLayout} label="收费">
                        {getFieldDecorator('EnrollFeeList', {
                            initialValue: [],
                            rules: [
                                // {required: true, message: '收费必填'}
                            ]
                        })(<EnrollFees disabled={disabled}/>)}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        <Table
            title={() => '劳务报价'} columns={LaborOrderTable(disabled)}
            rowKey={'LaborOrderID'} bordered={true} pagination={false}
            rowClassName={record => record.AcceptStatus === 1 ? 'bg-yellow' : ''}
            onRowClick={handleTabRowClick} dataSource={LaborOrderList}/>
        <Table
            title={() => '会员补贴'} columns={QuoteLisTable(GiftInfoListObj, disabled)}
            rowKey={'RecruitAuditFlowID'} bordered={true} pagination={false}
            rowClassName={record => record.AuditStatus === 3 ? 'bg-yellow' : ''}
            onRowClick={handleTabRowClick} dataSource={QuoteList}/>
    </div>;
});

Quote.obtainQueryParams = (values, LabourCostType) => {
    values = {...values};
    let param = {};
    param.MustDays = values.MustDays;
    param.MinSalary = values.Salary.start * 100;
    param.MaxSalary = values.Salary.end * 100;
    param.SubsidyList = values.SubsidyList.map(item => ({...item, SubsidyAmount: item.SubsidyAmount * 100, SubsidyType: +values.SubsidyType }));
    param.SubsidyRemark = values.UserfulSubsidyRemark;
    param.EnrollFeeList = values.EnrollFeeList.map(item => ({...item, Fee: item.Fee * 100}));
    param.LabourCostList = values.LabourCostList.map(item => ({
        ...item,
        SubsidyUnitPay: LabourCostType ? Number.parseInt(item.SubsidyUnitPay * 100, 10) : 0,
        UnitPay: Number.parseInt(item.UnitPay * 100, 10)
    }));
    return param;
};

export default Quote;