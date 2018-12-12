import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Question from './blocks/requestion';

export default createPureComponent(({ store_broker, location, router}) => {
    return (<Question question={store_broker.state_broker_question} location={location} router={router}/>);
});