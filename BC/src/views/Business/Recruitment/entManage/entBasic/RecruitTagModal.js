import React from 'react';
import {Row, Col, Modal, Checkbox} from 'antd';

export default class RecruitTagModal extends React.PureComponent {
    initTagListMap = (this.props.tagList || []).reduce((pre, cur) => {
        cur.TagList.forEach(item => {
            pre.add(item.TagID);
        });
        return pre;
    }, new Set());

    state = (this.props.initTags || []).reduce((pre, cur) => {
        pre[cur.TagID] = this.initTagListMap.has(cur.TagID);
        return pre;
    }, {});

    handleTagSelect = this.props.handleTagSelect;
    handleTagMax = this.props.handleTagMax;
    handleModalClose = this.props.handleModalClose;

    handleModalConfirm = () => {
        let selectTags = (this.props.tagList || []).reduce((pre, cur) => {
            cur.TagList.forEach(item => {
                if (this.state[item.TagID] === true) pre.push(item);
            });
            return pre;
        }, []);
        this.handleTagSelect(selectTags);
    };

    handleCheckboxChange = (e) => {
        let name = e.target.name;
        let index = name.split(',');
        let item = this.props.tagList[index[0]].TagList[index[1]];
        if (!e.target.checked || !this.handleTagMax || this.handleTagMax(this.state)) {
            this.setState(preState => {
                return {[item.TagID]: !preState[item.TagID]};
            });
        }
    };

    render() {
        const {tagList} = this.props;
        let span = Math.floor(24 / tagList.length);
        let gutter = Math.ceil((24 % tagList.length) / tagList.length);
        return (
            <Modal width='70%' title="选择企业标签"
                   visible={true}
                   onOk={this.handleModalConfirm}
                   onCancel={this.handleModalClose}>
                <Row gutter={gutter}>
                    {(tagList || []).map((item, index) => {
                        return (
                            <Col span={span} key={index}>
                                <div>{item.TagGroupName}</div>
                                {(item.TagList || []).map((childItem, childIndex) =>
                                    <div key={childIndex}>
                                        <Checkbox checked={this.state[childItem.TagID] === true}
                                                  name={index + ',' + childIndex}
                                                  onChange={this.handleCheckboxChange}>{childItem.TagName}</Checkbox>
                                    </div>
                                )}
                            </Col>
                        );
                    })}
                </Row>
            </Modal>
        );
    }
}