import React, { Component }from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Select,
    Table,
    Button,
    DatePicker,
    Modal,
    Input,
    message
} from 'antd';
import {HttpRequest, env} from 'mams-com';
import {CONFIG, UTIL} from 'mams-com';
import resetQueryParams from 'ACTION/resetQueryParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import moment from 'moment';

const regexRule = UTIL.Constant.RegexRule;
const FormItem = Form.Item;
const defaultState = {
    recordUserOrderID: 0,
    LaborOrderID: 0,
    RecordCount: 0,
    RecordList: [],
    RealName: "",
    Mobile: "",
    RecordListLoading: false,
    pageParam: {
        
        pageSize: 10,
        currentPage: 1
    }
};


class LaborOrderModal extends React.PureComponent {


    constructor(props) {
        super(props);    
        this.state = {...defaultState};
    }
    
    componentWillReceiveProps(nextProps) {
        /*
        if (!this.props.ModalVisible && nextProps.Visible && nextProps.recordUserOrderID) {
            setParams('LaborOrderModalItem', {pageParam: {...this.props.pageParam, currentPage: 1}});
        }
        */
        // if (nextProps.ModalVisible && this.props.pageParam !== nextProps.pageParam) {
        if (nextProps.ModalVisible && !this.props.ModalVisible) {
            this.setState({recordUserOrderID: nextProps.recordUserOrderID});
            this.setState({LaborOrderID: nextProps.LaborOrderID});
            this.getLaborOrderDetail(this.getQuery(nextProps.recordUserOrderID, nextProps.LaborOrderID));
        }
        
    }
    
    getQuery(recordUserOrderID, recordLaborOrderID) {
        let recordUserID = recordUserOrderID ? recordUserOrderID : this.state.recordUserOrderID;
        let LaborOrderID = recordLaborOrderID ? recordLaborOrderID : this.state.LaborOrderID;
        let query = {
            LaborUserOrderTotalID: recordUserID,
            LaborOrderID: LaborOrderID,
            RealName: this.state.RealName,
            Mobile: this.state.Mobile,
            RecordIndex: (this.state.pageParam.currentPage - 1) * this.state.pageParam.pageSize,
            RecordSize: this.state.pageParam.pageSize
        };
        return query;
    }

    getLaborOrderDetail(params) {
        this.setState({RecordListLoading: true});
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborWarning/BZ_LW_LaborUserOrderDetail',
            // url: env.api_url + '/BZ_LaborWarning/BZ_LW_LaborUserOrderTotal',
            params: params
        }, {
            successDo: (res) => {
                if (res.Code == 0) {
                    
                   this.setState({RecordCount: res.Data.RecordCount, RecordList: res.Data.RecordList, RecordListLoading: false});
                }else{
                    this.setState({RecordListLoading: false});
                }
            },
            errorDo: (res) => {
                this.setState({RecordListLoading: false});
                // maybe you could dialog the res.message
                // this.state.RecordList = [];
            }
        });
    }

    handleModalSubmit() {
       
        this.getLaborOrderDetail(this.getQuery());
 
    }

    resetItems() {
        this.setState({RealName: "", Mobile: ""});
        // this.getLaborOrderDetail(this.getQuery());
    };
    

    render() {
        return (
            <Modal
                title="订单明细"
                visible={this.props.ModalVisible}
                footer={null}
                width={850}
                onCancel={()=>{this.setState({...defaultState}); this.props.onCancel();}}>
                <Card bordered={false}>

                        <Row type="flex" justify="start">
                            <Col span={9}>
                                <FormItem labelCol={{span: 10}} wrapperCol={{span: 13}} label="会员姓名">
                                    <Input placeholder="输入会员姓名" 
                                           value={this.state.RealName}
                                           onChange={(e) => {
                                                        this.setState({RealName: e.target.value || ''});
                                                    }}/>
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                    <FormItem labelCol={{span: 10}} wrapperCol={{span: 13}} className="match-input" label="会员手机">
                                            <Input placeholder="输入手机号"
                                                    value={this.state.Mobile}
                                                    onChange={(e) => {
                                                        this.setState({Mobile: e.target.value || ''});
                                                    }}/>
                                       
                                    </FormItem>
                            </Col>
                            <Col span={6} style={{textAlign: 'right'}}>
                                <Button type="primary" onClick={this.handleModalSubmit.bind(this)}>查询</Button>
                                <Button className="ml-8" onClick={this.resetItems.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                        <Table
                            rowKey={(record, index) => index}
                            bordered={true}
                            pagination={{
                                total: this.state.RecordCount,
                                pageSize: this.state.pageParam.pageSize,
                                current: this.state.pageParam.currentPage,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                            }}
                            columns={[{
                                title: '签到日期',
                                dataIndex: 'CheckInTime',
                                render: (text, record) => moment(text).format("YYYY-MM-DD")
                            }, {
                                title: '会员姓名',
                                dataIndex: 'RealName'
                            }, {
                                title: '手机号码',
                                dataIndex: 'Mobile'
                            }, {
                                title: '会员报价',
                                dataIndex: 'RecruitSubsidys',
                                render: (text, record) => text && text.map(item =>
                                    <div key={"RecruitSubsidys" + Math.random()}>
                                        {item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}:
                                        {item.SubsidyDay}天返{item.SubsidyAmount / 100}元
                                    </div>
                                )
                            }, {
                                title: '应收返费',
                                dataIndex: 'LaborSubsidyAmount',
                                render: (text, record) => <div>{text / 100}元</div>  
                            }, {
                                title: '已收返费',
                                dataIndex: 'LaborSubsidyAmountReal',
                                render: (text, record) => <div>{text / 100}元</div>  
                            }, {
                                title: '已付会员',
                                dataIndex: 'UserSubsidyAmount',
                                render: (text, record) => <div>{text / 100}元</div>  
                            }, {
                                title: '结算日期',
                                dataIndex: 'PromiseSettleDelay'                      
                            }, {
                                title: '订单状态',
                                dataIndex: 'LaborSettleStatus',
                                render: (text, record) => <span>{text === 1 ? <div className='color-orange'>即将到期</div> : <div className='color-red'>名单延期</div>}</span>                            
                            }
                           ]}
                            dataSource={this.state.RecordList} loading={this.state.RecordListLoading}
                            onChange={(pagination, filters, sorter) => {
                                let currentPage = pagination.current < 1 ? 1 : pagination.current;
                                let change = {pageParam: {currentPage, pageSize: pagination.pageSize}};
                                this.setState(change);
                                this.getLaborOrderDetail({
                                     ...this.getQuery(), 
                                     RecordIndex: (currentPage - 1) * pagination.pageSize,
                                     RecordSize: pagination.pageSize
                                    });
                            }}/>

                </Card>
            </Modal>
        );
        }
};

export default LaborOrderModal;