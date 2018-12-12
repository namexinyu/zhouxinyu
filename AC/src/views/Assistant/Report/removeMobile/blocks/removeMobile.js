import React from 'react';
import moment from 'moment';
import setParams from 'ACTION/setParams';
import removeMobile from 'ACTION/Assistant/removeMobile';
const STATE_NAME = "removeMobile";
const { getMoveNullNumberApplyList } = removeMobile;
import {getAuthority} from 'CONFIG/DGAuthority';

import {
  Button,
  Row,
  Col,
  message,
  Table,
  Select,
  Form,
  Cascader,
  Input,
  DatePicker,
  Modal
} from 'antd';
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
const { Column, ColumnGroup } = Table;
function disabledMonth(current) {
    return current && current.valueOf() > moment().add(1, 'month').toDate().getTime();
}
class PresignTrace extends React.PureComponent {
    constructor(props) {
        super(props);
        this.auth = getAuthority();
    }
  formItemLayout = {
    labelCol: { span: 7, offset: 0 },
    wrapperCol: { span: 16, offset: 0 }
  };  
  columns = [
    {
        title: '工号',
        dataIndex: 'BrokerAccount',
        className: "listpadding",
        width: "10%"
    },
    {
        title: '昵称',
        dataIndex: 'BrokerName',
        className: "listpadding",
        width: "15%"
    },
    {
        title: '部门',
        dataIndex: 'DepartName',
        className: "listpadding",
        width: "10%"
    },
    {
        title: '队名',
        dataIndex: 'GroupName',
        className: "listpadding",
        width: "10%"
    },
    {
        title: '申请总数',
        dataIndex: 'ApplyNum',
        className: "listpadding",
        width: "10%"
    },
  
    {
        title: '空号统计',
        dataIndex: 'NullNumber',
        className: "listpadding",
        width: "10%"
    },
    {
        title: '非空号统计',
        dataIndex: 'NotNullNumber',
        width: "35%"
    }
];

  componentDidMount() {
    
    this.check();
 
  }
  
  componentDidUpdate(prevProps) {
    const antTbody = document.querySelector('.removeMobileTable .ant-table-tbody');
    if (this.props.list.RecordList.length && antTbody.childNodes.length && !document.querySelector('.removeMobileTableitem')) {
      const statsElement = `<tr class="removeMobileTableitem">
       <td>${this.props.list.BrokerAccount.BrokerAccount}</td>
       <td>${this.props.list.BrokerAccount.BrokerName}</td>
       <td>${this.props.list.BrokerAccount.DepartName}</td>
       <td>${this.props.list.BrokerAccount.GroupName}</td>
       <td>${this.props.list.BrokerAccount.ApplyNum}</td>
       <td>${this.props.list.BrokerAccount.NullNumber}</td>
       <td>${this.props.list.BrokerAccount.NotNullNumber}</td>
      </tr>`;
      antTbody.insertAdjacentHTML('beforeend', statsElement);
    }

    if (document.querySelector('.removeMobileTableitem')) {
      if (!this.props.list.RecordList.length) {
        document.querySelector('.removeMobileTableitem').innerHTML = '';
      } else {
        if (document.querySelector('.removeMobileTableitem').innerHTML === '') {
          document.querySelector('.removeMobileTableitem').innerHTML = `
          <td>${this.props.list.BrokerAccount.BrokerAccount}</td>
          <td>${this.props.list.BrokerAccount.BrokerName}</td>
          <td>${this.props.list.BrokerAccount.DepartName}</td>
          <td>${this.props.list.BrokerAccount.GroupName}</td>
          <td>${this.props.list.BrokerAccount.ApplyNum}</td>
          <td>${this.props.list.BrokerAccount.NullNumber}</td>
          <td>${this.props.list.BrokerAccount.NotNullNumber}</td>
          `;
        } else {
          if (JSON.stringify(prevProps.list.RecordList) !== JSON.stringify(this.props.list.RecordList)) {
            document.querySelector('.removeMobileTableitem').innerHTML = `
                <td>${this.props.list.BrokerAccount.BrokerAccount}</td>
                <td>${this.props.list.BrokerAccount.BrokerName}</td>
                <td>${this.props.list.BrokerAccount.DepartName}</td>
                <td>${this.props.list.BrokerAccount.GroupName}</td>
                <td>${this.props.list.BrokerAccount.ApplyNum}</td>
                <td>${this.props.list.BrokerAccount.NullNumber}</td>
                <td>${this.props.list.BrokerAccount.NotNullNumber}</td>
            `;
          }
        }
      }
    }
      
    console.log(this.props.list, this.props.list.BrokerAccount, "111111111111111");
  }
  onChange = (page, pageSize) => {
        let param = {};
      let queryParams = this.props.list.queryParams;
        if (queryParams.StartDate) {
            param.StartDate = queryParams.StartDate.value.format('YYYY-MM-DD');
        }
        if (queryParams.EndDate) {
            param.EndDate = queryParams.EndDate.value.format('YYYY-MM-DD');
        }
        if (queryParams.RenterName.value) {
            if (queryParams.RenterName[0]) {
                param.DepartID = queryParams.RenterName.value[0];
            }
            if (queryParams.RenterName[1]) {
                param.GroupID = queryParams.RenterName.value[1];
            }
        }
        if (queryParams.BrokerName.value && queryParams.BrokerName.value.trim() !== "") {
            param.BrokerName = queryParams.BrokerName.value;
        }
        setParams(STATE_NAME, {
            pageParam: {
                ...this.props.list.pageParam,
                RecordIndex: page,
                RecordSize: pageSize
            }
        });
        
        param.RecordIndex = (page - 1) * pageSize;
        param.RecordSize = pageSize;
        getMoveNullNumberApplyList(param);
    };
    formItemLayout = {
        labelCol: { span: 7, offset: 0 },
        wrapperCol: { span: 16, offset: 0 }
    };
 
check = () => {
    this.props.form.validateFields((err, fieldsValue) => {
        if (err) return;
        let param = {};
        if (fieldsValue.StartDate) {
            param.StartDate = fieldsValue.StartDate.format('YYYY-MM-DD');
        }
        if (fieldsValue.EndDate) {
            param.EndDate = fieldsValue.EndDate.format('YYYY-MM-DD');
        }
        if (fieldsValue.RenterName) {
            if (fieldsValue.RenterName[0]) {
                param.DepartID = fieldsValue.RenterName[0];
            }
            if (fieldsValue.RenterName[1]) {
                param.GroupID = fieldsValue.RenterName[1];
            }
        }
        if (fieldsValue.BrokerName.trim() !== "") {
            param.BrokerName = fieldsValue.BrokerName;
        }
        param.RecordIndex = 0;
        param.RecordSize = 10;
        setParams(STATE_NAME, {
            selectedRowKeys: [],
            pageParam: {
                ...this.props.list.pageParam,
                RecordIndex: 1,
                RecordSize: 10
            }
        });
        getMoveNullNumberApplyList(param);
    });
}
  again = () => {
    // 重置
    this.props.form.resetFields();
    // this.check();
    setParams(STATE_NAME, {
        queryParams: {
            ...this.props.list.queryParams,
            StartDate: {value: moment()},
            EndDate: {value: moment()},
            RenterName: {value: [-9999]},
            BrokerName: {value: ""},
            SettleStatus: {value: ""}
        }
    });
  }

  render() {
    const FormItem = Form.Item;
    const {form} = this.props;
    const { getFieldDecorator } = form;
    console.log(this.props.list.RecordList, "222222222222222");
    let DaTe = new Date();
    console.log(DaTe, "444444444444");
    return (
      <div>
        <h1 style={{padding: "10px", background: '#fff'}}>空号移除统计</h1>
        <div style={{margin: "10px 20px 0", padding: "10px", background: "#fff"}}>
        <Form>
            <Row gutter={32} type="flex" justify="start">
                <Col span={5}>
                    <FormItem {...this.formItemLayout}
                        label="日期：">
                        <div style={{display: "flex"}}>
                            {getFieldDecorator('StartDate')(<DatePicker style={{ display: "inline"}}/>)}—
                            {getFieldDecorator('EndDate')(<DatePicker style={{ display: "inline"}}/>)}
                        </div>
                    </FormItem>
                </Col>
                <Col span={4}>
                    <FormItem {...this.formItemLayout}
                        label="部门/组：">
                        {getFieldDecorator('RenterName', {
                            initialValue: ''
                        })(<Cascader
                            allowClear={true}
                            placeholder={'选择部门/组'}
                            changeOnSelect
                            options={this.auth.DGList || []}>
                          </Cascader>)}

                    </FormItem>
                </Col>
                <Col span={5}>
                    <FormItem {...this.formItemLayout}  
                        label="经纪人：">
                        {getFieldDecorator('BrokerName', {
                            initialValue: ''
                        })(<Input placeholder={'输入昵称/工号'} />)}

                    </FormItem> 
                </Col>
                <Col span={10} className="mb-16 text-right">
                    <Button type="primary" htmlType="submit" onClick={this.check} >查询</Button>
                    <Button className="ml-8" onClick={this.again}>重置</Button>
                </Col>
            </Row>
          </Form>
          <Table
              className="removeMobileTable"
              bordered
              rowKey='BusOrderID'
              columns={this.columns}
              dataSource={this.props.list.RecordList}
              pagination={{
                  showQuickJumper: true,
                  showSizeChanger: true,
                  current: this.props.list.pageParam.RecordIndex,
                  pageSize: this.props.list.pageParam.RecordSize,
                  total: this.props.list.RecordCount,
                  pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
                  showTotal: (total, range) => {
                      return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                  },
                  onChange: (page, pageSize) => this.onChange(page, pageSize),
                  onShowSizeChange: (page, pageSize) => this.onChange(page, pageSize)
              }} />
        </div>
      </div>
    );
  }
}

export default Form.create({
    mapPropsToFields(props) {
        const {
            StartDate,
            EndDate,
            DestName,
            BrokerName,
            RenterName 
        } = props.list.queryParams;
        return {
            StartDate,
            EndDate,
            DestName,
            BrokerName,
            RenterName
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, props.list.queryParams, fields)
        });
    }
  })(PresignTrace);
