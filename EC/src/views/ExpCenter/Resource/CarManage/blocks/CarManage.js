import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, DatePicker, message} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
import SelectableInput from "COMPONENT/SelectableInput/index";
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
import resetState from 'ACTION/resetState';
// 业务相关
import CarDetailModal from "./CarDetailModal";
import getVehicleInfoList from "ACTION/ExpCenter/Vehicle/getVehicleInfoList";
message.config({
    top: "50%",
    duration: 2,
    marginTop: "-17px"
});
const FormItem = Form.Item;
const Option = Select.Option;

export default class CarManage extends React.PureComponent { // table组件
    constructor(props) {
        super(props);
        let HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        this.columns = [
            // VehicleID
            {title: '车牌号码', dataIndex: 'VehiclePlate'},
            {title: '颜色', dataIndex: 'VehicleColor'},
            {title: '车辆型号', dataIndex: 'VehicleType'},
            {title: '车座数量', dataIndex: 'SeatNum'},
            // {title: '体验中心', dataIndex: 'HubName'},
            {
                title: '体验中心', key: 'HubID',
                render: (text, record) => {
                    let target = HubList.find((item) => record.HubID == item.HubID);
                    return (<div>{target ? target.HubName : ''}</div>);
                }
            },
            {
                title: '操作', key: 'Operate',
                render: (text, record) => {
                    return (<div><a onClick={() => this.handleClickModify(record)}>修改</a></div>);
                }
            }
        ];
    }


    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.init();
        }
    }

    componentWillReceiveProps(nextProps) {
        // 翻页
        if (nextProps.list.currentPage !== this.props.list.currentPage) {
            this.doQuery(nextProps.list);
        }
        // 退押金弹窗
        let fetch = nextProps.detail.ModVehicleInfoFetch;
        if (fetch.status == 'success') {
            // let res = nextProps.refund.addRefundDataFetch.response;
            message.success('操作成功');
            resetState(nextProps.detail.state_name);
            this.doQuery(nextProps.list);
        }
        if (fetch.status == 'error') {
            let res = fetch.response || {};
            message.error('操作失败' + (res.Desc ? ':' + res.Desc : ''));
            setParams(nextProps.detail.state_name, {ModVehicleInfoFetch: {status: 'close'}});
        }
    }

    handleClickModify(item) {
        let detail = this.props.detail;
        item = Object.assign({}, item);
        setParams(detail.state_name, {
            VehicleID: item.VehicleID,
            VehicleData: item,
            VehicleDataOri: Object.assign({}, item)
        });
    }

    handleClickNew() {
        // 传0 则为新增
        this.handleClickModify({VehicleID: 0, HubID: -9999});
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.list;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleRefresh() {
        this.init(true);
    }

    init(reload = false) {
        this.doQuery(this.props.list);
    }

    doQuery(data, reload = false, e) {
        if (e) e.preventDefault();
        // 分页逻辑
        let RecordIndex = data.pageSize * (data.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {currentPage: 1});
        }
        let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        if (data.authHubID != -9999) HubIDList = [data.authHubID];
        getVehicleInfoList({
            // RecordIndex: RecordIndex,
            // RecordSize: data.pageSize,
            HubIDList: HubIDList
        });
    }

    resetQuery(data) {
        resetQueryParams(data.state_name);
    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    render() {
        let data = this.props.list;
        let queryParams = data.queryParams;
        return (
            <div className="car-manage-view">
                <div className='ivy-page-title'>
                    <div className="ivy-title">车辆管理</div>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                         <i className="iconfont icon-shuaxin"></i>
                     </span>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-20">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => this.doQuery(data, true, e)}>
                                <AuthorityHubSelect authHubID={data.authHubID}
                                                    onChange={(value) => setParams(data.state_name, {authHubID: value})}/>
                                <Row>
                                    <Col className="gutter-row" span={6} offset={18}>
                                        <FormItem className="text-right">
                                            <Button className="ant-btn ml-8"
                                                    onClick={() => this.resetQuery(data)}>重置</Button>
                                            <Button className="ant-btn ml-8" type="primary"
                                                    htmlType="submit">搜索</Button>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <Row gutter={15} className="mb-8">
                                <Col className="gutter-row" span={12}>
                                    <Button className="ant-btn mr-8" type="primary"
                                            onClick={() => this.handleClickNew()}>
                                        新增车辆
                                    </Button>
                                </Col>
                            </Row>
                            <Table rowKey="rowKey" columns={this.columns}
                                // pagination={{
                                //     current: data.currentPage,
                                //     onChange: (page) => setParams(data.state_name, {currentPage: page}),
                                //     total: data.totalSize
                                // }}
                                   loading={this.props.list.RecordListLoading}
                                   dataSource={data.vehicleInfoList}></Table>
                        </div>
                    </div>
                </Row>
                <CarDetailModal detail={this.props.detail}></CarDetailModal>
            </div>);
    }
}
