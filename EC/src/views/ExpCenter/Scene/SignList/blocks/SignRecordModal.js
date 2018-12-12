import {Modal, Table} from 'antd';
import React from 'react';

export default class SignRecordModal extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    handleModalCancel() {
        this.props.onModalClose();
    }

    render() {
        return (
            <Modal title="签到记录" onOk={() => this.handleModalCancel()}
                   onCancel={() => this.handleModalCancel()}
                   footer={false}
                   visible={true}>
                <Table
                    style={{paddingTop: 0}}
                    columns={this.tableColumns()}
                    dataSource={this.props.record}
                    bordered={true}
                    pagination={false}>
                </Table>
            </Modal>
        );
    }

    tableColumns() {
        return [
            {title: '签到时间', dataIndex: 'CheckinTime'},
            {title: '真实姓名', dataIndex: 'UserName'},
            {title: '劳务', dataIndex: 'ShortName'},
            {title: '企业', dataIndex: 'RecruitName'},
            {title: '体验中心', dataIndex: 'HubName'}
        ];
    }

}