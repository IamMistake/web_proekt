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
import apiService from "../services/apiService";


// Login User
export const login = ({ role, email, password }) => async dispatch => {
  const body = { email, password };

  try {
    const res = role === "admin"
      ? await apiService.adminLogin(body)
      : await apiService.customerLogin(body);

    const storedRole = role || (localStorage.getItem("role") || "guest");
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token: res.data.token, role: storedRole },
    });
    localStorage.setItem("token", JSON.stringify(res.data.token));
    localStorage.setItem("role", storedRole);
    setAuthToken(res.data.token);
    apiService.setToken(res.data.token);
  } catch (err) {
    const errors = err.response?.data?.errors;
    if (errors) {
      console.log("Client -> authActions -> login errors ->", errors);
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

// Register Customer
export const registerCustomer = ({ email, password, name, surName, tel1 }) => async dispatch => {
  try {
    const res = await apiService.customerRegister({
      email,
      password,
      name,
      surName,
      tel1,
    });
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { token: res.data.token, role: "customer" },
    });
    localStorage.setItem("token", JSON.stringify(res.data.token));
    localStorage.setItem("role", "customer");
    setAuthToken(res.data.token);
    apiService.setToken(res.data.token);
  } catch (err) {
    const errors = err.response?.data?.errors;
    if (errors) {
      console.log("Client -> authActions -> register errors ->", errors);
    }
    dispatch({ type: REGISTER_FAIL });
  }
};

// Logout
export const logout = () => (dispatch) => {
  localStorage.removeItem("role");
  apiService.setToken(null);
  dispatch({ type: LOGOUT });
};

// Handle Token Fail
export const handleTokenFail = () => (dispatch) => {
  dispatch({ type: TOKEN_FAIL });
};

// Handle App Init
export const handleAppInit = () => (dispatch) => {
  dispatch({ type: APP_INITIALISED });
};

export const setRole = (role) => (dispatch) => {
  dispatch({ type: SET_ROLE, payload: role });
};
