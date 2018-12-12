import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import { browserHistory } from 'react-router';
import { Card, Row, Col, Button, Table } from 'antd';
import setParams from 'ACTION/setParams';

const { Column, ColumnGroup } = Table;

class ReviewContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showTableSpin: false
        };
    }
    handleGoReview(record) {
        browserHistory.push({
            pathname: '/audit/operate/review/edit/' + record.id
        });
    }
    render() {
        const { showTableSpin } = this.state;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>错误重审</h1>
                </div>
                <Card bordered={false}>
                    <Table rowKey={record => record.id.toString()}
                        dataSource={[{ id: 1 }, { id: 2 }]}
                        pagination={false}
                        loading={showTableSpin}>
                        <Column
                            title="上传时间"
                            dataIndex="a" />
                        <Column
                            title="类型"
                            dataIndex="b" />
                        <Column
                            title="姓名"
                            dataIndex="c" />
                        <Column
                            title="错误状况"
                            dataIndex="d" />
                        <Column
                            title="操作"
                            dataIndex="e"
                            render={(text, record, index) => {
                                return (
                                    <a href="javascript:void(0)" onClick={() => this.handleGoReview(record)}>重新审核</a>
                                );
                            }} />
                    </Table>
                </Card>
            </div>
        );
    }
}

export default ReviewContainer;