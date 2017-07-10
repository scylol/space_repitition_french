import * as Cookies from 'js-cookie';

export const FETCH_QUESTIONS_REQUEST = 'FETCH_QUESTIONS_REQUEST';
export const fetchQuestionsRequest = () => ({
  type: FETCH_QUESTIONS_REQUEST
});

export const FETCH_QUESTIONS_SUCCESS = 'FETCH_QUESTIONS_SUCCESS';
export const fetchQuestionsSuccess = questions => ({
  type: FETCH_QUESTIONS_SUCCESS,
  questions

});

export const FETCH_QUESTIONS_ERROR = 'FETCH_QUESTIONS_ERROR';
export const fetchQuestionsError = error => ({
  type: FETCH_QUESTIONS_ERROR,
  error
});



export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const fetchUserRequest = () => ({
  type: FETCH_USER_REQUEST
});

export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const fetchUserSuccess = user => ({
  type: FETCH_USER_SUCCESS,
  user

});

export const FETCH_USER_ERROR = 'FETCH_USER_ERROR';
export const fetchUserError = error => ({
  type: FETCH_USER_ERROR,
  error
});

export const NEXT_QUESTION = 'NEXT_QUESTION';
export const nextQuestion = (counter,boolean,numerator,denominator,currentQuestion) => ({
  type: NEXT_QUESTION,
  counter,
  boolean,
  numerator,
  denominator,
  currentQuestion
});

export const fetchQuestions = (accessToken) => (dispatch) => {
  dispatch(fetchQuestionsRequest());
  fetch('/api/questions', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }).then(res => {
    if(!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  }).then(data => {
    dispatch(fetchQuestionsSuccess(data));
  }).catch(error => {
    dispatch(fetchQuestionsError(error));
  });
};

export const fetchUser = (accessToken) => (dispatch) => {
  console.log('accessToken', accessToken);
  dispatch(fetchUserRequest());
  fetch('/api/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }).then(res => {
    console.log('RES', res);
    if(!res.ok) {
      if(res.status === 401) {
        Cookies.remove('accessToken');
        return;
      }
      return Promise.reject(res.statusText);
    }
    return res.json();
  }).then(user => {
    console.log(user);
    dispatch(fetchUserSuccess(user));
  }).catch(error => {
    console.log(error);
    dispatch(fetchUserError(error));
  });
  
 
};

export const updateScore = (accessToken) => (dispatch, getState) => {
  const state = getState();
  console.log(state.score);
  fetch(`/api/users/${state.googleId.toString()}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({'score': state.score})
  }).then(res => {
    console.log(res);
    return res.json();
  }).catch(err => {
    console.log(err);
  });
};