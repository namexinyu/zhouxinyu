import React from 'react';
import HttpRequest from 'REQUEST';
import transferRequestJSON from './transferRequestJSON';

export default class TestRequestPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            api: 'http://192.168.199.134:8080',
            url: '',
            body: ''
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {
        
    }

    componentWillUnmount() {

    }

    handleSetState(param, val) {
        this.setState(Object.assign({}, this.state, {[param]: val}));
    }

    handleSendRequest() {
        if ((this.state.url || '').length == 0) {
            alert('请填写url');
        }
        let theData = this.state.body;
        theData = theData.replace(/\s|\r|\n/g, '');
        theData = JSON.parse(theData);
        theData = transferRequestJSON(theData);
        
        let options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: theData
        };
        fetch(this.state.api + '/' + this.state.url.trim(), options).then(
            (response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        this.handleSetState('result', JSON.stringify(data));
                        
                    });
                } else {
                    this.handleSetState('result', 'error');
                }

            }, (err) => {
                alert(JSON.stringify(err));
                
            }
        );

    }

    render() {
        return (
            <div className='test-request-view'>
                <form className='ipt-form' style={{margin: '40px 10% 0'}}>
                    <div className='form-group row'>
                        <label className="col-3 col-form-label">
                            请求地址
                        </label>
                        <div className="col-9">
                            <input className="form-control" value={this.state.api}
                                   onClick={(e) => this.handleSetState('api', e.target.value)}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-3 col-form-label">
                            请求url
                        </label>
                        <div className="col-9">
                            <input className="form-control" value={this.state.url}
                                   placeholder="输入请求Url,如BK_XXX/WD_XXX"
                                   onChange={(e) => this.handleSetState('url', e.target.value)}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-3 col-form-label">
                            参数
                        </label>
                        <div className="col-9">
                            <textarea className="form-control" style={{height: '240px'}} value={this.state.body}
                                      placeholder="按JSON格式，输入请求参数"
                                      onChange={(e) => this.handleSetState('body', e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-12 text-center">
                            <button type='button' className="btn btn-sm btn-warning mr-4"
                                    onClick={(e) => this.handleSetState('body', '')}>重置
                            </button>
                            <button type='button' className="btn btn-sm btn-success"
                                    onClick={(e) => this.handleSendRequest()}>发送
                            </button>
                        </div>
                    </div>
                    <div className="form-group row mt-4">
                        <label className="col-12 col-form-label text-center">
                            返回结果
                        </label>
                    </div>
                    <div className="form-group row mt-3">
                        <div style={{minHeight: '300px', wordBreak: 'break-all'}}
                             className="form-control">{this.state.result}</div>
                    </div>
                </form>
            </div>
        );
    }
}