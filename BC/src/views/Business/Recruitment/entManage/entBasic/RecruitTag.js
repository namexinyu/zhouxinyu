import React from 'react';
import {Tag, Button} from 'antd';

export default class RecruitTag extends React.PureComponent {

    state = {};

    handleTagAdd = this.props.handleTagAdd;

    onChange = value => this.props.onChange ? this.props.onChange(value) : this.setState({value});

    handleTagDelete = (index) => () => {
        let list = this.props.value;
        if (!list) list = this.state.value || [];
        let value = [...list];
        value.splice(index, 1);
        this.onChange(value);
    };

    render() {
        let value = this.props.value;
        if (!value) value = this.state.value || [];

        let max = this.props.max ? this.props.max : 5;

        return (
            <div>
                {value.map((item, index) => {
                    return <Tag key={item.TagID} closable
                                onClose={this.handleTagDelete(index)}>{item.TagName}</Tag>;
                })}
                <Button size='small' icon='plus' disabled={value.length >= max} onClick={this.handleTagAdd}>添加</Button>
            </div>
        );
    }
}