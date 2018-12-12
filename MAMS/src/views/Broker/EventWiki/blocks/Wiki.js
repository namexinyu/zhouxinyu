import React from 'react';
import {Button, Table, message, Modal, Form, Row, Col, Select, Tabs, Radio, Input, Pagination } from 'antd';
import setParams from "ACTION/setParams";
const STATE_NAME = "state_broker_eventqueryWiki";
import Wikis from 'SERVICE/Wiki/index';
import { options } from 'preact';
import {browserHistory} from 'react-router';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
class Wiki extends React.PureComponent {
    constructor(props) {
        super(props);  
        this.state = {
            TabsList: [],
            RecordList: [],
            record: "",
            QryDoc: [],
            total: 0
        };
    }
    componentDidMount () {
        Wikis.GetCategories().then((data) => {
            if (this.props.recruitFilterList.activeKey == "搜索结果") {
                let TabsList = this.props.recruitFilterList.TabsList;
                Wikis.GetQryDoc({
                    Text: this.props.recruitFilterList.value, 
                    RecordIndex: (this.props.recruitFilterList.page - 1) * this.props.recruitFilterList.pageSize, 
                    RecordSize: this.props.recruitFilterList.pageSize
                }).then((data) => {
                    if (TabsList[TabsList.length - 1] !== "搜索结果") {
                        TabsList.push("搜索结果");
                    }
                    setParams(STATE_NAME, {
                        activeKey: "搜索结果"
                    });
                    this.setState({
                        TabsList: TabsList,
                        RecordList: data.Data.RecordList || [],
                        total: data.Data.RecordCount || 0
                    });
                });
            } else {
                Wikis.GetDocList({
                    Category: (this.props.recruitFilterList.activeKey == "搜索结果" ? this.props.recruitFilterList.value : this.props.recruitFilterList.activeKey) || data.Data.RecordList[0], 
                    RecordIndex: (this.props.recruitFilterList.page - 1) * this.props.recruitFilterList.pageSize, 
                    RecordSize: this.props.recruitFilterList.pageSize
                }).then((data) => {
                    this.setState({
                        RecordList: data.Data.RecordList,
                        total: data.Data.RecordCount
                    });
                });
                let list = data.Data.RecordList;
                setParams(STATE_NAME, {
                    activeKey: this.props.recruitFilterList.activeKey || data.Data.RecordList[0],
                    page: this.props.recruitFilterList.page,
                    pageSize: this.props.recruitFilterList.pageSize,
                    TabsList: list
                });
            }
        });
    }
    _filterOption = (input, option) => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    add = (e) => {
        setParams(STATE_NAME, {
            activeKey: e,
            page: 1,
            pageSize: 10
        });
        if (e == "搜索结果") {
            Wikis.GetQryDoc({
                Text: this.props.recruitFilterList.value, 
                RecordIndex: 0,
                RecordSize: 10
            }).then((data) => {
                setParams(STATE_NAME, {
                    activeKey: "搜索结果"
                });
                this.setState({
                    RecordList: data.Data.RecordList,
                    total: data.Data.RecordCount
                });
            });
        } else {
            Wikis.GetDocList({
                Category: e, 
                RecordIndex: 0, 
                RecordSize: 10
            }).then((data) => {
                this.setState({
                    RecordList: data.Data.RecordList || [],
                    total: data.Data.RecordCount || []
                });
            });
        }
        
    }
    onChange = (value) => {
        setParams(STATE_NAME, {
            value: value
        });
        Wikis.GetTopSearch({Text: value}).then((data) => {
            console.log(data);
            this.setState({
                QryDoc: data.Data.RecordList || []
            });
        });
    }
    handleSearchList = (value, item) => {
        console.log(item);
        browserHistory.push({
            pathname: '/broker/event-management/Wiki/' + item.props.DocID
        });
    }
    onClick = (value, item) => {
        console.log(item);
        browserHistory.push({
            pathname: '/broker/event-management/Wiki/' + value
        });
    }
    page = (page, pageSize) => {
        let recruitFilterList = this.props.recruitFilterList;
        if (this.props.recruitFilterList.activeKey == "搜索结果") {
            let TabsList = this.props.recruitFilterList.TabsList;
            Wikis.GetQryDoc({
                Text: this.props.recruitFilterList.value, 
                RecordIndex: (page - 1) * pageSize, 
                RecordSize: pageSize
            }).then((data) => {
                if (TabsList[TabsList.length - 1] !== "搜索结果") {
                    TabsList.push("搜索结果");
                }
                setParams(STATE_NAME, {
                    activeKey: "搜索结果",
                    page: page,
                    TabsList,
                    pageSize: pageSize
                });
                this.setState({
                    RecordList: data.Data.RecordList || [],
                    total: data.Data.RecordCount || 0
                });
            });
        }else {
            Wikis.GetDocList({
                Category: recruitFilterList.activeKey == "搜索结果" ? recruitFilterList.value : recruitFilterList.activeKey, 
                RecordIndex: (page - 1) * pageSize, 
                RecordSize: pageSize
            }).then((data) => {
                this.setState({
                    RecordList: data.Data.RecordList,
                    total: data.Data.RecordCount
                });
                setParams(STATE_NAME, {
                    page: page,
                    pageSize: pageSize
                });
            });
        }
    }
    handleSearch = () => {
        let TabsList = this.props.recruitFilterList.TabsList;
        Wikis.GetQryDoc({
            Text: this.props.recruitFilterList.value, 
            RecordIndex: 0,
            RecordSize: 10
        }).then((data) => {
            if (TabsList[TabsList.length - 1] !== "搜索结果") {
                TabsList.push("搜索结果");
            }
            setParams(STATE_NAME, {
                activeKey: "搜索结果",
                TabsList,
                page: 1,
                pageSize: 10
            });
            this.setState({
                RecordList: data.Data.RecordList || [],
                total: data.Data.RecordCount || 0
            });
        });
    }

    render() {
        const text = <ul>
            {this.state.RecordList.map((item, index) => {
                return <li key={index} style={{overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                    margin: "10px 0",
                    whiteSpace: "nowrap"}} 
                    onClick={() => this.onClick(item.DocID)}>{(
                        this.props.recruitFilterList.page - 1) * this.props.recruitFilterList.pageSize + index + 1 + "." + item.Title
                    }
                </li>;
            })}
        </ul>;
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <div className='ivy-page-title'>
                    <div className="ivy-title">事件百科</div>
                </div>
                <div style={{background: "#fff", padding: "20px 20px", margin: "60px 20px"}}>
                    <div style={{margin: "2% 0"}}>
                        <div style={{display: "flex", justifyContent: "center", position: "relative"}}>
                            <Select
                                style={{ width: 400 }}
                                showSearch={true}
                                placeholder=''
                                defaultActiveFirstOption={false}
                                onSearch={this.onChange}
                                onSelect={(value, item) => this.handleSearchList(value, item)}
                                mode="combobox"
                                notFoundContent=""
                                value={this.props.recruitFilterList.value}
                                showArrow={false}
                                filterOption={false}
                                >
                                {
                                    (this.state.QryDoc || []).map((item, i) => {
                                    return (
                                        <Option key={item.DocID} DocID={item.DocID}
                                        value={item.Title}>{item.Title}</Option>
                                    );
                                    })
                                }
                            </Select>
                        <Button style={{margin: "0 0", borderRadius: "0 4px 4px 0"}} type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
                    </div>
                    </div>
                    <Tabs
                        defaultActiveKey="1"
                        style={{ height: 400 }}
                        activeKey={this.props.recruitFilterList.activeKey}
                        onChange={(e) => this.add(e)} >
                        {
                            (this.props.recruitFilterList.TabsList || []).map((item) => {
                                return <TabPane tab={item} key={item}>{text || []}</TabPane>;
                            })
                        }
                    </Tabs>
                    {this.state.RecordList.length > 0 && <Pagination
                        style={{margin: "2% 0 0 0"}}
                        current={this.props.recruitFilterList.page} 
                        pageSize={this.props.recruitFilterList.pageSize} 
                        onChange={(page, pageSize) => this.page(page, pageSize)} 
                        total={this.state.total}
                        showTotal={(total, range) => `第${range[0]}-${range[1]} 条 共 ${total} 条`} />}
                </div>
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
    //   const {
    //     Name,
    //     Mobile,
    //     RecruitName,
    //     EventNumber,
    //     DealStatus,
    //     DiplomatName,
    //     InterviewDate,
    //     CreatedTime,
    //     Department
    //   } = props.eventListInfo.pageQueryParams;
  
    //   return {
    //     Name,
    //     Mobile,
    //     RecruitName,
    //     EventNumber,
    //     DealStatus,
    //     DiplomatName,
    //     InterviewDate,
    //     CreatedTime,
    //     Department
    //   };
    },
    onFieldsChange(props, fields) {
      setParams(STATE_NAME, {
        pageQueryParams: Object.assign({}, props.eventListInfo.pageQueryParams, fields)
      });
    }
  })(Wiki);