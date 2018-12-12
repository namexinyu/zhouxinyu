import React from 'react';
import { Row, Col, Button, Input, Card, Table } from 'antd';
import MemberDetailAction from 'ACTION/Assistant/MemberDetailAction';
import setFetchStatus from 'ACTION/setFetchStatus';
const { Column, ColumnGroup } = Table;
const STATE_NAME = 'state_ac_memberDetail';
const {
    getMemberRecommendList
} = MemberDetailAction;
class BlockRecommend extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            recommendList: [],
            searchKey: ''
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.getMemberRecommendListFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'getMemberRecommendListFetch', 'close');
            this.setState({
                recommendList: nextProps.recommendRecord
            });
        }
    }
    handleSearchKeyChange(e) {
        this.setState({
            searchKey: e.target.value
        });
    }
    handleDoSearch() {
        let keyWord = this.state.searchKey;
        let result = [];
        if (keyWord === '') {
            this.setState({
                recommendList: this.props.recommendRecord
            });
            return true;
        }
        if (/1[2-9][0-9]\d{8}/.test(keyWord)) {
            let list = this.props.recommendRecord;
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (item.Phone == keyWord) {
                    result.push(item);
                }
            }
        } else {
            let list = this.props.recommendRecord;
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (item.Name.toLowerCase().match(keyWord.toLowerCase()) || keyWord.toLowerCase().match(item.Name.toLowerCase())) {
                    result.push(item);
                }
            }
        }

        this.setState({
            recommendList: result
        });
    }
    render() {
        let recommendList = this.state.recommendList;
        return (
            <Card bordered={false} bodyStyle={{ padding: '10px' }}>
                <Row className="mb-8">
                    <Col span={8}>
                        <Input type="text" onChange={this.handleSearchKeyChange.bind(this)} value={this.state.searchKey} />
                    </Col>
                    <Col span={2}>
                        <Button className="ml-8" htmlType="button" type="primary" onClick={() => this.handleDoSearch()}>搜索</Button>
                    </Col>
                </Row>
                <Table scroll={{y: 400}} rowKey={record => (record.Name.toString() + record.Phone.toString())}
                       dataSource={recommendList}
                       pagination={false}
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
                    />
                    <Column
                        title="被推荐手机"
                        dataIndex="Phone"
                        width="100"
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
        );
    }
}

export default BlockRecommend;