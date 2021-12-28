import { h, Component } from 'preact';
import Logo from './components/Logo';
import SignIn from './SignIn';
import SignUp from './SignUp';

class Start extends Component {
  constructor(props) {
    super();
    this.state = {
      showStart: true,
      showSignIn: false,
      showSignUp: false,
      reload: props.reload
    };
  }

  toggleShow = (targetFrom, targetTo) => {
    this.setState(state => ({ [targetFrom]: !state[targetFrom], [targetTo]: !state[targetTo] }));
  };

  render() {
    return (
      <div className="noAuth">
        {this.state.showStart ? (
          <div className="start-page">
            <div className="start-page__content">
              <Logo />
            </div>
            <div className="start-page__buttons">
              <button className="btn btn__fill" onClick={() => this.toggleShow('showStart', 'showSignIn')}>Sign In</button>
              <button className="btn btn__unfill" onClick={() => this.toggleShow('showStart', 'showSignUp')}>Sign Up</button>
            </div>
          </div>
        ) : ''}
        {this.state.showSignIn ? (
          <SignIn onClick={() => this.toggleShow('showSignIn', 'showStart')} reload={this.state.reload}/>
        ) : ''}
        {this.state.showSignUp ? (
          <SignUp onClick={() => this.toggleShow('showSignUp', 'showStart')} reload={this.state.reload} />
        ) : ''}
      </div>
    );
  }
}

export default Start;