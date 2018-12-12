import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Modal, Upload, Icon, message} from 'antd';
import setParams from "ACTION/setParams";
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import "LESS/components/picture-upload.less";

import addDispatchClaim from 'ACTION/ExpCenter/DispatchTrack/addDispatchClaim';
import resetState from 'ACTION/resetState';
import ossConfig from 'CONFIG/ossConfig';

const FormItem = Form.Item;
const IMG_PATH = ossConfig.getImgPath();

class DispatchClaimModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.uploader = null;
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
        let data = this.props.claim;
        if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].indexOf(data.ClaimData.Money) == -1) {
            message.info('报销金额只能为1-10元');
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
            URL: data.ClaimData.URL
        };
        addDispatchClaim(param);
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
                let ClaimData = Object.assign({}, data.ClaimData, {URL: res.url});
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
                width={600}
                title="报销"
                visible={data.DispatchID != undefined && data.DispatchID != null && data.DispatchID != ''}
                onOk={() => this.handleDoClaim()}
                onCancel={() => this.hideModal()}
                okText="确认"
                cancelText="取消"
            >
                <Row><Col span={20} offset={2}>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <FormItem {...fLayout} label="会员名称">
                            <Input disabled value={data.DispatchData ? data.DispatchData.UserName : ''}/>
                        </FormItem>
                        <FormItem {...fLayout} label="报销凭证">
                            <Upload accept="image/jpeg,image/png" className="avatar-uploader"
                                    beforeUpload={(file) => this.handlePictureUpload(file)}
                                    name="avatar">
                                {data.ClaimData.URL ? (<img src={IMG_PATH + data.ClaimData.URL}/>) :
                                    (<Icon type="plus" className="avatar-uploader-trigger"/>)}
                            </Upload>
                        </FormItem>
                        <FormItem {...fLayout} label="报销金额">
                            {getFieldDecorator('Money', {
                                rules: [
                                    {required: true, message: '输入金额'},
                                    {
                                        type: "enum",
                                        enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                                        message: '只能报销1-10元'
                                    }
                                ],
                                initialValue: data.ClaimData.Money || ''
                            })(
                                <Input placeholder="报销金额" type="number"
                                       onChange={(e) => this.handleSetParam('Money', e.target.value - 0)}/>
                            )}
                        </FormItem>
                    </Form>
                </Col></Row>
            </Modal>
        );
    }
}


export default Form.create()(DispatchClaimModal);