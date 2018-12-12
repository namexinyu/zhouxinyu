import React from 'react';
import { Modal, Button } from 'antd';
import setParams from 'ACTION/setParams';
class PersonPostMessge extends React.PureComponent {

  render () {
    return (
      < Modal
        title="提示信息"
        visible={this.props.messgeModal}
        onCancel={this.props.handleCancel}
        footer={[
          <Button key="back" onClick={this.props.handleCancel} type='primary'>我知道了</Button>
        ]}
      >
        <p style={{ textAlign: 'center' }}>仙女，请尽快完善该会员7要素。<br />系统可以给你做推荐呢!</p>
      </Modal >
    );
  }
}

export default PersonPostMessge;