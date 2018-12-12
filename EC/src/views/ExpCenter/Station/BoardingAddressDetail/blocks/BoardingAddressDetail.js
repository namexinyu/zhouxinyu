import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Switch, Cascader, Icon, message} from 'antd';
import getAntAreaOptions from 'CONFIG/antAreaOptions';
import {browserHistory} from 'react-router';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import setParams from "ACTION/setParams";
import SelectableInput from "COMPONENT/SelectableInput/index";
import "LESS/components/picture-upload.less";
import doTabPage from "ACTION/TabPage/doTabPage";
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import BaiduMapModal from "COMPONENT/BaiduMapModal/index";
import Mapping_Hub from "CONFIG/EnumerateLib/Mapping_Hub";
import editBoardingAddress from "ACTION/ExpCenter/BoardingAddress/editBoardingAddress";
import resetState from "ACTION/resetState";

const FormItem = Form.Item;
const Option = Select.Option;

class BoardingAddressDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = getAntAreaOptions;
        this.state = {mapData: undefined};
        this.eEnableStatus = Mapping_Hub.eEnableStatus;
        this.eEnableStatusList = Object.keys(this.eEnableStatus);
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            console.log('location', location);
            if (location.pathname.indexOf('/ec/main/boarding-address/detail') == 0 && !this.props.bdAddrDetail.bdAddrData) {
                doTabPage({id: location.pathname}, 'close');
            }
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.bdAddrDetail.editBoardingAddressFetch.status == 'success') {
            message.info('修改成功');
            // setParams(nextProps.bdAddrDetail.state_name, {editBoardingAddressFetch: {status: 'close'}});
            resetState(nextProps.bdAddrDetail.state_name);
            doTabPage({id: nextProps.location.pathname}, 'close');
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

    handleSubmitEdit(e) {
        if (e) e.preventDefault();
        let data = this.props.bdAddrDetail;
        let bdAddr = Object.assign({}, data.bdAddrData);
        if (!bdAddr.Address) {
            message.info("地址不能为空");
            return;
        }
        if (bdAddr.AreaCode && bdAddr.AreaCode.length == 3) {
            bdAddr.AreaCode = bdAddr.AreaCode[2];
        } else {
            message.info("请填写完整的省市区");
            return;
        }
        for (let key of Object.keys(data.bdAddrData)) {
            if (Object.prototype.toString.call(data.bdAddrData[key]) === '[object String]' && data.bdAddrData[key] == data.bdAddrDataOri[key]) {
                bdAddr[key] = null;
            } else if (Object.prototype.toString.call(data.bdAddrData[key]) === '[object Number]' && data.bdAddrData[key] == data.bdAddrDataOri[key]) {
                bdAddr[key] = 0;
            }
        }
        bdAddr.LocationID = data.bdAddrID;
        bdAddr.EmployeeID = AppSessionStorage.getEmployeeID();
        delete bdAddr.rowKey;
        delete bdAddr.CreateTime;
        editBoardingAddress(bdAddr);
    }

    handleSetParam(key, value, paramName = 'bdAddrData') {
        let data = this.props.bdAddrDetail;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleShowMap() {
        let data = this.props.bdAddrDetail;
        let bdAddr = data.bdAddrData;
        this.setState({
            mapData: {address: bdAddr.Address, longLat: bdAddr.Longlat}
        });
    }

    handleCloseMap(type, data) {
        if (type == 'ok') {
            let bdAddrDetail = this.props.bdAddrDetail;
            let bdAddr = Object.assign({}, bdAddrDetail.bdAddrData, {Address: data.address, Longlat: data.longLat});
            setParams(bdAddrDetail.state_name, {bdAddrData: bdAddr});
        }
        this.setState({mapData: undefined});
    }

    render() {
        let data = this.props.bdAddrDetail;
        let bdAddr = data.bdAddrData;
        if (!bdAddr) return (<div></div>);
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        const fLayout2 = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        const {getFieldDecorator} = this.props.form;
        let mapData = this.state.mapData;
        return (
            <div className='boarding-address-detail-view'>
                <div className='ivy-page-title'>
                    <div className="ivy-title">上车地址详情</div>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-20" style={{height: 750}}>
                            <Form onSubmit={(e) => this.handleSubmitEdit(e)}>
                                <Row>
                                    <h2 className="mb-10">基本信息</h2>
                                </Row>
                                <Row gutter={15}>
                                    <Col span={10}>
                                        <FormItem {...fLayout} label="上车地址名称">
                                            {getFieldDecorator("LocationName", {
                                                rules: [{required: true, message: '名称不能为空'}],
                                                initialValue: bdAddr.LocationName || ''
                                            })(
                                                <Input placeholder="输入名称"
                                                       onChange={(e) => this.handleSetParam('LocationName', e.target.value)}/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem required {...fLayout} label="启用状态">
                                            <Select value={bdAddr.EnableStatus + ''}
                                                    onChange={(value) => this.handleSetParam('EnableStatus', value - 0)}>
                                                {this.eEnableStatusList.map((key, index) => {
                                                    return (
                                                        <Option key={index}
                                                                value={key + ''}>
                                                            {this.eEnableStatus[key]}
                                                        </Option>);
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={15}>
                                    <Col span={10}>

                                        <FormItem {...fLayout} label="所属地区">
                                            {getFieldDecorator("AreaCode", {
                                                rules: [{type: 'array', len: 3, message: '请选择省/市/区'}],
                                                initialValue: bdAddr.AreaCode || []
                                            })(
                                                // defaultValue={bdAddr.AreaCode || ["140000", "140300", "140311"]}
                                                <Cascader options={this.antOptions}
                                                          onChange={(value) => this.handleSetParam('AreaCode', value)}
                                                          placeholder="请选择省/市/区" changeOnSelect/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={15}>
                                    <Col span={20}>
                                        <FormItem {...fLayout2} label="详细地址">
                                            <Input placeholder="输入地址"
                                                   value={bdAddr.Address}
                                                   addonAfter={<Icon
                                                       onClick={() => this.handleShowMap()}
                                                       className={bdAddr.Longlat ? 'color-primary' : ''}
                                                       type="environment-o"/>}
                                                   onChange={(e) => this.handleSetParam('Address', e.target.value)}/>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={15}>
                                    <Col span={8} offset={8}>
                                        <Button onClick={() => this.handleGoPage('/ec/main/address-manage')}>返回</Button>
                                        <Button htmlType="submit" className="ml-16" type="primary">保存</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </Row>
                {mapData ? (<BaiduMapModal title="查看定位" visible={true} type="edit"
                                           closeModal={(type, data) => this.handleCloseMap(type, data)}
                                           initPoi={mapData}></BaiduMapModal>) : ''}
            </div>
        );
    }
}

export default Form.create()(BoardingAddressDetail);