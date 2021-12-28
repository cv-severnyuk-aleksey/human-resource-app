import { h, Component } from 'preact';
import Logo from './components/Logo';
import Alert from './components/Alert';
import ListOfResults from './ListOfResults';
import Test from './Test';

class Dashboard extends Component {
  constructor(props) {
    super();
    this.state = {
      showDashboard: true,
      showTest: false,
      showListResult: false,
      user: props.user,
      reload: props.reload
    };
  }

  toggleShow = (targetFrom, targetTo) => {
    this.setState(state => ({ [targetFrom]: !state[targetFrom], [targetTo]: !state[targetTo] }));
  };

  exit = () => {
    sessionStorage.removeItem("token");
    Alert.show('success', 'You have successfully logged out of your account');
    this.state.reload.call(this);
  }

  render() {
    return (
      <div className="Auth">
        {this.state.showDashboard ? (
          <div className="dashboard-page">
            <div className="dashboard-page__content">
              <Logo />
              <div className="dashboard-page__start-button">
                <button className="btn" onClick={() => this.toggleShow('showDashboard', 'showTest')}>Start test</button>
              </div>
              <div className="dashboard-page__text">
                <p>Ensuring and guaranteeing copyright is very important for a distance education platform.</p>
                <p>Click on the “Start test” button, answer the proposed questions and get a result in which we will provide an assessment of copyright compliance in your distance learning platform</p>
              </div>
            </div>
            <div className="dashboard-page__buttons">
              <button className="btn btn__fill" onClick={() => this.toggleShow('showDashboard', 'showListResult')}>List of Results</button>
              <button className="btn btn__unfill" onClick={this.exit}>Exit</button>
            </div>
          </div>
        ) : ''}
        {this.state.showTest ? (
          <Test user={this.state.user} onClick={() => this.toggleShow('showDashboard', 'showTest')} />
        ) : ''}
        {this.state.showListResult ? (
          <ListOfResults user={this.state.user} onClick={() => this.toggleShow('showDashboard', 'showListResult')} />
        ) : ''}
      </div>
    );
  }
}

export default Dashboard;