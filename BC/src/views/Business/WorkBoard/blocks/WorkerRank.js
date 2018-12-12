import React from 'react';

class WorkerRank extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ul className='rankingList'>
                    {
                        this.props.LabourScale && this.props.LabourScale.map((item, i) => (
                            <li key={i}>
                                <span className={(i < 3) ? 'active' : ''}>{i + 1}</span>
                                <span>{item.Name}</span>
                                <span>{item.Amount + '人'}</span>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

export default WorkerRank;