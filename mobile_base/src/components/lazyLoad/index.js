import React from 'react';
import {Spin} from 'antd';
import Exception from '../Exception/index';

const LazyLoadComponent = ({isLoading, error}) => {
    if (isLoading) {
        return (
            <div className='loading'
                 style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                <Spin tip="Loading..."/>
            </div>
        );
    } else if (error) {
        return (
            <Exception type="500" style={{minHeight: 500, height: '80%'}} actions={<div/>}
                       desc={process.env.NODE_ENV === 'development' ? error.message : 'Sorry, there was a problem loading the page.'}
            />
        );
    } else {
        return null;
    }
};
export default LazyLoadComponent;