import React from 'react';
import connect from './connect';
import { Spin } from 'antd';

export default loadComponent => {
    class LazyViewLoader extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        componentWillMount() {
            loadComponent((c) => {
                this.setState({ c: c.default || c });
            });
        }

        render() {
            const { c } = this.state || {};
            if (c) {
                const Component = connect(c);
                return <Component {...this.props} />;
            }
            return (
                <div className="loader">
                    <Spin />
                </div>
            );
        }
    }

    return LazyViewLoader;
};