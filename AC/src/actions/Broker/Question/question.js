import createAction from 'ACTION/createAction';
import getquestionData from 'SERVICE/Broker/question';

function getquestionDataed(params) {
    return {
        promise: getquestionData.question(params)
    };
};

export default createAction(getquestionDataed);