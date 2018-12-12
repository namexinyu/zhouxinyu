import React from 'react';
import {Form, Row, Col, Card, Input, Button, Icon, Upload} from 'antd';
import 'ASSET/less/Business/ent/ent-form.less';
import uploadRule from 'CONFIG/uploadRule';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import EntInfo from "../entInfo";

const formItemLayout = {labelCol: {span: 3}, wrapperCol: {span: 16}};

const EntExtra = Form.create({
    mapPropsToFields: props => ({...props.params}),
    onFieldsChange: (props, fields) => props.setParams(fields)
})(({form, HireRuleUrl, EntLogoUrl, EntMaterialList, BannerUrl, handleUploadChange}) => {
    const {getFieldDecorator} = form;

    return (
        <Form className='ent-form'>
            <Card title='企业介绍'>
                <Row>
                    <Col span={12}>
                        <Form.Item {...formItemLayout} label="企业简介">
                            {getFieldDecorator('EntDesc', {
                                initialValue: ''
                            })(
                                <Input.TextArea style={{width: '100%'}} maxLength="1024"/>)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item {...formItemLayout} label="招工简章">
                            <AliyunUpload id={'HireRuleUrl'}
                                          listType="text"
                                          accept="application/x-rar-compressed,application/zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                                          maxNum={1}
                                          previewVisible={false}
                                          defaultFileList={HireRuleUrl}
                                          oss={uploadRule.entCertPicture}
                                          uploadChange={handleUploadChange}>
                                <Button><Icon type="upload"/>点击上传</Button>
                            </AliyunUpload>
                        </Form.Item>
                        <p className="ant-upload-hint">支持扩展名：.rar .zip .doc .docx .pdf</p>
                    </Col>
                </Row>
            </Card>
            <Card title='补充信息' className='mt-8'>
                <Form.Item {...formItemLayout} label="企业LOGO">
                    <AliyunUpload id='EntLogoUrl' accept="image/jpeg,image/png"
                                  oss={uploadRule.entMaterialPicture}
                                  listType="picture-card"
                                  defaultFileList={EntLogoUrl}
                                  maxNum={1}
                                  uploadChange={handleUploadChange}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="企业环境">
                    <AliyunUpload id='EntMaterialList_2' accept="image/jpeg,image/png"
                                  oss={uploadRule.entMaterialPicture}
                                  listType="picture-card"
                                  defaultFileList={EntMaterialList[2] || []}
                                  maxNum={5}
                                  uploadChange={handleUploadChange}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="工资条">
                    <AliyunUpload id='EntMaterialList_1' accept="image/jpeg,image/png"
                                  oss={uploadRule.entMaterialPicture}
                                  listType="picture-card"
                                  defaultFileList={EntMaterialList[1] || []}
                                  maxNum={5}
                                  uploadChange={handleUploadChange}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="住宿">
                    <AliyunUpload id='EntMaterialList_3' accept="image/jpeg,image/png"
                                  oss={uploadRule.entMaterialPicture}
                                  listType="picture-card"
                                  defaultFileList={EntMaterialList[3] || []}
                                  maxNum={5}
                                  uploadChange={handleUploadChange}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="食堂">
                    <AliyunUpload id='EntMaterialList_4' accept="image/jpeg,image/png"
                                  oss={uploadRule.entMaterialPicture}
                                  listType="picture-card"
                                  defaultFileList={EntMaterialList[4] || []}
                                  maxNum={5}
                                  uploadChange={handleUploadChange}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label="Banner">
                    <AliyunUpload id='BannerUrl' accept="image/jpeg,image/png"
                                  oss={uploadRule.entMaterialPicture}
                                  listType="picture-card"
                                  defaultFileList={BannerUrl}
                                  maxNum={3}
                                  uploadChange={handleUploadChange}/>
                </Form.Item>
            </Card>
        </Form>
    );
});

const toObj = (list) => Object.entries(list || {}).reduce((pre, cur) => {
    pre[cur[0]] = (cur[1] || []).reduce((cp, cc) => {
        cp[cc.PicUrl] = cc;
        return cp;
    }, {});
    return pre;
}, {});

EntExtra.obtainQueryParams = (values, originalEntMaterialList = []) => {
    values = {...values};
    let param = {};
    param.EntDesc = values.EntDesc;
    param.BannerUrl = values.BannerUrl && values.BannerUrl instanceof Array ? values.BannerUrl.reduce((pre, cur, index) => {
        if (index !== 0) pre += ',';
        pre += cur.response.name;
        return pre;
    }, '') : '';
    param.EntLogoUrl = values.EntLogoUrl && values.EntLogoUrl[0] ? values.EntLogoUrl[0].response.name : '';
    param.HireRuleUrl = values.HireRuleUrl && values.HireRuleUrl[0] ? values.HireRuleUrl[0].response.name : '';

    param.EntMaterialList = {};

    const EntMaterialList = Object.entries(values.EntMaterialList || {}).reduce((pre, cur) => {
        pre[cur[0]] = (cur[1] || []).reduce((cp, cc) => {
            cp.push({PicUrl: cc.response.name, PicTip: cc.desc});
            return cp;
        }, []);
        return pre;
    }, {});

    const originalEntMaterialListObj = toObj(originalEntMaterialList);
    const EntMaterialListObj = toObj(EntMaterialList);

    for (let i = 1; i <= 4; i++) {
        let tmp = new Map();
        let originalEntMaterialObj = originalEntMaterialListObj[i] || {};
        let EntMaterialObj = EntMaterialListObj[i] || {};

        let EntMaterial = EntMaterialList[i];
        EntMaterial && EntMaterial.forEach((item) => {
            let oEntMaterial = originalEntMaterialObj[item.PicUrl];
            if (!oEntMaterial || !oEntMaterial.EntMaterialDetailID) {
                tmp.set(item.PicUrl, {...item, EntMaterialDetailID: 0, OperType: 1});
            }
        });

        let originalEntMaterial = originalEntMaterialList[i];
        originalEntMaterial && originalEntMaterial.forEach((item) => {
            let oEntMaterial = EntMaterialObj[item.PicUrl];
            if (!oEntMaterial && item.EntMaterialDetailID) {
                tmp.set(item.PicUrl, {...item, OperType: 2});
            }
        });
        param.EntMaterialList[i] = [...tmp.values()];
    }
    console.log('original', originalEntMaterialListObj);
    console.log('new', EntMaterialListObj);
    console.log('merge', param.EntMaterialList);

    return param;
};
export default EntExtra;