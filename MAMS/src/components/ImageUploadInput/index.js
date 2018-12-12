import React from 'react';
import 'SCSS/components/image-upload-input.scss';
import AliyunOssUploader from 'UTIL/aliyun/AliyunOssUploader';


/*
*   功能描述：输入框控件(用于图片上传，支持图片预览，以及多张图片上传)
*   接受参数如下：
*           1.iptOptions:些默认的配置参数，详见defaultOptions
*           2.onUpload(resInfo):用于完成上传后需要触发的回调函数。其中resInfo结构如下：
*                               {
*                                   dealNum:int,
*                                   successNum:int,
*                                   failNum:int,
*                                   message:string
*                                   resultList:[{url:string,name:string,res:object}]    //阿里云,public时,直接获取url即可
*                               }
*/

let defaultOptions = {
    className: 'col-9', // 外层div的class
    uploadType: 'aliyun-oss', // 上传方式，目前只有阿里云，为方便日后拓展，预留此配置
    isPublic: true, // 若需要存储private文件时,设为false
    width: '80px', // 图片预览宽度
    height: null, // 图片预览高度，默认不穿直接取宽度
    maxNum: 1 // 图片最大上传数量，默认为一张。
};

let matchUploader = (type, isPublic) => {
    switch (type) {
        case 'aliyun-oss':
            return new AliyunOssUploader(isPublic);
        default:
            return new AliyunOssUploader(isPublic);
    }
};


export default class ImageUploadInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.option = Object.assign({}, defaultOptions, props.iptOptions);
        this.uploader = matchUploader(this.option.uploadType, this.option.isPublic);
        this.list = [];
        this.state = {
            previewList: []
        };
        this.client = null;
        this.handleUpload = this.handleUpload.bind(this);
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

    previewFile(elementInput) {
        let files = document.getElementById('ivy-image-input').files;
        this.list = [];
        let notImg = 0;
        
        for (let index = 0; index < files.length && index < this.option.maxNum; index++) {
            let file = files[index];
            
            if (!/^image\/(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(file.type)) {
                ++notImg;
                if (this.list.length + notImg == files.length || this.list.length == this.option.maxNum) {
                    this.list = this.list.sort((a, b) => a.index - b.index);
                    this.setState({previewList: this.list});
                    this.list = [];
                }
                continue;
            }
            let reader = new FileReader();
            reader.addEventListener('load', () => {
                this.list.push({index: index, file: file, src: reader.result});
                if (this.list.length + notImg == files.length || this.list.length == this.option.maxNum) {
                    this.list = this.list.sort((a, b) => a.index - b.index);
                    this.setState({previewList: this.list});
                    this.list = [];
                }
            });
            if (file) reader.readAsDataURL(files[index]);
        }
        if (notImg) {
            // alert('只允许上传图片文件');
            console.log('只允许上传图片文件');
        }
    }

    handleSelectFile(e) {
        document.getElementById('ivy-image-input').click();
    }

    handlePickFile(e) {
        this.previewFile(e.target);
    }

    handleUpload() {
        let callback = (resInfo) => {
            
            this.setState({previewList: []});
            if (typeof (this.props.onUpload) == 'function') this.props.onUpload(resInfo);
        };
        this.uploader.upload(this.state.previewList.map((item) => item.file), callback);
    }


    render() {
        let option = this.option;
        let previewList = this.state.previewList;
        // 
        // 
        return (
            <div className={`image-upload-input-cpt ${option.className}`}>
                <div className='preview-div'>
                    {previewList.map((item, index) => {
                        return (
                            <div key={index} style={{width: option.width, height: option.height || option.width}}
                                 className='image-add-div mb-4'>
                                {item.src ? (<img src={item.src}/>) : ''}
                            </div>);
                    })}
                </div>
                <div className='btn-div'>
                    <input id='ivy-image-input' multiple="multiple" type='file' className='hidden'
                           onChange={(e) => this.handlePickFile(e)}/>
                    <button type='button' className='btn btn-sm btn-primary mr-4'
                            onClick={(e) => this.handleSelectFile(e)}>
                        选择文件
                    </button>
                    <button type='button' style={previewList.length == 0 ? {display: 'none'} : {}}
                            onClick={this.handleUpload}
                            className='btn btn-sm btn-success'>上传
                    </button>
                </div>
            </div>
        );
    }
}