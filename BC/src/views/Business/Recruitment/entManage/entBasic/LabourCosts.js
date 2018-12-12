import React from 'react';
import {InputNumber, Select, Button} from 'antd';
import {ValuateUnit, RecruitGender} from "CONFIG/EnumerateLib/Mapping_Recruit";

const RecruitGenderEntries = Object.entries(RecruitGender);
const ValuateUnitSelect = Object.entries(ValuateUnit).map(item =>
    <Select.Option value={item[0]} key={item[0]}>{item[1]}</Select.Option>);

const LabourCost = ({Gender, onGenderChange, UnitPay, SubsidyUnitPay, ValuateUnit, onUnitPayChange, onSubsidyUnitPayChange, onValuateUnitChange, handleDelete, LabourCostType, disabled}) => {
    return (
        <div>
            <Select value={Gender.Value.toString()} style={{width: '60px'}} disabled={Gender.disabled || disabled}
                    onChange={onGenderChange}>
                {RecruitGenderEntries.map((i) => {
                    let gender = i[0];
                    let disabled = Gender.disableGenders && Gender.disableGenders.has(Number(gender));
                    return <Select.Option value={gender.toString()} key={gender}
                                          disabled={disabled}>{i[1]}</Select.Option>;
                })}
            </Select>
            <InputNumber min={0} value={UnitPay} style={{width: '80px', marginRight: 8, marginLeft: 8}}
                         disabled={disabled} step={0.01}
                         onChange={onUnitPayChange} placeholder={LabourCostType === 1 ? '基准工价' : '工价'}/>
            {LabourCostType === 1 && <label>+</label>}
            {LabourCostType === 1 &&
            <InputNumber min={0} value={SubsidyUnitPay} className='ml-8 mr-8' disabled={disabled} step={0.01}
                         onChange={onSubsidyUnitPayChange} placeholder='补贴工价'/>}
            <span className="ml-8 mr-8">元/</span>
            <Select value={ValuateUnit.toString()} onChange={onValuateUnitChange} style={{width: '60px'}}
                    disabled={disabled}>
                {ValuateUnitSelect}
            </Select>
            {!disabled &&
            <span><a href="javascript:void(0)" className="text-danger ml-8" onClick={handleDelete}>删除</a></span>}
        </div>
    );
};

export default class LabourCosts extends React.PureComponent {

    state = {};

    onChange = value => this.props.onChange ? this.props.onChange(value) : this.setState({value});

    handleChange = (index, type) => (v) => {
        let list = this.props.value;
        if (!list) list = this.state.value || [];
        let value = [...list];
        switch (type) {
            case 'UnitPay':
            case 'SubsidyUnitPay':
                let vvv = v;
                if (typeof v === 'number') {
                    vvv = ~~v !== v ? v.toFixed(2) : v;
                }
                value[index][type] = vvv;
                break;
            case 'Gender':
            case 'ValuateUnit':
                let vv = Number.parseInt(v, 10);
                value[index][type] = Number.isNaN(vv) ? 0 : vv;
                break;
            case 'Delete':
                value.splice(index, 1);
                break;
            case 'Add':
                let Gender = 0;
                let disableGenders = value.reduce((pre, cur, i) => {
                    pre.add(cur.Gender);
                    return pre;
                }, new Set());
                if (disableGenders.size) disableGenders.add(0);
                for (let g of RecruitGenderEntries) {
                    let gender = Number(g[0]);
                    if (!disableGenders.has(gender)) {
                        Gender = gender;
                        break;
                    }
                }
                value.push({Gender, UnitPay: 0, SubsidyUnitPay: 0, ValuateUnit: 0});
                break;
        }
        this.onChange(value);
    };

    aa = (value, index, LabourCostType) => {
        let item = value[index];
        let disableGenders = value.reduce((pre, cur, i) => {
            if (i !== index) pre.add(cur.Gender);
            return pre;
        }, new Set());
        if (disableGenders.size) disableGenders.add(0);
        if (disableGenders.has(item.Gender)) {
            item.Gender = Number(RecruitGenderEntries.reduce((pre, cur) => cur[0] == pre ? pre : cur[0], item.Gender));
        }
        return {
            Gender: {Value: item.Gender, disableGenders},
            UnitPay: item.UnitPay,
            SubsidyUnitPay: LabourCostType === 1 ? item.SubsidyUnitPay : 0,
            ValuateUnit: item.ValuateUnit
        };
    };

    render() {
        let value = this.props.value;
        let LabourCostType = this.props.LabourCostType;
        if (!value) value = this.state.value || [];
        const disabled = this.props.disabled;

        let disabledAdd = value.reduce((pre, cur) => {
            pre += cur.Gender === 0 ? 2 : 1;
            return pre;
        }, 0) >= 2;

        return (
            <div>
                {value.map((item, index) => <LabourCost {...this.aa(value, index, LabourCostType)}
                                                        disabled={disabled}
                                                        LabourCostType={LabourCostType}
                                                        onGenderChange={this.handleChange(index, 'Gender')}
                                                        onUnitPayChange={this.handleChange(index, 'UnitPay')}
                                                        onSubsidyUnitPayChange={this.handleChange(index, 'SubsidyUnitPay')}
                                                        onValuateUnitChange={this.handleChange(index, 'ValuateUnit')}
                                                        handleDelete={this.handleChange(index, 'Delete')}
                                                        key={index}/>)}
                {!disabled && <Button size='small' icon='plus' disabled={disabledAdd}
                                      onClick={this.handleChange(undefined, 'Add')}>添加</Button>}
            </div>
        );
    }

}
