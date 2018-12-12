import React from 'react';
import {AutoComplete} from 'antd';

const Option = AutoComplete.Option;


class AutoCompleteInput extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.defaultDataSource || [],
            value: this.props.value,
            isFetchError: false,
            isFetchErrorRetry: this.props.isFetchErrorRetry,
            fetchTimeOut: this.props.fetchTimeOut > 0 ? this.props.fetchTimeOut : 800,
            dataKey: this.props.dataKey && this.props.dataKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.dataKey : false,
            dataSourceKey: this.props.dataSourceKey && this.props.dataSourceKey.replace(/(^\s*)|(\s*$)/g, "").length !== 0 ? this.props.dataSourceKey : false
        };
    }

    fetchDataSource() {
        let promise = this.props.fetch;
        if (!promise) return;
        if (this.autoCompleteInputTimeout) {
            clearTimeout(this.autoCompleteInputTimeout);
            this.autoCompleteInputTimeout = null;
        }
        this.autoCompleteInputTimeout = setTimeout(() => {
            promise(this.state.value)
                .then(result => {
                    let dataSource = result.Data && this.state.dataSourceKey ? result.Data[this.state.dataSourceKey] : result.Data;
                    if (dataSource instanceof Array) {
                        this.props.handleQueryDataSource(dataSource);
                        this.setState({dataSource, isFetchError: false});
                    } else {
                        this.setState({isFetchError: false});
                    }
                }).catch(e => {
                console.error(e);
                this.setState({isFetchError: true});
            });
        }, this.state.fetchTimeOut);
    }

    componentDidMount() {
        this._isMounted = true;
        !this.props.isOnChangeFetch && !this.props.defaultDataSource && this.fetchDataSource();
    }

    componentWillReceiveProps(nextProps) {
        // console.log('AutoCompleteInput props', nextProps);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = (value) => {
        this.setState({value});
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
                value={this.state.value}
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