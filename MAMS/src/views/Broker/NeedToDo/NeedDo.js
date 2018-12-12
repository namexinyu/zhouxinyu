import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import NeedDo from './blocks/index';


export default createPureComponent(({ store_broker, location }) => {
    return (
        <NeedDo
          needDo = {store_broker.state_need_to_do_data}
          havenDone = {store_broker.state_broker_have_done}
          resource = {store_broker.state_broker_header_resource}
          location= {location}
        />
    );
});
