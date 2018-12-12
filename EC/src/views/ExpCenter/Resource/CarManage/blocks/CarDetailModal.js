import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Modal, Upload, Icon, message, Radio} from 'antd';
import setParams from "ACTION/setParams";
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import "LESS/components/picture-upload.less";
import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
// 业务相关
import ModVehicleInfo from 'ACTION/ExpCenter/Vehicle/ModVehicleInfo';
import resetState from 'ACTION/resetState';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// const IMG_PATH = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('IMG_PATH');

class CarDetailModal extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleSetParam(key, value, paramName = 'VehicleData') {
        let data = this.props.detail;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleDoMod() {
        let data = this.props.detail;
        let car = Object.assign({}, data.VehicleData);
        if (car.HubID == -9999) {
            message.info('请选择所属体验中心');
            return;
        }
        if (!car.VehiclePlate) {
            message.info('请输入车牌号码');
            return;
        }
        if (!car.VehicleColor) {
            message.info('请输入颜色');
            return;
        }
        if (!car.VehicleType) {
            message.info('请输入车辆型号');
            return;
        }
        if (parseInt(car.SeatNum, 10) != car.SeatNum || car.SeatNum <= 0 || car.SeatNum > 999) {
            message.info('请输入有效的车座数量');
            return;
        }

        ModVehicleInfo(car);
    }

    hideModal() {
        let data = this.props.detail;
        resetState(data.state_name);
    }

    render() {
        let data = this.props.detail;
        const fLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        const {getFieldDecorator} = this.props.form;
        if (data.VehicleID == undefined || data.VehicleID == null) return (<div className="style-none"></div>);
        let info = data.VehicleData;
        return (
            <Modal
                width={400}
                title={data.VehicleID == 0 ? '新增车辆' : '修改车辆'}
                visible={true}
                // visible={data.UserOrderID != undefined && data.UserOrderID != null && data.UserOrderID != ''}
                onOk={() => this.handleDoMod()}
                onCancel={() => this.hideModal()}
                okText="确认"
                cancelText="取消"
            >
                <Row>
                    <Col span={20} offset={2}>

                        <Form onSubmit={(e) => e.preventDefault()}>
                            <AuthorityHubSelect authHubID={info.HubID} span={24}
                                                onChange={(value) => this.handleSetParam('HubID', value - 0)}/>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...fLayout} label="车牌号码">
                                        <Input value={info.VehiclePlate} placeholder="车牌号码"
                                               onChange={(e) => this.handleSetParam('VehiclePlate', e.target.value)}/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...fLayout} label="颜色">
                                        <Input value={info.VehicleColor} placeholder="颜色"
                                               onChange={(e) => this.handleSetParam('VehicleColor', e.target.value)}/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...fLayout} label="车辆型号">
                                        <Input value={info.VehicleType} placeholder="车辆型号"
                                               onChange={(e) => this.handleSetParam('VehicleType', e.target.value)}/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem {...fLayout} label="车座数量">
                                        <Input value={info.SeatNum || ''} placeholder="车座数量" type="number"
                                               onChange={(e) => this.handleSetParam('SeatNum', e.target.value - 0)}/>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        );
    }
}


export default Form.create()(CarDetailModal);