import 'SCSS/components/dialog.scss';
import React from 'react';
import closeDialog from 'ACTION/Dialog/closeDialog';

let dialogT = {};
let spinnerCount = 0;

class Dialogs extends React.PureComponent {
    shouldComponentUpdate() {
        return true;
    }

    handleCloseDialog(opts, type) {
        if (opts.beforeCloseCall && typeof opts.beforeCloseCall === 'function') {
            if (opts.beforeCloseCall(type)) {
                closeDialog(opts.id);
                opts.afterCloseCall && typeof opts.afterCloseCall === 'function' && opts.afterCloseCall(type);
            }
        } else {
            closeDialog(opts.id);
            opts.afterCloseCall && typeof opts.afterCloseCall === 'function' && opts.afterCloseCall(type);
        }
    }

    renderDialogHtml(item, i) {
        if (item.reOpen && dialogT[item.id]) {
            clearTimeout(dialogT[item.id]);
            delete dialogT[item.id];
        }

        if (item.options.autoClose && !dialogT[item.id]) {
            dialogT[item.id] = setTimeout(() => {
                this.handleCloseDialog(item.options, 'auto');
                delete dialogT[item.id];
            }, item.options.autoClose * 1000);
        }
        let opts = item.options;
        let id = item.id;
        let html = '';
        if (opts.type === 'spinner') {
            html = <div key={i} className={'ivy-dialog-box ' + opts.type}>
                <div className="loader-inner">
                    <div className="loader-line-wrap">
                        <div className="loader-line"></div>
                    </div>
                    <div className="loader-line-wrap">
                        <div className="loader-line"></div>
                    </div>
                    <div className="loader-line-wrap">
                        <div className="loader-line"></div>
                    </div>
                    <div className="loader-line-wrap">
                        <div className="loader-line"></div>
                    </div>
                    <div className="loader-line-wrap">
                        <div className="loader-line"></div>
                    </div>
                </div>
            </div>;
        } else {
            html = <div key={i} className={'ivy-dialog-box ' + opts.type + (opts.theme ? ' ' + opts.theme : '')}>
                {opts.type !== 'toast' &&
                <div className={'ivy-dialog-title' + (opts.titleTheme ? ' ' + opts.titleTheme : '')}>{opts.title}</div>}
                <div className="ivy-dialog-content">{opts.message}</div>
                {opts.type !== 'toast' && <div className={'ivy-dialog-btn ' + opts.type}>
                    {opts.type === 'confirm' && <button type="button"
                                                        className={'btn ivy-dialog-btn-cancel' + (opts.cancelBtnTheme ? ' ' + opts.cancelBtnTheme : '')}
                                                        onClick={() => this.handleCloseDialog(opts, 'cancel')}>{opts.cancelText || '取消'}</button>}
                    <button type="button"
                            className={'btn ivy-dialog-btn-ok' + (opts.okBtnTheme ? ' ' + opts.okBtnTheme : '')}
                            onClick={() => this.handleCloseDialog(opts, 'ok')}>{opts.okText || '确定'}</button>
                </div>}
            </div>;
        }

        return html;
    }

    checkNeedMask(array) {
        for (let i = 0; i < array.length; i++) {
            let c = array[i];
            if (c.options.type === 'confirm' || c.options.type === 'alert' || c.options.type === 'spinner' || c.options.enableOverlay) {
                return true;
            }
        }
        return false;
    }

    render() {
        let dialogs = this.props.items || [];
        if (dialogs.length) {
            return (
                <div className="ivy-dialog">
                    {this.checkNeedMask(dialogs) && <div className="mask"></div>}
                    {
                        dialogs.map((item, i) => {
                            return this.renderDialogHtml(item, i);
                        })
                    }
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Dialogs;
