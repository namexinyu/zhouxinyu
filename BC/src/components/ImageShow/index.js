import React from 'react';
import {Icon, Modal} from 'antd';

class ImageShow extends React.PureComponent {
    id = new Date().getTime().toString() + Math.random().toString().split('.')[1];
    state = {
        rotate: 0,
        scale: 1,
        rotate2: 0,
        scale2: 1,
        visiable: false
    };

    componentDidMount() {
        this.box = document.getElementById('imageShowBox_' + this.id);
        if (this.box) {
            let boxHeight = this.box.clientHeight;
            let boxWidth = this.box.clientWidth;
            let scale = this.state.scale;
            if (this.state.rotate === 0 || this.state.rotate === 180) {
                let WH = this.translateWH(boxWidth, boxHeight, boxWidth, boxHeight);
                scale = WH.w / boxWidth;

            }
            if (this.state.rotate === 90 || this.state.rotate === 270) {
                let WH = this.translateWH(boxWidth, boxHeight, boxHeight, boxWidth);
                scale = WH.h / boxWidth;
            }
            this.setState({
                scale: scale
            });
        }


    }

    handleRoate() {
        let rotate = this.state.rotate === 270 ? 0 : this.state.rotate + 90;
        let boxHeight = this.box.clientHeight;
        let boxWidth = this.box.clientWidth;
        let scale = this.state.scale;
        if (rotate === 0 || rotate === 180) {
            let WH = this.translateWH(boxWidth, boxHeight, boxWidth, boxHeight);
            scale = WH.w / boxWidth;

        }
        if (rotate === 90 || rotate === 270) {
            let WH = this.translateWH(boxWidth, boxHeight, boxHeight, boxWidth);
            scale = WH.h / boxWidth;

        }
        this.setState({
            rotate: rotate,
            scale: scale
        });
    }

    handleRoateBig() {
        let rotate = this.state.rotate2 === 270 ? 0 : this.state.rotate2 + 90;
        let box = document.getElementById('imageBig_' + this.id);
        let boxHeight = box.clientHeight;
        let boxWidth = box.clientWidth;
        let scale = this.state.scale;
        if (rotate === 0 || rotate === 180) {
            let WH = this.translateWH(boxWidth, boxHeight, boxWidth, boxHeight);
            scale = WH.w / boxWidth;

        }
        if (rotate === 90 || rotate === 270) {
            let WH = this.translateWH(boxWidth, boxHeight, boxHeight, boxWidth);
            scale = WH.h / boxWidth;

        }
        this.setState({
            rotate2: rotate,
            scale2: scale
        });
    }

    translateWH(baseWidth, baseHeight, contentWidth, contentHeight) {
        let resW = contentWidth;
        let resH = contentHeight;
        // box长宽比 > content长宽比
        if (baseWidth / baseHeight > contentWidth / contentHeight) {
            if (contentHeight > baseHeight) {
                resH = baseHeight;
                resW = resH * contentWidth / contentHeight;
            }
        } else {
            if (contentWidth > baseWidth) {
                resW = baseWidth;
                resH = resW * contentHeight / contentWidth;
            }
        }
        return {
            w: resW,
            h: resH
        };
    }

    seeBig() {
        this.setState({
            visiable: true
        });
    }

    viewCancel() {
        this.setState({
            visiable: false
        });
    }

    closeSeeBig() {
        this.setState({
            visiable: false
        });
    }

    windowOpen() {
        window.open(this.props.url, '_blank');
    }

    render() {
        const {url} = this.props;
        return (
            <div style={{width: '100%', height: '100%', position: 'relative'}}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    paddingBottom: '30px',
                    position: 'absolute',
                    background: '#000',
                    top: 0,
                    left: 0
                }}>
                    <div id={'imageShowBox_' + this.id} style={{width: '100%', height: '100%'}}>
                        {url && <div style={{
                            transform: 'rotate(' + this.state.rotate + 'deg) scale(' + this.state.scale + ')',
                            width: '100%',
                            height: '100%',
                            background: 'url(' + this.props.url + ') no-repeat center center',
                            backgroundSize: 'contain'
                        }}/>}
                        {!url && <p style={{fontSize: '16px', marginTop: '30px', color: '#fff'}}>不存在该图片</p>}
                    </div>
                </div>

                <div style={{
                    width: '100%',
                    height: '30px',
                    background: 'rgba(255,255,255,.3)',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    lineHeight: '30px',
                    textAlign: 'center'
                }}>
                    <span style={{position: 'absolute', left: '10px', color: '#fff'}}>{this.props.desc || ''}</span>
                    <Icon type="reload" style={{fontSize: '18px', color: 'rgba(255,255,255,.8)'}}
                          onClick={this.handleRoate.bind(this)}/>
                    <Icon type="eye" style={{fontSize: '20px', color: 'rgba(255,255,255,.8)', marginLeft: '20px'}}
                          onClick={this.seeBig.bind(this)}/>
                    <Icon type="folder-open"
                          style={{fontSize: '20px', color: 'rgba(255,255,255,.8)', marginLeft: '20px'}}
                          onClick={this.windowOpen.bind(this)}/>
                </div>
                {/* {this.state.visiable &&
                    <div data-reactroot>
                        <div id={'imageShowBigBox_' + this.id} style={{ zIndex: 5, width: '100%', height: '100%', position: 'fixed', top: '0', left: '0', overflow: 'hidden', background: 'rgba(0,0,0,.6)' }}>
                            <img src={url} alt="" />
                            <div>

                            </div>
                        </div>
                    </div>} */}
                <Modal
                    visible={this.state.visiable}
                    footer={null}
                    onCancel={this.viewCancel.bind(this)}
                    width="100%"
                    maskStyle={{background: 'rgba(0, 0, 0, .8)'}}
                    style={{position: 'absolute', width: '100%', height: '100vh', top: 0}}
                    bodyStyle={{position: 'fixed', width: '80%', height: '80%', top: '5%', left: '10%'}}>
                    <div id={'imageBig_' + this.id} style={{
                        transform: 'rotate(' + this.state.rotate2 + 'deg) scale(' + this.state.scale2 + ')',
                        width: '100%',
                        height: '100%',
                        background: 'url(' + this.props.url + ') no-repeat center center',
                        backgroundSize: 'contain'
                    }}/>
                    <div style={{
                        width: '100%',
                        height: '40px',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        lineHeight: '40px',
                        textAlign: 'center'
                    }}>
                        <Icon type="reload" style={{fontSize: '30px', color: 'rgba(255,255,255,.8)'}}
                              onClick={this.handleRoateBig.bind(this)}/>
                        <Icon type="close" style={{fontSize: '34px', color: 'rgba(255,255,255,.8)', marginLeft: '60px'}}
                              onClick={this.closeSeeBig.bind(this)}/>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default ImageShow;
