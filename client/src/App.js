import React, { useEffect } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import "./styles/del1.css";
import ShopNavbar from "./components/layout/ShopNavbar";
import AdminNavbar from "./components/layout/AdminNavbar";
import Footer from "./components/layout/Footer";
import setAuthToken from "./utils/setAuthToken";
import { handleAppInit, logout } from "./actions/authActions";
import AuthRoutes from "./modules/auth/AuthRoutes";
import ShopRoutes from "./modules/shop/ShopRoutes";
import AdminRoutes from "./modules/admin/AdminRoutes";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import { CartProvider } from "./context/CartContext";
import apiService from "./services/apiService";

// Git Test

// if (localStorage.token) {
//   setAuthToken(
//     JSON.parse(localStorage.token)
//   );
// }


const Navigation = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { role, isAuthenticated } = useSelector((state) => state.authReducer);
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? (
        <AdminNavbar onLogout={() => dispatch(logout())} />
      ) : (
        <ShopNavbar role={role} onLogout={() => dispatch(logout())} />
      )}
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/products" />} />
        <Route
          path="/auth"
          render={() => {
            if (isAuthenticated && role === "admin") {
              return <Redirect to="/admin/products" />;
            }
            if (isAuthenticated && role === "customer") {
              return <Redirect to="/products" />;
            }
            return <AuthRoutes />;
          }}
        />
        <Route path="/admin" component={AdminRoutes} />
        <Route path="/" component={ShopRoutes} />
      </Switch>
      <Footer />
    </>
  );
};

function App() {
  if (localStorage.token) {
    const token = JSON.parse(localStorage.token);
    setAuthToken(token);
    apiService.setToken(token);
  }
  useEffect(() => {
    store.dispatch(handleAppInit());
  }, []);
  return (
    <Provider store={store}>
      <CartProvider>
        <Router>
          <Navigation />
        </Router>
      </CartProvider>
    </Provider>
  );
}

export default App;
