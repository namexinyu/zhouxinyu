import React from 'react';
import 'SCSS/components/selectable-input.scss';

/*
*   功能描述：输入框控件(支持根据输入内容展开下拉框选择)
*   接受的参数：
*   iptOptions：一些基础的设置参数。如展开多少个关键字等等。详见initOptions
*   iptValue:传入input对应的redux值
*   iptID:传入模糊匹配项id对应的redux值
*   dataArr:传入用于匹配的数组
*   onSelectData(item):传入选择下拉框内容后触发的回调函数
*   onChangeData(value):传入输入框内容改变后触发的回调函数
*/

let defaultOptions = {
    wordNum: 5,
    keyParam: 'id',
    valParam: 'name',
    className: 'col-2',
    iptClassName: 'form-control',
    placeholder: ''
};


export default class SelectableInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleChangeVal = this.handleChangeVal.bind(this);
        this.state = {
            inputValue: '',
            picked: false
        };
        this.selectList = [];
        this.currentItemID = null;
        this.option = Object.assign({}, defaultOptions, props.iptOptions);
        
    }

    componentWillMount() {
        this.filterSelectData(this.props);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUpdate(nextProps) {
        this.filterSelectData(nextProps);
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    filterSelectData({iptValue, iptID}) {
        this.selectList = [];
        if (iptValue == '' || iptValue == undefined || iptValue == null) return;
        if (iptID != null && iptID != undefined) return;
        let list = [];
        for (let item of this.props.dataArr) {
            if (list.length >= this.option.wordNum) break;
            if (item[this.option.valParam].indexOf(iptValue) != -1) {
                list.push(item);
            }
        }
        this.selectList = list;
    }

    handleChangeVal(e) {
        if (this.props.iptID != null && this.props.iptID != undefined) {
            if (typeof (this.props.onSelecteData) == 'function') this.props.onSelecteData(null);
        }
        if (typeof (this.props.onChangeData) == 'function') this.props.onChangeData(e.target.value);

    }

    handleClickPickItem(item) {
        if (typeof (this.props.onSelecteData) == 'function') {
            this.props.onChangeData(item[this.option.valParam]);
            this.props.onSelecteData(item[this.option.keyParam]);
        }
    }

    render() {
        let list = this.selectList;
        return (
            <div className={`selectable-input-cpt ${this.option.className}`}>
                <input
                    className={`${(this.props.iptID != null && this.props.iptID != undefined) ? 'text-primary ' : ''}${this.option.iptClassName}`}
                    onChange={this.handleChangeVal}
                    placeholder={this.option.placeholder}
                    value={this.props.iptValue || ''}/>
                <div className='si-dropdown border border-secondar'
                     style={{display: list.length > 0 ? 'block' : 'none'}}>
                    {list.map((item, index) => (
                        <div key={index} className='si-item' data-value={item[this.option.valParam]}
                             onClick={() => this.handleClickPickItem(item)}>
                            {item[this.option.valParam]}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}