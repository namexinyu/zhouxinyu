import React from 'react';
import {
    Form,
    Input,
    Table,
    DatePicker,
    message,
    Radio,
    Row,
    Modal
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
const {TextArea} = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const SetStatusModal = ({ModalItem, handleModalCancel, handleModalSubmit, changeStatus}) => {
    return (
        <Modal
            title="补贴审核" 
            visible={ModalItem.Visible}
            onCancel={handleModalCancel} 
            confirmLoading={ModalItem.confirmLoading}
            onOk={() => {
                    handleModalSubmit();
            }}>
            <Row>
                <span className='ant-form-item-label mr-8 mb-8'>审核结果: </span>
                <RadioGroup onChange={(e) => {changeStatus('status', e.target.value);}} value={ModalItem.AuditResult}>
                    <Radio value={3}>通过</Radio>
                    <Radio value={2}>拒绝</Radio>
                </RadioGroup>   
            </Row>
            <Row style={{display: ModalItem.AuditResult === 2 ? "block" : 'none'}}>
                <span className='ant-form-item-label mr-8 mb-8'>备注: </span>
                <TextArea value={ModalItem.Remark} style={{minHeight: 32}}
                      placeholder="请填写备注" rows={4}
                      onChange={(e) => {
                        changeStatus('Remark', e.target.value || '');
                      }}/>
            </Row>
                   
        </Modal>
    );
};

export default SetStatusModal;