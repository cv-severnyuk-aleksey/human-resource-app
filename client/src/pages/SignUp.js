import { h, Component } from 'preact';
import Logo from './components/Logo';
import Alert from './components/Alert';

class SignUp extends Component {
  constructor(props) {
    super();
    this.state = {
      email: '',
      password: '',
      confirm: '',
      reload: props.reload
    };
  }

  login = () => {
    const { email, password, reload } = this.state;

    fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.accessToken) {
          sessionStorage.setItem("token", data.accessToken);
          Alert.show('success', 'Authorization was successful');
          reload.call();
        } else {
          Alert.show('danger', data.error);
        }
      });
  }

  registration = (e) => {
    const { email, password, confirm } = this.state;
    const self = this;
    e.preventDefault();

    if (password !== confirm) {
      Alert.show('danger', 'The passwords specified must be identical');
    } else {
      fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: email,
            email: email,
            password: password,
          }),
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            Alert.show('success', 'Your account has been created');
            self.login();
          } else {
            Alert.show('danger', data.error);
          }
        });
    }
  }

  render(props) {
    return (
      <div className="signup-page">
        <div className="signup-page__logo">
          <Logo />
        </div>
        <div className="signup-page__form">
          <div className="signup-page__form-container">
            <button className="btn btn--back" onClick={props.onClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1>Sign up</h1>
            <form className="form" onSubmit={this.registration}>
              <div className="form__row">
                <label className="form__label">Email address</label>
                <input className="form__input" name="email" type="email" placeholder="Enter Your Email" onInput={(e) => this.setState({'email': e.target.value})} required={true} autoComplete={'off'} />
              </div>
              <div className="form__group">
                <div className="form__row">
                  <label className="form__label">Password</label>
                  <input className="form__input" name="password" type="password" placeholder="Enter Your Password" onInput={(e) => this.setState({'password': e.target.value})} required={true} autoComplete={'off'} />
                </div>
                <div className="form__row">
                  <label className="form__label">Confirm Password</label>
                  <input className="form__input" name="confirm" type="password" placeholder="Enter Your Password" onInput={(e) => this.setState({'confirm': e.target.value})} required={true} autoComplete={'off'} />
                </div>
              </div>
              <div className="form__row form__row__submit">
                <input type="submit" value="Submit" className="btn btn__fill" />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;