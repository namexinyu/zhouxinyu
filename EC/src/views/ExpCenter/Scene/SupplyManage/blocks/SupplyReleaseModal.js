import React from 'react';
import {Form, Row, Col, Button, Input, Select, Icon, Table, Modal, Upload, Radio, message} from 'antd';
import setParams from "ACTION/setParams";
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import "LESS/components/picture-upload.less";
import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
// 业务相关
import moment from 'moment';
import getUserSignGiftList from "ACTION/ExpCenter/Supply/getUserSignGiftList";
import resetState from "ACTION/resetState";
import Mapping_Scene from "CONFIG/EnumerateLib/Mapping_Scene";
import addSupplyReleaseData from "ACTION/ExpCenter/Supply/addSupplyReleaseData";
import ossConfig from 'CONFIG/ossConfig';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const IMG_PATH = ossConfig.getImgPath();


class SupplyReleaseModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.uploader = null;
        this.eGetType = Mapping_Scene.eSupplyGetType;
        this.eGetTypeList = Object.keys(this.eGetType);
        this.columns = [
            {
                title: '签到时间', key: 'CheckinTime',
                render: (text, record) => {
                    return (
                        <div>{record.CheckinTime ? moment(record.CheckinTime).format('YYYY/MM/DD HH:mm') : ''}</div>);
                }
            },
            {title: '体验中心', dataIndex: 'HubName'},
            {title: '姓名', dataIndex: 'UserName'},
            {title: '身份证号', dataIndex: 'IDCardNum'},
            {title: '企业', dataIndex: 'RecruitName'},
            {title: '物品', dataIndex: 'GiftName'},
            // {(item.Amount / 100).FormatMoney({fixed: 2})}
            {
                title: '金额', key: 'Amount',
                render: (text, record) => {
                    if (!(record.Amount > 0)) return '';
                    return (<div>{(record.Amount / 100).FormatMoney({fixed: 2}) + '元'}</div>);
                }
            },
            {
                title: '工牌', key: 'WorkCardPath',
                render: (text, record) => (<div>{record.WorkCardPath ? (<Icon type="check"/>) : ''}</div>)
            },
            {
                title: '操作', key: 'Operate',
                render: (text, record) => {
                    if (!record.GiftName) return '';
                    if (record.Whether == 2) {
                        return <div className="color-grey">已领取</div>;
                    }
                    if (record.CheckinTime && moment().diff(moment(record.CheckinTime), 'days') > 4) {
                        return <div className="color-grey">已超过时间</div>;
                    }
                    return (<div><a onClick={() => this.handlePickRecord(record)}>领取</a></div>);
                }
            }
        ];
        let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        if (HubIDList && HubIDList.length == 1) {
            this.hubID = HubIDList[0];
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let fetch = nextProps.supplyNew.addSupplyReleaseDataFetch;
        if (fetch.status == 'success') {
            message.info('新增发放成功');
            resetState(nextProps.supplyNew.state_name);
            this.handleCloseModal(true);
        }
        if (fetch.status == 'error') {
            let res = fetch.response;
            message.info('新增发放失败' + (res.Desc ? ':' + res.Desc : ''));
            setParams(nextProps.supplyNew.state_name, {addSupplyReleaseDataFetch: {status: 'close'}});
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleClearPick() {
        resetState(this.props.supplyNew.state_name);
    }

    handlePickRecord(item) {
        let data = this.props.supplyNew;
        let param = data.SupplyReleaseData;
        let info = {
            GiftID: item.GiftID,
            // HubID: item.HubID,
            RecruitID: item.RecruitID,
            UserID: item.UserID,
            UserOrderID: item.UserOrderID,
            Amount: item.Amount,
            // 初始化
            GetType: 1,
            PayType: 2,
            // WorkCardPath: "ExpCenter/20171128/f482c9d2-6823-45dc-b5c0-d42a7b229e6f.jpg"
            WorkCardPath: undefined
        };
        setParams(data.state_name, {
            SupplyReleaseData: Object.assign({}, param, info)
        });
    }

    handleSetParam(key, value, paramName = 'SupplyReleaseData') {
        let data = this.props.supplyNew;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleConfirm() {
        let data = this.props.supplyNew;
        let param = Object.assign({}, data.SupplyReleaseData);
        // if (data.authHubID == -9999) {
        //     message.info('请选择门店');
        //     return;
        // }
        if (this.hubID == undefined || this.hubID == null) {
            message.destroy();
            message.info('门店权限异常,请确认操作人员仅归属一个门店下');
            return;
        }
        if (param.UserOrderID == null || param.UserOrderID == undefined) {
            this.handleCloseModal();
        } else {
            if (param.GetType == 2 && !param.WorkCardPath) {
                message.info('请上传工牌图片');
            } else if (param.GetType == 2 && param.WorkCardPath) {
                param.PayType = 0;
                param.Amount = 0;
            } else if (param.GetType == 1) {
                param.WorkCardPath = null;
            }
            param.HubID = this.hubID;
            param.EmployeeID = AppSessionStorage.getEmployeeID();
            addSupplyReleaseData(param);
        }
    }

    handleCloseModal(refresh) {
        let data = this.props.supplyNew;
        resetState(data.state_name);
        this.props.closeModal(refresh);
    }

    handlePictureUpload(file) {
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                let data = this.props.supplyNew;
                let SupplyReleaseData = Object.assign({}, data.SupplyReleaseData, {WorkCardPath: res.name});
                setParams(data.state_name, {SupplyReleaseData: SupplyReleaseData});
            } else {
                console.log('fail', message);
            }
        });
        return false;
    }

    doQuery(data, reload = false, e) {
        if (e) e.preventDefault();
        // if (data.authHubID == -9999) {
        //     message.info('请选择门店');
        //     return;
        // }
        // let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        // if (data.authHubID != -9999) HubIDList = [data.authHubID];
        getUserSignGiftList({
            // HubIDList: HubIDList,
            UserName: data.UserName
        });
    }

    render() {
        let data = this.props.supplyNew;
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        let info = data.SupplyReleaseData;
        return (
            <Modal
                width={720}
                title="新增发放"
                visible={true}
                onOk={() => this.handleConfirm()}
                onCancel={() => this.handleCloseModal()}
                okText="确认"
                cancelText="取消"
            >
                <Row className={data.SupplyReleaseData.UserOrderID ? 'display-none' : ''}>
                    <Col span={20} offset={2}>
                        <Form>
                            {/* <AuthorityHubSelect authHubID={data.authHubID} span={12}*/}
                            {/* onChange={(value) => setParams(data.state_name, {authHubID: value})}/>*/}
                            <Row gutter={15}>
                                <Col className="gutter-row" span={12}>
                                    <FormItem {...fLayout} label="会员名称">
                                        <Input value={data.UserName || ''}
                                               placeholder="输入姓名"
                                               onChange={(e) => setParams(data.state_name, {UserName: e.target.value})}/>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-row" span={12}>
                                    <FormItem className="text-right">
                                        {/* <Button className="ant-btn ml-8"*/}
                                        {/* onClick={() => setParams(data.state_name, {UserName: ''})}>重置</Button>*/}
                                        <Button className="ant-btn ml-8" type="primary"
                                                onClick={() => this.doQuery(data, true)}>搜索</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Table rowKey="rowKey" columns={this.columns}
                       className={info.UserOrderID ? 'display-none' : ''}
                       dataSource={data.userSignGiftList}>
                </Table>
                {info.UserOrderID != undefined && info != null ? (
                    <Row>
                        <Col span={20} offset={2}>
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <FormItem {...fLayout} label="会员名称">
                                    <Input value={data.UserName}
                                           addonAfter={<Icon className="color-danger"
                                                             onClick={() => this.handleClearPick()}
                                                             type="close"/>} disabled/>
                                </FormItem>
                                {/* <AuthorityHubSelect authHubID={data.authHubID} span={24}*/}
                                {/* onChange={(value) => setParams(data.state_name, {authHubID: value})}/>*/}
                                <FormItem {...fLayout} label="类型">
                                    <RadioGroup value={info.GetType + ''}
                                                onChange={(e) => this.handleSetParam('GetType', e.target.value - 0)}>
                                        {this.eGetTypeList.map((key, index) => {
                                            return <RadioButton key={index}
                                                                value={key + ''}>{this.eGetType[key]}</RadioButton>;
                                        })}
                                    </RadioGroup>
                                </FormItem>
                                <FormItem {...fLayout} label="上传工牌" className={info.GetType == 2 ? '' : 'display-none'}>
                                    <Upload className="avatar-uploader" accept="image/jpeg,image/png"
                                            beforeUpload={(file) => this.handlePictureUpload(file)}
                                            name="avatar">
                                        {info.WorkCardPath ? (
                                                <img src={IMG_PATH + info.WorkCardPath}/>) :
                                            (<Icon type="plus" className="avatar-uploader-trigger"/>)}
                                    </Upload>
                                </FormItem>
                            </Form>
                        </Col>
                    </Row>) : ''}
            </Modal>
        );
    }
}


export default SupplyReleaseModal;