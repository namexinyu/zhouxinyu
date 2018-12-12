import React from 'react';
import { Table, Icon, Row, Button, Form, message, Modal } from 'antd';
import moment from 'moment';
import oss from 'CONFIG/ossConfig';
import getClient from 'COMPONENT/AliyunUpload/getClient';
const IMG_PATH = oss.getImgPath();
class SubsidyAuditRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Uploadvalue: true,
            previewVisible: false,
            previewUrl: "",
            visible: false
        };
      }
    formItemLayout = {
        labelCol: { span: 8, offset: 0 },
        wrapperCol: { span: 16, offset: 0 }
    };

    formLayout = {
        sm: { span: 12, offset: 0 },
        md: { span: 8, offset: 0 },
        lg: { span: 6, offset: 0 }
    };
    ImgModal = (Item) => {
       this.setState({
        previewVisible: true,
        previewUrl: IMG_PATH + Item
       });
    }
    render() {

        const columns = [{
            title: '操作时间',
            dataIndex: 'CreateTime'
        }, {
            title: '操作人',
            dataIndex: 'EmployeeName'
        }, {
            title: '审核状态',
            dataIndex: 'AuditStatus',
            render: (text) => <span>{text == 1 ? "新建待审核" : text == 2 ? "待审核" : text == 3 ? "审核通过" : text == 4 ? "审核作废" : "取消作废"}</span>
        }, {
            title: "备注",
            dataIndex: "Remark"
        }, {
            title: '上传图片',
            dataIndex: 'PicPathList',
            render: (text) => {
                return <div>
                    {
                        (text || []).map((Item) => {
                            return <Icon style={{fontSize: "20px"}} onClick={() => this.ImgModal(Item)} type="picture" />;
                        })
                    }
                </div>;
                
            }
        }];
        const FormItem = Form.Item;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal width={640} title="补贴审核记录"
                visible={this.props.visible}
                footer={false}
                onOk={() => this.props.handleModalConfirm(false)}
                onCancel={() => this.props.handleModalConfirm(false)}>
                <Table
                    pagination={false}
                    columns={columns}
                    dataSource={this.props.RecordList} />
                <Button style={{margin: "2% 0 0 86%"}} onClick={() => this.props.handleModalConfirm(false)} type="primary">知道了</Button>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>this.setState({previewVisible: false})}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewUrl} />
                </Modal>
            </Modal>  
        );
    }
}

export default Form.create()(SubsidyAuditRecord);