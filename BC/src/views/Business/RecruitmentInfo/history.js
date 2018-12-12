import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Switch, Modal, message, Checkbox, DatePicker} from 'antd';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import openDialog from 'ACTION/Dialog/openDialog';
import moment from 'moment';
// 业务相关
import getRecruitList from 'ACTION/ExpCenter/Recruit/getRecruitList';
import getRecruitRequireInfo from 'ACTION/ExpCenter/Recruit/getRecruitRequireInfo';
import EnumRecruit from 'CONFIG/EnumerateLib/Mapping_Recruit';
import EnumMemberTags from 'CONFIG/EnumerateLib/Mapping_MemberTags';
import EnumUser from 'CONFIG/EnumerateLib/Mapping_User';

const FormItem = Form.Item;
const Option = Select.Option;

class RecruitInfo extends React.PureComponent {
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
            {title: '企业', dataIndex: 'PositionName'},
            {
                title: '工资', key: 'Salary',
                render: (text, item) => {
                    return (
                        <div>{`${(item.MinSalary / 100).FormatMoney({fixed: 2})}元 - ${(item.MaxSalary / 100).FormatMoney({fixed: 2})}元`}</div>);
                }
            },
            {
                title: '补贴|收费', key: 'Subsidy',
                render: (text, item) => {
                    return (
                        <div>
                            {`男${item.MaleSubsidyDay}天 ${(item.MaleSubsidyAmount / 100).FormatMoney({fixed: 2})}元`}<br/>
                            {`女${item.FemaleSubsidyDay}天 ${(item.FemaleSubsidyAmount / 100).FormatMoney({fixed: 2})}元`}<br/>
                            {`男 ${(item.MaleCharge / 100).FormatMoney({fixed: 2})}元`}<br/>
                            {`女 ${(item.FeMaleCharge / 100).FormatMoney({fixed: 2})}元`}
                        </div>);
                }
            },
            {
                title: '年龄|性别', dataIndex: 'Age',
                render: (text, item) => {
                    return (
                        <div>
                            {`男${item.MaleMinAge} - ${item.MaleMaxAge}`}<br/>
                            {`女${item.FeMaleMinAge} - ${item.FeMaleMaxAge}`}<br/>
                            {`男女比例 ${item.MaleScale} : ${item.FemaleScale}`}
                        </div>);
                }
            },
            {
                title: '集合地点/时间', key: 'GatherInfo',
                render: (text, item) => {
                    return (
                        <div dangerouslySetInnerHTML={{__html: item.GatherInfo}}></div>
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
        if (nowData.getRecruitListFetch.status == 'success' && nowData.currentPage == 1) {
            if (document.getElementById('scroll-content-recruit')) document.getElementById('scroll-content-recruit').scrollTop = 0;
            setParams(nowData.state_name, {getRecruitListFetch: {status: 'close'}});
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
        }
        queryData.RecordIndex = RecordIndex;
        for (let key in data.queryParams) {
            let item = data.queryParams[key];
            if (item !== null && item !== undefined && item !== '' && item !== -1) {
                queryData[key] = item;
            }
        }
        if (queryData.RecruitDate) queryData.RecruitDate = queryData.RecruitDate.format('YYYY-MM-DD');
        if (queryData.MinSalary) queryData.MinSalary = queryData.MinSalary * 100;
        if (queryData.MaxSalary) queryData.MaxSalary = queryData.MaxSalary * 100;
        if (queryData.Age) queryData.Age = queryData.Age - 0;
        getRecruitList(queryData);
    }

    resetQuery() {
        let data = this.props.recruitList;
        resetQueryParams(data.state_name);
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.recruitList;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleClickRow(item, e) {
        //
        if (e) e.preventDefault();
        let data = this.props.recruitList;
        setParams(data.state_name, {currentRecruitID: item.RecruitID, currentRecruit: item});
        getRecruitRequireInfo({RecruitID: item.RecruitID});
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
                    <div className="ivy-title">招工资讯</div>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
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
                                        <Input value={queryParams.PositionName}
                                               onChange={(e) => this.handleSetParam('PositionName', e.target.value)}
                                               placeholder="输入企业名称"/>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="是否推荐">
                                        <Select value={queryParams.Recommend + ''}
                                                onChange={(value) => this.handleSetParam('Recommend', value - 0)}>
                                            <Option value="-1">全部</Option>
                                            {Object.keys(this.eRecommend).sort((a, b) => b - a).map((key, index) => (
                                                <Option key={index} value={key + ''}>{this.eRecommend[key]}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="是否补贴">
                                        <Select value={queryParams.Subsidy + ''}
                                                onChange={(value) => this.handleSetParam('Subsidy', value - 0)}>
                                            <Option value="-1">全部</Option>
                                            {Object.keys(this.eSubsidy).sort((a, b) => b - a).map((key, index) => (
                                                <Option key={index} value={key + ''}>{this.eSubsidy[key]}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="是否收费">
                                        <Select value={queryParams.Charge + ''}
                                                onChange={(value) => this.handleSetParam('Charge', value - 0)}>
                                            <Option value="-1">全部</Option>
                                            {Object.keys(this.eCharge).sort((a, b) => b - a).map((key, index) => (
                                                <Option key={index} value={key + ''}>{this.eCharge[key]}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="最低工资">
                                        <Input value={queryParams.MinSalary} type="number"
                                               onChange={(e) => this.handleSetParam('MinSalary', e.target.value)}
                                               placeholder="最低工资"/>

                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="最高工资">
                                        <Input value={queryParams.MaxSalary} type="number"
                                               onChange={(e) => this.handleSetParam('MaxSalary', e.target.value)}
                                               placeholder="最高工资"/>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="会员性别">
                                        <Select value={queryParams.Gender + ''}
                                                onChange={(value) => this.handleSetParam('Gender', value - 0)}>
                                            <Option value="-1">全部</Option>
                                            {Object.keys(this.eGender).sort((a, b) => b - a).map((key, index) => (
                                                <Option key={index} value={key + ''}>{this.eGender[key]}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="会员年龄">
                                        <Input value={queryParams.Age} type="number"
                                               onChange={(e) => this.handleSetParam('Age', e.target.value)}
                                               placeholder="年龄"/>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="会员民族">
                                        <Input value={queryParams.NationInfo}
                                               onChange={(e) => this.handleSetParam('NationInfo', e.target.value)}
                                               placeholder="民族"/>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="会员身份证">
                                        <Select value={queryParams.IDCardType + ''}
                                                onChange={(value) => this.handleSetParam('IDCardType', value - 0)}>
                                            <Option value="-1">全部</Option>
                                            {Object.keys(this.eIDCardType).sort((a, b) => b - a).map((key, index) => (
                                                <Option key={index} value={key + ''}>{this.eIDCardType[key]}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="会员纹身">
                                        <Select value={queryParams.Tattoo + ''}
                                                onChange={(value) => this.handleSetParam('Tattoo', value - 0)}>
                                            <Option value="-1">全部</Option>
                                            {Object.keys(this.eTattoo).sort((a, b) => b - a).map((key, index) => (
                                                <Option key={index} value={key + ''}>{this.eTattoo[key]}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="会员烟疤">
                                        <Select value={queryParams.SmokeR + ''}
                                                onChange={(value) => this.handleSetParam('SmokeR', value - 0)}>
                                            <Option value="-1">全部</Option>
                                            {Object.keys(this.eSmokeR).sort((a, b) => b - a).map((key, index) => (
                                                <Option key={index} value={key + ''}>{this.eSmokeR[key]}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="无尘服">
                                        <Select value={queryParams.Clothes + ''}
                                                onChange={(value) => this.handleSetParam('Clothes', value - 0)}>
                                            <Option value="-1">全部</Option>
                                            {Object.keys(this.eClothes).sort((a, b) => b - a).map((key, index) => (
                                                <Option key={index} value={key + ''}>{this.eClothes[key]}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout} label="上班姿势">
                                        <Select value={queryParams.WorkPosture + ''}
                                                onChange={(value) => this.handleSetParam('WorkPosture', value - 0)}>
                                            <Option value="-1">全部</Option>
                                            {Object.keys(this.eWorkPosture).sort((a, b) => b - a).map((key, index) => (
                                                <Option key={index} value={key + ''}>{this.eWorkPosture[key]}</Option>
                                            ))}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={12} className={data.formSpread ? '' : 'display-none'}>
                                    <FormItem {...fLayout2} label="其他">
                                        <Checkbox
                                            onChange={() => this.handleSetParam('English', queryParams.English != -1 ? -1 : 1)}>26英文字母</Checkbox>
                                        <Checkbox
                                            onChange={() => this.handleSetParam('Math', queryParams.Math != -1 ? -1 : 1)}>简单算数</Checkbox>
                                        <Checkbox
                                            onChange={() => this.handleSetParam('Eye', queryParams.Eye != -1 ? -1 : 1)}>色盲色弱</Checkbox>
                                        <Checkbox
                                            onChange={() => this.handleSetParam('Metal', queryParams.Metal != -1 ? -1 : 1)}>体内金属</Checkbox>
                                        <Checkbox
                                            onChange={() => this.handleSetParam('CheckCriminal', queryParams.CheckCriminal != -1 ? -1 : 1)}>案底</Checkbox>
                                    </FormItem>
                                </Col>
                                <Col span={6} offset={6}>
                                    <FormItem className="text-right">
                                        <Button className="ant-btn ml-8"
                                                onClick={() => setParams(data.state_name, {formSpread: !data.formSpread})}>
                                            {data.formSpread ? '收起' : '展开'}
                                        </Button>
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
                    <Row gutter={15}>
                        <Col className="gutter-row" span={18}>
                            <div className="gutter-box bg-white">
                                <Table rowKey="rowKey" columns={this.columns}
                                       onRowClick={(record) => this.handleClickRow(record)}
                                       pagination={{
                                           current: data.currentPage,
                                           onChange: (page) => setParams(data.state_name, {currentPage: page}),
                                           total: data.totalSize
                                       }}
                                       dataSource={data.recruitList}></Table>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box bg-white">
                                <div style={{minHeight: '280px'}}>
                                    <table className='ant-table' style={{width: "100%"}}>
                                        <thead className="ant-table-thead">
                                        <tr>
                                            <th>录用条件</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr height='100'>
                                            <td>{require.RecruitDesc}</td>
                                        </tr>
                                        </tbody>
                                        <thead className="ant-table-thead">
                                        <tr>
                                            <th>身体条件</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr height='100'>
                                            <td>{!require.BodyDesc ? '' : (<div>
                                                <div>{require.BodyDesc.Clothes > 0 ? this.eClothes[require.BodyDesc.Clothes] : ''}</div>
                                                <div>{require.BodyDesc.IDCardType > 0 ? this.eIDCardType[require.BodyDesc.IDCardType] : ''}</div>
                                                <div>{require.BodyDesc.SmokeScar > 0 ? this.eSmokeR[require.BodyDesc.SmokeScar] : ''}</div>
                                                <div>{require.BodyDesc.Tattoo > 0 ? this.eTattoo[require.BodyDesc.Tattoo] : ''}</div>
                                            </div>)}</td>
                                        </tr>
                                        </tbody>
                                        <thead className="ant-table-thead">
                                        <tr>
                                            <th>返厂说明</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr height='100'>
                                            <td>{require.BackDesc}</td>
                                        </tr>
                                        </tbody>
                                        <thead className="ant-table-thead">
                                        <tr>
                                            <th>备注</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr height='100'>
                                            <td>{require.Remark}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Form.create()(RecruitInfo);