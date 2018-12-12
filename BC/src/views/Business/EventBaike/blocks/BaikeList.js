import React from 'react';
import {browserHistory, Link } from 'react-router';

import { CONFIG } from 'mams-com';
const { AppSessionStorage } = CONFIG;

import setParams from 'ACTION/setParams';
// import BaikeActions from "ACTION/Business/Baike/index";

import BaikeService from 'SERVICE/Business/Baike/index';

const {
  getCategoriesList,
  getTopSearch,
  getDocListByCategory,
  getSearchResults
} = BaikeService;

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  Modal,
  Dropdown,
  DatePicker,
  Tooltip,
  Menu,
  Icon,
  message,
  Radio,
  AutoComplete,
  Tabs,
  Pagination,
  Checkbox
} from 'antd';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;

const STATE_NAME = 'state_business_bake';

class BaikeList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: (this.props.baikeInfo.RecordIndex / this.props.baikeInfo.RecordSize) + 1,
      // page: 1,
      pageSize: 20,
      topSearchList: [],
      // categoryList: [],
      // activeTab: '',
      // docList: [],
      // docRecordCount: 0,
      dropdownMenuVisible: false
    };
  }

  componentWillMount() {
    if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
      getCategoriesList().then((res) => {
        if (res.Code === 0) {
          const categoryList = ((res.Data || {}).RecordList || []).filter(item => item);
  
          if (categoryList.length) {
            getDocListByCategory({
              Category: categoryList[0],
              RecordIndex: (this.state.page - 1) * this.state.pageSize,
              RecordSize: this.state.pageSize
            }).then((resp) => {
              if (resp.Code === 0) {
                setParams(STATE_NAME, {
                  categoryList: categoryList,
                  activeTab: categoryList[0],
                  docRecordCount: (resp.Data || {}).RecordCount || 0,
                  docList: (resp.Data || {}).RecordList || []
                });
                // this.setState({
                //   categoryList: categoryList,
                //   activeTab: categoryList[0],
                //   docRecordCount: (resp.Data || {}).RecordCount || 0,
                //   docList: (resp.Data || {}).RecordList || []
                // });
              } else {
                message.error(resp.Desc || '获取百科列表失败，请稍后尝试');
              }
            }).catch((err) => {
                message.error(err.Desc || '获取百科列表失败，请稍后尝试');
            });
          }
        } else {
          message.error(res.Desc || '获取百科分类失败，请稍后尝试');
        }
      }).catch((err) => {
          message.error(err.Desc || '获取百科分类失败，请稍后尝试');
      });
    }
  }

  handleSearchChange = (e) => {
    setParams(STATE_NAME, {
      SearchKey: e.target.value
    });
    this.searchResult(e.target.value);
  }

  searchResult = (value) => {
    if (value) {
      getTopSearch({
        Text: value
      }).then((res) => {
        if (res.Code === 0) {
          this.setState({
            topSearchList: (res.Data || {}).RecordList || []
          });
        } else {
          message.error(res.Desc || '获取数据失败，请稍后尝试');
        }
      }).catch((err) => {
          message.error(err.Desc || '获取数据失败，请稍后尝试');
      });
    } else {
      this.setState({
        topSearchList: []
      });
    }
  }

  // 切换tab
  handleTabChange = (activeKey) => {
    if (activeKey === '搜索结果') {
      this.fetchDocByQueryString(this.props.baikeInfo.SearchKey, 0, this.state.pageSize);
    } else {
      this.fetchDocByCategory(activeKey, 0, this.state.pageSize);
    }
    
    this.setState({
      page: 1
    });
    setParams(STATE_NAME, {
      activeTab: activeKey,
      RecordIndex: 0
    });
    // this.setState({
    //   activeTab: activeKey,
    //   page: 1
    // });
  }

  fetchDocByCategory = (activeKey, RecordIndex = 0, RecordSize = 20) => {
    getDocListByCategory({
      Category: activeKey,
      RecordIndex,
      RecordSize
    }).then((resp) => {
      if (resp.Code === 0) {
        setParams(STATE_NAME, {
          docRecordCount: (resp.Data || {}).RecordCount || 0,
          docList: (resp.Data || {}).RecordList || []
        });
        // this.setState({
        //   docRecordCount: (resp.Data || {}).RecordCount || 0,
        //   docList: (resp.Data || {}).RecordList || []
        // });
      } else {
        message.error(resp.Desc || '获取百科列表失败，请稍后尝试');
      }
    }).catch((err) => {
      message.error(err.Desc || '获取百科列表失败，请稍后尝试');
    });
  }

  fetchDocByQueryString = (searchKey, RecordIndex = 0, RecordSize = 20) => {
    getSearchResults({
      Text: searchKey,
      RecordIndex,
      RecordSize
    }).then((res) => {
      if (res.Code === 0) {
        setParams(STATE_NAME, {
          docList: (res.Data || {}).RecordList || [],
          docRecordCount: (res.Data || {}).RecordCount || 0
        });
        // this.setState({
        //   docList: (res.Data || {}).RecordList || [],
        //   docRecordCount: (res.Data || {}).RecordCount || 0
        // });
      } else {
        message.error(res.Desc || '获取数据失败，请稍后尝试');
      }
    }).catch((err) => {
        message.error(err.Desc || '获取数据失败，请稍后尝试');
    });
  }

  // 添加事件百科
  handleAddWiki = () => {
    browserHistory.push({
      pathname: '/bc/event-management/baike/new'
    });
  }

  // 选择top search结果
  handleSelectTopSearch = (item) => {
    browserHistory.push({
      pathname: '/bc/event-management/baike/detail',
      query: {
        id: item.DocID
      }
    });
  }

  // 点击搜索按钮
  handleClickOnSearch = () => {
    this.fetchDocByQueryString(this.props.baikeInfo.SearchKey);
    setParams(STATE_NAME, {
      activeTab: '搜索结果',
      categoryList: this.props.baikeInfo.categoryList.indexOf('搜索结果') !== -1 ? this.props.baikeInfo.categoryList : this.props.baikeInfo.categoryList.concat('搜索结果')
    });
    // this.setState({
    //   activeTab: '搜索结果',
    //   categoryList: this.state.categoryList.indexOf('搜索结果') !== -1 ? this.state.categoryList : this.state.categoryList.concat('搜索结果')
    // });
  }

  // 分页改变
  handlePageChange = (current, pageSize) => {
    setParams(STATE_NAME, {
      RecordIndex: (current - 1) * pageSize,
      RecordSize: pageSize
    });

    this.setState({
      page: current,
      pageSize: pageSize
    }, () => {
      if (this.props.baikeInfo.activeTab === '搜索结果') {
        this.fetchDocByQueryString(this.props.baikeInfo.SearchKey, (current - 1) * pageSize, pageSize);
      } else {
        this.fetchDocByCategory(this.props.baikeInfo.activeTab, (current - 1) * pageSize, pageSize);
      }
      // if (this.state.activeTab === '搜索结果') {
      //   this.fetchDocByQueryString(this.props.baikeInfo.SearchKey, (current - 1) * pageSize, pageSize);
      // } else {
      //   this.fetchDocByCategory(this.state.activeTab, (current - 1) * pageSize, pageSize);
      // }
    });
  }

  handleDropdownVisible = (visible) => {
    this.setState({
      dropdownMenuVisible: !this.state.dropdownMenuVisible
    });
  }

  handleOnPressEnter = () => {
    this.handleDropdownVisible();
    this.handleClickOnSearch();
  }
  
  render() {
    const {
      form: { getFieldDecorator },
      baikeInfo: {
        SearchKey,
        categoryList,
        docList,
        docRecordCount,
        activeTab
      }
    } = this.props;

    const {
      page,
      pageSize,
      topSearchList,
      // categoryList,
      // docList,
      // docRecordCount,
      // activeTab,
      dropdownMenuVisible
    } = this.state;

    const menu = (
      <Menu className="top-search-menu">
        {topSearchList.map((item, i) => (
          <Menu.Item key={i}>
            <div className="top-search-menu__item" onClick={() => this.handleSelectTopSearch(item)}>{item.Title}</div>
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div>
        <div className="ivy-page-title">
          <h1>事件百科</h1>
        </div>
        <div style={{padding: 24}}>
          <Row style={{
            backgroundColor: '#fff',
            padding: 20
          }}>
            <Col span={24}>
              <div>
                <Row>
                  <Col span={24}>
                    <div>
                      <Form>
                        <Row gutter={8}>
                          <Col span={12}>
                            <FormItem className="form-item__top-search">
                              <div className="flex">
                                <Dropdown overlay={menu} onVisibleChange={this.handleDropdownVisible} visible={dropdownMenuVisible}>
                                    <Input
                                      value={SearchKey}
                                      onPressEnter={this.handleOnPressEnter}
                                      onChange={this.handleSearchChange}
                                    />
                                </Dropdown>
                                <Button type="primary" onClick={this.handleClickOnSearch}>搜索</Button>                                
                              </div>
                            </FormItem>
                            
                          </Col>
                          <Col span={8} offset={2}>
                            <Button type="primary" onClick={this.handleAddWiki}>添加</Button>                            
                          </Col>
                        </Row>
                      </Form>
                      
                    </div>
                  </Col>
                </Row>

                <Row className="mt-20">
                  <Col span={24}>
                    <Tabs
                      onChange={this.handleTabChange}
                      type="card"
                      className="event-baike-tabs"
                      activeKey={activeTab}>
                      {categoryList.map((item, i) => (
                        <TabPane tab={item} key={item}>
                          {docList.length ? (
                            <div>
                              <ul className="doc-list">
                                {docList.map((cur, index) => (
                                  <li key={index} className="doc-list-item">
                                    <Link to={{pathname: '/bc/event-management/baike/detail', query: {id: cur.DocID}}}>{cur.Title}</Link>
                                  </li>
                                ))}
                              </ul>
                              <Pagination
                                pageSizeOptions={['20', '40', '80']}
                                total={docRecordCount}
                                current={page}
                                pageSize={pageSize}
                                showTotal={(total, range) => {
                                  return ('第' + range[0] + '-' + range[1] + '条 共' + total + '条');
                                }}
                                onChange={this.handlePageChange} 
                              />
                            </div>
                          ) : '暂无数据'}
                          
                        </TabPane>
                      ))}
                    </Tabs>

                  </Col>
                </Row>

              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  } 
}

// export default Form.create({
//   mapPropsToFields(props) {
//     const {
//       SearchKey
//     } = props.baikeInfo.pageQueryParams;

//     return {
//       SearchKey
//     };
//   },
//   onFieldsChange(props, fields) {
//     setParams(STATE_NAME, {
//       pageQueryParams: Object.assign({}, props.baikeInfo.pageQueryParams, fields)
//     });
//   }
// })(BaikeList);


export default Form.create()(BaikeList);