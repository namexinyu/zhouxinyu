import React from 'react';
import {Form, Row, Col, Button, Input, InputNumber, Select, Table, Modal, Upload, Radio, Icon, message} from 'antd';
import setParams from "ACTION/setParams";
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import "LESS/components/picture-upload.less";
import resetState from 'ACTION/resetState';
import moment from 'moment';
// 业务相关
import addDispatchClaim from 'ACTION/ExpCenter/DispatchTrack/addDispatchClaim';
import Mapping_Dispatch from "CONFIG/EnumerateLib/Mapping_Dispatch";
import Mapping_Scene from "CONFIG/EnumerateLib/Mapping_Scene";
import ossConfig from 'CONFIG/ossConfig';


const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const IMG_PATH = ossConfig.getImgPath();

class DispatchClaimModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.uploader = null;
        this.eStatus = Object.assign({}, Mapping_Dispatch.eBoardingStatus);
        this.eStatusList = Object.keys(this.eStatus);
        this.eType = Object.assign({}, Mapping_Dispatch.eBoardingType);
        this.eTypeAll = Object.assign({}, Mapping_Dispatch.eBoardingTypeAll);
        this.eTypeComplex = Object.assign({}, Mapping_Dispatch.eBoardingTypeComplex);
        // this.eTypeOther = Mapping_Dispatch.eBoardingTypeOther;
        this.eTypeList = Object.keys(this.eType);
        this.eTypeOtherList = Object.keys(this.eTypeAll).filter((key) => key != 1);
        this.eDriverAcceptStatus = Object.assign({}, Mapping_Dispatch.eDriverAcceptStatus);
        this.eRefundPayType = Mapping_Scene.eRefundPayType;
        this.eRefundPayTypeList = Object.keys(this.eRefundPayType).reverse();
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

    handleSetParam(key, value, paramName = 'ClaimData') {
        let data = this.props.claim;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleDoClaim() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                let data = this.props.claim;
                if (data.ClaimData.Money > 100 || data.ClaimData.Money < 1) {
                    message.info('报销金额只能为1-100元');
                    return;
                }
                if (!data.ClaimData.URL) {
                    message.info('报销必须上传凭证');
                    return;
                }
                let param = {
                    OrderID: data.DispatchID,
                    OperatorID: AppSessionStorage.getEmployeeID(),
                    Money: data.ClaimData.Money * 100,
                    Method: data.ClaimData.Method - 0,
                    URL: data.ClaimData.URL
                };
                addDispatchClaim(param);
            }
        });
    }

    hideModal() {
        console.log('hideModal');
        let data = this.props.claim;
        resetState(data.state_name);
        // setParams(data.state_name, {
        //     DispatchID: undefined,
        //     DispatchData: undefined,
        //     ClaimData: {Money: undefined, URL: undefined}
        // });
    }

    handlePictureUpload(file) {
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                let data = this.props.claim;
                let ClaimData = Object.assign({}, data.ClaimData, {URL: res.name});
                setParams(data.state_name, {ClaimData: ClaimData});
            } else {
                console.log('fail', message);
            }
        });
        return false;
    }

    render() {
        let data = this.props.claim;
        const fLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        const {getFieldDecorator} = this.props.form;
        if (data.DispatchID == undefined || data.DispatchID == null) return (<div className="style-none"></div>);
        return (
            <Modal
                width={800}
                title="报销"
                visible={data.DispatchID != undefined && data.DispatchID != null && data.DispatchID != ''}
                onOk={() => this.handleDoClaim()}
                onCancel={() => this.hideModal()}
                okText="确认"
                cancelText="取消"
            >
                <Table rowKey="rowKey" columns={this.tableColumns()}
                       pagination={false}
                       dataSource={[data.DispatchData]}></Table>
                <Form className="mt-20" onSubmit={(e) => e.preventDefault()}>
                    <Row>
                        <Col span={12}>
                            <FormItem {...fLayout} label="报销凭证">
                                <Upload className="avatar-uploader" accept="image/jpeg,image/png"
                                        beforeUpload={(file) => this.handlePictureUpload(file)}
                                        name="avatar">
                                    {data.ClaimData.URL ? (<img src={IMG_PATH + data.ClaimData.URL}/>) :
                                        (<Icon type="plus" className="avatar-uploader-trigger"/>)}
                                </Upload>
                            </FormItem>

                        </Col>
                        <Col span={12}>
                            {/* 暂时隐藏 */}
                            <FormItem {...fLayout} label="报销类型" className="display-none">
                                <RadioGroup value={data.ClaimData.Method + ''}
                                            onChange={(e) => this.handleSetParam('Method', e.target.value - 0)}>
                                    {this.eRefundPayTypeList.map((key, index) => {
                                        return <RadioButton key={index}
                                                            value={key + ''}>{this.eRefundPayType[key]}</RadioButton>;
                                    })}
                                </RadioGroup>
                            </FormItem>
                            <FormItem {...fLayout} label="报销金额">
                                {getFieldDecorator('Money', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^100(\.0{1,2})?$|^[1-9]?[0-9](\.[0-9]{1,2})?$/,
                                            message: '输入1-100元内的金额'
                                        }
                                    ],
                                    initialValue: data.ClaimData.Money || ''
                                })(
                                    <InputNumber placeholder="报销金额" step={1}
                                                 style={{width: '120px'}}
                                                 onChange={(value) => this.handleSetParam('Money', value)}/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }

    tableColumns() {
        return [
            {
                title: '派单时间', key: 'Time',
                render: (text, record) => {
                    return (<div>{record.Time ? moment(record.Time).format('MM/DD HH:mm') : ''}</div>);
                }
            },
            {title: '派单来源', dataIndex: 'Broker'},
            {title: '会员姓名', dataIndex: 'UserName'},
            {title: '手机号', dataIndex: 'PhoneNumber'},
            // {title: '随行人数', dataIndex: 'People'},
            {
                title: '总人数', key: 'PeopleSum',
                render: (text, record) => {
                    return (<div>{record.People ? record.People + 1 : ''}</div>);
                }
            },
            {title: '接送专员', dataIndex: 'Driver'},
            {title: '去哪儿接', dataIndex: 'Start'},
            {title: '往哪儿送', dataIndex: 'Destination'},

            {
                title: '接送类型', key: 'Type',
                render: (text, record) => {
                    return this.eTypeAll[record.Type];
                }
            },
            {
                title: '接送状态', dataIndex: 'Status',
                render: (text, record) => {
                    return this.eStatus[record.Status];
                }
            }
        ];
    }
}


export default Form.create()(DispatchClaimModal);