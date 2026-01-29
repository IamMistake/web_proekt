import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { login, registerCustomer } from "../../actions/authActions";

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^(\+389)?\s?\d{2}\s?\d{3}\s?\d{3}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

const AuthScreen = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.authReducer);

  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "customer",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    surName: "",
    tel1: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  if (isAuthenticated && role === "admin") {
    return <Redirect to="/admin/products" />;
  }

  if (isAuthenticated && role === "customer") {
    return <Redirect to="/products" />;
  }

  const validateLogin = () => {
    const nextErrors = {};
    if (!emailRegex.test(loginData.email)) {
      nextErrors.loginEmail = "Внесете валидна е-пошта.";
    }
    if (!passwordRegex.test(loginData.password)) {
      nextErrors.loginPassword = "Лозинката мора да има минимум 6 карактери и број.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateRegister = () => {
    const nextErrors = {};
    if (registerData.name.trim().length < 2) {
      nextErrors.name = "Името е задолжително.";
    }
    if (registerData.surName.trim().length < 2) {
      nextErrors.surName = "Презимето е задолжително.";
    }
    if (!emailRegex.test(registerData.email)) {
      nextErrors.email = "Внесете валидна е-пошта.";
    }
    if (!passwordRegex.test(registerData.password)) {
      nextErrors.password = "Лозинката мора да има минимум 6 карактери и број.";
    }
    if (registerData.tel1 && !phoneRegex.test(registerData.tel1)) {
      nextErrors.tel1 = "Телефонскиот формат е невалиден.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (!validateLogin()) {
      return;
    }
    dispatch(login(loginData));
  };

  const handleRegister = (event) => {
    event.preventDefault();
    if (!validateRegister()) {
      return;
    }
    dispatch(registerCustomer(registerData));
  };

  const passwordStrength = (() => {
    let score = 0;
    if (registerData.password.length >= 8) score += 30;
    if (/[A-Z]/.test(registerData.password)) score += 20;
    if (/[0-9]/.test(registerData.password)) score += 20;
    if (/[^A-Za-z0-9]/.test(registerData.password)) score += 30;
    return score;
  })();

  const strengthVariant = passwordStrength < 40 ? "bg-danger" : passwordStrength < 70 ? "bg-warning" : "bg-success";

  return (
    <div className="container-main">
      <div className="card-soft auth-card">
        <ul className="nav nav-tabs mb-3" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "login" ? "active" : ""}`}
              type="button"
              onClick={() => setActiveTab("login")}
            >
              Најава
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "register" ? "active" : ""}`}
              type="button"
              onClick={() => setActiveTab("register")}
            >
              Регистрација
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div className={`tab-pane fade ${activeTab === "login" ? "show active" : ""}`} id="login">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Е-пошта</label>
                <input
                  type="email"
                  className="form-control"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
                {errors.loginEmail && <small className="text-danger">{errors.loginEmail}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Лозинка</label>
                <input
                  type="password"
                  className="form-control"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                {errors.loginPassword && <small className="text-danger">{errors.loginPassword}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Тип на корисник</label>
                <select
                  className="form-select"
                  value={loginData.role}
                  onChange={(e) => setLoginData({ ...loginData, role: e.target.value })}
                >
                  <option value="customer">Купувач</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
              <button className="btn btn-primary">Најави се</button>
            </form>
          </div>

          <div className={`tab-pane fade ${activeTab === "register" ? "show active" : ""}`} id="register">
            <form onSubmit={handleRegister}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Име</label>
                  <input
                    type="text"
                    className="form-control"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  />
                  {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Презиме</label>
                  <input
                    type="text"
                    className="form-control"
                    value={registerData.surName}
                    onChange={(e) => setRegisterData({ ...registerData, surName: e.target.value })}
                  />
                  {errors.surName && <small className="text-danger">{errors.surName}</small>}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Телефон</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+389 70 123 456"
                  value={registerData.tel1}
                  onChange={(e) => setRegisterData({ ...registerData, tel1: e.target.value })}
                />
                {errors.tel1 && <small className="text-danger">{errors.tel1}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Е-пошта</label>
                <input
                  type="email"
                  className="form-control"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Лозинка</label>
                <input
                  type="password"
                  className="form-control"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
                <div className="progress mt-2" style={{ height: 8 }}>
                  <div
                    className={`progress-bar ${strengthVariant}`}
                    role="progressbar"
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
              <button className="btn btn-primary">Регистрирај се</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
