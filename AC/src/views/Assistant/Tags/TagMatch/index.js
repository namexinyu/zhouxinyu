import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import TagMatch from './blocks/TagMatch';

export default createPureComponent(({store_ac, store_mams}) => {
    return (
      <TagMatch
        tagMatchInfo={store_ac.state_ac_tag_match}
        allRecruitList={store_mams.state_mams_recruitFilterList.recruitFilterList}
      />
    );
});
