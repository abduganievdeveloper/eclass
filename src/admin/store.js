
import { createStore } from 'redux';
import {combineReducers} from 'redux';




const LOGIN = 'LOGIN';


export const login = (token) => {
    
    return {
      type: LOGIN,
      token: token
    }
  };
  export const logout = () => {
    
    return {
      type: 'LOGOUT'
    }
  };

export const agChange = (agid,agname) => {
  return {
      type: 'agChange',
      ag: agid,
      agname:agname
    }
};

export const setSubject = (subjects) => {
 
  return {
      type: 'setSubject',
      subjects:subjects
    }
}  



const agReducer = (state={ag:-1,agname:""}, action) => {
    switch (action.type) {
      case 'agChange':
        return {
            ag:action.ag,
            agname:action.agname
        }
      default:
        return state;
    }
  };
  const subjectReducer = (state={subjects:[]}, action) => {
    switch (action.type) {
      case 'setSubject':
        return { 
                subjects:[...state.subjects,action.subjects]
              } 
      default:
        return state;
    }
  };
const loginReducer = (state={token:'a',login:false}, action) => {
  switch (action.type) {
    case LOGIN:
    {
      return {
          token:action.token,
          login:true
      }
    }
    case 'LOGOUT':
    {
      return {
          token:'',
          login:false
      }
    }
    default:
      return state;
  }
  
};
const rootReducer=combineReducers(
    {
        lr:loginReducer,
        agr:agReducer,
        sr:subjectReducer
    });
export const store = createStore(rootReducer);


