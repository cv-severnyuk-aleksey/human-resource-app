import { h, Component } from 'preact';
import Logo from './components/Logo';
import Alert from './components/Alert';
import TestItem from './TestItem';
import Result from './Result';

class Test extends Component {
  constructor(props) {
    super();
    this.state = {
      showQuestions: true,
      showResult: false,
      questions: null,
      answer: null,
      currentStep: 1,
      results: [],
      user: props.user
    };
  }

  componentDidMount() {
    const self = this;
    fetch('/api/qa', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.token,
        },
      })
      .then(res => res.json())
      .then(data => {
        self.setState({questions: data.data})
      });
  }

  setAnswer = (id) => {
    this.setState(state => ({ answer: id }));
  }

  next = () => {
    if (this.state.answer) {
      this.setState({ 
        results: {
          ...this.state.results,
          ['q' + this.state.currentStep]: this.state.answer,
        },
        currentStep: this.state.currentStep + 1,
        answer: null
      });
    } else {
      Alert.show('danger', 'Please answer the question');
    }
  }

  done = () => {
    if (this.state.answer) {
      this.setState({ 
        results: {
          ...this.state.results,
          ['q' + this.state.currentStep]: this.state.answer,
        },
        showQuestions: false,
        showResult: true,
        answer: null
      });
    } else {
      Alert.show('danger', 'Please answer the question');
    }
  }

  render(props) {
    const {showQuestions, showResult, questions, currentStep, answer, results, user} = this.state;

    return (
      <div className="result-page">
        <div className="result-page__content">
          <Logo theme={'dark'} />

          {showQuestions && questions ? (
            <TestItem questions={questions} currentStep={currentStep} answer={answer} setAnswer={this.setAnswer} onClick={this.next} />
          ) : ''}
          {showResult && (
            <Result questions={questions} results={results} isAfterTest={true} user={user} reload={props.onClick} />
          )}
        </div>
        <div className="result-page__buttons">
          <button className="btn btn__unfill" onClick={props.onClick}>Return to Main</button>
          {showQuestions && questions && +currentStep === Object.keys(questions).length ? (
            <button className="btn btn__fill" onClick={() => this.done()}>Get Result</button>
          ) : ''}
        </div>
      </div>
    );
  }
}

export default Test;