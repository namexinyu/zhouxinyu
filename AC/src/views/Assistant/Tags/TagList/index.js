import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import TagList from './blocks/TagList';

export default createPureComponent(({store_ac}) => {
    return (
      <TagList
        tagStockInfo={store_ac.state_ac_tag_list}
      />
    );
});
