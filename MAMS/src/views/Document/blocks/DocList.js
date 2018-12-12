import React from 'react';
import getDocList from 'ACTION/Document/getDocList';
import Request from 'REQUEST/index';
import MD5 from 'UTIL/MD5';

class Doc extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        
    }
    handelClickGetDocList() {
        getDocList();
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <button type="button" className="btn btn-danger">Danger</button>
                    </div>
                    <div className="col-md-6 text-center">a</div>
                    <div className="col-md-6 text-center">b</div>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => this.handelClickGetDocList()}>GET DOC LIST</button>
                this is
            </div>
        );
    }
}
export default Doc;