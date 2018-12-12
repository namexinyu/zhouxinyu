import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Switch, Cascader, Icon, Upload, message} from 'antd';
import getAntAreaOptions, {spreadAreaToPCA} from 'CONFIG/antAreaOptions';
import {browserHistory} from 'react-router';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import setParams from "ACTION/setParams";
import SelectableInput from "COMPONENT/SelectableInput/index";
import AutoCompleteSelect from "COMPONENT/AutoCompleteSelect/index";
import "LESS/components/picture-upload.less";
import resetState from "ACTION/resetState";
import doTabPage from "ACTION/TabPage/doTabPage";
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import ossConfig from 'CONFIG/ossConfig';
// 业务相关
import BaiduMapModal from "COMPONENT/BaiduMapModal/index";
import editHubInfo from "ACTION/ExpCenter/Hub/editHubInfo";
import Mapping_Hub from "CONFIG/EnumerateLib/Mapping_Hub";
import getHubEmployeeList from "ACTION/ExpCenter/HubEmployee/getHubEmployeeList";
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import LoginService from 'SERVICE/LoginService/index';


const FormItem = Form.Item;
const Option = Select.Option;
const IMG_PATH = ossConfig.getImgPath();

class HubAddressDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = getAntAreaOptions;
        this.weekArr = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
        this.state = {mapData: undefined};
        // this.timeArr = Array.from({length: 48}).map((val, key) => {
        //     key = key + 1;
        //     let hh = parseInt(key / 2, 10);
        //     hh = hh < 10 ? '0' + hh : '' + hh;
        //     let mm = key % 2 == 1 ? ':30' : ':00';
        //     return hh + mm;
        // });
        // console.log(this.timeArr);
        this.timeArr = [
            "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
            "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00",
            "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
            "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
            "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
            "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
            "21:30", "22:00", "22:30", "23:00", "23:30", "24:00"
        ];
        this.eHubType = Mapping_Hub.eHubType;
        this.eHubTypeList = Object.keys(this.eHubType);
        this.eEnableStatus = Mapping_Hub.eEnableStatus;
        this.eEnableStatusList = Object.keys(this.eEnableStatus);
        // 临时逻辑，将当前店长加入店长下拉列表数据中
        this.currentHubManager = [];
        if (this.props.HubDataOri && this.props.HubDataOri.AdminID) {
            this.currentHubManager = [{EmployeeID: this.props.HubDataOri.AdminID, EmployeeName: this.props.AdminTmp}];
        }
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            console.log('location', location);
            if (location.pathname.indexOf('/ec/main/hub/detail') == 0 && !this.props.hubDetail.HubData) {
                doTabPage({id: location.pathname}, 'close');
            }
        }
        if (!this.props.hubEmployee.hubEmployeeList || this.props.hubEmployee.hubEmployeeList.length == 0) {
            getHubEmployeeList();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hubDetail.editHubInfoFetch.status == 'success' && this.props.hubDetail.editHubInfoFetch.status != 'success') {
            message.info('编辑成功');
            // setParams(nextProps.hubDetail.state_name, {editHubInfoFetch: {status: 'close'}});
            resetState(nextProps.hubDetail.state_name);
            doTabPage({id: nextProps.location.pathname}, 'close');
            LoginService.GetEmpHubList({
                EmployeeID: AppSessionStorage.getEmployeeID()
            }).then((res) => {
                if (res.Data && res.Data.HubList && res.Data.HubList.length > 0) {
                    AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItems({
                        HubList: res.Data.HubList,
                        HubIDList: res.Data.HubList.map((item) => item.HubID)
                    });
                }
            }, (err) => console.log('GetEmpHubList err', err));
        } else if (nextProps.hubDetail.editHubInfoFetch.status == 'error' && this.props.hubDetail.editHubInfoFetch.status != 'error') {
            let res = nextProps.hubDetail.editHubInfoFetch.response || {};
            message.info('编辑失败' + (res.Desc ? ':' + res.Desc : ''));
            setParams(nextProps.hubDetail.state_name, {editHubInfoFetch: {status: 'close'}});
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleRefresh() {
        let data = this.props.hubDetail;
        setParams(data.state_name, {HubData: Object.assign({}, data.HubDataOri)});
    }

    handleSetParam(key, value, paramName = 'HubData') {
        let data = this.props.hubDetail;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handlePictureUpload(file) {
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                let data = this.props.hubDetail;
                let HubData = Object.assign({}, data.HubData, {PicPath: res.name});
                setParams(data.state_name, {HubData: HubData});
            } else {
                console.log('fail', message);
            }
        });
        return false;
    }

    handleWorkTime(type, index, key, value) {
        let data = this.props.hubDetail;
        let hub = data.HubData;
        let list = [].concat(hub.WorkTime.map((o) => Object.assign({}, o)));
        if (type == 'add') {
            list.push({StartWeek: "周六", StopWeek: "周日", StartTime: "09:30", StopTime: "19:00"});
        } else if (type == 'remove') {
            if (hub.WorkTime.length > 1) {
                list.splice(index, 1);
            }
        } else if (type == 'change') {
            list[index][key] = value;
        } else {
            // unknown type
            return;
        }
        setParams(data.state_name, {HubData: Object.assign({}, hub, {WorkTime: list})});
    }

    handleSubmitEdit(e) {
        if (e) e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                let data = this.props.hubDetail;
                let hub = Object.assign({}, data.HubData);
                // if (!hub.AdminID) {
                //     message.info('请选择店长');
                //     return;
                // }
                // if (hub.AreaCode && hub.AreaCode.length == 3) {
                //     hub.AreaCode = hub.AreaCode[2];
                // } else {
                //     message.info("请填写完整的省市区");
                //     return;
                // }
                if (hub.Longlat == null || hub.Longlat == undefined || hub.Longlat.Latitude == null || hub.Longlat.Latitude == undefined) {
                    message.info("请选择门店定位地址");
                    console.log('hubDetail', hub);
                    return;
                }
                hub.EmployeeID = AppSessionStorage.getEmployeeID();
                for (let key of Object.keys(data.HubData)) {
                    if (Object.prototype.toString.call(data.HubData[key]) === '[object String]' && data.HubData[key] == data.HubDataOri[key]) {
                        hub[key] = null;
                    } else if (Object.prototype.toString.call(data.HubData[key]) === '[object Number]' && data.HubData[key] == data.HubDataOri[key]) {
                        hub[key] = 0;
                    }
                }
                hub.HubID = data.HubID;
                hub.PicPath = data.HubData.PicPath;
                if (JSON.stringify(data.HubData.WorkTime) != JSON.stringify(data.HubDataOri.WorkTime)) {
                    hub.WorkTime = JSON.stringify(hub.WorkTime);
                } else {
                    hub.WorkTime = null;
                }
                hub.AdminID = hub.Admin.value && hub.Admin.value.value ? hub.Admin.value.value - 0 : 0;
                delete hub.Admin;
                delete hub.rowKey;
                delete hub.CreateTime;
                delete hub.AdminName;
                hub.Address = hub.Address.value;
                hub.HubName = hub.HubName.value;
                hub.AreaCode = hub.AreaCode.value[2];
                // console.log('编辑门店', hub);
                editHubInfo(hub);
            }
        });
    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    handleShowMap() {
        let data = this.props.hubDetail;
        let hub = data.HubData;
        this.setState({
            mapData: {address: hub.Address.value, longLat: hub.Longlat}
        });
    }

    handleCloseMap(type, data) {
        if (type == 'ok') {
            let hubDetail = this.props.hubDetail;
            let hub = Object.assign({}, hubDetail.HubData, {Address: {value: data.address}, Longlat: data.longLat});
            setParams(hubDetail.state_name, {HubData: hub});
        }
        this.setState({mapData: undefined});
    }


    render() {
        let data = this.props.hubDetail;
        let hub = data.HubData;
        if (!hub) return (<div></div>);
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
        let hubEmployeeList = this.props.hubEmployee.hubEmployeeList.concat(this.currentHubManager);
        return (
            <div className='hub-address-new-view'>
                <div className='ivy-page-title'>
                    <div className="ivy-title">体验中心/门店详情</div>
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
                                        <FormItem {...fLayout} label="体验中心/门店名称">
                                            {getFieldDecorator("HubName", {
                                                rules: [{required: true, message: '名称不能为空'}]
                                                // initialValue: hub.HubName || ''
                                            })(
                                                <Input placeholder="输入名称"
                                                    // onChange={(e) => this.handleSetParam('HubName', e.target.value)}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem required {...fLayout} label="类型">
                                            <Select value={hub.HubType + ''}
                                                    onChange={(value) => this.handleSetParam('HubType', value - 0)}>
                                                {this.eHubTypeList.map((key, index) => {
                                                    return (
                                                        <Option key={index}
                                                                value={key + ''}>
                                                            {this.eHubType[key]}
                                                        </Option>);
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem required {...fLayout} label="启用状态">
                                            <Select value={hub.EnableStatus + ''}
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
                                        <FormItem {...fLayout} label="店长">
                                            {getFieldDecorator("Admin")(
                                                <AutoCompleteSelect allowClear={true}
                                                                    placeholder='选择店长'
                                                                    optionsData={{
                                                                        valueKey: 'EmployeeID',
                                                                        textKey: 'EmployeeName',
                                                                        dataArray: hubEmployeeList
                                                                    }}>
                                                </AutoCompleteSelect>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={15}>
                                    <Col span={10}>

                                        <FormItem {...fLayout} label="所属地区">
                                            {getFieldDecorator("AreaCode", {
                                                rules: [{required: true, type: 'array', len: 3, message: '请选择省/市/区'}]
                                            })(
                                                // ["140000", "140300", "140311"]
                                                // defaultValue={hub.AreaCode || ["140000", "140300", "140311"]}
                                                <Cascader options={this.antOptions}
                                                    // onChange={(value) => this.handleSetParam('AreaCode', value)}
                                                          placeholder="请选择省/市/区" changeOnSelect/>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={15}>
                                    <Col span={20}>
                                        <FormItem {...fLayout2} label="详细地址">
                                            {getFieldDecorator("Address", {
                                                rules: [{required: true, message: '地址不能为空'}]
                                            })(
                                                <Input placeholder="输入地址"
                                                       addonAfter={<Icon
                                                           className={hub.Longlat && hub.Longlat.Longitude > 0 ? 'color-primary' : ''}
                                                           onClick={() => this.handleShowMap()}
                                                           type="environment-o"/>}
                                                    // onChange={(e) => this.handleSetParam('Address', e.target.value)}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <h2 className="mb-10">门店图片</h2>
                                </Row>
                                <Row gutter={15}>
                                    <Col span={10} offset={2}>
                                        <FormItem>
                                            <Upload className="avatar-uploader" accept="image/jpeg,image/png"
                                                    beforeUpload={(file) => this.handlePictureUpload(file)}
                                                    name="avatar">
                                                {hub.PicPath ? (<img src={IMG_PATH + hub.PicPath}/>) :
                                                    (<Icon type="plus" className="avatar-uploader-trigger"/>)}
                                            </Upload>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <h2 className="mb-10">营业时间</h2>
                                </Row>
                                {/* albert备注，后台要求周期格式为中文字符串"周x" */}
                                {hub.WorkTime.map((item, index) => {
                                    return (
                                        <Row key={index} gutter={15}>
                                            <Col span={9}>
                                                <FormItem labelCol={{span: 4}}
                                                          wrapperCol={{span: 20}} label="周期">
                                                    <Row>
                                                        <Col span={10}>
                                                            <Select className="gutter-box"
                                                                    onChange={(value) => this.handleWorkTime('change', index, 'StartWeek', value)}
                                                                    defaultValue={item.StartWeek}>
                                                                {this.weekOption(index, item, 'StartWeek')}
                                                            </Select>
                                                        </Col>
                                                        <Col span={2} className="text-center">~</Col>
                                                        <Col span={10}>
                                                            <Select className="gutter-box"
                                                                    onChange={(value) => this.handleWorkTime('change', index, 'StopWeek', value)}
                                                                    defaultValue={item.StopWeek}>
                                                                {this.weekOption(index, item, 'StopWeek')}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </FormItem>
                                            </Col>
                                            <Col span={9}>
                                                <FormItem labelCol={{span: 4}}
                                                          wrapperCol={{span: 20}} label="时间">
                                                    <Row>
                                                        <Col span={10}>
                                                            <Select className="gutter-box"
                                                                    onChange={(value) => this.handleWorkTime('change', index, 'StartTime', value)}
                                                                    defaultValue={item.StartTime}>
                                                                {this.timeOption()}
                                                            </Select>
                                                        </Col>
                                                        <Col span={2} className="text-center">~</Col>
                                                        <Col span={10}>
                                                            <Select className="gutter-box"
                                                                    onChange={(value) => this.handleWorkTime('change', index, 'StopTime', value)}
                                                                    defaultValue={item.StopTime}>
                                                                {this.timeOption()}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </FormItem>
                                            </Col>
                                            <Col span={4}>
                                                <Button className="mr-8" disabled={index >= 6}
                                                        onClick={() => this.handleWorkTime('add')}>
                                                    <Icon type="plus"/></Button>
                                                <Button disabled={index == 0}
                                                        onClick={() => this.handleWorkTime('remove', index)}>
                                                    <Icon type="minus"/></Button>
                                            </Col>
                                        </Row>);
                                })}
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

    // 预留参数，用于日后添加周期下拉框filter已选周期
    weekOption(index, item, type) {
        return this.weekArr.map((str, index) => <Option key={index} value={str}>{str}</Option>);
    }

    timeOption() {
        return this.timeArr.map((str, index) => <Option key={index} value={str}>{str}</Option>);
    }
}

let mapPropsToFields = (props) => {
    let obj = {};
    let data = props.hubDetail.HubData;
    if (!data) return obj;
    for (let key of Object.keys(data)) {
        if (data[key] && data[key].value != null) {
            obj[key] = Object.assign({}, data[key]);
        }
    }
    // console.log("HubAddressDetail form fields", obj);
    return obj;
};

let onFieldsChange = (props, fields) => {
    setParams(props.hubDetail.state_name, {HubData: Object.assign({}, props.hubDetail.HubData, fields)});
};
export default Form.create({mapPropsToFields, onFieldsChange})(HubAddressDetail);