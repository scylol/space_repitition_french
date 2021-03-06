import React from "react";
import * as Cookies from "js-cookie";
import { connect } from "react-redux";
import { fetchQuestions, nextQuestion, updateScore } from "../actions/actions";
import LinkedList from "../linkedList";
import "./question-page.css";

export class QuestionPage extends React.Component {
  constructor() {
    super();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateScoreinDatabase = this.updateScoreinDatabase.bind(this);
    this.state = {
      myLinkedList: new LinkedList(),
      index: 0,
      value: ""
    };
  }

  componentDidMount() {
    const accessToken = Cookies.get("accessToken");
    this.props.dispatch(fetchQuestions(accessToken));
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.questions.length > 0 &&
      this.state.myLinkedList.length === 0
    ) {
      nextProps.questions.forEach((question, index) => {
        this.state.myLinkedList.insert(index, question);
      });
    }
  }

  updateScoreinDatabase() {
    const accessToken = Cookies.get("accessToken");
    this.props.dispatch(updateScore(accessToken));
  }

  checkAnswer(e) {
    e.preventDefault();
    let linkedlist = this.state.myLinkedList;
    let index = this.state.index;
    let currentQuestion = linkedlist.get(index).question;

    if (
      this.state.value.toLowerCase() ===
      linkedlist.get(index).answer.toLowerCase()
    ) {
      linkedlist.insert(linkedlist.length, linkedlist.get(index));
      this.setState({ index: index + 1 });
      this.props.dispatch(nextQuestion(index + 1, true, 1, 1, currentQuestion));
      this.setState({ value: "" });
    } else {
      linkedlist.insert(index + 3, linkedlist.get(index));
      this.setState({ index: index + 1 });
      this.props.dispatch(
        nextQuestion(index + 1, false, 0, 1, currentQuestion)
      );
      this.setState({ value: "" });
    }
    this.updateScoreinDatabase();
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    if (this.props.questions.length <= 0) {
      return <div />;
    }
    let feedback = (
      <div className="feedback">
        <p>Good Luck learning the beautiful languange of French!</p>
      </div>
    );

    if (this.props.answeredCorrectly === true) {
      let prevQuestion = this.props.score[
        this.state.myLinkedList.get(this.state.index - 1).question
      ];
      let score = prevQuestion[0] / prevQuestion[1];
      let prevWord = this.state.myLinkedList.get(this.state.index - 1);
      feedback = (
        <div className="feedback">
          <p>Correct!!! Great Job!</p>
          <p>
            You have answered {prevWord.question} correctly{" "}
            <b>{(score * 100).toFixed(0)}%</b> of the time!
          </p>
        </div>
      );
    }
    if (this.props.answeredCorrectly === false) {
      let prevQuestion = this.props.score[
        this.state.myLinkedList.get(this.state.index - 1).question
      ];
      let score = prevQuestion[0] / prevQuestion[1];
      let prevWord = this.state.myLinkedList.get(this.state.index - 1);
      feedback = (
        <div className="feedback">
          <p>
            Incorrect!!! The correct answer was <b>{prevWord.answer}</b>!!!
          </p>
          <p>
            You have answered {prevWord.question} correctly{" "}
            <b>{(score * 100).toFixed(0)}%</b> of the time!
          </p>
        </div>
      );
    }

    return (
      <div className="container-div">
        <div className="header">
          <div className="title">
            <h1>Omelette du Fromage</h1>
          </div>
          <div className="greeting-div">
            <h2>
              Welcome back, {this.props.currentUser}!
            </h2>
            <a href={"/api/auth/logout"}>
            <button className="logout-button">Logout</button>
          </a>
          </div>
        </div>
        <div className="main-content">
          {feedback}
          <div className="sub-content">
            <div className="question-list">
              <p className="language">French</p>
              <p className='french-word'>
                {this.state.myLinkedList.get(this.state.index).question}
              </p>
            </div>

            <div className="user-input">
              <p className="language">English</p>
              <form id="myForm">
                <input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </form>
            </div>
          </div>
          <input
            className="submit-button"
            type="submit"
            value="Submit"
            onClick={e => {
              this.checkAnswer(e);
            }}
            form="myForm"
          />
          
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions,
  answeredCorrectly: state.answeredCorrectly,
  score: state.score,
  currentUser: state.currentUser
});

export default connect(mapStateToProps)(QuestionPage);
