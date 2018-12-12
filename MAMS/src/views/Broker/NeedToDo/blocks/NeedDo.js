import React from 'react';
import {
    Row,
    Col,
    Form,
    Select,
    DatePicker,
    Button,
    Input,
    Table,
    Card,
    Modal,
    Upload,
    Icon,
    Alert,
    Checkbox
} from 'antd';
import getNeedToDoData from 'ACTION/Broker/NeedToDo/NeedToDoData';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';

const STATE_NAME = 'state_need_to_do_data';
import stateObjs from "VIEW/StateObjects";
import "LESS/pages/need-do.less";
import fac from 'COMPONENT/FUCTIONS';

const {chooseType} = fac;
const FormItem = Form.Item;
const {Option} = Select;
import moment from 'moment';
import { isArray } from 'util';

const RangePicker = DatePicker.RangePicker;
moment.locale('zh-cn');
let initParams = {};
let chooseTypeArr = [];



class EditableTable extends React.PureComponent { // table组件
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_need_to_do_data';
        this.state = {
            mation: [],
            may: {
                display: 'none'
            }
        };
        this.columns = [
            {
                title: '序号', key: 'seqNo', width: '3.5%',
                render: (text, record, index) => {
                    return (index + 1) + this.props.contentList.pageSize * (this.props.contentList.currentPage - 1);
                }
            },
            {
                title: '生成时间',
                dataIndex: 'CreateTime',
                width: '15%'
            }, {
                title: '会员姓名',
                dataIndex: 'UserName',
                width: '15%'
            }, {
                title: '需求类型',
                dataIndex: 'MsgType',
                width: '65%',
                render: (text, record) =>
                    <div>
                            {
                                record['CountMsg'].map((item, index)=>{
                                    let baby = '';
                                    switch (item.MsgType)
                                     {
                                         case 1 :
                                           baby = '一键导航';
                                         break;
                                         case 2 :
                                           baby = '注册';
                                         break;
                                         case 3 :
                                           baby = '报名';
                                         break;
                                         case 4 :
                                           baby = '关注';
                                         break;
                                         case 5 :
                                           baby = '提问';
                                         break;
                                         case 6 :
                                           baby = '反馈';
                                         break;
                                         case 7 :
                                           baby = '求助';
                                         break;
                                         case 8 :
                                           baby = '划转';
                                         break;
                                     }
                                    return (
                                        <span key={index} style={{color: 'white', background: '#108ee9', marginRight: '5px', padding: '3px', borderRadius: '1px'}}>
                                             {baby} {'' + item.Count}
                                       </span>
                                    );
                                })
                            }
                    </div>
                
            }];
        this.handleClickUser = this.handleClickUser.bind(this);
    }
    componentWillMount() {
        this.kuy();
    }
   
    handleClickUser(record, index, event) {
        if (record.UserID) {
            browserHistory.push({
                pathname: '/broker/member/detail/' + record.UserID,
                query: {
                    memberName: record.UserName
                }
            });
        }
    }
kuy=()=> {
    let params = this.props.contentList;
    getNeedToDoData({
        RecordSize: params['pageSize'],
        RecordIndex: (params['currentPage'] - 1) * params['pageSize']
    });
}
componentDidUpdate() {
   this.kuy();
}
    render() {
        let goodlike = this.props.contentList;
        return (
            <div>
                <Table className="need-do-table" onRowClick={this.handleClickUser}
                       bordered dataSource={goodlike['getNeedToDoData']} columns={this.columns}
                       pagination={{
                        total: goodlike['totalSize'],
                        pageSize: goodlike['pageSize'],
                        current: goodlike['currentPage'],
                        onChange: (page, pageSize) => {
                            setParams(this.STATE_NAME, {currentPage: page});
                        },
                        onShowSizeChange: (current, size) => setParams(this.STATE_NAME, {pageSize: size, currentPage: current}),
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['20', '40', '80'],
                        showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
             }}
                       /> 
            </div>
        );
    }
}


class NeedDoDetails extends React.PureComponent {
    constructor(props) {
        super(props);
    }
   
    componentWillMount() {
    }

    render() {
        return (
            <div>
                <Card bordered={false}>
                    <div className="fc-line"></div>
                    <EditableTable contentList={this.props} QueryParams={this.props.QueryParams}
                                   RecordCount={this.props.RecordCount}></EditableTable>
                </Card>
            </div>
        );
    }
}


export default NeedDoDetails;
