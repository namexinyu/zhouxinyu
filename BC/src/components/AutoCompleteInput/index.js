import React from 'react';
import {AutoComplete, Input, Icon} from 'antd';

/**
 * 如果传入fetch，且dataSourceFetch,则使用fetch的dataSource，否则使用props的dataSource
 * handleQueryDataSource（dataSource）为fetch的dataSource
 */
class AutoCompleteInput extends React.PureComponent {

    dataSourceFetch = this.props.fetch && this.props.fetch.dataSourceFetch;
    dataSourceFetchKey = this.props.fetch && this.props.fetch.dataSourceFetchKey && this.props.fetch.dataSourceFetchKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.fetch.dataSourceFetchKey : false;

    fetchTimeOut = this.props.fetchTimeOut > 0 ? this.props.fetchTimeOut : 800;

    valueKey = this.props.valueKey && this.props.valueKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.valueKey : false;
    textKey = this.props.textKey && this.props.textKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.textKey : false;
    disabledKey = this.props.disabledKey && this.props.disabledKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.disabledKey : false;
    textExt = this.props.textExt && typeof this.props.textExt === 'function' ? this.props.textExt : false;
    state = {};

    fetchDataSource() {
        if (!this.dataSourceFetch) return;
        if (this.autoCompleteInputTimeout) {
            clearTimeout(this.autoCompleteInputTimeout);
            this.autoCompleteInputTimeout = null;
        }
        this.autoCompleteInputTimeout = setTimeout(() => {
            this.dataSourceFetch(this.props.value)
                .then(result => {
                    let dataSource = result.Data && this.dataSourceKey ? result.Data[this.dataSourceKey] : result.Data;
                    if (dataSource instanceof Array) {
                        this.setState({dataSource});
                        this.props.handleQueryDataSource(dataSource);
                    }
                })
                .catch(e => {
                });
        }, this.fetchTimeOut);
    }

    componentDidMount() {
        if (this.dataSourceFetch) {
            this.fetchDataSource();
        }
    }

    componentWillUnmount() {
        if (this.autoCompleteInputTimeout) {
            clearTimeout(this.autoCompleteInputTimeout);
            this.autoCompleteInputTimeout = null;
        }
    }

    handleChange = (text) => {
        if (this.isOnSelect) {
            this.isOnSelect = false;// handleSelect
        } else {
            if (this.dataSourceFetch) {
                text && text.replace(/(^\s*)|(\s*$)/g, "").length !== 0 && this.fetchDataSource();
            }
            this.props.onChange && this.props.onChange({text});
        }
    };
    handleSelect = (value, text, index) => {
        this.isOnSelect = true;
        let data = this.dataSourceFetch ? this.state.dataSource[index] : this.props.dataSource[index];
        this.props.onChange && this.props.onChange({value, text, data, index});
        this.props.onSelect && this.props.onSelect({value, text, data, index});
    };

    handleSearch = (value) => {
        this.props.handleSearch && this.props.handleSearch(value);
    };

    render() {
        let dataSource = this.dataSourceFetch ? this.state.dataSource : this.props.dataSource;
        dataSource = dataSource && dataSource.length ? dataSource : [];
        let split = `_${new Date().getTime()}_`; // 防止value为 指定当前选中的条目 具体看 @see <a href="https://ant.design/components/auto-complete-cn/</a>
        let options = dataSource.map((data, index) => {
            let value, text, extText, disabled;
            if (typeof data === 'string') {
                value = index;
                text = data;
            } else if (typeof data === 'object') {
                value = this.valueKey ? data[this.valueKey].toString() : index.toString();
                text = this.textKey ? data[this.textKey].toString() : value;
                extText = this.textExt ? this.textExt(data) : '';
                disabled = this.disabledKey ? data[this.disabledKey] : false;
            }
            let v = index + split + value;
            let t = text + extText;

            return this.props.isOption ?
                <AutoComplete.Option key={v} disabled={disabled}>{t}</AutoComplete.Option> :
                {value: v, text: t};
        });
        return (
            <AutoComplete
                disabled={this.props.disabled}
                dataSource={this.props.isOption ? undefined : options}
                style={this.props.style}
                className={this.props.className}
                filterOption={(inputValue, option) => escape(option.props.children).match(escape(inputValue))}
                allowClear={this.props.allowClear !== false}
                placeholder={this.props.placeholder}
                defaultValue={this.props.defaultValue ? typeof this.props.defaultValue === 'string' ? this.props.defaultValue : this.props.defaultValue.text : this.props.defaultValue}
                value={this.props.value ? typeof this.props.value === 'string' ? this.props.value : this.props.value.text : this.props.value}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                onSelect={(text, option) => {
                    let sp = text.split(split);
                    let value = sp[1];
                    let index = Number(sp[0]);
                    this.handleSelect(value, option.props.children, index);
                }}>
                {this.props.isOption ? options : <Input maxLength={this.props.maxLength}/>}
            </AutoComplete>
        );
    }
}

export default AutoCompleteInput;