import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import {role} from 'CONFIG/NavConfig';

const generateAuthority = (list) => {
    const roleList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role');
    let accountList_1 = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountList');
    let accountList = {};
    try {
        accountList_1 = JSON.parse(accountList_1);
        if (accountList_1 && accountList_1.length == 1) {
            accountList = accountList_1[0];
        }
    } catch (e) {
        console.log('权限数据异常');
    }
    const mdList = accountList.listBrokerManager || [];
    const madList = accountList.listBrokerManagerAssist || [];
    const dList = Array.from(new Set(mdList.concat(madList)));
    const agList = accountList.listBrokerSupervisor || [];
    const IsBoss = roleList && roleList.indexOf(role.BOSS) != -1;
    const IsSuper = roleList && roleList.indexOf(role.BROKER_SUPER) != -1;
    const IsManager = roleList && roleList.indexOf(role.MANAGER) != -1;
    const IsManagerAssist = roleList && roleList.indexOf(role.MANAGER_ASSIST) != -1;
    const IsAssistant = roleList && roleList.indexOf(role.ASSISTANT) != -1;
    let ShowDG = false;
    let eDepartment = {};
    for (let d of list) {
        eDepartment[d.DepartID] = d.DepartName;
    }
    eDepartment['-9999'] = '全部';
    let DGList = [{value: -9999, label: '全部', children: []}];
    if (IsBoss || IsSuper || IsManagerAssist) {
        ShowDG = true;
        for (let d of list) {
            let dItem = {
                value: d.DepartID,
                label: d.DepartName,
                children: []
            };
            for (let g of d.GroupList) {
                dItem.children.push({value: g.GroupID, label: g.GroupName});
            }
            DGList.push(dItem);
        }
    } else if (IsManager) {
        ShowDG = true;
        for (let d of dList) {
            let dTarget = list.find((v) => v.DepartID == d);
            if (!dTarget) continue;
            let dItem = {
                value: dTarget.DepartID,
                label: dTarget.DepartName,
                children: []
            };
            for (let g of dTarget.GroupList) {
                dItem.children.push({value: g.GroupID, label: g.GroupName});
            }
            DGList.push(dItem);
        }
    } else if (IsAssistant) {
        for (let d of list) {
            let dItem = {
                value: d.DepartID,
                label: d.DepartName,
                children: []
            };
            for (let g of d.GroupList) {
                if (agList.indexOf(g.GroupID)) {
                    dItem.children.push({value: g.GroupID, label: g.GroupName});
                }
            }
            if (dItem.children && dItem.children.length > 0) {
                if (dItem.children.length > 1) ShowDG = true;
                DGList.push(dItem);
            }
        }
    }
    AppSessionStorage.DG_SESSION_STORAGE.putItems({
        DGList: DGList,
        IsBoss: IsBoss,
        IsSuper: IsSuper,
        IsManager: IsManager,
        IsManagerAssist: IsManagerAssist,
        IsAssistant: IsAssistant,
        ShowDG: ShowDG,
        eDepartment: eDepartment
    });
};

const getAuthority = () => {
    const DGList = AppSessionStorage.DG_SESSION_STORAGE.getItem('DGList') || [];
    let eAuthDepartment = {};
    DGList.forEach((g) => {
        if (g.value != -9999) {
            eAuthDepartment[g.value + ''] = g.label;
        }
    });
    return {
        DGList: DGList,
        IsBoss: AppSessionStorage.DG_SESSION_STORAGE.getItem('IsBoss'),
        IsSuper: AppSessionStorage.DG_SESSION_STORAGE.getItem('IsSuper'),
        IsManager: AppSessionStorage.DG_SESSION_STORAGE.getItem('IsManager'),
        IsManagerAssist: AppSessionStorage.DG_SESSION_STORAGE.getItem('IsManagerAssist'),
        IsAssistant: AppSessionStorage.DG_SESSION_STORAGE.getItem('IsAssistant'),
        ShowDG: AppSessionStorage.DG_SESSION_STORAGE.getItem('ShowDG'),
        eAuthDepartment: eAuthDepartment,
        eDepartment: AppSessionStorage.DG_SESSION_STORAGE.getItem('eDepartment')
    };
};

export {generateAuthority, getAuthority};