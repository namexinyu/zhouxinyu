import React from 'react';
import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Modal,
    Icon,
    Spin,
    message
} from 'antd';
import AliyunUpload from 'COMPONENT/AliyunUpload';
import uploadRule from 'CONFIG/uploadRule';
import {
    PromiseSettleDelay, PromiseSettleDelayEnum,
    LaborOrderSettleStatus, LaborOrderSettleStatusEnum
} from 'CONFIG/EnumerateLib/Mapping_Order';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import {OrderStep} from 'CONFIG/EnumerateLib/Mapping_Order';
import FeeAction from 'ACTION/Finance/TradeManage/FeeAction';

import resetState from 'ACTION/resetState';
import {UTIL} from 'mams-com';

const {importSettleLaborCharge, saveSettleLaborCharge} = FeeAction;
const STATE_NAME = 'state_finance_labor_charge_import';
const xlsx = UTIL.xlsx;

const toExcel = (excelContent) => {
    window.location.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelContent;
};

export default class LaborChargeImport extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !this.props.location.state) {
            resetState(STATE_NAME);
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.saveSettleLaborChargeFetch.status === 'success') { // 提交保存导入
            setFetchStatus(STATE_NAME, 'saveSettleLaborChargeFetch', 'close');
            let RecordList = nextProps.saveSettleLaborChargeFetch.response.Data.RecordList; // 设置结果
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
                ImportExcelList: [],
                selectedRowKeys: [],
                selectedRows: []
            });
        } else if (nextProps.saveSettleLaborChargeFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'saveSettleLaborChargeFetch', 'close');
            message.error(nextProps.saveSettleLaborChargeFetch.response && nextProps.saveSettleLaborChargeFetch.response.Desc ? nextProps.saveSettleLaborChargeFetch.response.Desc : '设置失败');
        }

        if (nextProps.importSettleLaborChargeFetch.status === 'success') {
            setFetchStatus(this.STATE_NAME, 'importSettleLaborChargeFetch', 'close');
            if (nextProps.importSettleLaborChargeFetch.response.Data.SameFile === 1) {
                Modal.error({title: '提示', content: `导入了重复文件`});
            }
        }
    }

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        setParams(STATE_NAME, {selectedRowKeys, selectedRows});
    };

    render() {
        const {ImportExcelList, selectedRows, selectedRowKeys} = this.props;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>导入结底价名单</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Spin spinning={this.props.saveSettleLaborChargeFetch.status === 'pending'}>
                        <Card bordered={false}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span
                                    style={{color: '#aa492c'}}>导入的Excel：签到日期、企业、劳务公司、会员姓名、身份证号、结底价、支付方式、备注（备注可选，其他必填）</span>
                                <a onClick={() => {
                                    window.open('http://woda-app-public.oss-cn-shanghai.aliyuncs.com/ent/material/201804131107567807');
                                }}>下载导入模版</a>
                            </div>
                            <Row className="mb-24 mt-24">
                                <Col span={6}>
                                    <AliyunUpload id={'ImportExcelList'}
                                                  listType="text" maxNum={1} previewVisible={false}
                                                  defaultFileList={ImportExcelList}
                                                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                  oss={uploadRule.laborNameList}
                                                  uploadChange={(id, list) => {
                                                      setParams(STATE_NAME, {
                                                          [id]: list,
                                                          RecordList: [],
                                                          selectedRowKeys: [],
                                                          selectedRows: []
                                                      });
                                                  }}>
                                        <Button><Icon type="upload"/>点击上传</Button>
                                    </AliyunUpload>
                                </Col>
                                <Col>
                                    <Button className="ml-24"
                                            disabled={!ImportExcelList || !ImportExcelList.length || this.props.RecordList.length}
                                            onClick={() => {
                                                let res = ImportExcelList[0].response;
                                                importSettleLaborCharge({
                                                    BucketKey: res.bucket,
                                                    FileName: res.name.substr(1, res.name.length)
                                                });
                                            }}
                                    >导入预览</Button>
                                </Col>
                            </Row>
                            {this.props.importSettleLaborChargeFetch.status === 'success' && this.props.RecordList && this.props.RecordList.length > 0 &&
                            <div
                                className="mb-24">预检测结果：可以正常导入{this.props.RecordList.reduce((result, data) => data.Result === 1 ? ++result : result, 0)} 个名单</div>
                            }
                            <div className="mb-16" style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Button
                                    type="primary" size="large"
                                    onClick={() => {
                                        let res = ImportExcelList[0].response;
                                        saveSettleLaborCharge({
                                            BucketKey: res.bucket,
                                            FileName: res.name.substr(1, res.name.length),
                                            FileMd5: this.props.FileMd5 || '',
                                            RecordList: selectedRows.map(item => ({
                                                Amount: item.LaborChargeAmountReal,
                                                Payment: item.Payment,
                                                Remark: item.Remark,
                                                UserOrderSettleID: item.UserOrderSettleID
                                            }))
                                        });
                                    }}
                                    disabled={!(selectedRows && selectedRows.length > 0)}>提交保存</Button>
                                <Button
                                    type="primary" size="large"
                                    onClick={() => {
                                        let data = [];
                                        data.push(this.thead);
                                        this.props.RecordList.filter((item) => !item.InterviewID).map((item) => {
                                            let row = [];
                                            row.push(item.CheckInTime);
                                            row.push(item.PositionName);
                                            row.push(item.ShortName);
                                            row.push(item.RealName);
                                            row.push(item.IDCardNum);
                                            row.push(item.LaborChargeAmountRealStr);
                                            row.push(item.LaborChargePaymentStr);
                                            row.push(item.LaborChargeRemark);
                                            row.push(item.Result);
                                            data.push(row);
                                        });
                                        let excel = xlsx({worksheets: [{data}]});
                                        toExcel(excel.base64);
                                    }}
                                    disabled={!this.props.RecordList || this.props.RecordList.filter(item => item.Result === 2).length === 0}>下载错误结果</Button>
                            </div>
                            <Table
                                rowKey='rowKey' bordered={true} pagination={false}
                                columns={this.columns} loading={this.props.RecordListLoading}
                                dataSource={this.props.RecordList}
                                rowSelection={{
                                    onChange: this.handleTableRowSelection, selectedRowKeys,
                                    getCheckboxProps: record => ({disabled: record.Result !== 1})
                                }}/>
                        </Card>
                    </Spin>
                </div>
            </div>
        );
    }


    thead = ['签到日期', '企业', '劳务公司', '会员姓名', '身份证号', '结底价', '支付方式', '备注', '检测结果'];
    columns = [{
        title: '序号',
        dataIndex: 'rowKey'
    }, {
        title: '签到日期',
        dataIndex: 'CheckInTime'
    }, {
        title: '企业',
        dataIndex: 'PositionName'
    }, {
        title: '劳务公司',
        dataIndex: 'ShortName'
    }, {
        title: '会员姓名',
        dataIndex: 'RealName'
    }, {
        title: '身份证号',
        dataIndex: 'IDCardNum'
    }, {
        title: '结底价',
        dataIndex: 'LaborChargeAmountRealStr'
    }, {
        title: '支付方式',
        dataIndex: 'LaborChargePaymentStr'
    }, {
        title: '备注',
        dataIndex: 'LaborChargeRemark'
    }, {
        title: '检测结果',
        dataIndex: 'Result',
        render: (text, record) => <span className={record.Result === 1 ? 'color-green' : 'color-red'}>
            {record.Result === 1 ? '成功' : record.Result === 2 ? '失败' : text}
        </span>
    }];
}