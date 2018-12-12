import React from 'react';
import {Row, Col, Button, Card} from 'antd';
import NeedDo from "./NeedDo";
import HaveDone from "./HaveDone";
import {browserHistory} from 'react-router';
import BrokerAction from 'ACTION/Assistant/BrokerAction';
import QueryParam from 'UTIL/base/QueryParam';
import "LESS/pages/need-do.less";


const getHaveDoneData = BrokerAction.GetHaveDoneList;
const getNeedToDoData = BrokerAction.GetNeedDoList;
let initParams1 = {};
let initParams2 = {};
let chooseTypeArr = [];

function filterObject(obj) {
    let wrapObj = {};
    if (isArray(obj) == "Object") {
        for (let i in obj) {
            if (isArray(obj[i]) == "Array" && obj[i].length == 0 && i == "WaitTypelist") {
                let typeArr = [];
                for (let j = 0; j < chooseTypeArr.length; j++) {
                    typeArr.push(j + 1);
                }
                wrapObj[i] = typeArr;
            } else {
                wrapObj[i] = obj[i];
            }
        }
        return wrapObj;
    }
    return obj;
}

function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}

class NeedDoDetails extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tabState: true
        };
    }

    componentWillMount() {
        this.BrokerID = QueryParam.getQueryParam(window.location.href, 'BrokerID') - 0 || '';
        if (!this.BrokerID) {
            browserHistory.push({pathname: '/ac/board'});
            return;
        }
        initParams1 = Object.assign({}, this.props.needDo.QueryParams);
        initParams2 = Object.assign({}, this.props.havenDone.QueryParams);
        chooseTypeArr = this.props.needDo.chooseTypes || [];
        let param1 = filterObject(initParams1);
        param1.BrokerID = this.BrokerID;
        let param2 = filterObject(initParams2);
        param2.BrokerID = this.BrokerID;
        console.log('param1', param1);
        getNeedToDoData(param1);
        getHaveDoneData(param2);
    }

    render() {
        return (
            <div>
                <div className='ivy-page-title'>
                    <div className="ivy-title"><h1>待办处理</h1></div>
                </div>
                <div className="ivy-tab-line">
                    <div className={this.state.tabState ? "active" : ""} onClick={() => {
                        this.setState({tabState: true});
                    }}>待办事项
                    </div>
                    <div className={!this.state.tabState ? "active" : ""} onClick={() => {
                        this.setState({tabState: false});
                    }}>已办事项
                    </div>
                </div>
                {this.state.tabState ? <NeedDo {...this.props.needDo}/> :
                    <HaveDone {...this.props.havenDone}/>}
            </div>
        );
    }
}


export default NeedDoDetails;
