import React from 'react';
import echarts from 'echarts/lib/echarts'; // 必须
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';

// const LineReact = asyncComponent(() => import('./EchartsDemo/LineReact')); // 折线图组件
function getDate(index) {
    var date = new Date(); // 当前日期
    var newDate = new Date();
    newDate.setDate(date.getDate() + index);// 官方文档上虽然说setDate参数是1-31,其实是可以设置负数的
    var time = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
    return time.slice(5);
}
class PieReact extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            currentDate: [getDate(-7), getDate(-6), getDate(-5), getDate(-4), getDate(-3), getDate(-2), getDate(-1)]
        };

        this.setPieOption = this.setPieOption.bind(this);
        this.initPie = this.initPie.bind(this);
    }

    initPie() {
        let box = document.getElementById('chartBox');
        let w = (document.getElementById('echartContainer').clientWidth - 260) + 'px';
        box.style.width = w;
        box.innerHTML = '';
        let ele = document.createElement('div');
        ele.id = 'pieReact';
        ele.style.width = w;
        ele.style.height = '400px';
        ele.style.margin = '0 auto';
        box.appendChild(ele);

        let myChart = echarts.init(ele); // 初始化echarts
        // 我们要定义一个setPieOption函数将data传入option里面
        let options = this.setPieOption();
        // 设置options
        myChart.setOption(options);
    }
    componentWillMount() {

    }
    componentDidMount() {
        this.initPie();
    }

    componentDidUpdate() {
        this.initPie();
    }

    render() {
        return (
            <div className="pie-react" id="chartBox">

            </div>
        );
    }

    // 一个基本的echarts图表配置函数
    setPieOption() {
        return {
            title: {
                text: '折线图堆叠'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['入职人数']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.state.currentDate
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '入职人数',
                    type: 'line',
                    stack: '总数',
                    data: this.props.data ? this.props.data : []
                }
            ]
        };
    }
}

export default PieReact;