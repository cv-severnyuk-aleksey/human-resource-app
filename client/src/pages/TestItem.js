import { h, Component } from 'preact';

class TestItem extends Component {
  render(props) {
    const {questions, currentStep, answer} = this.props;
    const {questionText, answers} = questions['q' + currentStep];
    answers.sort((s,r)=>s.answerId>r.answerId?1:s.answerId<r.answerId?-1:0);

    return (
      <div className="testitem">
        <div className="testitem-number">
          Question {currentStep} of {Object.keys(questions).length}
        </div>
        <div className="testitem-question">
          {questionText}
        </div>
        <ul className="testitem-answers">
          {answers.map(item => (
            <li>
              <button className={`btn btn__answer ${answer === item.answerId ? 'btn__answer-check' : ''}`} onClick={() => props.setAnswer(item.answerId)}>{item.answerText}</button>
            </li>
          ))}
        </ul>
        {questions && +currentStep !== Object.keys(questions).length ? (
          <div className="testitem-buttons">
            <button className="btn btn__fill" onClick={() => props.onClick(answer)}>Next</button>
          </div>
        ) : ''}
      </div>
    );
  }
}

export default TestItem;