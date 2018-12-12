import createAction from 'ACTION/createAction';
import getquestionData from 'SERVICE/Broker/question';

function getanswer(params) {
    return {
        promise: getquestionData.answer(params)
    };
};

export default createAction(getanswer);