import {
  SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE,
  SIGNIN_REQUEST, SIGNIN_SUCCESS, SIGNIN_FAILURE,
  SIGNOUT_REQUEST, SIGNOUT_SUCCESS, SIGNOUT_FAILURE,
  AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE,
} from './allTypes';
import { SERVER_USER } from '../../shared/config';

/****************************************** SIGNUP ******************************************/
const signupRequest = () => {
  return {
    type: SIGNUP_REQUEST
  }
}

const signupSuccess = () => {
  return {
    type: SIGNUP_SUCCESS
  }
}

const signupError = (message) => {
  return {
    type: SIGNUP_FAILURE,
    payload: message
  }
}

const signupUser = (creds) => (dispatch) => {
  dispatch(signupRequest());

  return fetch(`${SERVER_USER}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(creds)
  })
    .then(
      response => {
        if (response.ok) {      // If receive response from server
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      })
    .then(response => response.json())
    .then(response => {
      if (response.success) {   // If server successfully create new user
        dispatch(signupSuccess());
      }
      else {
        var error = new Error('Error ' + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch(error => dispatch(signupError(error.message)));
};

/****************************************** SIGNIN ******************************************/
const signinRequest = () => {
  return {
    type: SIGNIN_REQUEST
  }
}

const signinSuccess = () => {
  return {
    type: SIGNIN_SUCCESS
  }
}

const signinError = (message) => {
  return {
    type: SIGNIN_FAILURE,
    payload: message
  }
}

const signinUser = (creds) => (dispatch) => {
  dispatch(signinRequest());

  return fetch(`${SERVER_USER}/signin`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(creds)
  })
    .then(
      response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      })
    .then(response => response.json())
    .then(response => {
      if (response.success) {
        dispatch(signinSuccess());
      }
      else {
        var error = new Error('Error ' + response.status);
        error.response = response;
        throw error;
      }
    })
    .then(() => dispatch(authUser()))
    .catch(error => dispatch(signinError(error.message)));
};

/****************************************** SIGNOUT *****************************************/
const signoutRequest = () => {
  return {
    type: SIGNOUT_REQUEST
  }
}

const signoutSuccess = () => {
  return {
    type: SIGNOUT_SUCCESS
  }
}

const signoutError = (message) => {
  return {
    type: SIGNOUT_FAILURE,
    payload: message
  }
}

const signoutUser = () => (dispatch) => {
  dispatch(signoutRequest());

  return fetch(`${SERVER_USER}/signout`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(
      response => {
        if (response.ok) {
          dispatch(signoutSuccess(response));
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      })
    .then(() => dispatch(authUser()))
    .catch(error => dispatch(signoutError(error.message)));
}

/******************************************* AUTH *******************************************/
const authRequest = () => {
  return {
    type: AUTH_REQUEST
  }
}

const authSuccess = (creds) => {
  return {
    type: AUTH_SUCCESS,
    payload: creds
  }
}

const authError = (message) => {
  return {
    type: AUTH_FAILURE,
    payload: message
  }
}

const authUser = () => (dispatch) => {
  // const timeout = 1000;
  // const controller = new AbortController();
  // setTimeout(() => controller.abort(), timeout);
  dispatch(authRequest());

  return fetch(`${SERVER_USER}/auth`, {
    method: 'GET',
    credentials: 'include',
    //signal: controller.signal
  })
    .then(
      response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      })
    .then(response => response.json())
    .then(response => {
      if (response.success) {
        dispatch(authSuccess(response));
      }
      else {
        var error = new Error('Error ' + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch(error => dispatch(authError(error.message)));
}

const userActions = {
  signupUser,
  signinUser,
  signoutUser,
  authUser,
}

export default userActions;