import React from 'react';
import {ResponsiveContainer} from 'recharts';
import {BarChart, Bar, XAxis, YAxis, Label, CartesianGrid, Tooltip, Legend} from 'recharts';
import moment from 'moment';

class WorkerType extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        let TypeCount = this.props.TypeCount;
        let ConvertData = {};
        for (let key of ['A', 'B', 'C']) {
            ConvertData['TypeCount' + key] = TypeCount['AmountList' + key] ? TypeCount['AmountList' + key]
                .reduce((result, data) => {
                    result[data['Time' + key]] = data['Amount' + key];
                    return result;
                }, {}) : {};
        }

        let chartData = [];
        for (let i = 0, mom = moment(); i < 7; i++, mom.subtract(1, 'd')) {
            let date = mom.format('YYYY-MM-DD');
            let shortDate = mom.format('MM-DD');
            let week = mom.format('ddd');
            chartData.unshift({
                name: shortDate + week,
                AmountA: ConvertData['TypeCountA'][date],
                AmountB: ConvertData['TypeCountB'][date],
                AmountC: ConvertData['TypeCountC'][date]
            });
        }

        return (
            <ResponsiveContainer width="100%" aspect={2.5}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis label={{value: '数量:人', position: 'top', offset: 10}}/>
                    <Tooltip/>
                    <Legend verticalAlign="top" height={36}/>
                    <Bar dataKey="AmountA" name="企业A" fill="#69bdc1" unit='人'/>
                    <Bar dataKey="AmountB" name="企业B" fill="#1d2a41" unit='人'/>
                    <Bar dataKey="AmountC" name="企业C" fill="#aaaaaa" unit='人'/>
                </BarChart>
            </ResponsiveContainer>
        );
    }
}

export default WorkerType;