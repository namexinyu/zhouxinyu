import React from 'react';
import 'SCSS/pages/broker/recruit-view.scss';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import openDialog from 'ACTION/Dialog/openDialog';
import {DatePicker} from 'antd';
import moment from 'moment';

// 业务相关
import getRecruitList from 'ACTION/Broker/Recruit/getRecruitList';
import getMemberRecruitMatchInfo from 'ACTION/Broker/Recruit/getMemberRecruitMatchInfo';
import getRecruitRequireInfo from 'ACTION/Broker/Recruit/getRecruitRequireInfo';
import commitRecruitBug from 'ACTION/Broker/Recruit/commitRecruitBug';
import EnumRecruit from 'CONFIG/EnumerateLib/Mapping_Recruit';
import EnumMemberTags from 'CONFIG/EnumerateLib/Mapping_MemberTags';
import EnumUser from 'CONFIG/EnumerateLib/Mapping_User';
import getDepartmentList from 'ACTION/Broker/Department/getDepartmentList';

export default class Recruit extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_recruitList';
        this.STATE_NAME_BUG = 'state_broker_recruitCommitBug';
        this.STATE_NAME_MATCH = 'state_broker_recruitMatchPhone';
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
        // Department
        // this.eDepartment = EnumAssistance.eDepartment;
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.init();
        }
        // 用于会员页匹配工作 this.props.router.params.MemberPhone

        let phone = this.props.location.query ? this.props.location.query.MemberPhone : undefined;
        if (phone) {
            setParams(this.STATE_NAME_MATCH, {MemberPhone: phone});

            if (/^1[0-9][0-9]\d{8}$/.test(phone)) {
                this.doMemberInfoMatch(phone);
            }
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        //
        if (this.props.recruitList.currentPage !== nextProps.recruitList.currentPage) {
            this.doQuery(nextProps.recruitList);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        let nextData = nextProps.recruitList;
        let nowData = this.props.recruitList;
        //
        if (nextProps.recruitBug.commitRecruitBugFetch.status == 'success') {
            openDialog({
                id: 'commitRecruitBugSuccess',
                type: 'toast',
                message: '提交企业纠错成功'
            });
            setParams(this.STATE_NAME, {showModal: false});
            setParams(this.STATE_NAME_BUG, {commitRecruitBugFetch: {status: 'close'}});
        }
        // 匹配手机号成功
        if (nextProps.matchPhone.getMemberRecruitMatchInfoFetch.status == 'success') {
            let data = nextProps.matchPhone.MatchRes;
            let transferData = {};
            try {
                transferData = {
                    NationInfo: data.Native,
                    Gender: data.Gender - 0,
                    Age: null,
                    Eye: -1,
                    English: -1,
                    Math: -1,
                    Metal: -1,
                    CheckCriminal: -1
                };
                if (data.Age) transferData.Age = data.Age - 0;
                let tag = JSON.parse(data.Tags);

                if (tag) {
                    let otherStatus = tag.OtherStatus;
                    transferData.Tattoo = tag.TattooStatus;
                    transferData.WorkPosture = tag.WorkPostureStatus;
                    transferData.Clothes = tag.CleanClothesStatus;
                    transferData.SmokeR = tag.SmokeScarStatus;
                    transferData.IDCardType = tag.IDCardStatus;
                    if (otherStatus && otherStatus.colorBlindness) transferData.Eye = 1;
                    if (otherStatus && otherStatus.enableEnglishLetter) transferData.English = 1;
                    if (otherStatus && otherStatus.enableSimpleMath) transferData.Math = 1;
                    if (otherStatus && otherStatus.hadMetal) transferData.Metal = 1;
                    if (otherStatus && otherStatus.hadCrimeCase) transferData.CheckCriminal = 1;
                }
            } catch (e) {

            }

            let newQueryParam = Object.assign({}, nextData.queryParams, transferData);
            setParams(this.STATE_NAME, {queryParams: newQueryParam});
            setParams(this.STATE_NAME_MATCH, {getMemberRecruitMatchInfoFetch: {status: 'close'}});
        }
        if (nextProps.matchPhone.getMemberRecruitMatchInfoFetch.status == 'error') {
            openDialog({
                id: 'getMemberRecruitMatchInfoFetchError',
                type: 'toast',
                message: '未匹配到该手机号'
            });
            setParams(this.STATE_NAME_MATCH, {getMemberRecruitMatchInfoFetch: {status: 'close'}});
        }
    }

    componentDidUpdate() {
        let nowData = this.props.recruitList;
        if (nowData.getRecruitListFetch.status == 'success' && nowData.currentPage == 1) {
            if (document.getElementById('scroll-content-recruit')) document.getElementById('scroll-content-recruit').scrollTop = 0;
            setParams(this.STATE_NAME, {getRecruitListFetch: {status: 'close'}});
        }
    }

    componentWillUnmount() {

    }

    init(reload = false) {
        let dpData = this.props.departmentList;
        if (reload || dpData.departmentNameList.length == 0) {
            getDepartmentList();
        }
        this.doQuery(this.props.recruitList);
    }

    handleRefresh() {
        this.init(true);
    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    doMemberInfoMatch(phone) {
        phone = phone || this.props.matchPhone.MemberPhone;
        getMemberRecruitMatchInfo({Phone: phone});
    }

    handleClickMatchPhone() {
        if (/^1[0-9][0-9]\d{8}$/.test(this.props.matchPhone.MemberPhone)) {
            this.doMemberInfoMatch();
        } else {
            openDialog({
                id: 'MemberInfoMatchCheckFailed',
                type: 'toast',
                message: '请输入正确的手机号'
            });
        }
    }

    checkForm() {
        return true;
    }

    doQuery(data, reload = false) {
        if (!this.checkForm()) return;
        let queryData = {RecordSize: data.pageSize};
        // 点击查询按钮时，重置分页数据的逻辑
        let RecordIndex = data.pageSize * (data.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {currentPage: 1});
            if (data.currentPage !== 1) return;
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
        resetQueryParams(this.STATE_NAME);
    }

    handleSelectedPage(page) {
        setParams(this.STATE_NAME, {
            currentPage: page
        });
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.recruitList;
        setParams(this.STATE_NAME, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleClickRow(item, e) {
        //
        e.preventDefault();
        setParams(this.STATE_NAME, {currentRecruitID: item.RecruitID, currentRecruit: item});
        getRecruitRequireInfo({RecruitID: item.RecruitID});
    }

    handleClickCommitBug(item, e) {
        setParams(this.STATE_NAME_BUG, {RecruitData: item, Content: ''});
        setParams(this.STATE_NAME, {showModal: 'bug'});
    }

    handleCloseModal() {
        setParams(this.STATE_NAME, {showModal: false});
    }

    handleDoCommitBug() {
        let bugData = this.props.recruitBug;
        if ((bugData.Content || '').length < 5) {
            openDialog({
                id: 'handleDoCommitBugCheck',
                type: 'toast',
                message: '纠错内容不能少于五个字'
            });
            return;
        }
        commitRecruitBug({
            TargetDepartID: bugData.TargetDepartID,
            Content: bugData.Content,
            RecruitID: bugData.RecruitData.RecruitID
        });
    }

    handleScrollTable(e) {
        let percent = 1.8 * e.target.scrollTop / (e.target.scrollHeight - e.target.offsetHeight);
        let nowTmp = Date.parse(new Date());
        let data = this.props.recruitList;
        if (percent > 1 && percent > this.lastPercent && (nowTmp - this.lastLoadMoreTmp > 2000)) {

            if ((data.currentPage) * data.pageSize < data.totalSize) {
                setParams(this.STATE_NAME, {currentPage: data.currentPage + 1});
            }
            this.lastLoadMoreTmp = Date.parse(new Date());
        }
        setTimeout(() => {
            this.lastPercent = percent;
        }, 0);

    }

    render() {
        let pageData = this.props.recruitList;
        //
        let queryParams = pageData.queryParams;
        let require = pageData.currentRecruitRequire;
        return (
            <div className='recruit-view'>
                <div className="ivy-page-title">
                    <h1 className="title-text">招工资讯</h1>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                </div>
                <div className='page-body'>
                    <form className='content-chunk search-from mt-4'>
                        <div className="form-group row">
                            <label className='col-1 col-form-label'>当前日期</label>
                            <div className="col-2">
                                {/* <input type="text" className="form-control"*/}
                                {/* value={queryParams.RecruitDate.Format('yyyy年MM月dd日')}*/}
                                {/* disabled/>*/}
                                <DatePicker className="form-control" placeholder="选择日期" allowClear={false}
                                            value={queryParams.RecruitDate} format="YYYY-MM-DD"
                                            onChange={(date) => this.handleSetParam('RecruitDate', date)}/>
                            </div>

                            <label className='col-1 col-form-label'>是否推荐</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.Recommend}
                                        onChange={(e) => this.handleSetParam('Recommend', e.target.value - 0)}>
                                    <option value={-1}>请选择</option>
                                    {Object.keys(this.eRecommend).sort((a, b) => b - a).map((key, index) => (
                                        <option key={index} value={key}>{this.eRecommend[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <label className='col-1 col-form-label'>是否补贴</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.Subsidy}
                                        onChange={(e) => this.handleSetParam('Subsidy', e.target.value - 0)}>
                                    <option value={-1}>请选择</option>
                                    {Object.keys(this.eSubsidy).sort((a, b) => b - a).map((key, index) => (
                                        <option key={index} value={key}>{this.eSubsidy[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <label className='col-1 col-form-label'>是否收费</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.Charge}
                                        onChange={(e) => this.handleSetParam('Charge', e.target.value - 0)}>
                                    <option value={-1}>请选择</option>
                                    {Object.keys(this.eCharge).sort((a, b) => b - a).map((key, index) => (
                                        <option key={index} value={key}>{this.eCharge[key]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className='col-1 col-form-label'>报名企业</label>
                            <div className="col-2">
                                <input type="text" className="form-control"
                                       value={queryParams.PositionName || ''}
                                       placeholder='输入报名企业'
                                       onChange={(e) => this.handleSetParam('PositionName', e.target.value)}/>
                            </div>
                            <label className='col-1 col-form-label'>工资</label>
                            <div className="col-2">
                                <input type="number" className="form-control" value={queryParams.MinSalary || ''}
                                       onChange={(e) => this.handleSetParam('MinSalary', e.target.value)}/>
                            </div>
                            <label className='col-1 col-form-label'>——</label>
                            <div className="col-2">
                                <input type="number" className="form-control" value={queryParams.MaxSalary || ''}
                                       onChange={(e) => this.handleSetParam('MaxSalary', e.target.value)}/>
                            </div>

                        </div>
                        <div className="form-group row">
                            <label className='col-1 col-form-label'>手机号</label>
                            <div className="col-2">
                                <div className="input-group">
                                    <input type='tel' placeholder="输入会员手机号" className="form-control" maxLength="11"
                                           value={this.props.matchPhone.MemberPhone || ''}
                                           onChange={(e) => setParams(this.STATE_NAME_MATCH, {MemberPhone: e.target.value})}/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-success btn-sm" type="button"
                                                onClick={this.handleClickMatchPhone.bind(this)}>匹配</button>
                                    </span>
                                </div>
                            </div>
                            <label className='col-1 col-form-label'>会员性别</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.Gender || ''}
                                        onChange={(e) => this.handleSetParam('Gender', e.target.value - 0)}>
                                    <option value={-1}>请选择</option>
                                    {Object.keys(this.eGender).map((key, index) => (
                                        <option key={index} value={key}>{this.eGender[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <label className='col-1 col-form-label'>会员年龄</label>
                            <div className="col-2">
                                <input type="number" className="form-control" value={queryParams.Age || ''}
                                       onChange={(e) => this.handleSetParam('Age', e.target.value)}/>
                            </div>
                            <label className='col-1 col-form-label'>会员民族</label>
                            <div className="col-2">
                                <input type="text" className="form-control" value={queryParams.NationInfo || ''}
                                       onChange={(e) => this.handleSetParam('NationInfo', e.target.value)}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className='col-1 col-form-label'>会员身份证</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.IDCardType}
                                        onChange={(e) => this.handleSetParam('IDCardType', e.target.value - 0)}>
                                    <option value={-1}>请选择</option>
                                    {Object.keys(this.eIDCardType).map((key, index) => (
                                        <option key={index} value={key}>{this.eIDCardType[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <label className='col-1 col-form-label'>会员纹身</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.Tattoo}
                                        onChange={(e) => this.handleSetParam('Tattoo', e.target.value - 0)}>
                                    <option value={-1}>请选择</option>
                                    {Object.keys(this.eTattoo).map((key, index) => (
                                        <option key={index} value={key}>{this.eTattoo[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <label className='col-1 col-form-label'>会员烟疤</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.SmokeR}
                                        onChange={(e) => this.handleSetParam('SmokeR', e.target.value - 0)}>
                                    <option value={-1}>请选择</option>
                                    {Object.keys(this.eSmokeR).map((key, index) => (
                                        <option key={index} value={key}>{this.eSmokeR[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <label className='col-1 col-form-label'>无尘服</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.Clothes}
                                        onChange={(e) => this.handleSetParam('Clothes', e.target.value - 0)}>
                                    <option value={-1}>请选择</option>
                                    {Object.keys(this.eClothes).map((key, index) => (
                                        <option key={index} value={key}>{this.eClothes[key]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className='col-1 col-form-label'>上班姿势</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.WorkPosture}
                                        onChange={(e) => this.handleSetParam('WorkPosture', e.target.value - 0)}>
                                    <option value={-1}>请选择</option>
                                    {Object.keys(this.eWorkPosture).map((key, index) => (
                                        <option key={index} value={key}>{this.eWorkPosture[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <label className='col-1 col-form-label'>其他</label>
                            <div className="col-8">
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label mr-3">
                                        <input className="form-check-input" type="checkbox"
                                               checked={queryParams.English != -1}
                                               onClick={(e) => this.handleSetParam('English', queryParams.English != -1 ? -1 : 1)}/>
                                        26英文字母
                                    </label>
                                    <label className="form-check-label mr-3">
                                        <input className="form-check-input" type="checkbox"
                                               checked={queryParams.Math != -1}
                                               onClick={(e) => this.handleSetParam('Math', queryParams.Math != -1 ? -1 : 1)}/>
                                        简单算数
                                    </label>
                                    <label className="form-check-label mr-3">
                                        <input className="form-check-input" type="checkbox"
                                               checked={queryParams.Eye != -1}
                                               onClick={(e) => this.handleSetParam('Eye', queryParams.Eye != -1 ? -1 : 1)}/>
                                        色盲色弱
                                    </label>
                                    <label className="form-check-label mr-3">
                                        <input className="form-check-input" type="checkbox"
                                               checked={queryParams.Metal != -1}
                                               onClick={(e) => this.handleSetParam('Metal', queryParams.Metal != -1 ? -1 : 1)}/>
                                        体内金属
                                    </label>
                                    <label className="form-check-label mr-3">
                                        <input className="form-check-input" type="checkbox"
                                               checked={queryParams.CheckCriminal != -1}
                                               onClick={(e) => this.handleSetParam('CheckCriminal', queryParams.CheckCriminal != -1 ? -1 : 1)}/>
                                        案底
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className='col-4 offset-4 text-center'>
                                <div className="row">
                                    <div className="col-6">
                                        <button type="button" onClick={() => this.resetQuery()}
                                                className="btn btn-warning btn-block">重置
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button type="button" onClick={() => this.doQuery(pageData, true)}
                                                className="btn btn-info btn-block">查询
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className='mt-4 row'>
                        <div className='col-9'>
                            <div className='content-chunk'
                                 style={{height: '600px', overflow: 'scroll'}}>
                                <table className='recruit-table table table-sm table-bordered'>
                                    <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>企业</th>
                                        <th>工资</th>
                                        <th>补贴情况</th>
                                        <th>收费情况</th>
                                        <th>年龄要求</th>
                                        <th>男女比例</th>
                                        <th>集合地点/时间</th>
                                        <th>纠错</th>
                                    </tr>
                                    </thead>
                                    <tbody id="scroll-content-recruit" onScroll={(e) => this.handleScrollTable(e)}>
                                    {pageData.recruitList.map((item, index) => (
                                        <tr key={index}
                                            className={`${item.RecruitID == pageData.currentRecruitID ? 'text-primary' : ''}`}
                                            onClick={(e) => this.handleClickRow(item, e)}>
                                            <td>{index + 1}</td>
                                            <td>{item.PositionName}</td>
                                            <td>{`${(item.MinSalary / 100).FormatMoney({fixed: 2})}元 - ${(item.MaxSalary / 100).FormatMoney({fixed: 2})}元`}</td>
                                            <td>
                                                {`男${item.MaleSubsidyDay}天 ${(item.MaleSubsidyAmount / 100).FormatMoney({fixed: 2})}元`}<br/>
                                                {`女${item.FemaleSubsidyDay}天 ${(item.FemaleSubsidyAmount / 100).FormatMoney({fixed: 2})}元`}
                                            </td>
                                            <td>
                                                {`男 ${(item.MaleCharge / 100).FormatMoney({fixed: 2})}元`}<br/>
                                                {`女 ${(item.FeMaleCharge / 100).FormatMoney({fixed: 2})}元`}
                                            </td>
                                            <td>
                                                {`男${item.MaleMinAge} - ${item.MaleMaxAge}`}<br/>
                                                {`女${item.FeMaleMinAge} - ${item.FeMaleMaxAge}`}
                                            </td>
                                            <td>{`${item.MaleScale} : ${item.FemaleScale}`}</td>
                                            <td dangerouslySetInnerHTML={{__html: item.GatherInfo}}>

                                            </td>
                                            <td>
                                                <button className='btn btn-success btn-sm'
                                                        onClick={(e) => this.handleClickCommitBug(item, e)}>纠错
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <div className='col-3'>
                            <div className='content-chunk' style={{minHeight: '280px'}}>
                                <table className='table table-sm mt-0'>
                                    <tbody>
                                    <tr>
                                        <th>录用条件</th>
                                    </tr>
                                    <tr height='100'>
                                        <td>{require.RecruitDesc}</td>
                                    </tr>
                                    <tr>
                                        <th>身体条件</th>
                                    </tr>
                                    <tr height='100'>
                                        <td>{!require.BodyDesc ? '' : (<div>
                                            <div>{require.BodyDesc.Clothes > 0 ? this.eClothes[require.BodyDesc.Clothes] : ''}</div>
                                            <div>{require.BodyDesc.IDCardType > 0 ? this.eIDCardType[require.BodyDesc.IDCardType] : ''}</div>
                                            <div>{require.BodyDesc.SmokeScar > 0 ? this.eSmokeR[require.BodyDesc.SmokeScar] : ''}</div>
                                            <div>{require.BodyDesc.Tattoo > 0 ? this.eTattoo[require.BodyDesc.Tattoo] : ''}</div>
                                        </div>)}</td>
                                    </tr>
                                    <tr>
                                        <th>返厂说明</th>
                                    </tr>
                                    <tr height='100'>
                                        <td>{require.BackDesc}</td>
                                    </tr>
                                    <tr>
                                        <th>备注</th>
                                    </tr>
                                    <tr height='100'>
                                        <td>{require.Remark}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 纠错窗口 */}
                {this.createBugModal()}
            </div>
        );
    }

    createBugModal() {
        let pageData = this.props.recruitList;
        let bugData = this.props.recruitBug;
        if (pageData.showModal && bugData.RecruitData) {
            return (<div className="ivy-modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">企业纠错</h5>
                        <i className="iconfont icon-guanbi1 btn-close" onClick={() => this.handleCloseModal()}></i>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group row">
                                <label className="col-2 col-form-label">企业</label>
                                <div className='col-4'>
                                    <input type="text" className="form-control" disabled
                                           value={bugData.RecruitData.PositionName}/>
                                </div>
                                <label className="col-2 col-form-label">反馈部门</label>
                                <div className='col-4'>
                                    <select className='form-control' value={bugData.TargetDepartID}
                                            onChange={(e) => setParams(this.STATE_NAME_BUG, {'TargetDepartID': e.target.value - 0})}>
                                        {this.props.departmentList.departmentNameList.map((item, index) => (
                                            <option key={index} value={item.DepartID}>{item.DepartName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-2 col-form-label">纠错内容</label>
                                <div className="col-10">
                                    <textarea className="form-control" cols={5}
                                              onChange={(e) => setParams(this.STATE_NAME_BUG, {'Content': e.target.value})}
                                              value={bugData.Content}
                                              placeholder="填写纠错原因"></textarea>
                                </div>
                            </div>
                        </form>
                        <div className="row">
                            <div className="col-sm-12 col-md-3 offset-md-2">
                                <button className="btn btn-secondary btn-block"
                                        onClick={() => this.handleCloseModal()}>取消
                                </button>
                            </div>
                            <div className="col-sm-12 col-md-3 offset-md-2">
                                <button className="btn btn-info btn-block"
                                        onClick={(e) => this.handleDoCommitBug()}>确认
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
        } else {
            return;
        }
    }

}
