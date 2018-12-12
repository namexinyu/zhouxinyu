import createAction from 'ACTION/createAction';
import BusSchedule from 'SERVICE/ExpCenter/BusSchedule';

function getBusScheduleList(param) {
    return {
        promise: BusSchedule.getBusScheduleList(param)
    };
}

export default createAction(getBusScheduleList);