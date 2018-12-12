import React from 'react';
import {getHeaderSystemInfo, markHeaderSystemInfo} from 'ACTION/Broker/Header/SystemInfo';
import 'UTIL/base/DataProcess/dateUtil';

class SystemInfoList extends React.PureComponent {

    componentWillMount() {
        // 判断是否返回、tab页切换，如果不是则执行下面代码
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getHeaderSystemInfo();
        }
    }

    handleMark(param) {
        markHeaderSystemInfo(param);
    };

    filterByTime(list) {
        let remindObj = {};
        for (let item of list) {
            let dateStr = this.filterDate(new Date(item.DateTime));
            if (remindObj[dateStr] !== undefined && remindObj[dateStr] !== null) {
                remindObj[dateStr].arr.push(item);
            } else {
                remindObj[dateStr] = {dateStr: dateStr, arr: [item]};
            }
        }
        remindObj = Object.keys(remindObj).map((key) => remindObj[key]);
        return remindObj;
    }

    filterDate(date) {
        let now = new Date();
        const dayDiff = now.DateDiff('d', date);
        if (dayDiff === 0) {
            return '今天';
        } else if (dayDiff === -1) {
            return '昨天';
        } else if (dayDiff === 1) {
            return '明天';
        } else if (dayDiff === 2) {
            return '后天';
        } else {
            return date.Format('yyyy年MM月dd日');
        }
    }

    render() {
        let dataList = this.filterByTime(this.props.dataList);
        return (
            <div className="container-fluid">
                <div className="row">
                    <table className="table ml-1 mr-1 bg-white">
                        <tr>
                            <th colSpan={3}>只显示近三天系统 共有{this.props.totalSize}条消息</th>
                        </tr>
                        {dataList.reduce((dataListItem1, dataListItem2) => {
                            dataListItem1.push(<tr>
                                <th colSpan={3}>{dataListItem2.dateStr}</th>
                            </tr>);
                            dataListItem2.arr.map((item) => dataListItem1.push((
                                <tr>
                                    <td>{item.DateTime}</td>
                                    <td>{item.Creator}</td>
                                    <td>{item.Content}</td>
                                </tr>
                            )));
                            return dataListItem1;
                        }, [])}
                    </table>
                </div>
            </div>
        );
    }
}

export default SystemInfoList;