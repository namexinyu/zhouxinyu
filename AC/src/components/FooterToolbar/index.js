import React, {Component} from 'react';
import './index.less';

export default class FooterToolbar extends Component {
    render() {
        const {children, extra} = this.props;
        return (
            <div className="toolbar">
                <div className="left">{extra}</div>
                <div className="right">{children}</div>
            </div>
        );
    }
}
