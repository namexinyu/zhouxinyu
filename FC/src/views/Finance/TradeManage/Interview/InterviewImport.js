import React from 'react';
import {
    Row,
    Col,
    Card,
    Table,
    Button,
    Modal,
    Icon,
    Alert,
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
import {
    OrderStep
} from 'CONFIG/EnumerateLib/Mapping_Order';
import InterviewImportAction from 'ACTION/Finance/TradeManage/InterviewImportAction';
import resetState from 'ACTION/resetState';

const {
    saveLaborSettle,
    importLaborSettle
} = InterviewImportAction;
import {UTIL} from 'mams-com';

const xlsx = UTIL.xlsx;

const toExcel = (excelContent) => {
    window.location.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + excelContent;
};

export default class InterviewImport extends React.PureComponent {

    componentWillMount() {
        this.red = Number(this.props.red || 2);
        this.STATE_NAME = this.red === 2 ? 'state_finance_interview_import' : 'state_finance_interview_red_import';
        if (this.props.location.lastKey !== this.props.location.key && !this.props.location.state) {
            resetState(this.STATE_NAME);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.saveLaborSettleFetch.status === 'success') { // 提交保存导入
            setFetchStatus(this.STATE_NAME, 'saveLaborSettleFetch', 'close');
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
            setParams(this.STATE_NAME, {
                RecordList: [],
                laborImportInterviewList: [],
                RowSum: {},
                selectedRowKeys: [],
                selectedRows: [],
                selectedRowSum: {}
            });
        } else if (nextProps.saveLaborSettleFetch.status === 'error') {
            setFetchStatus(this.STATE_NAME, 'saveLaborSettleFetch', 'close');
            message.error(nextProps.saveLaborSettleFetch.response && nextProps.saveLaborSettleFetch.response.Desc ? nextProps.saveLaborSettleFetch.response.Desc : '设置失败');
        }

        if (nextProps.importLaborSettleFetch.status === 'success') {
            setFetchStatus(this.STATE_NAME, 'importLaborSettleFetch', 'close');
            if (nextProps.importLaborSettleFetch.response.Data.SameFile === 1) {
                Modal.error({title: '提示', content: `导入了重复文件`});
            }
        }
    }

    render() {
        const {laborImportInterviewList, selectedRows, selectedRowKeys, selectedRowSum, RowSum} = this.props;

        return (
            <div>
                <div className="ivy-page-title">
                    <h1>{this.red == 2 ? '导入结算名单' : '导入红冲名单'}</h1>
                </div>
                <div className="container-fluid pt-24 pb-24">
                    <Spin spinning={this.props.saveLaborSettleFetch.status === 'pending'}>
                        <Card bordered={false}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span style={{color: '#aa492c'}}>导入的Excel中必须包含：签到日期、姓名、性别、身份证、会员状态</span>
                                <a onClick={() => {
                                    window.open('http://woda-app-public.oss-cn-shanghai.aliyuncs.com/ent/material/201805101909155864');
                                }}>下载导入模版</a>
                            </div>
                            <Row className="mb-24 mt-24">
                                <Col span={6}>
                                    <AliyunUpload id={'laborImportInterviewList'}
                                                  listType="text" maxNum={1} previewVisible={false}
                                                  defaultFileList={laborImportInterviewList}
                                                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                                  oss={uploadRule.laborNameList}
                                                  uploadChange={(id, list) => {
                                                      setParams(this.STATE_NAME, {
                                                          [id]: list,
                                                          RecordList: [],
                                                          RowSum: {},
                                                          selectedRowKeys: [],
                                                          selectedRows: [],
                                                          selectedRowSum: {}
                                                      });
                                                  }}>
                                        <Button><Icon type="upload"/> 点击上传</Button>
                                    </AliyunUpload>
                                </Col>
                                <Col>
                                    <Button className="ml-24"
                                            disabled={!laborImportInterviewList || !laborImportInterviewList.length || this.props.RecordList.length}
                                            onClick={() => {
                                                let res = laborImportInterviewList[0].response;
                                                importLaborSettle({
                                                    RedFlush: this.red,
                                                    BucketKey: res.bucket,
                                                    FileName: res.name.substr(1, res.name.length)
                                                }, {red: this.red});
                                            }}
                                    >导入预览</Button>
                                </Col>
                            </Row>
                            {this.props.importLaborSettleFetch.status === 'success' && this.props.RecordList && this.props.RecordList.length > 0 &&
                            <div
                                className="mb-24">预检测结果：可以正常导入{this.props.RecordList.reduce((result, data) => data.InterviewID > 0 ? ++result : result, 0)} 个名单</div>
                            }
                            <div className="mb-16" style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Button
                                    type="primary" size="large"
                                    onClick={() => {
                                        let res = laborImportInterviewList[0].response;
                                        saveLaborSettle({
                                            BucketKey: res.bucket,
                                            FileName: res.name.substr(1, res.name.length),
                                            FileMd5: this.props.FileMd5 || '',
                                            RecordList: selectedRows.map(item => ({
                                                Reason: item.Reason,
                                                LaborSubsidyAmountReal: item.LaborSubsidyAmountReal,
                                                InterviewID: item.InterviewID
                                            }))
                                        }, {red: this.red});
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
                                            row.push(item.PositionName);
                                            row.push(item.CheckInTime);
                                            row.push(item.RealName);
                                            row.push({type: 'text', value: item.IDCardNum});
                                            row.push(item.LaborSubsidyAmountRealStr);
                                            row.push(item.Reason);
                                            row.push(item.ErrorInfo);
                                            data.push(row);
                                        });
                                        let excel = xlsx({worksheets: [{data}]});
                                        toExcel(excel.base64);
                                    }}
                                    disabled={!this.props.RecordList || this.props.RecordList.filter((item) => !item.InterviewID).length === 0}>下载错误结果</Button>
                            </div>
                            <Alert
                                type="info" showIcon className="mb-16"
                                message={(
                                    <p>
                                        总<a style={{fontWeight: 600}}>{RowSum.Count || 0}</a>项，
                                        无效<a style={{fontWeight: 600}}>{RowSum.DisabledCount || 0}</a>项，
                                        有效<a style={{fontWeight: 600}}>{RowSum.EnableCount || 0}</a>项，
                                        已选<a style={{
                                        fontWeight: 600,
                                        color: 'red'
                                    }}>{selectedRowKeys.length}</a>项&nbsp;&nbsp;
                                        总额<a style={{fontWeight: 600}}>{(RowSum.Amount || 0) / 100}</a>元，
                                        无效总额<a
                                        style={{fontWeight: 600}}>{(RowSum.DisabledAmount || 0) / 100}</a>元，
                                        有效总额<a style={{fontWeight: 600}}>{(RowSum.EnableAmount || 0) / 100}</a>元，
                                        已选<a style={{
                                        fontWeight: 600,
                                        color: 'red'
                                    }}>{(selectedRowSum.Amount || 0) / 100}</a>元

                                        <a onClick={() => setParams(this.STATE_NAME, {
                                            selectedRowKeys: [],
                                            selectedRows: [],
                                            selectedRowSum: {}
                                        })}
                                           style={{marginLeft: 24}}>清空</a>
                                    </p>
                                )}/>
                            <Table
                                rowKey='rowKey' bordered={true} pagination={false}
                                columns={this.columns} loading={this.props.RecordListLoading}
                                dataSource={this.props.RecordList}
                                rowSelection={{
                                    onChange: (selectedRowKeys, selectedRows) => {
                                        setParams(this.STATE_NAME, {
                                            selectedRowKeys,
                                            selectedRows,
                                            selectedRowSum: selectedRows.reduce((pre, cur) => {
                                                pre.Amount += cur.LaborSubsidyAmountReal;
                                                return pre;
                                            }, {Amount: 0})
                                        });
                                    },
                                    selectedRowKeys,
                                    getCheckboxProps: record => ({disabled: !record.InterviewID})
                                }}/>
                        </Card>
                    </Spin>
                </div>
            </div>
        );
    }

    columns = [{
        title: '序号',
        dataIndex: 'rowKey'
    }, {
        title: '面试日期',
        dataIndex: 'CheckInTime'
    }, {
        title: '姓名',
        dataIndex: 'RealName'
    }, {
        title: '身份证',
        dataIndex: 'IDCardNum'
    }, {
        title: '企业',
        dataIndex: 'PositionName'
    }, {
        title: '劳务公司',
        dataIndex: 'ShortName'
    }, {
        title: '金额',
        dataIndex: 'LaborSubsidyAmountRealStr'
    }, {
        title: '备注',
        dataIndex: 'Reason'
    }, {
        title: '检测结果',
        dataIndex: 'ErrorInfo',
        render: (text, record) => <span
            style={{color: record.InterviewID > 0 ? 'green' : 'red'}}>{record.InterviewID > 0 ? '正常' : text}</span>
    }];

    thead = ['劳务公司', '企业', '面试日期', '姓名', '身份证', '金额', '备注', '检测结果'];
}