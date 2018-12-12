import React from 'react';
import {Input} from 'antd';

// 性别比例
class GenderRatio extends React.PureComponent {
    state = {};

    onChange = this.props.onChange ? (state) => {
        this.props.onChange({...this.props.value, ...state});
    } : this.setState;

    handleChange = (e) => {
        this.onChange({[e.target.name]: e.target.value});
    };

    render() {
        let value = this.props.value;
        const {male, female} = value ? value : this.state;
        return (
            <div>
                <div>
                    <Input style={{width: '100px', marginRight: 5}} addonBefore="男" value={male} name='male'
                           onChange={this.handleChange}/>:
                    <Input style={{width: '100px', marginLeft: 5}} addonBefore="女" value={female} name='female'
                           onChange={this.handleChange}/>
                </div>
                <div>
                    注：0:0（男女不限），3:1（3男1女），1:0（只招男性），0:1（只招女性）
                </div>
            </div>

        );
    }
}

GenderRatio.invalid = (value, required) => {
    if (value && (value.male || value.female)) {
        return !Number.isInteger(Number(value.male)) || !Number.isInteger(Number(value.female));
    }
    return !!required;
};

export default GenderRatio;