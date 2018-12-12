import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Select,
    Table,
    Button,
    Input,
    Modal,
    Icon,
    message
} from 'antd';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
import {
    PromiseSettleDelay, PromiseSettleDelayEnum,
    LaborOrderSettleStatus, LaborOrderSettleStatusEnum
} from 'CONFIG/EnumerateLib/Mapping_Order';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import {
    OrderStep
} from 'CONFIG/EnumerateLib/Mapping_Order';
import LaborSettleImportAction from 'ACTION/Business/OrderManage/LaborSettleImportAction';
import QueryParam from 'mams-com/lib/utils/base/QueryParam';

const {
    saveLaborSettle,
    importLaborSettle
} = LaborSettleImportAction;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const STATE_NAME = 'state_business_labororder_settle_import';

class LaborSettleImport extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            saveLaborSettleSelectedRowKeys: [] // 导入名单选中
        };
    }

    componentWillMount() {
        this.LaborUserOrderTotalID = QueryParam.getQueryParam(window.location.href, 'LaborUserOrderTotalID');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.saveLaborSettleFetch.status === 'success') { // 提交保存导入
            setFetchStatus(STATE_NAME, 'saveLaborSettleFetch', 'close');
            let RecordList = nextProps.saveLaborSettleFetch.response.Data.RecordList; // 设置结果
            let successCount = 0;
            if (RecordList && RecordList instanceof Array) {
                let failureCount = 0;
                for (let data of RecordList) {
                    if (data.Result && data.Result === 1) successCount++;
                    if (data.Result && data.Result === 2) failureCount++;
                }
            }
            Modal.success({
                title: '提示',
                content: `成功更新${successCount}数据`
            });
            setParams(STATE_NAME, {
                RecordList: [],
                laborSettleList: []
            });
            this.setState({
                saveLaborSettleSelectedRowKeys: [],
                saveLaborSettleSelectedRows: []
            });
        } else if (nextProps.saveLaborSettleFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'saveLaborSettleFetch', 'close');
            message.error(nextProps.saveLaborSettleFetch.response && nextProps.saveLaborSettleFetch.response.Desc ? nextProps.saveLaborSettleFetch.response.Desc : '设置失败');
        }
    }

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>导入结算名单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{color: '#aa492c'}}>导入的Excel中必须包含：签到日期、姓名、性别、身份证、会员状态</span>
                            <a onClick={() => {
                                window.open('http://woda-app-public-test.oss-cn-shanghai.aliyuncs.com/labor/nameList/201712051648106889');
                            }}>下载结算名单模版</a>
                        </div>
                        <Row className="mb-24 mt-24">
                            <Col span={6}>
                                <AliyunUpload id={'laborSettleList'}
                                              listType="text" maxNum={1} previewVisible={false}
                                              defaultFileList={this.props.laborSettleList}
                                              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                              oss={uploadRule.laborNameList}
                                              uploadChange={(id, list) => {
                                                  setParams(STATE_NAME, {[id]: list, RecordList: []});
                                              }}>
                                    <Button><Icon type="upload"/> 点击上传</Button>
                                </AliyunUpload>
                            </Col>
                            <Col>
                                <Button className="ml-24"
                                        disabled={!this.props.laborSettleList || !this.props.laborSettleList.length || this.props.RecordList.length}
                                        onClick={() => {
                                            let res = this.props.laborSettleList[0].response;
                                            importLaborSettle({
                                                BucketKey: res.bucket,
                                                FileName: res.name.substr(1, res.name.length),
                                                LaborUserOrderTotalID: Number(this.LaborUserOrderTotalID)
                                            });
                                        }}
                                >导入预览</Button>
                            </Col>
                        </Row>
                        {this.props.importLaborSettleFetch.status === 'success' && this.props.RecordList && this.props.RecordList.length &&
                        <div
                            className="mb-24">预检测结果：可以正常导入{this.props.RecordList.reduce((result, data) => data.UserOrderID > 0 ? ++result : result, 0)} 个名单</div>
                        }
                        <div className="mb-16" style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button
                                type="primary" size="large"
                                onClick={() => {
                                    let RecordList = [];
                                    for (let data of this.state.saveLaborSettleSelectedRows) {
                                        RecordList.push({
                                            Reason: data.Reason,
                                            HireDate: data.HireDate,
                                            LeaveDate: data.LeaveDate,
                                            OrderStep: data.OrderStep,
                                            SettleDate: data.SettleDate,
                                            UserOrderID: data.UserOrderID,
                                            LaborSubsidyAmountReal: data.LaborSubsidyAmountReal
                                        });
                                    }
                                    saveLaborSettle({
                                        RecordList,
                                        LaborUserOrderTotalID: Number(this.LaborUserOrderTotalID)
                                    }); // todo 批量提交保存
                                }}
                                disabled={!(this.state.saveLaborSettleSelectedRows && this.state.saveLaborSettleSelectedRows.length > 0)}>
                                提交保存</Button>
                        </div>
                        <Table
                            rowKey={'rowKey'} bordered={true} pagination={false}
                            columns={this.columns}
                            dataSource={this.props.RecordList.map((item, index) => {
                                item['rowKey'] = index;
                                return item;
                            })}
                            rowSelection={{
                                onChange: (selectedRowKeys, selectedRows) => {
                                    let saveLaborSettleSelectedRows = [];
                                    let saveLaborSettleSelectedRowKeys = [];
                                    for (let i of selectedRows) {
                                        if (i.UserOrderID > 0) {
                                            saveLaborSettleSelectedRows.push(i);
                                            saveLaborSettleSelectedRowKeys.push(i.rowKey);
                                        } else {
                                            message.info('无法导入该记录，请修改excel');
                                        }
                                    }
                                    this.setState({
                                        saveLaborSettleSelectedRowKeys, saveLaborSettleSelectedRows
                                    });
                                },
                                selectedRowKeys: this.state.saveLaborSettleSelectedRowKeys
                            }}/>
                    </Card>
                </div>
            </div>
        );
    }

    columns = [{
        title: '签到日期',
        dataIndex: 'CheckInTime'
    }, {
        title: '会员姓名',
        dataIndex: 'RealName'
    }, {
        title: '性别',
        dataIndex: 'Gender',
        render: (text) => (text === 1 ? '男' : text === 2 ? '女' : '未指定')
    }, {
        title: '身份证号',
        dataIndex: 'IDCardNum'
    }, {
        title: '入职时间',
        dataIndex: 'HireDate'
    }, {
        title: '离职时间',
        dataIndex: 'LeaveDate'
    }, {
        title: '会员状态',
        dataIndex: 'OrderStepInfo'
        // render: (text, record) => {
        //     let arr = new Set([24, 25]);
        //     arr.add(text);
        //     return (<Select defaultValue={text.toString()} style={{width: 90}}>
        //         {[...arr].map((i) => {
        //             return <Option value={i.toString()} key={i}>{OrderStep[i]}</Option>;
        //         })}
        //     </Select>);
        // }
    }, {
        title: '结算日期',
        dataIndex: 'SettleDate'
    }, {
        title: '劳务参考',
        dataIndex: 'LaborSubsidyAmountReal'
    }, {
        title: '备注',
        dataIndex: 'Reason'
    }, {
        title: '检测结果',
        dataIndex: 'ErrorInfo',
        render: (text, record) => <span
            style={{color: record.UserOrderID > 0 ? 'green' : 'red'}}>{record.UserOrderID > 0 ? '正常' : text}</span>
    }];
}

const getFormProps = (props) => {
    let result = {};
    for (let key in props) {
        if (/^q\_\S+/.test(key)) {
            result[key] = props[key];
        }
    }
    return result;
};

export default Form.create({
    mapPropsToFields(props) {
        return getFormProps(props);
    },
    // onValuesChange(props, values) {
    //     setParams(STATE_NAME, values);
    // },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(LaborSettleImport);