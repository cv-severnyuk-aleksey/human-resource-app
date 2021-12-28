import { h, Component } from 'preact';
import Logo from './components/Logo';
import Alert from './components/Alert';

class SignIn extends Component {
  constructor(props) {
    super();
    this.state = {
      email: '',
      password: '',
      reload: props.reload
    };
  }

  enterToDashboard = (e) => {
    const { email, password, reload } = this.state;
    e.preventDefault();

    fetch(`${process.env.API}api/login`, {
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

  render(props) {
    return (
      <div className="signin-page">
        <div className="signin-page__logo">
          <Logo />
        </div>
        <div className="signin-page__form">
          <div className="signin-page__form-container">
            <button className="btn btn--back" onClick={props.onClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1>Sign in</h1>
            <form className="form" onSubmit={this.enterToDashboard}>
              <div className="form__row">
                <label className="form__label">Email address</label>
                <input className="form__input" name="email" type="email" placeholder="Enter Your Email" onInput={(e) => this.setState({'email': e.target.value})} required={true} />
              </div>
              <div className="form__row">
                <label className="form__label">Password</label>
                <input className="form__input" name="password" type="password" placeholder="Enter Your Password" onInput={(e) => this.setState({'password': e.target.value})} required={true} autoComplete={'off'} />
              </div>
              <div className="form__row form__row__submit">
                <input type="submit" value="Login" className="btn btn__fill" />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;