import React from 'react';
import {Input} from 'antd';

// 性别比例
class RecruitAge extends React.PureComponent {
    state = {};

    onChange = this.props.onChange ? (state) => {
        this.props.onChange({...this.props.value, ...state});
    } : this.setState;

    handleChange = (e) => {
        this.onChange({[e.target.name]: e.target.value});
    };

    render() {
        let value = this.props.value;
        const {MaleMinAge, MaleMaxAge, FeMaleMinAge, FeMaleMaxAge} = value ? value : this.state;
        return (
            <div>
                <div>
                    <Input style={{width: '130px'}} addonBefore="男（最低）" value={MaleMinAge} name='MaleMinAge'
                           onChange={this.handleChange} maxLength='3'/>
                    <Input style={{width: '130px'}} addonBefore="男（最高）" value={MaleMaxAge} name='MaleMaxAge'
                           onChange={this.handleChange} maxLength='3'/>
                </div>
                <div>
                    <Input style={{width: '130px'}} addonBefore="女（最低）" value={FeMaleMinAge} name='FeMaleMinAge'
                           onChange={this.handleChange} maxLength='3'/>
                    <Input style={{width: '130px'}} addonBefore="女（最高）" value={FeMaleMaxAge} name='FeMaleMaxAge'
                           onChange={this.handleChange} maxLength='3'/>
                </div>
            </div>

        );
    }
}

RecruitAge.validAge = (value, require) => {
    let message;
    if (value) {
        let MaleMinAge = Number(value.MaleMinAge || 0);
        let MaleMaxAge = Number(value.MaleMaxAge || 0);
        let FeMaleMinAge = Number(value.FeMaleMinAge || 0);
        let FeMaleMaxAge = Number(value.FeMaleMaxAge || 0);

        if (Number.isInteger(MaleMinAge) && Number.isInteger(MaleMaxAge) && Number.isInteger(FeMaleMinAge) && Number.isInteger(FeMaleMaxAge)) {
            if (MaleMinAge > MaleMaxAge || FeMaleMinAge > FeMaleMaxAge) {
                message = '最低不能大于最高';
            }
        } else {
            message = '身高只能为数字';
        }
    }
    if (require && !message) {
        message = '必填';
    }
    return message;
};

export default RecruitAge;