import React from 'react';
import {Form, Radio, Row, Col, Input, InputNumber, Select, Checkbox} from 'antd';
import 'ASSET/less/Business/ent/ent-form.less';
import ImageShow from 'COMPONENT/ImageShow';
import {UGCType, UGCAuditType} from "CONFIG/EnumerateLib/Mapping_UGC";
import ossConfig from 'CONFIG/ossConfig';

const IMG_PATH = ossConfig.getImgPath();

const UGCSelect_IMG = Object.entries(UGCType).reduce((pre, cur) => {
    if (cur[1].type === UGCAuditType.TYPE_IMG) pre.push(
        <Select.Option key={cur[0]} value={cur[0].toString()}>{cur[1].label}</Select.Option>);
    return pre;
}, []);

const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 14}};

const UGCAudit = Form.create({
    mapPropsToFields: props => ({...props.params}),
    onFieldsChange: (props, fields) => props.setParams(fields)
})(({form, AuditModal, setParams}) => {
    const {getFieldDecorator, getFieldValue} = form;
    let {type, record, newData} = AuditModal;
    if (!record) record = {};
    const disabled = record.AuditStatus !== 1;
    let AuditStatus = getFieldValue('AuditStatus');
    return (
        <Form className='ent-form'>
            {type === UGCAuditType.TYPE_IMG &&
            <Row>
                {record.UGCPicPath && record.UGCPicPath.split('|')
                    .map((path, index) =>
                        <Col key={index} span={8} offset={index === 0 ? 6 : 2} style={{height: 250}}>
                            <ImageShow url={IMG_PATH + path}/>
                        </Col>
                    )}
            </Row>}
            <Row>
                <Form.Item {...formItemLayout} label="企业简称">{record.EnterpriseName}</Form.Item>
            </Row>
            {type !== UGCAuditType.TYPE_IMG &&
            <Row>
                <Form.Item {...formItemLayout} label="类型">{UGCType[record.UGCType] ? UGCType[record.UGCType].label : ''}
                </Form.Item>
            </Row>}
            {type !== UGCAuditType.TYPE_IMG &&
            <Row>
                <Form.Item {...formItemLayout} label="当前最新内容">
                    {type === UGCAuditType.TYPE_TXT ? newData :
                        <div>
                            <InputNumber value={newData && newData.split('|')[0]} disabled/>
                            <Checkbox checked={newData && newData.split('|')[1] == 1}
                                      disabled>{type === UGCAuditType.TYPE_ID ? '扫描件' : '原件'}</Checkbox>
                        </div>
                    }
                </Form.Item>
            </Row>}
            {type !== UGCAuditType.TYPE_IMG &&
            <Row>
                <Form.Item {...formItemLayout} label="纠错时最新内容">
                    {type === UGCAuditType.TYPE_TXT ? record.OriginalContent :
                        <div>
                            <InputNumber value={record.OriginalContent && record.OriginalContent.split('|')[0]}
                                         disabled/>
                            <Checkbox checked={record.OriginalContent && record.OriginalContent.split('|')[1] == 1}
                                      disabled>{type === UGCAuditType.TYPE_ID ? '扫描件' : '原件'}</Checkbox>
                        </div>
                    }
                </Form.Item>
            </Row>}
            <Row><Form.Item {...formItemLayout} label="纠错内容">{record.SubmitContent}</Form.Item></Row>
            {type === UGCAuditType.TYPE_IMG &&
            <Row>
                <Form.Item {...formItemLayout} label="类型">
                    {getFieldDecorator('UGCType')(
                        <Select disabled={disabled}>{UGCSelect_IMG}</Select>
                    )}
                </Form.Item>
            </Row>}
            <Row>
                <Form.Item {...formItemLayout} label="审核结果">
                    {getFieldDecorator('AuditStatus', {
                        initialValue: '2',
                        rules: [{required: true, message: '必填'}]
                    })(
                        <Radio.Group disabled={disabled}>
                            <Radio value='2'>通过</Radio>
                            <Radio value='3'>拒绝</Radio>
                        </Radio.Group>
                    )}
                </Form.Item>
            </Row>
            {type === UGCAuditType.TYPE_IMG && !disabled && AuditStatus == 2 &&
            <Row>
                <Form.Item {...formItemLayout} label='图片说明'>
                    {getFieldDecorator('ModifyContent', {
                        rules: [{required: true, message: '必填'}]
                    })(<Input style={{width: '100%'}} placeholder='请填写' maxLength="45"/>)}
                </Form.Item>
            </Row>}
            {type === UGCAuditType.TYPE_TXT && AuditStatus == 2 &&
            <Row>
                <Form.Item {...formItemLayout} label='最新内容'>
                    {getFieldDecorator('ModifyContent', {
                        rules: [{required: true, message: '必填'}]
                    })(<Input.TextArea style={{width: '100%'}} placeholder='根据用户纠错内容，调整后的结果'
                                       maxLength="300" disabled={disabled}/>)}
                </Form.Item>
            </Row>}
            {(type === UGCAuditType.TYPE_DI || type === UGCAuditType.TYPE_ID) && AuditStatus == 2 && 
            <Row>
                <Form.Item {...formItemLayout}
                           label={`调整后${UGCType[record.UGCType] ? UGCType[record.UGCType].label : ''}`}>
                    {getFieldDecorator('ModifyContent', {
                        initialValue: 0,
                        rules: [{required: true, message: '必填'}]
                    })(<InputNumber style={{width: 80}} placeholder='请输入数字' max={50} disabled={disabled}/>)}
                    <Checkbox
                        name='IsMust' checked={AuditModal.params && AuditModal.params.IsMust}
                        disabled={disabled}
                        onChange={setParams}>{type === UGCAuditType.TYPE_ID ? '扫描件' : '原件'}</Checkbox>
                </Form.Item>
            </Row>}
            <Row>
                <Form.Item {...formItemLayout} label="备注">
                    {getFieldDecorator('Remark')(
                        <Input.TextArea disabled={disabled} maxLength="64"/>
                    )}
                </Form.Item>
            </Row>
        </Form>
    );
});

UGCAudit.obtainQueryParams = (values) => {
    values = {...values};
    let param = {};
    param.Remark = values.Remark;
    param.UGCType = Number(values.UGCType);
    param.AuditStatus = Number(values.AuditStatus);
    if (values.ModifyContent) {
        param.ModifyContent = values.ModifyContent.toString();
    }
    let type = UGCType[param.UGCType] ? UGCType[param.UGCType].type : 0;
    if (type === UGCAuditType.TYPE_ID || type === UGCAuditType.TYPE_DI) {
        param.IsMust = values.isMust ? 1 : 2;
    }
    return param;
};


export default UGCAudit;