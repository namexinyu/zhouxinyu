import React from 'react';
import {Form, Row, Col, Input, InputNumber, Select} from 'antd';
import 'ASSET/less/Business/ent/ent-form.less';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import uploadRule from 'CONFIG/uploadRule';
import AliyunUpload from 'COMPONENT/AliyunUpload';

const formItemLayout = {labelCol: {span: 10}, wrapperCol: {span: 14}};

const EntInfo = Form.create({
    mapPropsToFields: props => {
        let result = {...props.params};
        let Scale = result.Scale;
        if (Scale && !isNaN(Number(Scale.value))) {
            let value = Scale.value;
            result.EntType = {value: value >= 7000 ? '1' : value < 2000 ? '3' : '2'};
        } else {
            result.EntType = {value: '0'};
        }
        return result;
    },
    onFieldsChange: (props, fields) => props.setParams(fields)
})(({form, common, categoryList, USCCUrl, handleUploadChange, onEntSelect}) => {
    const {getFieldDecorator} = form;

    return (
        <Form className='ent-form'>
            <Row>
                <Col span={8}>
                    <Form.Item {...formItemLayout} label="企业全称">
                        {getFieldDecorator('EntName', {
                            rules: [
                                {required: true, message: '请选择企业'},
                                // {validator: (rule, value, cb) => cb(value && value.data && value.data.EntTmpID ? undefined : '请选择企业')}
                                {validator: (rule, value, cb) => {
                                    if (!value.text) {
                                        cb('请选择企业');
                                    }
                                    cb();
                                    
                                }}
                            ]
                        })(
                            <AutoCompleteInput
                                maxLength="5" isOption
                                onSelect={onEntSelect}
                                textKey="EntTmpName" valueKey="EntTmpID" disabledKey='disabled'
                                textExt={(data) => data.disabled ? '(已禁用)' : ''}
                                dataSource={common.EntTmpList}/>)}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item {...formItemLayout} label="所属行业">
                        {getFieldDecorator('CategoryID')(
                            <AutoCompleteInput
                                textKey="EnumDesc" valueKey="EnumValue"
                                dataSource={categoryList}/>
                        )}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item {...formItemLayout} label="提供名单日期">
                        {getFieldDecorator('GivenListDate')(<Input style={{width: '100%'}}/>)}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Form.Item {...formItemLayout} label="企业规模">
                        {getFieldDecorator('Scale')(<InputNumber style={{width: '75%'}}/>)}人
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item {...formItemLayout} label="企业类别">
                        {getFieldDecorator('EntType', {initialValue: '0'})(
                            <Select disabled={true}>
                                <Select.Option value="0">请输入企业规模</Select.Option>
                                <Select.Option value="1">A类</Select.Option>
                                <Select.Option value="2">B类</Select.Option>
                                <Select.Option value="3">C类</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Form.Item {...formItemLayout} label="统一社会信用代码">
                        {getFieldDecorator('USCC', {
                            rules: [
                                {required: true, message: '必填'}
                            ]
                        })(<Input placeholder='请输入' maxLength="50"/>)}
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item {...formItemLayout} label="企业营业执照">
                        <AliyunUpload id='USCCUrl'
                                      accept="image/jpeg,image/png"
                                      oss={uploadRule.entCertPicture}
                                      listType="picture-card"
                                      defaultFileList={USCCUrl}
                                      maxNum={1}
                                      uploadChange={handleUploadChange}/>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
});

EntInfo.obtainQueryParams = (values) => {
    values = {...values};
    let param = {};
    param.EntName = values.EntName.text;
    param.CategoryID = Number(values.CategoryID.data ? values.CategoryID.data.EnumValue : 0);
    param.GivenListDate = values.GivenListDate;
    param.Scale = values.Scale;
    param.EntType = Number(values.EntType);
    param.USCC = values.USCC;
    param.USCCUrl = values.USCCUrl && values.USCCUrl[0] ? values.USCCUrl[0].response.name : '';
    return param;
};
export default EntInfo;