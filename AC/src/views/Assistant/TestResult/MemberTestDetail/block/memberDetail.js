import React from 'react';
import { Link } from 'react-router';
import TestResult from 'ACTION/Assistant/TestResult';
import { Table, Button } from 'antd';
import {browserHistory} from 'react-router';
import '../../index.less';
const { getMemberDetail } = TestResult;

class MemberTestDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log("999999999", props);
    this.state = {
      brokerID: Number(this.props.router.params.brokerId),
      querdata: this.props.router.params.querydate
    };
  }

  componentDidMount() {
    // 获取详情
    this.getDetail(this.state.brokerID);
  }

  getDetail = (brokerID) => {
    getMemberDetail({
      BrokerID: brokerID,
      QueryDate: this.state.querdata
    });
  }
  handleGoPage(path, query) {
    browserHistory.push({
      pathname: path,
      query: query
    });
  }

  goToMemberDetail(record) {
    this.handleGoPage('/ac/member/detail/' + record.BrokerID + '/' + record.UserID);
  }
  setList = (list) => {
    if (list && list.length > 0) {
      const RowKeys = [];
      const newArr = list.map((item, index) => {
        let Id = 'children' + (index + 1);
        RowKeys.push(index + 1);
        return {
          type: 'subject',
          number: index + 1,
          ...item,
          children: [{
            type: 'answer',
            Id,
            BrokerID: item.BrokerID,
            Birth: item.LastBirth,
            BrokerExamFlowID: item.BrokerExamFlowID,
            Education: item.LastEducation,
            InterviewDate: item.LastInterviewDate,
            MaritalStatus: item.LastMaritalStatus,
            Province: item.LastProvince,
            UserName: item.UserName,
            WorkYear: item.LastWorkYear,
            Wycas: item.LastWycas,
            LastBirth: item.Birth,
            LastEducation: item.Education,
            LastInterviewDate: item.InterviewDate,
            LastMaritalStatus: item.MaritalStatus,
            LastProvince: item.Province,
            LastWorkYear: item.WorkYear,
            LastWycas: item.Wycas
          }] };
      });
      return {
        newArr,
        RowKeys
      };
    } else {
      return {
        newArr: [],
        RowKeys: []
      };
    }
  }
  render() {
    const columns = [
      {
        title: '题号',
        dataIndex: 'number',
        width: 60,
        indentSize: 0,
        render: (text, recoder, index) => {
          return (<span className="num">{index + 1}</span>);
        }
      },
      {
        title: '类型',
        dataIndex: 'type',
        indentSize: 0,
        render: (text, recoder) => {
          return (
              <div className="wrap">
                <p>本次答题记录</p>
                <p>答案</p>
              </div>
          );
        }
      },
      {
        title: '联系日期',
        dataIndex: 'InterviewDate',
        indentSize: 0,
        render: (text, recoder) => {
          return (
              <div className="wrap">
                <p>{recoder.InterviewDate ? recoder.InterviewDate : '-'}</p>
                <p>-</p>
              </div>
          );
        }
      },
      {
        title: '姓名',
        dataIndex: 'UserName',
        indentSize: 0,
        render: (tetxt, recoder)=> {
          return (
              <div className="wrap">
                <p className="username" onClick={() => this.goToMemberDetail(recoder)}>{tetxt}</p>
                <p className="username" onClick={() => this.goToMemberDetail(recoder)}>{tetxt}</p>
              </div>
          );
        }
      },
      {
        title: '出生年',
        dataIndex: 'Birth',
        indentSize: 0,
        render: (text, recoder) => {
          return (
              <div className="wrap">
                <p>{recoder.Birth ? recoder.Birth : '-'}</p>
                <p style={recoder.LastBirth !== recoder.Birth ? {color: '#FF0000'} : {color: '#000000'}}>
                  {recoder.LastBirth ? recoder.LastBirth : '-'}
                </p>
              </div>
          );
        }
      },
      {
        title: '籍贯',
        dataIndex: 'Province',
        indentSize: 0,
        render: (text, recoder) => {
          return (
              <div className="wrap">
                <p>{recoder.Province ? recoder.Province : '-'}</p>
                <p style={recoder.LastProvince !== recoder.Province ? {color: '#FF0000'} : {color: '#000000'}}>
                  {recoder.LastProvince ? recoder.LastProvince : '-'}
                </p>
              </div>
          );
        }
      },
      {
        title: '学历',
        dataIndex: 'Education',
        indentSize: 0,
        render: (text, recoder) => {
          return (
              <div className="wrap">
                <p>{recoder.Education ? recoder.Education : '-'}</p>
                <p style={recoder.LastEducation !== recoder.Education ? {color: '#FF0000'} : {color: '#000000'}}>
                  {recoder.LastEducation ? recoder.LastEducation : '-'}
                </p>
              </div>
          );
        }
      },
      {
        title: '婚否',
        dataIndex: 'MaritalStatus',
        indentSize: 0,
        render: (index, recoder) => {
          return (
              <div className="wrap">
                <p>{recoder.MaritalStatus ? recoder.MaritalStatus : '-'}</p>
                <p style={recoder.LastMaritalStatus !== recoder.MaritalStatus ? {color: '#FF0000'} : {color: '#000000'}}>
                  {recoder.LastMaritalStatus ? recoder.LastMaritalStatus : '-'}
                </p>
              </div>
          );
        }
      },
      {
        title: '纹烟残案少',
        dataIndex: 'Wycas',
        indentSize: 0,
        render: (text, recoder)=> {
          return (
              <div className="wrap">
                <p>{recoder.Wycas ? recoder.Wycas : '-'}</p>
                <p style={recoder.LastWycas !== recoder.Wycas ? {color: '#FF0000'} : {color: '#000000'}}>
                  {recoder.LastWycas ? recoder.LastWycas : '-'}
                </p>
              </div>
          );
        }
      },
      {
        title: '打工经验',
        dataIndex: 'WorkYear',
        indentSize: 0,
        render: (text, recoder) => {
          return (
              <div className="wrap">
                <p>{recoder.WorkYear ? recoder.WorkYear : '-'}</p>
                <p>
                  {recoder.LastWorkYear ? recoder.LastWorkYear : '-'}
                </p>
              </div>
          );
        }
      },
      {
        title: '用时',
        dataIndex: 'Time',
        render: (text) => {
          return (
              <div className="wrap">
                <p>{text}</p>
                <p>-</p>
              </div>
          );
        }
      }
    ];
    const {
      MeTestDetail: {
        memberTestDetail,
        isFetching
      }
    } = this.props;
    const { newArr, RowKeys} = this.setList(memberTestDetail);
    return (
        <div
            style={{ width: '100%', padding: 24 }}
        >
          <div
              style={{ background: '#fff', padding: 24 }}
          >
            <Table
                className="need-do-table"
                columns={columns}
                rowKey={(item, index) => item.number || item.Id }
                dataSource={memberTestDetail}
                pagination={false}
                bordered={true}
                loading={isFetching}
                defaultExpandAllRows={true}
                expandRowByClick={true}
                expandedRowKeys={RowKeys}
            />
            <div style={{ textAlign: 'right' }}>
              <Button type='primary' style={{ marginTop: 10 }}>
                <Link to={`/ac/result/member`}>返回</Link>
              </Button>
            </div>
          </div>
        </div>
    );
  }
}
export default (MemberTestDetail);
