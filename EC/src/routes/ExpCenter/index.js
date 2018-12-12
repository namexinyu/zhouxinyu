import createLazyViewLoader from 'ROUTE/createLazyViewLoader';
import ec_addrsssManage from './address-manage';
import ec_dispatchTrack from './dispatch-track';
import ec_driverManage from './driver-manage';
import ec_dutyBroker from './duty-broker';
import ec_pickList from './pick-list';
import ec_chargeList from './charge-list';
import ec_supply from './supply';
import ec_promotionDetail from './promotion-detail';
import ec_priceAllocation from './price-allocation';
import ec_recruitInfo from './recruit-info';
import ec_recruitInfoDetail from './recruit-info-detail';
import ec_recruitTimeInfo from './recruit-time-info';
// import ec_assistance from './assistance';
import ec_signList from './sign-list';
import ec_staffManage from './staff-manage';
import ec_workBench from './work-bench';
import ec_systemMessage from './system-message';
import ec_hub from './hub';
import ec_boardingAddress from './boarding-address';
import ec_departmentStaff from "./department-staff";
import ec_carManage from './car-manage';
import ec_preCount from './pre-count';

import ec_BusSchedule from './BusSchedule';
import ec_BusRenter from "./BusRenter"; 
import ec_BusType from "./BusType";
import ec_Busoffer from "./Busoffer";
import ec_BusOrder from "./BusOrder";
import ec_landManage from './land-manage';
import ec_billList from './bill';
import ec_salary_calculator from './salary-calculator';
import ec_event_management from "./evententry";
export default {
    path: 'main',
    components: createLazyViewLoader(cb => {
        require.ensure([], require => cb(require('VIEW/App')));
    }),
    indexRoute: {
        component: createLazyViewLoader(cb => {
            require.ensure([], require => cb(require('VIEW/ExpCenter/WorkBench/index')));
        })
    },
    childRoutes: [
        // ec_assistance,
        ec_addrsssManage,
        ec_dispatchTrack,
        ec_driverManage,
        ec_carManage,
        ec_dutyBroker,
        ec_supply,
        ec_pickList,
        ec_chargeList,
        ec_promotionDetail,
        ec_recruitInfo,
        ec_recruitInfoDetail,
        ec_recruitTimeInfo,
        ec_signList,
        ec_staffManage,
        ec_workBench,
        ec_systemMessage,
        ec_boardingAddress,
        ec_priceAllocation,
        ec_hub,
        ec_departmentStaff,
        ec_preCount,
        ec_billList,
        ec_landManage,
        ec_BusSchedule,
        ec_BusRenter, 
        ec_BusType, 
        ec_Busoffer,
        ec_salary_calculator,
        ec_BusOrder,
        ec_event_management
    ]
};