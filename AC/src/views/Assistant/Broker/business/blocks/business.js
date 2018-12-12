import React from 'react';
import {Row, Col, Button, Table, Form, Input, DatePicker, Select} from 'antd';
import setParams from "ACTION/setParams";
import moment from 'moment';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import {browserHistory} from 'react-router';
import businessTo from "ACTION/Common/Assistance/Business";

const FormItem = Form.Item;
const Option = Select.Option;

 class Business extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_ac_business';
        this.state = {
            flag: false,
            columns: [{
                title: '序号',
                dataIndex: 'key',
                width: '3.6%',
                render: (text, record) => text
              }, {
                title: '报名企业',
                dataIndex: 'PositionName'
              }, {
                title: '面试成功',  
                dataIndex: 'PassedNum'
              }, {
                title: '未通过',
                dataIndex: 'FailedNum'
              }, {
                title: '未面试',
                dataIndex: 'NoInterviewNum'
              }, {
                title: '放弃',
                dataIndex: 'GiveUpNum'
              }
            ]
        };
    }
  startParams=(a)=> {
    let params = a || this.props.business;
        let go = {
            Date: params['Date'],
            PositionName: params['PositionName'],
            RecordIndex: (params['currentPage'] - 1) * params['pageSize'],
            RecordSize: params['pageSize']
        };
        businessTo(go);
   }
    componentWillMount() {
        ActionMAMSRecruitment.GetMAMSRecruitFilterList();
        this.startParams();
    }
    componentDidMount() {
        this.props.form.setFieldsValue({
            date: moment(this.props.business['Date'], 'YYYY-MM-DD')
        });
    }
   
    componentWillReceiveProps(nextProps) {
        if((this.props.business.pageSize !== nextProps.business.pageSize) || (this.props.business.currentPage !== nextProps.business.currentPage) || (this.props.business.PositionName !== nextProps.business.PositionName) || (this.props.business.Date !== nextProps.business.Date)) {
            this.startParams(nextProps.business);
        }else{
            if(this.state.flag) {
                this.startParams(nextProps.business);
                this.setState({
                  flag: false
                });
            }
        }
    }
    handleSearch=(e)=> {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                setParams(this.STATE_NAME, {
                    currentPage: 1,
                    PositionName: values['name'] ? values['name']['text'] : '',
                    Date: values['date'] ? moment(values['date']['_d']).format('YYYY-MM-DD') : ''
                });
                this.setState({
                   flag: true
                });
            }
        });
    }
    again=()=> {
        this.props.form.resetFields();
        this.props.form.setFieldsValue({
            date: moment(new Date(), 'YYYY-MM-DD')
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const param = this.props.business;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 }
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 }
            }
          };
          const firstLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
              }
          };
        return (
            <div style={{padding: '15px'}}>
               <div style={{background: 'white', padding: '10px'}} className='question'>
               <Form
                    onSubmit={this.handleSearch}
                    >
                    <Row gutter={24}>
                    <Col span={7}>
                        <FormItem label="日期" {...firstLayout}>
                           {getFieldDecorator("date", {
                            rules: []
                            })(
                                <DatePicker format="YYYY-MM-DD" style={{width: '100%'}}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem label="企业名称" {...formItemLayout}>
                           {getFieldDecorator("name", {
                            rules: []
                            })(
                                <AutoCompleteSelect
                                    allowClear={true}
                                    placeholder=""
                                    optionsData={{
                                        valueKey: "RecruitTmpID",
                                        textKey: "RecruitName",
                                        dataArray: this.props['dataSourse']['recruitFilterList'] || []
                                    }}>
                                </AutoCompleteSelect>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5} offset={5}>
                        <Button type="primary" size='large' style={{marginRight: '10px'}} htmlType="submit">搜索</Button>
                        <Button type="default" size='large' onClick={this.again}>重置</Button>
                    </Col>
                    </Row>
                </Form>
                    <Row>
                       <Table columns={this.state.columns}
                                bordered={true}
                        //        loading={data.RecordListLoading}
                                 dataSource={param['RecordList']}
                                 pagination={{
                                    total: param['RecordCount'],
                                    pageSize: param['pageSize'],
                                    current: param['currentPage'],
                                    onChange: (page, pageSize) => {
                                        setParams(this.STATE_NAME, {currentPage: page});
                                    },
                                    onShowSizeChange: (current, size) => setParams(this.STATE_NAME, {pageSize: size, currentPage: current}),
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    pageSizeOptions: ['40', '80', '120'],
                                    showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                         }}
                        >
                        </Table>
                    </Row>
               </div>
            </div>
        );
    }
}
export default Form.create()(Business);
