import React from 'react';
import {InputNumber, Select, Button} from 'antd';

import {RecruitGender} from "CONFIG/EnumerateLib/Mapping_Recruit";

const RecruitGenderEntries = Object.entries(RecruitGender);

const EnrollFee = ({Gender, onGenderChange, Fee, onFeeChange, handleDelete, disabled}) => {
    return (
        <div>
            <Select value={Gender.Value.toString()} style={{width: '80px'}} disabled={Gender.disabled || disabled}
                    onChange={onGenderChange}>
                {RecruitGenderEntries.map((i) => {
                    let gender = i[0];
                    let disabled = Gender.disableGenders && Gender.disableGenders.has(Number(gender));
                    return <Select.Option value={gender.toString()} key={gender}
                                          disabled={disabled}>{i[1]}</Select.Option>;
                })}
            </Select>
            <span className="ml-8 mr-8">收费</span>
            <InputNumber min={0} value={Fee} style={{width: '60px'}} onChange={onFeeChange} disabled={disabled}/>
            <span className="ml-8 mr-8">元/人</span>
            {!disabled &&
            <span><a href="javascript:void(0)" className="text-danger" onClick={handleDelete}>删除</a></span>}
        </div>
    );
};

export default class EnrollFees extends React.PureComponent {

    state = {};

    onChange = value => this.props.onChange ? this.props.onChange(value) : this.setState({value});

    handleChange = (index, type) => (v) => {
        let list = this.props.value;
        if (!list) list = this.state.value || [];
        let value = [...list];
        switch (type) {
            case 'Gender':
            case 'Fee':
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
                value.push({Gender, Fee: 0});
                break;
        }
        this.onChange(value);
    };

    aa = (value, index) => {
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
            Fee: item.Fee
        };
    };

    render() {
        const disabled = this.props.disabled;

        let value = this.props.value;
        if (!value) value = this.state.value || [];

        let disabledAdd = value.reduce((pre, cur) => {
            pre += cur.Gender === 0 ? 2 : 1;
            return pre;
        }, 0) >= 2;

        return (
            <div>
                {value.map((item, index) => <EnrollFee {...this.aa(value, index)}
                                                       disabled={disabled}
                                                       onGenderChange={this.handleChange(index, 'Gender')}
                                                       onFeeChange={this.handleChange(index, 'Fee')}
                                                       handleDelete={this.handleChange(index, 'Delete')}
                                                       key={index}/>)}
                {!disabled && <Button size='small' icon='plus' disabled={disabledAdd}
                                      onClick={this.handleChange(undefined, 'Add')}>添加</Button>}
            </div>
        );
    }

}
