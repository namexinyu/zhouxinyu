import React from 'react';
import {Card, Row, Col, Button, Table, Form, Input, Icon, DatePicker, Popconfirm, message, Modal, Select} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import {browserHistory} from 'react-router';
import {CONFIG} from 'mams-com';
import eventarrange from "ACTION/Common/Management/eventarrange";
import eventarrangechange from "ACTION/Common/Management/eventarrangechange";
import EventService from 'SERVICE/Business/Management/eventmanagement';
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const DiplomatStatusMap = {
    1: '值班',
    2: '休假',
    3: '离职'
};
const STATE_NAME = 'state_broker_eventarrange';
 class Eventarrange extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_eventarrange';
        this.state = {
            flag: false,
            visible: false,
            QryDoc: [],
            EmployeeID: "",
            type: 0,
            EmployeeLoginName: "",
            EmployeeMobile: "",
            record: {},
            columns: [{
                title: '姓名',
                key: 'DiplomatName',
                width: '10%',
                render: (text, record) => <span>{record['DiplomatName']}</span>
              }, 
              {
                title: '用户名',
                key: 'DiplomatNick',
                width: '15%',
                render: (text, record) => <span>{record['DiplomatNick']}</span>
              }, 
              {
                title: '当前状态',
                key: 'DutyStatus',
                width: '10%',
                render: (text, record) => 
                <div>
                    <span style={record['DutyStatus'] == 1 ? {display: 'block', fontWeight: 600, fontSize: '16px'} : {display: 'none'}}>值班</span>
                    <span style={record['DutyStatus'] == 2 ? {display: 'block'} : {display: 'none'}}>休假</span>
                    <span style={record['DutyStatus'] == 3 ? {display: 'block'} : {display: 'none'}}>离职</span>
                </div>
              }, {
                title: "处理部门",
                key: "Department",
                width: "15%",
                render: (text, record) => <span>
                    {text.Department == 1 ? "业务客服" : text.Department == 2 ? "补贴/推荐费" : text.Department == 6 ? "薪资组" : "回访客服"}
                </span>
            }, {
                title: '操作',
                key: 'operation',
                width: '20%',
                render: (text, record) => 
                <div style={record['DutyStatus'] == 3 ? {display: 'none'} : {}}>
                    <span style={record['DutyStatus'] == 1 ? {display: 'none'} : {color: '#108ee9', marginRight: '10px', cursor: 'pointer'}} onClick={this.skip.bind(this, record, 1)}>值班</span>
                    <span style={record['DutyStatus'] == 2 ? {display: 'none'} : {color: '#108ee9', marginRight: '10px', cursor: 'pointer'}} onClick={this.skip.bind(this, record, 2)}>休假</span>
                    <span style={record['DutyStatus'] == 3 ? {display: 'none'} : {color: '#108ee9', marginRight: '10px', cursor: 'pointer'}} onClick={this.skip.bind(this, record, 3)}>离职</span>
                    <span style={{color: '#108ee9', marginRight: '10px', cursor: 'pointer'}} onClick={() => this.setState({record: record, visible: true, type: 1, EmployeeID: record.DiplomatID})} >修改</span>
                </div>
              }]
        };
    }
   
   skip=(record, status)=> {

    Modal.confirm({
        title: <div>确认执行<span style={{fontSize: '16px'}}>{DiplomatStatusMap[status]}</span>操作吗？</div>,
        content: '',
        onOk: () => {
            const {AppSessionStorage} = CONFIG;
            this.setState({
               flag: true
            });
            eventarrangechange({
                DiplomatID: record.DiplomatID,
                DealDiplomatID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                DutyStatus: status
            });
        }
    });
    
    }
    componentWillMount() {
        this.handleSearch();
    }

    componentWillReceiveProps(nextProps) {
            if(nextProps.list.eventarrangechangeFetch['status'] == 'success') {
               if(this.state.flag) {
                  message.success('提交成功！', 4);
                  this.handleSearch();
               }
               this.setState({
                flag: false
               });
            }else if(nextProps.list.eventarrangechangeFetch['status'] == 'error') {
                if(this.state.flag) {
                    message.error('提交失败！', 4);
                }
                this.setState({
                    flag: false
                });
            }
        }
        OnSearch = (e) => {
            EventService.GetEmployeeByName({EmployeeName: e, RecordIndex: 0, RecordSize: 9999}).then((data) => {
                this.setState({
                    QryDoc: data.Data.RecordList || [],
                    EmployeeID: "",
                    EmployeeLoginName: "",
                    EmployeeMobile: ""
                });
            });
        }
        handleSearch = () => {
            let param = this.handleSearchParams();
            console.log(param, "eeeeeeeeeeeeee");
            eventarrange(param);
            setParams(STATE_NAME, {
                pageQueryParams: {
                    ...this.props.list.pageQueryParams,
                    ...{
                        currentPage: 1,
                        pageSize: 10
                    }
                }
            });
        }
        handleSearchParams = () => {
            const {DiplomatName, DiplomatNick, Depart} = this.props.list["pageQueryParams"];
            let param = {};
            param.DiplomatName = DiplomatName.value || "";
            param.DiplomatNick = DiplomatNick.value || "";
            param.Department = Depart.value * 1 || 0;
            param.RecordIndex = 0;
            param.RecordSize = 10;
            return param;
        }
        handleSearchList = (item, value) => {
            this.setState({
                EmployeeID: value.props.EmployeeID,
                EmployeeLoginName: value.props.EmployeeLoginName,
                EmployeeMobile: value.props.EmployeeMobile
            });
        }
        handleOnCancel = () => {
            this.setState({visible: false, QryDoc: [], record: "", type: 0, EmployeeLoginName: "", EmployeeMobile: ""});
            this.props.form.resetFields();
        }
        handleReset = () => {
            this.props.form.resetFields();
            this.setState({
                EmployeeID: "",
                EmployeeLoginName: "",
                EmployeeMobile: "",
                visible: false
            });
        }
        onChange = (page, pageSize) => {
            setParams(STATE_NAME, {
                pageQueryParams: {
                    ...this.props.list.pageQueryParams,
                    ...{
                        currentPage: page,
                        pageSize: pageSize
                    }
                }
            });
            let param = this.handleSearchParams();
            param.RecordIndex = (page - 1) * pageSize;
            param.RecordSize = pageSize;
            eventarrange(param);
        }
        handleOnOk = () => {
            this.props.form.validateFields((errors, values) => {
              if (!errors) {
                  if (this.state.EmployeeID) {
                    const {
                        Department,
                        DutyStatus
                      } = values;
                      EventService.AddOnDuty({
                        Department: Department * 1,
                        DutyStatus: DutyStatus * 1,
                        AddOrModify: this.state.type,
                        DiplomatID: this.state.EmployeeID * 1
                      }).then((data) => {
                        if (data.Code == 0) {
                            if (this.state.type == 0) {
                                message.success("新增成功");
                            } else {
                                message.success("修改成功");
                            }
                            this.setState({
                                EmployeeLoginName: "",
                                EmployeeMobile: ""
                            });
                            this.handleSearch();
                           this.handleReset();
                        } else {
                            message.error(data.Desc);
                        }
                      }).catch((err) => {
                        message.error(err.Desc);
                      });
                  } else {
                      message.error("没有该用户");
                  }
              }
            });
          }
    render() {
        const { getFieldDecorator } = this.props.form;
        const param = this.props.list;
        return (
            <div style={{padding: '15px', background: "#FFF"}}>
                 <Row>
                <Col span={24}>
                  <div>
                    <Form>
                      <Row gutter={32}>
                        <Col span={4}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="姓名">
                            {getFieldDecorator('DiplomatName')(
                              <Input />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={4}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="用户名">
                            {getFieldDecorator('DiplomatNick', {
                              
                            })(
                              <Input type="tel" maxLength="20" placeholder="请输入用户姓名"/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6}>
                          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="处理对象">
                            {getFieldDecorator('Depart')(
                              <Select>
                                {/* <Option value={"0"}>全部</Option> */}
                                {/* <Option value={"3"}>体验中心</Option> */}
                                <Option value={"2"}>补贴/推荐费</Option>
                                <Option value={"4"}>入职回访客服</Option>
                                <Option value={"1"}>业务部门</Option>
                                {/* <Option value={"5"}>用户体验官</Option> */}
                                <Option value={"6"}>薪资组</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={6} offset={1}>
                          <FormItem style={{textAlign: 'right'}}>
                            <Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                          </FormItem>
                        </Col>
                      </Row>
                    <Col offset={19}>
                        <Button onClick={() => this.setState({visible: true})} type="primary" style={{width: "100px", height: "40px"}}>新增</Button>
                    </Col>
                    </Form>
                  </div>
                </Col>
              </Row>
              
              
               <div style={{background: 'white', padding: '10px'}}>
                       <Table columns={this.state.columns}
                                style={{width: '50%'}}
                                bordered={true}
                        //        loading={data.RecordListLoading}
                                dataSource={param['eventarrange']}
                                onRowDoubleClick={(e) => {this.setState({record: e, visible: true, type: 1, EmployeeID: e.DiplomatID});}}
                                pagination={{
                                    total: param['totalSize'],
                                    current: this.props.list.pageQueryParams.currentPage,
                                    pageSize: this.props.list.pageQueryParams.pageSize,
                                    pageSizeOptions: ["10", '40', '80', '120'],
                                    onChange: (page, pageSize) => this.onChange(page, pageSize),
                                    onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize),
                                    showTotal: (total, range) => {
                                      return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                    },
                                    showSizeChanger: true,
                                    showQuickJumper: true
                                }}
                        >
                        </Table>
               </div>
               <Modal
                    title= {this.state.type == 1 ? "修改" : "新增"}
                    visible={this.state.visible}
                    onOk={this.handleOnOk}
                    onCancel={this.handleOnCancel}
                >
                    <Form>
                    <Row>
                        <FormItem label="姓名" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                            {getFieldDecorator("EmployeeName", {
                                initialValue: this.state.record.DiplomatName || "",
                                rules: [{required: true, message: '请选择姓名!'}, {max: 10, message: '最大为10个字符!'}]
                            })(
                                <Select maxLength={"10"}
                                        style={{ width: 400 }}
                                        disabled={this.state.type == 1 ? true : false}
                                        showSearch={true}
                                        placeholder=''
                                        defaultActiveFirstOption={false}
                                        onSearch={this.OnSearch}
                                        onSelect={(value, item) => this.handleSearchList(value, item)}
                                        mode="combobox"
                                        notFoundContent=""
                                        showArrow={false}
                                        filterOption={false}
                                        >
                                        {
                                            (this.state.QryDoc || []).map((item, i) => {
                                            return (
                                                <Option key={i} EmployeeID={item.EmployeeID} EmployeeLoginName={item.EmployeeLoginName} EmployeeMobile={item.EmployeeMobile}
                                                value={item.EmployeeName}>{item.EmployeeName + "-" + item.EmployeeLoginName + "-" + item.EmployeeMobile}</Option>
                                            );
                                            })
                                        }
                                    </Select>
                            )}
                        </FormItem>
                        <div style={{display: "flex"}}>
                            <FormItem label="手机号" labelCol={{ span: 9 }} wrapperCol={{ span: 11 }}>
                                {getFieldDecorator("Mobile", {
                                    initialValue: this.state.type == 1 ? this.state.record.DiplomatMobile : this.state.EmployeeMobile
                                  
                                })(
                                    <Input disabled={true} />
                                )}
                            </FormItem>
                            <FormItem label="用户名" labelCol={{ span: 9 }} wrapperCol={{ span: 11 }}>
                                {getFieldDecorator("UserName", {
                                    initialValue: this.state.record.DiplomatNick || this.state.EmployeeLoginName
                                   
                                })(
                                   <Input disabled={true}/>
                                )}
                            </FormItem>
                        </div>

                        <div style={{display: "flex"}}>
                        <FormItem style={{width: "49%"}} label="角色类型" labelCol={{ span: 9 }} wrapperCol={{ span: 11 }}>
                            {getFieldDecorator("Department", {
                                initialValue: this.state.type == 1 ? this.state.record.Department + "" : "",
                                rules: [{required: true, message: '请选择角色类型!'}]
                            })(
                                <Select placeholder="请选择角色类型" onChange={this.EventSubTypeChange} className="w-100" allowClear={true}>
                                   {/* <Option value={"0"}>全部</Option> */}
                                {/* <Option value={"3"}>体验中心</Option> */}
                                <Option value={"2"}>补贴/推荐费</Option>
                                <Option value={"4"}>入职回访客服</Option>
                                <Option value={"1"}>业务部门</Option>
                                {/* <Option value={"5"}>用户体验官</Option> */}
                                <Option value={"6"}>薪资组</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{width: "49%"}} label="值班状态" labelCol={{ span: 9 }} wrapperCol={{ span: 11 }}>
                            {getFieldDecorator("DutyStatus", {
                                initialValue: this.state.type == 1 ? this.state.record.DutyStatus + "" : "",
                                rules: [{required: true, message: '请选择值班状态!'}]
                            })(
                                <Select placeholder="请选择值班状态" onChange={this.EventSubTypeChange} className="w-100" allowClear={true}>
                                    <Option value={"1"}>值班</Option>
                                    <Option value={"2"}>休假</Option>
                                    <Option value={"3"}>离职</Option>
                                </Select>
                            )}
                        </FormItem>
                        </div>
                    </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
      const {
        DiplomatName, 
        DiplomatNick, 
        Depart
   
      } = props.list["pageQueryParams"];
  
      return {
        DiplomatName, 
        DiplomatNick, 
        Depart
      };
    },
    onFieldsChange(props, fields) {
      setParams(STATE_NAME, {
        pageQueryParams: Object.assign({}, props.list["pageQueryParams"], fields)
      });
    }
  })(Eventarrange);