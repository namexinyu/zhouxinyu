import React from 'react';
import {Card, Row, Col, Button, message} from 'antd';

export default class extends React.Component {

    componentDidMount() {

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>工牌审核({this.props.unAuditCount || 0}个未审核)</h1>
                </div>
                <Card bordered={false}>
                    <Row type="flex" justify="space-around" align="middle" className="mt-8" gutter={40}>
                        <Col span={12} className="text-center" style={{ height: '400px' }}>
                            <ImageShow
                                url={this.props.examplePic} desc="工牌样例" />
                        </Col>
                        <Col span={12} className="text-center" style={{ height: '400px' }}>
                            <ImageShow
                                url={this.props.cardPic} />
                        </Col>
                    </Row>
                    {!this.state.successVisiable && <Row className="mt-16" gutter={40}>
                        <Form>
                            <Col span={12} offset={6}>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="工厂名称">
                                        {this.props.auditWorkerInfo.EntName}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="姓名">
                                        {this.props.auditWorkerInfo.UserName}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="面试日期">
                                        {this.props.auditWorkerInfo.InterviewDate}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="工号">
                                        {getFieldDecorator('workerId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '工号必填'
                                                }
                                            ]
                                        })(<Input type="text" placeholder="请输入工号" />)}
                                    </FormItem>
                                </Col>
                            </Col>
                        </Form>
                    </Row>}
                    {this.state.successVisiable && <Row className="mt-16" gutter={40}>
                        <Form>
                            <Col span={24} className="mb-8">
                                <p className="font-16 color-danger text-center">请核对工牌信息</p>
                            </Col>
                            <Col span={12} offset={6}>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="工厂名称">
                                        {this.props.auditWorkerInfo.EntName}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="姓名">
                                        {this.props.auditWorkerInfo.UserName}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="面试日期">
                                        {this.props.auditWorkerInfo.InterviewDate}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="工号">
                                        {getFieldDecorator('r_workerId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '工号必填'
                                                }
                                            ]
                                        })(<Input type="text" placeholder="请输入工号" />)}
                                    </FormItem>
                                </Col>
                            </Col>
                        </Form>
                    </Row>}
                    {!this.state.successVisiable && <Row className="mt-16 text-center">
                        <Button type="danger" htmlType="button" onClick={this.handleNoPass.bind(this)}>不通过</Button>
                        <Button type="primary" htmlType="button" className="ml-8" onClick={this.handlePass.bind(this)}>通过</Button>
                    </Row>}
                    {this.state.successVisiable && <Row className="mt-16 text-center">
                        <Button type="danger" htmlType="button" onClick={this.handleReEdit.bind(this)}>返回重新编辑</Button>
                        <Button type="primary" htmlType="button" className="ml-8" onClick={this.handleConfirmPass.bind(this)}>确定</Button>
                    </Row>}
                </Card>
                <Modal
                    title="审核不通过"
                    visible={this.state.failedVisiable}
                    onOk={this.handleFailedOk.bind(this)}
                    onCancel={this.handleFailedCancel.bind(this)}
                >
                    <Row>
                        <Col span={24}>
                            <FormItem {...{
                                labelCol: { span: 6 },
                                wrapperCol: { span: 18 }
                            }} label="不通过原因">
                                {getFieldDecorator('noPassReason', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '不通过原因必填'
                                        }
                                    ]
                                })(<Select placeholder="请选择不通过原因" className="w-100" allowClear={true}>
                                    <Option value="1">不清晰</Option>
                                    <Option value="2">不是工牌照片</Option>
                                    <Option value="3">不是本人工牌</Option>
                                    <Option value="4">不是该工种工牌</Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row>

                </Modal>
            </div >
        );
    }
}