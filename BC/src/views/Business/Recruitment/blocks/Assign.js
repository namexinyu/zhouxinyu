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
    Radio,
    Icon,
    message,
    Popconfirm
} from 'antd';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
import {
    OrderStep
} from 'CONFIG/EnumerateLib/Mapping_Order';
import resetQueryParams from 'ACTION/resetQueryParams';
import createPureComponent from 'UTIL/createPureComponent';
import resetState from 'ACTION/resetState';
import CommonAction from 'ACTION/Business/Common';
import ActionRecruit from 'ACTION/Business/Recruit/ActionRecruit';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import "LESS/pages/assign.less";
import setFetchStatus from 'ACTION/setFetchStatus';

const {
    // getRecruitTags,
    getRecruitSimpleList,
    getLaborSimpleList
} = CommonAction;
const {
    getLaborAssignList,
    exportLaborAssignList,
    setAssignDesc
} = ActionRecruit;

const FormItem = Form.Item;
const {Option} = Select;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const STATE_NAME = 'state_business_recruit_assign';

/* 弹窗 */
const AssignModal = Form.create({
    mapPropsToFields: props => ({...props.AssignModalItem}),
    onFieldsChange: (props, fields) => props.setParams('AssignModalItem', fields)
})(({form, AssignModalItem, handleModalCancel, handleModalSubmit}) => {
    const {getFieldDecorator} = form;
    return (
        <Modal
            title="分配方案" visible={AssignModalItem.Visible}
            onCancel={handleModalCancel} confirmLoading={AssignModalItem.confirmLoading}
            onOk={() => {
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    handleModalSubmit(fieldsValue);
                });
            }}>
            <Form>
                <FormItem label="分配方案" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                    {getFieldDecorator('AssignDesc')(<Input placeholder="输入"/>)}
                </FormItem>
            </Form>
        </Modal>
    );
});

const SearchForm = Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => props.setParams('queryParams', fields)
})(createPureComponent(({handleFormSubmit, handleFormReset, form, common}) => {
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 16}};
    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            form.validateFields((err, fieldsValue) => {
                console.log(err, fieldsValue);
                if (err) return;
                handleFormSubmit(fieldsValue);
            });
        }}>
            <Row gutter={32} type="flex" justify="start">
                <Col span={8}>
                    <FormItem {...formItemLayout} label="日期">
                        {getFieldDecorator('Date')(
                            <DatePicker placeholder="选择日期" format="YYYY-MM-DD" allowClear={false}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="企业">
                        {getFieldDecorator('Recruit')(
                            <AutoCompleteInput
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={common.RecruitSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="劳务公司">
                        {getFieldDecorator('Labor')(
                            <AutoCompleteInput
                                textKey="ShortName" valueKey="LaborID"
                                dataSource={common.LaborSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="收费">
                        {getFieldDecorator('HasLaborOrderFee', {initialValue: '0'})(
                            <Select>
                                <Option value="0">全部</Option>
                                <Option value="1">无</Option>
                                <Option value="2">有</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="补贴">
                        {getFieldDecorator('HasLaborOrderSubsidy', {initialValue: '0'})(
                            <Select>
                                <Option value="0">全部</Option>
                                <Option value="1">无</Option>
                                <Option value="2">有</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col className="mb-24" span={23} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
}));

class Assign extends React.PureComponent {

    setParams = (field, state) => {
        if (typeof field === 'object') {
            setParams(STATE_NAME, field);
        } else {
            let s = state;
            if (typeof state === 'object') s = {...this.props[field], ...state};
            setParams(STATE_NAME, {[field]: s});
        }
    };

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.queryTableList();
            getRecruitSimpleList(); // 企业模糊下拉数据
            getLaborSimpleList(); // 劳务公司模糊下拉数据
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pageParam !== nextProps.pageParam) {
            this.queryTableList(nextProps);
        }
        if (nextProps.setAssignDescFetch.status === 'success') { // 设置分配方案
            setFetchStatus(STATE_NAME, 'setAssignDescFetch', 'close');
            message.success('设置成功');
            this.handleModalVisible('AssignModal');
            this.queryTableList();
        } else if (nextProps.setAssignDescFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setAssignDescFetch', 'close');
            message.error(nextProps.setAssignDescFetch.response && nextProps.setAssignDescFetch.response.Desc ? nextProps.setAssignDescFetch.response.Desc : '设置失败');
            this.setParams('AssignModalItem', {confirmLoading: false});
        }

        if (nextProps.exportLaborAssignListFetch.status === 'success') { // 导出订单
            setFetchStatus(STATE_NAME, 'exportLaborAssignListFetch', 'close');
            let url = nextProps.exportLaborAssignListFetch.response.Data && nextProps.exportLaborAssignListFetch.response.Data.FileUrl;
            window.open(url);
        } else if (nextProps.exportLaborAssignListFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'exportLaborAssignListFetch', 'close');
            message.error(nextProps.exportLaborAssignListFetch.response && nextProps.exportLaborAssignListFetch.response.Desc ? nextProps.exportLaborAssignListFetch.response.Desc : '设置失败');
        }
    }

    handleModalVisible(modalName, Visible) {
        if (modalName === 'AssignModal') {
            if (Visible === true) {
                this.setParams(modalName + 'Item', {Visible});
            } else {
                resetState(STATE_NAME, modalName + 'Item');
            }
        }
    }

    handleAssignModalSubmit = (fieldsValue) => {
        console.log(fieldsValue);
        this.setParams('AssignModalItem', {confirmLoading: true});
        setAssignDesc({
            AssignDesc: fieldsValue.AssignDesc,
            Date: this.props.queryParams.Date.value.format('YYYY-MM-DD'),
            LaborID: this.props.AssignModalItem.LaborID,
            RecruitTmpID: this.props.AssignModalItem.RecruitTmpID
        });
    };

    handleTableRowClick(record, index, event) {
        if (event.target.name === 'edit') {
            this.handleModalVisible('AssignModal', true);
        }
    }

    // 合成查询参数
    obtainQueryParam(props) {
        let result = {
            Date: props.queryParams.Date.value.format('YYYY-MM-DD')
        };
        let QueryParams = {
            RecruitTmpID: props.queryParams.Recruit.value && props.queryParams.Recruit.value.value ? Number(props.queryParams.Recruit.value.value) : null,
            RecruitName: props.queryParams.Recruit.value && props.queryParams.Recruit.value.text ? props.queryParams.Recruit.value.text : null,

            LaborID: props.queryParams.Labor.value && props.queryParams.Labor.value.value ? Number(props.queryParams.Labor.value.value) : null,
            LaborName: props.queryParams.Labor.value && props.queryParams.Labor.value.text ? props.queryParams.Labor.value.text : null,

            HasLaborOrderSubsidy: Number(props.queryParams.HasLaborOrderSubsidy.value),
            HasLaborOrderFee: Number(props.queryParams.HasLaborOrderFee.value),

            RecruitType: props.recruitType ? Number(props.recruitType) : null
        };
        if (QueryParams.RecruitTmpID) delete QueryParams.RecruitName;
        if (QueryParams.LaborID) delete QueryParams.LaborName;

        Object.entries(QueryParams).forEach((data) => {
            if (data[1] == -9999 || (typeof data[1] !== 'number' && !data[1])) delete QueryParams[data[0]];
        });
        result.QueryParams = Object.keys(QueryParams).map(item => ({Key: item, Value: QueryParams[item]}));
        return result;
    }

    queryTableList(props) {
        if (!props) props = this.props;
        let pageParam = props.pageParam;
        let OrderParams = [];
        if (this.props.orderParam && Object.keys(this.props.orderParam).length) {
            let orderKey = Object.keys(this.props.orderParam)[0];
            OrderParams.push({Key: orderKey, Order: props.orderParam[orderKey] === 'ascend' ? 0 : 1});
        }
        getLaborAssignList({
            ...this.obtainQueryParam(props), OrderParams,
            RecordIndex: (pageParam.currentPage - 1) * pageParam.pageSize,
            RecordSize: pageParam.pageSize
        });
    }

    handleChangeRecruitType = (value) => {
        setParams(STATE_NAME, {
            pageParam: {...this.props.pageParam, currentPage: 1},
            recruitType: value
        });
    };

    handleEditAssignDesc = (RecruitTmpID, LaborID, AssignDesc) => {
        this.setParams('AssignModalItem', {Visible: true, RecruitTmpID, LaborID, AssignDesc: {value: AssignDesc}});
    };

    handleFormReset = () => resetQueryParams(STATE_NAME);

    handleFormSubmit = (fieldsValue) => this.setParams('pageParam', {currentPage: 1});

    render() {
        const {queryParams, RecordList, RecordListLoading, RecordCount, TypeACount, TypeBCount, TypeCCount, recruitType} = this.props;

        const setParams = this.setParams;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>劳务分配</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <AssignModal
                            setParams={setParams}
                            AssignModalItem={this.props.AssignModalItem}
                            handleModalSubmit={this.handleAssignModalSubmit}
                            handleModalCancel={() => this.handleModalVisible('AssignModal')}/>
                        <SearchForm
                            queryParams={this.props.queryParams}
                            setParams={setParams}
                            common={this.props.businessCommon}
                            handleFormSubmit={this.handleFormSubmit}
                            handleFormReset={this.handleFormReset}/>
                        <Row className="mt-24 mb-16">
                            <Button type={!recruitType ? 'primary' : ''} htmlType="button"
                                    onClick={() => this.handleChangeRecruitType('')}>全部企业({RecordCount})</Button>
                            <Button type={recruitType === 1 ? 'primary' : ''} className="ml-8" htmlType="button"
                                    onClick={() => this.handleChangeRecruitType(1)}>A类企业({TypeACount})</Button>
                            <Button type={recruitType === 2 ? 'primary' : ''} className="ml-8" htmlType="button"
                                    onClick={() => this.handleChangeRecruitType(2)}>B类企业({TypeBCount})</Button>
                            <Button type={recruitType === 3 ? 'primary' : ''} className="ml-8" htmlType="button"
                                    onClick={() => this.handleChangeRecruitType(3)}>C类企业({TypeCCount})</Button>
                        </Row>

                        <div className="mb-16" style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span></span>
                            <Button size="large" onClick={() => {
                                exportLaborAssignList(this.obtainQueryParam(this.props));
                            }}>导出订单</Button>
                        </div>
                        <Table className="assign-table" size='small'
                               title={() => `${queryParams.Date.value.format('YYYY-MM-DD')}劳务分配方案`}
                               rowKey={(record, index) => index} bordered={true}
                               pagination={{
                                   total: recruitType === 1 ? TypeACount : recruitType === 2 ? TypeBCount : recruitType === 3 ? TypeCCount : RecordCount,
                                   pageSize: this.props.pageParam.pageSize,
                                   current: this.props.pageParam.currentPage,
                                   showSizeChanger: true,
                                   showQuickJumper: true,
                                   showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                               }}
                            // onRowClick={this.handleTableRowClick.bind(this)}
                               columns={[
                                   {
                                       title: '企业名称', dataIndex: 'RecruitName',
                                       render: text => <span>{text}</span>
                                   },
                                   {
                                       title: '招工类别',
                                       dataIndex: 'RecruitType',
                                       render: text =>
                                           <span>{text === 1 ? 'A' : text === 2 ? 'B' : text === 3 ? 'C' : ''}</span>
                                   },
                                   {
                                       title: '会员补贴(收费)', dataIndex: 'aaa',
                                       render: (text, record) => <div style={{padding: '16px 8px'}}>
                                           {
                                               record.EnrollFeeList && record.EnrollFeeList.map(item =>
                                                   <div key={item.EnrollFeeID}>
                                                       {item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}（收费）{item.Fee / 100}元
                                                   </div>)
                                           }
                                           {
                                               record.SubsidyList && record.SubsidyList.map(item =>
                                                   <div key={item.RecruitSubsidyID}>
                                                       {item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}:
                                                       {item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                                   </div>)
                                           }
                                       </div>
                                   },
                                   {
                                       title: '劳务公司', dataIndex: 'aaaa',
                                       render: (text, record) =>
                                           <div className="d-td">
                                               {record.LaborAssignList.map((item, index) => {
                                                       return <div key={index}
                                                                   className="d-td-child">{item.LaborName}</div>;
                                                   }
                                               )}
                                           </div>
                                   },
                                   {
                                       title: '劳务收费', dataIndex: 'xxxxxxx',
                                       render: (text, record) =>
                                           <div className="d-td">
                                               {record.LaborAssignList && record.LaborAssignList.length ? record.LaborAssignList.map((item, index) => {
                                                       return <div key={index} className="d-td-child">
                                                           {
                                                               item.LaborOrderChargeList && item.LaborOrderChargeList.length ? item.LaborOrderChargeList.map(item1 =>
                                                                   <div key={item1.LaborChargeID}>
                                                                       {item1.Gender === 1 ? '男' : item1.Gender === 2 ? '女' : '男女不限'}:{item1.ChargeAmount / 100}元
                                                                   </div>) : '无'
                                                           }
                                                       </div>;
                                                   }
                                               ) : '无'}
                                           </div>
                                   },
                                   {
                                       title: '劳务报价', dataIndex: 'xxxxx',
                                       render: (text, record) =>
                                           <div className="d-td">
                                               {record.LaborAssignList && record.LaborAssignList.length ? record.LaborAssignList.map((item, index) => {
                                                       return <div key={index} className="d-td-child">
                                                           {
                                                               item.LaborOrderSubsidyList && item.LaborOrderSubsidyList.length ? item.LaborOrderSubsidyList.map(item1 =>
                                                                   <div key={item1.LaborOrderSubsidyID}>
                                                                       {item1.Gender === 1 ? '男' : item1.Gender === 2 ? '女' : '男女不限'}:
                                                                       {item1.SubsidyDay}天{item1.SubsidyAmount / 100}元
                                                                   </div>) : '无'
                                                           }
                                                       </div>;
                                                   }
                                               ) : '无'}
                                           </div>
                                   },
                                   {
                                       title: '分配方案', dataIndex: 'xxxx',
                                       render: (text, record) =>
                                           <div className="d-td">
                                               {record.LaborAssignList.map((item, index) => {
                                                       return <div key={index} className="d-td-child">
                                                           {item.AssignDesc}<Icon type="edit" className="ml-8"
                                                                                  onClick={() => this.handleEditAssignDesc(record.RecruitTmpID, item.LaborID, item.AssignDesc)}/>
                                                       </div>;
                                                   }
                                               )}
                                           </div>
                                   },
                                   {
                                       title: '预签到', dataIndex: 'PreAssignCount',
                                       render: text => <span>{text ? `${text}人` : '无'}</span>
                                   },
                                   {
                                       title: '昨日分配', dataIndex: 'xx',
                                       render: (text, record) =>
                                           <div className="d-td">
                                               {record.LaborAssignList.map((item, index) => {
                                                       return <div key={index}
                                                                   className="d-td-child">{item.YesterdayAssignCount}</div>;
                                                   }
                                               )}
                                           </div>
                                   }
                               ]}
                               dataSource={RecordList} loading={RecordListLoading}
                               onChange={(pagination, filters, sorter) => {
                                   let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                   let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                   if (sorter.columnKey) {
                                       change.orderParam = {[sorter.columnKey]: sorter.order};
                                   }
                                   setParams(change);
                               }}/>
                    </Card>
                </div>
            </div>
        );
    }
}

export default Assign;