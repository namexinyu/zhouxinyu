import React from 'react';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import setParams from 'ACTION/setParams';
import TagsAction from 'ACTION/Assistant/TagsAction';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

import TagsService from 'SERVICE/Assistant/TagsService';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
const employeeName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountName');

const { getTagMatchList } = TagsAction;
const { GetMAMSRecruitFilterList } = ActionMAMSRecruitment;
const { updateMatchTag, getMatchTags } = TagsService;

import {
  Button,
  Row,
  Col,
  message,
  Table,
  Select,
  Form,
  Icon,
  Modal,
  Radio,
  Popconfirm,
  Checkbox,
  Tag
} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { Column, ColumnGroup } = Table;

const STATE_NAME = 'state_ac_tag_match';

class TagMatch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.tagMatchInfo.pageQueryParams.RecordIndex / this.props.tagMatchInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      tagMatchModalVisible: false,
      currentMatchTags: [],
      remainingMatchTags: [],
      currentRecruitTmpID: '',
      currentRecord: {},
      matchTags: []
    };
  }

  componentWillMount() {
    this.fetchMatchTagList(this.props.tagMatchInfo.pageQueryParams);
    GetMAMSRecruitFilterList();
  }

  fetchMatchTagList = (queryParams = {}) => {
    const {
      RecruitTmpID = {},
      RecordIndex,
      RecordSize
    } = queryParams;

    getTagMatchList({
      PositionName: RecruitTmpID.value ? RecruitTmpID.value.text : '',
      RecordIndex,
      RecordSize
    });
  }

  handleSearch = () => {
    const {
      tagMatchInfo: {
        pageQueryParams
      }
    } = this.props;

    this.setState({
      page: 1,
      pageSize: pageQueryParams.RecordSize
    });

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams,
        RecordIndex: 0,
        RecordSize: pageQueryParams.RecordSize
      }
    });

    this.fetchMatchTagList({
      ...pageQueryParams,
        RecordIndex: 0,
        RecordSize: pageQueryParams.RecordSize
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  handleTableChange = ({current, pageSize }) => {
    const {
      tagMatchInfo: {
        pageQueryParams
      }
    } = this.props;

    this.setState({
      page: current,
      pageSize: pageSize
    });

    setParams(STATE_NAME, {
      pageQueryParams: {
        ...pageQueryParams,
        RecordIndex: (current - 1) * pageSize,
        RecordSize: pageSize
      }
    });

    this.fetchMatchTagList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleRemoveMatchTag = (RecruitTmpID, item) => {
    updateMatchTag({
      EmployeeID: employeeId,
      EmployeeName: employeeName,
      RecruitTmpID,
      AddTagList: [],
      RemoveTagList: [{
        CommonTagID: item.CommonTagID,
        CommonTagDetailID: item.CommonTagDetailID,
        TagName: item.CommonTagName,
        TagContent: item.CommonTagDetailIName
      }]
    }).then((res) => {
      if (res.Code === 0) {
        setParams(STATE_NAME, {
          tagMatchList: this.props.tagMatchInfo.tagMatchList.map((row) => {
            return {
              ...row,
              TagList: row.TagList.filter((tag) => {
                return tag.CommonTagID !== item.CommonTagID;
              })
            };
          })
        });
        message.success('删除成功');
      } else {
        message.error(res.Data.Desc || '删除失败');        
      }
    }).catch((err) => {
      message.error(err.Desc || '操作失败');
    });
  }

  handleShowModal = (record) => {
    const {
      RecruitTmpID,
      TagList
    } = record;
    const rowTagIds = TagList.map(item => item.CommonTagID);

    getMatchTags().then((res) => {
      if (res.Code === 0) {
        this.setState({
          tagMatchModalVisible: true,
          currentRecruitTmpID: RecruitTmpID,
          currentRecord: record,
          currentMatchTags: TagList.filter(item => item.CommonTagName !== ''),
          matchTags: res.Data.TagCommonList,
          remainingMatchTags: (res.Data.TagCommonList || []).filter(item => item.TagBody && !!item.TagBody.length).filter((item) => {
            return rowTagIds.indexOf(item.TagID) === -1;
          })
        });
      } else {
        message.error(res.Data.Desc || '获取标签库出错了');        
      }
    }).catch((err) => {
      message.error(err.Desc || '操作失败');
    });
  }

  handleHideModal = () => {
    this.setState({
      tagMatchModalVisible: false
    });
  }

  hanldeCheckRadio = (e) => {
    const checkedValue = e.target.value;
    
    this.setState({
      remainingMatchTags: this.state.remainingMatchTags.filter(item => item.TagID !== checkedValue.CommonTagId),
      currentMatchTags: this.state.currentMatchTags.concat(this.state.remainingMatchTags.filter(item => item.TagID === checkedValue.CommonTagId).map(item => {
        return {
          CommonTagID: item.TagID,
          CommonTagName: item.TagName,
          CommonTagDetailID: checkedValue.TagContentID,
          CommonTagDetailIName: checkedValue.TagContent
        };
      }))
    });
  }

  handleCheckTag = (e, TagID) => {
    let newMatchTags = [];
    if (e.target.checked) {
      newMatchTags = this.state.remainingMatchTags.map(item => {
        return {
          ...item,
          checkedValue: item.TagID === TagID ? item.TagBody[0] : item.checkedValue,
          checked: item.TagID === TagID ? true : item.checked
        };
      });
    } else {
      newMatchTags = this.state.remainingMatchTags.map(item => {
        return {
          ...item,
          checked: item.TagID === TagID ? false : item.checked
        };
      });
    }
    this.setState({
      remainingMatchTags: newMatchTags
    });
  }

  handleTransferUp = () => {
    this.setState({
      remainingMatchTags: this.state.remainingMatchTags.filter(item => !item.checked),
      currentMatchTags: this.state.currentMatchTags.concat(this.state.remainingMatchTags.filter(item => item.checked).map(item => {
        return {
          CommonTagID: item.TagID,
          CommonTagName: item.TagName,
          CommonTagDetailID: item.checkedValue.TagContentID,
          CommonTagDetailIName: item.checkedValue.TagContent
        };
      }))
    });
  }

  handleTransferDown = (TagID) => {
    this.setState({
      remainingMatchTags: this.state.remainingMatchTags.concat(this.state.matchTags.filter(item => item.TagID === TagID)),
      currentMatchTags: this.state.currentMatchTags.filter(item => item.CommonTagID !== TagID)
    });
  }

  handleSaveTagMatch = () => {
    const {
      currentRecruitTmpID,
      currentRecord,
      currentMatchTags
    } = this.state;

    const AddTagList = currentMatchTags.map(item => {
      if (this.getCommonTagIDList(currentRecord.TagList).indexOf(item.CommonTagID) === -1) {
        return {
          TagName: item.CommonTagName,
          TagContent: item.CommonTagDetailIName,
          CommonTagID: item.CommonTagID,
          CommonTagDetailID: item.CommonTagDetailID
        };
      }
      if (this.getCommonTagIDList(currentRecord.TagList).indexOf(item.CommonTagID) !== -1 &&
        item.CommonTagDetailID !== currentRecord.TagList.filter(current => current.CommonTagID === item.CommonTagID)[0].CommonTagDetailID
      ) {
        return {
          TagName: item.CommonTagName,
          TagContent: item.CommonTagDetailIName,
          CommonTagID: item.CommonTagID,
          CommonTagDetailID: item.CommonTagDetailID
        };
      }
    }).filter(item => item);

    const RemoveTaList = currentRecord.TagList.map(item => {
      if (this.getCommonTagIDList(currentMatchTags).indexOf(item.CommonTagID) === -1) {
        return {
          TagName: item.CommonTagName,
          TagContent: item.CommonTagDetailIName,
          CommonTagID: item.CommonTagID,
          CommonTagDetailID: item.CommonTagDetailID
        };
      }
      if (this.getCommonTagIDList(currentMatchTags).indexOf(item.CommonTagID) !== -1 &&
        item.CommonTagDetailID !== currentMatchTags.filter(current => current.CommonTagID === item.CommonTagID)[0].CommonTagDetailID
      ) {
        return {
          TagName: item.CommonTagName,
          TagContent: item.CommonTagDetailIName,
          CommonTagID: item.CommonTagID,
          CommonTagDetailID: item.CommonTagDetailID
        };
      }
    }).filter(item => item);

    if (!currentMatchTags.length) {
      message.warn('请先选择标签');
      return;
    }
    console.log(RemoveTaList);
    console.log(AddTagList);
    
    updateMatchTag({
      EmployeeID: employeeId,
      EmployeeName: employeeName,
      RecruitTmpID: currentRecruitTmpID,
      AddTagList: AddTagList,
      RemoveTagList: RemoveTaList
    }).then((res) => {
      if (res.Code === 0) {
        message.success(currentRecord.TagList.length ? '编辑成功' : '新增成功');
        this.handleHideModal();
        this.fetchMatchTagList(this.props.tagMatchInfo.pageQueryParams);
      } else {
        message.error(res.Data.Desc || (currentRecord.TagList.length ? '编辑失败' : '新增失败'));        
      }
    }).catch((err) => {
      message.error(err.Desc || '操作失败');
    });

  }

  getCommonTagIDList = (data) => {
    return data.map(item => item.CommonTagID);
  }

  render() {
    const {
      form: { getFieldDecorator },
      tagMatchInfo: {
        tagMatchList,
        RecordCount
      }
    } = this.props;

    const {
      page,
      pageSize,
      tagMatchModalVisible,
      currentMatchTags,
      remainingMatchTags,
      currentRecord
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>标签匹配</h1>
        </div>
        <Row>
          <Col span={24} style={{
            padding: "24px"
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "24px"
            }}>
              <Row>
                <Col span={24}>
                  <div>
                    <Form>
                      <Row>
                        <Col span={8}>
                          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="报名企业">
                            {getFieldDecorator('RecruitTmpID')(
                              <AutoCompleteSelect allowClear={true} optionsData={{
                                valueKey: 'RecruitTmpID',
                                textKey: 'RecruitName',
                                dataArray: this.props.allRecruitList
                              }}/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8} offset={1}>
                          <Button type="primary" onClick={this.handleSearch}>搜索</Button>
                          <Button className="ml-16" onClick={this.handleReset}>重置</Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>

              <Row className="mt-20">
                <Col span={24}>
                  <Table
                    rowKey={(record, index) => index}
                    dataSource={tagMatchList}
                    pagination={{
                      total: RecordCount,
                      defaultPageSize: pageSize,
                      defaultCurrent: page,
                      current: page,
                      pageSize: pageSize,
                      pageSizeOptions: ['40', '80', '120'],
                      showTotal: (total, range) => {
                       return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                      },
                      showSizeChanger: true,
                      showQuickJumper: true
                    }}
                    bordered={true}
                    onChange={this.handleTableChange}
                  >
                    <Column
                      title="序号"
                      dataIndex="index"
                      width={42}
                      render={(text, record, index) => {
                        return (index + 1) + pageSize * (page - 1);
                      }}
                    />
                    <Column
                      title="企业名称"
                      dataIndex="PositionName"
                      width={120}
                    />
                    <Column
                      title="企业标签"
                      dataIndex="TagList"
                      render={(text, record) => {
                        return (
                          (record.TagList || []).filter(item => item.CommonTagName !== '').map((item) => {
                            return (
                              <div className="qiye-tag" key={item.CommonTagID}>
                                <span className="ant-tag-text">
                                  {item.CommonTagName + '：'}
                                  <Radio checked={true}>{item.CommonTagDetailIName}</Radio>
                                </span>
                                <Popconfirm
                                  placement="top"
                                  title={<div>确认删除<span style={{color: '#f04134'}}>{record.PositionName}</span>的<span style={{color: '#f04134'}}>{item.CommonTagName}</span>标签?</div>}
                                  onConfirm={() => this.handleRemoveMatchTag(record.RecruitTmpID, item)}
                                  okText="确认" cancelText="取消">
                                  <Icon type="close" className="cursor-pointer" />
                                </Popconfirm>
                              </div>
                            );
                          })
                        );
                      }}
                    />
                    <Column
                      title="最新修改人"
                      dataIndex="ModifyEmployeeName"
                      width={90}
                    />
                    <Column
                      title="最新修改时间"
                      dataIndex="ModifyTime"
                      width={125}
                    />
                    <Column
                      title="操作"
                      dataIndex="action"
                      width={80}
                      render={(text, record) => {
                        return (
                          <div>
                            <Button type="primary" onClick={() => this.handleShowModal(record)}>{record.TagList.filter(item => item.CommonTagName != '').length ? '编辑' : '新增'}</Button>
                          </div>
                        );
                      }}
                    />
                  </Table>
                </Col>
              </Row>
            </div>
            <Modal
              title={`${(currentRecord.TagList && currentRecord.TagList.filter(item => item.CommonTagName != '').length) ? '编辑' : '新增'}标签`}
              visible={tagMatchModalVisible}
              onOk={this.handleSaveTagMatch}
              onCancel={this.handleHideModal}
            >
              <div className="tag-match-modal">
                <h2>标签名称：{currentRecord.PositionName}</h2>
                <div className="tag-match-field mt-30">
                  <h3>现有标签</h3>
                  <div className="tag-match-field__bd mt-10">
                    <div className="tag-match-field__panel">
                      {currentMatchTags.map(item => (
                        <div className="qiye-tag" key={item.CommonTagID}>
                          <span className="ant-tag-text">
                            {item.CommonTagName + '：'}
                            <Radio checked={true}>{item.CommonTagDetailIName}</Radio>
                          </span>
                          <Icon type="close" onClick={() => this.handleTransferDown(item.CommonTagID)} className="cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="tag-match-field mt-30">
                  <h3>标签库<span>（点击下列标签添加进企业）</span></h3>
                  <div className="tag-match-field__bd mt-10">
                    <div className="tag-match-field__panel">
                      {remainingMatchTags.map((item) => (
                        <div className="qiye-tag" key={item.TagID}>
                          <span className="ant-tag-text">
                            {item.TagName}：
                            <RadioGroup value={item.checkedValue} onChange={(e) => this.hanldeCheckRadio(e)}>
                              {(item.TagBody || []).map(tag => (
                                <Radio key={tag.TagContentID} value={tag}>{tag.TagContent}</Radio>
                              ))}
                            </RadioGroup>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      RecruitTmpID
    } = props.tagMatchInfo.pageQueryParams;

    return {
      RecruitTmpID
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.tagMatchInfo.pageQueryParams, fields)
    });
  }
})(TagMatch);
