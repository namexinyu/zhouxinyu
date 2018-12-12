/* global tinymce */
import React from 'react';
import { throttle } from 'throttle-debounce';

import ossConfig from 'CONFIG/ossConfig';

import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";

const IMG_PATH = ossConfig.getImgPath();

import setParams from 'ACTION/setParams';

import {
  message
} from 'antd';

const STATE_NAME = 'state_business_bake';

class TinyEditor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    this.initEditor();
  }

  componentWillUnmount() {
    tinymce.remove();
  }

  initEditor() {    
    var $ = tinymce.dom.DomQuery;
    const _this = this;

    tinymce.init({
      selector: '#j-editor',
      height: 450,
      menubar: false,
      statusbar: false,
      automatic_uploads: true,
      paste_data_images: true,
      image_dimensions: false,
      image_caption: true,
      media_alt_source: false,
      media_dimensions: false,
      convert_urls: false,
      link_assume_external_targets: true,
      indent: '',
      language_url: 'http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/js/tinymce/langs/zh_CN.js',
      content_css: 'http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/js/tinymce/skins/tinymce_content.css',
      external_plugins: {
        autoupload: '//files-10000230.file.myqcloud.com/js/tinymce/plugins/autoupload.min.js'
      },
      plugins: [
        'hr link image textcolor preview',
        'autosave'
      ],
      toolbar1: 'undo redo | fontsizeselect styleselect removeformat | blockquote hr | link unlink | image',
      toolbar2: 'bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | preview',
      fontsize_formats: '12px 14px 16px 18px 20px 24px 36px',
      autosave_prefix: 'tinymce-autosave-{path}-{id}-',
      autosave_interval: '10s',
      file_browser_callback_types: 'image',
      file_browser_callback: (field_name, url, type, win) => {
        this.activeImageInput = win.document.getElementById(field_name);
        this.fileInput.click();
      },
      setup: (editor) => {
        editor.on('init', () => {
          console.log('init', this.props.content);
          tinymce.activeEditor.setContent(this.props.content);
        });

        editor.on('input', throttle(500, function(e) {
          // setParams(STATE_NAME, {
          //   EditorAddingContent: this.getContent()
          // });
          console.log(this.getContent());
          _this.props.onChange(this.getContent());
          // editor.plugins.autosave.storeDraft();
        }));
      }
    });
  }

  handleImageUpload = (e) => {
    e.persist();
    const fileList = e.target.files;

    if (fileList.length) {
      if (!ossConfig.checkImage(fileList[0])) return;
      if (!this.uploader) this.uploader = new AliyunOssUploader();

      this.activeImageInput.value = '请稍等...';
      this.uploader.uploadFile(fileList[fileList.length - 1], (res, error) => {
        if (res) {
          this.activeImageInput.value = IMG_PATH + res.name;
        } else {
            message.info('图片上传失败');
        }
      }, 'web/baike/');
    }
  }
  
  render() {
    return (
      <div>
        <textarea
          id="j-editor"
        />
        <input type="file" ref={input => (this.fileInput = input)} onChange={this.handleImageUpload} style={{display: 'none'}} />
      </div>
    );
  } 
}

export default TinyEditor;