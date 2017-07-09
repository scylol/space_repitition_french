import React from "react";
import * as Cookies from "js-cookie";
import { connect } from "react-redux";
import { fetchQuestions, nextQuestion, updateScore } from "../actions/actions";
import LinkedList from "../linkedList";
import './question-page.css'

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
    if (nextProps.questions.length > 0 && this.state.myLinkedList.length === 0 ) {
      nextProps.questions.forEach((question, index) => {
      this.state.myLinkedList.insert(index, question);
      });
    }
  }

  checkAnswer() {
    let linkedlist = this.state.myLinkedList;
    let index = this.state.index;
    let currentQuestion = linkedlist.get(index).question;
    const accessToken = Cookies.get('accessToken');

    if (this.state.value.toLowerCase() === linkedlist.get(index).answer.toLowerCase()) {
      linkedlist.insert(linkedlist.length, linkedlist.get(index));
      this.setState({ index: index + 1 });
      this.props.dispatch(nextQuestion(index + 1, true, 1, 1, currentQuestion));
      this.setState({ value: "" });
    } else {
      linkedlist.insert(index + 3, linkedlist.get(index));
      this.setState({ index: index + 1 });
      this.props.dispatch(nextQuestion(index + 1, false, 0, 1, currentQuestion));
      this.setState({ value: "" });
    }
    this.props.dispatch(updateScore(accessToken));
  }
  
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    if (this.props.questions.length <= 0) {
      return <div />;
    }
    let feedback = (
      <div className = 'feedback'>
          <p>Good Luck Learning the beautiful languange of French!</p>
      </div>
    );

    if (this.props.answeredCorrectly === true) {
      let prevQuestion = this.props.score[this.state.myLinkedList.get(this.state.index - 1).question];
      let score = prevQuestion[0] / prevQuestion[1];
      let prevWord = this.state.myLinkedList.get(this.state.index - 1);
      feedback = (
        <div className = 'feedback'>
          <p>Correct!!! Great Job!</p>
          <p>
            You have answered {prevWord.question} correctly{" "}
            {(score * 100).toFixed(0)}% of the time!
          </p>
         
        </div>
      );
    }
    if (this.props.answeredCorrectly === false) {
      let prevQuestion = this.props.score[ this.state.myLinkedList.get(this.state.index - 1).question];
      let score = prevQuestion[0] / prevQuestion[1];
      let prevWord = this.state.myLinkedList.get(this.state.index - 1);
      feedback = (
        <div className = 'feedback'>
          <p>
            Incorrect!!! The correct answer was {prevWord.answer}!!!
          </p>
          <p>
            You have answered {prevWord.question} correctly{" "}
            {(score * 100).toFixed(0)}% of the time!
          </p>
          
        </div>
      );
    }

    return (
      <div>
      <div className='header'>
        <h1>Welcome back {this.props.currentUser}!!!</h1>
        <a href={'/api/auth/logout'} className='fake-button'>Logout</a>
      </div>
      <div className='main-content'>
        <ul className="question-list">
          <li>{this.state.myLinkedList.get(this.state.index).question}</li>
        </ul>
        {feedback}
        <div className='user-input'>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button className="submit-button" onClick={this.checkAnswer}>
          Submit
        </button>
        
        </div>
        
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
