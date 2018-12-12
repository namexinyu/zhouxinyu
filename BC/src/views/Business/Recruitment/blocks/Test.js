import React from 'react';
import {
    Row,
    Col,
    Card,
    Input,
    Icon,
    Form,
    Select,
    Table,
    Button,
    DatePicker,
    Popconfirm,
    message
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
import {HttpRequest, env} from 'mams-com';
import CommonAction from 'ACTION/Business/Common';
import moment from 'moment';

const API_URL = env.api_url;
const FormItem = Form.Item;
const {Option} = Select;
const {getRecruitSimpleList} = CommonAction;

const EditableCell = ({editable, value, onChange}) => (
    <div>
        {editable
            ? <Input style={{margin: '-5px 0'}} value={value} onChange={e => onChange(e.target.value)}/>
            : value
        }
    </div>
);

class Test extends React.PureComponent {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '性别（0男女不限1男2女）', dataIndex: 'Gender', width: '30%',
                render: (text, record) => this.renderColumns(text, record, 'Gender')
            },
            {
                title: '结算金额（单位-分）', dataIndex: 'SubsidyAmount', width: '25%',
                render: (text, record) => this.renderColumns(text, record, 'SubsidyAmount')
            },
            {
                title: '结算天数', dataIndex: 'SubsidyDay', width: '25%',
                render: (text, record) => this.renderColumns(text, record, 'SubsidyDay')
            },
            {
                title: '操作', dataIndex: 'aa', width: '20%',
                render: (text, record) => <a onClick={() => {
                    this.state.RecordList.splice(record.key, 1);
                    this.setState({
                        RecordList: [...this.state.RecordList]
                    });
                }
                }>删除</a>
            }];
        this.state = {RecordList: [], Date: moment()};
    }

    componentWillMount() {
        getRecruitSimpleList();
    }


    handleQuery = () => {
        let Recruit = this.state.Recruit;
        if (!Recruit || !Recruit.data) {
            message.error('请选择企业');
            return;
        }

        this.setState({RecordList: [], SubsidyVersionID: 0});
        HttpRequest.post({
            url: API_URL + '/BZ_RecruitInfo/BZ_RCIF_GetHistoryRecruitQuotes',
            params: {
                Date: this.state.Date.format('YYYY-MM-DD'), RecruitTmpID: Recruit.data.RecruitTmpID
            }
        }).then((res) => {
            this.setState({
                RecordList: res.Data.SubsidyList.map((item, index) => {
                    item.key = index;
                    return item;
                }),
                SubsidyVersionID: res.Data.SubsidyVersionID || 0
            });
        }).catch((err) => {
            message.error(err);
            this.setState({RecordList: [], SubsidyVersionID: 0});
        });
    };

    handleCommit = () => {
        console.log(this.state);
        let Recruit = this.state.Recruit;
        if (!Recruit || !Recruit.data) {
            message.error('请选择企业');
            return;
        }
        HttpRequest.post({
            url: API_URL + '/BZ_RecruitInfo/BZ_RCIF_SetHistoryRecruitQuotes',
            params: {
                Date: this.state.Date.format('YYYY-MM-DD'),
                RecruitTmpID: Recruit.data.RecruitTmpID,
                SubsidyVersionID: this.state.SubsidyVersionID,
                SubsidyList: this.state.RecordList.map((item) => {
                    return {Gender: item.Gender, SubsidyAmount: item.SubsidyAmount, SubsidyDay: item.SubsidyDay};
                })
            }
        }).then((res) => {
            message.success('提交成功');
            this.handleQuery();
        }).catch((err) => message.error(err));
    };

    handleDateChange = (value) => this.setState({Date: value});

    handleRecruitChange = (value) => this.setState({Recruit: value});

    handleAdd = () => {
        const RecordList = this.state.RecordList || [];
        const newData = {
            Gender: 1,
            SubsidyAmount: 0,
            SubsidyDay: 0,
            key: RecordList.length
        };
        this.setState({RecordList: [...RecordList, newData]});
    };

    handleChange(value, key, column) {
        this.state.RecordList[key][column] = Number(value);
        this.setState({RecordList: [...this.state.RecordList]});
    }

    renderColumns(text, record, column) {
        return (
            <EditableCell
                editable={true} value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }

    render() {
        const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 16}};

        return (
            <div>
                <div className="ivy-page-title">
                    <h1>补贴</h1>
                </div>

                <div className="container-fluid pt-24 pb-24">
                    <Card bordered={false} className="mb-24">
                        <Form>
                            <Row gutter={32} type="flex" justify="start">
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="日期">
                                        <DatePicker placeholder="选择日期" format="YYYY-MM-DD"
                                                    value={this.state.Date} allowClear={false}
                                                    onChange={this.handleDateChange}
                                        />
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="企业">
                                        <AutoCompleteInput
                                            value
                                            textKey="RecruitName" valueKey="RecruitTmpID"
                                            onChange={this.handleRecruitChange}
                                            dataSource={this.props.RecruitSimpleList}/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mb-24" span={23} style={{textAlign: 'right'}}>
                                    <Button type="primary" onClick={this.handleQuery}>查询</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    <Card>
                        <Table
                            title={() => <Button onClick={this.handleAdd}>新增</Button>}
                            footer={() => <Button onClick={this.handleCommit}>提交</Button>}
                            rowKey={'key'} bordered={true} columns={this.columns}
                            dataSource={this.state.RecordList}/>
                    </Card>
                </div>
            </div>
        );
    }
}

export default Test;