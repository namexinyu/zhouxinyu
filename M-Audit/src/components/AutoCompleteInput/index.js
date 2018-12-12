import React from 'react';
import {AutoComplete, Input, Icon} from 'antd';

const Option = AutoComplete.Option;

/**
 * 如果传入fetch，且dataSourceFetch,则使用fetch的dataSource，否则使用props的dataSource
 * handleQueryDataSource（dataSource）为fetch的dataSource
 */
class AutoCompleteInput extends React.PureComponent {

    constructor(props) {
        super(props);
        this.dataSourceFetch = this.props.fetch && this.props.fetch.dataSourceFetch;
        this.dataSourceFetchKey = this.props.fetch && this.props.fetch.dataSourceFetchKey && this.props.fetch.dataSourceFetchKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.fetch.dataSourceFetchKey : false;

        this.fetchTimeOut = this.props.fetchTimeOut > 0 ? this.props.fetchTimeOut : 800;

        this.valueKey = this.props.valueKey && this.props.valueKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.valueKey : false;
        this.textKey = this.props.textKey && this.props.textKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.textKey : false;
        this.state = {};
    }

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
            this.props.onChange && this.props.onChange({text: text});
        }
    };
    handleSelect = (text, option) => {
        this.isOnSelect = true;
        let index = option.props.index;
        let data = this.dataSourceFetch ? this.state.dataSource[index] : this.props.dataSource[index];
        let value = this.valueKey ? data[this.valueKey].toString() : index.toString();

        this.props.onChange && this.props.onChange({
            value: value, text: option.props.children, data: data, index: index
        });
    };

    handleSearch = (value) => {
        this.props.handleSearch && this.props.handleSearch(value);
    };

    render() {
        let dataSource = this.dataSourceFetch ? this.state.dataSource : this.props.dataSource;
        dataSource = dataSource && dataSource.length ? dataSource : [];
        let prefix = new Date().getTime(); // 防止value为 指定当前选中的条目 具体看 @see <a href="https://ant.design/components/auto-complete-cn/</a>
        return (
            <AutoComplete
                dataSource={dataSource.map((data, index) => {
                    let value, text;
                    if (typeof data === 'string') {
                        value = data;
                        text = data;
                    } else if (typeof data === 'object') {
                        value = this.valueKey ? data[this.valueKey].toString() : index.toString();
                        text = this.textKey ? data[this.textKey].toString() : index.toString();
                    }
                    return {value: prefix + value, text};
                })}
                style={this.props.style}
                className={this.props.className}
                filterOption={(inputValue, option) => {
                    return escape(option.props.children).match(escape(inputValue)) || escape(inputValue).match(escape(option.props.children));
                }}
                allowClear={this.props.allowClear !== false}
                placeholder={this.props.placeholder}
                defaultValue={this.props.defaultValue ? typeof this.props.defaultValue === 'string' ? this.props.defaultValue : this.props.defaultValue.text : this.props.defaultValue}
                value={this.props.value ? typeof this.props.value === 'string' ? this.props.value : this.props.value.text : this.props.value}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                onSelect={this.handleSelect}>
                {/*     <Input
                    suffix={<Icon type="search" style={{color: '#108ee9'}}/>}
                />*/}
            </AutoComplete>
        );
    }
}

export default AutoCompleteInput;