import React from "react";
import 'SCSS/components/order.scss';


class Order extends React.PureComponent {
    constructor(props) {
        super(props);

    }
    componentWillMount() {

    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

    }
    componentWillUpdate(nextProps) {

    }
    componentDidUpdate() {

    }
    componentWillUnmount() {

    }
    render() {
        return(
            <div className="orderCom">
                <span className="desc" onClick={()=>{this.props.clickOrder("desc");}} style={{borderBottomColor: this.props.order == 1 ? "#17a2b8" : "#aaa"}}></span>
                <span className="asc" onClick={()=>{this.props.clickOrder("asc");}} style={{borderTopColor: this.props.order == 0 ? "#17a2b8" : "#aaa"}}></span>
            </div>
        );
    }
}

export default Order;