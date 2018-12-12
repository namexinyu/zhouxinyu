import React from 'react';

// import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

import { PayTypeMap, ZxxTypeMap } from 'UTIL/constant/constant';

import PCA from 'CONFIG/PCA';

import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

const {
  getRecruitInfoDetail,
  getEntTagList
} = ActionMAMSRecruitment;

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  Modal,
  DatePicker,
  Card,
  message
} from 'antd';

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;

class RecruitInfoDetail extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  componentWillMount() {
    getRecruitInfoDetail({
      EntShortID: +this.props.router.params.recruitId,
      IsAudit: 0
    });
    getEntTagList();
  }

  getArea = (areaCode) => {
    const provinceCode = areaCode.replace(/(\d{2})\d{4}/, '$10000');
    const cityCode = areaCode.replace(/(\d{4})\d{2}/, '$100');
    return `${PCA.Province[provinceCode]}${Object.keys(PCA.City[provinceCode]).length > 1 ? PCA.City[provinceCode][cityCode] : ''}${Object.keys(PCA.City[provinceCode]).length > 1 ? PCA.Area[cityCode][areaCode] : PCA.Area[provinceCode][areaCode]}`;
  }

  getArrayInfoMap = (data) => {
    return (data || []).reduce((wrap, cur) => {
      wrap[cur.key] = cur.value;
      return wrap;
    }, {});
  }

  getEntTagMap = (tagList) => {
    return (tagList || []).reduce((wrap, item) => {
      (item.TagList || []).forEach(cur => {
        wrap[cur.TagID] = cur.TagName;
      });
      return wrap;
    }, {});
  }
  
  render() {
    const {
      recruitInfo
    } = this.props;

    const recruitDetailData = recruitInfo.recruitDetailData;

    console.log(recruitInfo);
    const tagsMap = this.getEntTagMap(recruitInfo.EntTagList);
    
    

    return (
      <div>
        <h1 style={{padding: "10px", background: "#fff"}}>{recruitDetailData.EntShortName ? `${recruitDetailData.EntShortName}招工资讯` : '招工资讯'}</h1>

        <div>
          <div style={{
            padding: 20
          }}>
            <Card bordered={false} title='基本信息'>
              <Row>
                <Col span={6}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="企业简称">
                    <div>{recruitDetailData.EntShortName || ''}</div>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="发薪方式">
                    <div>{PayTypeMap[recruitDetailData.PayType] || ''}</div>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="周薪薪类型">
                    <div>{recruitDetailData.PayType === 1 ? (ZxxTypeMap[recruitDetailData.ZXXType] || '') : ''}</div>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="企业标签">
                    <div>{recruitDetailData.RecruitTagConfIDs ? recruitDetailData.RecruitTagConfIDs.split(',').map(id => tagsMap[id]).join('，') : ''}</div>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                {/* <Col span={6}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="综合薪资">
                    <div>{(recruitDetailData.MinSalary === 0 && recruitDetailData.MaxSalary) ? 0 : `${recruitDetailData.MinSalary / 100}~${recruitDetailData.MaxSalary / 100}元` }</div>
                  </FormItem>
                </Col> */}
                <Col span={6}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="所属地区">
                    <div>{recruitDetailData.AreaCode ? this.getArea(recruitDetailData.AreaCode) : ''}</div>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="详细地址">
                    <div>{recruitDetailData.Address}</div>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="温馨提示">
                    <div>{recruitDetailData.WarmTip}</div>
                  </FormItem>
                </Col>
              </Row>

            </Card>


            <Card bordered={false} title='工资说明' className="mt-16">
              <div>
                <div>
                  <div><h3>【基本情况】</h3></div>
                  <div>
                    {recruitDetailData.Remuneration ? (
                      <Row>
                        {this.getArrayInfoMap(JSON.parse(recruitDetailData.Remuneration))['基本情况'].map(item => (
                          <Col span={8}>
                            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label={item.key}>
                              <div>{item.value}</div>
                            </FormItem>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <Row>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="发薪日">
                            <div></div>
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="底薪">
                            <div></div>
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="薪资结构">
                            <div></div>
                          </FormItem>
                        </Col>
                      </Row>
                    )}
                    
                  </div>
                </div>

                <div>
                  <div><h3>【食宿介绍】</h3></div>
                  <div>
                    {recruitDetailData.RoomBoardInfo ? (
                      <Row>
                        {this.getArrayInfoMap(JSON.parse(recruitDetailData.RoomBoardInfo))['食宿介绍'].map(item => (
                          <Col span={8}>
                            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label={item.key}>
                              <div>{item.value}</div>
                            </FormItem>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <Row>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="伙食">
                            <div></div>
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="住宿">
                            <div></div>
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="交通">
                            <div></div>
                          </FormItem>
                        </Col>
                      </Row>
                    )}
                    
                  </div>
                </div>

                <div>
                  <div><h3>【合同介绍】</h3></div>
                  <div>
                    {recruitDetailData.Remuneration ? (
                      <Row>
                        {this.getArrayInfoMap(JSON.parse(recruitDetailData.Remuneration))['合同介绍'].map(item => (
                          <Col span={8}>
                            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label={item.key}>
                              <div>{item.value}</div>
                            </FormItem>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <Row>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="合同说明">
                            <div></div>
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="工资发放">
                            <div></div>
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="保险说明">
                            <div></div>
                          </FormItem>
                        </Col>
                      </Row>
                    )}
                  </div>
                </div>
              </div>

            </Card>

            <Card bordered={false} title='岗位说明' className="mt-16">
              <div>
                <div>
                  <div><h3>【岗位状态】</h3></div>
                  <div>
                    {recruitDetailData.JobRequire ? (
                      <Row>
                        {this.getArrayInfoMap(JSON.parse(recruitDetailData.JobRequire))['岗位状态'].map(item => (
                          <Col span={8}>
                            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label={item.key}>
                              <div>{item.value}</div>
                            </FormItem>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <Row>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="工作内容">
                            <div></div>                          
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="工时说明">
                            <div></div>                          
                          </FormItem>
                        </Col>
                        <Col span={8}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="工作环境">
                            <div></div>                          
                          </FormItem>
                        </Col>
                      </Row>
                    )}
                  </div>
                </div>

                <div>
                  <div><h3>【其他信息】</h3></div>
                  <div>
                    <Row>
                      <Col span={8}>
                        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="体检说明">
                          <div>{recruitDetailData.HealthRemark || ''}</div>
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="身份证复印件">
                          <div>{recruitDetailData.IDPhotoCopyCount === 0 ? '' : `${recruitDetailData.IDPhotoCopyCount}份`}{recruitDetailData.NeedIDPhoto === 1 ? '扫描件' : ''}</div>
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="毕业证复印件">
                          <div>{recruitDetailData.DiplomaCount === 0 ? '' : `${recruitDetailData.DiplomaCount}份`}{recruitDetailData.NeedDiploma === 1 ? '原件' : ''}</div>
                        </FormItem>
                      </Col>
                    </Row>
                  </div>
                </div>

              </div>
            </Card>

          </div>
          
        </div>
        
      </div>
    );
  }
}

export default Form.create()(RecruitInfoDetail);
