import React from 'react';
import connect from './connect';

export default loadComponent => {
    class LazyViewLoader extends React.Component {
        componentWillMount() {
            this.state = {};
            loadComponent((c) => {
               this.setState({c: c.default || c});
            });
        }

        render() {
            const {c} = this.state || {};
            if (c) {
                const Component = connect(c);
                return <Component {...this.props} />;
            }
            return (
                <div className="loader">
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
                </div>
            );
        }
    }

    return LazyViewLoader;
};