import { h, Component } from 'preact';

class Alert extends Component {
  static AlertInstance

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      text: '',
      success: false,
      danger: false
    };
    Alert.AlertInstance = this;
  }

  static show(type, text) {
    Alert.AlertInstance._show(type, text)
  }

  _show(type, text) {
    this.setState({ [type]: true, visible: true, text });
    setTimeout(() => {
      this.setState({ visible: false });
    }, 3000);
    setTimeout(() => {
      this.setState({ [type]: false, text: '' });
    }, 5000);
  }

  render() {
    const { visible, text, success, danger } = this.state;
    const classType = `Alert${success || danger ? ` Alert--${success ? 'success' : 'danger'}` : '' }`;
    return (
      <div className={visible ? `${classType} Alert--show` : classType}>
        {text}
      </div>
    );
  }
}

export default Alert;