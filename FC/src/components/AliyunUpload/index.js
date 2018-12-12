import React from 'react';
import AliSignature from './AliSignature';
import { Upload, Icon, Modal, Input, Alert, Form } from 'antd';
import { clearInterval } from 'timers';

const FormItem = Form.Item;

class PicturesWall extends React.PureComponent {
    constructor(props) {
        super(props);
        this.timer;
    }

    upCount = -1;
    state = {
        visiablePictureDesc: false,
        currentDesc: {},
        previewVisible: false,
        previewDesc: '',
        previewImage: '',
        fileList: this.props.defaultFileList || [],
        sortList: []
    };
    sortList = [];
    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            fileList: nextProps.defaultFileList
        });
    }

    customRequest(o) {
        let client = new AliSignature().clientWrapper({
            bucket: this.props.oss.bucket,
            region: this.props.oss.region
        }).then((client) => {
            let file = o.file;
            client.multipartUpload(this.props.oss.path + ((new Date()).Format('yyyyMMddhhmmss').toString() + Math.ceil(Math.random(1) * 10000)), file, {
                parallel: 4,
                partSize: 1024 * 1024
                // progress: function* (p, cpt) {
                //     console.log(p);
                //     console.log(cpt);
                // }
            }).then((res) => {
                let uid = file.uid;
                let temp = this.state.fileList;
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].uid === uid) {
                        temp[i].status = 'done';
                        temp[i].response = res;
                        if (this.props.enableDesc) {
                            temp[i].desc = this.state.currentDesc[uid];
                        }
                        break;
                    }
                }
                this.setState({
                    fileList: temp
                });
            }, (err) => {
                let uid = file.uid;
                let temp = this.state.fileList;
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].uid === uid) {
                        temp[i].status = 'error';
                        temp[i].error = err;
                        break;
                    }
                }
                this.setState({
                    fileList: temp
                });
                console.log('upload error', err);
            });
        }, () => {

        });
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        if (this.props.previewVisible === false) return;
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewDesc: file.desc || '',
            previewVisible: true
        });
    }

    handleUploadChange = ({ fileList }) => {
        this.setState({ fileList });
        this.props.uploadChange(this.props.id, fileList);
    }
    handleBeforeUpload = (file) => {
        if (this.props.enableDesc) {
            this.setState({
                visiablePictureDesc: true,
                currentFileUid: file.uid
            });
            this.upCount = -1;
            return new Promise((resolve, reject) => {
                this.timer = setInterval(() => {
                    if (this.upCount === 1) {
                        resolve();
                    }
                    if (this.upCount === 0) {
                        reject();
                    }
                }, 500);
            });
        } else {
            return true;
        }
    }
    handleOkDesc = (e) => {
        this.props.form.validateFieldsAndScroll({}, (errors, values) => {
            if (!errors) {
                let od = this.state.currentDesc;
                od[this.state.currentFileUid] = this.props.form.getFieldValue('imgDesc');
                this.setState({
                    visiablePictureDesc: false,
                    currentDesc: od
                });
                this.upCount = 1;
            }
        });
    }
    handleCancelDesc = (e) => {
        this.setState({
            visiablePictureDesc: false
        });
        this.upCount = 0;
    }
    sortBindListener = (e) => {
        if (this.props.enableSort && e.target.className === "ant-upload-list-item-info") {
            let index = parseInt(e.target.getAttribute('sort'), 10);
            let fileList = this.state.fileList;
            let currentFileObj = fileList[index];
            let currentSort = currentFileObj.sort;
            if (currentSort) {
                for (let i = 0; i < this.sortList.length; i++) {
                    if (this.sortList[i].uid === currentFileObj.uid) {
                        this.sortList.splice(i, 1);
                    }
                }

                for (let k = 0; k < fileList.length; k++) {
                    if (fileList[k].sort && fileList[k].sort >= currentSort) {
                        fileList[k].sort = fileList[k].sort - 1;
                    }
                }
                fileList[index].sort = '';
            } else {
                if (this.sortList.length >= this.props.maxUseful) {
                    alert('已经大于最大使用数量');
                } else {
                    currentFileObj.sort = this.sortList.length + 1;
                    fileList[index].sort = this.sortList.length + 1;
                    this.sortList.push(currentFileObj);
                }
            }
            this.setState({
                fileList: fileList,
                sortList: this.sortList
            });
            this.props.uploadChange(this.props.id, fileList);
        }
    }

    componentDidMount() {
        this.translateSort();
    }

    componentDidUpdate() {
        this.translateSort();
    }

    translateSort() {
        this.sortList = [];
        let con = document.getElementById(this.props.id);
        let items = con.getElementsByClassName('ant-upload-list-item');
        if (items.length) {
            for (let i = 0; i < items.length; i++) {
                let fileObj = this.state.fileList[i];
                if (!fileObj || !fileObj.uid) {
                    continue;
                }
                // bind click event
                items[i].removeEventListener('click', this.sortBindListener);
                items[i].addEventListener('click', this.sortBindListener);
                let infoElement = items[i].getElementsByClassName('ant-upload-list-item-info')[0];
                infoElement.setAttribute('sort', i);
                // add sort icon
                let r = document.getElementById(this.props.id + '_fileIcon_' + (fileObj.uid || ''));
                if (r) {
                    let parent = r.parentNode;
                    parent.removeChild(r);
                }
                if (fileObj.sort) {
                    let icon = document.createElement('div');
                    icon.id = this.props.id + '_fileIcon_' + fileObj.uid;
                    icon.style.width = '20px';
                    icon.style.height = '20px';
                    icon.style.borderRadius = '10px';
                    icon.style.background = 'rgba(0, 180, 0, .8)';
                    icon.style.color = '#fff';
                    icon.style.textAlign = 'center';
                    icon.style.lineHeight = '20px';
                    icon.style.fontSize = '14px';
                    icon.style.position = 'absolute';
                    icon.style.bottom = 0;
                    icon.style.right = 0;
                    icon.innerHTML = fileObj.sort;
                    items[i].appendChild(icon);
                    this.sortList.push(fileObj);
                }
            }
            this.sortList = this.sortList.sort((a, b) => a.sort - b.sort);
        }
    }

    render() {
        const { previewDesc, previewVisible, previewImage, fileList } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { enableDesc, disabled } = this.props;
        const uploadButton = disabled ? (<div><div className="ant-upload-text">未上传</div></div>) : (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="clearfix" id={this.props.id}>
                <Upload
                    disabled={this.props.disabled ? true : false}
                    accept={this.props.accept}
                    action={this.props.action}
                    listType={this.props.listType || "picture-card"}
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleUploadChange}
                    customRequest={this.customRequest.bind(this)}
                    beforeUpload={this.handleBeforeUpload}
                    showUploadList={{ showRemoveIcon: disabled ? false : true, showPreviewIcon: true }}
                >
                    {fileList.length >= (this.props.maxNum || 10) ? null : this.props.children ? this.props.children : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    {enableDesc && previewDesc && <p style={{
                        fontSize: '18px',
                        background: 'rgba(255,255,255,.5)',
                        position: 'fixed',
                        top: 0,
                        left: '50%',
                        marginLeft: '-260px',
                        width: '520px',
                        padding: '8px 0 8px 0'
                    }}>{previewDesc}</p>}
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                {this.state.visiablePictureDesc && <div>
                    <Modal visible={true} title="图片描述" onCancel={this.handleCancelDesc}
                        onOk={this.handleOkDesc}>
                        <Form>
                            <FormItem label="图片描述" required>
                                {getFieldDecorator('imgDesc', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入图片描述'
                                        },
                                        {
                                            min: 5,
                                            message: '描述不能少于5个字'
                                        }
                                    ]
                                })(
                                    <Input type="text" autoComplete="off" placeholder="请输入上传图片的描述" />
                                    )}

                            </FormItem>
                        </Form>
                    </Modal>
                </div>}
            </div>
        );
    }
}

export default Form.create({})(PicturesWall);