import React from 'react';
import { AutoComplete, Form } from 'antd';

const Option = AutoComplete.Option;
const FormItem = Form.Item;

class AutoCompleteSelect extends React.PureComponent {
    constructor(props) {
        super(props);
        this.clickedSelect = false;
        this.inputValue = '';
        this.realValue = '';
        this.state = {
            inputValue: '',
            resultValue: ''
        };
    }
    handleChange(value) {
        if (!value) {
            this.props.onChange({
                value: '',
                text: ''
            });
            return false;
        } else {
            this.inputValue = value;
        }
        if (!this.inputValue || (this.inputValue !== value && (escape(this.inputValue).match(escape(value)) || escape(value).match(escape(this.inputValue))))) {
            this.clickedSelect = false;
            this.inputValue = value;
        }
        if (!this.clickedSelect) {
            this.props.onChange({
                value: '',
                text: value
            });
        } else {
            if (this.props.enableEntryValue && value !== this.realValue) {
                this.props.onChange({
                    value: '',
                    text: value
                });
            }
        }
    }
    handleSelect(value, option) {
        this.clickedSelect = true;
        this.inputValue = option.props.children;
        this.realValue = value;
        this.props.onChange({
            value: value,
            text: option.props.children
        });
    }
    render() {
        const { selectOptions, optionsData, placeholder, value, allowClear } = this.props;
        let od = optionsData && optionsData.dataArray && optionsData.dataArray.length ? optionsData.dataArray : [];
        let children = [];
        if (selectOptions) {
            children = selectOptions;
        } else {
            children = od.map((item, i) => {
                let text = '';
                let value;
                let key;
                if (typeof item === 'string') {
                    key = i;
                    value = item;
                    text = value;
                }
                if (typeof item === 'object') {
                    key = item[optionsData.valueKey];
                    value = item[optionsData.valueKey].toString();
                    if (typeof optionsData.textKey === 'string') {
                        text = item[optionsData.textKey];
                    } else {
                        for (let i = 0; i < optionsData.textKey.length; i++) {
                            text = text + (text ? '-' : '') + item[optionsData.textKey[i]];
                        }
                    }

                }
                return (<Option key={key} value={value}>{text}</Option>);
            });
        }
        return (
            <AutoComplete
                style={{ width: '100%' }}
                value={(this.props.value && this.props.value.text) ? this.props.value.text : ''}
                allowClear={allowClear}
                placeholder={placeholder || '请选择'}
                onChange={this.handleChange.bind(this)}
                onSelect={this.handleSelect.bind(this)}
                filterOption={(inputValue, option) => {
                    return escape(option.props.children).match(escape(inputValue)) || escape(inputValue).match(escape(option.props.children));

                }}
            >
                {children}
            </AutoComplete>
        );
    }
}

export default AutoCompleteSelect;