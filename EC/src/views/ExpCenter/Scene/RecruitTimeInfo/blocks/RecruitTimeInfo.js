import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Switch, Modal, message, Checkbox, DatePicker} from 'antd';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
// 业务相关
import getRecruitTimeList from 'ACTION/ExpCenter/Recruit/getRecruitTimeList';
import EnumRecruit from 'CONFIG/EnumerateLib/Mapping_Recruit';
import EnumMemberTags from 'CONFIG/EnumerateLib/Mapping_MemberTags';
import EnumUser from 'CONFIG/EnumerateLib/Mapping_User';

const FormItem = Form.Item;
const Option = Select.Option;

class RecruitTimeInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.lastLoadMoreTmp = 0;
        this.eRecommend = EnumRecruit.eIsRecommend;
        this.eSubsidy = EnumRecruit.eHasSubsidy;
        this.eCharge = EnumRecruit.eHasCharge;
        this.eGender = EnumUser.eGender;
        delete this.eGender[0];
        this.eIDCardType = EnumMemberTags.IDCardStatus;
        this.eTattoo = EnumMemberTags.TattooStatus;
        this.eSmokeR = EnumMemberTags.SmokeScarStatus;
        this.eClothes = EnumMemberTags.CleanClothesStatus;
        this.eWorkPosture = EnumMemberTags.WorkPostureStatus;
        this.columns = [
            {title: '企业', dataIndex: 'RecruitName'},
            {
                title: '集合地点/时间', key: 'GatherInfo',
                render: (text, item) => {
                    return (
                        <div dangerouslySetInnerHTML={{__html: item.Time}}></div>
                    );
                }
            }
        ];
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.init();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.recruitList.currentPage !== nextProps.recruitList.currentPage) {
            this.doQuery(nextProps.recruitList);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {
        let nowData = this.props.recruitList;
        if (nowData.getRecruitTimeListFetch.status == 'success' && nowData.currentPage == 1) {
            if (document.getElementById('scroll-content-recruit')) document.getElementById('scroll-content-recruit').scrollTop = 0;
            setParams(nowData.state_name, {getRecruitTimeListFetch: {status: 'close'}});
        }
    }

    componentWillUnmount() {

    }

    init(reload = false) {
        let dpData = this.props.departmentList;
        this.doQuery(this.props.recruitList, reload);
    }

    handleRefresh() {
        this.init(true);
    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    checkForm() {
        return true;
    }

    doQuery(data, reload = false, e) {
        if (e) e.preventDefault();
        if (!this.checkForm()) return;
        let queryData = {RecordSize: data.pageSize};
        // 点击查询按钮时，重置分页数据的逻辑
        let RecordIndex = data.pageSize * (data.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(data.state_name, {currentPage: 1});
            if (data.currentPage != 1) return;
        }
        queryData.RecordIndex = RecordIndex;
        for (let key in data.queryParams) {
            let item = data.queryParams[key];
            if (item !== null && item !== undefined && item !== '' && item !== -1) {
                queryData[key] = item;
            }
        }
        if (queryData.RecruitDate && moment(queryData.RecruitDate).isValid()) {
            queryData.RecruitDate = queryData.RecruitDate.format('YYYY-MM-DD');
        } else {
            queryData.RecruitDate = moment().format('YYYY-MM-DD');
        }
        getRecruitTimeList(queryData);
    }

    resetQuery() {
        let data = this.props.recruitList;
        resetQueryParams(data.state_name);
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.recruitList;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }


    // handleScrollTable(e) {
    //     let percent = 1.8 * e.target.scrollTop / (e.target.scrollHeight - e.target.offsetHeight);
    //     let nowTmp = Date.parse(new Date());
    //     let data = this.props.recruitList;
    //     if (percent > 1 && percent > this.lastPercent && (nowTmp - this.lastLoadMoreTmp > 2000)) {
    //         if ((data.currentPage) * data.pageSize < data.totalSize) {
    //             setParams(data.state_name, {currentPage: data.currentPage + 1});
    //         }
    //         this.lastLoadMoreTmp = Date.parse(new Date());
    //     }
    //     setTimeout(() => {
    //         this.lastPercent = percent;
    //     }, 0);
    //
    // }

    render() {
        let data = this.props.recruitList;
        //
        let queryParams = data.queryParams;
        let require = data.currentRecruitRequire;
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        const fLayout2 = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return (
            <div className='recruit-info-view'>
                <div className='ivy-page-title'>
                    <div className="ivy-title">出发时间</div>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                    {/* <Button type='primary' className='title-btn'*/}
                    {/* onClick={() => this.handleGoPage('/ec/work-bench')}>返回*/}
                    {/* </Button>*/}
                </div>
                <div className="container-fluid">
                    <div className="container mt-20 bg-white">
                        <Form onSubmit={(e) => this.doQuery(data, true, e)}>
                            <Row gutter={15}>
                                <Col span={6}>
                                    <FormItem {...fLayout} label="日期">
                                        <DatePicker className="form-control" placeholder="选择日期" allowClear={false}
                                                    value={queryParams.RecruitDate} format="YYYY-MM-DD"
                                                    onChange={(date) => this.handleSetParam('RecruitDate', date)}/>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem {...fLayout} label="企业名称">
                                        <Input value={queryParams.RecruitName}
                                               onChange={(e) => this.handleSetParam('RecruitName', e.target.value)}
                                               placeholder="输入企业名称"/>
                                    </FormItem>
                                </Col>
                                <Col span={6} offset={6}>
                                    <FormItem className="text-right">
                                        <Button className="ant-btn ml-8"
                                                onClick={() => this.resetQuery()}>重置</Button>
                                        <Button className="ant-btn ml-8" type="primary"
                                                htmlType="submit">搜索</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
                <div className="container-fluid mt-20">
                    <div className="bg-white">
                        <Table rowKey="rowKey" columns={this.columns}
                               pagination={{
                                   current: data.currentPage,
                                   onChange: (page) => setParams(data.state_name, {currentPage: page}),
                                   total: data.totalSize
                               }}
                               dataSource={data.recruitList}></Table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(RecruitTimeInfo);