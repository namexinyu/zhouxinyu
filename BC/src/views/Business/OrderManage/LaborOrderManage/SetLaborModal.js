import React from 'react';
import {
    Form,
    Input,
    Table,
    DatePicker,
    message,
    Modal
} from 'antd';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
const {TextArea} = Input;
const FormItem = Form.Item;

const SetLaborModal = ({ModalItem, LaborSimpleList, handleModalCancel, handleModalSubmit, setParams}) => {
    let sResult = '';
    return (
        <Modal
            title="设置劳务" 
            visible={ModalItem.Visible}
            onCancel={handleModalCancel} 
            confirmLoading={ModalItem.confirmLoading}
            bodyStyle={{height: 300, 'textAlign': 'center'}}
            onOk={() => {
                if (sResult) {
                    handleModalSubmit(sResult);
                }
            }}>
            <span className='ant-form-item-label mr-8 mb-8'>劳务公司: </span>
                            <AutoCompleteInput
                                textKey="ShortName" valueKey="LaborID"
                                dataSource={LaborSimpleList}
                                onChange={(value, text) => {
                                    sResult = Number.parseInt(value.value, 10);
                                    // setParams('state_business_factory', {LaborID: value});
                                }}/>
        </Modal>
    );
};

export default SetLaborModal;