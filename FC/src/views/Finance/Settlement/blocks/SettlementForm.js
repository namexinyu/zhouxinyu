import React from 'react';
import {
    Form,
    Row,
    Col,
    Button,
    Checkbox,
    Input,
    Cascader,
    Select,
    Icon,
    DatePicker,
    message,
    Radio,
    InputNumber
} from 'antd';
import setParams from "ACTION/setParams";
import Mapping_MAMS_Recruitment, {
    getEnum,
    Mapping_MAMS_Recruit_User
} from 'CONFIG/EnumerateLib/Mapping_MAMS_Recruitment';
import resetQueryParams from "ACTION/resetQueryParams";
import {CurrentPlatformCode} from "CONFIG/mamsConfig";
import Settlement from 'ACTION/Finance/Settlement/Settlement';
import {CONFIG, UTIL} from 'mams-com';
const Option = Select.Option;
import moment from 'moment';
const regexRule = UTIL.Constant.RegexRule;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const STATE_NAME = "SettlementForm";
class SettlementForm extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            add: "1"
        };
    }
    _filterOption = (input, option) => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    check = () => {
        let { large, ShortName, PositionName, CheckInTimeBegin, CheckInTimeEnd, type, CheckInTimeEnds, CheckInTimeBegins} = this.props.queryParams;
        let { pageSize, page} = this.props.SettlementForm;
        let params = {};
        params.RecordIndex = 0;
        params.RecordSize = 10;
        setParams(STATE_NAME, {
            pageSize: 10,
            page: 1
        });
        if (large.value == "1") {
            let HM = moment().format("YYYY:MM");
            let MM = HM.split(":")[1];
            let CheckInTimeEnd = moment().format("YYYY") + "-" + (MM * 1 + 1) + "-01";
            params.CheckInTimeBegin = moment().format("YYYY-MM") + "-01";
            params.CheckInTimeEnd = CheckInTimeEnd;
        } else if (large.value == "3") {
            let item = CheckInTimeEnds.value;
            if (type.value == "1") {
                params.CheckInTimeBegin = item + "-01-01";
                params.CheckInTimeEnd = item + "-04-01";
            } else if (type.value == "2") {
                params.CheckInTimeBegin = item + "-04-01";
                params.CheckInTimeEnd = item + "-07-01";
            } else if (type.value == "3") {
                params.CheckInTimeBegin = item + "-07-01";
                params.CheckInTimeEnd = item + "-10-01";
            } else if (type.value == "4") {
                params.CheckInTimeBegin = item + "-10-01";
                params.CheckInTimeEnd = item + "-12-31";
            } else {
                let HM = moment().format("YYYY:MM");
                let MM = HM.split(":")[1];
                let CheckInTimeEnd = CheckInTimeEnds.value + "-" + (MM * 1 + 1) + "-01";
                params.CheckInTimeBegin = moment().format("YYYY-MM") + "-01";
                params.CheckInTimeEnd = CheckInTimeEnd;
            }
        } else if (large.value == "2") {
            if (CheckInTimeBegin.value && CheckInTimeEnd.value) {
                params.CheckInTimeBegin = CheckInTimeBegin.value.format("YYYY-MM") + "-01";
                params.CheckInTimeEnd = CheckInTimeEnd.value.format("YYYY-MM") + "-30";
            }
        } else if (large.value == "4" && CheckInTimeBegins.value) {
            params.CheckInTimeBegin = CheckInTimeBegins.value + "-01-01";
            params.CheckInTimeEnd = CheckInTimeBegins.value + "-12-30";
        }
        if (ShortName.value) {
            params.ShortName = ShortName.value;
        }
        if (PositionName.value) {
            params.PositionName = PositionName.value;
        }
        Settlement.getSettlementReport(params);
    }
    handleFormReset = () =>{
        setParams(STATE_NAME, {
            queryParams: {
                large: {
                    value: "1"
                },
                ShortName: {
                    value: ""
                },
                LaborID: {
                    value: ""
                },
                CheckInTimeBegin: {
                    value: moment()
                },
                CheckInTimeEnd: {
                    value: moment()
                },
                type: {
                    value: "1"
                },
                CheckInTimeBegins: {
                    value: moment().format("YYYY")
                }, 
                CheckInTimeEnds: {
                    value: 2018
                }
            }
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const fLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const fLayout2 = {
            labelCol: {span: 6},
            wrapperCol: {span: 17}
        };
        const {MonthPicker} = DatePicker;
        let item = [];
        for (let i = 0; i < 30; i++) {
            item.push(2010 + i);
        }
        return (
            <Form>
                <Row gutter={32}>
                    <Col>
                    <FormItem {...fLayout}>
                        {getFieldDecorator("large")(
                            <Radio.Group>
                                <Radio.Button value="1">本月</Radio.Button>
                                <Radio.Button value="2">月报</Radio.Button>
                                <Radio.Button value="3">季报</Radio.Button>
                                <Radio.Button value="4">年报</Radio.Button>
                            </Radio.Group>
                        )}
                    </FormItem>
                   
                    </Col>
                    <Col span={5}>
                        <FormItem {...fLayout} label="企业：">
                            {getFieldDecorator("PositionName")(
                                <Select
                                allowClear={true}
                                filterOption={this._filterOption}
                                showSearch={true}
                                style={{ width: 120 }}
                                placeholder='请选择企业'
                              >
                                {
                                  (this.props.common.RecruitSimpleList || []).map((item, i) => {
                                    return (
                                      <Option key={i}
                                        value={item.RecruitName.toString()}>{item.RecruitName}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...fLayout} label="劳务公司：">
                            {getFieldDecorator("ShortName")(
                                    <Select
                                        filterOption={this._filterOption}
                                        showSearch={true}
                                        allowClear={true}
                                        style={{ width: 120 }}
                                        placeholder='请选择劳务公司'
                                      >
                                        {
                                          (this.props.common.LaborSimpleList || []).map((item, i) => {
                                            return (
                                              <Option key={i}
                                                value={item.ShortName}>{item.ShortName}</Option>
                                            );
                                          })
                                        }
                                      </Select>
                            )}
                        </FormItem>
                    </Col>
                    {
                        this.props.queryParams.large.value == 3 ? <Col span={8}>
                         <FormItem {...fLayout} label="季度">
                            {getFieldDecorator("CheckInTimeEnds")(
                                <Select
                                    style={{ width: 120 }}
                                    filterOption={this._filterOption}
                                    showSearch={true}
                                    size="large"
                                    placeholder='请选择季度'>
                                    {
                                       item.map((item, i) => {
                                        return <Option key={item} value={item}>{item + ""}</Option>;
                                       }) 
                                    }
                                </Select> 
                            )}
                            {getFieldDecorator("type")(
                                <Select
                                    style={{ width: 120 }}
                                    filterOption={this._filterOption}
                                    showSearch={true}
                                    placeholder='请选择季度'>
                                    <Option value= "1">第一季度</Option>
                                    <Option value= "2">第二季度</Option>
                                    <Option value= "3">第三季度</Option>
                                    <Option value= "4">第四季度</Option>
                                </Select> 
                            )}
                        </FormItem>
                      </Col> : this.props.queryParams.large.value == 2 ? <Col span={8}>
                            <FormItem {...fLayout} label="月报：">
                                {getFieldDecorator("CheckInTimeBegin")(
                                    <MonthPicker format={"YYYY:MM"} />
                                )}-
                                {getFieldDecorator("CheckInTimeEnd")(
                                <MonthPicker format={"YYYY:MM"} />
                                )}
                            </FormItem>
                        </Col> : this.props.queryParams.large.value == 4 ? <Col span={8}>
                            <FormItem {...fLayout} label="年报：">
                                {getFieldDecorator("CheckInTimeBegins")(
                                <Select
                                    filterOption={this._filterOption}
                                    style={{ width: 120 }}
                                    showSearch={true}
                                    size="large"
                                    dropdownStyle={{with: "20px"}}
                                    placeholder='请选择季度'>
                                   {
                                       item.map((item) => {
                                        return <Option key={item} value={item}>{item + ""}</Option>;
                                       })
                                   }
                                </Select> 
                                )}
                            </FormItem>
                        </Col> : ""
                    }
                    
                    <Col className="mb-16 text-right" offset={5}>
                        <Button onClick={this.handleFormReset}>重置</Button>
                        <Button className="ml-8" type="primary" htmlType="submit" onClick={this.check} >查询</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
      const {
        large,
        ShortName,
        PositionName,
        CheckInTimeBegin,
        CheckInTimeEnd,
        type,
        CheckInTimeEnds,
        CheckInTimeBegins
      } = props.queryParams;
  
      return {
        large,
        ShortName,
        PositionName,
        CheckInTimeBegin,
        CheckInTimeEnd,
        type,
        CheckInTimeEnds,
        CheckInTimeBegins
      };
    },
    onFieldsChange(props, fields) {
      setParams(STATE_NAME, {
        queryParams: Object.assign({}, props.queryParams, fields)
      });
    }
  })(SettlementForm);