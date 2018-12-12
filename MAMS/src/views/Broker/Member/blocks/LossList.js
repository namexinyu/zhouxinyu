import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';

export default createPureComponent(({dataList = []}) => {
    return (
        <div className="container-fluid">
            <table className='table table-bordered bg-white text-center'>
                <thead>
                <tr>
                    <th>序号</th>
                    <th>转走机制</th>
                    <th>转走人数</th>
                </tr>
                </thead>
                {dataList.map((loss, index) => {
                    return (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{loss.TurnReason}</td>
                            <td>{loss.TurnNember}</td>
                        </tr>);
                })}
            </table>
        </div>
    );
});