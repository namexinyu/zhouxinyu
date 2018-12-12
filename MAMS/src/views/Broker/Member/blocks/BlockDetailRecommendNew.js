import React from 'react';
import {browserHistory} from 'react-router';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberRecommendList from 'ACTION/Broker/MemberDetail/getMemberRecommendList';
import RegRule from 'UTIL/constant/regexRule';
import setParams from "ACTION/setParams";
import helpMemberRecommend from 'ACTION/Broker/MemberDetail/helpMemberRecommend';
import openDialog from "ACTION/Dialog/openDialog";
import Mapping_User from 'CONFIG/EnumerateLib/Mapping_User';

import {
    Button,
    Icon,
    Row,
    Col,
    Modal,
    message,
    Table,
    Select,
    Card,
    Form,
    Input,
    Collapse,
    DatePicker,
    Cascader,
    Tag
} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;
const Panel = Collapse.Panel;
const {Column, ColumnGroup} = Table;
const STATE_NAME = 'state_broker_member_detail_recommend_list';

class BlockDetailRecommend extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDetail: false,
            recommendList: [],
            isClose: false,
            showRecommend: false,
            showTableSpin: false
        };
    }

    componentWillMount() {
        getMemberRecommendList({
            UserID: this.props.userId
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.getMemberRecommendListFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'getMemberRecommendListFetch', 'close');
            this.setState({
                recommendList: nextProps.recommendList
            });
        }
    }

    handleDoSearch(e) {
      const keyWord = this.props.searchKey.value == null ? '' : this.props.searchKey.value.trim();
      const { recommendList, form } = this.props;

      form.validateFields(() => {
        if (RegRule.number.test(keyWord)) {
          form.setFields({
            searchKey: {
              value: keyWord,
              errors: [new Error('请输入姓名搜索')]
            }
          });
          return;
        }

        this.setState({
          recommendList: keyWord === '' ? recommendList : recommendList.filter((item) => {
            return item.Name.indexOf(keyWord) !== -1;
          })
        });

      });
    }


    handleRecommendInputChange(e, paramKey) {
        let temp = {};
        temp[paramKey] = e.target.value;
        setParams(STATE_NAME, temp);
    }

    handleClearSearchKey() {
        setParams(STATE_NAME, {
            searchKey: {
                value: ''
            }
        });
    }

    goToMemberDetail(record) {
        browserHistory.push({
            pathname: '/broker/member/detail/' + record.UserId,
            query: {
                memberName: record.Name
            }
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        let recommendList = this.state.recommendList;
        const {showTableSpin, showDetail, showRecommend} = this.state;
        return (

            <div>
                <Card bordered={false} bodyStyle={{padding: '10px'}}>
                    <Form>
                        <Row className="mb-8">
                            <Col span={8}>
                                <FormItem>
                                    {getFieldDecorator('searchKey', {
                                        rules: [{
                                          message: 'hello errror'
                                        }]
                                    })(
                                      <Input type="text" placeholder="输入被推荐人姓名"
                                                onPressEnter={() => this.handleDoSearch()}
                                                suffix={this.props.searchKey.value ? <Icon type="close-circle"
                                                                                           onClick={() => this.handleClearSearchKey()}/> : null}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={2}>
                                <FormItem>
                                    <Button className="ml-8" htmlType="button" type="primary"
                                            onClick={() => this.handleDoSearch()}>搜索</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Table scroll={{y: 400}} rowKey={record => (record.Name.toString() + record.Phone.toString())}
                           dataSource={recommendList}
                           pagination={false}
                           loading={showTableSpin}
                           size="middle"
                           bordered>
                        <Column
                            title="推荐时间"
                            dataIndex="Time"
                            render={(text, record, index) => {
                                return (new Date(record.Time).Format('yyyy-MM-dd hh:mm'));
                            }}
                            width="150"
                        />
                        <Column
                            title="推荐手机"
                            dataIndex="PhoneWhoRecommend"
                            width="100"
                        />
                        <Column
                            title="被推荐人"
                            dataIndex="Name"
                            width="100"
                            render={(text, record, index) => {
                              return (
                                record.IsOwn ? <div className="cursor-pointer" onClick={() => this.goToMemberDetail(record)}>
                                  <span className="color-primary">{text}</span>
                                </div> : text
                              );
                            }}
                        />
                        <Column
                            title="被推荐手机"
                            dataIndex="Phone"
                            width="100"
                            render={(text, record, index) => {
                              return text.replace(/\d{1,7}/, function(match) {
                                return new Array(match.length).join('*');
                              });
                            }}
                        />
                        <Column
                            title="是否入职"
                            dataIndex="RecruitSalary"
                            render={(text, record, index) => {
                                return (record.Status === 2 ? '已入职' : '未入职');
                            }}
                        />
                    </Table>
                </Card>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            searchKey: props.searchKey
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockDetailRecommend);
