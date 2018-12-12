import React from 'react';
import {Form, Row, Col, Card, Input, InputNumber, Checkbox} from 'antd';
import 'ASSET/less/Business/ent/ent-form.less';

const formItemLayout1 = {labelCol: {span: 1}, wrapperCol: {span: 23}};
const formItemLayout2 = {labelCol: {span: 2}, wrapperCol: {span: 16}};
const formItemLayout4 = {labelCol: {span: 4}, wrapperCol: {span: 19}};
const formItemLayout10 = {labelCol: {span: 10}, wrapperCol: {span: 14}};

const RecruitInfos = {
    Info_1: {
        title: '工资说明',
        structure: {
            RecruitInfo_1: {
                titleLabel: '基本情况',
                structure: {
                    Basic_1: {label: '发薪日', maxLength: '300'},
                    Basic_2: {label: '底薪', maxLength: '300'},
                    Basic_3: {label: '薪资结构', type: 'area', maxLength: '300'}
                }
            },
            RecruitInfo_2: {
                titleLabel: '食宿介绍',
                structure: {
                    RoomBoardInfo_1: {label: '伙食', maxLength: '300'},
                    RoomBoardInfo_2: {label: '住宿', maxLength: '300'},
                    RoomBoardInfo_3: {label: '交通', maxLength: '300'}
                }
            },
            RecruitInfo_3: {
                titleLabel: '合同介绍',
                structure: {
                    contract_1: {label: '合同说明', maxLength: '300'},
                    contract_2: {label: '工资发放', maxLength: '300'},
                    contract_3: {label: '保险说明', maxLength: '300'}
                }
            }
        }
    },
    Info_2: {
        title: '岗位状态',
        structure: {
            JobRequire_1: {label: '工作内容', maxLength: '300'},
            JobRequire_2: {label: '工时说明', maxLength: '300'},
            JobRequire_3: {label: '工作环境', maxLength: '300'}
        }
    }
};

function expansion(infoObj) {
    return Object.entries(infoObj).reduce((pre, cur) => {
        let key = cur[0];
        let value = cur[1];

        if (value.structure) {
            let expansions = expansion(value.structure);
            pre = {...pre, ...expansions};
        } else {
            pre[value.label] = key;
        }
        return pre;
    }, {});
}

let RecruitInfoMap = expansion(RecruitInfos);
export {RecruitInfoMap};

function expansionView(infoObj, render) {

    return Object.entries(infoObj).reduce((pre, cur) => {
        let key = cur[0];
        let value = cur[1];

        if (value.title) {
            pre.push(<Card title={value.title} key={key}>
                {expansionView(value.structure, render)}
            </Card>);
        } else if (value.titleLabel) {
            pre.push(
                <div key={key}>
                    <div style={{fontWeight: 700, color: '#333', marginBottom: 8}}>[{value.titleLabel}]</div>
                    {expansionView(value.structure, render)}
                </div>
            );
        } else {
            const component = value.type === 'area' ?
                <Input.TextArea style={{width: '100%'}} maxLength={value.maxLength}/> :
                <Input style={{width: '100%'}} maxLength={value.maxLength}/>;
            pre.push(
                <Form.Item {...formItemLayout2} label={value.label} key={key}>
                    {render(key, component)}
                </Form.Item>
            );
        }
        return pre;
    }, []);
}

let RecruitInfo = Form.create({
    mapPropsToFields: props => ({...props.params}),
    onFieldsChange: (props, fields) => props.setParams(fields)
})(({form}) => {
    const {getFieldDecorator} = form;

    return (
        <Form className='ent-form'>
            {expansionView(RecruitInfos, (key, component) => (getFieldDecorator('RecruitInfos_' + key, {initialValue: ''})(component)))}
            <Card title='其他信息' className='mt-8'>
                <Form.Item {...formItemLayout2} label='体检说明'>
                    {getFieldDecorator('HealthRemark', {
                        initialValue: ''
                    })(<Input style={{width: '100%'}} maxLength="150"/>)}
                </Form.Item>
                <Row>
                    <Col span={5}>
                        <Form.Item {...formItemLayout10} label="身份证复印件">
                            {getFieldDecorator('IDPhotoCopyCount', {initialValue: 0})(
                                <InputNumber style={{width: '100%'}} max={20} min={0}/>)}
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item {...formItemLayout1} label=" " colon={false}>
                            {getFieldDecorator('NeedIDPhoto', {initialValue: false, valuePropName: 'checked'})(
                                <Checkbox>扫描件</Checkbox>)}
                        </Form.Item>
                    </Col>

                    <Col span={5}>
                        <Form.Item {...formItemLayout10} label="毕业证复印件">
                            {getFieldDecorator('DiplomaCount', {initialValue: 0})(
                                <InputNumber style={{width: '100%'}} max={20} min={0}/>)}
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item {...formItemLayout1} label=" " colon={false}>
                            {getFieldDecorator('NeedDiploma', {initialValue: false, valuePropName: 'checked'})(
                                <Checkbox>原件</Checkbox>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item {...formItemLayout4} label="照片">
                            {getFieldDecorator('PhotoRemark', {initialValue: ''})(
                                <Input placeholder='请填写招聘要求' maxLength='100'/>
                            )}
                        </Form.Item>
                    </Col>

                </Row>
            </Card>
        </Form>
    );
});

RecruitInfo.obtainQueryParams = (values) => {
    values = {...values};
    let param = {};
    param.DiplomaCount = values.DiplomaCount;
    param.HealthRemark = values.HealthRemark;
    param.IDPhotoCopyCount = values.IDPhotoCopyCount;
    param.NeedDiploma = values.NeedDiploma === true ? 1 : 2;
    param.NeedIDPhoto = values.NeedIDPhoto === true ? 1 : 2;
    param.PhotoRemark = values.PhotoRemark;
    let JobRequireInfo = RecruitInfos.Info_2;

    let JobRequireInfoStr = {};
    JobRequireInfoStr.key = JobRequireInfo.title;
    JobRequireInfoStr.value = Object.entries(JobRequireInfo.structure).reduce((pre, cur) => {
        let key = cur[0];
        let label = cur[1].label;
        let value = values['RecruitInfos_' + key];
        pre.push({key: label, value: value});
        return pre;
    }, []);
    param.JobRequire = JSON.stringify([JobRequireInfoStr]);

    let RoomBoardInfo = RecruitInfos.Info_1.structure.RecruitInfo_2;
    let RoomBoardInfoStr = {};
    RoomBoardInfoStr.key = RoomBoardInfo.titleLabel;
    RoomBoardInfoStr.value = Object.entries(RoomBoardInfo.structure).reduce((pre, cur) => {
        let key = cur[0];
        let label = cur[1].label;
        let value = values['RecruitInfos_' + key];
        pre.push({key: label, value: value});
        return pre;
    }, []);
    param.RoomBoardInfo = JSON.stringify([RoomBoardInfoStr]);

    let Remuneration1 = RecruitInfos.Info_1.structure.RecruitInfo_1;
    let Remuneration1Str = {};
    Remuneration1Str.key = Remuneration1.titleLabel;
    Remuneration1Str.value = Object.entries(Remuneration1.structure).reduce((pre, cur) => {
        let key = cur[0];
        let label = cur[1].label;
        let value = values['RecruitInfos_' + key];
        pre.push({key: label, value: value});
        return pre;
    }, []);

    let Remuneration3 = RecruitInfos.Info_1.structure.RecruitInfo_3;
    let Remuneration3Str = {};
    Remuneration3Str.key = Remuneration3.titleLabel;
    Remuneration3Str.value = Object.entries(Remuneration3.structure).reduce((pre, cur) => {
        let key = cur[0];
        let label = cur[1].label;
        let value = values['RecruitInfos_' + key];
        pre.push({key: label, value: value});
        return pre;
    }, []);
    param.Remuneration = JSON.stringify([Remuneration1Str, Remuneration3Str]);
    return param;
};

export default RecruitInfo;