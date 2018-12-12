import React, {Component} from 'react';
import './index.less';

export default class FooterToolbar extends Component {
    render() {
        const {children, extra, type} = this.props;
        return (
            <div className={'toolbar-' + (type ? type : 'foot')}>
                <div className="left">{extra}</div>
                <div className="right">{children}</div>
            </div>
        );
    }
}
