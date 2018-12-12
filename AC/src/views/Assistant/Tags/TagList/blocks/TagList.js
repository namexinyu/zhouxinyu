import React from 'react';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import TagModal from './TagModal';

import getClient from 'COMPONENT/AliyunUpload/getClient';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import setParams from 'ACTION/setParams';
import TagsAction from 'ACTION/Assistant/TagsAction';
import TagsService from 'SERVICE/Assistant/TagsService';

import uploadRule from 'CONFIG/uploadRule';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
const employeeName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountName');

const { getTagList, getAllTagList } = TagsAction;
const { deleteTagContent, editTag, addTag, updateTag } = TagsService;

import {
  Button,
  Row,
  Col,
  message,
  Table,
  Select,
  Form,
  Input,
  Popconfirm,
  Icon,
  Modal,
  Upload,
  AutoComplete
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { Column } = Table;

const STATE_NAME = 'state_ac_tag_list';

class TagList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.tagStockInfo.pageQueryParams.RecordIndex / this.props.tagStockInfo.pageQueryParams.RecordSize) + 1,
      pageSize: 40,
      tagModalVisible: false,
      isEdit: false,
      currentTagId: '',
      tagModalForm: {
        Name: '',
        TagBody: [{
          Content: '',
          Upload: [],
          TagSpeech: '',
          Flag: 0
        }],
        TagRemark: ''
      },
      removedTagBody: [],
      previewImagesVisible: false,
      previewImages: []
    };
  }

  componentWillMount() {
    this.fetchTagList(this.props.tagStockInfo.pageQueryParams);
    setTimeout(() => {
      getAllTagList({
        TagName: '',
        RecordIndex: 0,
        RecordSize: 9999
      });
    }, 800);
    
  }

  fetchTagList = (queryParams = {}) => {
    const {
      TagName = {},
      RecordIndex,
      RecordSize
    } = queryParams;

    getTagList({
      TagName: TagName.value ? TagName.value.text : '',
      RecordIndex,
      RecordSize
    });
  }

  handleSearch = () => {
    const {
      tagStockInfo: {
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

    this.fetchTagList({
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
      tagStockInfo: {
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

    this.fetchTagList({
      ...pageQueryParams,
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });
  }

  handleRemoveTag = (CommonTagID, CommonTagDetailID) => {
    const { tagStockInfo: { tagList } } = this.props;

    deleteTagContent({
      CommonTagID,
      CommonTagDetailID,
      OperatorID: employeeId,
      OperatorName: employeeName
    }).then((res) => {
      if (res.Data.RetCode === 0) {
        setParams(STATE_NAME, {
          tagList: tagList.map((item) => {
            return {
              ...item,
              TagBody: item.TagBody.filter((tag) => {
                return tag.CommonTagDetailID !== CommonTagDetailID;
              })
            };
          })
        });
        message.success('成功删除标签内容');
      } else {
        message.error(res.Data.Desc || '操作失败');        
      }
    }).catch((err) => {
      message.error(err.Desc || '操作失败');
    });
  }

  handleManipulateTag = (CommonTagID, EidtType) => {
    editTag({
      OperatorID: employeeId,
      OperatorName: employeeName,
      CommonTagID,
      EidtType
    }).then((res) => {
      if (res.Data.RetCode === 0) {
        this.fetchTagList(this.props.tagStockInfo.pageQueryParams);
        message.success(EidtType === 3 ? '删除成功' : '操作成功');
      } else {
        message.error(res.Data.Desc || '操作失败');        
      }
    }).catch((err) => {
      message.error(err.Desc || '操作失败');
    });
  }

  handleShowModal = () => {
    this.setState({
      tagModalVisible: true,
      isEdit: false
    });
  }

  handleSaveTag = (modalInstance) => {
    modalInstance.props.form.validateFields((err, values) => {
      if (err) {
				console.log(err);
				return;
      }
      const { Name, TagRemark, TagBody = [] } = values;
      const tagContents = TagBody.map(item => item.Content);

      const uniqeResult = {};
      for (let i = 0; i < tagContents.length; i++) {
        if (uniqeResult[tagContents[i]] == null) {
          uniqeResult[tagContents[i]] = 1;
        } else {
          uniqeResult['__repeat__'] = tagContents[i];
          break;
        } 
      }

      console.log(uniqeResult);
      if (uniqeResult['__repeat__'] != null) {
        message.error('标签内容已存在：' + uniqeResult['__repeat__']);
        return;
      }
      
      const { pageQueryParams } = this.props.tagStockInfo;
      console.log(values);
      console.log(TagBody.filter(item => item.Flag !== 0).map(item => {
        return {
          OperatorID: employeeId,
          OperatorName: employeeName,
          CommonTagDetailID: item.CommonTagDetailID,
          CommonTagID: this.state.currentTagId,
          TagContent: item.Content,
          TagPicPath: (item.Upload || []).map(pic => pic.url),
          TagSpeech: item.TagSpeech,
          Flag: item.Flag
        };
      }).concat(this.state.removedTagBody.map(item => {
        return {
          OperatorID: employeeId,
          OperatorName: employeeName,
          CommonTagDetailID: item.CommonTagDetailID,
          CommonTagID: this.state.currentTagId,
          TagContent: item.Content,
          TagPicPath: (item.Upload || []).map(pic => pic.url),
          TagSpeech: item.TagSpeech,
          Flag: item.Flag
        };
      })));
      

      if (this.state.isEdit) {
        updateTag({
          TagName: Name,
          TagRemark: TagRemark,
          CommonTagID: this.state.currentTagId,
          OperatorID: employeeId,
          OperatorName: employeeName,
          TagBody: TagBody.filter(item => item.Flag !== 0).map(item => {
            return {
              OperatorID: employeeId,
              OperatorName: employeeName,
              CommonTagDetailID: item.CommonTagDetailID,
              CommonTagID: this.state.currentTagId,
              TagContent: item.Content,
              TagPicPath: (item.Upload || []).map(pic => pic.url),
              TagSpeech: item.TagSpeech,
              Flag: item.Flag
            };
          }).concat(this.state.removedTagBody.map(item => {
            return {
              OperatorID: employeeId,
              OperatorName: employeeName,
              CommonTagDetailID: item.CommonTagDetailID,
              CommonTagID: this.state.currentTagId,
              TagContent: item.Content,
              TagPicPath: (item.Upload || []).map(pic => pic.url),
              TagSpeech: item.TagSpeech,
              Flag: item.Flag
            };
          }))
        }).then((res) => {
          if (res.Code === 0) {
            message.success('编辑标签成功！');
            this.handleCancelTagModal(modalInstance);
            this.fetchTagList(this.props.tagStockInfo.pageQueryParams);
          } else {
            message.error(res.Data.Desc || '编辑标签失败');
          }
        }).then(() => {
          setTimeout(() => {
            getAllTagList({
              TagName: '',
              RecordIndex: 0,
              RecordSize: 9999
            });
          }, 1000);
        }).catch((err) => {
          message.error(err.Desc || '编辑标签失败');
        });
      } else {
        addTag({
          OperatorID: employeeId,
          OperatorName: employeeName,
          TagName: Name,
          TagRemark: TagRemark,
          TagBody: TagBody.map(item => {
            return {
              TagContent: item.Content,
              TagPicPath: item.Upload.map(pic => pic.url),
              TagSpeech: item.TagSpeech
            };
          })
        }).then((res) => {
          if (res.Code === 0) {
            message.success('新增标签成功！');
            this.handleCancelTagModal(modalInstance);
            this.fetchTagList(this.props.tagStockInfo.pageQueryParams);
          } else {
            message.error(res.Data.Desc || '新增标签失败');
          }
        }).then(() => {
          setTimeout(() => {
            getAllTagList({
              TagName: '',
              RecordIndex: 0,
              RecordSize: 9999
            });
          }, 1000);
        }).catch((err) => {
          message.error(err.Desc || '新增标签失败');
        });
      }
    });
  }

  hanldeOnRemoveTagContent = (modalInstance, index) => {
    const { form } = modalInstance.props;
    const TagBody = form.getFieldValue('TagBody');
    
    form.setFieldsValue({
      TagBody: TagBody.filter((item, i) => i !== index)
    });

    this.setState({
      removedTagBody: this.state.tagModalForm.TagBody.filter((item, i) => i === index)[0].Flag === 1 ?
        this.state.removedTagBody : this.state.removedTagBody.concat(this.state.tagModalForm.TagBody.filter((item, i) => i === index).map(item => {
          return {
            ...item,
            Flag: 2
          };
        })),
      tagModalForm: {
        ...this.state.tagModalForm,
        TagBody: this.state.tagModalForm.TagBody.filter((item, i) => i !== index)
      }
    });
  }

  hanldeOnAddTagContent = (modalInstance) => {
    const { form } = modalInstance.props;
    const TagBody = form.getFieldValue('TagBody');
    
    form.setFieldsValue({
      TagBody: TagBody.concat([{
        Content: '',
        Upload: [],
        TagSpeech: '',
        Flag: 1,
        CommonTagDetailID: 0
      }])
    });

    this.setState({
      tagModalForm: {
        ...this.state.tagModalForm,
        TagBody: this.state.tagModalForm.TagBody.concat([{
          Content: '',
          Upload: [],
          TagSpeech: '',
          Flag: 1,
          CommonTagDetailID: 0
        }])
      }
    });
  }

  handleOnInputChange = (modalInstance, index) => {
    const { form } = modalInstance.props;
    const TagBody = form.getFieldValue('TagBody');
    
    form.setFieldsValue({
      TagBody: TagBody.map((item, i) => {
        return {
          ...item,
          Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag)
        };
      })
    });

    this.setState({
      tagModalForm: {
        ...this.state.tagModalForm,
        TagBody: this.state.tagModalForm.TagBody.map((item, i) => {
          return {
            ...item,
            Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag)
          };
        })
      }
    });
  }

  handleUploadChange = (modalInstance, fileList, index) => {
    const { form } = modalInstance.props;
    const TagBody = form.getFieldValue('TagBody');

    if (fileList.length && fileList[fileList.length - 1].lastModified) {
      // getClient(uploadRule.tagPicture).then((client) => {
      //   setTimeout(() => {
      //     const { name, response, uid } = fileList[fileList.length - 1];
      //     console.log('responese', response);
      //     form.setFieldsValue({
      //       TagBody: TagBody.map((item, i) => {
      //         return {
      //           ...item,
      //           Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag),
      //           Upload: i === index ? item.Upload.concat([{
      //             uid,
      //             name,
      //             url: client.signatureUrl(response.name)
      //           }]) : item.Upload
      //         };
      //       })
      //     });

      //     this.setState({
      //       tagModalForm: {
      //         ...this.state.tagModalForm,
      //         TagBody: this.state.tagModalForm.TagBody.map((item, i) => {
      //           return {
      //             ...item,
      //             Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag),
      //             Upload: i === index ? item.Upload.concat([{
      //               uid,
      //               name,
      //               url: client.signatureUrl(response.name)
      //             }]) : item.Upload
      //           };
      //         })
      //       }
      //     });
      //   }, 1000);
      // });
    } else {
      form.setFieldsValue({
        TagBody: TagBody.map((item, i) => {
          return {
            ...item,
            Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag),
            Upload: i === index ? fileList : item.Upload
          };
        })
      });

      this.setState({
        tagModalForm: {
          ...this.state.tagModalForm,
          TagBody: this.state.tagModalForm.TagBody.map((item, i) => {
            return {
              ...item,
              Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag),
              Upload: i === index ? fileList : item.Upload
            };
          })
        }
      });
    }
  }

  handleUploadResponse = (modalInstance, fileList, res, index) => {
    const { form } = modalInstance.props;
    const TagBody = form.getFieldValue('TagBody');

    if (fileList.length && fileList[fileList.length - 1].lastModified) {
      getClient(uploadRule.tagPicture).then((client) => {
        const { name, response, uid } = fileList[fileList.length - 1];
        
        form.setFieldsValue({
          TagBody: TagBody.map((item, i) => {
            return {
              ...item,
              Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag),
              Upload: i === index ? item.Upload.concat([{
                uid,
                name,
                url: '//' + res.bucket + '.oss-cn-shanghai.aliyuncs.com' + res.name
              }]) : item.Upload
            };
          })
        });

        this.setState({
          tagModalForm: {
            ...this.state.tagModalForm,
            TagBody: this.state.tagModalForm.TagBody.map((item, i) => {
              return {
                ...item,
                Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag),
                Upload: i === index ? item.Upload.concat([{
                  uid,
                  name,
                  url: '//' + res.bucket + '.oss-cn-shanghai.aliyuncs.com' + res.name
                }]) : item.Upload
              };
            })
          }
        });
      });
    } else {
      form.setFieldsValue({
        TagBody: TagBody.map((item, i) => {
          return {
            ...item,
            Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag),
            Upload: i === index ? fileList : item.Upload
          };
        })
      });

      this.setState({
        tagModalForm: {
          ...this.state.tagModalForm,
          TagBody: this.state.tagModalForm.TagBody.map((item, i) => {
            return {
              ...item,
              Flag: item.Flag === 1 ? 1 : (i === index ? 3 : item.Flag),
              Upload: i === index ? fileList : item.Upload
            };
          })
        }
      });
    }
  }

  handleEditTag = ({
    TagName,
    TagRemark,
    TagBody,
    CommonTagID
  }) => {
    this.setState({
      isEdit: true,
      tagModalVisible: true,
      currentTagId: CommonTagID,
      tagModalForm: {
        Name: TagName,
        TagRemark,
        TagBody: TagBody.map((item) => {
          return {
            CommonTagDetailID: item.CommonTagDetailID,
            Content: item.TagContent,
            Upload: (item.TagPicPath || []).map((pic, i) => {
              return {
                uid: i,
                name: i,
                url: pic
              };
            }),
            TagSpeech: item.TagSpeech,
            Flag: 0
          };
        })
      }
    });
  }

  handleCancelTagModal = (modalInstance) => {
    modalInstance.props.form.resetFields();
    this.setState({
      tagModalVisible: false,
      isEdit: false,
      removedTagBody: [],
      tagModalForm: {
        Name: '',
        TagBody: [{
          Content: '',
          Upload: [],
          TagSpeech: '',
          Flag: 0
        }],
        TagRemark: ''
      }
    });
  }

  handlePreivewImages = (item) => {
    this.setState({
      previewImagesVisible: true,
      previewImages: (item.TagPicPath || []).map(pic => {
        return {
          src: pic
        };
      })
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      tagStockInfo: {
        tagList,
        allTagList,
        RecordCount
      }
    } = this.props;

    const {
      page,
      pageSize,
      tagModalVisible,
      tagModalForm,
      isEdit,
      previewImagesVisible,
      previewImages
    } = this.state;

    return (
      <div>
        <div className="ivy-page-title">
          <h1>标签库</h1>
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
                          <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label="企业标签">
                            {getFieldDecorator('TagName')(
                              <AutoCompleteSelect allowClear={true} optionsData={{
                                valueKey: 'CommonTagID',
                                textKey: 'TagName',
                                dataArray: allTagList
                              }}/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={8} offset={1}>
                          <Button type="primary" onClick={this.handleSearch}>搜索</Button>
                          <Button className="ml-16" onClick={this.handleReset}>重置</Button>
                        </Col>
                      </Row>
                      <Row type="flex" justify="end">
                        <Col span={8} style={{textAlign: "right"}}>
                          <Button className="active" onClick={this.handleShowModal} icon="plus">新增标签</Button>
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
                    dataSource={tagList}
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
                      title="企业标签"
                      dataIndex="TagName"
                      render={(text) => {
                        return (
                          <div style={{textAlign: "center"}}>{text}</div>
                        );
                      }}
                    />
                    <Column
                      title="标签内容"
                      dataIndex="TagBody"
                      render={(text, record) => {
                        return (
                          (record.TagBody || []).map((item) => {
                            return (
                              <div className="qiye-tag" key={item.CommonTagDetailID}>
                                <span className="ant-tag-text">{item.TagContent}</span>
                                {record.TagBody.length > 1 && (
                                  <Popconfirm
                                    placement="top"
                                    title="确认删除此项标签内容？"
                                    onConfirm={() => this.handleRemoveTag(record.CommonTagID, item.CommonTagDetailID)}
                                    okText="确认" cancelText="取消">
                                    <Icon type="close" className="cursor-pointer" />
                                  </Popconfirm>
                                )}
                                {item.TagPicPath && (
                                  <i onClick={() => this.handlePreivewImages(item)} className="icon-corner-picture"></i>
                                )}
                              </div>
                            );
                          })
                        );
                      }}
                    />
                    <Column
                      title="话术"
                      key="SpeechCraft"
                      render={(text, record) => {
                        return (
                          (record.TagBody || []).filter(item => item.TagSpeech != '').map((item) => {
                            return (
                              <div key={item.CommonTagDetailID}>
                                {item.TagContent + '：' + item.TagSpeech}
                              </div>
                            );
                          })
                        );
                      }}
                    />
                    <Column
                      title="备注"
                      dataIndex="TagRemark"
                    />
                    <Column
                      title="操作"
                      dataIndex="action"
                      width={230}
                      render={(text, record, index) => {
                        const seqIndex = (index + 1) + pageSize * (page - 1);
                        return (
                          <div>
                            <Button type="primary" icon="arrow-up" disabled={seqIndex === 1} onClick={() => this.handleManipulateTag(record.CommonTagID, 1)} className="mr-10" />
                            <Button type="primary" icon="arrow-down" disabled={seqIndex === RecordCount} onClick={() => this.handleManipulateTag(record.CommonTagID, 2)} className="mr-10" />
                            <Button type="primary" onClick={() => this.handleEditTag(record)} className="mr-10">编辑</Button>
                            <Popconfirm placement="top" title={(<span >确认删除关于 <span style={{color: "#f04134"}}>{record.TagName}</span> 的全部内容吗？</span>)} onConfirm={() => this.handleManipulateTag(record.CommonTagID, 3)} okText="确认" cancelText="取消">
                              <Button type="danger">删除</Button>
                            </Popconfirm>
                          </div>
                        );
                      }}
                    />
                  </Table>
                </Col>
              </Row>
              <TagModal
                visible={tagModalVisible}
                title={isEdit ? '编辑标签' : '新增标签'}
                tagForm={tagModalForm}
                onRemoveTagContent={this.hanldeOnRemoveTagContent}
                onAddTagContent={this.hanldeOnAddTagContent}
                onOk={this.handleSaveTag}
                onInputChange={this.handleOnInputChange}
                onUploadChange={this.handleUploadChange}
                onResponse={this.handleUploadResponse}
                onCancel={this.handleCancelTagModal}
              />
              <Viewer
                visible={previewImagesVisible}
                drag={false}
                zoomable={false}
                rotatable={false}
                scalable={false}
                noImgDetails={true}
                attribute={false}
                noNavbar={true}
                onClose={() => { this.setState({ previewImagesVisible: false }); } }
                images={previewImages}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields(props) {
    const {
      TagName
    } = props.tagStockInfo.pageQueryParams;

    return {
      TagName
    };
  },
  onFieldsChange(props, fields) {
    setParams(STATE_NAME, {
      pageQueryParams: Object.assign({}, props.tagStockInfo.pageQueryParams, fields)
    });
  }
})(TagList);
