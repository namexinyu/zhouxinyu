import React from 'react';

import BusOfferService from 'SERVICE/ExpCenter/BusOfferService';

const {
  addBusOffer,
  setCooperation,
  delBusoffer
} = BusOfferService;

import {
  Button,
  Row,
  Col,
  message,
  Form,
  Input,
  InputNumber,
  Modal,
  Cascader,
  Select,
  Checkbox,
  Switch,
  Table
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const TextArea = Input.TextArea;
const { Column } = Table;

class BusofferModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 10
    };
  }

  handleOnOk = () => {
    this.props.form.resetFields();
    this.setState({
      page: 1,
      pageSize: 10
    });
    this.props.onOk();
  }

  handleOnCancel = () => {
    this.props.form.resetFields();
    this.setState({
      page: 1,
      pageSize: 10
    });
    this.props.onCancel();
  }
  

  handleAddoffer = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        const {
          BusRenter,
          BusType,
          OfferPrice,
          Remark = ''
        } = values;

        const {
          rowRecord,
          busHubList
        } = this.props;

        addBusOffer({
          BusRentCorpID: +BusRenter,
          BusRouteID: rowRecord.BusRouteID,
          BusTypeID: +BusType,
          ChargeAmount: +(+OfferPrice * 100).toFixed(),
          DestHubID: (busHubList.filter(item => item.HubName === rowRecord.OriginHub)[0] || {}).HubID || 0,
          Distance: rowRecord.Kilometres,
          OriginHubID: (busHubList.filter(item => item.HubName === rowRecord.DestHub)[0] || {}).HubID || 0,
          Remark: Remark
        }).then((res) => {
          if (res.Code === 0) {
            this.props.form.resetFields();
            this.setState({
              page: 1,
              pageSize: 10
            });
            this.props.onFetch(rowRecord.BusRouteID, 0, 10);
          } else {
            message.error(res.Desc || '添加出错了，请稍后尝试');
          }
        }).catch((err) => {
          message.error(err.Desc || '添加出错了，请稍后尝试');
        });
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  handleRemoveOffer = (record) => {
    delBusoffer({
      BusFixedID: record.BusFixedID
    }).then((res) => {
      if (res.Code === 0) {
        message.success('删除成功');
        this.props.onFetch(this.props.rowRecord.BusRouteID, (this.state.page - 1) * this.state.pageSize, this.state.pageSize);
      } else {
        message.error(res.Desc || '添加出错了，请稍后尝试');
      }
    }).catch((err) => {
      message.error(err.Desc || '添加出错了，请稍后尝试');
    });
  }

  handleSetCooperation = (checked, record) => {
    setCooperation({
      BusFixedID: record.BusFixedID,
      Cooperation: checked ? 1 : 2
    }).then((res) => {
      if (res.Code === 0) {
        message.success('修改成功');
        this.props.onFetch(this.props.rowRecord.BusRouteID, (this.state.page - 1) * this.state.pageSize, this.state.pageSize);
      } else {
        message.error(res.Desc || '添加出错了，请稍后尝试');
      }
    }).catch((err) => {
      message.error(err.Desc || '添加出错了，请稍后尝试');
    });
  }

  handleTableChange = ({current, pageSize}) => {
    this.setState({
      page: current,
      pageSize: pageSize
    });
    this.props.onFetch(this.props.rowRecord.BusRouteID, (current - 1) * pageSize, pageSize);
  }

  handleFormatPrice = (value) => {
    return `${value}`.replace(/\./, '');
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue
      },
      visible,
      rowRecord,
      busTypeList,
      busRenterList,
      curRouteOfferData
    } = this.props;

    const {
      OriginHub,
      DestHub,
      Kilometres
    } = rowRecord;

    const {
      page,
      pageSize
    } = this.state;

    const BusRenter = getFieldValue('BusRenter');
    const BusType = getFieldValue('BusType');
    const OfferPrice = getFieldValue('OfferPrice');
    
    return (
      <Modal
        width="62%"
        title="编辑报价"
        visible={visible}
        onOk={this.handleOnOk}
        onCancel={this.handleOnCancel}
      >
        <div>
          <Form>
            <Row gutter={8}>
              <Col span={8}>
                <FormItem label="始发地" labelCol={{span: 8}} wrapperCol={{span: 16}} className="mb-0">
                  <p>{OriginHub}</p>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="目的地" labelCol={{span: 8}} wrapperCol={{span: 16}} className="mb-0">
                  <p>{DestHub}</p>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="公里数" labelCol={{span: 8}} wrapperCol={{span: 16}} className="mb-0">
                  <p>{Kilometres === 0 ? '' : Kilometres}</p>
                </FormItem>
              </Col>
            </Row>

            <Row gutter={8} className="mt-16">
              <Col span={8}>
                <FormItem label="租车公司" labelCol={{span: 8}} wrapperCol={{span: 16}} className="mb-0">
                  {getFieldDecorator('BusRenter')(
                    <Select size="default" placeholder="请选择">
                      {
                        (busRenterList || []).map((item, i) => {
                          return (
                            <Option key={i} value={`${item.BusRentCorpID}`}>{item.RentCorpName}</Option>
                          );
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="座位数" labelCol={{span: 8}} wrapperCol={{span: 16}} className="mb-0">
                  {getFieldDecorator('BusType')(
                    <Select size="default" placeholder="请选择">
                      {
                        (busTypeList || []).map((item, i) => {
                          return (
                            <Option key={i} value={`${item.BusTypeID}`}>{item.SeatNum}</Option>
                          );
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <div className="flex flex--y-center">
                  <FormItem label="报价" labelCol={{span: 8}} wrapperCol={{span: 16}} className="mb-0">
                    {getFieldDecorator('OfferPrice')(
                      <InputNumber min={0} formatter={this.handleFormatPrice} maxLength={5} />
                    )}
                  </FormItem>
                  <span className="ml-8">元/单程</span>
                </div>
              </Col>
            </Row>

            <Row className="mt-16" gutter={8} type="flex" align="bottom">
              <Col span={16}>
                <FormItem label="备注" labelCol={{span: 4}} wrapperCol={{span: 20}} className="mb-0">
                  {getFieldDecorator('Remark', {
                    rules: [
                      {
                        validator: (rule, value, cb) => {
                          if (!!value && !!value.trim() && value.length > 50) {
                            cb('备注最多50字');
                          }
                          cb();
                        }
                      }
                    ]
                  })(
                    <TextArea rows={3} placeholder="请输入..." style={{ resize: 'none' }} />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem wrapperCol={{span: 16, offset: 6}} className="mb-0">
                  <div>
                    <Button onClick={this.handleReset}>重置</Button>
                    <Button className="ml-16" type="primary" disabled={!(BusRenter != null && BusType != null && OfferPrice != null && OfferPrice != '')} onClick={this.handleAddoffer}>添加</Button>
                  </div>
                </FormItem>
              </Col>
            </Row>
          </Form>

          <Row className="mt-10" style={{
            padding: 10,
            border: '1px solid #e9e9e9',
            borderRadius: 4
          }}>
            <Col span={24}>
              <div>
                <h3 style={{
                  fontSize: 14
                }}>报价列表</h3>
                <Table
                    className="mt-10"
                    rowKey={(record, index) => index}
                    dataSource={curRouteOfferData.RecordObject || []}
                    pagination={{
                      total: curRouteOfferData.RecordCount || 0,
                      defaultPageSize: pageSize,
                      defaultCurrent: page,
                      current: page,
                      pageSize: pageSize,
                      pageSizeOptions: ['10', '20', '40'],
                      showTotal: (total, range) => {
                       return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                      },
                      showSizeChanger: true,
                      showQuickJumper: true
                    }}
                    bordered={true}
                    onChange={this.handleTableChange}
                  >
                    <Column
                      title="序号"
                      dataIndex="index"
                      width={42}
                      render={(text, record, index) => {
                        return (index + 1) + pageSize * (page - 1);
                      }}
                    />
                    <Column
                      title="是否合作"
                      dataIndex="Cooperation"
                      render={(text, record) => {
                        return (
                          <Switch disabled={text === 0} checked={text === 1} onChange={(checked) => this.handleSetCooperation(checked, record)} />
                        );
                      }}
                    />
                    <Column
                      title="租车公司"
                      dataIndex="BusRentCorpName"
                    />
                     <Column
                      title="座位数"
                      dataIndex="SeatNum"
                    />
                     <Column
                      title="报价（元）"
                      dataIndex="ChargeAmount"
                      width={80}
                      render={(text) => {
                        return parseFloat((+text || 0) / 100).toFixed(2);
                      }}
                    />
                     <Column
                      title="提交人"
                      dataIndex="EmployeeName"
                    />
                    <Column
                      title="提交时间"
                      width={88}
                      dataIndex="CreateTime"
                    />
                    <Column
                      title="备注"
                      dataIndex="Remark"
                      width={115}
                    />
                    <Column
                      title="操作"
                      width={80}
                      dataIndex="action"
                      render={(text, record) => {
                        return (
                          <div>
                            <Button type="danger" className="mr-10" disabled={record.Cooperation === 1} onClick={() => this.handleRemoveOffer(record)}>删除</Button>
                          </div>
                        );
                      }}
                    />
                  </Table>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default Form.create({})(BusofferModal);
