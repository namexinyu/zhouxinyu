import React from 'react';
import {browserHistory} from 'react-router';
import {Row, Col, Card, Affix, Form, Select, Pagination, Button, Icon, Table, message} from 'antd';
import RecruitmentForm from './RecruitmentForm';
import setParams from "ACTION/setParams";
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import RecruitEntrustModal from './RecruitEntrustModal';
import {CurrentPlatformCode} from "CONFIG/mamsConfig";
import PCA from "CONFIG/PCA";
import Mapping_MAMS_Recruitment, {
    getEnum,
    transferBinaryEnum,
    Mapping_MAMS_Recruit_User
} from 'CONFIG/EnumerateLib/Mapping_MAMS_Recruitment';
import "LESS/pages/recruitment-info-view.less";
import resetState from "ACTION/resetState";
import moment from 'moment';
import ICON_RECOMMEND from 'IMAGE/recruit_recommand.png';
import zt_icon3x from 'IMAGE/zt_icon@3x.png';

class RecruitmentInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleEntrustRecruit = this.handleEntrustRecruit.bind(this);
        this.ePhysical = getEnum(Mapping_MAMS_Recruitment.ePhysicalList);
        this.eGender = getEnum(Mapping_MAMS_Recruitment.eGenderList);
        this.eGenderAll = {...this.eGender};
        this.eGenderAll[0] = '男女不限';
        this.eClothes = getEnum(Mapping_MAMS_Recruitment.eClothesList);
        this.eCharacters = getEnum(Mapping_MAMS_Recruitment.eCharactersList);
        this.eForeignBodies = getEnum(Mapping_MAMS_Recruitment.eForeignBodiesList);
        this.eMath = getEnum(Mapping_MAMS_Recruitment.eMathList);
        this.eCriminal = getEnum(Mapping_MAMS_Recruitment.eCriminalList);
        // 123
        this.eSmokeScar = getEnum(Mapping_MAMS_Recruitment.eSmokeScarList);
        this.eTattoo = getEnum(Mapping_MAMS_Recruitment.eTattooList);
        this.eIDCardType = getEnum(Mapping_MAMS_Recruitment.eIDCardTypeList);
        this.eEducation = getEnum(Mapping_MAMS_Recruitment.eEducationList);
        // city
        this.eCity = Object.keys(PCA.City).reduce((obj, key) => Object.assign(obj, PCA.City[key]), {});
        // this.eSmokeScarList = Mapping_MAMS_Recruitment.eSmokeScarList;
        // this.eTattooList = Mapping_MAMS_Recruitment.eTattooList;
        // this.eIDCardTypeList = Mapping_MAMS_Recruitment.eIDCardTypeList;
        // this.eEducationList = Mapping_MAMS_Recruitment.eEducationList;

    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.doQuery(this.props.list);
        }
        if (this.props.require.Data) {
            this.handleRequireData(this.props.require.Data);
        }
    }

    componentWillReceiveProps(nextProps) {
        // 翻页 以及 弹窗关闭
        // || nextProps.list.orderParams !== this.props.list.orderParams
        if (nextProps.list.currentPage !== this.props.list.currentPage) {
            this.doQuery(nextProps.list);
        }
        if (nextProps.entrust.BuildRecruitmentEntrustFetch.status == 'success' && nextProps.entrust.BuildRecruitmentEntrustFetch.status != 'success') {
            message.info('新建纠错成功');
            setParams(nextProps.entrust.state_name, {BuildRecruitmentEntrustFetch: {status: 'close'}});
            this.doQuery(nextProps.list);
        }
        if (nextProps.require.Data != this.props.require.Data && nextProps.require.Data) {
            let require = nextProps.require.Data;
            this.handleRequireData(require);
        }
    }

    handleRequireData(require) {
        const typeEnum = {
            0: '不招',
            1: '只招'
        };
        const resIDCardType = require.IDCardType == 0 ? '无' : require.IDCardType == 7 ? '不限' : transferBinaryEnum(require.IDCardType, this.eIDCardType);
        const resEducation = require.Qualification == 31 ? '不限' : transferBinaryEnum(require.Qualification, this.eEducation);
        let resTattoo = require.Tattoo == 31 ? '不限' : transferBinaryEnum(require.Tattoo, this.eTattoo);
        let resSmokeScar = require.SmokeScar == 15 ? '不限' : transferBinaryEnum(require.SmokeScar, this.eSmokeScar);
        // 加了两个字段
        if (require.TattooRemark) {
            resTattoo = resTattoo ? resTattoo + ',' + require.TattooRemark : require.TattooRemark;
        }
        if (require.SmokeScarRemark) {
            resSmokeScar = resSmokeScar ? resSmokeScar + ',' + require.SmokeScarRemark : require.SmokeScarRemark;
        }
        let english = '';
        if (require.CharactersRemark) {
            english = (this.eCharacters[require.Characters + ''] || '不要求') + ',' + require.CharactersRemark;
        }else{
            english = (this.eCharacters[require.Characters + ''] || '不要求'); 
        }
        let math = '';
        if (require.MathRemark) {
            math = (this.eMath[require.Math + ''] || '不要求') + ',' + require.MathRemark;
        }else{
            math = (this.eMath[require.Math + ''] || '不要求');
        }
        let exam = '';
        let examArr = ['不考试', '简单考试', '考试较难', '无规定'];
        if (require.ExamRemark) {
            
            exam = (examArr[require.Exam] || '无规定') + ',' + require.ExamRemark;
        }else{
            exam = (examArr[require.Exam] || '无规定');
        }
        let crime = '';
        let crimeArr = ['查案底', '不查案底', '无规定'];
        crime = (crimeArr[require.CheckCriminal] || '无规定');
        let height = '';
        if (require.MaleMinHeight) {
            height += '男' + require.MaleMinHeight + '厘米以上';
        }
        if (require.FemaleMinHeight) {
            if (height) {
                height += '，女' + require.FemaleMinHeight + '厘米以上';
            } else {
            height += '女' + require.FemaleMinHeight + '厘米以上';
            }
        }
        if (!height) height = '无规定';
        let nr, hhr, rt;
        try {
            // if (require.NationRequire) nr = JSON.parse(require.NationRequire);
            // if (require.HouseholdRegister) hhr = JSON.parse(require.HouseholdRegister);
            if (require.Return) rt = JSON.parse(require.Return);
           
        } catch (e) {
        }
        let sReturn = '';
        if (rt && (rt.normal || rt.self || rt.other)) {
            let reArr = [];
            if (rt.normal && rt.normalMonth) {
                reArr.push('正常离职满' + rt.normalMonth + '个月');
            }
            if (rt.self && rt.selfMonth) {
                reArr.push('自离满' + rt.selfMonth + '个月');
            }
            sReturn = reArr.join(',');
            if (rt.other && rt.otherRemark) {
                if (sReturn) {
                    sReturn = sReturn + '(' + rt.otherRemark + ')';
                } else {
                    sReturn = rt.otherRemark;
                }
            }
        }
     
        if (!sReturn) sReturn = '无';

        this.require = {
            province: require.HouseholdRegister || '无',
            nation: require.NationInfo || '无',
            idCardType: resIDCardType ? resIDCardType : '不限',
            education: resEducation ? resEducation : '无',
            english: english,
            math: math,
            exam: exam,
            GiftName: require.GiftName,
            GiftAmount: require.GiftAmount,
            height: height,
            criminal: crime || '无需检查',
            clothes: this.eClothes[require.Clothes + ''] || '不要求',
            metal: this.eForeignBodies[require.ForeignBodies + ''] || '无需检查',
            physical: this.ePhysical[require.Physical + ''] || '不需要体检',
            Tattoo: resTattoo ? resTattoo : '无要求',
            SmokeScar: resSmokeScar ? resSmokeScar : '无要求',
            FactoryPickup: require.FactoryPickup || '无规定',
            face: require.FaceRecognition === 1 ? '查' : (require.FaceRecognition === 0 ? "不查" : "无规定"),
            Return: sReturn
        };
         /*
        let nr, hhr, rt;
        try {
            // if (require.NationRequire) nr = JSON.parse(require.NationRequire);
            // if (require.HouseholdRegister) hhr = JSON.parse(require.HouseholdRegister);
            if (require.Return) rt = JSON.parse(require.Return);
            console.log('require.Return', require.Return, rt);
        } catch (e) {
            console.log("数据异常，存在无法解析的JSON字段，检查NationRequire,HouseholdRegister,Return字段");
        }
       
        if (rt && (rt.normal || rt.self || rt.other)) {
            let reArr = [];
            if (rt.normal && rt.normalMonth) {
                reArr.push('正常离职满' + rt.normalMonth + '个月');
            }
            if (rt.self && rt.selfMonth) {
                reArr.push('自离满' + rt.selfMonth + '个月');
            }
            this.require.Return = reArr.join(',');
            if (rt.other && rt.otherRemark) {
                if (this.require.Return) {
                    this.require.Return = this.require.Return + '(' + rt.otherRemark + ')';
                } else {
                    this.require.Return = rt.otherRemark;
                }
            }
        }
        */
    }

    handleMatch() {
        let data = this.props.list;
        let phone = data.queryParams.Phone.value;
        if (/^1(3|4|5|6|7|8|9)\\d{9}$/.test(phone)) {
            ActionMAMSRecruitment.MatchUserRecruitTag({Phone: phone});
        }
    }

    handleSearch() {
        let data = this.props.list;
        resetState(this.props.require.state_name);
        if (data.currentPage == 1) {
            this.doQuery(data);
        } else {
            setParams(data.state_name, {currentPage: 1});
        }
    }

    doQuery(data) {
        let param = {
            RecordIndex: data.pageSize * (data.currentPage - 1),
            RecordSize: data.pageSize
        };
        Object.keys(data.queryParams).forEach((key) => {
            if (data.queryParams[key].value) {
                if (!(["Education"].indexOf(key) != -1 && data.queryParams[key].value == '-9999')) {
                    if (['RecruitName', 'RecruitDate', 'Tattoo', 'SmokeScar'].indexOf(key) != -1) {
                        param[key] = data.queryParams[key].value;
                    } else {
                        param[key] = data.queryParams[key].value - 0;
                    }
                }
            }
        });
        // 企业地区
       
        if (param.RecruitDate && moment(param.RecruitDate).isValid()) {
            param.RecruitDate = param.RecruitDate.format("YYYY-MM-DD");
        } else {
            param.RecruitDate = moment().format("YYYY-MM-DD");
        }
        if (param.Phone) delete param.Phone;
        if (param.NationInfo) {
            if (param.NationInfo.value) param.NationInfo = param.NationInfo.value;
            else if (param.NationInfo.text) param.NationInfo = param.NationInfo.text;
            else delete param.NationInfo;
        }
        if (param.Tattoo) {
            param.Tattoo = param.Tattoo.reduce((total, val) => total + (val - 0), 0);
        } else {
            delete param.Tattoo;
        }
        if (param.SmokeScar) {
            param.SmokeScar = param.SmokeScar.reduce((total, val) => total + (val - 0), 0);
        } else {
            delete param.SmokeScar;
        }
        ActionMAMSRecruitment.GetMAMSRecruitmentList(param);
    }

    handleRowClick(record) {
        // console.log("record", record);
        ActionMAMSRecruitment.GetMAMSRecruitmentRequireInfo({RecruitTmpID: record.RecruitTmpID, RecruitDate: record.Date || moment().format("YYYY-MM-DD")});
    }

    handleEntrustRecruit(record, e) {
        // console.log("record", record, e);
        if (e) e.stopPropagation();
        let entrust = this.props.entrust;
        setParams(entrust.state_name, {Data: Object.assign({}, record)});
    }

    handleRefresh() {

    }

    handleViewDetail = (record) => {
        console.log(record);
        browserHistory.push({
            pathname: '/ec/main/recruit/detail/' + record.RecruitTmpID,
            query: {
                entName: record.RecruitName
            }
        });
    }

    render() {
        let data = this.props.list;

        return (
            <div className="recruitment-info-view">
                {/* <div className="ivy-page-title" style={{position: 'relative', overflow: "hidden"}}>
                   
                    <span style={{position: 'absolute', cursor: 'pointer', top: 0, right: '20px', padding: '0 8px'}} 
                    onClick={() => this.handleRefresh()}>
                    <i className="iconfont icon-shuaxin"></i>
                    </span> 
                </div> */}
                <h1 style={{padding: "10px", background: "#fff"}}>招工资讯</h1>
                <div className="container-fluid pt-24" style={{paddingBottom: '24px'}}>
                    <Card bordered={false}>
                        <Row type="flex" justify="space-between" style={{fontSize: 18}}>
                            <RecruitmentForm state_name={data.state_name} spread={data.spread}
                                             Phone={data.Phone}
                                             queryParams={data.queryParams}
                                             handleMatch={() => this.handleMatch()}
                                             handleSearch={() => this.handleSearch()}/>
                        </Row>
                    </Card>
                </div>
                <div className="container-fluid pb-24">
                    <Row gutter={16}>
                        <Col span={17}>
                            <Table rowKey={(record, index) => index}
                                   className="bg-white recruit-table" bordered={true}
                                   dataSource={data.RecordList}
                                   onRowClick={this.handleRowClick}
                                   pagination={{
                                       total: data.totalSize,
                                       pageSize: data.pageSize,
                                       current: data.currentPage,
                                       onChange: (page, pageSize) => setParams(data.state_name, {
                                           currentPage: page,
                                           pageSize: pageSize
                                       }),
                                       onShowSizeChange: (current, size) => setParams(data.state_name, {
                                           currentPage: current, pageSize: size
                                       }),
                                       showSizeChanger: true,
                                       showQuickJumper: true,
                                       showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                                   }}
                                   rowClassName={(record, index) => {
                                       // 招
                                       if (record.ListOrder == 'First') return 'is-recommend';
                                       // 一周内有报价
                                       else if (!record.ListOrder == 'Second') return 'not-recommend';
                                       // 一周内无报价
                                       else return 'not-recruiting';
                                   }}
                                   columns={this.tableColumns()}></Table>
                        </Col>
                        <Col span={7}>
                            <Affix offsetTop={32} target={() => document.querySelector('.ant-layout-content .ivy-page')}>
                                <table className='ant-table bg-white' style={{width: "100%"}}>
                                    <thead className="ant-table-thead">
                                    <tr>
                                        <th className="text-center">录用条件</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{this.requireInfo()}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Affix>
                        </Col>
                    </Row>
                </div>
                <RecruitEntrustModal entrust={this.props.entrust}/>
            </div>
        );
    }

    requireInfo() {
        let require = this.props.require.Data;
        if (!require || !this.require) return (<div style={{minHeight: '360px'}}></div>);
        return (
            <div className="pt-8 pb-8 pl-16 pr-16" style={{fontSize: '14px', lineHeight: '18px', minHeight: '360px'}}>
                <b>户籍要求:</b>&nbsp;{this.require.province}<br/>
                <b>民族要求:</b>&nbsp;{this.require.nation}<br/>
                <br/>
                <b>身份证允许类型：</b>&nbsp;{this.require.idCardType}<br/>
                <b>毕业证要求：</b>&nbsp;{this.require.education}<br/>
                <br/>
                <b>英文字母：</b>&nbsp;{this.require.english}<br/>
                <b>简单算术：</b>&nbsp;{this.require.math}<br/>
                <b>是否考试：</b>&nbsp;{this.require.exam}<br/>
                {/* <b>犯罪记录：</b>&nbsp;{this.require.criminal}<br/>*/}
                <b>无尘服：</b>&nbsp;{this.require.clothes}<br/>
                <b>体内异物：</b>&nbsp;{this.require.metal}<br/>
                <br/>
                <b>是否体检：</b>&nbsp;{this.require.physical}<br/>
                <b>人脸识别：</b>&nbsp;{this.require.face}<br/>
                <b>是否查案底：</b>&nbsp;{this.require.criminal}<br/>
                <b>身体状况：</b>&nbsp;{require.Body || "无要求"}<br/>
                <b>纹身要求：</b>&nbsp;{this.require.Tattoo}<br/>
                <b>烟疤要求：</b>&nbsp;{this.require.SmokeScar}<br/>
                <b>身高要求：</b>&nbsp;{this.require.height}<br/>
                <br/>
                <b>厂门口接站：</b>&nbsp;{this.require.FactoryPickup}<br/>
                <b>返厂规定：</b>&nbsp;{this.require.Return}<br/>
                {/* `赠送价值${(require.HoldCash / 100).FormatMoney({fixed: 2})}元的${require.Gift}`*/}
                <b>赠品内容：</b>&nbsp;{require.GiftName ? `赠送${require.GiftName}(押金${((require.GiftAmount || 0) / 100).FormatMoney({fixed: 2})}元)` : '无赠品'}<br/>
                <br/>
                <b>备注：</b>&nbsp;{require.Remark ? require.Remark : '无'}
            </div>);
    }

    tableColumns() {
        let columns = [
            {
                title: '企业', key: 'PositionName',
                className: 'recruit-name-td RecruitmentInfoPositionName',
                render: (text, record, index) => {
                    let iconClass = '';
                    return (
                        <div className="pl-16">
                            {record.RecruitName}
                            {
                                record.MasterPush * 1 == 1 ? <img src={zt_icon3x} style={{position: "absolute", left: "0", top: "0", width: "20px", height: "20px"}} /> : ""
                            }
                        </div>);
                }
            },
            {
                title: '工资', key: 'MinSalary',
                render: (text, item) => {
                    let arr = ['月', '天', '小时'];
                    return (<div>
                        
                                <div>{item.MinSalary / 100}元-{item.MaxSalary / 100}元</div> 
                                {(item.LabourCostList || []).map((item, index) => { 
                                        return <div className="no-wrap" key={index}>
                                        {`${this.eGenderAll[item.Gender] ? this.eGenderAll[item.Gender] : ''} 
                                            ${((item.SubsidyUnitPay + item.UnitPay) / 100)}元/${(arr[item.ValuateUnit])}`}
                                        </div>;
                                })}
                            </div>
                        );
                }
            },
            {
                title: '补贴', key: 'SubsidyList',
                render: (text, record) => {
                    if (record.SubsidyList) {
                        return (
                            <div>
                                {(record.SubsidyList || []).map((item, index) => {
                                    return <div className="no-wrap"
                                                key={index}>{`${this.eGenderAll[item.Gender] ? this.eGenderAll[item.Gender] : ''} ${item.SubsidyDay}
                                    天 ${(item.SubsidyAmount / 100).FormatMoney({fixed: 2})}元`}</div>;
                                })}
                            </div>);
                    } else {
                        return '';
                    }
                }
            },
            {
                title: '补贴类型', key: 'SubsidyType',
                render: (text, record) => {
                    const type = record.SubsidyList && !!record.SubsidyList.length ? record.SubsidyList[0].SubsidyType : 0;
                    const SubsidyTypeMap = {
                        1: '在职日',
                        2: '工作日'
                    };
                    return (
                        <span style={{color: type === 2 ? 'red' : 'inherit'}}>{SubsidyTypeMap[type] || ''}</span>
                    );
                }
            },
            {
                title: '收费', key: 'EnrollFeeList',
                render: (text, record) => {
                    if (record.EnrollFeeList) {
                        return (
                            <div>
                                {(record.EnrollFeeList || []).map((item, index) => {
                                    return <div
                                        key={index}>{`${this.eGenderAll[item.Gender] ? this.eGenderAll[item.Gender] : ''} ${(item.Fee / 100).FormatMoney({fixed: 2})}元`}</div>;
                                })}
                            </div>);
                    } else {
                        return '';
                    }

                }
            },
            {
                title: '年龄|性别', dataIndex: 'Age',
                render: (text, item) => {
                    let ma = '无年龄要求';
                    let fa = '无年龄要求';
                    let mf = '不限';
                    if (item.MaleMaxAge || item.MaleMinAge) {
                        ma = `${item.MaleMinAge} - ${item.MaleMaxAge}`;
                    }
                    if (item.FeMaleMinAge || item.FeMaleMaxAge) {
                        fa = `${item.FeMaleMinAge} - ${item.FeMaleMaxAge}`;
                    }
                    if (item.MaleScale == 0 && item.FemaleScale == 0) {
                        mf = '不限';
                    } else if (item.MaleScale && item.FemaleScale == 0) {
                        mf = '只招男的';
                    } else if (item.MaleScale == 0 && item.FemaleScale) {
                        mf = '只招女的';
                    } else {
                        mf = `${item.MaleScale} : ${item.FemaleScale}`;
                    }
                    return (
                        <div>
                            <div className='no-wrap' style={{display: (item.MaleScale == 0 && item.FemaleScale ? 'none' : '')}}>{`男: ${ma}`}</div>
                            <div className='no-wrap' style={{display: item.MaleScale && item.FemaleScale == 0 ? 'none' : ''}}>{`女: ${fa}`}</div>
                            <div className='no-wrap' style={{display: item.MaleScale == 0 && item.FemaleScale == 0 ? 'none' : ''}}>{`男女比例: ${mf}`}</div>
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
            },
            {
                title: '名额', dataIndex: 'WantNumber',
                render: (text, record) => {
                    return (
                        <span style={{
                            color: (text * 1.2) > 0 && (text * 1.2) <= record.PickUpNumber ? 'red' : 'inherit'
                        }}>{text === 0 ? '不限' : text}</span>
                    );
                }
            },
            {
                title: '操作', key: 'Operate',
                render: (text, item) => {
                    return (
                        <a onClick={() => this.handleViewDetail(item)}>详情</a>
                    );
                }
            }
        ];
        return columns;
    }
}

export default RecruitmentInfo;