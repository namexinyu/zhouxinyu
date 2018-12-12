## AutoCompeteInput组件使用方式

#### 1. 服务端返回内容参考
 ```json
{
  "Code": 0,
  "Message": "ok",
  "Data": {
    "RecruitList": [{
        "RecruitID": 1978291,
        "RecruitName": "城北富士康"
      },
      {
        "RecruitID": 1978291,
        "RecruitName": "昆山世硕小时工"
      },
      {
        "RecruitID": 1978291,
        "RecruitName": "京东临时工"
      },
      {
        "RecruitID": 1978291,
        "RecruitName": "世硕派遣工"
      },
      {
        "RecruitID": 1978291,
        "RecruitName": "周薪薪-世硕机床切削"
      },
      {
        "RecruitID": 1978291,
        "RecruitName": "我也不知道什么企业"
      }
    ]
  }
}
 ```
#### 2. 用法
------
#### 2.1 用法一（无getFieldDecorator）

 ```javascript
import AutoCompeteInput from 'COMPONENT/AutoCompeteInput';
(<AutoCompeteInput
    className="mr-24"
    defaultValue={this.state.defaultAutoCompeteInputValue}
    value={this.state.autoCompeteInputValue}
    allowClear={true}
    style={{width: 120}}
    filterOption={true} // 是否对DataSource匹配
    isOnChangeFetch={true}
    fetchDataSource={{
        dataSourceFetch: (value) => RecruitmentService.getRecruitSimpleList({xxx: value + 'xxx'}),// value:AutoCompeteInput的输入值
        dataSourceKey: "RecruitList"// 后端返回的Data下的数组字段名称, 不设置则默认取Data自身
    }}
    dataKey="RecruitName" // dataSource中每个data显示的字段名称，不设置则默认取数组里的每个data自身
    // defaultDataSource={[ // 可以主动传入dataSource，将不会再调用fetch请求网络
    //     {RecruitID: 1978291, RecruitName: "企业111"},
    //     {RecruitID: 1978291, RecruitName: "企业12"},
    //     {RecruitID: 1978291, RecruitName: "企业112"}]}
    defaultDataSource={null} // 可以主动传入dataSource，将不会再调用fetch请求网络
    isFetchErrorRetry={true} // 如果没有设置dataSource，当promise失败时是否在onChange时重试。isOnChangeFetch=true时，此属性无用
    fetchTimeOut={500} // 请求网络的延迟，用于组件加载、失败后重试和OnChangeFetch请求网络时，默认800ms
    handleQueryDataSource={dataSource => {
        console.log('AutoCompleteInput handleQueryDataSource', dataSource);
        this.setState({xxxDataSource: dataSource});
    }}
    handleChange={value => {
        console.log('AutoCompeteSelect handleChange', value);
        this.setState({autoCompeteInputValue: value});
    }}
    handleSearch={value => {
        console.log('AutoCompeteSelect handleSearch', value);
    }}
    handleSelect={(data, index) => {
        console.log('AutoCompeteSelect handleSelect', data);
    }}
/>)
```
#### 2.1 用法二（getFieldDecorator）

 ```javascript
import AutoCompeteInput from 'COMPONENT/AutoCompeteInput';
{getFieldDecorator('testFieldID', {
    rules: [{required: true, message: '请选择'}],
    initialValue: this.state.defaultAutoCompeteInputValue
})(<AutoCompeteInput
        className="mr-24"
        allowClear={true}
        style={{width: 120}}
        filterOption={true} // 是否对DataSource匹配
        // isOnChangeFetch={true}
        // defaultDataSource={[ // 可以主动传入dataSource，将不会再调用fetch请求网络
        //     {RecruitID: 1978291, RecruitName: "企业111"},
        //     {RecruitID: 1978291, RecruitName: "企业12"},
        //     {RecruitID: 1978291, RecruitName: "企业112"}]}
        fetchDataSource={{
            dataSourceFetch: (value) => RecruitmentService.getRecruitSimpleList({xxx: value + 'xxx'}),// value:AutoCompeteInput的输入值
            dataSourceKey: "RecruitList"// 后端返回的Data下的数组字段名称, 不设置则默认取Data自身
        }}
        dataKey="RecruitName" // dataSource中每个data显示的字段名称，不设置则默认取数组里的每个data自身
        defaultDataSource={null} // 可以主动传入dataSource，将不会再调用fetch请求网络
        isFetchErrorRetry={true} // 如果没有设置dataSource，当promise失败时是否在onChange时重试。isOnChangeFetch=true时，此属性无用
        fetchTimeOut={500} // 请求网络的延迟，用于组件加载、失败后重试和OnChangeFetch请求网络时，默认800ms
        handleQueryDataSource={dataSource => {
            console.log('AutoCompleteInput handleQueryDataSource', dataSource);
            this.setState({gongzhongDataSource: dataSource});
        }}
        handleChange={value => {
            console.log('AutoCompeteInput handleChange', value);
            // this.props.form.setFieldsValue({testField: value});
        }}
        handleSearch={value => {
            console.log('AutoCompeteInput handleSearch', value);
        }}
        handleSelect={(data, index) => {
            console.log('AutoCompeteInput handleSelect', data);
            this.props.form.setFieldsValue({testFieldID: data.RecruitID});
        }}
/>)}
```