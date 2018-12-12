import React from 'react';
import {InputNumber} from 'antd';

export default class RecommendSalary extends React.Component {

    state = {};

    onChange = this.props.onChange ? (state) => {
        this.props.onChange({...this.props.value, ...state});
    } : this.setState;

    shouldComponentUpdate(nextProps, nextState) {
        let nextValue = nextProps.value;
        let thisValue = this.props.value;
        if (!nextValue || !thisValue) {
            nextValue = nextState;
            thisValue = this.state;
        }
        return nextValue.start !== thisValue.start || nextValue.end !== thisValue.end;
    }

    handleStartChange = (start) => {
        this.onChange({start});
    };

    handleEndChange = (end) => {
        this.onChange({end});
    };

    render() {
        const disabled = this.props.disabled;
        let value = this.props.value;
        const {start, end} = value ? value : this.state;
        return (
            <div>
                <InputNumber placeholder='请输入' disabled={disabled} min={0} onChange={this.handleStartChange}
                             value={start || 0}/> 元
                - <InputNumber placeholder='请输入' disabled={disabled} min={0} onChange={this.handleEndChange}
                               value={end || 0}/> 元
            </div>
        );
    }
}