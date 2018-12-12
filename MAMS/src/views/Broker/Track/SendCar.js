import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SendCarNew from './blocks/SendCarNew';

// {...store_broker.state_today_track_send_car}

export default createPureComponent(({store_broker, location}) => {
    return (<SendCarNew list={store_broker.state_today_track_send_car_new}
                        HubSimpleList={store_broker.state_hub_list.HubSimpleList}
                        recruitList={store_broker.state_broker_recruitNameList}
                        {...store_broker.state_broker_member_detail_process}
                        location={location}/>);
});