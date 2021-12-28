import { h, Component } from 'preact';
import Alert from './components/Alert';

class Result extends Component {
  constructor(props) {
    super();
    this.state = {
      questions: props.questions,
      results: props.results || null,
      procent: props.procent || 0,
      badResult: props.badResult || {},
      user: props.user,
      reload: props.reload || null
    };
  }

  componentDidMount() {
    const { results, questions } = this.state;
    let summ = 0;
    let badResult = {};

    if (results) {
      Object.entries(results).forEach(([key, value]) => {
        if (+value === +questions[key].correctAnswerId) {
          summ = summ + 1;
        } else {
          badResult = { 
            ...badResult,
            [key]: value
          };
        }
      });

      this.setState({
        badResult: badResult,
        procent: Math.round((summ / Object.keys(questions).length) * 100)
      })
    }
  }

  save = () => {
    const { user, procent, badResult, reload } = this.state;

    fetch(`${process.env.API}api/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.token,
        },
        body: JSON.stringify({
          user: user,
          procent: procent,
          badResult: badResult,
          date: new Date().getTime()
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          Alert.show('success', 'Your result was saved');
          reload.call();
        } else {
          Alert.show('danger', data.error);
        }
      });
  }

  render(props) {
    const {procent, badResult, questions} = this.state;

    return (
      <div className="result">
        <div className="result__title">Your result</div>
        <div className="result__procent">
          <div className="result__procent__number">
            {procent}%
          </div>
          <div className="result__procent__comment">
            {+procent < 100 ? `Your distance learning platform is ${procent}% copyrighted and guaranteed. In order to fully guarantee the observance of copyright, you should implement the functionality, which is indicated in the questions below.` : 'Your platform for distance education at 100% ensures and guarantees the observance of copyright'}
          </div>
        </div>

        { Object.keys(badResult).length > 0 && (
          <div className="result__bad-questions">
            { Object.entries(badResult).map(([key, value]) => {
              const { answers, questionText } = questions[key];
              answers.sort((s,r)=>s.answerId>r.answerId?1:s.answerId<r.answerId?-1:0);
              return (
                <div className="testitem">
                  <div className="testitem-number">
                    Question {key.substring(1)}
                  </div>
                  <div className="testitem-question">
                    {questionText}
                  </div>
                  <ul className="testitem-answers">
                    {answers.map(item => (
                      <li>
                        <button className={`btn btn__answer ${value === item.answerId ? 'btn__answer-check' : ''}`}>{item.answerText}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }) }
          </div>
        ) }

        { props.isAfterTest && (
          <div className="result__save">
            <button className="btn btn__fill" onClick={this.save}>Save result</button>
          </div>
        ) }
      </div>
    )
  }
}

export default Result;