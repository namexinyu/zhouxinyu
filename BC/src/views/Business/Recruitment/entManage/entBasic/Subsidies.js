import React from 'react';
import { InputNumber, Select, Button } from 'antd';
import { RecruitGender } from "CONFIG/EnumerateLib/Mapping_Recruit";
import moment from 'moment';
const RecruitGenderEntries = Object.entries(RecruitGender);

const Subsidy = ({ Gender, onGenderChange, SubsidyDay, onSubsidyDayChange, SubsidyAmount, onSubsidyAmountChange, SetParams, handleDelete, disabled, position, Dates, SubsidyType, Datelist}) => (
    <div style={{ marginBottom: "15px" }}>
        <Select value={Gender.Value.toString()} style={{ width: '80px' }} disabled={Gender.disabled || disabled}
            onChange={onGenderChange}>
            {RecruitGenderEntries.map((i) => {
                let gender = i[0];
                let disabled = Gender.disableGenders && Gender.disableGenders.has(Number(gender));
                return <Select.Option value={gender.toString()} key={gender}
                    disabled={disabled}>{i[1]}</Select.Option>;
            })}
        </Select>
        <span className="ml-8 mr-8">满</span>
        <div style={{ display: "inline", position: 'relative' }}>
            <InputNumber min={0} value={SubsidyDay} style={{ width: '60px' }} onBlur={() => SetParams()} onChange={onSubsidyDayChange}
                disabled={disabled} />
            {
                (position) && <div style={{ position: "absolute", top: "16px", left: "0px", width: "500%", color: "red" }}>{
                    (SubsidyType.value == "1" && SubsidyDay > 0) ? (
                            (moment().add("day", SubsidyDay) < moment("2019-02-05") && moment().add("day", SubsidyDay) > moment("2019-01-21")) ? (moment().add("day", SubsidyDay)).format("YY") + "年" + (moment().add("day", SubsidyDay)).format("MM") + "月" + (moment().add("day", SubsidyDay)).format("DD") + "日," + "请提示会员年前拿不到补贴" : (moment().add("day", SubsidyDay)).format("MM") + "月" + (moment().add("day", SubsidyDay)).format("DD") + "日") : ""
                }</div>
            }
        </div>
        <span className="ml-8 mr-8">天 返</span>
        <InputNumber min={0} value={SubsidyAmount} disabled={disabled}
            style={{ width: '60px' }} onChange={onSubsidyAmountChange} />
        <span className="ml-8 mr-8">元/人</span>
        {!disabled && <span><a href="javascript:void(0)" className="text-danger" onClick={handleDelete}>删除</a></span>}

    </div>
);

class Subsidies extends React.PureComponent {

    state = {
        position: true
    };
    Date = { "2017": "2018-02-01", "2018": "2019-01-21", "2019": "2020-01-10", "2020": "2021-01-28", "2021": "2022-01-17", "2022": "2023-01-07", "2023": "2024-01-26", "2024": "2025-01-14" }
    Datelist = { "2017": "2018-02-15", "2018": "2019-02-04", "2019": "2020-01-24", "2020": "2021-02-11", "2021": "2022-02-02", "2022": "2023-01-21", "2023": "2024-02-09", "2024": "2025-01-28" };
    onChange = this.props.onChange ? (value) => this.props.onChange(value) : (value) => this.setState({ value });

    handleChange = (index, type) => (v) => {
      
        let list = this.props.value;
        if (!list) {
            list = this.state.value || [];
        }
        let value = [...list];
        switch (type) {
            case 'Gender':
            case 'SubsidyDay':
            case 'SubsidyAmount':
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
                value.push({ Gender, SubsidyAmount: 0, SubsidyDay: 0 });
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
            Gender: { Value: item.Gender, disableGenders },
            SubsidyDay: item.SubsidyDay,
            SubsidyAmount: item.SubsidyAmount
        };
    };
    SetParams = () => {
        this.props.QuoteModalSetParams(this.props.params);
    }
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
                {value.map((item, index) => <Subsidy SubsidyType={this.props.params ? (this.props.params.SubsidyType || "1") : "1"} {...this.aa(value, index)}
                    position={this.state.position}
                    disabled={disabled}
                    SetParams={this.SetParams}
                    Dates={this.Date}
                    Datelist={this.Datelist}
                    onGenderChange={this.handleChange(index, 'Gender')}
                    onSubsidyDayChange={this.handleChange(index, 'SubsidyDay')}
                    onSubsidyAmountChange={this.handleChange(index, 'SubsidyAmount')}
                    handleDelete={this.handleChange(index, 'Delete')}
                    key={index} />)}
                {!disabled && <Button size='small' icon='plus' disabled={disabledAdd}
                    onClick={this.handleChange(undefined, 'Add')}>添加</Button>}
            </div>
        );
    }

}

Subsidies.SubsidyDayInvalid = (value) =>
    value.reduce((pre, cur) => pre.add(cur.SubsidyDay), new Set()).size > 1;

Subsidies.SubsidyAmountInvalid = (value, maxAmount) => {
    for (let v of value) {
        if (v.SubsidyAmount && typeof v.SubsidyAmount === 'number') {
            return v.SubsidyAmount > maxAmount;
        }
    }
    return false;
};
export default Subsidies;