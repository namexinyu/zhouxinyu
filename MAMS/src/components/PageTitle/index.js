import React from 'react';

class PageTitle extends React.PureComponent {
    handleRefresh() {
        this.props.callRefresh();
    }
    render() {
        return (
            <div className="ivy-page-title">
                <span className="title-text">{this.props.title || '小样你还没有设置title'}</span>
                <span className="refresh-icon float-right" onClick={()=>this.handleRefresh()}>
                    <i className="iconfont icon-shuaxin"></i>
                </span>
            </div>
        );
    }
}

export default PageTitle;