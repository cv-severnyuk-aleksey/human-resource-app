import "./styles.scss";
import { h, render, Component } from 'preact';
import Start from './pages/Start';
import Dashboard from './pages/Dashboard';
import Alert from './pages/components/Alert';

class HRApp extends Component {
  state = {
    loading: true,
    showStart: false,
    showDashboard: false,
    user: null,
  }

  componentDidMount() {
    let headers = {}
    if (sessionStorage.token) {
      headers = { 'Authorization': sessionStorage.token }
    }
    fetch(`${process.env.API}api/echo`, { headers: headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({loading: false, showStart: false, showDashboard: true, user: data.user})
        } else {
          this.setState({loading: false, showStart: true, showDashboard: false, user: null})
        }
      });
  }
  
  toggleShow = (targetFrom, targetTo) => {
    const self = this;
    let headers = {}
    if (sessionStorage.token) {
      headers = { 'Authorization': sessionStorage.token }
    }
    fetch(`${process.env.API}api/echo`, { headers: headers })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({showStart: false, showDashboard: true, user: data.user})
        } else {
          this.setState({showStart: true, showDashboard: false, user: null})
        }
      });
  };
  
  render() {
    const { loading, showStart, showDashboard, user } = this.state;

    return (
      <div className="App">
        { loading ? (
          <div className="App__content">Loading...</div>
        ) : (
          <div className="App__content">
            <Alert />
            {showStart && (<Start reload={this.toggleShow} />)}
            {showDashboard && <Dashboard reload={this.toggleShow} user={user} />}
          </div>
        )}
      </div>
    );

  }
}

render(<HRApp />, document.getElementById('root'));