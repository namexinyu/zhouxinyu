import React from 'react';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberRecommendList from 'ACTION/Broker/MemberDetail/getMemberRecommendList';
import RegRule from 'UTIL/constant/regexRule';
import setParams from "ACTION/setParams";
import helpMemberRecommend from 'ACTION/Broker/MemberDetail/helpMemberRecommend';
import openDialog from "ACTION/Dialog/openDialog";
import Mapping_User from 'CONFIG/EnumerateLib/Mapping_User';

import { Button, Icon, Row, Col, Modal, message, Table, Select, Card, Form, Input, Collapse, DatePicker, Cascader, Tag } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const { Column, ColumnGroup } = Table;
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.getMemberRecommendListFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'getMemberRecommendListFetch', 'close');
            this.setState({
                recommendList: nextProps.recommendList
            });
        }
        if (nextProps.helpMemberRecommendFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'helpMemberRecommendFetch', 'close');
            this.setState({
                showRecommend: false
            });
            let data = nextProps.helpMemberRecommendFetch.response.Data;
            if (data && data.ImportSuccessCount) {
                message.success('代推荐成功');
            }else if (data && data.ImportedCount) {
                message.error('代推荐失败，该用户已经注册');
            }else {
                message.success('代推荐成功');
            }
            setParams(STATE_NAME, {
                createRecommendName: '',
                createRecommendPhone: ''
            });
            getMemberRecommendList({
                UserID: nextProps.userId
            });
        }
        if (nextProps.helpMemberRecommendFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'helpMemberRecommendFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.helpMemberRecommendFetch.response.Desc
            });
        }
    }

    handleChangeClose(b) {
        this.setState({
            isClose: b
        });
    }

    handleCollapseChange(e) {
        this.setState({
            showDetail: !!(e.length && e.length > 0)
        });
        if (e.length && e.length > 0) {
            getMemberRecommendList({
                UserID: this.props.userId
            });
        }
    }

    handleDoSearch(e) {
        e.stopPropagation();
        let keyWord = this.props.searchKey.value;
        let result = [];
        if (keyWord === '') {
            this.setState({
                recommendList: this.props.recommendList
            });
            return true;
        }
        if (RegRule.mobile.test(keyWord)) {
            let list = this.props.recommendList;
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (item.Phone == keyWord) {
                    result.push(item);
                }
            }
        } else {
            let list = this.props.recommendList;
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

    handleCtrlRecommendBox(e) {
        e.stopPropagation();
        this.setState({
            showRecommend: true
        });
        setParams(STATE_NAME, {
            createRecommendName: {
                value: ''
            },
            createRecommendPhone: {
                value: ''
            }
        });
    }

    handleRecommendInputChange(e, paramKey) {
        let temp = {};
        temp[paramKey] = e.target.value;
        setParams(STATE_NAME, temp);
    }

    handleModalOk() {
        this.props.form.validateFieldsAndScroll(['createRecommendName', 'createRecommendPhone'], (errors, values) => {
            if (!errors) {
                helpMemberRecommend({
                    Phone: this.props.createRecommendPhone.value || '',
                    Name: this.props.createRecommendName.value || '',
                    UserID: this.props.userId
                });
            }
        });
    }
    handleModalCancel() {
        this.setState({
            showRecommend: false
        });
    }
    handleClearSearchKey(e) {
        e.stopPropagation();
        setParams(STATE_NAME, {
            searchKey: {
                value: ''
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        let recommendList = this.state.recommendList;
        const { showTableSpin, showDetail, showRecommend } = this.state;
        return (
            <div>
                <Collapse onChange={this.handleCollapseChange.bind(this)}>
                    <Panel header={
                        <div>
                            <span>推荐列表</span>
                            <div className="float-right">
                                {showDetail && <div style={{ display: 'inline-block' }} className="mr-8">
                                    {getFieldDecorator('searchKey', {
                                        rules: []
                                    })(<Input type="text" placeholder="输入被推荐人姓名或手机号" onClick={(e) => (e.stopPropagation())} onFocus={(e) => (e.stopPropagation())}
                                        suffix={this.props.searchKey.value ? <Icon type="close-circle" onClick={(e) => this.handleClearSearchKey(e)} /> : null} />)}
                                </div>}
                                {showDetail && <div style={{ display: 'inline-block' }} className="mr-16" >
                                    <Button htmlType="button" size="small" onClick={(e) => this.handleDoSearch(e)}>搜索</Button>
                                </div>}
                                <Button htmlType="button" type="primary" size="small" className="mr-8" onClick={(e) => this.handleCtrlRecommendBox(e, true)}>代推荐</Button>
                                <span className="color-primary mr-16">查看</span>
                            </div>
                        </div>
                    } key="1">
                        <Table scroll={{ y: 240 }} rowKey={record => (record.Name.toString() + record.Phone.toString())}
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
                                title="被推荐人"
                                dataIndex="Name"
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
                    </Panel>
                </Collapse>
                <Modal
                    title={'代' + this.props.userName + '做推荐'}
                    visible={showRecommend}
                    onOk={this.handleModalOk.bind(this)}
                    onCancel={this.handleModalCancel.bind(this)}>
                    <Row>
                        <Col span={24}>
                            <FormItem label="注册姓名" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                {getFieldDecorator('createRecommendName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '会员姓名必填'
                                        },
                                        {
                                            pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                            message: '姓名必须为中文或英文字符'
                                        }
                                    ]
                                })(<Input maxLength="6" type="text" placeholder="请输入被推荐者的姓名" />)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="被推荐人电话" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                                {getFieldDecorator('createRecommendPhone', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '手机号码必填'
                                        },
                                        {
                                            pattern: /^1[0-9][0-9]\d{8}$/,
                                            message: '请输入正确的11位手机号'
                                        }
                                    ]
                                })(<Input maxLength="11" type="tel" placeholder="请输入被推荐者的手机号码" />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
            </div>

            // <div className="container-fluid">
            //     <div className="card">
            //         <div className="card-header">推荐列表
            //             {/* this.state.showDetail &&
            //             <button className={'btn btn-sm ml-4' + (this.state.isClose ? ' btn-secondary' : ' btn-dark')}
            //                     onClick={() => this.handleChangeClose(false)}>未结算
            //             </button> */}
            //             {/* this.state.showDetail &&
            //             <button className={'btn btn-sm ml-1' + (this.state.isClose ? ' btn-dark' : ' btn-secondary')}
            //                     onClick={() => this.handleChangeClose(true)}>已结算
            //             </button> */}
            //             <div className="float-right input-group-sm">
            //                 {this.state.showDetail && <div className="d-inline-block">
            //                     <span className="d-inline-block">
            //                         <input type="tel" className="form-control" placeholder="输入被推荐人姓名或手机号"
            //                                ref="recommendKeyWord"/>
            //                     </span>
            //                     <button className="d-inline-block ml-1 btn btn-sm btn-secondary"
            //                             style={{cursor: 'pointer', lineHeight: 1}}
            //                             onClick={() => this.handleDoSearch()}>搜索
            //                     </button>
            //                 </div>}
            //                 <span className="btn btn-sm btn-info ml-3" style={{lineHeight: 1}}
            //                       onClick={() => this.handleCtrlRecommendBox(true)}>代推荐</span>
            //                 <span className="d-inline-block ml-5" onClick={() => this.handleSeeAccount()}>查看</span>
            //             </div>
            //         </div>
            //     </div>
            //     <div className={'card-body pt-0 pl-0 pr-0 pb-0' + (this.state.showDetail ? '' : ' d-none')}>
            //         <table className="table table-hover table-bordered mt-0 mb-0">
            //             <thead>
            //             <tr>
            //                 <th>推荐时间</th>
            //                 <th>被推荐人</th>
            //                 {/* <th>是否归属自己</th> */}
            //                 {/* <th>被推荐人电话号码</th> */}
            //                 {/*
            //                     todo 暂时隐藏这一列
            //                     <th>推荐类型</th>
            //                  */}
            //                 <th>是否入职</th>
            //             </tr>
            //             </thead>
            //             <tbody>
            //             {
            //                 recommendList.map((item, i) => {
            //                     return (
            //                         <tr key={i} className={item.IsClose == this.state.isClose ? '' : ''}>
            //                             <td>{item.Time}</td>
            //                             <td>{item.Name}</td>
            //                             {/* <td>{item.IsOwn ? '是' : '否'}</td> */}
            //                             {/* <td>{item.Phone.substr(0, 3) + '****' + item.Phone.substr(7, 4)}</td> */}
            //                             {/*
            //                             todo 暂时隐藏这一列
            //                             <td>{Mapping_User.eRecommendSource[item.Source]}</td>
            //                             */}
            //                             <td>{item.Status === 2 ? '已入职' : '未入职'}</td>
            //                         </tr>
            //                     );
            //                 })
            //             }
            //             {
            //                 (recommendList.length <= 0) && <tr>
            //                     <td colSpan={5}>没有相关记录</td>
            //                 </tr>
            //             }
            //             </tbody>
            //         </table>
            //     </div>
            //     {this.state.showRecommend && <div className="ivy-modal">

            //         <div className="modal-content">
            //             <div className="modal-header">
            //                 <h5 className="modal-title">代{this.props.userName}做推荐<span
            //                     className="text-secondary font-weight-normal">请电话联系填写代推荐信息</span></h5>
            //                 <i className="iconfont icon-guanbi1 btn-close"
            //                    onClick={() => this.handleCtrlRecommendBox(false)}></i>
            //             </div>
            //             <div className="modal-body">
            //                 <form>
            //                     <div className="form-group">
            //                         <label htmlFor="">注册姓名</label>
            //                         <input type="text" className="form-control" placeholder="请输入被推荐者的姓名"
            //                                value={this.props.createRecommendName}
            //                                onChange={(e) => this.handleRecommendInputChange(e, 'createRecommendName')}/>
            //                     </div>
            //                     <div className="form-group">
            //                         <label htmlFor="">被推荐人电话</label>
            //                         <input type="tel" className="form-control" placeholder="请输入被推荐者的手机号码"
            //                                maxLength={11} value={this.props.createRecommendPhone}
            //                                onChange={(e) => this.handleRecommendInputChange(e, 'createRecommendPhone')}/>
            //                     </div>
            //                 </form>
            //                 <div className="row">
            //                     <div className="col-sm-12 col-md-3 offset-md-2">
            //                         <button className="btn btn-secondary btn-block"
            //                                 onClick={() => this.handleCtrlRecommendBox(false)}>取消
            //                         </button>
            //                     </div>

            //                     <div className="col-sm-12 col-md-3 offset-md-2">
            //                         <button className="btn btn-info btn-block"
            //                                 onClick={() => this.handleDoHelpRecommend()}>
            //                             提交并审核
            //                         </button>
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>}
            // </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            createRecommendName: props.createRecommendName,
            createRecommendPhone: props.createRecommendPhone,
            searchKey: props.searchKey
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockDetailRecommend);
