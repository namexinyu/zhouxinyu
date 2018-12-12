import React from 'react';
import styles from '../../index.less';
import { Link } from 'react-router';
import TestResult from 'ACTION/Assistant/TestResult';
const { getFactoryDetail } = TestResult;

import {
  Table,
  Button
} from 'antd';

const columns = [
  {
    title: '题号',
    dataIndex: 'number',
    width: 60,
    indentSize: 0
  },
  {
    title: '类型',
    dataIndex: 'type',
    indentSize: 0,
    render: (text, recoder) => {
      if(recoder.type === 'subject') {
        return (<div>本次答题记录</div>);
      }
      if(recoder.type === 'answer') {
        return (<div>答案</div>);
      }
    }
  },
  {
    title: '企业名',
    dataIndex: 'EntName',
    indentSize: 0
  },
  {
    title: '区域',
    dataIndex: 'Address',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div
                style={recoder.LastAddress !== recoder.Address ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '规模',
    dataIndex: 'Scale',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastScale !== recoder.Scale ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '行业',
    dataIndex: 'Industry',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastIndustry !== recoder.Industry ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '发薪日',
    dataIndex: 'SalaryDate',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastSalaryDate !== recoder.SalaryDate ? {color: '#FF0000'} : {color: '#000000'}}>{text ? `${text}日` : ''}</div>
        );
      }
    }
  },
  {
    title: '吃',
    dataIndex: 'Eat',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastEat !== recoder.Eat ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '住',
    dataIndex: 'Live',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastLive !== recoder.Live ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '活',
    dataIndex: 'Hardworking',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastHardworking !== recoder.Hardworking ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '站/坐',
    dataIndex: 'StandSit',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastStandSit !== recoder.StandSit ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '妹子',
    dataIndex: 'Girls',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastGirls !== recoder.Girls ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '无尘服',
    dataIndex: 'CleannessClothing',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastCleannessClothing !== recoder.CleannessClothing ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '工资',
    dataIndex: 'Salary',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (
            <div>
              <span>{recoder.MinSalary}</span>~<span>{recoder.MaxSalary}</span>
            </div>
        );
      } else {
        return (
            <div>
              <span style={recoder.LastMinSalary !== recoder.MinSalary ? {color: '#FF0000'} : {color: '#000000'}}>{recoder.MinSalary}</span>
              ~
              <span style={recoder.LastMaxSalary !== recoder.MaxSalary ? {color: '#FF0000'} : {color: '#000000'}}>{recoder.MaxSalary}</span>
            </div>
        );
      }
    }
  },
  {
    title: '管理',
    dataIndex: 'Management',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastManagement !== recoder.Management ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '周边',
    dataIndex: 'Nearyby',
    indentSize: 0,
    render: (text, recoder) => {
      if (recoder.type === 'subject') {
        return (<div>{text}</div>);
      } else {
        return (
            <div style={recoder.LastNearyby !== recoder.Nearyby ? {color: '#FF0000'} : {color: '#000000'}}>{text}</div>
        );
      }
    }
  },
  {
    title: '用时',
    dataIndex: 'Time',
    indentSize: 0
  }
];

class FactoryTestDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      brokerID: Number(this.props.router.params.brokerId),
      querydate: this.props.router.location.query.QueryDate
    };
  }

  componentWillMount() {
    const {
    } = this.props;
    console.log(this.props);
    this.getDetail(this.state.brokerID);
  }
  getDetail = (brokerID) => {
    getFactoryDetail({
      BrokerID: brokerID,
      QueryDate: this.state.querydate
    });
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
            LastAddress: item.Address,
            LastCleannessClothing: item.CleannessClothing,
            LastEat: item.Eat,
            LastGirls: item.Girls,
            LastHardworking: item.Hardworking,
            LastIndustry: item.Industry,
            LastLive: item.Live,
            LastManagement: item.Management,
            LastMaxSalary: item.MaxSalary,
            LastMinSalary: item.MinSalary,
            LastNearyby: item.Nearyby,
            LastSalaryDate: item.SalaryDate,
            LastScale: item.Scale,
            LastStandSit: item.StandSit,
            Address: item.LastAddress,
            CleannessClothing: item.LastCleannessClothing,
            Eat: item.LastEat,
            EntName: item.EntName,
            Girls: item.LastGirls,
            Hardworking: item.LastHardworking,
            Industry: item.LastIndustry,
            Live: item.LastLive,
            Management: item.LastManagement,
            MaxSalary: item.LastMaxSalary,
            MinSalary: item.LastMinSalary,
            Nearyby: item.LastNearyby,
            SalaryDate: item.LastSalaryDate,
            Scale: item.LastScale,
            StandSit: item.LastStandSit
          }] };
      });
      return {
        newArr,
        RowKeys
      };
    }else {
      return {
        newArr: [],
        RowKeys: []
      };
    }
  }
  render() {
    // const data = [
    //   {
    //     "Address": "7qec",
    //     "CleannessClothing": "5o61",
    //     "Eat": "10z4",
    //     "EntName": "heok",
    //     "Girls": "nf5e",
    //     "Hardworking": "g652",
    //     "Industry": "",
    //     "LastAddress": "7qec",
    //     "LastCleannessClothing": "psep",
    //     "LastEat": "6pja",
    //     "LastGirls": "c5tj",
    //     "LastHardworking": "38le",
    //     "LastIndustry": "78i5",
    //     "LastLive": "1480",
    //     "LastManagement": "k658",
    //     "LastMaxSalary": "47mw",
    //     "LastMinSalary": "111",
    //     "LastNearyby": "4dpb",
    //     "LastSalaryDate": "g83x",
    //     "LastScale": "",
    //     "LastStandSit": "s666",
    //     "Live": "gl11",
    //     "Management": "s92j",
    //     "MaxSalary": "8h06",
    //     "MinSalary": "111",
    //     "Nearyby": "tvr9",
    //     "SalaryDate": "l697",
    //     "Scale": "1348",
    //     "StandSit": "f40i",
    //     "Time": 80705
    //   },
    //   {
    //     "Address": "7qec",
    //     "CleannessClothing": "5o61",
    //     "Eat": "10z4",
    //     "EntName": "heok",
    //     "Girls": "nf5e",
    //     "Hardworking": "g652",
    //     "Industry": "t6q0",
    //     "LastAddress": "3h7g",
    //     "LastCleannessClothing": "psep",
    //     "LastEat": "6pja",
    //     "LastGirls": "c5tj",
    //     "LastHardworking": "38le",
    //     "LastIndustry": "78i5",
    //     "LastLive": "1480",
    //     "LastManagement": "k658",
    //     "LastMaxSalary": "47mw",
    //     "LastMinSalary": "t21m",
    //     "LastNearyby": "4dpb",
    //     "LastSalaryDate": "g83x",
    //     "LastScale": "49n5",
    //     "LastStandSit": "s666",
    //     "Live": "gl11",
    //     "Management": "s92j",
    //     "MaxSalary": "8h06",
    //     "MinSalary": "vwbp",
    //     "Nearyby": "tvr9",
    //     "SalaryDate": "l697",
    //     "Scale": "1348",
    //     "StandSit": "f40i",
    //     "Time": 80705
    //   }
    // ];
    const {
      factoryTestDetail: {
        factoryTestDetail,
        isFetching
      }
    } = this.props;

    const { newArr, RowKeys} = this.setList(factoryTestDetail);
    return (
        <div
            style={{ width: '100%', padding: 24 }}
        >
          <div
              style={{ background: '#fff', padding: 24 }}
          >
            <Table
                className={styles['table-center']}
                columns={columns}
                rowKey={(item, index) => item.number || item.Id }
                dataSource={newArr}
                pagination={false}
                bordered={true}
                loading={isFetching}
                defaultExpandAllRows={true}
                expandRowByClick={true}
                expandedRowKeys={RowKeys}
            />
            <div style={{ textAlign: 'right' }}>
              <Button type='primary' style={{ marginTop: 10 }}>
                <Link to={`/ac/result/factory`}>返回</Link>
              </Button>
            </div>
          </div>
        </div>
    );
  }
}
export default (FactoryTestDetail);
