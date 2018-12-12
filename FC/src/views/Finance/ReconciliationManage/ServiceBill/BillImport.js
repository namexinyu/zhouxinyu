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
import ReconciliationManageAction from 'ACTION/Finance/ReconciliationManage';
import resetState from 'ACTION/resetState';
import {UTIL} from 'mams-com';

const {laborMonthBillImport, laborMonthBillSave} = ReconciliationManageAction;
const STATE_NAME = 'state_finance_bill_import';
const xlsx = UTIL.xlsx;

const toExcel = (excelContent) => {
    window.location.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelContent;
};

export default class BillImport extends React.PureComponent {

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !this.props.location.state) {
            resetState(STATE_NAME);
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.laborMonthBillSaveFetch.status === 'success') { // 提交保存导入
            setFetchStatus(STATE_NAME, 'laborMonthBillSaveFetch', 'close');
            let RecordList = nextProps.laborMonthBillSaveFetch.response.Data.RecordList; // 设置结果
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
                BillImportExcelList: [],
                selectedRowKeys: [],
                selectedRows: []
            });
        } else if (nextProps.laborMonthBillSaveFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'laborMonthBillSaveFetch', 'close');
            message.error(nextProps.laborMonthBillSaveFetch.response && nextProps.laborMonthBillSaveFetch.response.Desc ? nextProps.laborMonthBillSaveFetch.response.Desc : '设置失败');
        }

        if (nextProps.laborMonthBillImportFetch.status === 'success') {
            setFetchStatus(this.STATE_NAME, 'laborMonthBillImportFetch', 'close');
            if (nextProps.laborMonthBillImportFetch.response.Data.SameFile === 1) {
                Modal.error({title: '提示', content: `导入了重复文件`});
            }
        }
    }

    handleTableRowSelection = (selectedRowKeys, selectedRows) => {
        setParams(STATE_NAME, {selectedRowKeys, selectedRows});
    };

    render() {
        const {BillImportExcelList, selectedRows, selectedRowKeys} = this.props;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>导入开票金额</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Spin spinning={this.props.laborMonthBillSaveFetch.status === 'pending'}>
                        <Card bordered={false}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span style={{color: '#aa492c'}}>导入的Excel中必须包含：结算月份、劳务公司、开票金额</span>
                                <a onClick={() => {
                                    window.open('http://woda-app-public.oss-cn-shanghai.aliyuncs.com/ent/material/201804131106404354');
                                }}>下载导入模版</a>
                            </div>
                            <Row className="mb-24 mt-24">
                                <Col span={6}>
                                    <AliyunUpload id={'BillImportExcelList'}
                                                  listType="text" maxNum={1} previewVisible={false}
                                                  defaultFileList={BillImportExcelList}
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
                                            disabled={!BillImportExcelList || !BillImportExcelList.length || this.props.RecordList.length}
                                            onClick={() => {
                                                let res = BillImportExcelList[0].response;
                                                laborMonthBillImport({
                                                    BucketKey: res.bucket,
                                                    FileName: res.name.substr(1, res.name.length)
                                                });
                                            }}
                                    >导入预览</Button>
                                </Col>
                            </Row>
                            {this.props.laborMonthBillImportFetch.status === 'success' && this.props.RecordList && this.props.RecordList.length > 0 &&
                            <div
                                className="mb-24">预检测结果：可以正常导入{this.props.RecordList.reduce((result, data) => data.Result === 1 ? ++result : result, 0)} 个名单</div>
                            }
                            <div className="mb-16" style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Button
                                    type="primary" size="large"
                                    onClick={() => {
                                        let res = BillImportExcelList[0].response;
                                        laborMonthBillSave({
                                            BucketKey: res.bucket,
                                            FileName: res.name.substr(1, res.name.length),
                                            FileMd5: this.props.FileMd5 || '',
                                            RecordList: selectedRows.map(item => ({
                                                InvoiceAmount: item.InvoiceAmount,
                                                LaborMonthBillID: item.LaborMonthBillID
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
                                            row.push(item.ShortName);
                                            row.push(item.InvoiceAmountStr);
                                            row.push(item.Month);
                                            row.push(item.ErrorInfo);
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

    thead = ['劳务公司', '开票金额', '开票日期', '检测结果'];
    columns = [{
        title: '序号',
        dataIndex: 'rowKey'
    }, {
        title: '劳务公司',
        dataIndex: 'ShortName'
    }, {
        title: '开票金额',
        dataIndex: 'InvoiceAmountStr'
    }, {
        title: '开票日期',
        dataIndex: 'Month'
    }, {
        title: '检测结果',
        dataIndex: 'ErrorInfo',
        render: (text, record) => <span className={record.Result === 1 ? 'color-green' : 'color-red'}>
            {record.Result === 1 ? '正常' : text}
        </span>
    }];
}