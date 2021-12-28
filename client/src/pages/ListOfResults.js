import { h, Component } from 'preact';
import Logo from './components/Logo';
import Alert from './components/Alert';
import Result from './Result';

class ListOfResults extends Component {
  constructor(props) {
    super();
    this.state = {
      showList: true,
      showResult: false,
      questions: null,
      list: null,
      badResult: {},
      procent: 0,
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

    fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.token,
        },
        body: JSON.stringify({
          user: this.state.user,
        }),
      })
      .then(res => res.json())
      .then(data => {
        self.setState({'list': data.data})
      });
  }

  showResultItem = (index) => {
    this.setState({
      showList: false,
      showResult: true,
      badResult: JSON.parse(this.state.list[index].badResult),
      procent: this.state.list[index].procent
    })
  }

  toggleShow = (targetFrom, targetTo) => {
    this.setState(state => ({ [targetFrom]: !state[targetFrom], [targetTo]: !state[targetTo] }));
  };

  render(props) {

    const {showList, showResult, questions, list, badResult, procent, user} = this.state;

    return (
      <div className="result-page">
        <div className="result-page__content">
          <Logo theme={'dark'} />

          {showList && list ? (
            <ul className="result-page__table">
              <li className="result-page__table-tr result-page__table-header">
                <div className="result-page__table-td">#</div>
                <div className="result-page__table-td">Date</div>
                <div className="result-page__table-td">Result</div>
                <div className="result-page__table-td"></div>
              </li>
              {list.map((item, index) => (
                <li className="result-page__table-tr">
                  <div className="result-page__table-td">{index+1}</div>
                  <div className="result-page__table-td">{new Date(item.date).toLocaleDateString('ru')}</div>
                  <div className="result-page__table-td"><strong>{item.procent}%</strong></div>
                  <div className="result-page__table-td"><button className="btn btn__fill" onClick={() => this.showResultItem(index)}>Show</button></div>
                </li>
              ))}
            </ul>
          ) : ''}

          {showResult && (
            <Result questions={questions} badResult={badResult} procent={procent} isAfterTest={false} user={user} />
          )}
        </div>
        <div className="result-page__buttons">
          {showResult && (
            <button className="btn btn__fill" onClick={() => this.toggleShow('showList', 'showResult')}>List of Results</button>
          )}
          <button className="btn btn__unfill" onClick={props.onClick}>Return to Main</button>
        </div>
      </div>
    );
  }
}

export default ListOfResults;