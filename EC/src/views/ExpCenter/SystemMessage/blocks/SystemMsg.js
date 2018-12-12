import React from 'react';
import {Row, Col, DatePicker, Button, Select, Table, Input, Popconfirm} from 'antd';
import {browserHistory} from 'react-router';
import 'LESS/pages/SystemMessage.less';
import getSystemMsg from 'ACTION/ExpCenter/SystemMessage';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
const HubManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;
const Option = Select.Option;

const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value}/>
            : value
        }
    </div>
);
class EditableTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '消息时间', dataIndex: 'DateTime', width: '25%',
            render: (text, record) => this.renderColumns(text, record, 'DateTime')
        }, {
            title: '体验中心', dataIndex: 'Name', width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'Name')
        }, {
            title: '系统消息', dataIndex: 'Content', width: '40%',
            render: (text, record) => this.renderColumns(text, record, 'Content')
        }];
    }
    renderColumns(text, record) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
            />
        );
    }
    render() {
        return <Table bordered dataSource={this.props.contentList ? this.props.contentList : []}
                      loading={this.props.loading}
                      columns={this.columns} />;
    }
}
export default class SystemMsg extends React.PureComponent {
    constructor(props) {
        super(props);


        this.state = {
            Date: "",
            HubList: []
        };
        this.handleGoPage = this.handleGoPage.bind(this);
        this.onChanges = this.onChanges.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.searchMsg = this.searchMsg.bind(this);
    }
    componentWillMount() {
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        getSystemMsg({Date: "", HubList: this.HubIDListALL});
        this.setState({
            HubList: Object.assign([], this.HubIDListALL)
        });
    }

    handleGoPage() {
        browserHistory.goBack();
    }
    onChanges(date, dateString) {
        this.setState({Date: dateString});
    }
    handleChange(value) {
        if(value) {
            this.setState({HubList: [Number(value)]});
        }
    }
    searchMsg() {
        getSystemMsg({Date: this.state.Date, HubList: this.state.HubList});
    }
    render() {
        return (
            <div>
                <div className='ivy-page-title' style={{marginBottom: "20px"}}>
                    <div className="ivy-title">系统消息</div>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                    <Button type='primary' className='title-btn'
                            onClick={this.handleGoPage}>返回
                    </Button>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-2" style={{overflow: "hidden"}}>
                            <Col span={8} className="h-100">
                                <DatePicker size="large" style={{width: "100%"}} onChange={this.onChanges} />
                            </Col>
                            <Col span={8} className="h-100">
                                <Select
                                    defaultValue="全部体验中心"
                                    style={{ width: 200, marginLeft: "30px", display: HubManager ? "block" : "none" }}
                                    size="large"
                                    onChange={this.handleChange}
                                >
                                    <Option value="">全部体验中心</Option>
                                    {
                                        (this.HubList || []).map((item, index)=>{
                                            return(
                                                <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right', paddingRight: "5px", marginBottom: "20px" }} className="h-100">
                                <Button type="primary" onClick={this.searchMsg}>查询</Button>
                            </Col>
                            <Col span={24} className="h-100">
                                <EditableTable loading={this.props.RecordListLoading} contentList = {this.props.RecordList}></EditableTable>
                            </Col>

                        </div>
                    </div>
                </Row>
            </div>
        );
    }
}