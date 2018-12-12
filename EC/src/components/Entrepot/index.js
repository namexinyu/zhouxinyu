import React from 'react';
import {Row, Input, Select, Col} from 'antd';
import "LESS/components/Entrepot.less";
const Option = Select.Option;


class Entrepot extends React.PureComponent {

    constructor(props) {
        super(props);
    }
    componentWillMount() {

    }



    render() {
        return(
            <div style={{display: this.props.dateList.length > 1 ? "block" : "none"}}>
                <Select
                    defaultValue="全部体验中心"
                    style={{ width: 200 }}
                    size="large"
                    onChange={this.props.change}
                >
                    <Option value="">全部体验中心</Option>
                    {
                        (this.props.dateList || []).map((item, index)=>{
                            return(
                                <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                            );
                        })
                    }
                </Select>
            </div>

        );
    }
}

export default Entrepot;