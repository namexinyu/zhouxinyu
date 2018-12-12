import React from 'react';
import { Row, Col, Form, Input } from 'antd';
const FormItem = Form.Item;
class BlockInfo extends React.PureComponent {
    render() {
        let userInfo = this.props.userInfo;
        return (
            <div>
                <Row style={{ background: '#fff', padding: '10px' }}>
                    <Col span={3}>
                        <FormItem label="备注名" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Input type="text" readOnly value={userInfo.CallName} />
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem label="QQ" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Input type="text" readOnly value={userInfo.QQ} />
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem label="微信" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Input type="text" readOnly value={userInfo.WeChat} />
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem label="性别" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Input type="text" readOnly value={userInfo.Gender === 1 ? '男' : (userInfo.Gender === 2 ? '女' : '未知')} />
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem label="年龄" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Input type="text" readOnly value={userInfo.Age} />
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem label="户籍" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            {userInfo.IDAddress ? (userInfo.IDAddress.split('市')[0].length > userInfo.IDAddress.split('县')[0].length ? userInfo.IDAddress.split('县')[0] + '县' : userInfo.IDAddress.split('市')[0]) + '市' : '-'}
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem label="推荐人" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <span className="color-primary">{userInfo.InviteName || '-'}</span>
                            <span>{userInfo.InvitePhone || ''}</span>
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BlockInfo;