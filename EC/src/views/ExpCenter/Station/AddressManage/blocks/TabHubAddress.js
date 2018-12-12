import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Switch, Modal, message, Radio} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";
import SelectableInput from "COMPONENT/SelectableInput/index";
import getAntAreaOptions, {spreadAreaToPCA} from 'CONFIG/antAreaOptions';
// 业务相关
import Mapping_Hub from "CONFIG/EnumerateLib/Mapping_Hub";
import getHubInfoList from "ACTION/ExpCenter/Hub/getHubInfoList";
import HubService from 'SERVICE/ExpCenter/HubService';
import ChArea from 'CONFIG/ChArea';
import BaiduMapModal from "COMPONENT/BaiduMapModal/index";
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import resetQueryParams from "ACTION/resetQueryParams";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class TabHubAddress extends React.PureComponent {
    constructor(props) {
        super(props);
        console.log('DispatchTrackToday props', props);
        this.state = {
            filterList: [],
            confirmData: undefined,
            mapData: undefined
        };
        this.eEnableStatus = Mapping_Hub.eEnableStatus;
        this.eEnableStatusList = Object.keys(this.eEnableStatus);
        this.columns = [
            {title: '创建时间', dataIndex: 'CreateTime'},
            {
                title: '省市区', key: 'AreaCode',
                render: (text, record) => {
                    return (<div>{ChArea[record.AreaCode] ? ChArea[record.AreaCode] : ''}</div>);
                }
            },
            {title: '地址名称', dataIndex: 'HubName'},
            {title: '现场主管', dataIndex: 'AdminName'},
            {
                title: '具体定位', dataIndex: 'Address',
                render: (text, record) => {
                    return (
                        <div><a onClick={() => this.handleShowMap(record.Longlat, record.Address)}>{record.Address}</a>
                        </div>);
                }
            },
            {
                title: '状态', key: 'EnableStatus',
                render: (text, record) => {
                    return (
                        <div>
                            {this.eEnableStatus[record.EnableStatus] ? this.eEnableStatus[record.EnableStatus] : ''}
                            <Switch checked={record.EnableStatus == 1}
                                    onChange={(value) => this.handleChangeHubStatus(record)}/>
                        </div>);
                }
            },
            {
                title: '操作', key: 'Operate',
                render: (text, record) => {
                    return (<a onClick={() => this.handleEditHub(record)}>修改</a>);
                }
            }
        ];
    }

    componentWillMount() {
        // let location = this.props.location;
        // if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
        //     this.init();
        // }
        this.init();
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let nextPage = nextProps.stPage;
        let lastPage = this.props.stPage;
        console.log(nextPage, lastPage);
        if (nextPage.needRefresh && nextPage.currentTab == 'hub' && !lastPage.needRefresh) {
            this.doQuery(nextProps.amHub);
            setParams(nextPage.state_name, {needRefresh: false});
        }
        // 翻页
        if (nextProps.amHub.currentPage !== this.props.amHub.currentPage) {
            this.doQuery(nextProps.amHub);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('TabHUbAddress states', nextState);
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    init() {
        this.doQuery(this.props.amHub);
    }

    handleNewHub() {
        browserHistory.push({
            pathname: '/ec/main/hub/new/'
        });
    }

    handleEditHub(item) {
        let hubData = Object.assign({}, item);
        // 解析WorkTime JSON字段
        try {
            if (hubData.WorkTime) hubData.WorkTime = JSON.parse(hubData.WorkTime);
            else hubData.WorkTime = [{StartWeek: "周一", StopWeek: "周六", StartTime: "09:30", StopTime: "19:00"}];
        } catch (e) {
            hubData.WorkTime = [{StartWeek: "周一", StopWeek: "周六", StartTime: "09:30", StopTime: "19:00"}];
            console.log("体验中心门店数据异常，不正确的营业时间JSON字段");
        }
        if (hubData.AreaCode) hubData.AreaCode = {value: spreadAreaToPCA(hubData.AreaCode)};
        hubData.Address = {value: hubData.Address};
        hubData.HubName = {value: hubData.HubName};
        hubData.Admin = {value: {value: hubData.AdminID, text: hubData.AdminName}};
        delete hubData.AdminID;
        delete hubData.AdminName;
        console.log('handleEditHubClick', hubData);
        setParams('state_ec_hubAddressDetail', {
            HubID: item.HubID,
            HubData: hubData,
            HubDataOri: Object.assign({}, hubData)
        });
        if (item.HubID) {
            browserHistory.push({
                pathname: '/ec/main/hub/detail/' + item.HubID
            });
        }
    }

    handleShowMap(location, address) {
        this.setState({mapData: {longLat: location, address: address}});
    }

    handleChangeHubStatus(item) {
        this.setState({confirmData: item});
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.amHub;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    doQuery(data, reload = false, e) {
        if (e) e.preventDefault();
        // 分页逻辑
        let RecordIndex = data.pageSize * (data.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {currentPage: 1});
            if (data.currentPage !== 1) return;
        }
        // let param = data.queryParams;
        let queryData = {
            Name: data.queryParams.Name || '',
            EnableStatus: data.queryParams.EnableStatus,
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        };
        getHubInfoList(queryData);
    }

    resetQuery() {
        resetQueryParams(this.props.amHub.state_name);
    }

    handleActiveConfirm() {
        let data = this.state.confirmData;
        if (data) {
            let param = {
                HubID: data.HubID,
                EmployeeID: AppSessionStorage.getEmployeeID(),
                EnableStatus: data.EnableStatus == 1 ? 2 : 1
            };
            // 后台要求修改数据需要填上其他未修改字段的空类型
            let emptyData = {
                Address: '',
                AdminID: data.AdminID,
                AreaCode: '',
                HubName: '',
                HubType: 0,
                Longlat: data.Longlat,
                PicPath: data.PicPath,
                WorkTime: ''
            };
            param = Object.assign(emptyData, param);
            HubService.editHubInfo(param).then(() => {
                message.info('操作成功');
                this.setState({confirmData: undefined});
                this.doQuery(this.props.amHub);
            }, (err) => {
                console.log(err);
                message.error('操作失败');
            });
        }
    }

    handleActiveCancel() {
        this.setState({confirmData: undefined});
    }

    handleCloseMap(type, data) {
        if (type == 'ok') {
            console.log(data);
        }
        this.setState({mapData: undefined});
    }


    render() {
        if (this.props.stPage.currentTab != 'hub') {
            return (<div style={{display: 'none'}}></div>);
        }
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        let data = this.props.amHub;
        let queryParams = data.queryParams;
        const {getFieldDecorator} = this.props.form;
        let confirmData = this.state.confirmData;
        let mapData = this.state.mapData;
        return (
            <Row>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <Form className="ant-advanced-search-form" onSubmit={(e) => this.doQuery(data, true, e)}>
                            <Row gutter={15}>
                                <Col className="gutter-row" span={6}>
                                    <FormItem {...fLayout} label="名称">
                                        <Input placeholder="输入名称" value={queryParams.Name}
                                               onChange={(e) => this.handleSetParam('Name', e.target.value)}/>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={6}>
                                    <FormItem {...fLayout} label="启用状态">
                                        <RadioGroup value={queryParams.EnableStatus + ''}
                                                    onChange={(e) => this.handleSetParam('EnableStatus', e.target.value - 0)}>
                                            {this.eEnableStatusList.map((key, index) => {
                                                return <RadioButton key={index}
                                                                    value={key + ''}>{this.eEnableStatus[key]}</RadioButton>;
                                            })}
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={6} offset={6}>
                                    <FormItem style={{textAlign: 'right'}}>
                                        <Button className="ant-btn ml-8" onClick={() => this.resetQuery()}>重置</Button>
                                        <Button className="ant-btn ml-8" type="primary" htmlType="submit">搜索</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <Row gutter={15} className="mb-8">
                            <Col className="gutter-row" span={12}>
                                <Button className="ant-btn mr-8" type="primary"
                                        onClick={() => this.handleNewHub()}>
                                    新建
                                </Button>
                            </Col>
                        </Row>
                        <Table rowKey="rowKey" columns={this.columns}
                               pagination={{
                                   current: data.currentPage,
                                   onChange: (page) => setParams(data.state_name, {currentPage: page}),
                                   total: data.totalSize
                               }}
                               dataSource={data.hubInfoList}></Table>
                    </div>
                </div>
                <Modal title="确认操作"
                       visible={confirmData != null && confirmData != undefined}
                       onOk={() => this.handleActiveConfirm()}
                       onCancel={() => this.handleActiveCancel()}>
                    <div>
                        {confirmData ? `确认要${confirmData.EnableStatus == 1 ? '停用' : '启用'}${confirmData.HubName}吗？` : ''}
                    </div>
                </Modal>
                {mapData ? (<BaiduMapModal title="查看定位" visible={true}
                                           closeModal={(type, data) => this.handleCloseMap(type, data)}
                                           initPoi={mapData}></BaiduMapModal>) : ''}
            </Row>
        );
    }

}

export default Form.create()(TabHubAddress);