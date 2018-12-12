import React from 'react';
import {ResponsiveContainer} from 'recharts';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import moment from 'moment';

class WorkerCount extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        let Transport = this.props.Transport || [];
        let ConvertData = Transport.reduce((result, data) => {
            result[data['Time']] = data['Amount'];
            return result;
        }, {});
        console.log('convert server data Transport', ConvertData);

        let chartData = [];
        for (let i = 0, mom1 = moment(), mom2 = moment().subtract(7, 'd'); i < 7; i++, mom1.subtract(1, 'd'), mom2.subtract(1, 'd')) {
            let date1 = mom1.format('YYYY-MM-DD');
            let shortDate1 = mom1.format('MM-DD');
            let week1 = mom1.format('ddd');

            let date2 = mom2.format('YYYY-MM-DD');
            // let shortDate2 = mom2.format('MM-DD');
            // let week2 = mom2.format('ddd');
            chartData.unshift({
                name: shortDate1 + week1,
                this_week: ConvertData[date1],
                last_week: ConvertData[date2]
            });
        }

        return (
            <ResponsiveContainer width="100%" aspect={2.5}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name" padding={{left: 20, right: 20}}/>
                    <YAxis label={{value: '数量:人', position: 'top', offset: 10}}/>
                    <Tooltip/>
                    <Legend verticalAlign="top" height={36}/>
                    <Line dataKey="last_week" name="本周" stroke="#69bdc1" unit='人'/>
                    <Line dataKey="this_week" name="上周" stroke="#aaaaaa" unit='人'/>
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default WorkerCount;