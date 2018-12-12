import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Table,
    Button,
    DatePicker,
    Modal,
    Icon,
    message,
    Popconfirm
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import setParams from 'ACTION/setParams';
import {
    OrderStep
} from 'CONFIG/EnumerateLib/Mapping_Order';
import UserOrderAction from 'ACTION/Business/OrderManage/UserOrderAction';
import LaborAction from 'ACTION/Business/Labor/LaborAction';
import 'LESS/Business/OrderManage/user-call.less';
import resetState from 'ACTION/resetState';
import setFetchStatus from 'ACTION/setFetchStatus';

const {
    setOrderLabor
} = UserOrderAction;
const {
    getLaborList
} = LaborAction;

const FormItem = Form.Item;
const STATE_NAME = 'state_business_userorder_setlabor_modal';

class SetLaborModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleSetLabor = this.handleSetLabor.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.Visible && nextProps.Visible && nextProps.recordUserOrderID) {
            setParams(STATE_NAME, {pageParam: {...this.props.pageParam, currentPage: 1}});
        }
        if (nextProps.Visible && this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
    }

    queryTableList(props) {
        if (!props) props = this.props;

        let pageParam = props.pageParam;
        let query = {
            LaborName: props.queryParams.LaborName.value,
            LaborBossID: props.queryParams.LaborBoss.value && props.queryParams.LaborBoss.value.value ? Number(props.queryParams.LaborBoss.value.value) : null,
            BossName: props.queryParams.LaborBoss.value && props.queryParams.LaborBoss.value.text ? props.queryParams.LaborBoss.value.text : null
        };
        if (query.LaborBossID) delete query.BossName;
        Object.entries(query).forEach((data) => {
            if (!data[1] || data[1] === '-9999') delete query[data[0]];
        });
        getLaborList({
            ...query, OrderByCreateTime: 1,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleSetLabor() {
        let UserOrderID = this.props.recordUserOrderID;
        if (!UserOrderID) return;
        let LaborID = this.props.selectedRowKeys[0];
        setOrderLabor({LaborID, UserOrderID});
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            console.log(err, fieldsValue);
            if (err) return;
            setParams(STATE_NAME, {pageParam: {...this.props.pageParam, currentPage: 1}});
        });
    }

    handleTableRowSelection(selectedRowKeys, selectedRows) {
        let sel = (!selectedRowKeys || selectedRowKeys.length === 0 || selectedRowKeys.length > 2) ? [] : [selectedRowKeys[selectedRowKeys.length - 1]];
        setParams(STATE_NAME, {selectedRowKeys: sel});
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {common, selectedRowKeys, pageParam} = this.props;
        return (
            <Modal
                width={700} title="设置劳务" visible={this.props.Visible}
                afterClose={() => resetState(STATE_NAME)}
                onCancel={() => setParams(STATE_NAME, {Visible: false})}
                footer={[
                    <Button key="back" size="large"
                            onClick={() => setParams(STATE_NAME, {Visible: false})}>取消</Button>,
                    <Button key="submit" type="primary" size="large"
                            loading={this.props.setOrderLaborFetch.status === 'pending'}
                            disabled={!selectedRowKeys || !selectedRowKeys.length}
                            onClick={this.handleSetLabor}>确定</Button>
                ]}>
                <Form onSubmit={this.handleFormSubmit}>
                    <Row gutter={8} type="flex" justify="start">
                        <Col span={10}>
                            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="劳务公司">
                                {getFieldDecorator('LaborName')(<Input placeholder="简称或全程"/>)}
                            </FormItem>
                        </Col>
                        <Col span={10}>
                            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="大老板">
                                {getFieldDecorator('LaborBoss')(
                                    <AutoCompleteInput textKey="BossName" valueKey="LaborBossID"
                                                       dataSource={common.LaborBossSimpleList}/>
                                )}
                            </FormItem>
                        </Col>

                        <Col span={4} style={{textAlign: 'center'}}>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Col>
                    </Row>
                </Form>
                <Table
                    rowKey={'LaborID'} scroll={{y: 200}} bordered={true}
                    rowSelection={{
                        hideDefaultSelections: true,
                        onChange: this.handleTableRowSelection,
                        selectedRowKeys
                    }}
                    columns={[
                        {title: '劳务公司', dataIndex: 'LaborName', width: '25%'},
                        {title: '大老板', dataIndex: 'BossName', width: '25%'},
                        {
                            title: '账户状态', dataIndex: 'AccountStatus', width: '25%',
                            render: text => text === 1 ? '正常' : text === 2 ? '即将欠费' : text === 3 ? '欠费' : '-'
                        },
                        {title: '创建日期', dataIndex: 'CreateTime', width: '25%'}]}
                    dataSource={this.props.RecordList} loading={this.props.RecordListLoading}
                    pagination={{
                        total: this.props.RecordCount,
                        pageSize: pageParam.pageSize,
                        current: pageParam.currentPage,
                        showSizeChanger: true, showQuickJumper: true,
                        pageSizeOptions: ['5', '10'],
                        showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                    }}
                    onChange={(pagination, filters, sorter) => {
                        let currentPage = pagination.current < 1 ? 1 : pagination.current;
                        let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                        if (sorter.columnKey) change.orderParam = {[sorter.columnKey]: sorter.order};
                        setParams(STATE_NAME, change);
                    }}
                />
            </Modal>
        );
    }

}

export default Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => setParams(STATE_NAME, {queryParams: {...props.queryParams, ...fields}})
})(SetLaborModal);