import React from 'react';
import {Form, Row, Col, Button, Input, Alert, Select, Table, DatePicker, message} from 'antd';
import setParams from "ACTION/setParams";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
import {browserHistory} from 'react-router';
import SearchFrom from "COMPONENT/SearchForm/index";
import {RegexRule, Constant} from 'UTIL/constant/index';
// 业务相关

const Option = Select.Option;

export default class QueryListPage extends React.PureComponent {
    constructor(props, formItemsList = []) {
        super(props);
        this.formItemsList = formItemsList;
        this.formResource = [];
        this.initQueryParams = {};
        this.genFormItems();
        this.init();
        this.handleTableChange = this.handleTableChange.bind(this);
    }

    init() {

    }

    titleComponent() {
        switch (this.titleAddOn) {
            case 'refresh':
                return (<span className="i-refresh" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>);
            default:
                return this.titleAddOn || '';
        }
    }

    genFormItems() {
        this.formItems = this.formItemsList.map((item) => {
            this.initQueryParams[item.name] = {value: item.initValue};
            delete item.initValue;
            if (item.dataArray) {
                this.formResource.push(item.dataArray);
            } else if (item.itemType === 'Select' && item.type === 'list') {
                this.formResource.push(item.list);
            }
            return item;
        });
        console.log('formResource', this.formResource);
    }

    doMount() {

    }


    doReceiveProps(nextProps) {

    }

    componentWillMount() {
        let location = this.props.location;
        if (location && location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.doQuery(this.props.list);
        }
        this.doMount();
    }

    componentWillReceiveProps(nextProps) {
        let nextData = nextProps.list;
        let curData = this.props.list;
        // console.log('QueryListPage ReceiveProps', nextProps);
        // 翻页&排序
        if (nextData.pageParam != curData.pageParam ||
            nextData.orderParams != curData.orderParams ||
            nextData.pageParam.currentPage != curData.pageParam.currentPage ||
            nextData.pageParam.pageSize != curData.pageParam.pageSize) {
            // this.doQuery(nextData);
            // console.log('QueryListPage 翻页触发');
            this.doChangePage(nextData);
        }
        this.doReceiveProps(nextProps);
    }

    handleGoPage(path, query) {
        browserHistory.push({
            pathname: path,
            query: query
        });
    }

    handleRefresh() {
        this.doMount();
        this.doQuery(this.props.list);
    }

    handleSearch() {
        const data = this.props.list;
        if (data.pageParam.currentPage == 1) {
            this.doQuery(data);
        } else {
            let pageParam = {...data.pageParam};
            pageParam.currentPage = 1;
            this.oriParamJson = null;
            setParams(data.state_name, {pageParam});
        }
    }

    transferParam(d, withPageParam = true) {
        const data = d || this.props.list;
        let param = {};
        if (withPageParam) {
            param.RecordIndex = data.pageParam.pageSize * (data.pageParam.currentPage - 1);
            param.RecordSize = data.pageParam.pageSize;
        }
        Object.keys(data.queryParams || this.initQueryParams).map((key) => {
            param[key] = (data.queryParams || this.initQueryParams)[key].value;
        });
        return param;
    }

    doQuery(d) {
        let param = this.handleCreateParam(d);
        if (param) {
            this.oriParamJson = JSON.stringify(param);
            this.sendQuery(param);
        }
    }

    sendQuery(param) {

    }

    handleCreateParam(d) {
        return {};
    }

    handleConcatOrderParam(d) {
        return {};
    }


    doChangePage(d) {
        if (this.oriParamJson) {
            const pageParam = d.pageParam;
            try {
                let pp = {
                    RecordIndex: pageParam.pageSize * (pageParam.currentPage - 1),
                    RecordSize: pageParam.pageSize
                };
                let param = JSON.parse(this.oriParamJson);
                let oo = this.handleCreateParam(d);
                this.sendQuery(Object.assign(param, pp, oo));
            } catch (e) {
                console.log(e);
            }
        } else {
            this.doQuery(d);
        }
    }

    handleTableChange(pagination, filters, sorter) {
        console.log('QueryListPage handleTableChange', sorter);
    }

    render() {
        let data = this.props.list;
        const resource = this.formResource.reduce((obj, key) => Object.assign(obj, {[key]: this.props[key]}), {});
        return (
            <div className='query-page-view'>
                <div className="ivy-page-title">
                    <div style={{position: 'relative'}}>
                        <h1>{this.title}</h1>
                        {this.titleComponent()}
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <Row>

                            <SearchFrom handleSearch={() => this.handleSearch()}
                                        {...this.formStyle}
                                        dataSource={resource}
                                        state_name={data.state_name}
                                        queryParams={data.queryParams || this.initQueryParams}
                                        formItems={this.formItems}></SearchFrom>
                            {this.extraComponent()}
                            <Table columns={this.tableColumns(data.orderParams)}
                                   rowKey={(record, index) => index}
                                   bordered={true}
                                   dataSource={data.RecordList}
                                   loading={data.RecordListLoading}
                                   onChange={this.handleTableChange}
                                   pagination={{
                                       total: data.RecordCount,
                                       pageSize: data.pageParam.pageSize,
                                       current: data.pageParam.currentPage,
                                       onChange: (page, pageSize) => {
                                           // console.log('QueryListPage Table onChange');
                                           setParams(data.state_name, {
                                               pageParam: {currentPage: page, pageSize: pageSize}
                                           });
                                       },
                                       onShowSizeChange: (current, size) => {
                                           // console.log('QueryListPage Table onChange');
                                           setParams(data.state_name, {
                                               pageParam: {currentPage: current, pageSize: size}
                                           });
                                       },
                                       showSizeChanger: true,
                                       showQuickJumper: true,
                                       pageSizeOptions: Constant.pageSizeOptions,
                                       showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                                   }}>
                            </Table>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }

    tableColumns(orderParams) {
        return [];
    }


    extraComponent() {
        return '';
    }
}