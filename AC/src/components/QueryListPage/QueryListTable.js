import {Table} from 'antd';
import React from 'react';
import setParams from "ACTION/setParams";

export default class QueryListTable extends React.Component {
    constructor(props) {
        super(props);
    }

    handlePagination = () => {
        let data = this.props;
        return {
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
            showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
        };
    };

    handleOnChange = () => {
        let p_p = this.props;
        return (page, pageSize) => {
            // console.log('QueryListPage Table onChange');
            setParams(p_p.state_name, {
                pageParam: {currentPage: page, pageSize: pageSize}
            });
        };
    };

    render() {
        let p_p = this.props;
        return (
            <Table bordered={true}
                   columns={p_p.columns}
                   rowKey={(record, index) => index}
                   loading={p_p.loading || p_p.RecordListLoading}
                   dataSource={p_p.dataSource || p_p.RecordList}
                   onChange={p_p.onChange || this.handleOnChange}
                   pagination={p_p.pagination != undefined ? p_p.pagination : this.handlePagination}
                   size='small'
                   scroll={p_p.scroll || {x: 1600}}>
            </Table>);
    }
}