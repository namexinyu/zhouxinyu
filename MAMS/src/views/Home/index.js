import React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {

    }
    render() {
        return (
            <div>
                <p id="homeTip">This is the App's home page.</p>
            </div>
        );

    }
}

export default Home;