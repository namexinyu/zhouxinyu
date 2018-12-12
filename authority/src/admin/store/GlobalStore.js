import { observable, action, computed } from "mobx";
import { message } from 'antd';
import { getAllCompanyInfo, getAllBankPayAcct } from 'ADMIN_SERVICE/ZXX_BaseData';

import { getBankList } from 'ADMIN_SERVICE/ZXX_SystemCfg';

/**
 * 通用的Store，在多个页面 用同一数据源，可以在这里定义
 */
export default class {

    @action.bound
    getAgentText(agentID) {
        let res = this.agentList.find((value) => {
            return value.SpId == agentID;
        });
        return res == undefined ? '' : res.SpShortName;
    }

    @action.bound
    getLaborText(laborID) {
        let res = this.laborList.find((value) => {
            return value.SpId == laborID;
        });
        return res == undefined ? '' : res.SpShortName;
    }

    @action.bound
    getCompanyText(companyID) {
        let res = this.companyList.find((value) => {
            return value.EntId == companyID;
        });
        return res == undefined ? '' : res.EntShortName;
    }

    @action
    getBankList = async() => {
        try {
            const res = await getBankList();
            this.bankList = res.Data.RecordList;
            return res.Data.AgentList;
        } catch (err) {
            message.error(err.message);
        }
    }

    @action
    getAllBankPayAcct = async() => {
        try {
            const res = await getAllBankPayAcct();
            this.bankPayAccountList = res.Data.RecordList;
            return res.Data.RecordList;
        } catch (err) {
            message.error(err.message);
        }
    }
}