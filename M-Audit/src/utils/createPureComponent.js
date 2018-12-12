import React from 'react';
export default func => {
  return (class PureComponent extends React.PureComponent {
    render() {
      return func(this.props, this.context);
    }
  });
};