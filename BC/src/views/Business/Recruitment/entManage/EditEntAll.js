import React from 'react';
import {Card, Button, Tabs, message, Spin} from 'antd';
import EntBasic from './entBasic';
import EntInfo from './entInfo';
import EntExtra from './entExtra';
import RecruitInfo, {RecruitInfoMap} from './recruitInfo';
import EnterpriseMapModal from './entBasic/EnterpriseMapModal';
import RecruitTagModal from './entBasic/RecruitTagModal';
import FooterToolbar from 'COMPONENT/FooterToolbar';
import getEnumMap from 'CONFIG/getEnumMap';
import doTabPage from 'ACTION/TabPage/doTabPage';
import tabClose from 'ACTION/tabClose';
import {getEntInfo, editEntAll, getEntTmpInfo, newEnt} from 'SERVICE/Business/Recruitment/Enterprise';
import {CONFIG} from "mams-com";
import CommonAction from 'ACTION/Business/Common';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
const {getEntTagList, getEntTmpList, getEntLevelCfg} = CommonAction;
const STATE_NAME = 'state_business_recruitment_ent_edit';
const tagMax = 3;

const InitialState = () => ({
    showMap: false, showAddTag: false, poi: {},
    entUpLoad: {
        USCCUrl: [],
        HireRuleUrl: [],
        EntLogoUrl: [],
        EntMaterialList: {},
        BannerUrl: []
    },

    entBasicState: {},
    entInfoState: {},
    recruitInfoState: {},
    entExtraState: {}
});
const EditEntAllForms = ['entBasic', 'entInfo', 'recruitInfo', 'entExtra'];

export default class EditEntAll extends React.PureComponent {

    state = {...InitialState(), ...this.props.state};
    type = this.props.location.query.type ? Number(this.props.location.query.type) : 0; // 1. copy, 2: audit
    id = this.props.location.query.id;
    tabId = this.props.location.pathname + this.props.location.search;

    categoryListObj = {};

    getCategoryIDObj = (CategoryID) => {
        let text = this.categoryListObj[CategoryID];
        return {
            data: {EnumValue: CategoryID, EnumDesc: text}, text,
            value: CategoryID.toString()
        };
    };

    getEntTagObjList = (RecruitTagConfIDs, EntTagListObj) => {
        return RecruitTagConfIDs ? RecruitTagConfIDs.split(',').reduce((pre, cur) => {
            pre.push({TagID: Number(cur), TagName: EntTagListObj[cur]});
            return pre;
        }, []) : [];
    };

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getEnumMap.getEnumMapByName('CategoryID').then((list) => {
                this.setState(preState => {
                    let state = {categoryList: list};
                    this.categoryListObj = list.reduce((pre, cur) => {
                        pre[cur.EnumValue] = cur.EnumDesc;
                        return pre;
                    }, {});
                    if (preState.entInfoState.CategoryID && preState.entInfoState.CategoryID.value) {
                        state.entInfoState = {
                            ...preState.entInfoState,
                            CategoryID: {
                                value: this.getCategoryIDObj(preState.entInfoState.CategoryID.value.value)
                            }
                        };
                    }
                    return state;
                });
            });
            if (this.state.isGetEntInfo !== true) {
                if (this.props.location.pathname.indexOf('new') === -1) {
                    let param = {EntShortID: Number(this.id), IsAudit: this.type === 2 ? 1 : 0};
                    getEntInfo(param).then(res => {
                        this.handleEntInfo(res.Data);
                    }).catch(err => {
                        message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
                        setTimeout(this.handleToolbarCancel, 1000);
                    }); 
                }
                
            }
        }
        getEntTagList();
        getEntTmpList();
        // getEntLevelCfg();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.common.EntTagListObj !== this.props.common.EntTagListObj && this.state.entInfoState.RecruitTagStr) {
            this.setState(preState => {
                return {
                    entInfoState: {
                        ...preState.entInfoState,
                        RecruitTagConfIDs: {value: this.getEntTagObjList(preState.state.entInfoState.RecruitTagStr, nextProps.common.EntTagListObj)},
                        RecruitTagStr: undefined
                    }
                };
            });
        }
    }

    parseJsonStr(jsonStr) {
        let result = {};
        try {
            let JsonObj = JSON.parse(jsonStr);
            if (JsonObj && JsonObj instanceof Array) {
                JsonObj.forEach(jsonItem => {
                    let jsonItemValue = jsonItem.value;
                    (jsonItemValue || []).forEach(item => {
                        let fieldName = RecruitInfoMap[item.key];
                        result['RecruitInfos_' + fieldName] = {value: item.value};
                    });
                });
            }
        } catch (ignore) {
        }
        return result;
    }

    handleEntInfo(entInfo) {
        let GenderRatio = (entInfo.GenderRatio || '').split(':').reduce((pre, cur, index) => {
            if (index === 0) pre.male = cur;
            if (index === 1) pre.female = cur;
            return pre;
        }, {});
        let LabourCostList = (entInfo.LabourCostList || []).map(item => ({
            ...item,
            SubsidyUnitPay: (item.SubsidyUnitPay || 0) / 100,
            UnitPay: (item.UnitPay || 0) / 100
        }));
        let entBasicState = {
            EntShortName: {value: entInfo.EntShortName || ''},
            PayType: {value: entInfo.PayType.toString()},
            ZXXType: {value: entInfo.ZXXType === 0 ? undefined : `${entInfo.ZXXType}`},
            Salary: {value: {start: (entInfo.MinSalary || 0) / 100, end: (entInfo.MaxSalary || 0) / 100}},
            SubsidyList: {
                value: (entInfo.SubsidyList || []).map(item => ({
                    ...item,
                    SubsidyAmount: (item.SubsidyAmount || 0) / 100
                }))
            },
            SubsidyRemark: {value: entInfo.SubsidyRemark || ''},
            EnrollFeeList: {
                value: (entInfo.EnrollFeeList || []).map(item => ({
                    ...item,
                    Fee: (item.Fee || 0) / 100
                }))
            },
            LabourCostList: {value: LabourCostList},
            LabourCostType: LabourCostList.reduce((pre, cur) => pre + cur.SubsidyUnitPay, 0) > 0 ? 1 : 0,
            RecruitAge: {
                value: {
                    MaleMinAge: entInfo.MaleMinAge,
                    MaleMaxAge: entInfo.MaleMaxAge,
                    FeMaleMinAge: entInfo.FeMaleMinAge,
                    FeMaleMaxAge: entInfo.FeMaleMaxAge
                }
            },
            GenderRatio: {value: GenderRatio},
            WarmTip: {value: entInfo.WarmTip},
            RecruitTagConfIDs: {value: this.getEntTagObjList(entInfo.RecruitTagConfIDs, this.props.common.EntTagListObj)},
            RecruitTagStr: entInfo.RecruitTagConfIDs,
            AreaCode: {value: CONFIG.getPCA.getPCACode(entInfo.AreaCode)},
            Address: {value: entInfo.Address},
            Longlat: {value: entInfo.Longlat},
            ClockRadius: {value: entInfo.ClockRadius}
        };
        let entInfoState = {
            EntName: {
                value: {
                    text: entInfo.EntName,
                    value: entInfo.EntTmpID,
                    data: this.props.common.EntTmpListObj[entInfo.EntTmpID]
                }
            },
            CategoryID: {value: this.getCategoryIDObj(entInfo.CategoryID)},
            GivenListDate: {value: entInfo.GivenListDate},
            Scale: {value: entInfo.Scale},
            USCC: {value: entInfo.USCC}
        };

        let recruitInfoState = {
            HealthRemark: {value: entInfo.HealthRemark},
            IDPhotoCopyCount: {value: entInfo.IDPhotoCopyCount},
            NeedIDPhoto: {value: entInfo.NeedIDPhoto === 1},
            DiplomaCount: {value: entInfo.DiplomaCount},
            NeedDiploma: {value: entInfo.NeedDiploma === 1},
            PhotoRemark: {value: entInfo.PhotoRemark}
        };

        if (entInfo.JobRequire) { // 岗位要求
            recruitInfoState = {...recruitInfoState, ...this.parseJsonStr(entInfo.JobRequire.replace(/\n/g, '\\n').replace(/\t/g, '\\t'))};
        }
        if (entInfo.Remuneration) { // 薪资待遇
            recruitInfoState = {...recruitInfoState, ...this.parseJsonStr(entInfo.Remuneration.replace(/\n/g, '\\n').replace(/\t/g, '\\t'))};
        }
        if (entInfo.RoomBoardInfo) { // 食宿介绍
            recruitInfoState = {...recruitInfoState, ...this.parseJsonStr(entInfo.RoomBoardInfo.replace(/\n/g, '\\n').replace(/\t/g, '\\t'))};
        }

        let entExtraState = {
            EntDesc: {value: entInfo.EntDesc}
        };

        this.setState({
            entBasicState,
            entInfoState,
            recruitInfoState,
            entExtraState,
            EntShortID: entInfo.EntShortID,
            EntTmpID: entInfo.EntTmpID,
            isGetEntInfo: true,
            poi: {
                longlat: entBasicState.Longlat.value,
                // clockLonglat: clockLonglat.value,
                clockRadius: entBasicState.ClockRadius.value
            },
            originalEntMaterialList: entInfo.EntMaterialList
        });

        getClient(uploadRule.entCertPicture).then((client) => {
            let entUpLoad = {};
            if (entInfo.USCCUrl) { // 营业执照
                entUpLoad.USCCUrl = [{
                    status: 'done',
                    uid: entInfo.USCCUrl,
                    name: entInfo.USCCUrl,
                    url: client.signatureUrl(entInfo.USCCUrl),
                    response: {
                        name: entInfo.USCCUrl
                    }
                }];
            }
            if (entInfo.HireRuleUrl) { // 招工简章
                entUpLoad.HireRuleUrl = [{
                    status: 'done',
                    uid: entInfo.HireRuleUrl,
                    name: entInfo.HireRuleUrl,
                    url: client.signatureUrl(entInfo.HireRuleUrl),
                    response: {
                        name: entInfo.HireRuleUrl
                    }
                }];
            }
            this.setState(preState => {
                return {entUpLoad: {...preState.entUpLoad, ...entUpLoad}};
            });
        });

        getClient(uploadRule.entMaterialPicture).then(client => {
            let entUpLoad = {};
            if (entInfo.EntMaterialList) {
                entUpLoad.EntMaterialList = Object.entries(entInfo.EntMaterialList).reduce((pre, cur) => {
                    let Category = cur[0];
                    let CategoryList = cur[1];
                    pre[Category] = CategoryList.map(item => ({
                        status: 'done',
                        uid: item.PicUrl,
                        name: item.PicUrl,
                        url: client.signatureUrl(item.PicUrl),
                        // sort: item.PicPriority,
                        desc: item.PicTip,
                        response: {
                            name: item.PicUrl
                        }
                    }));
                    return pre;
                }, {});
            }
            if (entInfo.EntLogoUrl) {
                entUpLoad.EntLogoUrl = [{
                    status: 'done',
                    uid: entInfo.EntLogoUrl,
                    name: entInfo.EntLogoUrl,
                    url: client.signatureUrl(entInfo.EntLogoUrl),
                    response: {
                        name: entInfo.EntLogoUrl
                    }
                }];
            }
            if (entInfo.BannerUrl) {
                entUpLoad.BannerUrl = entInfo.BannerUrl.split(',').map(url => ({
                    status: 'done',
                    uid: url,
                    name: url,
                    url: client.signatureUrl(url),
                    response: {
                        name: url
                    }
                }));
            }
            this.setState(preState => {
                return {entUpLoad: {...preState.entUpLoad, ...entUpLoad}};
            });
        });
    }

    // --------- start EntBasic

    handleSeeMap = () => {
        this.setState({showMap: true});
    };

    closeMapCall = (type, poi) => {
        if (type === 'cancel') {
            this.setState({showMap: false});
        }
        if (type === 'ok') {
            let Longlat = {value: poi.longlat};
            let ClockRadius = {value: poi.clockRadius};
            this.setState(preState => ({
                showMap: false, poi,
                entBasicState: {...preState.entBasicState, Longlat, ClockRadius}
            }));
        }
    };

    handleTagAdd = () => {
        getEntTagList();
        this.setState({showAddTag: true});
    };

    handleTagSelect = (selectTags) => {
        let RecruitTagConfIDs = {value: selectTags};
        this.setState(preState => ({
            showAddTag: false,
            entBasicState: {...preState.entBasicState, RecruitTagConfIDs}
        }));
    };

    handleTagMax = (value) => {
        let result = Object.values(value).filter(item => item === true).length < tagMax;
        if (!result) message.warn(`最多设置${tagMax}个标签`);
        return result;
    };

    handleTagModalClose = () => {
        this.setState({showAddTag: false});
    };

    // --------- end EntBasic

    // --------- start EntInfo
    handleUploadChange = (id, list) => {
        let IsTmpModify = false;
        let Category;
        if (id.indexOf('EntMaterialList') >= 0) {
            IsTmpModify = true;
            Category = id.split('_')[1];
        }
        this.setState(preState => {
            if (IsTmpModify) {
                id = 'EntMaterialList';
                let EntMaterialList = preState.entUpLoad.EntMaterialList || {};
                EntMaterialList[Category] = list;
                list = EntMaterialList;
            }
            return {
                entUpLoad: {...preState.entUpLoad, [id]: list},
                IsTmpModify: preState.IsTmpModify || IsTmpModify
            };
        });
    };

    // --------- end EntInfo

    handleTabChange = (tabKey) => {
        this.setState({tabKey});
    };

    handleToolbarSubmit = () => {
        let result = EditEntAllForms.reduce((pre, cur) => {
            let formRef = this.refs[cur];
            formRef.validateFieldsAndScroll((err, values) => {
                if (err) {
                    pre.err.push(err);
                } else {
                    pre.fields[cur] = values;
                }
            });
            return pre;
        }, {fields: {}, err: []});
        if (result.err.length) {
            return;
        }
        // this.setState({edit: true});
        let entBasicParam = EntBasic.obtainQueryParams(result.fields[EditEntAllForms[0]], this.state.entBasicState.LabourCostType || 0);
        console.log(entBasicParam, "1111111111111111");
        let entInfoParam = EntInfo.obtainQueryParams({
            ...result.fields[EditEntAllForms[1]],
            USCCUrl: this.state.entUpLoad.USCCUrl
        });
        let recruitInfoParam = RecruitInfo.obtainQueryParams(result.fields[EditEntAllForms[2]]);
        let entExtraParam = EntExtra.obtainQueryParams({
            ...result.fields[EditEntAllForms[3]],
            ...this.state.entUpLoad
        }, this.state.originalEntMaterialList);

        if (this.props.location.pathname.indexOf('new') === -1) {
            editEntAll({
                ...entBasicParam, ...entInfoParam, ...recruitInfoParam, ...entExtraParam,
                EntShortID: this.type === 1 ? 0 : Number(this.state.EntShortID),
                IsTmpModify: this.state.IsTmpModify ? 1 : 0,
                EntTmpAuditID: this.type === 2 ? Number(this.id) : 0,
                EntTmpID: this.state.EntTmpID
            })
                .then(res => {
                    message.success('修改成功');
                    setTimeout(() => {
                        this.setState({edit: false});
                        this.handleToolbarCancel();
                    }, 500);
                })
                .catch(err => {
                    this.setState({edit: false});
                    message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '修改失败');
                });
        } else {
            console.log('新建：entBasicParam', entBasicParam);
            console.log('新建：entInfoParam', entInfoParam);
            console.log('新建：recruitInfoParam', recruitInfoParam);
            console.log('新建：entExtraParam', entExtraParam);
            // console.log({
            //     ...entBasicParam, ...entInfoParam, ...recruitInfoParam, ...entExtraParam,
            //     EntTmpID: this.state.EntTmpID
            // });
            newEnt({
                ...entBasicParam, ...entInfoParam, ...recruitInfoParam, ...entExtraParam,
                EntTmpID: this.state.EntTmpID
            }).then((res) => {
                message.success('新建企业成功');
                setTimeout(() => {
                    this.setState({edit: false});
                    this.handleToolbarCancel();
                }, 500);
            }).catch((err) => {
                this.setState({edit: false});
                message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '新建企业失败');
            });
            
        }
        
    };

    handleToolbarCancel = () => {
        this.selfClose = true;
        doTabPage({id: this.tabId}, 'close');
    };

    handleSetParams = (stateName) => (params) => {
        this.setState(preState => ({
            [`${stateName}State`]: {...preState[`${stateName}State`], ...params}
        }));
    };

    onEntSelect = ({data}) => {
        if (data && data.EntTmpID) {
            const {entBasicState, entInfoState, recruitInfoState, entExtraState} = this.state;
            this.setState({edit: true, EntTmpID: data.EntTmpID});
            getEntTmpInfo({EntTmpID: data.EntTmpID})
                .then(res => {
                    let entInfo = res.Data;
                    if (entInfo) {
                        let entBasicState = {
                            ...entBasicState,
                            AreaCode: {value: CONFIG.getPCA.getPCACode(entInfo.AreaCode)},
                            Address: {value: entInfo.Address},
                            Longlat: {value: entInfo.Longlat},
                            ClockRadius: {value: entInfo.ClockRadius}
                        };
                        let entInfoState = {
                            ...entInfoState,
                            // EntName: {value: {text: entInfo.EntName}},
                            CategoryID: {value: this.getCategoryIDObj(entInfo.CategoryID)},
                            GivenListDate: {value: entInfo.GivenListDate},
                            Scale: {value: entInfo.Scale},
                            USCC: {value: entInfo.USCC}
                        };

                        const roomboardinfo = this.parseJsonStr((entInfo.RoomBoardInfo || '').replace(/\n/g, '\\n').replace(/\t/g, '\\t'));

                        const filteredRoomboardinfo = Object.keys(roomboardinfo).filter(key => !!roomboardinfo.value).reduce((wrap, key) => {
                            wrap[key] = roomboardinfo[key];
                        }, {});

                        // let recruitInfoState = {...recruitInfoState, ...this.parseJsonStr((entInfo.RoomBoardInfo || '').replace(/\n/g, '\\n'))};
                        let recruitInfoState = {...recruitInfoState, ...filteredRoomboardinfo};

                        let entExtraState = {...entExtraState, EntDesc: {value: entInfo.EntDesc}};

                        this.setState({
                            entBasicState,
                            entInfoState,
                            recruitInfoState,
                            entExtraState,
                            poi: {
                                longlat: entBasicState.Longlat.value,
                                // clockLonglat: clockLonglat.value,
                                clockRadius: entBasicState.ClockRadius.value
                            },
                            edit: false
                        });

                        getClient(uploadRule.entCertPicture).then((client) => {
                            let entUpLoad = {};
                            if (entInfo.USCCUrl) { // 营业执照
                                entUpLoad.USCCUrl = [{
                                    status: 'done',
                                    uid: entInfo.USCCUrl,
                                    name: entInfo.USCCUrl,
                                    url: client.signatureUrl(entInfo.USCCUrl),
                                    response: {
                                        name: entInfo.USCCUrl
                                    }
                                }];
                            }
                            if (entInfo.HireRuleUrl) { // 招工简章
                                entUpLoad.HireRuleUrl = [{
                                    status: 'done',
                                    uid: entInfo.HireRuleUrl,
                                    name: entInfo.HireRuleUrl,
                                    url: client.signatureUrl(entInfo.HireRuleUrl),
                                    response: {
                                        name: entInfo.HireRuleUrl
                                    }
                                }];
                            }
                            this.setState(preState => {
                                return {entUpLoad: {...preState.entUpLoad, ...entUpLoad}};
                            });
                        });

                        getClient(uploadRule.entMaterialPicture).then(client => {
                            let entUpLoad = {};
                            if (entInfo.EntMaterialList) {
                                entUpLoad.EntMaterialList = Object.entries(entInfo.EntMaterialList).reduce((pre, cur) => {
                                    let Category = cur[0];
                                    let CategoryList = cur[1];
                                    pre[Category] = CategoryList.map(item => ({
                                        status: 'done',
                                        uid: item.PicUrl,
                                        name: item.PicUrl,
                                        url: client.signatureUrl(item.PicUrl),
                                        // sort: item.PicPriority,
                                        desc: item.PicTip,
                                        response: {
                                            name: item.PicUrl
                                        }
                                    }));
                                    return pre;
                                }, {});
                            }
                            if (entInfo.EntLogoUrl) {
                                entUpLoad.EntLogoUrl = [{
                                    status: 'done',
                                    uid: entInfo.EntLogoUrl,
                                    name: entInfo.EntLogoUrl,
                                    url: client.signatureUrl(entInfo.EntLogoUrl),
                                    response: {
                                        name: entInfo.EntLogoUrl
                                    }
                                }];
                            }
                            if (entInfo.BannerUrl) {
                                entUpLoad.BannerUrl = entInfo.BannerUrl.split(',').map(url => ({
                                    status: 'done',
                                    uid: url,
                                    name: url,
                                    url: client.signatureUrl(url),
                                    response: {
                                        name: url
                                    }
                                }));
                            }
                            this.setState(preState => {
                                return {entUpLoad: {...preState.entUpLoad, ...entUpLoad}};
                            });
                        });
                    }
                })
                .catch(err => {
                    message.error(err.customDesc || err.Desc ? err.customDesc || err.Desc : '操作失败');
                    this.setState({edit: false});
                });
        }
    };

    render() {
        const {common} = this.props;
        const {showMap, poi, showAddTag, entBasicState, entInfoState, recruitInfoState, entExtraState, categoryList, entUpLoad, tabKey, edit} = this.state;
        return (
            <div>
                <FooterToolbar type='head'
                               extra={<span
                                   style={{fontSize: 20}}>{this.type === 2 ? '重新编辑' : (this.type === 1 ? '复制企业' : (this.props.location.pathname.indexOf('new') === -1 ? '编辑企业信息' : '新建企业'))}</span>}>
                    <Button htmlType="button" onClick={this.handleToolbarCancel} disabled={!!edit}>取消</Button>
                    <Button htmlType="button" className="ml-8" type="primary" disabled={!!edit}
                            onClick={this.handleToolbarSubmit}>提交</Button>
                </FooterToolbar>
                <Spin spinning={!!edit}>
                    <div className="container-fluid pt-24 pb-24 mt-50">
                        <Card bordered={false} title='基本信息'>
                            <EntBasic ref='entBasic' tagMax={tagMax}
                                      handleSeeMap={this.handleSeeMap}
                                      handleTagAdd={this.handleTagAdd}
                                      setParams={this.handleSetParams('entBasic')}
                                      params={entBasicState}
                                      isEdit={this.props.location.pathname.indexOf('new') !== -1 ? false : true}
                                      LabourCostType={entBasicState.LabourCostType || 0}
                                      poi={poi}/>

                            {showMap && <EnterpriseMapModal enableEdit={true}
                                                            closeCall={this.closeMapCall}
                                                            initPoi={poi}/>}
                            {showAddTag && <RecruitTagModal tagList={common.EntTagList}
                                                            initTags={entBasicState.RecruitTagConfIDs ? entBasicState.RecruitTagConfIDs.value : undefined}
                                                            handleTagMax={this.handleTagMax}
                                                            handleTagSelect={this.handleTagSelect}
                                                            handleModalClose={this.handleTagModalClose}
                            />}
                        </Card>

                        <Card bordered={false} title='企业信息' className='mt-16'>
                            <EntInfo
                                ref='entInfo'
                                setParams={this.handleSetParams('entInfo')}
                                params={entInfoState}
                                common={common} USCCUrl={entUpLoad.USCCUrl}
                                categoryList={categoryList}
                                handleUploadChange={this.handleUploadChange}
                                onEntSelect={this.onEntSelect}
                            />
                        </Card>

                        <Tabs className='mt-16' activeKey={tabKey || 'tab1'} onChange={this.handleTabChange}>
                            <Tabs.TabPane key="tab1" tab='招工信息' forceRender={true}>
                                <RecruitInfo
                                    ref='recruitInfo'
                                    setParams={this.handleSetParams('recruitInfo')}
                                    params={recruitInfoState}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane key="tab2" tab='企业补充' forceRender={true}>
                                <EntExtra
                                    ref='entExtra'
                                    setParams={this.handleSetParams('entExtra')}
                                    params={entExtraState}
                                    {...entUpLoad}
                                    handleUploadChange={this.handleUploadChange}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </Spin>
            </div>
        );
    }

    componentWillUnmount() {
        tabClose(STATE_NAME, {
            params: {[this.tabId]: this.selfClose === true ? {} : this.state}
        });
    }
}