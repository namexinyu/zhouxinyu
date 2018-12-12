import React from 'react';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import {Form, Row, Col, Button, Input, Select, Table, DatePicker} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

// 统一的体验中心选择下拉框
// param : {authHubID,fLayout,onChange}

export default class AuthorityHubSelect extends React.PureComponent {
    constructor(props) {
        super(props);
        this.authHubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList') || [];
        this.isManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;
        console.log('this.authHubList', this.authHubList);
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

    render() {
        if (!this.isManager) {
            return (<div className="display-none"></div>);
        }
        const fLayout = this.props.fLayout || {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        return (
            <Row gutter={15}>
                <Col className="gutter-row" span={this.props.span || 6}>
                    <FormItem {...fLayout} label="体验中心">
                        <Select value={this.props.authHubID + ''} onChange={(value) => this.props.onChange(value - 0)}>
                            <Option value="-9999">全部</Option>
                            {(this.authHubList || []).map((item, index) => {
                                return (<Option key={index} value={item.HubID + ''}>{item.HubName}</Option>);
                            })}
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        );
    }
}