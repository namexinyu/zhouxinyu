import history from 'ADMIN/routes/history';
import HomeStore from './HomeStore';
import AuthStore from './AuthStore';
import GlobalStore from './GlobalStore';


import PtResourceStore, { View as PtResourceView } from './systemManager/ptResourceStore';
import PtRoleStore, { View as PtRoleView } from './systemManager/ptRoleStore';
import UserManagerStore, { View as userManagerView } from './systemManager/userManager';
import EmployeeManagerStore, { View as employeeManagerView } from './systemManager/employeeManager';

const store = {
    globalStore: new GlobalStore(),
    ptRoleStore: new PtRoleStore(PtRoleView),
    ptResourceStore: new PtResourceStore(PtResourceView),
    userManagerStore: new UserManagerStore(userManagerView),
    employeeManagerStore: new EmployeeManagerStore(employeeManagerView)
};

const authStore = new AuthStore(history);
const homeStore = new HomeStore(history, store);
export { authStore, homeStore };
store.authStore = authStore;

export default store;