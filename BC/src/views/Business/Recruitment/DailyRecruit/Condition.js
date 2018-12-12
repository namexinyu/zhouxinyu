import React from 'react';
import {
    Row,
    Form,
    Col,
    Input,
    Radio,
    message,
    InputNumber,
    Checkbox
} from 'antd';
import 'ASSET/less/Business/ent/ent-form.less';

class Condition extends React.PureComponent {
    lastCheckAll = {};
    setParams = this.props.setParams;
    decodeCheckBox = this.props.decodeCheckBox;

    componentWillReceiveProps(nextProps) {
        let nFieldName = nextProps.conditionInfo.FieldName;
        if (nFieldName && nFieldName !== 'condition') {
            if (nFieldName !== this.props.conditionInfo.FieldName) {
                let i = this.refs[nFieldName];
                if (i && i.refs) {
                    let input = i.refs.input;
                    if (input) input.focus();
                }
            }
        }
    }

    handleChangeCheckbox(values, operateKey) {
        let result = 0;
        let allValue = this.props[operateKey + 'Opt'][0].value; // 不限

        if (values[values.length - 1] === allValue) {
            result = allValue;
        } else {
            let max = (values || []).reduce((pre, cur) => Math.max(pre, cur), 0);
            if (max === allValue) {
                result = (values || []).reduce((pre, cur) => cur === max ? pre : pre + cur, 0);
            } else {
                result = (values || []).reduce((pre, cur) => pre + cur, 0);
            }
        }
        if (result === allValue && this.lastCheckAll[operateKey]) {
            result = 0;
        }
        this.lastCheckAll[operateKey] = result === allValue;
        this.setParams({ [operateKey]: result });
    }

    handleChangeInputText(e, operateKey, type) {
        let value;
        if (type === 'number') {
            value = parseInt(e.target.value, 10);
            if (window.isNaN(value)) {
                if (e.target.value === '') {
                    value = 0;
                } else {
                    message.error('输入值必须为数字');
                    return false;
                }
            }
        } else {
            value = e.target.value;
        }
        this.setParams({ [operateKey]: value });
    }

    handleChangeRadioGroup(e, operateKey) {
        if (operateKey == "TipsCheckboxs") {
            this.setParams({ [operateKey]: e });
        } else {
            this.setParams({ [operateKey]: e.target.value });
        }
    }

    handleChangeReturn(e, key) {
        let Return = this.props.conditionInfo.Return ? JSON.parse(this.props.conditionInfo.Return) : {};
        if (key === 'normal' || key === 'self' || key === 'other') {
            Return[key] = e.target.checked;
        } else {
            Return[key] = e;
        }
        this.setParams({ Return: JSON.stringify(Return) });
    }

    handleCopyEnt = (e) => {
        let EntAddress = this.props.conditionInfo.EntAddress || ''; // 地址
        if (EntAddress) {
            let nFactoryPickup = this.props.conditionInfo.FactoryPickup || '';
            if (e.target.checked) {
                nFactoryPickup += EntAddress;
            } else if (nFactoryPickup.length) {
                let index = nFactoryPickup.lastIndexOf(EntAddress);
                if (index >= 0) {
                    let a = nFactoryPickup.substring(0, index);
                    let b = nFactoryPickup.substring(index + EntAddress.length, nFactoryPickup.length);
                    nFactoryPickup = a + b;
                }
            }
            this.setParams({ FactoryPickup: nFactoryPickup });
        }
    };

    handleWantNumberChange = (e) => {
        this.setParams({ WantNumber: e.target.value });
    }

    render() {
        const {
            form: {
                getFieldDecorator
            },
            conditionInfo, IDCardTypeOpt, QualificationOpt, TattooOpt, SmokeScarOpt
        } = this.props;
        let returnCompany = this.props.conditionInfo.Return ? JSON.parse(this.props.conditionInfo.Return) : {};
        const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
        return (
            <Form className='ent-form'>
                <Form.Item {...formLayout} label="身份证">
                    <Checkbox.Group options={IDCardTypeOpt} ref='IDCardType'
                        value={conditionInfo.IDCardType ? this.decodeCheckBox(conditionInfo.IDCardType, 'IDCardType') : []}
                        name='IDCardType'
                        onChange={(checkedValues) => this.handleChangeCheckbox(checkedValues, 'IDCardType')} />
                </Form.Item>
                <Form.Item {...formLayout} label="毕业证">
                    <Checkbox.Group options={QualificationOpt}
                        value={conditionInfo.Qualification ? this.decodeCheckBox(conditionInfo.Qualification, 'Qualification') : []}
                        onChange={(checkedValues) => this.handleChangeCheckbox(checkedValues, 'Qualification')} />
                </Form.Item>

                <Form.Item {...formLayout} label="名额">
                    {getFieldDecorator('WantNumber', {
                        initialValue: conditionInfo.WantNumber === 0 ? '不限' : conditionInfo.WantNumber,
                        rules: [
                            {
                                validator: (rule, value, cb) => {
                                    if (!!value.trim() && /^\d+$/.test(value)) {
                                        if (value.trim().length >= 3) {
                                            cb('人数确认吗？');
                                        }
                                    }
                                    cb();
                                }
                            }
                        ]
                    })(
                        <Input type="text" placeholder="请输入" onChange={this.handleWantNumberChange} style={{ width: '100px' }} maxLength="4" />
                    )}
                </Form.Item>

                <Form.Item {...formLayout} label="性别比例">
                    <Input
                        ref='MaleScale'
                        addonBefore="男" value={conditionInfo.MaleScale} style={{ width: '100px' }}
                        onChange={(e) => this.handleChangeInputText(e, 'MaleScale', 'number')} />
                    <label className='ml-8 mr-8'>:</label>
                    <Input
                        addonBefore="女" value={conditionInfo.FemaleScale} style={{ width: '100px' }}
                        onChange={(e) => this.handleChangeInputText(e, 'FemaleScale', 'number')} />
                    注：0:0（男女不限），3:1（3男1女），1:0（只招男性），0:1（只招女性）
                </Form.Item>
                <Form.Item {...formLayout} label="年龄">
                    <Row gutter={8}>
                        <Col span={8}><Input addonBefore="男（最低）" value={conditionInfo.MaleMinAge} ref='Age'
                            onChange={(e) => this.handleChangeInputText(e, 'MaleMinAge', 'number')} /></Col>
                        <Col span={8}><Input addonBefore="男（最高）" value={conditionInfo.MaleMaxAge}
                            onChange={(e) => this.handleChangeInputText(e, 'MaleMaxAge', 'number')} /></Col>
                    </Row>
                    <Row className="mt-8" gutter={8}>
                        <Col span={8}><Input addonBefore="女（最低）" value={conditionInfo.FeMaleMinAge}
                            onChange={(e) => this.handleChangeInputText(e, 'FeMaleMinAge', 'number')} /></Col>
                        <Col span={8}><Input addonBefore="女（最高）" value={conditionInfo.FeMaleMaxAge}
                            onChange={(e) => this.handleChangeInputText(e, 'FeMaleMaxAge', 'number')} /></Col>
                    </Row>
                </Form.Item>
                <Form.Item {...formLayout} label="身高">
                    <Row gutter={8}>
                        <Col span={8}><Input addonBefore="男不低于（厘米）" value={conditionInfo.MaleMinHeight}
                            onChange={(e) => this.handleChangeInputText(e, 'MaleMinHeight', 'number')} /></Col>
                        <Col span={8}><Input addonBefore="女不低于（厘米）" value={conditionInfo.FemaleMinHeight}
                            onChange={(e) => this.handleChangeInputText(e, 'FemaleMinHeight', 'number')} /></Col>
                    </Row>
                </Form.Item>
                <Form.Item {...formLayout} label="纹身">
                    <div>
                        <Checkbox.Group
                            options={TattooOpt} ref='Tattoo'
                            value={conditionInfo.Tattoo ? this.decodeCheckBox(conditionInfo.Tattoo, 'Tattoo') : []}
                            onChange={(checkedValues) => this.handleChangeCheckbox(checkedValues, 'Tattoo')} />
                        其他：<Input type="text" placeholder="请输入" value={conditionInfo.TattooRemark}
                            style={{ width: 'auto' }} maxLength="100"
                            onChange={(e) => this.handleChangeInputText(e, 'TattooRemark')} />
                    </div>
                </Form.Item>
                <Form.Item {...formLayout} label="烟疤">
                    <div>
                        <Checkbox.Group options={SmokeScarOpt} ref='SmokeScar'
                            value={conditionInfo.SmokeScar ? this.decodeCheckBox(conditionInfo.SmokeScar, 'SmokeScar') : []}
                            onChange={(checkedValues) => this.handleChangeCheckbox(checkedValues, 'SmokeScar')} />
                        其他：<Input type="text" placeholder="请输入" value={conditionInfo.SmokeScarRemark}
                            style={{ width: 'auto' }} maxLength="100"
                            onChange={(e) => this.handleChangeInputText(e, 'SmokeScarRemark')} />
                    </div>
                </Form.Item>
                <Form.Item {...formLayout} label="返厂规定">
                    <Checkbox checked={!!returnCompany.normal}
                        onChange={(e) => this.handleChangeReturn(e, 'normal')}>正常离职满</Checkbox>
                    <InputNumber min={0} value={returnCompany.normalMonth || 0} style={{ width: '60px' }}
                        onChange={(e) => this.handleChangeReturn(e, 'normalMonth')} />月
                    <Checkbox className="ml-40" checked={!!returnCompany.self}
                        onChange={(e) => this.handleChangeReturn(e, 'self')}>自离满</Checkbox>
                    <InputNumber min={0} value={returnCompany.selfMonth || 0} style={{ width: '60px' }}
                        onChange={(e) => this.handleChangeReturn(e, 'selfMonth')} />月
                    <Checkbox className="ml-40" checked={!!returnCompany.other}
                        onChange={(e) => this.handleChangeReturn(e, 'other')}>其他</Checkbox>
                    <Input value={returnCompany.otherRemark || ''} style={{ width: '120px' }}
                        placeholder='请输入'
                        onChange={(e) => this.handleChangeReturn(e.target.value, 'otherRemark')} />
                </Form.Item>
                <Form.Item {...formLayout} label="民族">
                    <Input type="text" placeholder="请输入" id='aabb' value={conditionInfo.NationInfo} ref='NationInfo'
                        maxLength="100" onChange={(e) => this.handleChangeInputText(e, 'NationInfo')} />
                </Form.Item>
                <Form.Item {...formLayout} label="地区">
                    <Input type="text" placeholder="请输入" value={conditionInfo.HouseholdRegister} maxLength="100"
                        onChange={(e) => this.handleChangeInputText(e, 'HouseholdRegister')} />
                </Form.Item>
                <Form.Item {...formLayout} label="听说读写26字母">
                    <div style={{ display: 'flex' }}>
                        <Radio.Group onChange={(e) => this.handleChangeRadioGroup(e, 'Characters')}
                            value={conditionInfo.Characters}>
                            <Radio value={2}>无规定</Radio>
                            <Radio value={0}>不会</Radio>
                            <Radio value={1}>会</Radio>
                        </Radio.Group>
                        <div style={{ display: 'flex' }}>
                            <label style={{ flex: '0 0 auto' }}>补充：</label>
                            <Input placeholder="请输入" value={conditionInfo.CharactersRemark} maxLength="100"
                                onChange={(e) => this.handleChangeInputText(e, 'CharactersRemark')} />
                        </div>
                    </div>
                </Form.Item>
                <Form.Item {...formLayout} label="简单加减乘除">
                    <div style={{ display: 'flex' }}>
                        <Radio.Group onChange={(e) => this.handleChangeRadioGroup(e, 'Math')}
                            value={conditionInfo.Math}>
                            <Radio value={2}>无规定</Radio>
                            <Radio value={0}>不会</Radio>
                            <Radio value={1}>会</Radio>
                        </Radio.Group>
                        <div style={{ display: 'flex' }}>
                            <label style={{ flex: '0 0 auto' }}>补充：</label>
                            <Input placeholder="请输入" value={conditionInfo.MathRemark} maxLength="100"
                                onChange={(e) => this.handleChangeInputText(e, 'MathRemark')} />
                        </div>
                    </div>
                </Form.Item>
                <Form.Item {...formLayout} label="是否考试">
                    <div style={{ display: 'flex' }}>
                        <Radio.Group onChange={(e) => this.handleChangeRadioGroup(e, 'Exam')}
                            value={conditionInfo.Exam}>
                            <Radio value={3}>无规定</Radio>
                            <Radio value={0}>不考试</Radio>
                            <Radio value={1}>简单考试</Radio>
                            <Radio value={2}>考试较难</Radio>
                        </Radio.Group>
                        <div style={{ display: 'flex' }}>
                            <label style={{ flex: '0 0 auto' }}>补充：</label>
                            <Input placeholder="请输入" value={conditionInfo.ExamRemark} maxLength="100"
                                onChange={(e) => this.handleChangeInputText(e, 'ExamRemark')} />
                        </div>
                    </div>
                </Form.Item>
                <Form.Item {...formLayout} label="是否查案底">
                    <Radio.Group onChange={(e) => this.handleChangeRadioGroup(e, 'CheckCriminal')}
                        value={conditionInfo.CheckCriminal}>
                        <Radio value={2}>无规定</Radio>
                        <Radio value={1}>不查案底</Radio>
                        <Radio value={0}>查案底</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...formLayout} label="人脸识别">
                    <Radio.Group onChange={(e) => this.handleChangeRadioGroup(e, 'FaceRecognition')}
                        value={conditionInfo.FaceRecognition}>
                        <Radio value={2}>无规定</Radio>
                        <Radio value={1}>有</Radio>
                        <Radio value={0}>无</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...formLayout} label="无尘服">
                    <Radio.Group onChange={(e) => this.handleChangeRadioGroup(e, 'Clothes')}
                        value={conditionInfo.Clothes}>
                        <Radio value={3}>无规定</Radio>
                        <Radio value={0}>看部门</Radio>
                        <Radio value={1}>穿</Radio>
                        <Radio value={2}>不穿</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...formLayout} label="体检">
                    <Radio.Group onChange={(e) => this.handleChangeRadioGroup(e, 'Physical')}
                        value={conditionInfo.Physical}>
                        <Radio value={2}>无规定</Radio>
                        <Radio value={0}>不需要</Radio>
                        <Radio value={1}>需要</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...formLayout} label="体内异物">
                    <Radio.Group onChange={(e) => this.handleChangeRadioGroup(e, 'ForeignBodies')}
                        value={conditionInfo.ForeignBodies}>
                        <Radio value={2}>无规定</Radio>
                        <Radio value={1}>查</Radio>
                        <Radio value={0}>不查</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item {...formLayout} label="身体状况">
                    <Input.TextArea placeholder="请输入" value={conditionInfo.Body}
                        autosize={{ minRows: 2, maxRows: 6 }} maxLength="500"
                        onChange={(e) => this.handleChangeInputText(e, 'Body')} />

                </Form.Item>
                <Form.Item {...formLayout} label="厂门口接站">
                    <div style={{ display: 'flex' }}>
                        <Input type="text" placeholder="请输入" value={conditionInfo.FactoryPickup} maxLength="100"
                            onChange={(e) => this.handleChangeInputText(e, 'FactoryPickup')} />
                        <Checkbox
                            onChange={this.handleCopyEnt}
                            style={{ flex: '0 1 150px', marginLeft: 8 }}>
                            复用企业地址
                        </Checkbox>
                    </div>
                </Form.Item>
                <Form.Item {...formLayout} label="备注（可选）">
                    <Input.TextArea placeholder="请输入" value={conditionInfo.Remark}
                        autosize={{ minRows: 2, maxRows: 6 }} maxLength="500"
                        onChange={(e) => this.handleChangeInputText(e, 'Remark')} />
                </Form.Item>
                <div style={{ display: "flex", position: "relative", left: "133px" }}>
                    {

                        <Checkbox.Group value={conditionInfo.TipsCheckboxs} onChange={(e) => this.handleChangeRadioGroup(e, 'TipsCheckboxs')}>
                            <Col><Checkbox value="A"><span><span style={{ color: "red" }}>面试前</span>温馨提示:</span></Checkbox></Col>
                        </Checkbox.Group>

                    }
                    <Form.Item style={{ width: "90%" }} {...formLayout}>
                        <Input.TextArea placeholder="请输入" value={conditionInfo.Tips}
                            autosize={{ minRows: 2, maxRows: 6 }} maxLength="300"
                            onChange={(e) => this.handleChangeInputText(e, 'Tips')} />
                        <div>（*注：该温馨提示打印在报名单，app不显示）</div>
                    </Form.Item>
                </div>

            </Form>
        );
    }
}

const WrappedCondition = Form.create()(Condition);

WrappedCondition.validate = (values) => {
    console.log(values);
    if (values.MaleMinAge > values.MaleMaxAge || values.FeMaleMinAge > values.FeMaleMaxAge) {
        return '最低年龄不能大于最高年龄';
    }
    if (values.WantNumber !== 0 && values.WantNumber !== '不限') {
        if (!/^\d+$/.test(values.WantNumber)) {
            return '请输入正确的名额';
        }
    }
    return false;
};

export default WrappedCondition;