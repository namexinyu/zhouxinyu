import React from 'react';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
import openDialog from 'ACTION/Dialog/openDialog';
import Mapping_CallType from 'CONFIG/EnumerateLib/Mapping_CallType';
import Mapping_NeedTodoType from 'CONFIG/EnumerateLib/Mapping_NeedTodoType';
import getMemberScheduleMessageList from 'ACTION/Broker/MemberDetail/getMemberScheduleMessageList';
import getRecruitSimpleList from 'ACTION/Common/getRecruitSimpleList';
import getMemberEstimateApplyList from 'ACTION/Broker/MemberDetail/getMemberEstimateApplyList';
import createDispatchOrder from 'ACTION/Broker/MemberDetail/createDispatchOrder';
import setFetchStatus from "ACTION/setFetchStatus";
import closeMemberApply from 'ACTION/Broker/MemberDetail/closeMemberApply';
import replyFeedback from 'ACTION/Broker/MemberDetail/replyFeedback';
import renewMemberApply from 'ACTION/Broker/MemberDetail/renewMemberApply';
import getMemberStatusRecord from 'ACTION/Broker/MemberDetail/getMemberStatusRecord';
import answerKA from 'ACTION/Broker/MemberDetail/answerKA';
import resetState from 'ACTION/resetState';
import moment from 'moment';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
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

const {TextArea} = Input;
const FormItem = Form.Item;
const {Option} = Select;
const Panel = Collapse.Panel;
const {Column, ColumnGroup} = Table;

let cardBodyStyle = {
    height: '240px',
    overflowY: 'auto',
    overflowX: 'hidden'
};
const STATE_NAME = 'state_broker_member_detail_process';

class BlockDetailProcess extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showSendLocation: false
        };
    }

    componentWillMount() {
        let location = browserHistory.getCurrentLocation();
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            resetState(STATE_NAME);
            // 获取联系记录
            this.getMemberScheduleMessageList(this.props);
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    getMemberScheduleMessageList(props) {
        getMemberScheduleMessageList({
            UserID: props.userId
        });
    }

    handleSelectProcessItem(item) {
        if (item.MsgFlowID === this.props.currentProcessItem.MsgFlowID) {
            setParams(STATE_NAME, {
                currentProcessItem: ''
            });
        } else {
            // let mapperType = Mapping_NeedTodoType.needTodoTypeMapperToCallType[item.Type];
            switch (item.Type) {
                case 3: {
                    setParams(STATE_NAME, {
                        currentProcessStep: 'setPocket',
                        editPocketUserID: {value: this.props.userId + ''},
                        currentProcessItem: item
                    });
                    // if (this.props.currentEstimateApply) {
                    //     setParams(STATE_NAME, {
                    //         showApplyConfirm: true,
                    //         currentProcessItem: item
                    //     });
                    // } else {
                    //     setParams(STATE_NAME, {
                    //         currentProcessStep: 'processApply',
                    //         currentProcessItem: item
                    //     });
                    // }
                    break;
                }
                case 1: {
                    setParams(STATE_NAME, {
                        currentProcessItem: item,
                        // currentProcessStep: 'sendBus',
                        showSendBusConfirm: true
                    });
                    break;
                }
                case 5: {
                    setParams(STATE_NAME, {
                        currentProcessItem: item,
                        showKAAnswer: true
                    });
                    break;
                }
                default: {
                    setParams(STATE_NAME, {
                        currentProcessItem: item
                    });
                    break;
                }
            }
        }
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        let scheduleList = this.props.scheduleList;

        return (
            <div>
                <Row gutter={20}>
                    <Col span={24}>
                        <Card bordered={false} bodyStyle={{padding: '10px'}}
                        >
                            <Table scroll={{y: 400}}
                                   rowKey={record => (record.SourceKeyID.toString() + record.MsgFlowID.toString())}
                                   dataSource={scheduleList}
                                   pagination={false}
                                   size="middle"
                                   bordered={true}>
                                <Column
                                    title="生成时间"
                                    dataIndex="Time"
                                    render={(text, record, index) => {
                                        return (
                                            new Date(record.Time).Format('yyyy-MM-dd hh:mm')
                                        );
                                    }}
                                    width={180}
                                />
                                <Column
                                    title="手机"
                                    dataIndex="Phone"
                                    width={100}
                                />
                                <Column
                                    title="类型"
                                    dataIndex="Type"
                                    render={(text, record, index) => {
                                        return (
                                            Mapping_NeedTodoType.type[record.Type]
                                        );
                                    }}
                                    width={100}
                                />
                                <Column
                                    title="说明"
                                    dataIndex="Content"
                                    render={(text, record, index) => {
                                        return (
                                            record.Content
                                        );
                                    }}
                                />
                                <Column
                                    title="操作"
                                    dataIndex="Operate"
                                    render={(text, record, index) => {
                                        return (
                                            <Button htmlType="button" className="float-right"
                                                    type={this.props.currentProcessItem.MsgFlowID === record.MsgFlowID ? 'primary' : ''}
                                                    size="small" onClick={() => this.handleSelectProcessItem(record)}>
                                                {this.props.currentProcessItem.MsgFlowID === record.MsgFlowID ? '处理中' : '去处理'}
                                            </Button>
                                        );
                                    }}
                                    width={100}
                                />
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockDetailProcess);
