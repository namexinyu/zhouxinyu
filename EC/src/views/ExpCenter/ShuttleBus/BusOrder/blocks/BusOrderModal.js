import React from 'react';
import { InputNumber, Col, Modal, Row, Select, Form, message, Table, Input } from 'antd';
import setParams from "ACTION/setParams";
import BusOrder from 'SERVICE/ExpCenter/BusOrder';
import Viewer from 'react-viewer';
const Option = Select.Option;
const { TextArea } = Input;
const STATE_NAME = "reducersBusOrder";
const columns = [{
        title: '序号',
        dataIndex: 'IDCardNum',
        className: "listpadding",
        render: (text, record, index) => <span>{(index + 1)}</span>
    },
    {
        title: '姓名',
        dataIndex: 'MemberName',
        className: "listpadding"
    }, {
        title: '身份证号',
        dataIndex: 'MemberIDCard',
        className: "listpadding",
        render: (text, record) => {
            const length = text.split("").length;
            if (length == 15) {
                const reg = new RegExp('(?<=^.{4}).{7}');
                return text.replace(reg, function(match) {
                    return new Array(match.length).join('*');
                });
            }else {
                const reg = new RegExp('(?<=^.{4}).{10}');
                return text.replace(reg, function(match) {
                    return new Array(match.length).join('*');
                });
            }
        }
    }, {
        title: '企业名称',
        dataIndex: 'MemberWhere',
        className: "listpadding"
    }, {
        title: '乘客类型',
        dataIndex: 'MemberType',
        className: "listpadding",
        render: (text, record, index) => <span>{text == 1 || text == 2 ? "会员" : "经纪人"}</span>
    }, {
        title: '操作人',
        dataIndex: 'EmployeeName',
        className: "listpadding"
    }, {
        title: '提交时间',
        dataIndex: 'CommitTime',
        className: "listpadding"
    }];
class BusOrderModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImagesVisible: false,
            previewImages: [],
            screenShotImgs: []
        };
    }
    handleOk = (e) => {
        if (this.props.list.DetailList.SettleStatus !== 1 && this.props.list.DetailList.BusOrderStatus == 3) {
            Modal.confirm({
                title: '提示',
                content: `是否保存当前修改？`,
                iconType: 'info-circle',
                onOk: () => {
                    this.props.form.validateFieldsAndScroll((errors, values) => {
                        if (errors) return;
                        let param = {BusOrderID: this.props.list.DetailList.BusOrderID, TypeKey: "web"};
                        if (values.ReceivableAmount) {
                            param.ReceivableAmount = (values.ReceivableAmount).FormatMoney({fixed: 2}) * 100;
                        }
                        if (values.ChargeFor !== "") {
                            param.ChargeFor = values.ChargeFor;
                        }
                        if (values.Remark.trim() !== "") {
                            param.Remark = values.Remark;
                        }
                        BusOrder.GetModifyBusOrder(param).then((data) => {
                            if (data.Code == 0) {
                                message.success("修改成功");
                                this.props.check();
                                setParams(STATE_NAME, {
                                    displayModal: false
                                });
                                this.props.form.resetFields();
                            } else {
                                message.error(data.Desc);
                            }
                        }).catch((data) => {
                            message.error(data.Desc);
                        });
                    });
                }
            });
        } else {
            setParams(STATE_NAME, {
                displayModal: false
            });
        }
    }

    handleCancel = (e) => {
        // 取消
        setParams(STATE_NAME, {
            displayModal: false
        });
        this.props.form.resetFields();
    }
    // 分页
    onChange = (page, pageSize) => {
        setParams(STATE_NAME, {
            DetailpageParam: {
                ...this.props.list.DetailpageParam,
                RecordIndex: page,
                RecordSize: pageSize
            }
        });
    };
    render () {
        const FormItem = Form.Item;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return(
            <div>
                <Modal 
                    width={800}
                    title= {"订单明细" }
                    visible= {this.props.list.displayModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <div style={{ background: 'white', padding: '10px 0 0px 25px' }}>
                        <Row gutter={24} className="translate">
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <span >日期: </span>
                                <span>{this.props.list.DetailList ? this.props.list.DetailList.CreateTime : ""}</span>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <span>始发地: </span>
                                <span>{this.props.list.DetailList ? this.props.list.DetailList.OriginDesc : ""}</span>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <span>目的地: </span>
                                <span>{this.props.list.DetailList ? this.props.list.DetailList.DestDesc : ""}</span>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <span>公里数: </span>
                                <span>{this.props.list.DetailList ? (this.props.list.DetailList.Kilometres ? this.props.list.DetailList.Kilometres : 0).FormatMoney({fixed: 2}) : ""}</span>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <span>租车公司: </span>
                                <span>{this.props.list.DetailList ? this.props.list.DetailList.RentCorpName : ""}</span>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <span>座位数: </span>
                                <span>{this.props.list.DetailList ? this.props.list.DetailList.BusType : ""}</span>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px', height: "31px", lineHeight: "31px" }}>
                                <span>实载人数: </span>
                                <span>{this.props.list.DetailList ? this.props.list.DetailList.GetOnCount : ""}</span>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <FormItem style={{margin: "0", padding: "0"}}>
                                <span>应付: ￥</span>
                                <span>{this.props.list.DetailList ? (this.props.list.DetailList.Amount / 100).FormatMoney({fixed: 2}) : ""}</span>
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <FormItem style={{margin: "0", padding: "0"}}>
                                    <span>应收: ￥</span>
                                    <span>
                                        {
                                            this.props.list.DetailList ? (this.props.list.DetailList.SettleStatus == 1 || this.props.list.DetailList.BusOrderStatus == 2 ? <span>
                                                {
                                                    this.props.list.DetailList.ReceivableAmount / 100
                                                }
                                            </span> : <span>
                                                {getFieldDecorator('ReceivableAmount', {
                                                    initialValue: ""
                                                })(<InputNumber min={0} max={999999.99} />)}
                                            </span>) : ""
                                        }
                                    </span>
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <FormItem style={{margin: "0", padding: "0"}}>
                                    <span>费用承担方: </span>
                                    {
                                        this.props.list.DetailList ? (this.props.list.DetailList.SettleStatus == 1 || this.props.list.DetailList.BusOrderStatus == 2 ? <span>
                                            {
                                                this.props.list.DetailList.ChargeFor == 1 ? "公司" : this.props.list.DetailList.ChargeFor == 2 ? "劳务" : ""
                                            }
                                        </span> : <span>
                                            {getFieldDecorator('ChargeFor', {
                                                    initialValue: ""
                                                })(<Select
                                                    style={{width: "100px", height: "18px"}}
                                                    size="default">
                                                    <Option value={0}>请选择</Option>
                                                    <Option value={1}>公司</Option>
                                                    <Option value={2}>劳务</Option>
                                                </Select>)}
                                        </span>) : ""
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <span>订单状态: </span>
                                <span>{this.props.list.DetailList ? (this.props.list.DetailList.BusOrderStatus == 1 ? "未发车" : this.props.list.DetailList.BusOrderStatus == 2 ? "已发车" : "已完成") : ""}</span>
                            </Col>
                            <Col span={8} style={{ marginBottom: '5px' }}>
                                <span>司机电话: </span>
                                <span>{this.props.list.DetailList ? this.props.list.DetailList.DriverMobile : ""}</span>
                            </Col>
                        </Row>
                        {/* <Row gutter={24}>
                            <Col span={24}>
                                <span style={{ float: 'left' }}> 牌照: {this.props.list.DetailList ? this.props.list.DetailList.BusNumber : ""}</span>
                                {
                                   this.props.list.DetailList.BusPicPath && <span style={{ width: "150px", height: "150px", float: 'left', marginLeft: "10px" }} >
                                        <img src={this.props.list.DetailList ? ("http://woda-app-public-test.oss-cn-shanghai.aliyuncs.com/" + this.props.list.DetailList.BusPicPath) : ""} style={{ width: "100%", height: "100%" }} />
                                    </span>
                                }
                            </Col>
                        </Row> */}
                        <Row gutter={24}>
                            <Col span={24} >
                                <Form>
                                    <FormItem style={{marginBottom: "15px"}} label="备注">
                                        {
                                            this.props.list.DetailList ? (this.props.list.DetailList.SettleStatus == 1 || this.props.list.DetailList.BusOrderStatus == 2 ? <span>
                                                {
                                                    this.props.list.DetailList.Remark
                                                }
                                            </span> : <span>
                                                {getFieldDecorator("Remark", {
                                                        initialValue: ''
                                                    })(<TextArea style={{height: "80px"}} placeholder="请写备注" rows={4} maxLength="200" />)}
                                            </span>) : ""
                                        } 
                                    </FormItem>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                    <Row style={{ background: 'white', paddingBottom: '10px' }}>
                        <Col span={24}>
                            <div style={{ background: '#108ee9', padding: '10px 0 10px 10px' }}>
                            乘客详情
                            </div>
                        </Col>
                        <Col span={24} style={{background: 'white', padding: "10px 0 10px 25px" }}>
                            <Table
                                bordered
                                rowKey={(text, record, index) => index}
                                columns={columns}
                                dataSource={this.props.list.DetailList.BusPassList}
                                pagination = {{
                                    showQuickJumper: true,
                                    showSizeChanger: true,
                                    current: this.props.list.DetailpageParam.RecordIndex,
                                    pageSize: this.props.list.DetailpageParam.RecordSize,
                                    total: this.props.list.DetailRecordCount,
                                    pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
                                    showTotal: (total, range) => {
                                        return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                    },
                                    onChange: (page, pageSize) => this.onChange(page, pageSize),
                                    onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize)}}/>
                        </Col>
                    </Row>
                </Modal>
                <Viewer
                    visible={this.state.previewImagesVisible}
                    drag={false}
                    zoomable={false}
                    rotatable={false}
                    scalable={false}
                    noImgDetails={true}
                    attribute={false}
                    noNavbar={true}
                    onClose={() => { this.setState({ previewImagesVisible: false }); }}
                    images={this.state.previewImages}/>
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
        const {
            ReceivableAmount,
            ChargeFor,
            Remark
        } = props.list.queryParams;
        return {
            ReceivableAmount,
            ChargeFor,
            Remark
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, props.list.queryParams, fields)
        });
    }
})(BusOrderModal);