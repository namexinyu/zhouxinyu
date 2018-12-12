import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Switch, message, Modal, Radio} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
// 业务相关
import Mapping_Hub from "CONFIG/EnumerateLib/Mapping_Hub";
import getBoardingAddressList from "ACTION/ExpCenter/BoardingAddress/getBoardingAddressList";
import getAntAreaOptions, {spreadAreaToPCA} from 'CONFIG/antAreaOptions';
import BaiduMapModal from "COMPONENT/BaiduMapModal/index";
import BoardingAddressService from "SERVICE/ExpCenter/BoardingAddressService";
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TabBoardingAddress extends React.PureComponent {
    constructor(props) {
        super(props);
        console.log('TabBoardingAddress props', props);
        this.state = {
            filterList: [],
            confirmData: undefined,
            mapData: undefined
        };
        this.eEnableStatus = Mapping_Hub.eEnableStatus;
        this.eEnableStatusList = Object.keys(this.eEnableStatus);
        this.columns = [
            {title: '创建时间', dataIndex: 'CreateTime'},
            {title: '地址名称', dataIndex: 'LocationName'},
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
                                    onChange={(value) => this.handleChangeStatus(record)}/>
                        </div>);
                }
            },
            {
                title: '操作',
                key: 'Operate',
                render: (text, record) => {
                    return (<a onClick={() => this.handleEditBoardingAddress(record)}>修改</a>);
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
        if (nextPage.needRefresh && nextPage.currentTab == 'boarding' && !lastPage.needRefresh) {
            this.doQuery(nextProps.amBoarding);
            setParams(nextPage.state_name, {needRefresh: false});
        }
        // 翻页
        if (nextProps.amBoarding.currentPage !== this.props.amBoarding.currentPage) {
            this.doQuery(nextProps.amBoarding);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    handleShowMap(location, address) {
        this.setState({mapData: {longLat: location, address: address}});
    }

    handleCloseMap(type, data) {
        if (type == 'ok') {
            console.log(data);
        }
        this.setState({mapData: undefined});
    }

    init() {
        this.doQuery(this.props.amBoarding);
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
        getBoardingAddressList(queryData);
    }

    handleNewBoardingAddress() {
        browserHistory.push({
            pathname: '/ec/main/boarding-address/new/'
        });
    }

    handleEditBoardingAddress(item) {
        if (item.LocationID) {
            let bdAddrData = Object.assign({}, item);
            if (bdAddrData.AreaCode) bdAddrData.AreaCode = spreadAreaToPCA(bdAddrData.AreaCode);
            setParams('state_ec_boardingAddressDetail', {
                bdAddrID: item.LocationID,
                bdAddrData: bdAddrData,
                bdAddrDataOri: Object.assign({}, bdAddrData)
            });
            browserHistory.push({
                pathname: '/ec/main/boarding-address/detail/' + item.LocationID
            });
        }
    }

    handleChangeStatus(item) {
        this.setState({confirmData: item});
    }

    handleActiveConfirm() {
        let data = this.state.confirmData;
        if (data) {
            let param = {
                LocationID: data.LocationID,
                EmployeeID: AppSessionStorage.getEmployeeID(),
                EnableStatus: data.EnableStatus == 1 ? 2 : 1
            };
            // 后台要求修改数据需要填上其他未修改字段的空类型
            let emptyData = {
                Address: '',
                AreaCode: '',
                LocationName: '',
                Longlat: data.Longlat
            };
            param = Object.assign(emptyData, param);
            BoardingAddressService.editBoardingAddress(param).then(() => {
                message.info('操作成功');
                this.setState({confirmData: undefined});
                this.doQuery(this.props.amBoarding);
            }, (err) => {
                console.log(err);
                message.error('操作失败');
            });
        }
    }

    handleActiveCancel() {
        this.setState({confirmData: undefined});
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.amBoarding;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    resetQuery() {
        resetQueryParams(this.props.amBoarding.state_name);
    }

    render() {
        if (this.props.stPage.currentTab != 'boarding') {
            return (<div style={{display: 'none'}}></div>);
        }
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        let data = this.props.amBoarding;
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
                                        onClick={() => this.handleNewBoardingAddress()}>
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
                               dataSource={data.boardingAddressList}></Table>
                    </div>
                </div>
                <Modal title="确认操作"
                       visible={confirmData != null && confirmData != undefined}
                       onOk={() => this.handleActiveConfirm()}
                       onCancel={() => this.handleActiveCancel()}>
                    <div>
                        {confirmData ? `确认要${confirmData.EnableStatus == 1 ? '停用' : '启用'}${confirmData.LocationName}吗？` : ''}
                    </div>
                </Modal>
                {mapData ? (<BaiduMapModal title="查看定位" visible={true}
                                           closeModal={(type, data) => this.handleCloseMap(type, data)}
                                           initPoi={mapData}></BaiduMapModal>) : ''}
            </Row>
        );
    }
}


export default Form.create()(TabBoardingAddress);
