import React from 'react';
import {
    Form,
    Input,
    Table,
    DatePicker,
    message,
    Modal
} from 'antd';
import "LESS/Business/OrderManage/interviewlist-page.less";

const {TextArea} = Input;
const FormItem = Form.Item;

const columns = [
    {title: '企业名称', dataIndex: 'PositionName'},
    {
        title: '收费', dataIndex: 'EnrollFees',
        render: text => text && text.map((item, index) =>
            <div key={index}>
                {`${item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}，${item.ChargeAmount / 100}元`}
            </div>
        )
    },
    {
        title: '补贴', dataIndex: 'RecruitSubsidys',
        render: text => text && text.map((item, index) =>
            <div key={index}>
                {`${item.Gender === 1 ? '男' : item.Gender === 2 ? '女' : '男女不限'}：${item.SubsidyDay}天返${item.SubsidyAmount / 100}元`}
            </div>
        )
    },
    {
        title: '补贴类型', dataIndex: 'SubsidyType',
        render: (text, record) => {
            const SubsidyTypeMap = {
                1: '在职日',
                2: '工作日'
            };
            return (
                <span style={{color: text === 2 ? 'red' : 'inherit'}}>{SubsidyTypeMap[text] || ''}</span>
            );
        }
    },
    {
        title: '赠品', dataIndex: 'Gifts',
        render: text => text && text.map((item, index) => <div key={index}>{`${item.GiftName}，押金${item.HoldCash / 100}元`}</div>)
    },
    {title: '生成时间', dataIndex: 'CreateTime'}
];


const BindSubsidyModal = ({BindSubsidyModalItem, Date, handleModalCancel, handleModalSubmit, setParams}) => {
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 18}};
    return (
        <Modal
            title="绑定会员报价" visible={BindSubsidyModalItem.Visible}
            onCancel={handleModalCancel} confirmLoading={BindSubsidyModalItem.confirmLoading}
            onOk={() => {
                if (BindSubsidyModalItem.selectedRecruit && BindSubsidyModalItem.selectedRecruit.RecruitID) {
                    handleModalSubmit();
                } else {
                    message.error('点击列表选中一个报价');
                }
            }}>
            <span className='ant-form-item-label mr-8 mb-8'>日期: </span><DatePicker defaultValue={Date} disabled/>
            <Table
                pagination={false} className="bindsubsidy-table"
                rowKey={'RecruitID'} bordered={true} size='small' columns={columns}
                onRowClick={record => setParams('BindSubsidyModalItem', {selectedRecruit: record})}
                rowClassName={record => record.RecruitID === BindSubsidyModalItem.selectedRecruit.RecruitID ? 'bg-blue' : ''}
                dataSource={BindSubsidyModalItem.RecruitList}
            />
            <span className='ant-form-item-label mr-8 mt-8'>备注: </span>
            <TextArea value={BindSubsidyModalItem.Remark} style={{minHeight: 32}}
                      placeholder="请填写备注" rows={4}
                      onChange={(e) => {
                          setParams('BindSubsidyModalItem', {Remark: e.target.value || ''});
                      }}/>
        </Modal>
    );
};

export default BindSubsidyModal;