import React from 'react';
import {Row, Form, Input, Select, Button, Col, Icon, DatePicker, Switch, Table, Popconfirm, Radio, Modal } from 'antd';
import getPromotionDetail from 'ACTION/ExpCenter/PromotionDetail';
import {browserHistory} from 'react-router';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import setParams from 'ACTION/setParams';
import fun from "COMPONENT/DelEmpyParms";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const HubManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;
const STATE_NAME = 'state_ec_promotionDetail';
let isArray = fun.isArray;
let filterObject = fun.filterObject;
import moment from 'moment';
moment.locale('zh-cn');

// let titleList = [ // 虚拟搜索目录数据
//     {
//         name: "地推姓名",
//         value: "Name"
//     },
//     {
//         name: "地推手机号",
//         value: "Phone"
//     }
// ];
let columns = [{
    title: '日期', dataIndex: 'Date'
}, {
    title: '地推账号', dataIndex: 'Account'
}, {
    title: '体验中心', dataIndex: 'ReceAccount'
}, {
    title: '姓名', dataIndex: 'Name'
}, {
    title: '地推手机号', dataIndex: 'Phone'
}, {
    title: '身份证号', dataIndex: 'IDCardNum'
}, {
    title: '注册数量', dataIndex: 'RegisterCount'
}, {
    title: '已联系', dataIndex: 'ContactCount'
}, {
    title: 'QQ数量', dataIndex: 'QQCount'
}, {
    title: '微信数量', dataIndex: 'WeCharCount'
}, {
    title: '绩效', dataIndex: 'PerformanceAmount'
}].map((item) =>{
    item.render = (text, record) => {
        let dateResult = record[item.dataIndex];
        return (
            <div>
                {dateResult}
            </div>
        );
    };
    return item;
});

class AdvancedSearchForm extends React.Component { // 搜索部分表单

    constructor(props) {
        super(props);

        this.handleChangeStaple = this.handleChangeStaple.bind(this);
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(err);
            if (!err) {
              getPromotionDetail(filterObject(this.props.parms, true));
            }
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
        setParams(STATE_NAME, {parms: Object.assign({}, this.props.parms, {
            RecordIndex: 0,
            RecordSize: 2000,
            HubIDList: this.props.HubIDListALL,
            Date: getTime(0),
            strIDCardNum: '',
            ReceAccount: ''
        })});
    };
    handleChangeStaple(value) {
        setParams(STATE_NAME, {parms: Object.assign({}, this.props.parms, {HubIDList: value ? [Number(value)] : []})});
    }
    // To generate mock Form.Item
    getFields() {
        const { getFieldDecorator } = this.props.form;
        return(
            <Row>
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="地推账号">
                            {getFieldDecorator('ReceAccount')(
                                <Input style={{ height: 30 }} onChange={(e)=>{setParams(STATE_NAME, {parms: Object.assign({}, this.props.parms, {ReceAccount: e.target.value})});}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="姓名">
                            {getFieldDecorator('Name')(
                                <Input style={{ height: 30 }} onChange={(e)=>{setParams(STATE_NAME, {parms: Object.assign({}, this.props.parms, {Name: e.target.value})});}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="手机号">
                            {getFieldDecorator('Phone')(
                                <Input style={{ height: 30 }} onChange={(e)=>{setParams(STATE_NAME, {parms: Object.assign({}, this.props.parms, {Phone: e.target.value})});}}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="身份证号">
                            {getFieldDecorator('strIDCardNum')(
                                <Input style={{ height: 30 }} onChange={(e)=>{setParams(STATE_NAME, {parms: Object.assign({}, this.props.parms, {strIDCardNum: e.target.value})});}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="选择日期">
                            {getFieldDecorator('Date', {
                                initialValue: moment(getTime(0), 'YYYY-MM-DD'),
                                rules: [{
                                  required: true,
                                  message: '请选择日期'
                                }]
                              })(
                                <DatePicker style={{height: 30, width: "100%"}} onChange={(e, string)=>{setParams(STATE_NAME, {parms: Object.assign({}, this.props.parms, {Date: string})});}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="体验中心" style={{display: this.props.HubList.length > 1 ? "block" : "none"}}>
                            {getFieldDecorator('HubIDList')(
                                <Select
                                    placeholder="全部体验中心"
                                    size="large"
                                    onChange={this.handleChangeStaple}
                                >
                                    <Option value="">全部体验中心</Option>
                                    {
                                        (this.props.HubList || []).map((item, index)=>{
                                            return(
                                                <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Col span={24} style={{ textAlign: 'right', paddingRight: "10px" }}>
                    <Button onClick={this.handleReset}>
                        重置
                    </Button>
                    <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">搜索</Button>
                </Col>
            </Row>

        );
    }

    render() {
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={40}>{this.getFields()}</Row>
            </Form>
        );
    }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);





export default class PromotionDetail extends React.PureComponent { // 页面组件
    constructor(props) {
        super(props);

        this.priceAllocation = this.priceAllocation.bind(this);
    }
    componentWillMount() {
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        let Parms = {...this.props.parms};
        Parms.HubIDList = this.HubIDListALL;
        Parms.Date = getTime(0);
        getPromotionDetail(Parms);
        setParams(STATE_NAME, {parms: Object.assign({}, Parms)});
    }
    priceAllocation(url) {
        browserHistory.push({
            pathname: "/ec/main/" + url
        });
    }
    render() {
        for (let i = 0; i < this.props.RecommendList.length; i++) {
            for (let j = 0; j < this.HubList.length; j++) {
                if(this.props.RecommendList[i].HubID === this.HubList[j].HubID) {
                    this.props.RecommendList[i].ReceAccount = this.HubList[j].HubName;
                }
            }
            if(!this.props.RecommendList[i].ReceAccount) {
                this.props.RecommendList[i].ReceAccount = "该集散不存在！";
            }
        }
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">地推详情</div>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-2">
                            <WrappedAdvancedSearchForm parms={this.props.parms} HubList={this.HubList} HubIDListALL={this.HubIDListALL}/>
                            <Button style={{margin: "20px 10px 20px 0"}} onClick={()=>{this.priceAllocation("land-manage");}} type="primary" >地推账号管理</Button>
                            {HubManager ? <Button style={{margin: "20px 0"}} onClick={()=>{this.priceAllocation("price-allocation");}} type="primary" >地推价格配置</Button> : ""}
                            <Table loading={this.props.RecordListLoading} bordered dataSource={this.props.RecommendList} columns={columns} />
                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}
// 获取时间函数
function getTime(time) {
    let nowdate = new Date();
    nowdate.setDate(nowdate.getDate() + time);
    return nowdate.getFullYear() + "-" + changeNumStyle(+nowdate.getMonth() + 1) + "-" + changeNumStyle(nowdate.getDate());

}

// 给时间10一下前加0
function changeNumStyle(num) {
    return num <= 9 ? '0' + num : num;
}
