import React from 'react';
import {AutoComplete} from 'antd';

const Option = AutoComplete.Option;

class AutoCompleteInput extends React.PureComponent {

    constructor(props) {
        super(props);
        let fetchDataSource = props.fetchDataSource;
        this.state = {
            dataSource: this.props.defaultDataSource || [],
            isFetchError: false,
            isFetchErrorRetry: this.props.isFetchErrorRetry,
            fetchTimeOut: this.props.fetchTimeOut > 0 ? this.props.fetchTimeOut : 800,
            dataKey: this.props.dataKey && this.props.dataKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.dataKey : false,

            dataSourceFetch: fetchDataSource && fetchDataSource.dataSourceFetch,
            dataSourceKey: fetchDataSource && fetchDataSource.dataSourceKey && fetchDataSource.dataSourceKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? fetchDataSource.dataSourceKey : false
        };
        this.autoCompleteInputTimeout = '';
    }

    fetchDataSource() {
        let dataSourceFetch = this.state.dataSourceFetch;
        let dataSourceKey = this.state.dataSourceKey;
        if (!dataSourceFetch) return;
        if (this.autoCompleteInputTimeout) {
            clearTimeout(this.autoCompleteInputTimeout);
            this.autoCompleteInputTimeout = null;
        }
        this.autoCompleteInputTimeout = setTimeout(() => {
            dataSourceFetch(this.props.value)
                .then(result => {
                    let dataSource = result.Data && dataSourceKey ? result.Data[dataSourceKey] : result.Data;
                    if (dataSource instanceof Array) {
                        dataSource = dataSource.filter(item => this.state.dataKey ? item[this.state.dataKey] : item);
                        this.props.handleQueryDataSource(dataSource);
                        this.setState({dataSource, isFetchError: false});
                    } else {
                        this.setState({isFetchError: false});
                    }
                })
                .catch(e => {
                    this.setState({isFetchError: true});
                });
        }, this.state.fetchTimeOut);
    }

    componentDidMount() {
        if (this.props.isOnChangeFetch || (this.props.defaultDataSource && this.props.defaultDataSource instanceof Array && this.props.defaultDataSource.length > 0)) {
            return;
        }
        this.fetchDataSource();
    }

    componentWillUnmount() {
        clearTimeout(this.autoCompleteInputTimeout);
        this.autoCompleteInputTimeout = null;
    }

    handleChange = (value) => {
        if (this.props.isOnChangeFetch) {
            value && value.replace(/(^\s*)|(\s*$)/g, "").length !== 0 && this.fetchDataSource();
        } else if (this.state.isFetchError && this.state.isFetchErrorRetry) {
            !this.props.defaultDataSource && this.fetchDataSource();
        }
        this.props.handleChange && this.props.handleChange(value);
    };
    handleSelect = (data, option) => {
        let index = option['props'].index;
        this.props.handleSelect && this.props.handleSelect(this.state.dataSource[index], index);
    };

    handleSearch = (value) => {
        this.props.handleSearch && this.props.handleSearch(value);
    };

    render() {
        return (
            <AutoComplete
                style={this.props.style}
                className={this.props.className}
                filterOption={this.props.filterOption}
                allowClear={this.props.allowClear}
                placeholder={this.props.placeholder}
                defaultValue={this.props.defaultValue}
                value={this.props.value}
                onChange={this.handleChange}
                onSearch={this.handleSearch}
                onSelect={this.handleSelect}>
                {this.state.dataSource.map((data, index) => {
                        let value = this.state.dataKey ? data[this.state.dataKey] : data;
                        return <Option key={index} value={value + '-' + index}>{value}</Option>;
                    }
                )}
            </AutoComplete>
        );
    }
}

export default AutoCompleteInput;