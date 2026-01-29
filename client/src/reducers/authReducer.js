import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SET_ROLE,
  LOGOUT,
  TOKEN_FAIL,
  APP_INITIALISED,
} from "../actions/types";
import setAuthToken from "../utils/setAuthToken";



const initialState = {
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role") || "guest",
  appInitialised: false,
  isAuthenticated: false,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        token: payload.token,
        role: payload.role,
        isAuthenticated: true,
        loading: false,
      };
    case LOGOUT:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setAuthToken(null);
      return {
        ...state,
        isAuthenticated: false,
        role: "guest",
      };
    case TOKEN_FAIL:
      console.log('authReducer -> TOKEN_FAIL ->')
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setAuthToken(null);
      return {
        ...state,
        isAuthenticated: false,
        role: "guest",
      };
    case APP_INITIALISED:
      if ( localStorage.token ) {
        console.log("authReducer -> APP_INITIALISED -> localStorage.token exists");        
        return {
          ...state,
          isAuthenticated: true,
          role: localStorage.getItem("role") || "guest",
          appInitialised: true,
        };
      }
      console.log(
        "authReducer -> APP_INITIALISED -> localStorage.token DOESNT EXIST"
      ); 
      return {
        ...state,
        appInitialised: true,
      };
    case SET_ROLE:
      return {
        ...state,
        role: payload,
      };

    default:
      return state;
  }
}
