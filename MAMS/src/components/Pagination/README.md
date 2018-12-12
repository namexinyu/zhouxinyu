# 分页组件使用方法


``` javascript
// totalSize    总数量
// pageSize     每页数量
// initPage     初始页码
// afterSelectedPage为选择页码后进行的回调。如果点击的页面相同，则不会触发
<Pagination totalSize={100} pageSize={10} afterSelectedPage={this.handleSelectedPage.bind(this)} initPage={6}/>
```