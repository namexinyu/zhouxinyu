import {
    Form,
    Input,
    Select,
    DatePicker,
    message,
    Tooltip,
    Modal
} from 'antd';
import React from 'react';
import moment from 'moment';
import CommonAction from 'ACTION/Business/Common';
import setParams from "ACTION/setParams";
import BusinessAffairsitem from 'SERVICE/Business/ResettlementScheme/index';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const {
    getLaborSimpleList,
    getRecruitSimpleList
} = CommonAction;
const STATE_NAME = "BusinessAffairs";
const text = "添加劳务时，请确认该劳务有生效订单";
class BusinessAffairsModal extends React.PureComponent {
    constructor(props) {      
        super(props);
        this.state = {
            RecruitDate: "",
            RecruitTmpID: ""
        };
    }
    onSelect = (value) => {
       if (this.state.RecruitDate) {
        BusinessAffairsitem.GetLaborListAndRemainNumber({
            RecruitDate: this.state.RecruitDate.format("YYYY-MM-DD"),
            RecruitTmpID: value
        }).then((Data) => {
            if (!Data.Data.RecordList) {
                this.props.add({RemainNumber: Data.Data.RemainNumber});
                setParams(STATE_NAME, {
                    SubsidyList: [{add: 1}]
                });
            } else {
                setParams(STATE_NAME, {
                    SubsidyList: Data.Data.RecordList
                });
                this.props.add({RemainNumber: Data.Data.RemainNumber});
            }
        }).catch((err) => {
            message.error(err.Desc);
        });
       } else {
           this.setState({
                RecruitTmpID: value
           });
       }
    }
    RecruitDate = (value) => {
        if (this.state.RecruitTmpID) {
            BusinessAffairsitem.GetLaborListAndRemainNumber({
                RecruitDate: value.format("YYYY-MM-DD"),
                RecruitTmpID: this.state.RecruitTmpID
            }).then((Data) => {
                if (!Data.Data.RecordList) {
                    setParams(STATE_NAME, {
                        SubsidyList: [{add: 1}]
                    });
                    this.props.add({RemainNumber: Data.Data.RemainNumber});
                } else {
                    setParams(STATE_NAME, {
                        SubsidyList: Data.Data.RecordList
                    });
                    this.props.add({ RemainNumber: Data.Data.RemainNumber});
                }
            }).catch((err) => {
                message.error(err.Desc);
            });
        } else {
            this.setState({
                RecruitDate: value
            });
        }
    }
    add = () => {
        let SubsidyList = this.props.SubsidyList;
        SubsidyList.push({
            add: 1
        });
        setParams(STATE_NAME, {
            SubsidyList: SubsidyList
        });
    }
    Delete = (index, item) => {
        if (item.add || !item.LaborSubsidyList || item.LaborSubsidyList.length < 1) {
            let list = this.props.SubsidyList;
            list.splice(index, 1);
            setParams(STATE_NAME, {
                SubsidyList: list
            });
           
        } else {
            message.error("该报价处于生效状态");
        }
    }
    BusinessAffairsModal = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            let { AllotType, HubID, RecruitDate, RecruitTmpID } = fieldsValue;
            let params = {AddOrModify: this.props.type};
            if (AllotType) {
                params.AllotType = AllotType;
            }
            if (HubID) {
                params.HubID = HubID;
            } else {
                params.HubID = 0;
            }
            if (RecruitDate) {
                params.RecruitDate = RecruitDate.format("YYYY-MM-DD");
            }
            if (RecruitTmpID) {
                params.RecruitTmpID = RecruitTmpID;
            }
            if (this.props.SubsidyList.length > 0) {
                params.LaborAllotList = this.props.SubsidyList;
            }
            BusinessAffairsitem.SaveHubRecAllot(params).then((date) => {
                if (date.Code == 0) {
                    if (this.props.type == 1) {
                        message.success("保存成功");
                    } else {
                        message.success("编辑成功");
                    }
                    this.props.onChange();
                    this.props.gitmodalVisible(); 
                    this.props.form.resetFields();
                }
            }).catch((err) => {
                message.error(err.Desc);
            });            
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const fLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const SubsidyList = this.props.SubsidyList;
        return (
            <div className="recruitment-info-view">
                <Modal
                    title={this.props.type == 1 ? "新增" : "编辑"}
                    centered
                    width={"50%"}
                    visible={this.props.modalVisible}
                    onOk={() => this.BusinessAffairsModal()}
                    onCancel={() => {this.props.gitmodalVisible(); this.props.form.resetFields(); this.setState({RecruitDate: "", RecruitTmpID: ""});}}>
                    <Form>
                        <div style={{display: "flex"}}>
                            <FormItem style={{width: "40%", marginBottom: "10px"}} {...fLayout} label="生效日期：">
                                    {getFieldDecorator("RecruitDate", {
                                        initialValue: this.props.RecruitDate ? moment(this.props.RecruitDate) : "",
                                        rules: [{
                                            required: true,
                                            message: '请选择生效日期'
                                        }]
                                    })(
                                        <DatePicker disabled={this.props.type == 2 ? true : false} onChange={(e) => this.RecruitDate(e)} />  
                                    )}
                            </FormItem>
                            <FormItem style={{width: "40%", marginBottom: "10px"}} {...fLayout} label="集散门店：">
                                {getFieldDecorator("HubID", {
                                    initialValue: this.props.HubID || ""
                                })(<Select
                                        filterOption={this._filterOption}
                                        showSearch={true}
                                        allowClear={true}
                                        disabled={this.props.type == 2 ? true : false}
                                        style={{ width: 120 }}
                                        placeholder='请选择集散门店' >
                                        {(this.props.StoreList.StoreList || []).map((item, i) => {
                                                return (
                                                    <Option key={item.HubID + ""}
                                                    value={item.HubID}>{item.HubName}</Option>
                                                );
                                        })}
                                    </Select>)}
                            </FormItem>
                            <FormItem style={{width: "40%", marginBottom: "10px"}} {...fLayout} label="">
                            </FormItem>
                        </div>
                        <div style={{display: "flex"}}>
                            <FormItem style={{width: "40%", marginBottom: "10px"}} {...fLayout} label="企业：">
                                {getFieldDecorator("RecruitTmpID", {
                                    initialValue: this.props.RecruitTmpID || "",
                                    rules: [{
                                        required: true,
                                        message: '请选择企业'
                                    }]
                                })(<Select
                                        disabled={this.props.type == 2 ? true : false}
                                        style={{ width: 120 }}
                                        onSelect={(value) => this.onSelect(value)}
                                        placeholder='请选择企业' >
                                        {(this.props.common.RecruitSimpleList || []).map((item, i) => {
                                            return (
                                            <Option key={item.RecruitTmpID}
                                                value={item.RecruitTmpID}>{item.RecruitName}</Option>
                                            );
                                        })}
                                    </Select>)}
                            </FormItem>
                            <FormItem style={{width: "40%", marginBottom: "10px"}} {...fLayout} label="分配方式：">
                                {getFieldDecorator("AllotType", {
                                    initialValue: this.props.RemainNumber == -1 ? 2 : 1,
                                    rules: [{
                                        required: true,
                                        message: '请选择分配方式'
                                    }]
                                })(<Select
                                        style={{ width: 120 }}
                                        placeholder='请选择分配方式'>
                                        <Option value={1}>按名额</Option>
                                        <Option value={2}>按比例</Option>
                                    </Select>)}
                            </FormItem>
                            <FormItem style={{width: "40%", marginBottom: "10px"}} {...fLayout} label="名额：">
                               <span>{this.props.RemainNumber == -1 ? "不限" : this.props.RemainNumber}</span>
                            </FormItem>
                        </div>
                        <div>
                            {(SubsidyList || []).map((item, index) => {
                                return <div key={index} style={{ marginBottom: "15px", display: "flex", padding: "0 40px"}}>
                                <div style={{flex: "1", lineHeight: "30px"}}>
                                    <span>劳务公司：</span>
                                    {item.add ? <Select
                                        onSelect={(value) => this.props.ThroughFormValuesChange(value, "LaborID", index)}
                                        style={{ width: 120}}
                                        placeholder='请选择劳务公司'>
                                        {(this.props.common.LaborSimpleList || []).map((item, i) => {
                                            return (
                                                <Option key={item.LaborID}
                                                value={item.LaborID}>{item.ShortName}</Option>
                                            );
                                        })}
                                    </Select> : <span>{item.LaborName}</span>}
                                </div>
                                <div style={{flex: "1", display: "flex", alignItems: "center"}}>
                                    <span>
                                        劳务报价：
                                    </span>
                                    {item.add ? <TextArea maxLength={"120"} style={{flex: "1", height: "30px"}} /> : <span>
                                        {(item.LaborSubsidyList || []).map((record) => {
                                            return <p>
                                                {
                                                    `${record.Gender == 1 ? "男" : record.Gender == 2 ? "女" : "男女不限"}:${record.SubsidyDay || ""}天返${record.SubsidyAmount || ""}元`
                                                }
                                            </p>;
                                        })}
                                    </span>}
                                </div>
                               <div style={{display: "flex", flex: "2", alignItems: "center"}}>
                                   <span style={{marginLeft: "20px"}}>
                                       分配比例：
                                   </span>
                                   <Input min={0} max={10000} type="number" defaultValue={item.NumberOrPer} onChange={(e) => this.props.ThroughFormValuesChange(e, "NumberOrPer", index)} style={{width: "50px"}} />
                                   <span>
                                       %（人）
                                   </span>
                                   <a onClick={() => this.Delete(index, item)} style={{color: "red", marginRight: "20px"}}>
                                       删除
                                   </a>
                                   {SubsidyList.length - 1 == index && <a>
                                        <Tooltip onClick={() => this.add()} placement="topLeft" title={text}>
                                            添加
                                        </Tooltip>
                                    </a>}
                               </div>
                           </div>;
                            })}
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create({})(BusinessAffairsModal);
