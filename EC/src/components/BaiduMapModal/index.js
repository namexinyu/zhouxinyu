import React from 'react';
import {Modal, Button, Row, Form, Input, Label} from 'antd';
import LazyLoadMap from 'UTIL/BaiduMap/LazyLoadMap';
// import {setInterval} from 'timers';

const FormItem = Form.Item;

class BaiduMapModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: props.initPoi.address,
            searchResult: '',
            address: props.initPoi.address,
            longLat: props.initPoi.longLat
        };
        this.map = '';
        this.defaultCircle = '';
    }

    componentDidMount() {
        LazyLoadMap({needDraw: true}).then(() => {
            this.map = new window.BMap.Map("baiduMap");
            window.cc = this.map;
            // enable mouse scroller
            this.map.enableScrollWheelZoom(true);
            // enable controller component
            let top_left_control = new window.BMap.ScaleControl({anchor: window.BMAP_ANCHOR_TOP_LEFT});
            let top_left_navigation = new window.BMap.NavigationControl();
            this.map.addControl(top_left_control);
            this.map.addControl(top_left_navigation);

            var styleOptions = {
                strokeColor: "purple", // 边线颜色。
                fillColor: "purple", // 填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 1, // 边线的宽度，以像素为单位。
                strokeOpacity: 0.6,	// 边线透明度，取值范围0 - 1。
                fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
                strokeStyle: 'dashed' // 边线的样式，solid或dashed。
            };
            // when did mont have the data. init the map
            let longLat = this.state.longLat;
            if (longLat && longLat.Longitude) {
                longLat = [longLat.Longitude, longLat.Latitude];
                this.map.centerAndZoom(new window.BMap.Point(longLat[0], longLat[1]), 11);
                var marker = new window.BMap.Marker(new window.BMap.Point(longLat[0], longLat[1]));
                this.map.addOverlay(marker);
            } else {
                this.map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11);
            }
        }, () => {
        });
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('mapModal States', nextState);
    }

    handleSearchKeyChange(e) {
        this.setState({
            searchKey: e.target.value
        });
    }

    handleDoSearch() {
        var local = new window.BMap.LocalSearch(this.map, {
            renderOptions: {map: this.map, panel: "mapResult", autoViewport: true},
            onSearchComplete: (results) => {
                if (local.getStatus() == window.BMAP_STATUS_SUCCESS) {
                    // 判断状态是否正确
                    var s = [];
                    for (var i = 0; i < results.getCurrentNumPois(); i++) {
                        s.push(results.getPoi(i));
                    }
                    if (!s.length) {
                        alert('没有找到该关键字的地点！');
                    }
                    this.setState({
                        searchResult: s
                    });
                    console.log(results, s);
                }
            },
            onMarkersSet: (pois) => {
                for (let i = 0; i < pois.length; i++) {
                    pois[i].marker.addEventListener('click', (e) => {
                        this.setState({
                            longLat: {Longitude: pois[i].point.lng, Latitude: pois[i].point.lat},
                            address: pois[i].address
                        });
                    });
                }
            },
            onResultsHtmlSet: (e) => {
                let container = e;
                let lis = container.getElementsByTagName('li') || [];
                for (let i = 0; i < lis.length; i++) {
                    lis[i].addEventListener('click', () => {
                        let item = this.state.searchResult[i];
                        this.setState({
                            longLat: {Longitude: item.point.lng, Latitude: item.point.lat},
                            address: item.address
                        });
                    });
                }
            }
        });
        local.search(this.state.searchKey);
    }

    render() {
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        return (
            <div>
                <Modal
                    title={this.props.title}
                    visible={this.props.visible}
                    onOk={() => this.props.closeModal('ok', {address: this.state.address, longLat: this.state.longLat})}
                    onCancel={() => this.props.closeModal('cancel')}
                    okText="确认"
                    cancelText="取消"
                    width='80%'
                >
                    {this.props.type == 'edit' ? (
                        <Row>
                            <Form layout="inline">
                                <FormItem>
                                    <Input type="text" style={{width: '300px'}} placeholder="请输入位置"
                                           value={this.state.searchKey}
                                           onChange={(e) => this.handleSearchKeyChange(e)}/>
                                </FormItem>
                                <FormItem>
                                    <Button htmlType="button" type="primary"
                                            onClick={() => this.handleDoSearch()}>搜索</Button>
                                </FormItem>
                            </Form>
                        </Row>) : ''}
                    <Row className="mt-24">
                        <div style={{width: this.props.type == 'edit' ? '80%' : '100%', height: '540px', float: 'left'}}
                             id="baiduMap"></div>
                        <div style={{
                            width: this.props.type == 'edit' ? '20%' : '0%',
                            height: '540px',
                            float: 'left',
                            overflowX: 'hidden',
                            overflowY: 'auto'
                        }} id="mapResult"></div>
                    </Row>
                    {this.props.type == 'edit' ? (
                        <Row className="mt-24">
                            <FormItem>
                                <label className="mr-24">当前选择地址:</label>
                                <Input type="text" style={{width: '300px'}} placeholder="尚未选择位置" disabled
                                       value={this.state.address}/>
                            </FormItem>
                        </Row>
                    ) : ''}
                </Modal>
            </div>
        );
    }
}

export default BaiduMapModal;