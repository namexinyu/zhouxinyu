import "SCSS/document/pagination.scss";
import React from 'react';

class Pagination extends React.PureComponent {
    constructor(props) {
        super(props);
        this.options = {
            maxNum: 9
        };
        this.state = {
            currentPage: this.props.initPage || 1,
            inputPage: ''
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.initPage !== this.props.initPage) {
            this.setState({
                currentPage: nextProps.initPage
            });
        }
    }
    shouldComponentUpdate() {
        return true;
    }
    processPageItem(pageSize, totalSize, currentPage) {
        let results1 = [];
        let results2 = [];
        let results3 = [];
        let totalPage = Math.ceil(totalSize / pageSize);
        if (totalPage <= this.options.maxNum) {
            for (let i = 1; i <= totalPage; i++) {
                results2.push(i);
            }
        } else {
            if (currentPage < Math.ceil(this.options.maxNum / 2)) {
                for (let j = 1; j <= this.options.maxNum - 2; j++) {
                    results2.push(j);
                }
                results3 = [totalPage];
            } else if (currentPage >= (totalPage - Math.ceil(this.options.maxNum / 2))) {
                results1 = [1];
                for (let k = totalPage - this.options.maxNum + 3; k <= totalPage; k++) {
                    results2.push(k);
                }
            } else {
                results1 = [1];
                results3 = [totalPage];
                let middle = Math.floor((this.options.maxNum - 4) / 2);
                for (let i = 0; i < this.options.maxNum - 4; i++) {
                    results2.push(currentPage + (i - middle));
                }
            }
        }
        return {
            pageItems: [].concat(results1, results1.length ? ['...'] : [], results2, results3.length ? ['...'] : [], results3),
            totalPage: totalPage,
            totalSize: totalSize
        };

    }

    handleClickPrev() {
        if (this.state.currentPage > 1) {
            let nextPage = this.state.currentPage - 1;
            this.setState({
                currentPage: nextPage
            });
            this.props.afterSelectedPage(nextPage);
        }

    }

    handleClickNext() {
        if (this.state.currentPage < Math.ceil(this.props.totalSize / this.props.pageSize)) {
            let nextPage = this.state.currentPage + 1;
            this.setState({
                currentPage: nextPage
            });
            this.props.afterSelectedPage(nextPage);
        }

    }

    handleClickPage(item) {
        if (typeof item === 'number' && item !== this.state.currentPage) {
            this.setState({
                currentPage: item
            });
            this.props.afterSelectedPage(item);
        }
    }

    handleGoToPage() {
        let nextPage = window.parseInt(this.state.inputPage);
        if (nextPage && typeof nextPage === 'number' && nextPage > 0 && nextPage <= Math.ceil(this.props.totalSize / this.props.pageSize) && nextPage !== this.state.currentPage) {
            this.setState({
                currentPage: nextPage
            });
            this.props.afterSelectedPage(nextPage);
        }
    }

    handleInputChange(e) {
        this.setState({
            inputPage: e.target.value
        });
    }

    render() {
        let pageObj = this.processPageItem(this.props.pageSize, this.props.totalSize, this.state.currentPage);
        return (
            <div className="ivy-pagination">
                <ul className="pagination">
                    <li className="page-item" onClick={() => this.handleClickPrev()}>
                        <span className="page-link">
                            上一页
                        </span>
                    </li>
                    {
                        pageObj.pageItems.map((item, i) => {
                            return (
                                <li className={'page-item' + (this.state.currentPage === item ? ' active' : '')}
                                    key={i}
                                    onClick={() => this.handleClickPage(item)}><span
                                    className={'page-link' + (item === '...' ? ' border-sep' : '')}>{item}</span></li>);
                        })
                    }
                    <li className="page-item" onClick={() => this.handleClickNext()}>
                        <span className="page-link">
                            下一页
                        </span>
                    </li>
                </ul>
                <ul className="pagination">
                    <li className="page-item">
                        <span className="page-link border-none">{pageObj.totalSize}条，共{pageObj.totalPage}页</span>
                    </li>
                    <li className="page-item">
                        <span className="page-link border-none">跳至</span>
                    </li>
                    <li className="page-item">
                        <input type="text" className="form-control jump-page-input"
                               onChange={(e) => this.handleInputChange(e)}/>
                    </li>
                    <li className="page-item">
                        <span className="page-link border-none">页</span>
                    </li>
                    <li className="page-item">
                        <button type="button" className="btn btn-secondary" onClick={() => this.handleGoToPage()}>跳转
                        </button>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Pagination;