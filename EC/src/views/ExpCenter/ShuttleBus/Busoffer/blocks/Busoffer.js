import React from 'react';

import BusofferModal from './BusofferModal';

import setParams from 'ACTION/setParams';
import BusOfferAction from 'ACTION/ExpCenter/ShuttleBus/BusOfferAction';
import MAMSCommonAction from 'ACTION/Common/MAMSCommonAction';

import BusOfferService from 'SERVICE/ExpCenter/BusOfferService';
import BusRenter from 'SERVICE/ExpCenter/BusRenter';
import BusType from 'SERVICE/ExpCenter/BusType';

const { getCurrentBusOfferList } = BusOfferService;
const { getBusTypeList } = BusType;
const { getBusRenterList } = BusRenter;
const { getBusOfferRouteList } = BusOfferAction;
const { GetHubList } = MAMSCommonAction;

import {
  Button,
  Row,
  Col,
  message,
  Table,
  Select,
  Form,
  Input,
  Popconfirm,
  Icon,
  Modal
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { Column } = Table;

const STATE_NAME = 'state_ec_busoffer';

class Busoffer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.busofferInfo.pageQueryParams.RecordIndex / this.props.busofferInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      busofferModalVisible: false,
      rowRecord: {},
      busRenterList: [],
      busTypeList: [],
      curRouteOfferData: {}
    };
  }

  componentWillMount() {
    GetHubList();
    this.fetchBusofferList(this.props.busofferInfo.pageQueryParams);
  }

  fetchBusofferList = (queryParams = {}) => {
    const {
        OriginHub = {},
        DestHub = {},
        RecordIndex,
        RecordSize
    } = queryParams;

    getBusOfferRouteList({
        OriginHubID: OriginHub.value ? +OriginHub.value : 0,
        DestHubID: DestHub.value ? +DestHub.value : 0,
        RecordIndex,
        RecordSize
    });
  }

  handleSearch = () => {
    const {
      form: {
        getFieldsError
      },
      busofferInfo: {
        pageQueryParams
      }
    } = this.props;
    
    if (getFieldsError(['DestHub']).DestHub || getFieldsError(['OriginHub']).OriginHub) {
      return;
    }

    this.setState({
      page: 1,
      pageSize: pageQueryParams.RecordSize
    });

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams,
        RecordIndex: 0,
        RecordSize: pageQueryParams.RecordSize
      }
    });

    this.fetchBusofferList({
      ...pageQueryParams,
        RecordIndex: 0,
        RecordSize: pageQueryParams.RecordSize
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  handleTableChange = ({current, pageSize }) => {
    const {
      busofferInfo: {
        pageQueryParams
      }
    } = this.props;

    this.setState({
      page: current,
      pageSize: pageSize
    });

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams,
        RecordIndex: (current - 1) * pageSize,
        RecordSize: pageSize
      }
    });

    this.fetchBusofferList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  countRepeat(data) {
    let ret = {};
    data.forEach(item => {
      if (ret[item.BusRouteID]) {
        ret[item.BusRouteID] = ret[item.BusRouteID] + 1;
      } else {
        ret[item.BusRouteID] = 1;
      }
    });
    return ret;
  }

  recomputedTableData(data) {
    const repeatMap = this.countRepeat(data);
    return data.map((item, i) => {
      return {
        ...item,
        rowSpan: (data[i - 1] || {}).BusRouteID !== item.BusRouteID ? repeatMap[item.BusRouteID] : 0
      };
    });
    // const backupFeeList = [{
    //   BusRentCorpName: '',
    //   SeatNum: 0,
    //   ChargeAmount: 0,
    //   EmployeeName: '',
    //   CreateTime: '',
    //   Remark: ''
    // }];
    // return data.reduce((wrap, cur, index) => {
    //   return wrap.concat((cur.FeeList || backupFeeList).map((item, i) => {
    //     return {
    //       seqNum: index,
    //       BusRouteID: cur.BusRouteID,
    //       OriginHub: cur.OriginHub,
    //       DestHub: cur.DestHub,
    //       Kilometres: cur.Kilometres,
    //       BusRentCorpName: item.BusRentCorpName,
    //       SeatNum: item.SeatNum,
    //       ChargeAmount: item.ChargeAmount,
    //       EmployeeName: item.EmployeeName,
    //       CreateTime: item.CreateTime,
    //       Remark: item.Remark,
    //       originRecord: cur,
    //       rowSpan: i === 0 ? (cur.FeeList || backupFeeList).length : 0
    //     };
    //   }));
    // }, []);
  }

  handleEditBusRoute = (record) => {
    Promise.all([
      getBusTypeList({
        RecordIndex: 0,
        RecordSize: 9999
      }),
      getBusRenterList({
        RecordIndex: 0,
        RecordSize: 9999
      }),
      getCurrentBusOfferList({
        BusRouteID: record.BusRouteID,
        RecordIndex: 0,
        RecordSize: 10
      })
    ]).then((res) => {
      const [BusTypeRes, BusRenterRes, CurBusOfferRes] = res;

      this.setState({
        busofferModalVisible: true,
        rowRecord: record,
        busTypeList: (BusTypeRes.Data || {}).RecordList || [],
        busRenterList: (BusRenterRes.Data || {}).RecordObject || [],
        curRouteOfferData: CurBusOfferRes.Data || {}
      });
    }).catch((err) => {
      message.error(err.Desc || '出错了，请稍后尝试');
    });
  }

  handleSaveOffer = () => {
    this.handleCancelSaveOffer();
  }

  handleCancelSaveOffer = () => {
    this.setState({
      busofferModalVisible: false,
      rowRecord: {}
    });
    this.fetchBusofferList(this.props.busofferInfo.pageQueryParams);
  }

  handleFetchCurOfferList = (BusRouteID, RecordIndex, RecordSize) => {
    getCurrentBusOfferList({
      BusRouteID: BusRouteID,
      RecordIndex,
      RecordSize
    }).then((res) => {
      if (res.Code === 0) {
        this.setState({
          curRouteOfferData: res.Data || {}
        });
      } else {
        message.error(res.Desc || '出错了，请稍后尝试');        
      }
    }).catch((err) => {
      message.error(err.Desc || '出错了，请稍后尝试');
    });
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldsValue
      },
      busofferInfo: {
        busRouteList,
        RecordCount,
        isFetching
      },
      busHubList
    } = this.props;

    const {
      page,
      pageSize,
      busofferModalVisible,
      rowRecord,
      busRenterList,
      busTypeList,
      curRouteOfferData
    } = this.state;

    console.log(this.props);
    const computedBusRouteList = this.recomputedTableData(busRouteList);

    return (
      <div>
        <div className='ivy-page-title'>
            <div className="ivy-title">报价管理</div>
            <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                <i className="iconfont icon-shuaxin"></i>
            </span>
        </div>
        <Row>
          <Col span={24} style={{
            padding: "24px"
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "24px"
            }}>
              <Row>
                <Col span={24}>
                  <div>
                    <Form>
                      <Row>
                        <Col span={8}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="始发地">
                            {getFieldDecorator('OriginHub', {
                              rules: [
                                {
                                  validator: (rule, value, cb) => {
                                    const originId = +value;
                                    const destId = this.props.busofferInfo.pageQueryParams.DestHub.value ? +this.props.busofferInfo.pageQueryParams.DestHub.value : 0;
                                    if (originId !== 0 && destId !== 0 && originId === destId) {
                                      cb('始发地跟目的地不能相同');
                                    }
                                    cb();
                                  }
                                }
                              ]
                            })(
                              <Select size="default" placeholder="请选择">
                                <Option key="0" value="0">全部</Option>
                                {
                                  (busHubList || []).map((item) => {
                                    return (
                                      <Option key={item.HubID} value={`${item.HubID}`}>{item.HubName}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>

                        <Col span={8}>
                          <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="目的地">
                            {getFieldDecorator('DestHub', {
                              rules: [
                                {
                                  validator: (rule, value, cb) => {
                                    const destId = +value;
                                    const originId = this.props.busofferInfo.pageQueryParams.OriginHub.value ? +this.props.busofferInfo.pageQueryParams.OriginHub.value : 0;
                                    if (originId !== 0 && destId !== 0 && originId === destId) {
                                      cb('始发地跟目的地不能相同');
                                    }
                                    cb();
                                  }
                                }
                              ]
                            })(
                              <Select size="default" placeholder="请选择">
                                <Option key="0" value="0">全部</Option>
                                {
                                  (busHubList || []).map((item) => {
                                    return (
                                      <Option key={item.HubID} value={`${item.HubID}`}>{item.HubName}</Option>
                                    );
                                  })
                                }
                              </Select>
                            )}
                          </FormItem>
                        </Col>

                        <Col span={8} style={{textAlign: 'right'}}>
                          <Button type="primary" onClick={this.handleSearch}>搜索</Button>
                          <Button className="ml-16" onClick={this.handleReset}>重置</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>

              <Row className="mt-20">
                <Col span={24}>
                  <Table
                    rowKey={(record, index) => index}
                    dataSource={computedBusRouteList}
                    pagination={{
                      total: RecordCount,
                      defaultPageSize: pageSize,
                      defaultCurrent: page,
                      current: page,
                      pageSize: pageSize,
                      pageSizeOptions: ['40', '80', '120'],
                      showTotal: (total, range) => {
                       return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                      },
                      showSizeChanger: true,
                      showQuickJumper: true
                    }}
                    bordered={true}
                    loading={isFetching}
                    onChange={this.handleTableChange}
                  >
                    <Column
                      title="始发地"
                      dataIndex="OriginHub"
                      render={(text, record) => {
                        return {
                          children: text,
                          props: {
                            rowSpan: record.rowSpan
                          }
                        };
                      }}
                    />
                    <Column
                      title="目的地"
                      dataIndex="DestHub"
                      render={(text, record) => {
                        return {
                          children: text,
                          props: {
                            rowSpan: record.rowSpan
                          }
                        };
                      }}
                    />
                    <Column
                      title="公里数"
                      dataIndex="Kilometres"
                      render={(text, record) => {
                        return {
                          children: text === 0 ? '' : text,
                          props: {
                            rowSpan: record.rowSpan
                          }
                        };
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
                      dataIndex="CreateTime"
                    />
                    <Column
                      title="备注"
                      dataIndex="Remark"
                    />
                    <Column
                      title="操作"
                      dataIndex="action"
                      width={80}
                      render={(text, record) => {
                        return {
                          children: (
                            <div>
                              <Button type="primary" className="mr-10" onClick={() => this.handleEditBusRoute(record)}>编辑</Button>
                            </div>
                          ),
                          props: {
                            rowSpan: record.rowSpan
                          }
                        };
                      }}
                    />
                  </Table>
                </Col>
              </Row>
              
              <BusofferModal
                visible={busofferModalVisible}
                rowRecord={rowRecord}
                busTypeList={busTypeList}
                busRenterList={busRenterList}
                curRouteOfferData={curRouteOfferData}
                onOk={this.handleSaveOffer}
                onCancel={this.handleCancelSaveOffer}
                busHubList={busHubList}
                onFetch={this.handleFetchCurOfferList}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const {
        OriginHub,
        DestHub
    } = props.busofferInfo.pageQueryParams;

    return {
        OriginHub,
        DestHub
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.busofferInfo.pageQueryParams, fields)
    });
  }
})(Busoffer);
